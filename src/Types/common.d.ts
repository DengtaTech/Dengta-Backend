import { JwtPayload } from 'jsonwebtoken';

declare namespace Dengta {
  type TJwtTokenPayload = JwtPayload & {
    id: string;
  };

  interface IJwtTokenObject {
    token: string;
    expire: string;
  }
}
