import { User } from '../../../../../Database/Entities/user.js';
import { Footprint } from '../../../../../Database/Entities/footprint.js';
declare namespace GetSimilarUser {
  interface IGetSimilarUserReq {
    goal: string;
  }
  interface ISimilarUser
    extends Pick<
      User,
      'id' | 'fullName' | 'lifeRole' | 'selfIntro' | 'avatar'
    > {
    hashtags: string[];
  }
  interface ISimilarUserDto {
    user: ISimilarUser;
    similarity: number;
    startFootprintId: string;
    endFootprintId: string;
    startFootprintAge?: number;
    endFootprintAge?: number;
    endFootprint: Footprint | null;
  }
  interface IGetSimilarUserResponse {
    data: {
      similarUsers: ISimilarUserDto[];
    };
  }
}
