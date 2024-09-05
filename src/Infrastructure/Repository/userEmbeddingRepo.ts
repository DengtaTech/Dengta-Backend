import { EntityManager } from 'typeorm';
import { UserEmbedding } from '../../Database/Entities/userEmbedding.js';
import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';
import { User } from '../../Database/Entities/user.js';
import { DatabaseError } from '../../Errors/errors.js';

export const userEmbeddingRepo = {
  findById: async (
    id: UserEmbedding['id'],
    transactionManager?: EntityManager,
  ) => {
    return userEmbeddingRepo.findOneById(id, transactionManager);
  },
  findByUserId: async (
    userId: User['id'],
    transactionManager?: EntityManager,
  ) => {
    return userEmbeddingRepo.findOneById(userId, transactionManager);
  },
  findOneById: async (id: string, transactionManager?: EntityManager) => {
    if (transactionManager) {
      return await transactionManager.findOne(UserEmbedding, { where: { id } });
    }
    return await UserEmbedding.findOne({ where: { id } });
  },
  insertUserEmbedding: async (
    userEmbedding: Embedding.IUserEmbeddingDto,
    transactionManager: EntityManager,
  ) => {
    try {
      const newUserEmbedding = new UserEmbedding();
      Object.assign(newUserEmbedding, userEmbedding);

      const savedUserEmbedding =
        await transactionManager.save(newUserEmbedding);
      return savedUserEmbedding;
    } catch (error) {
      console.error('Failed to insert userEmbedding:');
      throw error;
    }
  },
  updateUserEmbedding: async (
    userId: User['id'],
    updateUserEmbedding: Embedding.IUpdateUserEmbeddingDto,
    transactionManager: EntityManager,
  ) => {
    const userEmbedding = await transactionManager.findOne(UserEmbedding, {
      where: { userId },
    });

    if (!userEmbedding) {
      throw new Error('UserEmbedding not found');
    }

    Object.assign(userEmbedding, updateUserEmbedding);
    try {
      await transactionManager.save(userEmbedding);
    } catch (error) {
      console.error('Failed to update userEmbedding:');
      throw error;
    }
  },
  getUserWithProfileHashTagEmbedding: async (
    userId: string,
    transactionManager?: EntityManager,
  ): Promise<Embedding.IEmbeddingUserWithHashTagEmbedding> => {
    const query = (
      transactionManager?.createQueryBuilder(User, 'user') ||
      User.createQueryBuilder('user')
    )
      .leftJoinAndSelect('user.embedding', 'embedding')
      .leftJoinAndSelect('user.mUserProfileHashTag', 'mUserProfileHashTag')
      .leftJoinAndSelect('mUserProfileHashTag.profileHashTag', 'profileHashTag')
      .leftJoinAndSelect('profileHashTag.embedding', 'profileHashTagEmbedding')
      .where('user.id = :userId', { userId });

    const user = await query.getOne();

    if (!user) {
      throw new DatabaseError();
    }

    const userEmbedding = {
      userId: user?.id,
      selfIntroEmbedding: user?.embedding?.selfIntroEmbedding || [],
      lifeRoleEmbedding: user?.embedding?.lifeRoleEmbedding || [],
      profileHashTagsEmbedding:
        user?.mUserProfileHashTag?.map((tag) => {
          return tag.profileHashTag?.embedding?.contentEmbedding || [];
        }) || [],
    };

    return userEmbedding;
  },
};
