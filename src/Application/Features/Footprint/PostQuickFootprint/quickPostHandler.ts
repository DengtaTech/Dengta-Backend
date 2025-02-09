import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';

export const quickPostHandler = {
  handle: async (
    userId: string,
    content: string,
  ): Promise<{ message: string }> => {
    await footprintService.postQuickFootprint(userId, content);
    return { message: 'Quick post success' };
  },
};
