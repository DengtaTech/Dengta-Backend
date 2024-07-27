import { User } from '../../Database/Entities/user.js';
import { EntityManager } from 'typeorm';
export const userRepo = {
  insertNewUser: async (
    userInfoObj: Signup.ISignUpObject,
    transactionManager: EntityManager,
  ): Promise<User> => {
    try {
      const newUser = new User();
      newUser.name = userInfoObj.name;
      newUser.lifeRole = userInfoObj.lifeRole;
      newUser.birthday = userInfoObj.birthday;
      newUser.provider = userInfoObj.provider;
      newUser.avatar = userInfoObj.avatar;
      newUser.gender = userInfoObj.gender;
      const savedUser = await transactionManager.save(newUser);
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
