import express from 'express';
import { footprintController } from '../Controller/footprintController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';
import { upload } from '../Middlewares/multer.js';
const router = express.Router();

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
