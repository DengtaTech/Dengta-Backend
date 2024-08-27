import { Router } from 'express';
import { questionItemController } from '../Controller/questionItemController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';

const questionRouter = Router();

// Route to insert a question response
questionRouter.post(
  '/:questionItemId',
  jwtAuthentication,
  wrapAsync(questionItemController.insertQuestionResponse),
);

// Additional routes can be added here

export default questionRouter;
