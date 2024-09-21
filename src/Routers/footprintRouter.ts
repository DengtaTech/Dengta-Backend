import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { footprintController } from '../Controller/footprintController.js';
import { jwtAuthentication } from '../Middlewares/auth.js';
import { upload } from '../Middlewares/multer.js';

const router = express.Router();
router.get(
  '/detail/:footprintId',
  jwtAuthentication,
  wrapAsync(footprintController.getFootprintDetail),
);

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

router.patch(
  '/setting',
  jwtAuthentication,
  wrapAsync(footprintController.patchFootprintSetting),
);

router.post(
  '/titleImg',
  [jwtAuthentication, upload.single('titleImg')],
  wrapAsync(footprintController.uploadFootprintHeadImg),
);

router.delete(
  '/delete',
  jwtAuthentication,
  wrapAsync(footprintController.deleteFootprint),
);
export default router;
