/**
 * Test script for the fetch-github-stars function
 * 
 * This script allows you to test the GitHub stars fetch function locally
 * without deploying to Netlify.
 * 
 * Run with: node test-github-function.js
 */

// Import the function handler directly
const { handler } = require('./netlify_functions/fetch-github-stars');

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
