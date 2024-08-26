import express from 'express';
import { recommendationController } from '../Controller/recommendationController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';

const router = express.Router();

router.post(
  '/similar_users',
  jwtAuthentication,
  wrapAsync(recommendationController.getSimilarUsers),
);

export default router;
