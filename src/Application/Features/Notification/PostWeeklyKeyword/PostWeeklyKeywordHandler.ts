import { notificationService } from '../../../../Infrastructure/Service/notificationService.js';
import { PostWeeklyKeyword } from './Types/api.js';

export const postWeeklyKeywordHandler = {
  handle: async (): Promise<PostWeeklyKeyword.IPostWeeklyKeywordResponse> => {
    const result =
      await notificationService.postWeeklyKeywordNotificationEmail();
    return result;
  },
};
