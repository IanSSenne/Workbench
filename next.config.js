/* eslint-env node */

// Module imports
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withWorkers = require('@zeit/next-workers')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// const withTM = require("next-transpile-modules")([
//   "monaco-editor"
// ]);





// Import variables from .env file.
require('dotenv').config()





// Component constants
const DEFAULT_PORT = 3000





module.exports = withWorkers(withSass(withCSS({
  // target: 'serverless',

  env: {
    firebaseAPIKey: process.env.FIREBASE_API_KEY,
    firebaseAppID: process.env.FIREBASE_APP_ID,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseDatabaseURL: process.env.FIREBASE_DATABASE_URL,
    firebaseMessagingSenderID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseProjectID: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,

    buildDate: (new Date()).toISOString(),
    nodeVersion: process.version,
  },
  webpack: (config, data) => {
    config.plugins.push(new MonacoWebpackPlugin({
      languages: [
        "javascript",
        "typescript"
      ],
      filename: "static/[name].worker.js"
    }));

    return config
  },

  sassLoaderOptions: {
    includePaths: ['styles', 'node_modules']
      .map((dir) => path.join(__dirname, dir))
      .map((dir) => glob.sync(dir))
      .reduce((acc, dir) => acc.concat(dir), []),
  },

  cssLoaderOptions: { url: false },
  workerLoaderOptions: { inline: true }
})))
