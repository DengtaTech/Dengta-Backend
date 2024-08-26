import { ProfileHashTag } from '../../../../../Database/Entities/profileHashTag.ts';
import { MUserProfileHashTag } from '../../../../../Database/Entities/mUserProfileHashTag.ts';
import { User } from '../../../../../Database/Entities/user.ts';
import { BaseEntity, Relation } from 'typeorm';
import { Followship } from '../../../../../Database/Entities/followship.ts';

declare namespace SearchFollowees {
  interface ISearchFolloweesReq {
    keywords: string;
    followerId: User['id'];
  }

  interface ISearchFolloweesRes {
    data: Array<
      Pick<
        User,
        | 'id'
        | 'fullName'
        | 'firstName'
        | 'lastName'
        | 'lifeRole'
        | 'avatar'
        | 'gender'
        | 'selfIntro'
      > & {
        hashtags: Array<ProfileHashTag['content']>;
      }
    >;
  }

  // all simple attributes + left joined fields
  type ISearchFolloweesDto = Omit<
    User,
    'followedBy' | 'mUserProfileHashTag'
  > & {
    followedBy: Array<Followship>;
  } & {
    mUserProfileHashTag: Array<
      Omit<MUserProfileHashTag, 'profileHashTag'> & {
        profileHashTag: ProfileHashTag;
      }
    >;
  };
}
