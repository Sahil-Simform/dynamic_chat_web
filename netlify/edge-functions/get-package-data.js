// filepath: /Users/sahil.t/StudioProjects/dynamic_chat_web/netlify/edge-functions/get-package-data.js
// MANUAL TOGGLE: Set to true for production mode, false for local development mode
const FORCE_PRODUCTION_MODE = true;

// The namespace used by the scheduled function
const NAMESPACE = 'package-scores';

// Simple in-memory cache for local development
const localCache = {
  data: {
    'package-data': JSON.stringify({
      'flutter': {
        grantedPoints: 150,
        maxPoints: 160,
        likeCount: 2817,
        downloadCount30Days: 156194,
        tags: [
          'publisher:simform.com',
          'sdk:flutter',
          'platform:android',
          'platform:ios',
          'platform:windows',
          'platform:linux',
          'platform:macos',
          'platform:web',
          'is:null-safe',
          'is:wasm-ready',
          'is:dart3-compatible',
          'license:mit',
          'license:fsf-libre',
          'license:osi-approved'
        ],
        lastUpdated: '2025-04-24T20:09:55.534241'
      }
    }),
    'last-updated': JSON.stringify(new Date().toISOString())
  }
};

export default async (request, context) => {
  try {
    // Parse the URL to get the package name
    const url = new URL(request.url);
    const packageName = url.searchParams.get('package');
    
    // Log available context for debugging
    console.log(`Available context keys: ${Object.keys(context).join(', ')}`);
    if (context.env) {
      console.log(`Available env keys: ${Object.keys(context.env).join(', ')}`);
    }
    
    let data;
    let lastUpdated;
    let kvAccessMethod = 'none';
    
    try {
      console.log('Attempting to access Netlify Edge KV Storage');
      
      // Try several different ways to access KV storage based on the context
      let kv = null;
      
      // Method 1: Try to get KV from context directly (binding in netlify.toml)
      if (context.KV) {
        console.log('Found KV in context.KV');
        kv = context.KV;
      }
      // Method 2: Try from context.env
      else if (context.env && context.env.KV) {
        console.log('Found KV in context.env.KV');
        kv = context.env.KV;
      }
      // Method 3: Try older netlify edge context pattern
      else if (context.site && context.site.kv) {
        console.log('Found KV in context.site.kv');
        kv = context.site.kv;
      }
      // Method 4: Try via global Netlify object
      else if (typeof Netlify !== 'undefined' && Netlify.env && Netlify.env.get) {
        console.log('Using global Netlify.env.get("KV")');
        kv = Netlify.env.get("KV");
      }
      
      if (kv) {
        console.log('Successfully obtained KV namespace');
        
        // Try with both namespaced and non-namespaced keys
        let keys = [];
        if (packageName) {
          keys = [
            `${NAMESPACE}:package-${packageName}`,
            `package-${packageName}`,
            `package-scores/package-${packageName}`
          ];
        } else {
          keys = [
            `${NAMESPACE}:package-data`,
            `package-data`,
            `package-scores/package-data`
          ];
        }
        
        // Try each key until we find data
        for (const key of keys) {
          console.log(`Trying to access key: ${key}`);
          data = await kv.get(key);
          
          if (data !== null && data !== undefined) {
            console.log(`Found data using key: ${key}`);
            kvAccessMethod = `kv-with-key-${key}`;
            break;
          }
        }
        
        // Try each key for last updated
        if (data) {
          const updateKeys = [
            `${NAMESPACE}:last-updated`,
            `last-updated`,
            `package-scores/last-updated`
          ];
          
          for (const key of updateKeys) {
            lastUpdated = await kv.get(key);
            if (lastUpdated !== null && lastUpdated !== undefined) {
              break;
            }
          }
        }
        
        if (!data) {
          throw new Error('No data found in KV store with any key pattern');
        }
      } else {
        throw new Error('KV namespace not available in Netlify environment');
      }
    } catch (kvError) {
      console.error(`KV store access error: ${kvError.message}`);
      console.log('Falling back to in-memory cache due to KV access error');
      
      // Access the in-memory cache
      if (packageName) {
        const allData = JSON.parse(localCache.data['package-data'] || '{}');
        data = allData[packageName] ? JSON.stringify(allData[packageName]) : null;
      } else {
        data = localCache.data['package-data'];
      }
      
      lastUpdated = localCache.data['last-updated'];
      kvAccessMethod = 'localCacheFallback';
    }
    
    // Handle case with no data found
    if (!data) {
      return new Response(JSON.stringify({ 
        error: packageName ? 'Package not found' : 'No data available',
        note: 'Data might not be populated yet by the scheduled function',
        accessMethod: kvAccessMethod
      }), {
        status: packageName ? 404 : 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
    }
    
    // Handle different KV response formats
    // Some KV implementations return { value: data }, others return data directly
    if (data && typeof data === 'object' && data.value !== undefined) {
      data = data.value;
    }
    if (lastUpdated && typeof lastUpdated === 'object' && lastUpdated.value !== undefined) {
      lastUpdated = lastUpdated.value;
    }
    
    // Parse the data if needed
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (parseError) {
        console.log('Failed to parse data as JSON, returning as string');
      }
    }
    
    // Parse lastUpdated if needed
    if (typeof lastUpdated === 'string') {
      try {
        lastUpdated = JSON.parse(lastUpdated);
      } catch (parseError) {
        console.log('Failed to parse lastUpdated as JSON, using as is');
      }
    }
    
    return new Response(JSON.stringify({
      data,
      lastUpdated,
      environment: 'production',
      accessMethod: kvAccessMethod
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60' // Cache for 1 minute
      }
    });
  } catch (error) {
    console.error(`Error serving package data: ${error.message}`);
    return new Response(JSON.stringify({ 
      error: 'Failed to retrieve package data',
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};