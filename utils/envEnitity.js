// EnvironmentManager.js
const { InfisicalClient } = require('@infisical/sdk');

class EnvironmentManager {
  static client = new InfisicalClient({
    clientId: "a57b009f-051b-4156-acad-356a2bddc673",
    clientSecret: "a9592f18753634dfbebfba0befef37464c3da220520e8cc1edbc5be2eceadc0e",
  });

  static secrets = {};

  static async loadSecrets() {
    if (Object.keys(EnvironmentManager.secrets).length > 0) return;

    try {
      const secretsList = await EnvironmentManager.client.listSecrets({
        environment: "dev",
        projectId: "8941a750-f116-4e5e-bfc4-063817b01d8b",
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
