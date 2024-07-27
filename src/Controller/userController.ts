import { signUpHandler } from '../Application/Features/User/Commands/SignUp/signUpHandler.js';
import { Request, Response } from 'express';
import { tool } from '../utils/tool.js';
import { EmailFormatError, InputEmptyError } from '../Errors/errors.js';

export const userController = {
  signUp: async (req: Request, res: Response): Promise<void> => {
    const { name, lifeRole, gender, birthday, email, password, links } = req.body;
    if (!name || !lifeRole || !gender || !birthday || !email || !password) {
      throw new InputEmptyError();
    }
    if (!(await tool.checkEmail(email))) {
      throw new EmailFormatError();
    } 
    const userDto: Signup.ISignUpReq = { name, lifeRole, gender, birthday, email, password, links };
    const response = await signUpHandler.handle(
        userDto
    );

    res.status(200).json(response);
  },
};
