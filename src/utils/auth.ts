import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { errorMsg } from './errorMsg.js';
export const auth = {
    generateAccessToken: async (userId: number): Promise<Signup.IJwtTokenObject> => {
        const secretKey = process.env.JWT_SECRET as string;
        const payload = { id: userId };
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
        const tokenInfo: Signup.IJwtTokenObject = { 
            token: token,
            expire: `${60 * 60 * 24}`
        };
        return tokenInfo;

    },
    verifyToken: async (req: Request, res: Response<Dengta.oError>, next: NextFunction) => {
        const token = req.headers.authorization;
        console.log(token);
        try {
            if (!token) {
                errorMsg.noToken(res);
                return;
            }
            const pureToken = token.split(' ')[1];
            const decodedToken = jwt.verify(pureToken, process.env.JWT_SECRET as string);
            req.body.decodedToken = decodedToken;
            next();
        } catch (error) {
            console.error(error);
            return errorMsg.wrongToken(res);
        }

    }

}