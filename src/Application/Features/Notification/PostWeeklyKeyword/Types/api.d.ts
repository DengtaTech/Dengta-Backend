import { User } from '../../../../../Database/Entities/user.ts';

declare namespace PostWeeklyKeyword {
  interface IPostWeeklyKeywordReq {
    senderId: string;
  }

  interface IPostWeeklyKeywordResponse {
    data: {
      success: boolean;
      message: string;
    };
  }
}
