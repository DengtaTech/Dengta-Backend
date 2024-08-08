import { Request, Response } from 'express';
import { InputEmptyError, NoTokenError } from '../Errors/errors.js';
import { initFootprintHandler } from '../Application/Features/Footprint/InitFootprint/initFootprintHandler.js';

export const footprintController = {
  initFootprint: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const { status } = req.body;

    if (!status) {
      throw new InputEmptyError();
    }
    const response = await initFootprintHandler.handle(userId, status);
    res.status(200).json(response);
  },
};
