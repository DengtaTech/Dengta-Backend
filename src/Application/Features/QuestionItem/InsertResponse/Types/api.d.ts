import { MUserQuestionItem } from '../../../../../Database/Entities/mUserQuestionItem.ts';

declare namespace InsertResponse {
  type TReqBody = Pick<MUserQuestionItem, 'response'>;

  type TRes = {
    data: {
      message: string;
    };
  };
}
