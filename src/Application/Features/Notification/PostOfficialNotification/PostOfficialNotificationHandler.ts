import { notificationService } from '../../../../Infrastructure/Service/notificationService.js';
import { PostOfficialNotification } from './Types/api.js';

export const postOfficialNotificationHandler = {
  handle: async (
    body: PostOfficialNotification.IPostOfficialNotificationReq,
  ): Promise<PostOfficialNotification.IPostOfficialNotificationResponse> => {
    const result = await notificationService.postOfficialNotification(body);

    return result;
  },
};
