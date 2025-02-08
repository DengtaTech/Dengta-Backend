import { bowlService } from '../../../../Infrastructure/Service/bowlService.js';

export const pushHandler = {
  handle: async (
    userId: string,
    bowlId: string,
  ): Promise<{ message: string }> => {
    await bowlService.pushOrCancel(userId, bowlId);

    return { message: 'Push status updated successfully' };
  },
};
