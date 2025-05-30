const { getRepoMappings, updateRepoMappings } = require('./storage');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  // Only allow GET and POST requests
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // GET request - list all repository mappings
    if (event.httpMethod === 'GET') {
      const mappings = await getRepoMappings();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ mappings })
      };
    }
    
    // POST request - add, remove, or update repository mappings
    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body);
      const action = payload.action;
      
      // Get current repository mappings
      const currentMappings = await getRepoMappings();
      let updatedMappings = { ...currentMappings };
      
      switch (action) {
        case 'add':
          // Add or update a single mapping
          if (payload.package && payload.repo) {
            updatedMappings[payload.package] = payload.repo;
          } 
          // Add or update multiple mappings
          else if (payload.mappings && typeof payload.mappings === 'object') {
            updatedMappings = { ...updatedMappings, ...payload.mappings };
          } else {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Invalid payload. Provide either "package" and "repo" or "mappings" object.' })
            };
          }
          break;
          
        case 'remove':
          // Remove a single mapping
          if (payload.package) {
            delete updatedMappings[payload.package];
          } 
          // Remove multiple mappings
          else if (Array.isArray(payload.packages)) {
            payload.packages.forEach(pkg => delete updatedMappings[pkg]);
          } else {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Invalid payload. Provide "package" or "packages" array.' })
            };
          }
          break;
          
        case 'set':
          // Replace the entire mappings object
          if (payload.mappings && typeof payload.mappings === 'object') {
            updatedMappings = payload.mappings;
          } else {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: 'Invalid payload. Provide "mappings" object.' })
            };
          }
          break;
          
        default:
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action. Use "add", "remove", or "set".' })
          };
      }
      
      // Update the repository mappings
      const success = await updateRepoMappings(updatedMappings);
      
      if (success) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: `Repository mappings ${action === 'set' ? 'set' : action === 'add' ? 'added' : 'removed'} successfully`, 
            mappings: updatedMappings 
          })
        };
      } else {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to update repository mappings' })
        };
      }
    }
  } catch (error) {
    console.error(`Error in manage-repo-mappings function: ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
