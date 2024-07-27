import { Database } from '../../Database/data-source.js';
import { userRepo } from '../Repository/userRepo.js';
import { userCredentialRepo } from '../Repository/userCredentialRepo.js';
import { linkRepo } from '../Repository/linkRepo.js';
import {
  EmailExistsError,
} from '../../Errors/errors.js';

export const userService = {
  signUp: async (
    userInfoObj: Signup.ISignUpObject
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
          userInfoObj,
          transactionManager
        );
        const newUserCredential = await userCredentialRepo.insertNewUser(
          newUser,
          userInfoObj,
          transactionManager,
        );
        if(userInfoObj.links.length !== 0) {
            await linkRepo.initLink(userInfoObj.links, newUser.id, transactionManager);
        }
        return {
          id: newUser.id,
          name: newUser.name,
          lifeRole: newUser.lifeRole,
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
