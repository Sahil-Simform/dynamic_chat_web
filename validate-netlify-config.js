// A simple validator to check if netlify.toml is configured correctly for scheduled functions
const fs = require('fs');
const path = require('path');
const { parse } = require('toml');

console.log('🔍 Validating Netlify configuration...');

try {
  // Read the netlify.toml file
  const netlifyTomlPath = path.join(__dirname, 'netlify.toml');
  const netlifyTomlContent = fs.readFileSync(netlifyTomlPath, 'utf-8');
  
  // Parse the TOML content
  const netlifyConfig = parse(netlifyTomlContent);
  
  // Check if scheduled functions are configured
  const scheduledFunction = netlifyConfig.functions && 
    netlifyConfig.functions['fetch-package-data'] && 
    netlifyConfig.functions['fetch-package-data'].schedule;
  
  console.log('\n--- Configuration Check Results ---');
  
  if (scheduledFunction) {
    console.log('✅ Scheduled function is properly configured:');
    console.log(`   Schedule pattern: ${scheduledFunction}`);
    
    // Validate cron pattern (basic validation)
    const cronPattern = scheduledFunction.split(' ');
    if (cronPattern.length !== 5) {
      console.warn('⚠️  Warning: Cron pattern format might be invalid. Expected 5 parts.');
    } else {
      console.log('✅ Cron pattern format is valid.');
    }
  } else {
    console.error('❌ Scheduled function configuration not found!');
    console.error('   Make sure you have a section like this in netlify.toml:');
    console.error('   [functions.fetch-package-data]');
    console.error('       schedule = "*/5 * * * *"');
  }
  
  // Check for external node modules configuration
  const externalModules = netlifyConfig.functions && 
    netlifyConfig.functions.external_node_modules;
  
  if (externalModules && Array.isArray(externalModules)) {
    console.log('✅ External node modules are configured:');
    console.log(`   Modules: ${externalModules.join(', ')}`);
    
    // Check if all required modules are included
    const requiredModules = ['@netlify/functions', '@netlify/blobs', 'axios'];
    const missingModules = requiredModules.filter(m => !externalModules.includes(m));
    
    if (missingModules.length > 0) {
      console.warn(`⚠️  Warning: Some recommended external modules are missing: ${missingModules.join(', ')}`);
    }
  } else {
    console.warn('⚠️  Warning: External node modules may not be properly configured.');
    console.warn('   This might cause bundling errors. Consider adding:');
    console.warn('   [functions]');
    console.warn('       external_node_modules = ["@netlify/functions", "@netlify/blobs", "axios"]');
  }
  
  // Check for edge function configuration
  const edgeFunctions = netlifyConfig.edge_functions;
  
  if (edgeFunctions && Array.isArray(edgeFunctions) && edgeFunctions.length > 0) {
    console.log('✅ Edge functions are configured:');
    edgeFunctions.forEach(ef => {
      console.log(`   Path: ${ef.path}, Function: ${ef.function}`);
    });
  } else {
    console.warn('⚠️  Warning: No edge functions seem to be configured.');
  }
  
  console.log('\n--- Validation Complete ---');
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('❌ netlify.toml file not found!');
  } else if (error.name === 'SyntaxError') {
    console.error('❌ Invalid TOML syntax in netlify.toml');
    console.error(error.message);
  } else {
    console.error('❌ Error validating configuration:', error.message);
  }
  
  process.exit(1);
}