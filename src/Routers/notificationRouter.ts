import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { notificationController } from '../Controller/notificationController.js';
import { jwtAuthentication } from '../Middlewares/auth.js';

const router = express.Router();

router.get(
  '/',
  jwtAuthentication,
  wrapAsync(notificationController.getNotification),
);

router.post(
  '/official',
  jwtAuthentication,
  wrapAsync(notificationController.postOfficialNotification),
);

router.post(
  '/keyword',
  jwtAuthentication,
  wrapAsync(notificationController.postWeeklyKeywordNotification),
);

export default router;
