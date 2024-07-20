import { User } from '../../Database/Entities/user.js';
import { EntityManager } from 'typeorm';
export const userRepo = {
  insertNewUser: async (
    realName: string,
    accountName: string,
    transactionManager: EntityManager,
  ): Promise<User> => {
    try {
      const jane = new User();
      jane.realName = realName;
      jane.accountName = accountName;
      const savedUser = await transactionManager.save(jane);
      return savedUser;
    } catch (error) {
      console.error('Failed to save user:');
      throw error;
    }
  },
  findById: async (userId: number): Promise<User | null> => {
    try {
      const user = await User.findOne({ where: { id: userId } });
      return user;
    } catch (error) {
      console.error('Error finding user by id:');
      throw error;
    }
  },
};
