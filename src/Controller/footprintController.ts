import { Request, Response } from 'express';
import { InputEmptyError, NoTokenError } from '../Errors/errors.js';


export const footprintController = {
  initFootprint: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    // res.status(200).json(await );

  }
};
