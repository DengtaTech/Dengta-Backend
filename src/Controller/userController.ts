import { signUpHandler } from '../Application/Features/User/SignUp/signUpHandler.js';
import { Request, Response } from 'express';
import { tool } from '../utils/tool.js';
import {
  EmailFormatError,
  InputEmptyError,
  NoTokenError,
} from '../Errors/errors.js';
import { Signup } from '../Application/Features/User/SignUp/Types/api.js';
import { signInHandler } from '../Application/Features/User/SignIn/signInHandler.js';
import { uploadAvatarHandler } from '../Application/Features/User/UploadAvatar/uploadAvatarHandler.js';
import { getUserInfoHandler } from '../Application/Features/User/GetUserInfo/getUserInfoHandler.js';

export const userController = {
  signUp: async (req: Request, res: Response): Promise<void> => {
    const { name, lifeRole, gender, birthday, email, password, links } =
      req.body;
    if (!name || !lifeRole || !gender || !birthday || !email || !password) {
      throw new InputEmptyError();
    }
    if (!(await tool.checkEmail(email))) {
      throw new EmailFormatError();
    }
    const birthdayDate = new Date(birthday);
    const userDto: Signup.ISignUpReq = {
      name,
      lifeRole,
      gender,
      birthday: birthdayDate,
      email,
      password,
      links,
    };
    const response = await signUpHandler.handle(userDto);

    res.status(200).json(response);
  },
  signIn: async (req: Request, res: Response): Promise<void> => {
    const { provider, email, password } = req.body;
    if (!email || !password) {
      throw new InputEmptyError();
    }
    const response = await signInHandler.handle(email, password, provider);
    res.status(200).json(response);
  },
  getUserInfo: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    const response = await getUserInfoHandler.handle(userId);
    res.status(200).json(response);
  },
  uploadAvatar: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }

    const { id: userId } = req.decodedToken;
    const file = req.file;

    if (!file) {
      res.status(400).send({ message: 'Please upload an image file.' });
      return;
    }
    const response = await uploadAvatarHandler.handle(userId, file);
    res.status(200).json(response);
  },
};
