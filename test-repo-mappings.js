/**
 * Simple utility to test repository mappings
 * 
 * Run with:
 * node test-repo-mappings.js
 */

require('dotenv').config();
const axios = require('axios');

// Base URL for local testing - adjust as needed
const BASE_URL = 'http://localhost:8888';

// Test the repository mappings API
async function testRepoMappings() {
  try {
    // Step 1: Get current mappings
    console.log('Getting current repository mappings...');
    const getMappingsResponse = await axios.get(`${BASE_URL}/.netlify/functions/manage-repo-mappings`);
    console.log('Current mappings:', JSON.stringify(getMappingsResponse.data, null, 2));

    // Step 2: Add a new mapping
    console.log('\nAdding a new repository mapping...');
    const addMappingResponse = await axios.post(
      `${BASE_URL}/.netlify/functions/manage-repo-mappings`,
      {
        action: 'add',
        package: 'test_package',
        repo: 'test_org/test_repo'
      }
    );
    console.log('Add mapping response:', JSON.stringify(addMappingResponse.data, null, 2));

    // Step 3: Get updated mappings
    console.log('\nGetting updated repository mappings...');
    const updatedMappingsResponse = await axios.get(`${BASE_URL}/.netlify/functions/manage-repo-mappings`);
    console.log('Updated mappings:', JSON.stringify(updatedMappingsResponse.data, null, 2));

    // Step 4: Remove the test mapping
    console.log('\nRemoving test repository mapping...');
    const removeMappingResponse = await axios.post(
      `${BASE_URL}/.netlify/functions/manage-repo-mappings`,
      {
        action: 'remove',
        package: 'test_package'
      }
    );
    console.log('Remove mapping response:', JSON.stringify(removeMappingResponse.data, null, 2));

    // Step 5: Verify mappings after removal
    console.log('\nVerifying repository mappings after removal...');
    const finalMappingsResponse = await axios.get(`${BASE_URL}/.netlify/functions/manage-repo-mappings`);
    console.log('Final mappings:', JSON.stringify(finalMappingsResponse.data, null, 2));

    console.log('\nRepository mappings test completed successfully!');
  } catch (error) {
    console.error('Error testing repository mappings:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testRepoMappings();
