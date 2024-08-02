import { Signup } from '../../Application/Features/User/SignUp/Types/api.js';
import { User } from '../../Database/Entities/user.js';
import { EntityManager } from 'typeorm';
export const userRepo = {
  findByEmail: async (email: string): Promise<User | null> => {
    try {
      const user = await User.findOne({
        where: { email: email },
        relations: ['userCredential'],
      });
      return user;
    } catch (error) {
      console.error('Error finding user by email:');
      throw error;
    }
  },
  insertNewUser: async (
    userInfoObj: Signup.ISignUpReq,
    transactionManager: EntityManager,
  ): Promise<User> => {
    try {
      const newUser = new User();
      newUser.email = userInfoObj.email;
      newUser.fullName = userInfoObj.fullName;
      newUser.firstName = userInfoObj.firstName;
      newUser.lastName = userInfoObj.lastName;
      newUser.lifeRole = userInfoObj.lifeRole;
      newUser.birthday = userInfoObj.birthday;
      newUser.provider = userInfoObj.provider as string;
      newUser.avatar = userInfoObj.avatar as string;
      newUser.gender = userInfoObj.gender;
      const savedUser = await transactionManager.save(newUser);
      return savedUser;
    } catch (error) {
      console.error('Failed to save user:');
      throw error;
    }
  },
  findById: async (
    userId: string,
    transactionManager?: EntityManager,
  ): Promise<User | null> => {
    try {
      if (transactionManager) {
        const user = transactionManager.findOne(User, {
          where: { id: userId },
        });
        return user;
      } else {
        const user = await User.findOne({ where: { id: userId } });
        return user;
      }
    } catch (error) {
      console.error('Error finding user by id:');
      throw error;
    }
  },
  findByNameAndTag: async (
    keywords: string,
    transactionManager?: EntityManager,
  ): Promise<User[]> => {
    try {
      if (transactionManager) {
        const users = await transactionManager
          .getRepository(User)
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.user_profileHashTag', 'user_hashTag')
          .leftJoinAndSelect('user_hashTag.profileHashTag', 'hashTag')
          .where(
            'MATCH(user.fullName) AGAINST (:keywords IN NATURAL LANGUAGE MODE)',
          )
          .orWhere(
            'MATCH(hashTag.content) AGAINST (:keywords IN NATURAL LANGUAGE MODE)',
          )
          .addSelect(
            'MATCH(user.fullName) AGAINST (:keywords IN NATURAL LANGUAGE MODE) + MATCH(hashTag.content) AGAINST (:keywords IN NATURAL LANGUAGE MODE)',
            'relevance_score',
          )
          .orderBy('relevance_score', 'DESC')
          .setParameter('keywords', keywords)
          .getMany();
        return users;
      } else {
        const users = await User.createQueryBuilder('user')
          .leftJoinAndSelect('user.user_profileHashTag', 'user_hashTag')
          .leftJoinAndSelect('user_hashTag.profileHashTag', 'hashTag')
          .where(
            'MATCH(user.fullName) AGAINST (:keywords IN NATURAL LANGUAGE MODE)',
          )
          .orWhere(
            'MATCH(hashTag.content) AGAINST (:keywords IN NATURAL LANGUAGE MODE)',
          )
          .addSelect(
            'MATCH(user.fullName) AGAINST (:keywords IN NATURAL LANGUAGE MODE) + MATCH(hashTag.content) AGAINST (:keywords IN NATURAL LANGUAGE MODE)',
            'relevance_score',
          )
          .orderBy('relevance_score', 'DESC')
          .setParameter('keywords', keywords)
          .getMany();
        return users;
      }
    } catch (error) {
      console.error('Error finding user by name and tag:');
      throw error;
    }
  },
};
