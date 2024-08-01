import { User } from '../../../../../Database/Entities/user.ts';

declare namespace SearchHistoryRetrieve {
  interface ISearchHistoryRetrieveReq {
    userId: string;
  }

  interface ISearchHistoryRetrieveRes {
    data: {
      searchHistory: string[];
    };
  }

  type ISearchHistoryDto = string[];

  type IUserDto = Pick<User, 'id'>;
}
