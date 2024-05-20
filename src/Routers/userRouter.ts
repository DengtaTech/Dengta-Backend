import express from 'express';
import { userController } from '../Controller/userController.js';

const router = express.Router();

router.post('/signup', userController.signUp);

export default router;