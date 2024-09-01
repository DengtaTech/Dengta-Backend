import { EntityManager } from 'typeorm';
import { MUserFootprintReaction } from '../../Database/Entities/mUserFootprintReaction.js';
import { ReactionType } from '../../Database/Entities/reactionType.js';
import { Reaction } from '../../Application/Features/Footprint/Reaction/Types/api.js';

export const mUserFootprintReactionRepo = {
  findByIds: async (
    reaction: Partial<Pick<MUserFootprintReaction, 'userId' | 'footprintId'>>,
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(MUserFootprintReaction, {
        where: {
          userId: reaction.userId,
          footprintId: reaction.footprintId,
        },
      });
    } else {
      return await MUserFootprintReaction.findOne({
        where: {
          userId: reaction.userId,
          footprintId: reaction.footprintId,
        },
      });
    }
  },
  // 未來在寄信時使用
  countEmotionOfFootprint: async (
    footprintId: string,
    transactionManager?: EntityManager,
  ): Promise<Reaction.ReactionCount[]> => {
    if (transactionManager) {
      const query = transactionManager
        .createQueryBuilder(MUserFootprintReaction, 'mUserFootprintReaction')
        .select('reactionType.name', 'name')
        .addSelect(
          'COUNT(mUserFootprintReaction.reactionTypeId)',
          'reaction_count',
        )
        .leftJoin(
          ReactionType,
          'reactionType',
          'mUserFootprintReaction.reactionTypeId = reactionType.id',
        )
        .where('mUserFootprintReaction.footprintId = :footprintId', {
          footprintId,
        })
        .groupBy('reactionType.name');

      return (await query.getRawMany<Reaction.ReactionCount>()).map((v) => ({
        name: v.name,
        reaction_count: Number(v.reaction_count), // 原始取出來是字串
      }));
    } else {
      const query = MUserFootprintReaction.createQueryBuilder(
        'mUserFootprintReaction',
      )
        .select('reactionType.name', 'name')
        .addSelect(
          'COUNT(mUserFootprintReaction.reactionTypeId)',
          'reaction_count',
        )
        .leftJoin(
          ReactionType,
          'reactionType',
          'mUserFootprintReaction.reactionTypeId = reactionType.id',
        )
        .where('mUserFootprintReaction.footprintId = :footprintId', {
          footprintId,
        })
        .groupBy('reactionType.name');

      return (await query.getRawMany<Reaction.ReactionCount>()).map((v) => ({
        name: v.name,
        reaction_count: Number(v.reaction_count), // 原始取出來是字串
      }));
    }
  },
  expressReaction: async (
    reaction: Pick<
      MUserFootprintReaction,
      'userId' | 'footprintId' | 'reactionTypeId'
    >,
    transactionManager?: EntityManager,
  ) => {
    // 當重複按表情或直接更換表情時會自動更新對應欄的 reactionTypeId
    const newReaction = new MUserFootprintReaction();
    newReaction.userId = reaction.userId;
    newReaction.footprintId = reaction.footprintId;
    newReaction.reactionTypeId = reaction.reactionTypeId;
    if (transactionManager) {
      return await transactionManager.save(newReaction);
    } else {
      return await newReaction.save();
    }
  },
  deleteReaction: async (
    reaction: MUserFootprintReaction,
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.remove(MUserFootprintReaction, reaction);
    } else {
      return await MUserFootprintReaction.remove(reaction);
    }
  },
};
