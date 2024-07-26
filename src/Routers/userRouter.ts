import express from 'express';
import { userController } from '../Controller/userController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { verifyToken } from '../Middlewares/auth.js';

const router = express.Router();

router.post('/signup', wrapAsync(userController.signUp));


router.get('/info', verifyToken, wrapAsync(userController.getUserInfo));

// TODO: Implement the following routes
// router.patch('/info', verifyToken, wrapAsync(userController.updateUserInfo));
// router.patch('/avatar', verifyToken, wrapAsync(userController.updateAvatar));



export default router;
