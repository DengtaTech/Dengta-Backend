import { EntityManager } from 'typeorm';
import { Mention } from '../../Database/Entities/mention.js';
import { GetMention } from '../../Application/Features/Volume/Mention/getMention/Types/api.js';
import { v4 as uuidv4 } from 'uuid';

const getMonday = (date: Date): string => {
  const copyDate = new Date(date);
  copyDate.setHours(12);

  const day = copyDate.getDay();
  const diff = copyDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(copyDate.setDate(diff));
  return monday.toISOString().split('T')[0];
};

export const mentionRepo = {
  insertOrUpdate: async (
    keyword: string,
    date: Date,
    count: GetMention.IMentionCount,
    transactionManager?: EntityManager,
  ): Promise<void> => {
    const startTimestamp = getMonday(date);

    try {
      if (transactionManager) {
        let mention = await transactionManager.findOne(Mention, {
          where: { keyword, startTimestamp },
        });

        if (mention) {
          mention.footprints += count.footprints;
          mention.search += count.search;
          await transactionManager.save(mention);
        } else {
          mention = new Mention();
          mention.id = uuidv4();
          mention.keyword = keyword;
          mention.startTimestamp = startTimestamp;
          mention.footprints = count.footprints;
          mention.search = count.search;
          await transactionManager.save(mention);
        }
      } else {
        let mention = await Mention.findOne({
          where: { keyword, startTimestamp },
        });

        if (mention) {
          mention.footprints += count.footprints;
          mention.search += count.search;
          await mention.save();
        } else {
          mention = new Mention();
          mention.id = uuidv4();
          mention.keyword = keyword;
          mention.startTimestamp = startTimestamp;
          mention.footprints = count.footprints;
          mention.search = count.search;
          await mention.save();
        }
      }
    } catch (error) {
      console.error('Error insert or update mention:');
      throw error;
    }
  },
  getAllMentions: async (
    transactionManager?: EntityManager,
  ): Promise<Mention[]> => {
    if (transactionManager) {
      return await transactionManager.find(Mention);
    } else {
      return await Mention.find();
    }
  },
  getMentionsInWeek: async (
    startTimestamp: Date,
    transactionManager?: EntityManager,
  ): Promise<Mention[]> => {
    const weekStart = getMonday(startTimestamp);

    if (transactionManager) {
      return await transactionManager.find(Mention, {
        where: { startTimestamp: weekStart },
      });
    } else {
      return await Mention.find({
        where: { startTimestamp: weekStart },
      });
    }
  },
  getMentionsTotalCountInWeek: async (
    startTimestamp: Date,
    transactionManager?: EntityManager,
  ): Promise<GetMention.IMentionTotalCount[]> => {
    const weekStart = getMonday(startTimestamp);
    let result;
    try {
      if (transactionManager) {
        result = await transactionManager
          .createQueryBuilder()
          .select('keyword')
          .addSelect('SUM(footprints + search)', 'totalCount')
          .from(Mention, 'mention')
          .where('startTimestamp = :startTimestamp', {
            startTimestamp: weekStart,
          })
          .groupBy('keyword')
          .getRawMany();
      } else {
        result = await Mention.createQueryBuilder()
          .select('keyword')
          .addSelect('SUM(footprints + search)', 'totalCount')
          .where('startTimestamp = :startTimestamp', {
            startTimestamp: weekStart,
          })
          .groupBy('keyword')
          .getRawMany();
      }

      return result.map((r) => ({
        keyword: r.keyword,
        totalCount: parseInt(r.totalCount),
      }));
    } catch (error) {
      console.error('Error get mentions total count in week:');
      throw error;
    }
  },
};
