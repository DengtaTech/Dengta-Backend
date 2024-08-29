import { User } from '../../../../../Database/Entities/user.ts';
import { UserEmbedding } from '../../../../../Database/Entities/userEmbedding.ts';
import { Footprint } from '../../../../../Database/Entities/footprint.ts';
import { ProfileHashTag } from '../../../../../Database/Entities/profileHashTag.ts';

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
}
