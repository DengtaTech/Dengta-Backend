import express from 'express';
import { searchHistoryController } from '../Controller/searchHistoryController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { auth } from '../utils/auth.js';

const router = express.Router();

router.get(
  '/',
  auth.verifyToken,
  wrapAsync(searchHistoryController.getSearchHistory),
);

router.delete(
  '/',
  auth.verifyToken,
  wrapAsync(searchHistoryController.clearSearchHistory),
);

export default router;
