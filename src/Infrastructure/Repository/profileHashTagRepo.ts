import { ProfileHashTag } from '../../Database/Entities/profileHashTag.js';
import { EntityManager } from 'typeorm';

export const profileHashTagRepo = {
  findByContent: async (content: string): Promise<ProfileHashTag | null> => {
    try {
      const profileHashTag = await ProfileHashTag.findOne({
        where: { content: content },
      });
      return profileHashTag;
    } catch (error) {
      console.error('Error finding profileHashTag by content:');
      throw error;
    }
  },
  findOrCreate: async (
    content: string,
    transactionManager?: EntityManager,
  ): Promise<ProfileHashTag> => {
    const repository = transactionManager
      ? transactionManager.getRepository(ProfileHashTag)
      : ProfileHashTag.getRepository();

    let profileHashTag = await repository.findOne({ where: { content } });

    if (!profileHashTag) {
      profileHashTag = repository.create({ content });
      await repository.save(profileHashTag);
    }

    return profileHashTag;
  },
};
