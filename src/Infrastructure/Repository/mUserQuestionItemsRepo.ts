import { MUserQuestionItem } from '../../Database/Entities/mUserQuestionItem.js';
import { EntityManager } from 'typeorm';

export const mUserQuestionItemsRepo = {
  insertOne: async (
    userId: string,
    questionItemId: number,
    transactionManager?: EntityManager,
  ): Promise<MUserQuestionItem> => {
    const repository = transactionManager
      ? transactionManager.getRepository(MUserQuestionItem)
      : MUserQuestionItem.getRepository();

    const mUserQuestionItem = repository.create({ userId, questionItemId });
    await repository.save(mUserQuestionItem);

    return mUserQuestionItem;
  },
};
