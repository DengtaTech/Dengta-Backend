import express from 'express';
import { searchHistoryController } from '../Controller/searchHistoryController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { verifyToken } from '../Middlewares/auth.js';

const router = express.Router();

router.get(
  '/',
  verifyToken,
  wrapAsync(searchHistoryController.getSearchHistory),
);

router.delete(
  '/',
  verifyToken,
  wrapAsync(searchHistoryController.clearSearchHistory),
);

router.post('/', verifyToken, wrapAsync(searchHistoryController.search));

export default router;
