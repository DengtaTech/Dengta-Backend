import { JwtPayload } from 'jsonwebtoken';
import { Link } from '../Database/Entities/link.js';
declare namespace Dengta {
  type TJwtTokenPayload = JwtPayload & {
    id: string;
  };

  interface IJwtTokenObject {
    token: string;
    expire: string;
  }
  type ILink = Pick<Link, 'sourceName' | 'url'>;
}
