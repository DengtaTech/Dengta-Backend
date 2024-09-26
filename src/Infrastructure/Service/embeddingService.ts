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
  TOTAL_WEIGHT_WITHOUT_FOOTPRINTS,
} from '../../Config/constants.js';
import { EmbeddingServerError } from '../../Errors/errors.js';

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

    if (!res.ok) {
      throw new EmbeddingServerError();
    }

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

      let embedding: number[][] = [];
      try {
        embedding = await embeddingService.getEmbeddingBySentences(sentences);
      } catch (error) {
        console.error('Error in embedding service ->');
        throw error;
      }

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
      const sentences = [];
      const mapping: { [key: string]: string } = {};

      if (footprintInfo.title) {
        sentences.push(footprintInfo.title);
        mapping[footprintInfo.title] = 'title';
      }

      if (footprintInfo.content) {
        sentences.push(footprintInfo.content);
        mapping[footprintInfo.content] = 'content';
      }

      let embeddings: number[][] = [];

      if (sentences.length > 0) {
        try {
          embeddings =
            await embeddingService.getEmbeddingBySentences(sentences);
        } catch (error) {
          console.error('Error in embedding service ->');
          throw error;
        }
      }

      let titleEmbedding: number[] | undefined;
      let contentEmbedding: number[] | undefined;

      sentences.forEach((sentence, index) => {
        if (mapping[sentence] === 'title') {
          titleEmbedding = embeddings[index];
        } else {
          contentEmbedding = embeddings[index];
        }
      });

      const footprintEmbedding = {
        footprintId: footprintInfo.id,
        titleEmbedding: titleEmbedding ?? [],
        contentEmbedding: contentEmbedding ?? [],
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
      const sentences = [];
      const mapping: { [key: string]: string } = {};

      if (userInfo.lifeRole) {
        sentences.push(userInfo.lifeRole);
        mapping[userInfo.lifeRole] = 'lifeRole';
      }

      if (userInfo.selfIntro) {
        sentences.push(userInfo.selfIntro);
        mapping[userInfo.selfIntro] = 'selfIntro';
      }

      let embeddings: number[][] = [];

      if (sentences.length > 0) {
        try {
          embeddings =
            await embeddingService.getEmbeddingBySentences(sentences);
        } catch (error) {
          console.error('Error in embedding service ->');
          throw error;
        }
      }

      let lifeRoleEmbedding: number[] | undefined;
      let selfIntroEmbedding: number[] | undefined;

      sentences.forEach((sentence, index) => {
        if (mapping[sentence] === 'lifeRole') {
          lifeRoleEmbedding = embeddings[index];
        } else {
          selfIntroEmbedding = embeddings[index];
        }
      });

      const userEmbedding = {
        userId,
        lifeRoleEmbedding: lifeRoleEmbedding ?? undefined,
        selfIntroEmbedding: selfIntroEmbedding ?? undefined,
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
    try {
      const profileHashTagEmbedding =
        await profileHashtagEmbeddingRepo.findByProfileHashTagId(
          profileHashTagInfo.id,
          transactionManager,
        );

      if (profileHashTagEmbedding) {
        return;
      }

      const embedding = await embeddingService.getEmbeddingBySentences([
        profileHashTagInfo.content,
      ]);

      const newProfileHashTagEmbedding = {
        profileHashTagId: profileHashTagInfo.id,
        contentEmbedding: embedding[0],
      };

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
  getUserWithoutFootprintWeightedEmbedding: async (
    userId: string,
  ): Promise<number[]> => {
    try {
      const userEmbedding =
        await userEmbeddingRepo.getUserWithProfileHashTagEmbedding(userId);

      if (!userEmbedding) {
        throw new EmbeddingServerError();
      }

      const userEmbeddingWithoutFootprints = {
        userId: userEmbedding.userId,
        selfIntro: userEmbedding.selfIntroEmbedding,
        lifeRole: userEmbedding.lifeRoleEmbedding,
        profileTags: userEmbedding.profileHashTagsEmbedding,
        questionnaire: [],
      };

      const weightedEmbedding =
        await embeddingService.calculateUserWithoutFootprintWeightedEmbedding(
          userEmbeddingWithoutFootprints,
        );

      return weightedEmbedding;
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
        await footprintEmbeddingRepo.getPublishedFootprintEmbeddingWithAllRelationsByUserId(
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
          await footprintEmbeddingRepo.getPublishedFootprintEmbeddingWithAllRelationsByUserId(
            userId,
            undefined,
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

  calculateUserWithoutFootprintWeightedEmbedding: async (
    userWithoutFootprintEmbedding: Embedding.IEmbeddingUserWithoutFootprints,
  ): Promise<number[]> => {
    const weightedEmbedding = Array(
      userWithoutFootprintEmbedding.lifeRole.length,
    ).fill(0);

    const addIntervalEmbedding = (embedding: number[], weight: number) => {
      for (let i = 0; i < embedding.length; i++) {
        weightedEmbedding[i] += embedding[i] * weight;
      }
    };

    addIntervalEmbedding(
      userWithoutFootprintEmbedding.lifeRole,
      EMBEDDING_WEIGHTS.lifeRole,
    );

    if (userWithoutFootprintEmbedding.selfIntro) {
      addIntervalEmbedding(
        userWithoutFootprintEmbedding.selfIntro,
        EMBEDDING_WEIGHTS.selfIntro,
      );
    }

    userWithoutFootprintEmbedding.profileTags.forEach((tagEmbedding) => {
      addIntervalEmbedding(tagEmbedding, EMBEDDING_WEIGHTS.profileTags);
    });

    userWithoutFootprintEmbedding.profileTags.forEach((tagEmbedding) => {
      addIntervalEmbedding(tagEmbedding, EMBEDDING_WEIGHTS.profileTags);
    });

    userWithoutFootprintEmbedding.questionnaire.forEach((question) => {
      addIntervalEmbedding(question.answer, EMBEDDING_WEIGHTS.questionnaire);
    });

    weightedEmbedding.forEach((value, index) => {
      weightedEmbedding[index] = value / TOTAL_WEIGHT_WITHOUT_FOOTPRINTS;
    });

    return weightedEmbedding;
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

      for (const footprint of intervalFootprints) {
        const weightedEmbedding =
          await embeddingService.calculateFootprintWeightedEmbedding(
            footprint,
            EMBEDDING_WEIGHTS.footprints,
          );
        addIntervalEmbedding(weightedEmbedding, 1);
      }

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
