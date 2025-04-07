import {
  Notification,
  NotificationType,
} from '../../../../../Database/Entities/notification.ts';
declare namespace NotificationRetrieve {
  interface INotificationRetrieveReq {
    userId: string;
    page: number;
  }

  interface INotificationRetrieveRes {
    data: {
      notifications: INotificationDto[];
    };
  }
  interface INotificationDto {
    id: string;
    type: NotificationType;
    title: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
    relatedUser: {
      id: string;
      avatar: string;
      fullName: string;
    } | null;
    relatedFootprint: {
      id: string;
      title: string | null;
      milestone: boolean;
    } | null;
  }
}
