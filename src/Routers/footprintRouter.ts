import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { footprintController } from '../Controller/footprintController.js';
import { jwtAuthentication } from '../Middlewares/auth.js';

const router = express.Router();

router.put('/emotion', jwtAuthentication, wrapAsync(footprintController.emotion));

export default router;
