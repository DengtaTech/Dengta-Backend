import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';
import { bowlController } from '../Controller/bowlController.js';

const router = express.Router();
router.get(
  '/all/:targetId',
  jwtAuthentication,
  wrapAsync(bowlController.getBowlList),
);

router.post('/', jwtAuthentication, wrapAsync(bowlController.publishBowl));
router.post('/:bowlId/push', jwtAuthentication, wrapAsync(bowlController.push));

export default router;
