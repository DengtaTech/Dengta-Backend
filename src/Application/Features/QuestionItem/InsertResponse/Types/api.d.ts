import { MUserQuestionItem } from '../../../../../Database/Entities/mUserQuestionItem.js';
import { QuestionItem } from '../../../../../Database/Entities/questionItems.js';
declare namespace InsertResponse {
  type TQuestionRes = Pick<QuestionItem, 'id'> &
    Pick<MUserQuestionItem, 'response'>;
  interface IReqBody {
    questionRes: TQuestionRes[];
  }

  type TRes = {
    data: {
      message: string;
    };
  };
}
