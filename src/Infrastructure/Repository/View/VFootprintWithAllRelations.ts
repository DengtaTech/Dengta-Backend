import {
  NativeReaction,
  nativeReactions,
} from '../../../Application/Features/Footprint/Reaction/Types/reactions.js';
import { Footprint } from '../../../Database/Entities/footprint.js';
import { View } from './view.js';

export const buildFootprintWithAllRelationsQuery = () => {
  return Footprint.createQueryBuilder('footprint')
    .leftJoinAndSelect(
      'footprint.mFootprintFootprintHashTag',
      'hashTagRelation',
    )
    .leftJoinAndSelect('hashTagRelation.footprintHashTag', 'hashTag')
    .leftJoinAndSelect('footprint.mUserFootprintReaction', 'reaction')
    .leftJoinAndSelect('reaction.reactionType', 'reactionType')
    .select([
      'footprint',
      'hashTagRelation',
      'hashTag.content',
      'reaction',
      'reactionType.name',
    ]);
};

export const mapFootprintData = (footprint: Footprint): View.FootprintDto => {
  let hashtags =
    footprint.mFootprintFootprintHashTag?.map(
      (hashTagRelation) => hashTagRelation.footprintHashTag?.content,
    ) || [];
  hashtags = (hashtags as string[]).sort((a, b) => a.localeCompare(b));

  const reactionCounts = footprint.mUserFootprintReaction?.reduce(
    (acc, reaction) => {
      const reactionName = reaction.reactionType?.name;
      if (reactionName) {
        acc[reactionName] = (acc[reactionName] || 0) + 1;
      }
      return acc;
    },
    {} as Record<NativeReaction, number>,
  );

  const reactionCountsWithZero = nativeReactions.reduce(
    (acc, reaction) => {
      acc[reaction] = reactionCounts?.[reaction] || 0;
      return acc;
    },
    {} as Record<NativeReaction, number>,
  );

  delete footprint.mFootprintFootprintHashTag;
  delete footprint.mUserFootprintReaction;

  return {
    ...footprint,
    hashtags: hashtags,
    reactionCounts: reactionCountsWithZero,
  } as View.FootprintDto;
};
