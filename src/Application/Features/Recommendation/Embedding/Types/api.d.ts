import { User } from '../../../../../Database/Entities/user.ts';
import { UserEmbedding } from '../../../../../Database/Entities/userEmbedding.ts';
import { Footprint } from '../../../../../Database/Entities/footprint.ts';
import { FootprintEmbedding } from '../../../../../Database/Entities/footprintEmbedding.ts';
import { FootprintHashTagEmbedding } from '../../../../../Database/Entities/footprintHashTagEmbedding.ts';
import { ProfileHashTag } from '../../../../../Database/Entities/profileHashTag.ts';
import { Footprint } from '../../../../../Database/Entities/footprintEmbedding.ts';

declare namespace Embedding {
  type IUserInfoDto = Pick<User, 'id' | 'selfIntro' | 'lifeRole'>;

  type IUpdateUserIntroDto = Partial<Pick<User, 'selfIntro' | 'lifeRole'>>;

  type IUserEmbeddingDto = Pick<
    UserEmbedding,
    'selfIntroEmbedding' | 'lifeRoleEmbedding' | 'userId'
  >;

  type IUpdateUserEmbeddingDto = Partial<
    Pick<UserEmbedding, 'selfIntroEmbedding' | 'lifeRoleEmbedding'>
  >;

  type IFootprintDto = Pick<Footprint, 'id' | 'title' | 'content'>;

  type IFootprintEmbeddingDto = Pick<
    FootprintEmbedding,
    'titleEmbedding' | 'contentEmbedding' | 'footprintId'
  >;

  type IUpdateFootprintEmbeddingDto = Partial<
    Pick<FootprintEmbedding, 'titleEmbedding' | 'contentEmbedding'>
  >;

  type IProfileHashTagDto = Pick<ProfileHashTag, 'id' | 'content'>;

  type IProfileHashTagEmbeddingDto = Pick<
    ProfileHashTagEmbedding,
    'contentEmbedding' | 'profileHashTagId'
  >;

  type IFootprintHashTagDto = Pick<FootprintHashTag, 'id' | 'content'>;

  type IFootprintHashTagEmbeddingDto = Pick<
    FootprintHashTagEmbedding,
    'contentEmbedding' | 'footprintHashTagId'
  >;

  interface IEmbeddingResponse {
    embeddings: number[][];
  }

  interface IIntervalEmbedding {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    userId: string;
    startFootprintId: string;
    endFootprintId: string;
    embedding: number[];
  }

  interface IIntervalEmbeddingWIthId extends IIntervalEmbedding {
    id: string;
  }

  interface IFootprintBeforeEmbedding {
    footPrintId: string;
    title: string;
    tags: string[];
    description: string;
  }

  interface IUserBeforeEmbedding {
    userId: string;
    selfIntro: string;
    goal: string;
    profileTags: string[];
    footPrints: IFootprintBeforeEmbedding[];
    questionnaire: {
      question: string;
      answer: string;
    }[];
  }

  interface IEmbeddingUser {
    userId: string;
    lifeRole: number[];
    selfIntro: number[] | undefined;
    profileTags: number[][];
    footprints: IEmbeddingFootprint[];
    questionnaire: {
      question: string;
      answer: number[];
    }[];
  }

  type IEmbeddingUserWithoutFootprints = Omit<IEmbeddingUser, 'footprints'>;

  interface IEmbeddingFootprint {
    footPrintId: string;
    title: number[];
    content: number[];
    tags: number[][];
  }

  type IEmbeddingIntervalVector = IEmbeddingFootprint[];

  interface IEmbeddingUserWithHashTagEmbedding {
    userId: string;
    selfIntroEmbedding: UserEmbedding['selfIntroEmbedding'];
    lifeRoleEmbedding: UserEmbedding['lifeRoleEmbedding'];
    profileHashTagsEmbedding: ProfileHashTagEmbedding['contentEmbedding'][];
  }

  interface IEmbeddingFootprintWithHashTagEmbedding
    extends Pick<Footprint, 'id' | 'createdAt'> {
    titleEmbedding: FootprintEmbedding['titleEmbedding'];
    contentEmbedding: FootprintEmbedding['contentEmbedding'];
    hashTagEmbeddings: FootprintHashTagEmbedding['contentEmbedding'][];
  }

  interface IEmbeddingWeights {
    selfIntro: number;
    lifeRole: number;
    goal: number;
    profileTags: number;
    footprints: IEmbeddingFootprintWeights;
    questionnaire: number;
  }

  interface IEmbeddingFootprintWeights {
    title: number;
    content: number;
    tags: number;
  }
}
