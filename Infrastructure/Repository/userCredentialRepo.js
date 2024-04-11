const UserCredential = require('../../Database/Entities/userCredentials');
module.exports = {
    insertNewUser: async (userId, transaction) => {
        try {
            const jane = await UserCredential.create({ userId: "jshdal" },transaction);
            console.log(jane.toJSON());
            console.log(JSON.stringify(jane, null, 4));
            return jane;
        } catch (error) {
            throw error;
        }
    }

}