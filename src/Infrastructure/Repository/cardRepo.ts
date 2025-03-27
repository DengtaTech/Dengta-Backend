import { Card } from '../../Database/Entities/card.js';
import logger from '../../Database/Logger/index.js';

export const cardRepo = {
  findById: async (id: string): Promise<Card | null> => {
    try {
      const card = await Card.findOne({ where: { id } });
      return card;
    } catch (error) {
      logger.error(error, 'Failed to find bowl by id:');
      throw error;
    }
  },
  findByUserId: async (userId: string): Promise<Card | null> => {
    try {
      const card = await Card.findOne({
        where: {
          userId,
        },
      });
      return card;
    } catch (error) {
      logger.error(error, 'Failed to find card by userId:');
      throw error;
    }
  },
};
