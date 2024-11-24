import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';
import { Database } from '../../Database/data-source.js';
import { footprintRepo } from '../Repository/footprintRepo.js';
import { userEmbeddingRepo } from '../Repository/userEmbeddingRepo.js';
import { footprintEmbeddingRepo } from '../Repository/footprintEmbeddingRepo.js';
import { profileHashtagEmbeddingRepo } from '../Repository/profileHashtagEmbeddingRepo.js';
import { footprintHashTagEmbeddingRepo } from '../Repository/footprintHashTagEmbeddingRepo.js';
import { milvusUserIntervalsEmbeddingRepo } from '../Repository/milvusUserIntervalsEmbeddingRepo.js';
import { mUserQuestionItemEmbeddingRepo } from '../Repository/mUserQuestionItemEmbeddingRepo.js';
import { EntityManager } from 'typeorm';
import {
  FOOTPRINT_INTERVAL_SIZE,
  EMBEDDING_WEIGHTS,
  TOTAL_WEIGHT,
  TOTAL_WEIGHT_WITHOUT_FOOTPRINTS,
  QUESTION_TEMPLATES,
} from '../../Config/constants.js';
import { EmbeddingServerError } from '../../Errors/errors.js';

const addWeightedEmbedding = (
  embedding: number[],
  weight: number,
  targetEmbedding: number[],
) => {
  for (let i = 0; i < embedding.length; i++) {
    targetEmbedding[i] += embedding[i] * weight;
  }
};

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

          if (footprintInfo.title === footprintInfo.content) {
            titleEmbedding = [...contentEmbedding];
          }
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
  insertMUserQuestionItemEmbedding: async (
    mUserQuestionItemInfo: Embedding.IMUserQuestionItemDto,
  ): Promise<void> => {
    return Database.transaction(async (transactionManager) => {
      if (!mUserQuestionItemInfo.response) {
        return;
      }

      const template = QUESTION_TEMPLATES[mUserQuestionItemInfo.questionItemId];
      const sentence = template.replace(
        '{{goal}}',
        mUserQuestionItemInfo.response,
      );

      const sentences = [sentence];

      let embedding: number[][] = [];
      try {
        embedding = await embeddingService.getEmbeddingBySentences(sentences);
      } catch (error) {
        console.error('Error in embedding service ->');
        throw error;
      }

      const mUserQuestionItemEmbedding = {
        userId: mUserQuestionItemInfo.userId,
        questionItemId: mUserQuestionItemInfo.questionItemId,
        responseEmbedding: embedding[0],
      };

      try {
        const existingEmbedding =
          await mUserQuestionItemEmbeddingRepo.findByUserIdAndQuestionItemId(
            mUserQuestionItemInfo.userId,
            mUserQuestionItemInfo.questionItemId,
            transactionManager,
          );

        if (existingEmbedding) {
          await mUserQuestionItemEmbeddingRepo.updateMUserQuestionItemEmbedding(
            mUserQuestionItemInfo.userId,
            mUserQuestionItemInfo.questionItemId,
            {
              responseEmbedding: embedding[0],
            },
            transactionManager,
          );
          return;
        }

        await mUserQuestionItemEmbeddingRepo.insertMUserQuestionItemEmbedding(
          mUserQuestionItemEmbedding,
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

          if (userInfo.selfIntro === userInfo.lifeRole) {
            lifeRoleEmbedding = [...selfIntroEmbedding];
          }
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
        await userEmbeddingRepo.getUserEmbeddingWithAllrelations(userId);

      if (!userEmbedding) {
        throw new EmbeddingServerError();
      }

      const userEmbeddingWithoutFootprints = {
        userId: userEmbedding.userId,
        selfIntro: userEmbedding.selfIntroEmbedding,
        lifeRole: userEmbedding.lifeRoleEmbedding,
        profileTags: userEmbedding.profileHashTagsEmbedding,
        questionResponses: userEmbedding.questionResponsesEmbedding,
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
  getUserPartialIntervalWeightedEmbedding: async (
    userId: string,
  ): Promise<number[]> => {
    try {
      const userWithAllRelationsEmbedding =
        await userEmbeddingRepo.getUserEmbeddingWithAllrelations(userId);

      if (!userWithAllRelationsEmbedding) {
        throw new EmbeddingServerError();
      }

      const footprintsWithHashTagEmbedding =
        await footprintEmbeddingRepo.getPublishedFootprintEmbeddingWithAllRelationsByUserId(
          userId,
          undefined,
          undefined,
        );

      const userEmbedding: Embedding.IEmbeddingUser = {
        userId: userWithAllRelationsEmbedding.userId,
        selfIntro: userWithAllRelationsEmbedding.selfIntroEmbedding,
        lifeRole: userWithAllRelationsEmbedding.lifeRoleEmbedding,
        profileTags: userWithAllRelationsEmbedding.profileHashTagsEmbedding,
        footprints: footprintsWithHashTagEmbedding.map((footprint) => {
          return {
            footPrintId: footprint.id,
            title: footprint.titleEmbedding || [],
            content: footprint.contentEmbedding || [],
            tags: footprint.hashTagEmbeddings || [],
          };
        }),
        questionResponses:
          userWithAllRelationsEmbedding.questionResponsesEmbedding,
      };

      const weightedEmbedding =
        await embeddingService.calculateUserPartialIntervalWeightedEmbedding(
          userEmbedding,
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

      const userWithAllRelationsEmbedding =
        await userEmbeddingRepo.getUserEmbeddingWithAllrelations(
          userId,
          transactionManager,
        );

      if (!userWithAllRelationsEmbedding) {
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
        userId: userWithAllRelationsEmbedding.userId,
        selfIntro: userWithAllRelationsEmbedding.selfIntroEmbedding,
        lifeRole: userWithAllRelationsEmbedding.lifeRoleEmbedding,
        profileTags: userWithAllRelationsEmbedding.profileHashTagsEmbedding,
        footprints: lastKFootprintWithHashTagEmbedding.map((footprint) => {
          return {
            footPrintId: footprint.id,
            title: footprint.titleEmbedding || [],
            content: footprint.contentEmbedding || [],
            tags: footprint.hashTagEmbeddings || [],
          };
        }),
        questionResponses:
          userWithAllRelationsEmbedding.questionResponsesEmbedding,
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

        const userWithAllRelationsEmbedding =
          await userEmbeddingRepo.getUserEmbeddingWithAllrelations(
            userId,
            transactionManager,
          );

        if (!userWithAllRelationsEmbedding) {
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
          userId: userWithAllRelationsEmbedding.userId,
          selfIntro: userWithAllRelationsEmbedding.selfIntroEmbedding,
          lifeRole: userWithAllRelationsEmbedding.lifeRoleEmbedding,
          profileTags: userWithAllRelationsEmbedding.profileHashTagsEmbedding,
          footprints: footprintsWithHashTagEmbedding.map((footprint) => {
            return {
              footPrintId: footprint.id,
              title: footprint.titleEmbedding || [],
              content: footprint.contentEmbedding || [],
              tags: footprint.hashTagEmbeddings || [],
            };
          }),
          questionResponses:
            userWithAllRelationsEmbedding.questionResponsesEmbedding,
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

    addWeightedEmbedding(
      footprint.title,
      footprintWeights.title,
      footprintEmbedding,
    );

    footprint.tags.forEach((tagEmbedding) => {
      addWeightedEmbedding(
        tagEmbedding,
        footprintWeights.tags,
        footprintEmbedding,
      );
    });

    addWeightedEmbedding(
      footprint.content,
      footprintWeights.content,
      footprintEmbedding,
    );

    return footprintEmbedding;
  },

  calculateUserWithoutFootprintWeightedEmbedding: async (
    userWithoutFootprintEmbedding: Embedding.IEmbeddingUserWithoutFootprints,
  ): Promise<number[]> => {
    const weightedEmbedding = Array(
      userWithoutFootprintEmbedding.lifeRole.length,
    ).fill(0);

    addWeightedEmbedding(
      userWithoutFootprintEmbedding.lifeRole,
      EMBEDDING_WEIGHTS.lifeRole,
      weightedEmbedding,
    );

    if (userWithoutFootprintEmbedding.selfIntro) {
      addWeightedEmbedding(
        userWithoutFootprintEmbedding.selfIntro,
        EMBEDDING_WEIGHTS.selfIntro,
        weightedEmbedding,
      );
    }

    userWithoutFootprintEmbedding.profileTags.forEach((tagEmbedding) => {
      addWeightedEmbedding(
        tagEmbedding,
        EMBEDDING_WEIGHTS.profileTags /
          userWithoutFootprintEmbedding.profileTags.length,
        weightedEmbedding,
      );
    });

    const validQuestionResponses =
      userWithoutFootprintEmbedding.questionResponses.filter(
        (response) => response !== undefined,
      );
    validQuestionResponses.forEach((responseEmbedding) => {
      addWeightedEmbedding(
        responseEmbedding,
        EMBEDDING_WEIGHTS.questionResponses / validQuestionResponses.length,
        weightedEmbedding,
      );
    });

    weightedEmbedding.forEach((value, index) => {
      weightedEmbedding[index] = value / TOTAL_WEIGHT_WITHOUT_FOOTPRINTS;
    });

    return weightedEmbedding;
  },
  calculateUserPartialIntervalWeightedEmbedding: async (
    userEmbedding: Embedding.IEmbeddingUser,
  ): Promise<number[]> => {
    const weightedEmbedding = Array(userEmbedding.lifeRole.length).fill(0);

    addWeightedEmbedding(
      userEmbedding.lifeRole,
      EMBEDDING_WEIGHTS.lifeRole,
      weightedEmbedding,
    );

    if (userEmbedding.selfIntro) {
      addWeightedEmbedding(
        userEmbedding.selfIntro,
        EMBEDDING_WEIGHTS.selfIntro,
        weightedEmbedding,
      );
    }

    userEmbedding.profileTags.forEach((tagEmbedding) => {
      addWeightedEmbedding(
        tagEmbedding,
        EMBEDDING_WEIGHTS.profileTags,
        weightedEmbedding,
      );
    });

    for (const footprint of userEmbedding.footprints) {
      const weightedEmbedding =
        await embeddingService.calculateFootprintWeightedEmbedding(
          footprint,
          EMBEDDING_WEIGHTS.footprints,
        );
      addWeightedEmbedding(weightedEmbedding, 1, weightedEmbedding);
    }

    const validQuestionResponses = userEmbedding.questionResponses.filter(
      (response) => response.length !== undefined,
    );
    validQuestionResponses.forEach((responseEmbedding) => {
      addWeightedEmbedding(
        responseEmbedding,
        EMBEDDING_WEIGHTS.questionResponses,
        weightedEmbedding,
      );
    });

    weightedEmbedding.forEach((value, index) => {
      weightedEmbedding[index] = value / TOTAL_WEIGHT;
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

      addWeightedEmbedding(
        userEmbedding.lifeRole,
        EMBEDDING_WEIGHTS.lifeRole,
        intervalEmbedding,
      );

      if (userEmbedding.selfIntro) {
        addWeightedEmbedding(
          userEmbedding.selfIntro,
          EMBEDDING_WEIGHTS.selfIntro,
          intervalEmbedding,
        );
      }

      userEmbedding.profileTags.forEach((tagEmbedding) => {
        addWeightedEmbedding(
          tagEmbedding,
          EMBEDDING_WEIGHTS.profileTags,
          intervalEmbedding,
        );
      });

      for (const footprint of intervalFootprints) {
        const weightedEmbedding =
          await embeddingService.calculateFootprintWeightedEmbedding(
            footprint,
            EMBEDDING_WEIGHTS.footprints,
          );
        addWeightedEmbedding(weightedEmbedding, 1, intervalEmbedding);
      }

      const validQuestionResponses = userEmbedding.questionResponses.filter(
        (response) => response.length !== undefined,
      );
      validQuestionResponses.forEach((responseEmbedding) => {
        addWeightedEmbedding(
          responseEmbedding,
          EMBEDDING_WEIGHTS.questionResponses,
          intervalEmbedding,
        );
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
