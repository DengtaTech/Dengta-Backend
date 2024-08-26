import { Request, Response } from 'express';
import { getNotificationHandler } from '../Application/Features/Notification/GetNotification/GetNotificationHandler.js';
import { postOfficialNotificationHandler } from '../Application/Features/Notification/PostOfficialNotification/PostOfficialNotificationHandler.js';
import { NoTokenError, InputEmptyError } from '../Errors/errors.js';

export const notificationController = {
  getNotification: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const { page } = req.query;

    res
      .status(200)
      .json(
        await getNotificationHandler.handle({ userId, page: Number(page) }),
      );
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
};
