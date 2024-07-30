import { Database } from '../../Database/data-source.js';
import { userRepo } from '../Repository/userRepo.js';
import { userCredentialRepo } from '../Repository/userCredentialRepo.js';
import { linkRepo } from '../Repository/linkRepo.js';
import { EmailExistsError, UserNotFoundError } from '../../Errors/errors.js';
import { User } from '../../Database/Entities/user.js';
import { Signup } from '../../Application/Features/User/SignUp/Types/api.js';
import { Link } from '../../Database/Entities/link.js';
import { Signin } from '../../Application/Features/User/SignIn/Types/api.js';

export const userService = {
  signUp: async (
    userInfoObj: Signup.ISignUpReq,
  ): Promise<Signup.ISignUpDto> => {
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
          transactionManager,
        );
        const newUserCredential = await userCredentialRepo.insertNewUser(
          newUser,
          userInfoObj,
          transactionManager,
        );
        let initLinks: Link[] = [];
        if (userInfoObj.links.length !== 0) {
          initLinks = await linkRepo.initLink(
            userInfoObj.links,
            newUser.id,
            transactionManager,
          );
        }
        return {
          id: newUser.id,
          name: newUser.name,
          lifeRole: newUser.lifeRole,
          email: newUserCredential.email,
          links: initLinks,
        } as Signup.ISignUpDto;
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  signIn: async (email: string): Promise<Signin.ISignInDto> => {
    const checkUserExist = await userCredentialRepo.findByEmail(email);
    if (!checkUserExist) {
      throw new UserNotFoundError();
    }
    return {
      id: checkUserExist.userId,
      email: checkUserExist.email,
      password: checkUserExist.password,
    };
  },

  getUserInfo: async (id: string): Promise<User> => {
    const userInfo = await userRepo.findById(id);
    if (!userInfo) {
      throw new Error('User not found');
    }
    return userInfo;
  },

  updateAvatar: async (userId: string, filename: string): Promise<void> => {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.avatar = filename;
    await user.save();
  },
};
