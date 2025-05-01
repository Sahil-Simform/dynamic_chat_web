# Netlify Functions for Package Data Collection

This project contains Netlify Functions and Edge Functions to periodically collect package data from pub.dev and serve it to your frontend.

## System Architecture

The system consists of three main components:

1. **Scheduled Function (`fetch-package-data.js`)**: Runs every 5 minutes to collect package data from pub.dev and store it in Netlify's KV store.
2. **Package Management API (`manage-packages.js`)**: A Netlify Function for adding, removing, or updating the list of packages to track.
3. **Data Access API (`get-package-data.js`)**: An Edge Function that serves cached package data to your frontend.

## Dependencies

The following Node.js packages are required:

```json
{
  "dependencies": {
    "node-fetch": "^2.7.0",
    "@netlify/functions": "^2.4.1",
    "@netlify/blobs": "^6.5.0",
    "axios": "^1.6.2"
  }
}
```

Install them with:

```bash
npm install
```

## API Documentation

### 1. Package Management API

**Endpoint:** `/.netlify/functions/manage-packages`

#### Get the current list of tracked packages

**Method:** GET  
**Example:**
```bash
curl https://your-site.netlify.app/.netlify/functions/manage-packages
```

**Response:**
```json
{
  "packages": ["flutter", "http", "provider", "shared_preferences"]
}
```

#### Add packages

**Method:** POST  
**Body:**
```json
{
  "action": "add",
  "package": "flutter_bloc"
}
```

or add multiple packages:

```json
{
  "action": "add",
  "packages": ["flutter_bloc", "get_it", "dio"]
}
```

**Example:**
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/manage-packages \
  -H "Content-Type: application/json" \
  -d '{"action": "add", "package": "equatable"}'
```

**Response:**
```json
{
  "message": "Packages added successfully",
  "packages": ["flutter", "http", "provider", "shared_preferences", "equatable"]
}
```

#### Remove packages

**Method:** POST  
**Body:**
```json
{
  "action": "remove",
  "package": "http"
}
```

or remove multiple packages:

```json
{
  "action": "remove",
  "packages": ["provider", "http"]
}
```

**Example:**
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/manage-packages \
  -H "Content-Type: application/json" \
  -d '{"action": "remove", "package": "http"}'
```

**Response:**
```json
{
  "message": "Packages removed successfully",
  "packages": ["flutter", "provider", "shared_preferences"]
}
```

#### Set the entire package list

**Method:** POST  
**Body:**
```json
{
  "action": "set",
  "packages": ["flutter", "flutter_bloc", "equatable", "dio", "get_it"]
}
```

**Example:**
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/manage-packages \
  -H "Content-Type: application/json" \
  -d '{"action":"set","packages":["flutter","flutter_bloc"]}'
```

**Response:**
```json
{
  "message": "Packages set successfully",
  "packages": ["flutter", "flutter_bloc"]
}
```

### 2. Package Data API

**Endpoint:** `/api/package-data`

#### Get data for all tracked packages

**Method:** GET  
**Example:**
```bash
curl https://your-site.netlify.app/api/package-data
```

**Response:**
```json
{
  "data": {
    "flutter": {
      "grantedPoints": 150,
      "maxPoints": 160,
      "likeCount": 2817,
      "downloadCount30Days": 156194,
      "tags": ["publisher:simform.com", "sdk:flutter", "..."],
      "lastUpdated": "2025-04-24T20:09:55.534241"
    },
    "http": {
      "...": "..."
    }
  },
  "lastUpdated": "2025-05-01T12:00:00.000Z",
  "environment": "production"
}
```

#### Get data for a specific package

**Method:** GET  
**Example:**
```bash
curl https://your-site.netlify.app/api/package-data?package=flutter
```

**Response:**
```json
{
  "data": {
    "grantedPoints": 150,
    "maxPoints": 160,
    "likeCount": 2817,
    "downloadCount30Days": 156194,
    "tags": ["publisher:simform.com", "sdk:flutter", "..."],
    "lastUpdated": "2025-04-24T20:09:55.534241"
  },
  "lastUpdated": "2025-05-01T12:00:00.000Z",
  "environment": "production"
}
```

## Local Testing

To test your functions locally:

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Run the development server: `netlify dev`
3. Use the test script to verify the scheduled function: `node test-scheduled-function.js`

## Scheduled Function Testing

The scheduled function is configured to run every 5 minutes in production. To test it locally, use the test script that will simulate the scheduled execution.

## Deployment

When deployed to Netlify, make sure to:

1. Enable Netlify Blobs and KV Store for your site
2. Verify that the scheduled function is running by checking the function logs

## Troubleshooting

- If the scheduled function isn't running, check the function logs in the Netlify dashboard
- If data isn't being stored, verify that Netlify Blobs is properly configured for your site
- For local development issues, make sure you have the Netlify CLI installed and are running `netlify dev`