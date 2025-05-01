// This script simulates the execution of the scheduled function
// for testing purposes before deployment
const { handler } = require('./netlify_functions/fetch-package-data');

console.log('🚀 Testing scheduled function execution...');

// Create a mock event object similar to what Netlify would provide
const mockEvent = {
  body: null,
  headers: {},
  httpMethod: 'GET',
  isBase64Encoded: false,
  path: '/.netlify/functions/fetch-package-data',
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  rawUrl: 'http://localhost:8888/.netlify/functions/fetch-package-data',
};

// Execute the function handler
(async () => {
  try {
    console.log('📦 Executing function to fetch package data...');
    
    // Execute the handler
    const response = await handler(mockEvent);
    
    console.log(`✅ Function executed with status code: ${response.statusCode}`);
    console.log('📝 Response body:', response.body);
    
    // Parse the response to make it more readable
    const parsedResponse = JSON.parse(response.body);
    console.log('🔍 Processed response:', JSON.stringify(parsedResponse, null, 2));
    
    console.log('\n🔄 This function will run every 5 minutes when deployed to Netlify.');
    console.log('📊 Check the Netlify logs to verify it\'s running on schedule.');
  } catch (error) {
    console.error('❌ Error testing scheduled function:', error);
  }
})();