/* eslint-env node */

// Module imports
const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')





// Import variables from .env file.
require('dotenv').config()





// Component constants
const DEFAULT_PORT = 3000





module.exports = withSass(withCSS({
  // target: 'serverless',

  env: {
    firebaseAPIKey: process.env.FIREBASE_API_KEY,
    firebaseAppID: process.env.FIREBASE_APP_ID,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseDatabaseURL: process.env.FIREBASE_DATABASE_URL,
    firebaseMessagingSenderID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseProjectID: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,

    buildDate:  (new Date()).toISOString(),
    nodeVersion: process.version,
  },

  webpack: (config, data) => {
    config.module.rules.push({
      exclude: /node_modules/,
      test: /\.svg$/,
      loader: 'raw-loader',
    })

    config.module.rules.unshift({
      enforce: 'pre',
      exclude: /node_modules/u,
      loader: 'eslint-loader',
      test: /\.js$/u,
    })

    return config
  },

  sassLoaderOptions: {
    includePaths: ['styles', 'node_modules']
      .map((dir) => path.join(__dirname, dir))
      .map((dir) => glob.sync(dir))
      .reduce((acc, dir) => acc.concat(dir), []),
  },
}))
