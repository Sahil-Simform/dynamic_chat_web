const { getRepoMappings, updateRepoMappings } = require('./storage');
const { DEFAULT_REPO_MAPPINGS } = require('./config');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Get current repository mappings
    const currentMappings = await getRepoMappings();
    
    // If we have no mappings, initialize with default ones
    if (Object.keys(currentMappings).length === 0) {
      await updateRepoMappings(DEFAULT_REPO_MAPPINGS);
      console.log('Initialized repository mappings with default values');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Repository mappings initialized successfully', 
          mappings: DEFAULT_REPO_MAPPINGS 
        })
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Repository mappings already exist', 
          mappings: currentMappings 
        })
      };
    }
  } catch (error) {
    console.error(`Error initializing repository mappings: ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to initialize repository mappings' })
    };
  }
};
