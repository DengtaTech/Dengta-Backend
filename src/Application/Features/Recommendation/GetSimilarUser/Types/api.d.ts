import { User } from '@zilliz/milvus2-sdk-node';

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
    startFootprintAge: number;
    endFootprintAge: number;
  }
  interface IGetSimilarUserResponse {
    data: {
      similarUsers: ISimilarUserDto[];
    };
  }
}
