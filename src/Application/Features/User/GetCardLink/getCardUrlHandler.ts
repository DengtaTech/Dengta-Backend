import { userService } from '../../../../Infrastructure/Service/userService.js';
import { getCardUrlRes } from './getCardUrlRes.js';

export const getCardUrlHandler = {
  handle: async (userId: string): Promise<GetCardUrl.IGetCardUrlRes> => {
    const cardUrl = await userService.getCardUrl(userId);

    return await getCardUrlRes.customize(cardUrl);
  },
};
