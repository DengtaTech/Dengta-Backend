import { init } from './lib.js';
import { User, UserInfo } from './Entities/user.js';

export function initDbCache() {
  init(User, UserInfo);
}
