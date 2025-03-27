export const getCardUrlRes = {
  customize: async (cardUrl: string): Promise<GetCardUrl.IGetCardUrlRes> => {
    return {
      data: {
        cardURL: cardUrl,
      },
    };
  },
};
