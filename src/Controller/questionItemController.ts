import { Request, Response } from 'express';
import { NoTokenError } from '../Errors/errors.js';
import { MUserQuestionItem } from '../Database/Entities/mUserQuestionItem.js';
import { insertResponseHandler } from '../Application/Features/QuestionItem/InsertResponse/insertResponseHandler.js';
export const questionItemController = {
  insertQuestionResponse: async (req: Request, res: Response) => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const userId = req.decodedToken.id;
    const questionItemId = parseInt(req.params.questionItemId);
    const userResponse: MUserQuestionItem['response'] =
      req.body.response || null;
    const response = await insertResponseHandler.handle(
      userId,
      questionItemId,
      userResponse,
    );
    res.status(200).json(response);
  },
};
