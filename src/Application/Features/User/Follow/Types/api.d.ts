import { Followship } from '../../../../../Database/Entities/followship.ts';

declare namespace UserFollow {
  type IFollowReq = Pick<Followship, 'followerId' | 'followeeId'>;

  type IFollowRes = void;

  type IFollowDto = IFollowReq;

  interface IFollowResponse {
    data: {
      message: string;
    };
  }
}
