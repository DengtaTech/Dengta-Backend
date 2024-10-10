import { mentionRepo } from '../Repository/mentionRepo.js';
import { GetMention } from '../../Application/Features/Volume/Mention/getMention/Types/api.js';
import nodejieba from 'nodejieba';

nodejieba.load({
  stopWordDict: './src/Config/stopwords.txt',
});

export const mentionService = {
  analyzeContent: (content: string, date: Date, type: string) => {
    const keywords = nodejieba.extract(content, 5);

    keywords.forEach(async (keyword) => {
      const count: GetMention.IMentionCount = {
        footprints: 0,
        search: 0,
      };

      if (type === 'footprints') {
        count.footprints = 1;
      } else if (type === 'search') {
        count.search = 1;
      }
      try {
        await mentionRepo.insertOrUpdate(keyword.word, date, count);
      } catch (error) {
        console.error('Error insert or update mention:');
        throw error;
      }
    });
  },

  getAllMentionsInThisWeek: async () => {
    const nowDate = new Date();

    const mentions = await mentionRepo.getMentionsInWeek(nowDate);

    return mentions;
  },

  getAllMentionsTotalCountInThisWeek: async () => {
    const nowDate = new Date();

    const mentions = await mentionRepo.getMentionsTotalCountInWeek(nowDate);

    return mentions;
  },
};
