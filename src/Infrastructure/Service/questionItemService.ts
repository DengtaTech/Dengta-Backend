import { UserNotFoundError } from '../../Errors/errors.js';
import { userRepo } from '../Repository/userRepo.js';
import { questionItemRepo } from '../Repository/questionItemRepo.js';
import { MUserQuestionItem } from '../../Database/Entities/mUserQuestionItem.js';
import { InsertResponse } from '../../Application/Features/QuestionItem/InsertResponse/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { QuestionItem } from '../../Database/Entities/questionItems.js';
import { getRepository, In } from 'typeorm';

export const questionItemService = {
  insertQuestionResponse: async (
    userId: string,
    reqBody: InsertResponse.IReqBody,
  ): Promise<void> => {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    const { questionRes } = reqBody;
    const questionIds = questionRes.map((item) => item.id);
    return Database.transaction(async (transactionManager) => {
      try {
        const questionItems = await transactionManager.find(QuestionItem, {
          where: {
            id: In(questionIds),
          },
        });
        const foundQuestionIds = questionItems.map((item) => item.id);
        const missingQuestionIds = questionIds.filter(
          (id) => !foundQuestionIds.includes(id),
        );
        if (missingQuestionIds.length > 0) {
          throw new Error(
            `QuestionItems not found: ${missingQuestionIds.join(', ')}`,
          );
        }
        const existingResponses = await transactionManager.find(
          MUserQuestionItem,
          {
            where: { userId, questionItemId: In(questionIds) },
          },
        );
        const existingResponsesMap = new Map<number, MUserQuestionItem>();
        existingResponses.forEach((response) => {
          existingResponsesMap.set(response.questionItemId, response);
        });

        const responsesToSave: MUserQuestionItem[] = [];
        const currentDate = new Date();

        for (const item of questionRes) {
          let mUserQuestionItem = existingResponsesMap.get(item.id);

          if (mUserQuestionItem) {
            mUserQuestionItem.response = item.response;
            mUserQuestionItem.updatedAt = currentDate;
          } else {
            mUserQuestionItem = new MUserQuestionItem();
            mUserQuestionItem.userId = userId;
            mUserQuestionItem.questionItemId = item.id;
            mUserQuestionItem.response = item.response;
          }

          responsesToSave.push(mUserQuestionItem);
        }

        // 批量更新插入所有紀錄
        await transactionManager.save(responsesToSave);
      } catch (error) {
        console.error('Error in DB ->', error);
        throw error;
      }
    });
  },
  getAllQuestionItems: async () => {
    return await questionItemRepo.getAllItems();
  },
  checkFillOrNot: async (userId: string): Promise<boolean> => {
    if ((await userRepo.findById(userId)) === null) {
      throw new UserNotFoundError();
    }
    const exists = await MUserQuestionItem.createQueryBuilder('m')
      .select('1')
      .where('m.userId = :userId', { userId })
      .limit(1)
      .getRawOne();

    return !!exists;
  },
};
