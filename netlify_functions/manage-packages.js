// filepath: /Users/sahil.t/StudioProjects/dynamic_chat_web/netlify_functions/manage-packages.js
const { getPackageList, updatePackageList } = require('./storage');

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

  // Only allow POST and GET requests
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // GET request - list all tracked packages
    if (event.httpMethod === 'GET') {
      const packages = await getPackageList();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ packages })
      };
    }
    
    // POST request - add, remove, or update packages
    if (event.httpMethod === 'POST') {
      const payload = JSON.parse(event.body);
      const action = payload.action;
      
      // Get current package list
      const currentPackages = await getPackageList();
      let updatedPackages = [...currentPackages];
      
      switch (action) {
        case 'add':
          // Add one or more new packages
          if (Array.isArray(payload.packages)) {
            // Add multiple packages
            for (const pkg of payload.packages) {
              if (!updatedPackages.includes(pkg)) {
                updatedPackages.push(pkg);
              }
            }
          } else if (payload.package && !updatedPackages.includes(payload.package)) {
            // Add a single package
            updatedPackages.push(payload.package);
          }
          break;
          
        case 'remove':
          // Remove one or more packages
          if (Array.isArray(payload.packages)) {
            // Remove multiple packages
            updatedPackages = updatedPackages.filter(pkg => !payload.packages.includes(pkg));
          } else if (payload.package) {
            // Remove a single package
            updatedPackages = updatedPackages.filter(pkg => pkg !== payload.package);
          }
          break;
          
        case 'set':
          // Replace the entire package list
          if (Array.isArray(payload.packages)) {
            updatedPackages = payload.packages;
          }
          break;
          
        default:
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid action. Use "add", "remove", or "set".' })
          };
      }
      
      // Update the package list
      const success = await updatePackageList(updatedPackages);
      
      if (success) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            message: `Packages ${action === 'set' ? 'set' : action === 'add' ? 'added' : 'removed'} successfully`, 
            packages: updatedPackages 
          })
        };
      } else {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to update package list' })
        };
      }
    }
  } catch (error) {
    console.error(`Error in manage-packages function: ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};