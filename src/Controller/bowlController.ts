import { Request, Response } from 'express';
import { InputEmptyError, NoTokenError } from '../Errors/errors.js';
import { publishBowlHandler } from '../Application/Features/Bowl/PublishBowl/publishBowlHandler.js';

export const bowlController = {
  publishBowl: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: commenterId } = req.decodedToken;
    const { authorId, comment } = req.body;
    if (!authorId || !comment) {
      throw new InputEmptyError();
    }

    const response = await publishBowlHandler.handle(
      commenterId,
      authorId,
      comment,
    );
    res.status(200).json(response);
  },
};
