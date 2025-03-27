import { userService } from '../../../../Infrastructure/Service/userService.js';
import { getCardSettingRes } from './getCardSettingRes.js';

export const getCardSettingHandler = {
  handle: async (
    userId: string,
  ): Promise<GetCardSetting.IGetCardSettingRes> => {
    const card = await userService.getCardSetting(userId);

    return await getCardSettingRes.customize(card);
  },
};
