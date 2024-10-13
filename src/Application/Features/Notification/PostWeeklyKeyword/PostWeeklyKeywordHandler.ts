import { notificationService } from '../../../../Infrastructure/Service/notificationService.js';
import { PostWeeklyKeyword } from './Types/api.js';

export const postWeeklyKeywordHandler = {
  handle: async (
    body: PostWeeklyKeyword.IPostWeeklyKeywordReq,
  ): Promise<PostWeeklyKeyword.IPostWeeklyKeywordResponse> => {
    const result =
      await notificationService.postWeeklyKeywordNotificationEmail(body);
    return result;
  },
};
