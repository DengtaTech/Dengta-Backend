const User = require('../../Database/Entities/users');
module.exports = {
    insertNewUser: async (name,transaction) => {
        try {
            const jane = await User.create({ realName: name },transaction);
            console.log(jane.toJSON());
            return jane;
        } catch (error) {
            throw error;
        }
    }

}