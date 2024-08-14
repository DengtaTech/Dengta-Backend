import { Followship } from '../../../../Database/Entities/followship.js';
import { UserFollow } from './Types/api.js';

export const followRes = {
  customize: (followship: Followship): UserFollow.IFollowRes => {
    return;
  },
};
