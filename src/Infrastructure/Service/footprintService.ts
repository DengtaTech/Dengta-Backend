import { InitFootprint } from '../../Application/Features/Footprint/InitFootprint/Types/api.js';
import { UserNotFoundError } from '../../Errors/errors.js';
import { footprintRepo } from '../Repository/footprintRepo.js';
import { userRepo } from '../Repository/userRepo.js';

export const footprintService = {
  initFootprint: async (
    userId: string,
    status: string,
  ): Promise<InitFootprint.IInitFootprintDto> => {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    const result = await footprintRepo.initFootprint(user, status);
    return result;
  },
};
