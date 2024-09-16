import { User } from '../../Database/Entities/user.js';
import { UserCredential } from '../../Database/Entities/userCredential.js';
import { EntityManager } from 'typeorm';
export const userCredentialRepo = {
  insertNewUser: async (
    user: User,
    password: string | null,
    transactionManager: EntityManager,
  ): Promise<void> => {
    try {
      const newUserCredential = new UserCredential();
      newUserCredential.password = password;
      newUserCredential.user = user;
      await transactionManager.save(newUserCredential);
    } catch (error) {
      console.error('Failed to save user credential:');
      throw error;
    }
  },
};
