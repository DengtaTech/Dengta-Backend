import { Database } from '../../Database/data-source.js';
import { userRepo } from '../Repository/userRepo.js';
import { userCredentialRepo } from '../Repository/userCredentialRepo.js';
import { errorMsg } from '../../utils/errorMsg.js';
import { Response } from 'express';
export const userService = {
  signUp: async (
    res: Response,
    userInfoObj: Signup.ISignUpObject,
  ): Promise<Signup.IUserObject | undefined | null> => {
    try {
      const checkUserExist = await userCredentialRepo.findByEmail(
        userInfoObj.email,
      );
      if (checkUserExist != null) return null;
      // transaction begin
      const result = await Database.transaction(async (transactionManager) => {
        const newUser = await userRepo.insertNewUser(
          userInfoObj.realName,
          userInfoObj.accountName,
          transactionManager,
        );
        console.log('userId:', newUser.id);
        const newUserCredential = await userCredentialRepo.insertNewUser(
          newUser,
          userInfoObj,
          transactionManager,
        );
        console.log('test user:', newUser);
        const response: Signup.IUserObject = {
          id: newUser.id,
          realName: newUser.realName,
          accountName: newUser.accountName,
          provider: newUser.provider,
          email: newUserCredential.email,
          avatar: newUser.avatar,
        };
        console.log('response:', response);
        return response;
      });
      console.log('res:', result);
      return result;
    } catch (error) {
      // client response set
      errorMsg.dbError(res);
      console.error('error:', error);
    } finally {
      console.log('service layer ended');
    }
  },
};
