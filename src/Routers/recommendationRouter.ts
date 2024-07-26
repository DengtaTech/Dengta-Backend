import express from 'express';
import { recommendationController } from '../Controller/recommendationController.js';
import wrapAsync from '../utils/wrapAsync.js';

const router = express.Router();

router.post(
  '/similar_users',
  wrapAsync(recommendationController.getSimilarUsers),
);

export default router;
