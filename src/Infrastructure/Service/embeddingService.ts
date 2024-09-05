import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { footprintRepo } from '../Repository/footprintRepo.js';
import { userEmbeddingRepo } from '../Repository/userEmbeddingRepo.js';
import { footprintEmbeddingRepo } from '../Repository/footprintEmbeddingRepo.js';
import { profileHashtagEmbeddingRepo } from '../Repository/profileHashtagEmbeddingRepo.js';
import { footprintHashTagEmbeddingRepo } from '../Repository/footprintHashTagEmbeddingRepo.js';
import { milvusUserIntervalsEmbeddingRepo } from '../Repository/milvusUserIntervalsEmbeddingRepo.js';
import { EntityManager } from 'typeorm';
import {
  FOOTPRINT_INTERVAL_SIZE,
  EMBEDDING_WEIGHTS,
  TOTAL_WEIGHT,
} from '../../Config/constants.js';

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

    const data = (await res.json()) as Embedding.IEmbeddingResponse;
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
        titleEmbedding: titleEmbedding || [],
        contentEmbedding: contentEmbedding || [],
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
  findOrInsertProfileHashTagEmbedding: async (
    profileHashTagInfo: Embedding.IProfileHashTagDto,
    transactionManager: EntityManager,
  ): Promise<void> => {
    const embedding = await embeddingService.getEmbeddingBySentences([
      profileHashTagInfo.content,
    ]);

    const profileHashTagEmbedding =
      await profileHashtagEmbeddingRepo.findByProfileHashTagId(
        profileHashTagInfo.id,
        transactionManager,
      );

    if (profileHashTagEmbedding) {
      return;
    }

    const newProfileHashTagEmbedding = {
      profileHashTagId: profileHashTagInfo.id,
      contentEmbedding: embedding[0],
    };

    try {
      await profileHashtagEmbeddingRepo.insertUserHashTagEmbedding(
        newProfileHashTagEmbedding,
        transactionManager,
      );
    } catch (error) {
      console.error('Error in DB ->');
      throw error;
    }
  },
  findOrinsertFootprintHashTagEmbedding: async (
    footprintHashTagInfo: Embedding.IFootprintHashTagDto,
    transactionManager: EntityManager,
  ): Promise<void> => {
    try {
      const footprintHashTagEmbedding =
        await footprintHashTagEmbeddingRepo.findByFootprintHashTagId(
          footprintHashTagInfo.id,
          transactionManager,
        );

      if (footprintHashTagEmbedding) {
        return;
      }

      const embedding = await embeddingService.getEmbeddingBySentences([
        footprintHashTagInfo.content,
      ]);

      const newFootprintHashTagEmbedding = {
        footprintHashTagId: footprintHashTagInfo.id,
        contentEmbedding: embedding[0],
      };

      await footprintHashTagEmbeddingRepo.insertFootprintHashTagEmbedding(
        newFootprintHashTagEmbedding,
        transactionManager,
      );
    } catch (error) {
      console.error('Error in DB ->');
      throw error;
    }
  },
  addNewIntervalInMilvus: async (userId: string): Promise<void> => {
    return Database.transaction(async (transactionManager) => {
      // 檢查是否有interval size數量的footprint
      const count =
        await footprintRepo.getPublishedFootprintCountByUserId(userId);
      if (count < FOOTPRINT_INTERVAL_SIZE) {
        return;
      }

      const userWithProfileHashTagEmbedding =
        await userEmbeddingRepo.getUserWithProfileHashTagEmbedding(
          userId,
          transactionManager,
        );

      if (!userWithProfileHashTagEmbedding) {
        throw new Error('UserEmbedding not found');
      }

      const lastKFootprintWithHashTagEmbedding =
        await footprintEmbeddingRepo.getLastKPublishedFootprintEmbeddingWithAllRelationsByUserId(
          userId,
          FOOTPRINT_INTERVAL_SIZE,
          transactionManager,
        );

      if (
        lastKFootprintWithHashTagEmbedding.length !== FOOTPRINT_INTERVAL_SIZE
      ) {
        throw new Error('FootprintEmbedding not found');
      }

      const userEmbedding: Embedding.IEmbeddingUser = {
        userId: userWithProfileHashTagEmbedding.userId,
        selfIntro: userWithProfileHashTagEmbedding.selfIntroEmbedding,
        lifeRole: userWithProfileHashTagEmbedding.lifeRoleEmbedding,
        profileTags: userWithProfileHashTagEmbedding.profileHashTagsEmbedding,
        footprints: lastKFootprintWithHashTagEmbedding.map((footprint) => {
          return {
            footPrintId: footprint.id,
            title: footprint.titleEmbedding || [],
            content: footprint.contentEmbedding || [],
            tags: footprint.hashTagEmbeddings || [],
            description: footprint.contentEmbedding || [],
          };
        }),
        questionnaire: [],
      };

      const userWeightedEmbedding =
        await embeddingService.calculateUserWeightedEmbedding(
          userEmbedding,
          FOOTPRINT_INTERVAL_SIZE,
        );

      await milvusUserIntervalsEmbeddingRepo.insertIntervalsEmbedding(
        userWeightedEmbedding,
      );
    });
  },

  // 在更新用戶相關資訊時call
  updateUserAllWeightedIntervalsInMilvus: async (
    userId: string,
  ): Promise<void> => {
    return Database.transaction(async (transactionManager) => {
      try {
        const allIntervals =
          await milvusUserIntervalsEmbeddingRepo.getAllIntervalsByUserId(
            userId,
          );

        if (allIntervals.length === 0) {
          return;
        }

        const userWithProfileHashTagEmbedding =
          await userEmbeddingRepo.getUserWithProfileHashTagEmbedding(
            userId,
            transactionManager,
          );

        if (!userWithProfileHashTagEmbedding) {
          throw new Error('UserEmbedding not found');
        }

        const footprintsWithHashTagEmbedding =
          await footprintEmbeddingRepo.getAllPublishedFootprintEmbeddingWithAllRelationsByUserId(
            userId,
            transactionManager,
          );

        if (footprintsWithHashTagEmbedding.length === 0) {
          return;
        }

        const userEmbedding: Embedding.IEmbeddingUser = {
          userId: userWithProfileHashTagEmbedding.userId,
          selfIntro: userWithProfileHashTagEmbedding.selfIntroEmbedding,
          lifeRole: userWithProfileHashTagEmbedding.lifeRoleEmbedding,
          profileTags: userWithProfileHashTagEmbedding.profileHashTagsEmbedding,
          footprints: footprintsWithHashTagEmbedding.map((footprint) => {
            return {
              footPrintId: footprint.id,
              title: footprint.titleEmbedding || [],
              content: footprint.contentEmbedding || [],
              tags: footprint.hashTagEmbeddings || [],
              description: footprint.contentEmbedding || [],
            };
          }),
          questionnaire: [],
        };

        const userWeightedEmbedding =
          await embeddingService.calculateUserWeightedEmbedding(
            userEmbedding,
            FOOTPRINT_INTERVAL_SIZE,
          );

        await milvusUserIntervalsEmbeddingRepo.deleteAllIntervalsByUserId(
          userId,
        );

        await milvusUserIntervalsEmbeddingRepo.insertIntervalsEmbedding(
          userWeightedEmbedding,
        );
      } catch (error) {
        console.error('Error in DB ->');
        throw error;
      }
    });
  },

  calculateFootprintWeightedEmbedding: async (
    footprint: Embedding.IEmbeddingFootprint,
    footprintWeights: Embedding.IEmbeddingFootprintWeights,
  ): Promise<number[]> => {
    const footprintEmbedding = Array(footprint.title.length).fill(0);

    const addEmbedding = (embedding: number[], weight: number) => {
      for (let i = 0; i < embedding.length; i++) {
        footprintEmbedding[i] += embedding[i] * weight;
      }
    };

    addEmbedding(footprint.title, footprintWeights.title);

    footprint.tags.forEach((tagEmbedding) => {
      addEmbedding(tagEmbedding, footprintWeights.tags);
    });

    addEmbedding(footprint.content, footprintWeights.content);

    return footprintEmbedding;
  },

  calculateUserWeightedEmbedding: async (
    userEmbedding: Embedding.IEmbeddingUser,
    intervalSize: number = FOOTPRINT_INTERVAL_SIZE,
  ): Promise<Embedding.IIntervalEmbedding[]> => {
    const weightedIntervalsEmbedding = [];
    for (let i = 0; i <= userEmbedding.footprints.length - intervalSize; i++) {
      const intervalFootprints = userEmbedding.footprints.slice(
        i,
        i + intervalSize,
      );

      const intervalEmbedding = Array(userEmbedding.lifeRole.length).fill(0);

      const addIntervalEmbedding = (embedding: number[], weight: number) => {
        for (let i = 0; i < embedding.length; i++) {
          intervalEmbedding[i] += embedding[i] * weight;
        }
      };

      addIntervalEmbedding(userEmbedding.lifeRole, EMBEDDING_WEIGHTS.lifeRole);

      if (userEmbedding.selfIntro) {
        addIntervalEmbedding(
          userEmbedding.selfIntro,
          EMBEDDING_WEIGHTS.selfIntro,
        );
      }

      userEmbedding.profileTags.forEach((tagEmbedding) => {
        addIntervalEmbedding(tagEmbedding, EMBEDDING_WEIGHTS.profileTags);
      });

      intervalFootprints.forEach(async (footprint) => {
        addIntervalEmbedding(
          await embeddingService.calculateFootprintWeightedEmbedding(
            footprint,
            EMBEDDING_WEIGHTS.footprints,
          ),
          1,
        );
      });

      userEmbedding.questionnaire.forEach((question) => {
        addIntervalEmbedding(question.answer, EMBEDDING_WEIGHTS.questionnaire);
      });

      intervalEmbedding.forEach((value, index) => {
        intervalEmbedding[index] = value / TOTAL_WEIGHT;
      });

      weightedIntervalsEmbedding.push({
        userId: userEmbedding.userId,
        startFootprintId: intervalFootprints[0].footPrintId,
        endFootprintId:
          intervalFootprints[intervalFootprints.length - 1].footPrintId,
        embedding: intervalEmbedding,
      });
    }

    return weightedIntervalsEmbedding;
  },
};
