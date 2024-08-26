import { notificationService } from '../../../../Infrastructure/Service/notificationService.js';
import { NotificationRetrieve } from './Types/api.js';

export const getNotificationHandler = {
  handle: async (
    body: NotificationRetrieve.INotificationRetrieveReq,
  ): Promise<NotificationRetrieve.INotificationRetrieveRes> => {
    const result = await notificationService.getNotificationByUserId(body);
    return { data: { notifications: result } };
  },
};
