import { GetCardInfo } from './Types/api.js';

export const getCardInfoRes = {
  customize: async (
    card: GetCardInfo.ICardDto,
  ): Promise<GetCardInfo.IGetCardInfoResponse> => {
    const response: GetCardInfo.IGetCardInfoResponse = {
      data: {
        user: {
          selfIntro: card.user.selfIntro,
          avatar: card.user.avatar,
          fullName: card.user.fullName,
          links: card.user.links,
        },
        footprint: card.footprint,
      },
    };
    return response;
  },
};
