import { User } from '../../../../../../Database/Entities/user.ts';

declare namespace SearchHistoryClear {
  interface ISearchHistoryClearReq {
    userId: string;
  }

  interface ISearchHistoryClearRes {}

  type IUserDto = Pick<User, 'id'>;
}
