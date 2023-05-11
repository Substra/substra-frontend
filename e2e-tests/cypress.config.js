const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    USERNAME: 'org-1',
    PASSWORD: 'p@sswr0d44',
    BACKEND_API_URL: 'http://substra-backend.org-1.com',
  },
  video: false,
  defaultCommandTimeout: 20000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://substra-frontend.org-1.com:3000',
  },
})
