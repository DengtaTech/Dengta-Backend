import { notificationService } from '../../../../Infrastructure/Service/notificationService.js';
import { getNotificationRes } from './GetNotificationRes.js';
import { NotificationRetrieve } from './Types/api.js';

export const getNotificationHandler = {
  handle: async (
    body: NotificationRetrieve.INotificationRetrieveReq,
  ): Promise<NotificationRetrieve.INotificationRetrieveRes> => {
    const result = await notificationService.getNotificationByUserId(body);

    return getNotificationRes.customize(result);
  },
};
