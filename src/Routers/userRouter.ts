import express from 'express';
import { userController } from '../Controller/userController.js';
import wrapAsync from '../utils/wrapAsync.js';

const router = express.Router();

router.post('/signup', wrapAsync(userController.signUp));
router.post('/signin', wrapAsync(userController.signIn));

export default router;
