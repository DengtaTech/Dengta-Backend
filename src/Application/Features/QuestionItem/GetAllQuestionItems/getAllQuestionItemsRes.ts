import { QuestionItem } from '../../../../Database/Entities/questionItems.js';
import { GetAllQuestionItems } from './Types/api.js';
export const getAllQuestionItemsRes = {
  customize: (questions: QuestionItem[]): GetAllQuestionItems.TRes => {
    return {
      data: questions.map((question) => ({
        id: question.id,
        content: question.content,
      })),
    };
  },
};
