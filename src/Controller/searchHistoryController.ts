import { Request, Response } from 'express';
import { getSearchHistoryHandler } from '../Application/Features/SearchHistory/Queries/GetHistory/GetHistoryHandler.js';
import { WrongTokenError } from '../Errors/errors.js';
import { clearSearchHistoryHandler } from '../Application/Features/SearchHistory/Commands/ClearSearch/clearHistoryHandler.js';

export const searchHistoryController = {
  getSearchHistory: async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.body.decodedToken.id);
    if (Number.isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
      throw new WrongTokenError();
    }
    res.status(200).json(await getSearchHistoryHandler.handle({ userId }));
  },
  clearSearchHistory: async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.body.decodedToken.id);
    if (Number.isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
      throw new WrongTokenError();
    }
    res.status(200).json(await clearSearchHistoryHandler.handle({ userId }));
  },
};
