import http from 'k6/http';
import { check, group } from 'k6';

export default function searchKeyword(token) {
  group('searchKeyword', () => {
    const searchKeywordPayload = JSON.stringify({
      content: '後端工程師',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const searchKeywordRes = http.post(
      `${__ENV.BACKEND_DOMAIN}/api/1.0/search`,
      searchKeywordPayload,
      params,
    );

    check(searchKeywordRes, {
      'search keyword was 200': (r) => r.status === 200,
    });
  });
}
