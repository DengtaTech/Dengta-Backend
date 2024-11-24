// src/rateLimiter.ts

import { Request, Response, NextFunction } from 'express';

import { readFileSync } from 'fs';
import { join } from 'path';
import path from 'path';
import { redisClient } from '../Database/Cache/redisClient.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RATE_LIMIT_WINDOW_SIZE = 1;
const RATE_LIMIT_MAX_REQUESTS = 20;
const luaScript = readFileSync(
  join(__dirname, '../utils/rateLimit.lua'),
  'utf8',
);

// 預加載 Lua 腳本
let scriptSha: string | null = null;

redisClient
  .script('LOAD', luaScript)
  .then((sha) => {
    scriptSha = sha as string;
  })
  .catch((error) => {
    console.error('Failed to load Lua script:', error);
  });

// 限流中間件
export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!scriptSha) {
      // 如果腳本尚未加載，等待一段時間
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (!scriptSha) {
        throw new Error('Lua script SHA not available');
      }
    }

    const key = `rate_limit:${req.ip}`;
    const now = Math.floor(Date.now() / 1000); // 獲取當前時間戳（秒）

    const allowed = await redisClient.evalsha(
      scriptSha,
      1,
      key,
      now.toString(),
      RATE_LIMIT_WINDOW_SIZE.toString(),
      RATE_LIMIT_MAX_REQUESTS.toString(),
    );

    if (allowed === 1) {
      next();
    } else {
      res
        .status(429)
        .json({ message: 'Too many requests, please try again later.' });
    }
  } catch (error) {
    console.error('Rate Limiter Error:', error);
    // 在出現錯誤時，允許請求繼續
    next();
  }
};
