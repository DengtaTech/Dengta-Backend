import { mentionService } from '../../../../../Infrastructure/Service/mentionService.js';

export const getMentionHandler = {
  handle: async () => {
    const mentions = await mentionService.getAllMentionsTotalCountInThisWeek();
    return mentions;
  },
};
