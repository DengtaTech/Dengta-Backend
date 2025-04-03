import { Followship } from '../../../../../Database/Entities/followship.ts';
import { User } from '../../../../../Database/Entities/user.ts';
declare namespace UserFollow {
  type IFollowReq = Pick<Followship, 'followerId' | 'followeeId'>;

  type IFollowRes = void;

  interface IFollowDto {
    followerInfo: User;
    followeeEmail: string;
    followeeId: string;
  }

  interface INotifyDto extends IFollowDto {}

  interface IFollowResponse {
    data: {
      message: string;
    };
  }
}
