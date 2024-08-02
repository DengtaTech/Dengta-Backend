import express from 'express';
import { searchHistoryController } from '../Controller/searchHistoryController.js';
import wrapAsync from '../utils/wrapAsync.js';
import { jwtAuthentication } from '../Middlewares/auth.js';

const router = express.Router();

router.get(
  '/',
  jwtAuthentication,
  wrapAsync(searchHistoryController.getSearchHistory),
);

router.delete(
  '/',
  jwtAuthentication,
  wrapAsync(searchHistoryController.clearSearchHistory),
);

router.post('/', jwtAuthentication, wrapAsync(searchHistoryController.search));

export default router;
