import http from 'k6/http';
import { check, group } from 'k6';

export default function signup() {
  let token;

  group('signup', () => {
    let uniqueTimestamp = Date.now();

    const payload = JSON.stringify({
      firstName: 'Josh',
      lastName: 'Tu',
      fullName: 'Josh Tu',
      lifeRole: '平凡大學生',
      birthday: '1990-01-01',
      gender: 'male',
      email: `joshtu${uniqueTimestamp}@gmail.com`, // 唯一的 email
      provider: 'native',
      password: 'test',
      links: [],
      clerkId: `user_${uniqueTimestamp}`,
    });

    const params = {
      headers: { 'Content-Type': 'application/json' },
    };

    let res = http.post(
      `http://localhost:${__ENV.EXPRESS_PORT}/api/1.0/user/signup`,
      payload,
      params,
    );

    check(res, { 'status was 200': (r) => r.status === 200 });

    token = JSON.parse(res.body).data.accessToken;
  });

  return token;
}
