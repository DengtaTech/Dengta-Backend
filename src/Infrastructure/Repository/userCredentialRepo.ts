import { User } from '../../Database/Entities/user.js';
import { UserCredential } from '../../Database/Entities/userCredential.js';
import { EntityManager } from 'typeorm';
export const userCredentialRepo = {
    insertNewUser: async (
        user: User,
        userInfoObj: Signup.ISignUpObject,
        transactionManager: EntityManager,
    ): Promise<UserCredential> => {
        try {
            const newUserCredential = new UserCredential();
            newUserCredential.email = userInfoObj.email;
            newUserCredential.password = userInfoObj.password;
            newUserCredential.user = user;
            const savedUserCredential =
                await transactionManager.save(newUserCredential);
            console.log(savedUserCredential);
            return savedUserCredential;
        } catch (error) {
            console.error("Failed to save user credential:", error);
            throw error;
        }
    },
    findByEmail: async (email: string): Promise<UserCredential | null> => {
        try {
            const userCredential = await UserCredential.findOne({
                where: { email: email },
            });
            console.log(userCredential);
            return userCredential;
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw error;
        }
    },
};
