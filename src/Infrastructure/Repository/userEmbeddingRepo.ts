import { EntityManager } from 'typeorm';
import { UserEmbedding } from '../../Database/Entities/userEmbedding.js';
import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';
import { User } from '../../Database/Entities/user.js';

export const userEmbeddingRepo = {
  findById: async (
    id: UserEmbedding['id'],
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(UserEmbedding, { where: { id } });
    } else {
      return await UserEmbedding.findOne({ where: { id } });
    }
  },
  findByUserId: async (
    userId: User['id'],
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(UserEmbedding, {
        where: { userId },
      });
    } else {
      return await UserEmbedding.findOne({ where: { id: userId } });
    }
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
};
