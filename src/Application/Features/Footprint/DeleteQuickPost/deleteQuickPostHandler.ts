import { footprintService } from '../../../../Infrastructure/Service/footprintService.js';

export const deleteQuickPostHandler = {
  handle: async (
    userId: string,
    footprintId: string,
  ): Promise<{ message: string }> => {
    await footprintService.deleteQuickPost(userId, footprintId);
    return { message: 'Quick post deleted successfully' };
  },
};
