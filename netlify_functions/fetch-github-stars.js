const axios = require('axios');
const { schedule } = require('@netlify/functions');
const { getPackageList, getAllPackageData, saveGithubData } = require('./storage');

// GitHub repository mapping for pub.dev packages
// You can add more packages and their GitHub repositories here
const PACKAGE_REPO_MAP = {
  'showcaseview': 'simformsolutions/flutter_showcaseview',
  'chatview': 'SimformSolutionsPvtLtd/chatview',
  'calendar_view': 'SimformSolutionsPvtLtd/flutter_calendar_view',
  'flutter_credit_card': 'SimformSolutionsPvtLtd/flutter_credit_card',
  'audio_waveforms': 'SimformSolutionsPvtLtd/audio_waveforms'
};

// This function runs hourly
exports.handler = schedule('0 * * * *', async (event) => {
  try {
    // Get list of packages we want to track
    const packages = await getPackageList();
    // Get the current package data to merge with
    const currentPackageData = await getAllPackageData();
    
    console.log(`Fetching GitHub stars for ${packages.length} packages`);
    
    // Fetch star counts for each package with a GitHub repository
    const githubData = {};
    
    for (const pkg of packages) {
      try {
        // Skip if we don't have a GitHub repo mapping
        if (!PACKAGE_REPO_MAP[pkg]) {
          console.log(`No GitHub repository mapping found for ${pkg}`);
          continue;
        }
        
        const repoPath = PACKAGE_REPO_MAP[pkg];
        const response = await axios.get(`https://api.github.com/repos/${repoPath}`, {
          headers: {
            'Accept': 'application/vnd.github+json',
            // Add authorization if you have higher rate limits with a token
            // 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          }
        });
        
        // Extract the data we want
        const { stargazers_count, forks_count, open_issues_count, watchers_count } = response.data;
        
        githubData[pkg] = {
          stars: stargazers_count,
          forks: forks_count,
          issues: open_issues_count,
          watchers: watchers_count,
          updated_at: new Date().toISOString()
        };
        
        console.log(`Successfully fetched GitHub data for ${pkg}: ${stargazers_count} stars`);
      } catch (error) {
        console.error(`Error fetching GitHub data for ${pkg}: ${error.message}`);
      }
    }
    
    // Save the results to storage
    await saveGithubData(githubData, currentPackageData);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `GitHub data fetched for ${Object.keys(githubData).length} packages`,
        data: githubData
      })
    };
  } catch (error) {
    console.error(`Error in GitHub stars scheduled function: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch and store GitHub data' })
    };
  }
});
