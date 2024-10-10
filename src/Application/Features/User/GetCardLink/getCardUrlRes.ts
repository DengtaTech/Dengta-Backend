export const getCardUrlRes = {
  customize: (cardUrl: string): GetCardUrl.IGetCardUrlRes => {
    return {
      data: {
        cardURL: cardUrl,
      },
    };
  },
};
