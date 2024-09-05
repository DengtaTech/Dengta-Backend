declare namespace GetSimilarUser {
  interface IGetSimilarUserReq {
    goal: string;
  }
  interface ISimilarUser {
    userId: string;
    similarity: number;
    startFootprintId: string;
    endFootprintId: string;
  }
  interface IGetSimilarUserResponse {
    data: {
      similarUsers: ISimilarUser[];
    };
  }
}
