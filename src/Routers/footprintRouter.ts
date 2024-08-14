import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { footprintController } from '../Controller/footprintController.js';
import { jwtAuthentication } from '../Middlewares/auth.js';
import { upload } from '../Middlewares/multer.js';

const router = express.Router();

router.put(
  '/emotion',
  jwtAuthentication,
  wrapAsync(footprintController.emotion),
);

router.post(
  '/init',
  jwtAuthentication,
  wrapAsync(footprintController.initFootprint),
);

router.post(
  '/publish',
  jwtAuthentication,
  wrapAsync(footprintController.publishFootprint),
);

router.post(
  '/titleImg',
  [jwtAuthentication, upload.single('titleImg')],
  wrapAsync(footprintController.uploadFootprintHeadImg),
);

export default router;
