import { Notification } from '../../../../../Database/Entities/notification.ts';

declare namespace PostOfficialNotification {
  interface IPostOfficialNotificationReq
    extends Pick<Notification, 'title' | 'content'> {
    senderId: string;
  }

  interface IPostOfficialNotificationResponse {
    data: {
      success: boolean;
      message: string;
    };
  }
}
