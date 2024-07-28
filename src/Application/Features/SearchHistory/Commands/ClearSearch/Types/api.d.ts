import { User } from '../../../../../../Database/Entities/user.ts';

declare namespace SearchHistoryClear {
  interface ISearchHistoryClearReq {
    userId: number;
  }

  interface ISearchHistoryClearRes {}

  type IUserDto = Pick<User, 'id'>;
}
