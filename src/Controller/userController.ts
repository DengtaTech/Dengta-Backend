import { signUpHandler } from '../Application/Features/User/Commands/SignUp/signUpHandler.js';
import { Request, Response } from 'express';
import { tool } from '../utils/tool.js';
import { EmailFormatError, InputEmptyError } from '../Errors/errors.js';

export const userController = {
  signUp: async (req: Request, res: Response): Promise<void> => {
    const { realName, accountName, email, password } = req.body;
    if (!realName || !accountName || !email || !password) {
      throw new InputEmptyError();
    }
    if (!(await tool.checkEmail(email))) {
      throw new EmailFormatError();
    }
    
    const response = await signUpHandler.handle(
      realName,
      accountName,
      email,
      password,
    );

    res.status(200).json(response);
  },
};
