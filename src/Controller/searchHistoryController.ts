import { Request, Response } from 'express';
import { getSearchHistoryHandler } from '../Application/Features/SearchHistory/GetHistory/GetHistoryHandler.js';
import { InputEmptyError, NoTokenError } from '../Errors/errors.js';
import { clearSearchHistoryHandler } from '../Application/Features/SearchHistory/ClearSearch/clearHistoryHandler.js';
import { searchHandler } from '../Application/Features/SearchHistory/Search/searchHandler.js';

export const searchHistoryController = {
  getSearchHistory: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    res.status(200).json(await getSearchHistoryHandler.handle({ userId }));
  },
  clearSearchHistory: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    res.status(200).json(await clearSearchHistoryHandler.handle({ userId }));
  },
  search: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    if (!req.body.content) {
      throw new InputEmptyError();
    }
    res
      .status(200)
      .json(await searchHandler.handle({ userId, content: req.body.content }));
  },
};
