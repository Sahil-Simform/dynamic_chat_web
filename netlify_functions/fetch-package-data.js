// filepath: /Users/sahil.t/StudioProjects/dynamic_chat_web/netlify_functions/fetch-package-data.js
const axios = require('axios');
const { schedule } = require('@netlify/functions');
const { getPackageList, savePackageData } = require('./storage');

// This function runs every 1 minutes
exports.handler = schedule('*/5 * * * *', async (event) => {
  try {
    // Get list of packages we want to track
    const packages = await getPackageList();
    
    console.log(`Fetching data for ${packages.length} packages`);
    
    // Fetch data for each package
    const results = {};
    for (const pkg of packages) {
      try {
        const response = await axios.get(`https://pub.dev/api/packages/${pkg}/score`);
        results[pkg] = response.data;
        console.log(`Successfully fetched data for ${pkg}`);
      } catch (error) {
        console.error(`Error fetching data for ${pkg}: ${error.message}`);
      }
    }
    
    // Save the results to storage
    await savePackageData(results);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Data fetched for ${Object.keys(results).length} packages` })
    };
  } catch (error) {
    console.error(`Error in scheduled function: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch and store package data' })
    };
  }
});