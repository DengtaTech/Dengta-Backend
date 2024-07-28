import express from 'express';
import { userController } from '../Controller/userController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';
import { upload } from '../Middlewares/multer.js';

const router = express.Router();

router.post('/signup', wrapAsync(userController.signUp));
router.post('/signin', wrapAsync(userController.signIn));

router.get('/info', jwtAuthentication, wrapAsync(userController.getUserInfo));

router.post(
  '/avatar',
  [jwtAuthentication, upload.single('avatar')],
  wrapAsync(userController.uploadAvatar),
);

export default router;
