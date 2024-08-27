import { QuestionItem } from '../../Database/Entities/questionItems.js';
import { EntityManager } from 'typeorm';

export const questionItemRepo = {
  findById: async (id: number): Promise<QuestionItem | null> => {
    const questionItem = await QuestionItem.findOne({
      where: { id: id },
    });
    return questionItem;
  },
  findByContent: async (content: string): Promise<QuestionItem | null> => {
    try {
      const questionItem = await QuestionItem.findOne({
        where: { content: content },
      });
      return questionItem;
    } catch (error) {
      console.error('Error finding questionItem by content:');
      throw error;
    }
  },
  insertOne: async (
    content: string,
    transactionManager?: EntityManager,
  ): Promise<QuestionItem> => {
    const repository = transactionManager
      ? transactionManager.getRepository(QuestionItem)
      : QuestionItem.getRepository();

    const questionItem = repository.create({ content });
    await repository.save(questionItem);

    return questionItem;
  },
};
