const sequelize = require('../../mysql');
const userRepo = require('../Repository/userRepo');
const userCredentialRepo = require('../Repository/userCredentialRepo');
const UserCredential = require('../../Database/Entities/userCredentials');
const User = require('../../Database/Entities/users');
module.exports = {
  signUp: async (name) => {
    try {
      const result = await sequelize.transaction(async (t) => {
        const insertResult = await userRepo.insertNewUser(name);
        console.log('userId:', insertResult.id);
        const userCredential = await userCredentialRepo.insertNewUser(
          insertResult.id
        );
        return insertResult;
      });
      console.log('res:', result.realName);
    } catch (error) {
      console.error(error);
    } finally {
      console.log('connection release');
    }
  },
};
