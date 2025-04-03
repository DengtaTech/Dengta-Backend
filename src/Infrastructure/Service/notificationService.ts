import {
  NotificationNotFoundError,
  UnauthorizedError,
} from '../../Errors/errors.js';
import { notificationRepo } from '../Repository/notificationRepo.js';
import { NotificationRetrieve } from '../../Application/Features/Notification/GetNotification/Types/api.js';
import { PostOfficialNotification } from '../../Application/Features/Notification/PostOfficialNotification/Types/api.js';
import { userRepo } from '../Repository/userRepo.js';
import {
  Notification,
  notificationTypes,
} from '../../Database/Entities/notification.js';
import { emailService } from './emailService.js';
import { PostWeeklyKeyword } from '../../Application/Features/Notification/PostWeeklyKeyword/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { UserFollow } from '../../Application/Features/User/Follow/Types/api.js';
import logger from '../../Database/Logger/index.js';
import { sendToNotificationServer } from '../../Database/mq.js';

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
  readNotification: async (notificationId: string): Promise<void> => {
    await Database.transaction(async (transactionManager) => {
      try {
        const notification = await notificationRepo.findById(notificationId);
        if (!notification) {
          throw new NotificationNotFoundError();
        }
        notification.isRead = true;
        await transactionManager.save(notification);
      } catch (error) {
        console.error('Error getting notifications by user id:');
        throw error;
      }
    });
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
  postWeeklyKeywordNotificationEmail:
    async (): Promise<PostWeeklyKeyword.IPostWeeklyKeywordResponse> => {
      try {
        const allUsers = await userRepo.getAllUsers();

        Promise.all(
          allUsers.map(async (user) => {
            await emailService.sendWeeklyKeywordOfficialNotificationEmail(
              user.email,
              'Dengta 本周的熱門關鍵字出爐了！',
              user.fullName,
            );
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
  onNewFollow: async (notifyDto: UserFollow.INotifyDto) => {
    const notification = {
      userId: notifyDto.followeeId,
      type: notificationTypes[1],
      title: '有人在偷偷欽佩你喔！',
      content: `${notifyDto.followerInfo.fullName} 將您視為榜樣，趕快來看看吧！`,
      relatedUserId: notifyDto.followerInfo.id,
    };
    const { relatedUserId, ...messageToMq } = notification;
    try {
      await Database.transaction(async (transactionManager) => {
        await notificationRepo.insertOne(notification, transactionManager);
      });
      // 交易成功才呼叫 MQ
      sendToNotificationServer(
        JSON.stringify({
          ...messageToMq,
          email: notifyDto.followeeEmail,
        }),
      );
      return;
    } catch (error) {
      logger.error(error, 'Error in onNewFollow notification');
      throw error;
    }
  },
};
