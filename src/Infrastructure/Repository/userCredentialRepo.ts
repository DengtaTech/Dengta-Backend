import { UserCredential } from '../../Database/Entities/userCredential.js';
import { EntityManager } from 'typeorm';
export const userCredentialRepo = {
  insertNewUser: async (
    userId: string,
    password: string | null,
    transactionManager: EntityManager,
  ): Promise<void> => {
    try {
      const newUserCredential = new UserCredential();
      newUserCredential.password = password;
      newUserCredential.userId = userId;
      await transactionManager.save(newUserCredential);
    } catch (error) {
      console.error('Failed to save user credential:');
      throw error;
    }
  },
};
