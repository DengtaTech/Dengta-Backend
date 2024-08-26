import { EntityManager, FindManyOptions } from 'typeorm';
import { Notification } from '../../Database/Entities/notification.js';
import { User } from '../../Database/Entities/user.js';

export const notificationRepo = {
  findById: async (
    id: Notification['id'],
    transactionManager?: EntityManager,
  ) => {
    try {
      if (transactionManager) {
        return await transactionManager.findOne(Notification, {
          where: { id },
        });
      } else {
        return await Notification.findOne({ where: { id } });
      }
    } catch (error) {
      console.error('Error finding notification by id:');
      throw error;
    }
  },
  findByUserId: async (
    userId: User['id'],
    page: number = 1,
    transactionManager?: EntityManager,
  ) => {
    try {
      const pageSize = 10;
      const queryRules: FindManyOptions<Notification> = {
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      };
      if (transactionManager) {
        const notifications = await transactionManager.find(
          Notification,
          queryRules,
        );
        return notifications;
      } else {
        const notifications = await Notification.find(queryRules);
        return notifications;
      }
    } catch (error) {
      console.error('Error finding notifications by user id:');
      throw error;
    }
  },
  insertNewNotification: async (
    notification: Notification,
    transactionManager?: EntityManager,
  ) => {
    try {
      if (transactionManager) {
        await transactionManager.save(Notification, notification);
      } else {
        await Notification.save(notification);
      }
    } catch (error) {
      console.error('Error inserting new notification:');
      throw error;
    }
  },
};
