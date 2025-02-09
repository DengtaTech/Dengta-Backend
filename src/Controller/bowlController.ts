import { Request, Response } from 'express';
import {
  InputEmptyError,
  InvalidInputError,
  NoTokenError,
} from '../Errors/errors.js';
import { publishBowlHandler } from '../Application/Features/Bowl/PublishBowl/publishBowlHandler.js';
import { getBowlListHandler } from '../Application/Features/Bowl/GetBowlList/getBowlListHandler.js';
import { pushHandler } from '../Application/Features/Bowl/Push/pushHandler.js';
import { acceptBowlHandler } from '../Application/Features/Bowl/AcceptBowl/acceptBowlHandler.js';

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
  getBowlList: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const { targetId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    if (page < 0) {
      throw new InvalidInputError('page must be a positive integer');
    }

    const response = await getBowlListHandler.handle(userId, targetId, page);
    res.status(200).json(response);
  },
  push: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const { bowlId } = req.params;
    const response = await pushHandler.handle(userId, bowlId);
    res.status(200).json(response);
  },
  acceptBowl: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const { bowlId } = req.params;
    const response = await acceptBowlHandler.handle(userId, bowlId);
    res.status(200).json(response);
  },
};
