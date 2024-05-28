import { signUpHandler } from "../Application/Features/User/Commands/SignUp/signUpHandler.js";
import { Request, Response } from "express";
import { errorMsg } from "../utils/errorMsg.js";
import { tool } from "../utils/tool.js";

export const userController = {
    signUp: async (req: Request, res: Response): Promise<void> => {
        try {
            const { realName, accountName, email, password } = req.body;
            if (!realName || !accountName || !email || !password) {
                errorMsg.inputEmpty(res);
                return;
            }
            console.log("test return");
            if (!await tool.checkEmail(email)) {
                errorMsg.emailFormat(res);
                return;
            }
            const response = await signUpHandler.handle(res, realName, accountName, email, password);
            if(response) res.status(200).json(response);
            
        } catch (error) {
            errorMsg.serverError(res);
            console.error(error)
        }

    }
}