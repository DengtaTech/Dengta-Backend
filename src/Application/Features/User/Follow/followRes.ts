import { UserFollow } from './Types/api.js';

export const followRes = {
  customize: async (): Promise<UserFollow.IFollowResponse> => {
    return {
      data: {
        message: 'follow success',
      },
    };
  },
};
