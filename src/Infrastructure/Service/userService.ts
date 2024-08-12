import { Database } from '../../Database/data-source.js';
import { userRepo } from '../Repository/userRepo.js';
import { userCredentialRepo } from '../Repository/userCredentialRepo.js';
import { linkRepo } from '../Repository/linkRepo.js';
import { EmailExistsError, UserNotFoundError } from '../../Errors/errors.js';
import { User } from '../../Database/Entities/user.js';
import { Signup } from '../../Application/Features/User/SignUp/Types/api.js';
import { Link } from '../../Database/Entities/link.js';
import { Signin } from '../../Application/Features/User/SignIn/Types/api.js';
import { PatchUserInfo } from '../../Application/Features/User/PatchUserInfo/Types/api.js';

export const userService = {
  signUp: async (
    userInfoObj: Signup.ISignUpReq,
  ): Promise<Signup.ISignUpDto> => {
    // try {
    const checkUserExist = await userRepo.findByEmail(userInfoObj.email);

    if (checkUserExist) {
      throw new EmailExistsError();
    }

    // transaction begin
    return Database.transaction(async (transactionManager) => {
      try {
        const newUser = await userRepo.insertNewUser(
          userInfoObj,
          transactionManager,
        );
        await userCredentialRepo.insertNewUser(
          newUser,
          userInfoObj.password,
          transactionManager,
        );
        let initLinks: Link[] = [];
        if (userInfoObj.links.length !== 0) {
          initLinks = await linkRepo.initLink(
            userInfoObj.links,
            newUser,
            transactionManager,
          );
        }
        return {
          id: newUser.id,
          fullName: newUser.fullName,
          lifeRole: newUser.lifeRole,
          email: newUser.email,
          links: initLinks.map((link) => {
            const { sourceName, url } = link;
            return { sourceName, url };
          }),
        } as Signup.ISignUpDto;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  signIn: async (email: string): Promise<Signin.ISignInDto> => {
    const checkUserExist = await userRepo.findByEmail(email);
    if (!checkUserExist?.userCredential) {
      throw new UserNotFoundError();
    }
    return {
      id: checkUserExist.id,
      email: checkUserExist.email,
      password: checkUserExist.userCredential.password,
    };
  },

  getUserInfo: async (id: string): Promise<User> => {
    const userInfo = await userRepo.findById(id);
    if (!userInfo) {
      throw new Error('User not found');
    }
    return userInfo;
  },

  updateAvatar: async (userId: string, permanentURL: string): Promise<void> => {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.avatar = permanentURL;
    await user.save();
  },

  updateUserInfo: async (
    userId: string,
    updateFields: PatchUserInfo.PatchUserInfoReqBody,
  ): Promise<void> => {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { links, ...otherFields } = updateFields;

    Object.assign(user, otherFields);
    console.log(user);
    // transaction begin
    return Database.transaction(async (transactionManager) => {
      try {
        await linkRepo.deleteLink(user,transactionManager);
        const newLinks = await linkRepo.initLink(links, user, transactionManager);
        await userRepo.updateLink(user, newLinks, transactionManager);
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });

  },
};
