import { Request, Response } from 'express';
import { getMentionHandler } from '../Application/Features/Volume/Mention/getMention/getMentionHandler.js';

export const volumeController = {
  getMention: async (req: Request, res: Response): Promise<void> => {
    const response = await getMentionHandler.handle();
    res.status(200).json({
      data: response,
    });
  },
};
