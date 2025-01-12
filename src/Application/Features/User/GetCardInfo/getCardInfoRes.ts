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
        footprint:
          card.footprint === null
            ? null
            : {
                title: card.footprint.title,
                content: card.footprint.content,
                category: card.footprint.category,
                milestone: card.footprint.milestone,
                occurAt: card.footprint.occurAt,
              },
      },
    };
    return response;
  },
};
