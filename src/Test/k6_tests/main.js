import { sleep } from 'k6';
import signup from './signup.js';
import postFootprint from './postFootprint.js';
import getSimilarUser from './getSimilarUser.js';
import searchKeyword from './search.js';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // 在 30 秒內將虛擬用戶增加到 10
    { duration: '1m', target: 40 }, // 持續 1 分鐘，保持 10 個虛擬用戶
    { duration: '30s', target: 0 }, // 最後在 30 秒內將虛擬用戶數降至 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% 的請求在 1000 毫秒內完成
  },
};

export function setup() {
  const tokens = [];
  for (let i = 0; i < 50; i++) {
    const token = signup();
    tokens.push(token);
  }
  return tokens;
}

export default function main(tokens) {
  const vuId = __VU;
  const token = tokens[vuId];

  postFootprint(token);

  sleep(3);

  getSimilarUser(token);

  sleep(3);

  searchKeyword(token);

  sleep(3);
}
