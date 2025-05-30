// filepath: /Users/sahil.t/StudioProjects/dynamic_chat_web/netlify_functions/storage.js
const { getStore } = require('@netlify/blobs');
const { FORCE_PRODUCTION_MODE, MANUAL_NETLIFY_CONFIG, DEFAULT_PACKAGES, DEFAULT_REPO_MAPPINGS } = require('./config');

// In-memory store for local development
const localStore = {
  data: {
    'package-list': JSON.stringify(DEFAULT_PACKAGES),
    'package-data': JSON.stringify({}),
    'repo-mappings': JSON.stringify(DEFAULT_REPO_MAPPINGS),
    'last-updated': JSON.stringify(new Date().toISOString())
  },
  get: async function(key) {
    return this.data[key] || null;
  },
  set: async function(key, value) {
    this.data[key] = value;
    return true;
  }
};

// The namespace to use for package data - must match edge function
const NAMESPACE = 'package-scores';

/**
 * Gets the blob store instance with proper authentication
 */
function getStoreInstance() {
  try {
    // Check if we should force production mode based on the manual toggle
    const isNetlify = FORCE_PRODUCTION_MODE || 
      process.env.NETLIFY === 'true' || 
      Boolean(process.env.DEPLOY_URL) ||
      Boolean(process.env.SITE_ID);
    
    // Log the detected environment
    console.log(`Environment detection - isNetlify: ${isNetlify} (FORCE_PRODUCTION_MODE: ${FORCE_PRODUCTION_MODE})`);
    
    if (isNetlify) {
      console.log('Using Netlify KV store in production environment');
      try {
        // IMPORTANT: Make sure we have the required auth properties
        const siteID = process.env.SITE_ID || MANUAL_NETLIFY_CONFIG.siteID;
        const token = process.env.NETLIFY_AUTH_TOKEN || MANUAL_NETLIFY_CONFIG.token;
        
        if (!siteID) {
          throw new Error('Missing siteID for Netlify Blobs');
        }
        
        // Build store options with explicit authentication
        const storeOptions = {
          name: 'package-scores',
          siteID: siteID
        };
        
        // Add token if available
        if (token) {
          storeOptions.token = token;
          console.log('Using auth token for Netlify Blobs API');
        } else {
          console.warn('No auth token provided for Netlify Blobs API');
        }
        
        console.log(`Creating store with siteID: ${storeOptions.siteID}`);
        return getStore(storeOptions);
      } catch (storeError) {
        console.error(`Failed to create Netlify store: ${storeError.message}`);
        console.warn('Falling back to in-memory store');
        return localStore;
      }
    } else {
      // Use in-memory store for local development
      console.log('Using in-memory store for local development');
      return localStore;
    }
  } catch (error) {
    console.warn('Failed to get Netlify store, falling back to in-memory store:', error.message);
    return localStore;
  }
}

/**
 * Gets the list of packages to track
 */
async function getPackageList() {
  try {
    const store = getStoreInstance();
    const data = await store.get('package-list');
    return data ? JSON.parse(data) : DEFAULT_PACKAGES;
  } catch (error) {
    console.error(`Error getting package list: ${error.message}`);
    return DEFAULT_PACKAGES;
  }
}

/**
 * Updates the list of packages to track
 */
async function updatePackageList(packages) {
  try {
    const store = getStoreInstance();
    await store.set('package-list', JSON.stringify(packages));
    return true;
  } catch (error) {
    console.error(`Error updating package list: ${error.message}`);
    return false;
  }
}

/**
 * Saves package data to storage
 */
async function savePackageData(data) {
  try {
    const store = getStoreInstance();
    
    // Store the entire result object
    await store.set('package-data', JSON.stringify(data));
    
    // Also store each package separately for individual access
    for (const [pkg, pkgData] of Object.entries(data)) {
      await store.set(`package-${pkg}`, JSON.stringify(pkgData));
      
      // Add version with namespace prefixing for edge function compatibility
      await store.set(`${NAMESPACE}:package-${pkg}`, JSON.stringify(pkgData));
    }
    
    // Store the timestamp of last update
    await store.set('last-updated', JSON.stringify(new Date().toISOString()));
    
    // Add version with namespace prefixing for edge function compatibility
    await store.set(`${NAMESPACE}:package-data`, JSON.stringify(data));
    await store.set(`${NAMESPACE}:last-updated`, JSON.stringify(new Date().toISOString()));
    
    return true;
  } catch (error) {
    console.error(`Error saving package data: ${error.message}`);
    return false;
  }
}

/**
 * Gets all package data
 */
async function getAllPackageData() {
  try {
    const store = getStoreInstance();
    const data = await store.get('package-data');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error(`Error getting all package data: ${error.message}`);
    return {};
  }
}

/**
 * Gets data for a specific package
 */
async function getPackageData(packageName) {
  try {
    const store = getStoreInstance();
    const data = await store.get(`package-${packageName}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting data for ${packageName}: ${error.message}`);
    return null;
  }
}

/**
 * Gets the GitHub repository mappings
 */
async function getRepoMappings() {
  try {
    const store = getStoreInstance();
    const data = await store.get('repo-mappings');
    // Initialize with default mappings if not found
    return data ? JSON.parse(data) : DEFAULT_REPO_MAPPINGS;
  } catch (error) {
    console.error(`Error getting repo mappings: ${error.message}`);
    return DEFAULT_REPO_MAPPINGS;
  }
}

/**
 * Updates the GitHub repository mappings
 */
async function updateRepoMappings(mappings) {
  try {
    const store = getStoreInstance();
    await store.set('repo-mappings', JSON.stringify(mappings));
    return true;
  } catch (error) {
    console.error(`Error updating repo mappings: ${error.message}`);
    return false;
  }
}

/**
 * Saves GitHub data for packages and merges it with existing package data
 */
async function saveGithubData(githubData, currentPackageData) {
  try {
    const store = getStoreInstance();
    
    // Store the GitHub data separately
    await store.set('github-data', JSON.stringify(githubData));
    await store.set(`${NAMESPACE}:github-data`, JSON.stringify(githubData));
    
    // Merge GitHub data with existing package data
    const mergedData = { ...currentPackageData };
    
    for (const [pkg, ghData] of Object.entries(githubData)) {
      if (mergedData[pkg]) {
        // Merge GitHub data with existing package data
        mergedData[pkg] = { 
          ...mergedData[pkg], 
          github: ghData
        };
        
        // Save the updated individual package data
        await store.set(`package-${pkg}`, JSON.stringify(mergedData[pkg]));
        await store.set(`${NAMESPACE}:package-${pkg}`, JSON.stringify(mergedData[pkg]));
      }
    }
    
    // Update the full package data with merged GitHub information
    await store.set('package-data', JSON.stringify(mergedData));
    await store.set(`${NAMESPACE}:package-data`, JSON.stringify(mergedData));
    
    // Update the timestamp
    const timestamp = new Date().toISOString();
    await store.set('github-last-updated', JSON.stringify(timestamp));
    await store.set(`${NAMESPACE}:github-last-updated`, JSON.stringify(timestamp));
    
    return true;
  } catch (error) {
    console.error(`Error saving GitHub data: ${error.message}`);
    return false;
  }
}

/**
 * Gets GitHub data for all packages
 */
async function getGithubData() {
  try {
    const store = getStoreInstance();
    const data = await store.get('github-data');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error(`Error getting GitHub data: ${error.message}`);
    return {};
  }
}

module.exports = {
  getPackageList,
  updatePackageList,
  savePackageData,
  getAllPackageData,
  getPackageData,
  saveGithubData,
  getGithubData,
  getRepoMappings,
  updateRepoMappings
};