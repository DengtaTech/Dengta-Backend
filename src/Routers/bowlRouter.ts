import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';
import { bowlController } from '../Controller/bowlController.js';

const router = express.Router();

router.post('/', jwtAuthentication, wrapAsync(bowlController.publishBowl));
router.get(
  '/all/:userId',
  jwtAuthentication,
  wrapAsync(bowlController.getBowlList),
);

export default router;
