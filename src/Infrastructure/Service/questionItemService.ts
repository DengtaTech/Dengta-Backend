import { UserNotFoundError, InvalidInputError } from '../../Errors/errors.js';
import { userRepo } from '../Repository/userRepo.js';
import { questionItemRepo } from '../Repository/questionItemRepo.js';
import { MUserQuestionItem } from '../../Database/Entities/mUserQuestionItem.js';

export const questionItemService = {
  insertQuestionResponse: async (
    userId: string,
    questionItemId: number,
    response: string | null,
  ): Promise<MUserQuestionItem> => {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    const questionItem = await questionItemRepo.findById(questionItemId); // Assuming you have a questionRepo
    if (!questionItem) {
      throw new InvalidInputError('Question item not found');
    }

    const userQuestionItem = new MUserQuestionItem();
    userQuestionItem.userId = userId;
    userQuestionItem.questionItemId = questionItemId;
    userQuestionItem.response = response;

    return await userQuestionItem.save();
  },
};
