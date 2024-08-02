import { Request, Response } from 'express';
import { InputEmptyError, NoTokenError } from '../Errors/errors.js';
import { getSimilarUserHandler } from '../Application/Features/Recommendation/GetSimilarUser/getSimilarUserHandler.js';

export const recommendationController = {
  getSimilarUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.decodedToken === undefined) {
        throw new NoTokenError();
      }
      const { id: userId } = req.decodedToken;

      const { goal } = req.body;
      if (!userId || !goal) {
        throw new InputEmptyError();
      }
      const response = await getSimilarUserHandler.getSimilarUser({
        userId,
        goal,
      });

      res.status(200).json(response);
    } catch (error) {
      console.log(error);
    }
  },
};
