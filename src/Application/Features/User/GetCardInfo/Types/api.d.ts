import { User } from '@zilliz/milvus2-sdk-node';
import { Dengta } from '../../../../../Types/common.js';
import { GetUserInfo } from '../../GetUserInfo/Types/api.js';
declare namespace GetCardInfo {
  interface IUserWithLinks
    extends Pick<User, 'selfIntro' | 'avatar' | 'fullName'> {
    links: Dengta.ILink[];
  }
  interface ICardFootprint
    extends Pick<
      Footprint,
      'title' | 'content' | 'category' | 'milestone' | 'occurAt'
    > {}
  interface ICardDto {
    user: GetUserInfo.UserWithHashtagsAndLinks;
    footprint: Footprint | null;
  }

  interface IGetCardInfoResponse {
    data: {
      user: IUserWithLinks;
      footprint: ICardFootprint | null;
    };
  }
}
