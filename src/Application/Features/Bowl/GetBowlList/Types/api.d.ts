import { Bowl } from '../../../../../Database/Entities/bowl.ts';

declare namespace GetBowlList {
  interface IBowlDto
    extends Pick<
      Bowl,
      | 'id'
      | 'content'
      | 'status'
      | 'userId'
      | 'commenterId'
      | 'createdAt'
      | 'totalPushCount'
    > {
    isPushed?: boolean;
  }
  interface IGetBowlListResponse {
    data: {
      bowls: IBowlDto[] | [];
    };
  }
}
