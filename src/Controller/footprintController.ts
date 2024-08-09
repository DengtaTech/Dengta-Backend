import { Request, Response } from 'express';
import {
  InputEmptyError,
  InvalidInputError,
  NoTokenError,
} from '../Errors/errors.js';
import { initFootprintHandler } from '../Application/Features/Footprint/InitFootprint/initFootprintHandler.js';
import { uploadFootprintHeadImgHandler } from '../Application/Features/Footprint/UploadFootprintHeadImg/uploadFootprintHeadImgHandler.js';
import { validatePublishFootprintReqBody } from '../Application/Features/Footprint/PublishFootprint/Types/publishFootprintDto.js';
import { PublishFootprint } from '../Application/Features/Footprint/PublishFootprint/Types/api.js';
import { publishFootprintHandler } from '../Application/Features/Footprint/PublishFootprint/publishFootprintHandler.js';

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
  publishFootprint: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;
    const validationErrors = await validatePublishFootprintReqBody(req.body);
    if (validationErrors.length > 0) {
      throw new InvalidInputError(validationErrors.join(', '));
    }

    const response = await publishFootprintHandler.handle(
      userId,
      req.body as PublishFootprint.IPublishFootprintReqBody,
    );
    res.status(200).json(response);
  },
  uploadFootprintHeadImg: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }

    const file = req.file;
    const { footprintId } = req.body;

    if (!file) {
      res.status(400).send({ message: 'Please upload an image file.' });
      return;
    }
    const response = await uploadFootprintHeadImgHandler.handle(
      footprintId,
      file,
    );
    res.status(200).json(response);
  },
};
