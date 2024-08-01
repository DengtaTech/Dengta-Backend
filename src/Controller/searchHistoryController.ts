import { Request, Response } from 'express';
import { getSearchHistoryHandler } from '../Application/Features/SearchHistory/Queries/GetHistory/GetHistoryHandler.js';
import {
  InputEmptyError,
  NoTokenError,
  WrongTokenError,
} from '../Errors/errors.js';
import { clearSearchHistoryHandler } from '../Application/Features/SearchHistory/Commands/ClearSearch/clearHistoryHandler.js';
import { searchHandler } from '../Application/Features/SearchHistory/Commands/Search/searchHandler.js';

export const searchHistoryController = {
  getSearchHistory: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const userIdInt = Number(userId);
    if (
      Number.isNaN(userIdInt) ||
      !Number.isInteger(userIdInt) ||
      userIdInt <= 0
    ) {
      throw new WrongTokenError();
    }
    res.status(200).json(await getSearchHistoryHandler.handle({ userId }));
  },
  clearSearchHistory: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const userIdInt = Number(userId);
    if (
      Number.isNaN(userIdInt) ||
      !Number.isInteger(userIdInt) ||
      userIdInt <= 0
    ) {
      throw new WrongTokenError();
    }
    res.status(200).json(await clearSearchHistoryHandler.handle({ userId }));
  },
  search: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const userIdInt = Number(userId);
    if (
      Number.isNaN(userIdInt) ||
      !Number.isInteger(userIdInt) ||
      userIdInt <= 0
    ) {
      throw new WrongTokenError();
    }
    if (!req.body.content) {
      throw new InputEmptyError();
    }
    res
      .status(200)
      .json(await searchHandler.handle({ userId, content: req.body.content }));
  },
};
