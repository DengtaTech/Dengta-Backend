import { Database } from '../../Database/data-source.js';
import { userRepo } from '../Repository/userRepo.js';
import { userCredentialRepo } from '../Repository/userCredentialRepo.js';
import {
  EmailExistsError,
} from '../../Errors/errors.js';

export const userService = {
  signUp: async (
    userInfoObj: Signup.ISignUpObject,
  ): Promise<Signup.IUserObject> => {
    // try {
    const checkUserExist = await userCredentialRepo.findByEmail(
      userInfoObj.email,
    );

    if (checkUserExist) {
      throw new EmailExistsError();
    }

    // transaction begin
    return Database.transaction(async (transactionManager) => {
      try {
        const newUser = await userRepo.insertNewUser(
          userInfoObj.realName,
          userInfoObj.accountName,
          transactionManager,
        );
        const newUserCredential = await userCredentialRepo.insertNewUser(
          newUser,
          userInfoObj,
          transactionManager,
        );
        return {
          id: newUser.id,
          realName: newUser.realName,
          accountName: newUser.accountName,
          provider: newUser.provider,
          email: newUserCredential.email,
          avatar: newUser.avatar,
        } as Signup.IUserObject;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });    
  },
};
