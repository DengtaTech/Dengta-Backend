declare namespace GetSimilarUser {
  interface IGetSimilarUserReq {
    userId: number;
    goal: string;
  }
  interface ISimilarUser {
    userId: number;
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
    footPrintId: number;
    title: string;
    tags: string[];
    description: string;
  }
  interface IEmbeddingUserData {
    userId: number;
    selfIntro: string;
    goal: string;
    profileTags: string[];
    footPrints: IEmbeddingFootprint[];
  }
  interface IEmbeddingFootprintVector {
    footPrintId: number;
    title: number[];
    tags: number[][];
    description: number[];
  }
  interface IEmbeddingUserVector {
    userId: number;
    selfIntro: number[];
    goal: number[];
    profileTags: number[][];
    footprints: IEmbeddingFootprintVector[];
  }
  interface IIntervalEmbedding {
    [key: string]: any;
    userId: number;
    startFootprintId: number;
    endFootprintId: number;
    embedding: number[];
  }
}
