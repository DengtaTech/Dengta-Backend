import { userService } from '../../../../Infrastructure/Service/userService.js';
import { getCardInfoRes } from './getCardInfoRes.js';
import { GetCardInfo } from './Types/api.js';

export const getCardInfoHandler = {
  handle: async (
    cardUrl: string,
  ): Promise<GetCardInfo.IGetCardInfoResponse> => {
    const card = await userService.getFullCardInfo(cardUrl);
    const response = await getCardInfoRes.customize(card);
    return response;
  },
};
