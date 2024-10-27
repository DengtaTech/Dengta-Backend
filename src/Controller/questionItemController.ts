import { Request, Response } from 'express';
import { InvalidInputError, NoTokenError } from '../Errors/errors.js';
import { insertResponseHandler } from '../Application/Features/QuestionItem/InsertResponse/insertResponseHandler.js';
import { getAllQuestionItemsHandler } from '../Application/Features/QuestionItem/GetAllQuestionItems/getAllQuestionItemsHandler.js';
import { validateInsertResponseReqBody } from '../Application/Features/QuestionItem/InsertResponse/Types/insertResDto.js';
import { checkFillOrNotHandler } from '../Application/Features/QuestionItem/CheckFillOrNot/checkFillOrNotHandler.js';
export const questionItemController = {
  insertQuestionResponse: async (req: Request, res: Response) => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const userId = req.decodedToken.id;
    const validationErrors = await validateInsertResponseReqBody(req.body);
    if (validationErrors.length > 0) {
      throw new InvalidInputError(validationErrors.join(', '));
    }
    const response = await insertResponseHandler.handle(userId, req.body);
    res.status(200).json(response);
  },
  getAllQuestionItems: async (req: Request, res: Response) => {
    const response = await getAllQuestionItemsHandler.handle();
    res.status(200).json(response);
  },
  checkFill: async (req: Request, res: Response) => {
    if (req.decodedToken === undefined) {
      throw new NoTokenError();
    }
    const userId = req.decodedToken.id;
    const response = await checkFillOrNotHandler.handle(userId);
    res.status(200).json(response);
  },
};
