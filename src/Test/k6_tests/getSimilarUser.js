import http from 'k6/http';
import { check, group } from 'k6';

const goalData = [
  '後端工程師。',
  '軟體工程師。',
  '資料科學家。',
  '更出色的美術創作者。',
  '資料科學家。',
  '資料分析師。',
  '商業攝影師。',
  '組織發展顧問。',
  'AI工程師。',
  '環境顧問。',
  '無人駕駛技術專家。',
  '後端工程師，專精於Node.js。',
];

export default function getSimilarUser(token) {
  group('getSimilarUser', () => {
    const getSimilarUserPayload = JSON.stringify({
      goal: goalData[__VU % goalData.length],
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const getSimilarUserRes = http.post(
      `${__ENV.BACKEND_DOMAIN}/api/1.0/recommendation/similar_users`,
      getSimilarUserPayload,
      params,
    );

    check(getSimilarUserRes, {
      'get similer user was 200': (r) => r.status === 200,
    });
  });
}
