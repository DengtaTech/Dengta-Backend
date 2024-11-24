import { EntityManager } from 'typeorm';
import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';
import { MUserQuestionItemEmbedding } from '../../Database/Entities/mUserQuestionItemEmbedding.js';

export const mUserQuestionItemEmbeddingRepo = {
  findByUserIdAndQuestionItemId: async (
    userId: MUserQuestionItemEmbedding['userId'],
    questionItemId: MUserQuestionItemEmbedding['questionItemId'],
    transactionManager?: EntityManager,
  ) => {
    const repository = transactionManager
      ? transactionManager.getRepository(MUserQuestionItemEmbedding)
      : MUserQuestionItemEmbedding.getRepository();

    return await repository.findOne({
      where: { userId, questionItemId },
    });
  },
  insertMUserQuestionItemEmbedding: async (
    mUserQuestionItemEmbedding: Embedding.IMUserQuestionItemEmbeddingDto,
    transactionManager: EntityManager,
  ) => {
    try {
      const repository = transactionManager
        ? transactionManager.getRepository(MUserQuestionItemEmbedding)
        : MUserQuestionItemEmbedding.getRepository();

      const newMUserQuestionItemEmbedding = new MUserQuestionItemEmbedding();
      Object.assign(newMUserQuestionItemEmbedding, mUserQuestionItemEmbedding);

      const savedMUserQuestionItemEmbedding = await repository.save(
        newMUserQuestionItemEmbedding,
      );
      return savedMUserQuestionItemEmbedding;
    } catch (error) {
      console.error('Failed to insert mUserQuestionItemEmbedding:');
      throw error;
    }
  },
  updateMUserQuestionItemEmbedding: async (
    userId: MUserQuestionItemEmbedding['userId'],
    questionItemId: MUserQuestionItemEmbedding['questionItemId'],
    updateMUserQuestionItemEmbedding: Embedding.IUpdateMUserQuestionItemEmbeddingDto,
    transactionManager: EntityManager,
  ) => {
    const repository = transactionManager
      ? transactionManager.getRepository(MUserQuestionItemEmbedding)
      : MUserQuestionItemEmbedding.getRepository();

    const mUserQuestionItemEmbedding =
      await mUserQuestionItemEmbeddingRepo.findByUserIdAndQuestionItemId(
        userId,
        questionItemId,
        transactionManager,
      );

    if (!mUserQuestionItemEmbedding) {
      throw new Error('MUserQuestionItemEmbedding not found');
    }

    Object.assign(mUserQuestionItemEmbedding, updateMUserQuestionItemEmbedding);
    try {
      await repository.save(mUserQuestionItemEmbedding);
    } catch (error) {
      console.error('Failed to update mUserQuestionItemEmbedding:');
      throw error;
    }
  },
};
