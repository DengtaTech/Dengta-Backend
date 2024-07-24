import express from 'express';
import { userController } from '../Controller/userController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { verifyToken } from '../Middlewares/auth.js';

const router = express.Router();

router.post('/signup', wrapAsync(userController.signUp));

/*
need middleware to check if user is authenticated
*/
router.get('/info', verifyToken, wrapAsync(userController.getUserInfo));

export default router;
