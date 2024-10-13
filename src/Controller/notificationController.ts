import { Request, Response } from 'express';
import { getNotificationHandler } from '../Application/Features/Notification/GetNotification/GetNotificationHandler.js';
import { postOfficialNotificationHandler } from '../Application/Features/Notification/PostOfficialNotification/PostOfficialNotificationHandler.js';
import { postWeeklyKeywordHandler } from '../Application/Features/Notification/PostWeeklyKeyword/PostWeeklyKeywordHandler.js';
import {
  NoTokenError,
  InputEmptyError,
  InvalidInputError,
} from '../Errors/errors.js';

export const notificationController = {
  getNotification: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    const page = parseInt(req.query.page as string) || 1;

    if (page < 0) {
      throw new InvalidInputError('page must be a positive integer');
    }
    res
      .status(200)
      .json(await getNotificationHandler.handle({ userId, page: page }));
  },
  postOfficialNotification: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: senderId } = req.decodedToken;
    const { title, content } = req.body;

    if (!title || !content) {
      throw new InputEmptyError();
    }

    const response = await postOfficialNotificationHandler.handle({
      senderId,
      title,
      content,
    });

    res.status(201).json(response);
  },
  postWeeklyKeywordNotification: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    res.status(201).json(
      await postWeeklyKeywordHandler.handle({
        senderId: userId,
      }),
    );
  },
};
