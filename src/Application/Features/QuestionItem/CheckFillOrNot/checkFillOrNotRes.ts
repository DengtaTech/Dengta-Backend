export const checkFillOrNotRes = {
  customize: (
    alreadyFilled: boolean,
  ): CheckFillOrNot.ICheckFillOrNotResponse => {
    return {
      data: {
        alreadyFilled,
        message: 'success check',
      },
    };
  },
};
