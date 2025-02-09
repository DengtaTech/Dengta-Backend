import { notificationService } from '../../../../Infrastructure/Service/notificationService.js';

export const readNotificationHandler = {
  handle: async (notificationId: string): Promise<void> => {
    await notificationService.readNotification(notificationId);
  },
};
