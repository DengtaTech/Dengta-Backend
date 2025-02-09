import { bowlService } from '../../../../Infrastructure/Service/bowlService.js';

export const acceptBowlHandler = {
  handle: async (
    userId: string,
    bowlId: string,
  ): Promise<{ message: string }> => {
    await bowlService.acceptBowl(userId, bowlId);
    return { message: 'Accepted successfully' };
  },
};
