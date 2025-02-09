import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';

export const patchQuickPostHandler = {
  handle: async (
    userId: string,
    content: string,
    footprintId: string,
  ): Promise<{ message: string }> => {
    await footprintService.patchQuickPost(userId, content, footprintId);
    return { message: 'Quick post updated successfully' };
  },
};
