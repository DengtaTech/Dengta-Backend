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
import { Footprint } from '../../Database/Entities/footprint.js';
import {
  INewFollowMessage,
  INewFootprintMessage,
} from '../../Types/mqNotification.js';

export const notificationService = {
  getNotificationByUserId: async (
    body: NotificationRetrieve.INotificationRetrieveReq,
  ): Promise<Notification[]> => {
    try {
      const notifications = await notificationRepo.findByUserId(
        body.userId,
        body.page,
      );

      return notifications;
    } catch (error) {
      logger.error(error, 'Error getting notifications by user id:');
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
        logger.error(error, 'Error read notifications');
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
          notification.userId = user.id;

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
    try {
      await Database.transaction(async (transactionManager) => {
        await notificationRepo.insertOne(notification, transactionManager);
      });
      const mqMessage: INewFollowMessage = {
        destinationEmail: notifyDto.followeeEmail,
        subject: notification.title,
        content: notification.content,
        type: notificationTypes[1],
        metadata: {
          id: notifyDto.followerInfo.id,
          fullName: notifyDto.followerInfo.fullName,
          avatar: notifyDto.followerInfo.avatar,
        },
      };
      // 交易成功才呼叫 MQ
      sendToNotificationServer(JSON.stringify(mqMessage));
      return;
    } catch (error) {
      logger.error(error, 'Error in onNewFollow notification');
      throw error;
    }
  },
  onNewFootprint: async (footprint: Footprint) => {
    try {
      const { followee, followers } = await userRepo.getFollowersByUserId(
        footprint.userId,
      );
      // 如果沒有人追蹤該 user，就不需要發通知
      if (!followers || followers.length === 0) {
        return;
      }
      const mqMessage: INewFootprintMessage[] = [];
      const notificationsToInsert = followers.map((follower) => {
        const dbNotification = {
          userId: follower.id,
          type: notificationTypes[2],
          title: `你關注的用戶 ${followee.fullName} 發布了${footprint.milestone == true ? '新的里程碑' : '新足跡'}！`,
          content: `快去看看他的最新分享吧：${footprint.title}！`,
          relatedUserId: followee.id,
          relatedFootprintId: footprint.id,
        };
        mqMessage.push({
          destinationEmail: follower.email,
          subject: dbNotification.title,
          content: dbNotification.content,
          type: notificationTypes[2],
          metadata: {
            footprintId: footprint.id,
            fullName: followee.fullName,
            avatar: followee.avatar,
          },
        });
        return dbNotification;
      });
      await Database.transaction(async (manager) => {
        // bulk insert
        await manager.getRepository(Notification).insert(notificationsToInsert);
      });
      sendToNotificationServer(JSON.stringify(mqMessage));
      return;
    } catch (error) {
      logger.error(error, 'Error in onNewFootprint notification');
      throw error;
    }
  },
};
