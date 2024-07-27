import { JwtPayload } from 'jsonwebtoken';

declare namespace Dengta {
  type TJwtTokenObject = JwtPayload & {
    id: string;
  };
}
