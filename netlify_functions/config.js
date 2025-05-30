// filepath: /Users/sahil.t/StudioProjects/dynamic_chat_web/netlify_functions/config.js
/**
 * Configuration settings for Netlify functions
 * 
 * This file provides a central place to control environment settings
 * and manually toggle between local development and production modes.
 * 
 * IMPORTANT: You need to enable the KV store and set environment variables!
 * 1. Enable Blobs in Netlify dashboard: Site settings > Functions > Netlify Blobs
 * 2. Set environment variables in Netlify dashboard: Site settings > Environment variables
 *    - NETLIFY_AUTH_TOKEN: Your personal access token from https://app.netlify.com/user/applications#personal-access-tokens
 */

// MANUAL TOGGLE: Set to true for production mode, false for local development mode
const FORCE_PRODUCTION_MODE = true;

// Required credentials when in production mode but not running on Netlify
const MANUAL_NETLIFY_CONFIG = {
  siteID: process.env.SITE_ID || '6a2c6859-798a-4ef2-ad9a-4c74dd312c89', // Your Netlify site ID
  token: process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN || ''     // Your Netlify personal access token
};

// Default packages to track
const DEFAULT_PACKAGES = ['showcaseview', 'chatview', 'calendar_view', 'flutter_credit_card', 'audio_waveforms', 'chatview_connect', 'splash_master'];

// Default GitHub repository mappings for packages
const DEFAULT_REPO_MAPPINGS = {
  'showcaseview': 'simformsolutions/flutter_showcaseview',
  'chatview': 'SimformSolutionsPvtLtd/chatview',
  'calendar_view': 'SimformSolutionsPvtLtd/flutter_calendar_view',
  'flutter_credit_card': 'SimformSolutionsPvtLtd/flutter_credit_card',
  'audio_waveforms': 'SimformSolutionsPvtLtd/audio_waveforms',
  'chatview_connect': 'SimformSolutionsPvtLtd/chatview_connect',
  'splash_master': 'SimformSolutionsPvtLtd/splash_master'
};

module.exports = {
  FORCE_PRODUCTION_MODE,
  MANUAL_NETLIFY_CONFIG,
  DEFAULT_PACKAGES,
  DEFAULT_REPO_MAPPINGS
};