import { Request, Response } from 'express';
import {
  InputEmptyError,
  InvalidInputError,
  NoTokenError,
} from '../Errors/errors.js';
import { nativeReactions } from '../Application/Features/Footprint/Reaction/Types/reactions.js';
import { footprintReactionHandler } from '../Application/Features/Footprint/Reaction/reactionHandler.js';
import { initFootprintHandler } from '../Application/Features/Footprint/InitFootprint/initFootprintHandler.js';
import { uploadFootprintHeadImgHandler } from '../Application/Features/Footprint/UploadFootprintHeadImg/uploadFootprintHeadImgHandler.js';
import { validatePublishFootprintReqBody } from '../Application/Features/Footprint/PublishFootprint/Types/publishFootprintDto.js';
import { PublishFootprint } from '../Application/Features/Footprint/PublishFootprint/Types/api.js';
import { publishFootprintHandler } from '../Application/Features/Footprint/PublishFootprint/publishFootprintHandler.js';
import { validatePatchFootprintSettingReqBody } from '../Application/Features/Footprint/UpdateFootprintSetting/Types/patchFootprintSettingDto.js';
import { PatchFootprintSetting } from '../Application/Features/Footprint/UpdateFootprintSetting/Types/api.js';
import { patchFootprintSettingHandler } from '../Application/Features/Footprint/UpdateFootprintSetting/UpdateFootprintSettingHandler.js';
import { deleteFootprintHandler } from '../Application/Features/Footprint/DeleteFootprint/deleteFootprintHandler.js';
import { getFootprintDetailHandler } from '../Application/Features/Footprint/GetFootprintDetail/GetFootprintDetailHandler.js';

export const footprintController = {
  getFootprintDetail: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    const { footprintId } = req.params;
    if (!footprintId) {
      throw new InputEmptyError();
    }

    const response = await getFootprintDetailHandler.handle(footprintId);
    res.status(200).json(response);
  },
  emotion: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { id: userId } = req.decodedToken;

    const { footprintId } = req.body;
    if (!footprintId) {
      throw new InputEmptyError();
    }

    const reaction = req.body.reaction;
    if (reaction !== 'empty' && nativeReactions.includes(reaction) === false) {
      throw new InvalidInputError('Reaction is not valid');
    }

    const response = await footprintReactionHandler.handle({
      userId,
      footprintId,
      reaction,
    });
    res.status(200).json(response);
  },
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
    const validationErrors = await validatePublishFootprintReqBody(req.body);
    if (validationErrors.length > 0) {
      throw new InvalidInputError(validationErrors.join(', '));
    }

    const response = await publishFootprintHandler.handle(
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
  patchFootprintSetting: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }

    const validationErrors = await validatePatchFootprintSettingReqBody(
      req.body,
    );
    if (validationErrors.length > 0) {
      throw new InvalidInputError(validationErrors.join(', '));
    }

    const response = await patchFootprintSettingHandler.handle(
      req.body as PatchFootprintSetting.PatchFootprintSettingReqBody,
    );
    res.status(200).json(response);
  },
  deleteFootprint: async (req: Request, res: Response): Promise<void> => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const { footprintId } = req.body;
    if (!footprintId) {
      throw new InputEmptyError();
    }
    // 不確定要不要檢查 userId 是否是作者

    const response = await deleteFootprintHandler.handle(footprintId);
    res.status(200).json(response);
  },
};
