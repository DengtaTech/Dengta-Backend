require('dotenv').config();
const { InfisicalClient } = require('@infisical/sdk');

class EnvironmentManager {
  static client = new InfisicalClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  static secrets = {};

  static async loadSecrets() {
    if (Object.keys(EnvironmentManager.secrets).length > 0) return;

    try {
      const secretsList = await EnvironmentManager.client.listSecrets({
        environment: "prod", //本地開發記得替換成 dev
        projectId: process.env.PROJECT_ID,
        path: "/",
        includeImports: false,
      });
      secretsList.forEach(secret => {
        EnvironmentManager.secrets[secret.secretKey] = secret.secretValue;
      });
      console.log("Secrets loaded successfully.");
    } catch (error) {
      console.error("Failed to load secrets:", error);
      process.exit(1);
    }
  }

  static getSecret(key) {
    return EnvironmentManager.secrets[key] || null;
  }
}

module.exports = EnvironmentManager;
