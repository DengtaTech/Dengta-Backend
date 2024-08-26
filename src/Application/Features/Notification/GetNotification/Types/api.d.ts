import { Notification } from '../../../../../Database/Entities/notification.ts';

declare namespace NotificationRetrieve {
  interface INotificationRetrieveReq {
    userId: string;
    page: number;
  }

  interface INotificationRetrieveRes {
    data: {
      notifications: Notification[];
    };
  }

  type INotificationDto = Notification[];
}
