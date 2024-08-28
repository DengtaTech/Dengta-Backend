import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';
import { UserEmbedding } from '../../Database/Entities/userEmbedding.js';
import { Database } from '../../Database/data-source.js';
import { userEmbeddingRepo } from '../Repository/userEmbeddingRepo.js';
import { footprintEmbeddingRepo } from '../Repository/footprintEmbeddingRepo.js';

export const embeddingService = {
  getEmbeddingBySentences: async (sentences: string[]): Promise<number[][]> => {
    const res = await fetch(
      `http://${process.env.EMBEDDING_SERVER_URL}:${process.env.EMBEDDING_SERVER_PORT}/embed`,
      {
        method: 'POST',
        body: JSON.stringify({ sentences }),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const data = (await res.json()) as GetSimilarUser.IEmbeddingResponse;
    return data.embeddings;
  },
  initUserEmbedding: async (
    userInfo: Embedding.IUserInfoDto,
  ): Promise<void> => {
    return Database.transaction(async (transactionManager) => {
      const sentences = [userInfo.lifeRole];

      if (userInfo.selfIntro) {
        sentences.push(userInfo.selfIntro);
      }

      const embedding =
        await embeddingService.getEmbeddingBySentences(sentences);

      const userEmbedding = {
        userId: userInfo.id,
        lifeRoleEmbedding: embedding[0],
        selfIntroEmbedding: embedding[1] || null,
      };

      try {
        await userEmbeddingRepo.insertUserEmbedding(
          userEmbedding,
          transactionManager,
        );
      } catch (error) {
        console.error('Error in DB ->');
        throw error;
      }
    });
  },
  initFootprintEmbedding: async (
    footprintInfo: Embedding.IFootprintDto,
  ): Promise<void> => {
    return Database.transaction(async (transactionManager) => {
      let titleEmbedding: number[] | undefined;
      if (footprintInfo.title) {
        const res = await embeddingService.getEmbeddingBySentences([
          footprintInfo.title,
        ]);
        titleEmbedding = res[0];
      }

      let contentEmbedding: number[] | undefined;
      if (footprintInfo.content) {
        const res = await embeddingService.getEmbeddingBySentences([
          footprintInfo.content,
        ]);
        contentEmbedding = res[0];
      }

      const footprintEmbedding = {
        footprintId: footprintInfo.id,
        titleEmbedding: titleEmbedding || undefined,
        contentEmbedding: contentEmbedding || undefined,
      };

      try {
        await footprintEmbeddingRepo.insertFootprintEmbedding(
          footprintEmbedding,
          transactionManager,
        );
      } catch (error) {
        console.error('Error in DB ->');
        throw error;
      }
    });
  },
  updateUserEmbedding: async (
    userId: string,
    userInfo: Embedding.IUpdateUserIntroDto,
  ): Promise<void> => {
    return Database.transaction(async (transactionManager) => {
      let selfIntroEmbedding: number[] | undefined;
      if (userInfo.selfIntro) {
        const res = await embeddingService.getEmbeddingBySentences([
          userInfo.selfIntro,
        ]);
        selfIntroEmbedding = res[0];
      }

      let lifeRoleEmbedding: number[] | undefined;
      if (userInfo.lifeRole) {
        const res = await embeddingService.getEmbeddingBySentences([
          userInfo.lifeRole,
        ]);
        lifeRoleEmbedding = res[0];
      }

      const userEmbedding = {
        lifeRoleEmbedding: lifeRoleEmbedding || undefined,
        selfIntroEmbedding: selfIntroEmbedding || undefined,
      };

      try {
        await userEmbeddingRepo.updateUserEmbedding(
          userId,
          userEmbedding,
          transactionManager,
        );
      } catch (error) {
        console.error('Error in DB ->');
        throw error;
      }
    });
  },
  updateFootprintEmbedding: async (
    footprintId: string,
    footprintInfo: Embedding.IUpdateFootprintEmbeddingDto,
  ): Promise<void> => {
    return Database.transaction(async (transactionManager) => {
      let titleEmbedding: number[] | undefined;
      if (footprintInfo.titleEmbedding) {
        const res = await embeddingService.getEmbeddingBySentences([
          footprintInfo.titleEmbedding,
        ]);
        titleEmbedding = res[0];
      }

      let contentEmbedding: number[] | undefined;
      if (footprintInfo.contentEmbedding) {
        const res = await embeddingService.getEmbeddingBySentences([
          footprintInfo.contentEmbedding,
        ]);
        contentEmbedding = res[0];
      }

      const footprintEmbedding = {
        titleEmbedding: titleEmbedding || undefined,
        contentEmbedding: contentEmbedding || undefined,
      };

      try {
        await footprintEmbeddingRepo.updateFootprintEmbedding(
          footprintId,
          footprintEmbedding,
          transactionManager,
        );
      } catch (error) {
        console.error('Error in DB ->');
        throw error;
      }
    });
  },
};
