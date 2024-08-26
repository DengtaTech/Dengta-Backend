declare namespace GetSimilarUser {
  interface IGetSimilarUserReq {
    userId: string;
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
  interface IEmbeddingResponse {
    embeddings: number[][];
  }
  interface IEmbeddingFootprint {
    footPrintId: string;
    title: string;
    tags: string[];
    description: string;
  }
  interface IEmbeddingUserData {
    userId: string;
    selfIntro: string;
    goal: string;
    profileTags: string[];
    footPrints: IEmbeddingFootprint[];
  }
  interface IEmbeddingFootprintVector {
    footPrintId: string;
    title: number[];
    tags: number[][];
    description: number[];
  }
  interface IEmbeddingUserVector {
    userId: string;
    selfIntro: number[];
    goal: number[];
    profileTags: number[][];
    footprints: IEmbeddingFootprintVector[];
  }
  interface IIntervalEmbedding {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    userId: string;
    startFootprintId: string;
    endFootprintId: string;
    embedding: number[];
  }
}
