import { getStore } from '@netlify/blobs';

const NAMESPACE = 'package-scores';

async function getPackageData(packageName) {
  const store = getStore({ name: NAMESPACE });
  const raw = await store.get(`package-${packageName}`);
  return raw ? JSON.parse(raw) : null;
}

async function getGithubData(packageName) {
  const store = getStore({ name: NAMESPACE });
  const raw = await store.get(`github-data`);
  if (raw) {
    const githubData = JSON.parse(raw);
    return githubData[packageName] || null;
  }
  return null;
}

async function getAllPackageData() {
  const store = getStore({ name: NAMESPACE });
  const raw = await store.get('package-data');
  return raw ? JSON.parse(raw) : {};
}

async function getLastUpdated() {
  const store = getStore({ name: NAMESPACE });
  const raw = await store.get('last-updated');
  return raw ? JSON.parse(raw) : null;
}

async function getGithubLastUpdated() {
  const store = getStore({ name: NAMESPACE });
  const raw = await store.get('github-last-updated');
  return raw ? JSON.parse(raw) : null;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async (request) => {
  // Handle CORS preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const url = new URL(request.url);
    const packageName = url.searchParams.get('package');

    let data;
    let githubData = null;
    
    if (packageName) {
      data = await getPackageData(packageName);
      githubData = await getGithubData(packageName);
      
      if (!data) {
        return new Response(
          JSON.stringify({
            error: 'Package not found',
            note: 'Data might not be populated yet by the scheduled function'
          }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );
      }
      
      // Merge GitHub data if available
      if (githubData) {
        data = { ...data, ...githubData };
      }
    } else {
      data = await getAllPackageData();
    }

    const lastUpdated = await getLastUpdated();
    const githubLastUpdated = await getGithubLastUpdated();

    return new Response(
      JSON.stringify({
        data,
        lastUpdated,
        githubLastUpdated,
        environment: 'production',
        accessMethod: 'blob-storage'
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'max-age=6400,public,must-revalidate'
        }
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to retrieve package data',
        message: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
