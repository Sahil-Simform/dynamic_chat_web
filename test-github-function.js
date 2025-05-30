/**
 * Test script for the fetch-github-stars function
 * 
 * This script allows you to test the GitHub stars fetch function locally
 * without deploying to Netlify.
 * 
 * Run with: node test-github-function.js
 */

// Import required modules
const { handler } = require('./netlify_functions/fetch-github-stars');
const { getRepoMappings, updateRepoMappings } = require('./netlify_functions/storage');
const { DEFAULT_REPO_MAPPINGS } = require('./netlify_functions/config');

// Create mock event object (similar to what Netlify would provide)
const mockEvent = {
  body: null,
  headers: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  path: '/',
  queryStringParameters: {},
};

// Execute the function
async function runTest() {
  console.log('Testing GitHub stars fetch function...');
  
  try {
    // First, ensure we have repository mappings
    const mappings = await getRepoMappings();
    
    if (Object.keys(mappings).length === 0) {
      console.log('No repository mappings found. Initializing with default mappings...');
      await updateRepoMappings(DEFAULT_REPO_MAPPINGS);
      console.log('Repository mappings initialized with:', Object.keys(DEFAULT_REPO_MAPPINGS).length, 'entries');
    } else {
      console.log('Found', Object.keys(mappings).length, 'repository mappings');
    }
    
    // Now execute the GitHub stars fetch function
    console.log('\nFetching GitHub repository data...');
    const response = await handler(mockEvent);
    console.log('Function executed successfully!');
    console.log('Status code:', response.statusCode);
    
    // Parse the response body
    const body = JSON.parse(response.body);
    console.log('Response:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('Error executing function:', error);
  }
}

// Run the test
runTest();
