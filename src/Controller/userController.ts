import { signUpHandler } from '../Application/Features/User/Commands/SignUp/signUpHandler.js';
import { Request, Response } from 'express';
import { tool } from '../utils/tool.js';
import { EmailFormatError, InputEmptyError } from '../Errors/errors.js';
import { Signup } from '../Application/Features/User/Commands/SignUp/Types/api.js';
import { signInHandler } from '../Application/Features/User/Commands/SignIn/signInHandler.js';
import { userService } from '../Infrastructure/Service/userService.js';

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
    const response = await signInHandler.handle(email, password,provider);
    res.status(200).json(response);
  },
  getUserInfo: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body.decodedToken;
    const user = await userService.getUserInfo(parseInt(id));
    res.status(200).json({ data: { ...user } });
  },
};
