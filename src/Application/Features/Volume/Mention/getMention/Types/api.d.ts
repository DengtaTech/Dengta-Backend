import { Mention } from '../../../../../../Database/Entities/mention.ts';

declare namespace GetMention {
  interface IMentionCount {
    footprints: number;
    search: number;
  }

  interface IMentionTotalCount {
    keyword: string;
    totalCount: number;
  }
}
