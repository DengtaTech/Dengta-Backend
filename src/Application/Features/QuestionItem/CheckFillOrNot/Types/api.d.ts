declare namespace CheckFillOrNot {
  interface ICheckFillOrNotResponse {
    data: {
      alreadyFilled: boolean;
      message: string;
    };
  }
}
