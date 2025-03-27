import { Card } from '../../../../Database/Entities/card.js';

export const getCardSettingRes = {
  customize: async (card: Card): Promise<GetCardSetting.IGetCardSettingRes> => {
    return {
      data: {
        latest: card.latest,
        footprintId: card.footprintId,
        cardURL: card.cardUrl,
      },
    };
  },
};
