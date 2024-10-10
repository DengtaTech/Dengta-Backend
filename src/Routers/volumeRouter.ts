import express from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { volumeController } from '../Controller/volumeController.js';

const router = express.Router();
router.get('/mention', wrapAsync(volumeController.getMention));

export default router;
