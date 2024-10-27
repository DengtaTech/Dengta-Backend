import http from 'k6/http';
import { check, group } from 'k6';

const goalData = [
  '我希望成為一名後端工程師。',
  '我希望成為一名軟體工程師。',
  '我希望成為一名資料科學家。',
  '我希望成為一名更出色的美術創作者。',
  '我希望成為一名資料科學家。',
  '我希望成為一名資料分析師。',
  '我希望成為一名商業攝影師。',
  '我希望成為一名組織發展顧問。',
  '我希望成為一名AI工程師。',
  '我希望成為一名環境顧問。',
  '我希望成為一名無人駕駛技術專家。',
  '我希望成為一名後端工程師，專精於Node.js。',
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
      `http://localhost:${__ENV.EXPRESS_PORT}/api/1.0/recommendation/similar_users`,
      getSimilarUserPayload,
      params,
    );

    check(getSimilarUserRes, {
      'get similer user was 200': (r) => r.status === 200,
    });
  });
}
