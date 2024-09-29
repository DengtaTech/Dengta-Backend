import { UnauthorizedError } from '../../Errors/errors.js';
import { notificationRepo } from '../Repository/notificationRepo.js';
import { NotificationRetrieve } from '../../Application/Features/Notification/GetNotification/Types/api.js';
import { PostOfficialNotification } from '../../Application/Features/Notification/PostOfficialNotification/Types/api.js';
import { userRepo } from '../Repository/userRepo.js';
import { Notification } from '../../Database/Entities/notification.js';

export const notificationService = {
  getNotificationByUserId: async (
    body: NotificationRetrieve.INotificationRetrieveReq,
  ): Promise<NotificationRetrieve.INotificationDto> => {
    try {
      const notifications = await notificationRepo.findByUserId(
        body.userId,
        body.page,
      );
      return notifications;
    } catch (error) {
      console.error('Error getting notifications by user id:');
      throw error;
    }
  },
  postOfficialNotification: async (
    body: PostOfficialNotification.IPostOfficialNotificationReq,
  ): Promise<PostOfficialNotification.IPostOfficialNotificationResponse> => {
    try {
      const userRoles = await userRepo.getUserRoles(body.senderId);

      if (userRoles.some((role) => role.name === 'admin') === false) {
        throw new UnauthorizedError();
      }

      const allUsers = await userRepo.getAllUsers();

      Promise.all(
        allUsers.map(async (user) => {
          const notification = new Notification();
          notification.title = body.title;
          notification.type = 'system';
          notification.content = body.content;
          notification.user = user;

          await notificationRepo.insertNewNotification(notification);
        }),
      );
    } catch (error) {
      console.error('Error posting official notification:');
      throw error;
    }

    return {
      data: {
        success: true,
        message: 'Notification sent to all users',
      },
    };
  },
};
