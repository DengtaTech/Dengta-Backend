import { Notification } from '../../../../Database/Entities/notification.js';
import { NotificationRetrieve } from './Types/api.js';

export const getNotificationRes = {
  customize: async (
    result: Notification[],
  ): Promise<NotificationRetrieve.INotificationRetrieveRes> => {
    const response = {
      data: {
        notifications: result.map((notification) => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          content: notification.content,
          isRead: notification.isRead,
          userId: notification.userId,
          createdAt: notification.createdAt,
          relatedUser: notification.relatedUser
            ? {
                id: notification.relatedUser.id,
                avatar: notification.relatedUser.avatar,
                fullName: notification.relatedUser.fullName,
              }
            : null,
          relatedFootprint: notification.relatedFootprint
            ? {
                id: notification.relatedFootprint.id,
                title: notification.relatedFootprint.title,
                milestone: notification.relatedFootprint.milestone,
              }
            : null,
        })),
      },
    };
    return response;
  },
};
