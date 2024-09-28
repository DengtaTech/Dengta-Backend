import { QuestionItem } from '../../../../../Database/Entities/questionItems.ts';

declare namespace GetAllQuestionItems {
  export type TResData = Pick<QuestionItem, 'id' | 'content'>[];
  export type TRes = { data: TResData };
}
