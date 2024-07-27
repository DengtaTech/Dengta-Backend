import { Signup } from '../../Application/Features/User/Commands/SignUp/Types/api.js';
import { User } from '../../Database/Entities/user.js';
import { UserCredential } from '../../Database/Entities/userCredential.js';
import { EntityManager } from 'typeorm';
export const userCredentialRepo = {
    insertNewUser: async (
        user: User,
        userInfoObj: Signup.ISignUpReq,
        transactionManager: EntityManager,
    ): Promise<UserCredential> => {
        try {
            const newUserCredential = new UserCredential();
            newUserCredential.email = userInfoObj.email;
            newUserCredential.password = userInfoObj.password;
            newUserCredential.user = user;
            const savedUserCredential =
                await transactionManager.save(newUserCredential);
            return savedUserCredential;
        } catch (error) {
            console.error("Failed to save user credential:");
            throw error;
        }
    },
    findByEmail: async (email: string): Promise<UserCredential | null> => {
        try {
            const userCredential = await UserCredential.findOne({
                where: { email: email },
            });
            return userCredential;
        } catch (error) {
            console.error("Error finding user by email:");
            throw error;
        }
    },
};
