import { Followship } from '../../../../../Database/Entities/followship.ts';

declare namespace UserUnFollow {
  type IUnFollowReq = Pick<Followship, 'followerId' | 'followeeId'>;

  type IUnFollowRes = void;

  type IUnFollowDto = IUnFollowReq;
}
