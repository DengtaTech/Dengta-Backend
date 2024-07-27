import { signUpHandler } from '../Application/Features/User/Commands/SignUp/signUpHandler.js';
import { Request, Response } from 'express';
import { tool } from '../utils/tool.js';
import {
  EmailFormatError,
  InputEmptyError,
  NoTokenError,
} from '../Errors/errors.js';
import { Signup } from '../Application/Features/User/Commands/SignUp/Types/api.js';
import { userService } from '../Infrastructure/Service/userService.js';
import minioService from '../Infrastructure/Service/avatarService.js';

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

  getUserInfo: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    const user = await userService.getUserInfo(userId);
    const presignedAvatarUrl = await minioService.getPresignedAvatarUrl(
      user.avatar,
    );
    if (presignedAvatarUrl) user.avatar = presignedAvatarUrl;
    res.status(200).json({ data: { ...user } });
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

    const filename = await minioService.uploadAvatar(userId, file);
    if (filename) {
      await userService.updateAvatar(userId, filename);
      const presignedAvatarUrl =
        await minioService.getPresignedAvatarUrl(filename);
      res.status(200).send({
        message: 'Avatar uploaded successfully',
        data: { filename, url: presignedAvatarUrl },
      });
    } else {
      res.status(500).send({ message: 'Failed to upload avatar' });
    }
  },
};
