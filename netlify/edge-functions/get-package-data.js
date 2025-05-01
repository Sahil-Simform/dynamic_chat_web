import { getStore } from '@netlify/blobs';

const NAMESPACE = 'package-scores';

async function getPackageData(packageName) {
  const store = getStore({ name: NAMESPACE });
  const raw = await store.get(`package-${packageName}`);
  return raw ? JSON.parse(raw) : null;
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
    if (packageName) {
      data = await getPackageData(packageName);
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
              'Content-Type': 'application/json'
            }
          }
        );
      }
    } else {
      data = await getAllPackageData();
    }

    const lastUpdated = await getLastUpdated();

    return new Response(
      JSON.stringify({
        data,
        lastUpdated,
        environment: 'production',
        accessMethod: 'blob-storage'
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60'
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
