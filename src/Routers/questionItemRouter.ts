import { Router } from 'express';
import { questionItemController } from '../Controller/questionItemController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';

const questionRouter = Router();

questionRouter.post(
  '/response',
  jwtAuthentication,
  wrapAsync(questionItemController.insertQuestionResponse),
);

questionRouter.get('/', wrapAsync(questionItemController.getAllQuestionItems));

export default questionRouter;
