import express from 'express';
import { userController } from '../Controller/userController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';
import { upload } from '../Middlewares/multer.js';

const router = express.Router();

router.post('/signup', wrapAsync(userController.signUp));
router.post('/signin', wrapAsync(userController.signIn));

router.get('/info', jwtAuthentication, wrapAsync(userController.getUserInfo));
router.patch(
  '/info',
  jwtAuthentication,
  wrapAsync(userController.patchUserInfo),
);
router.get(
  '/:userId/info',
  jwtAuthentication, // 還是驗證 token
  wrapAsync(userController.getOthersInfo),
);

router.post(
  '/avatar',
  [jwtAuthentication, upload.single('avatar')],
  wrapAsync(userController.uploadAvatar),
);

router.post(
  '/:followeeId/follow',
  jwtAuthentication,
  wrapAsync(userController.follow),
);

router.delete(
  '/:followeeId/follow',
  jwtAuthentication,
  wrapAsync(userController.unFollow),
);

export default router;
