const EnvironmentManager = require('./envService');
const models = require('../Database/models');
module.exports = {
  initApp: async () => {
    try {
      await EnvironmentManager.loadSecrets();
      console.log('Environment variables are loaded and ready to use.');

      await models.initDb();
      console.log('Database has been initialized successfully.');
    } catch (error) {
      console.error('Failed to init app:', error);
    }
  },
};
