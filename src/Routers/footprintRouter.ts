import express from 'express';
import { footprintController } from '../Controller/footprintController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';


const router = express.Router();

router.post(
  '/init',
  jwtAuthentication,
  wrapAsync(footprintController.initFootprint),
);

export default router;
