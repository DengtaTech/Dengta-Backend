import { Signup } from '../../Application/Features/User/SignUp/Types/api.js';
import { User } from '../../Database/Entities/user.js';
import { EntityManager, Relation } from 'typeorm';
import { Link } from '../../Database/Entities/link.js';
import { Role } from '../../Database/Entities/role.js';
import { MUserRole } from '../../Database/Entities/mUserRole.js';
import { GetUserInfo } from '../../Application/Features/User/GetUserInfo/Types/api.js';

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
      newUser.firstName = userInfoObj.firstName;
      newUser.lastName = userInfoObj.lastName;
      newUser.lifeRole = userInfoObj.lifeRole;
      newUser.birthday = userInfoObj.birthday;
      newUser.provider = userInfoObj.provider as string;
      newUser.avatar = userInfoObj.avatar as string;
      newUser.gender = userInfoObj.gender;
      newUser.clerkId = userInfoObj.clerkId;
      const savedUser = await transactionManager.save(newUser);

      const defaultRole = await transactionManager.findOne(Role, {
        where: { name: 'user' },
      });
      if (!defaultRole) {
        throw new Error('Default role not found');
      }

      const mUserRole = new MUserRole();
      mUserRole.userId = newUser.id;
      mUserRole.roleId = defaultRole.id;
      await transactionManager.save(mUserRole);

      return savedUser;
    } catch (error) {
      console.error('Failed to save user:');
      throw error;
    }
  },
  findById: async (
    userId: string,
    transactionManager?: EntityManager | undefined,
    joinColumns?: string[],
  ): Promise<User | GetUserInfo.UserWithHashtags | null> => {
    try {
      const findOneOptions = {
        where: { id: userId },
        relations: joinColumns,
      };

      let user: User | null;
      if (transactionManager) {
        user = await transactionManager.findOne(User, findOneOptions);
      } else {
        user = await User.findOne(findOneOptions);
      }

      if (user) {
        if (joinColumns?.includes('links') && user.links) {
          user.links = user.links.map((link) => {
            const { sourceName, url } = link;
            return { sourceName, url };
          }) as Relation<Link[]>;
        }

        if (
          joinColumns?.includes('mUserProfileHashTag') &&
          joinColumns?.includes('mUserProfileHashTag.profileHashTag') &&
          user.mUserProfileHashTag
        ) {
          const userWithHashtags = {
            ...user,
            hashtags: user.mUserProfileHashTag.map(
              (hashTag) => hashTag.profileHashTag?.content,
            ) as string[],
          } as GetUserInfo.UserWithHashtags;
          delete userWithHashtags.mUserProfileHashTag;
          return userWithHashtags;
        }
      }
      return user;
    } catch (error) {
      console.error('Error finding user by id:', error);
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
          .leftJoinAndSelect('user.mUserProfileHashTag', 'user_hashTag')
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
          .leftJoinAndSelect('user.mUserProfileHashTag', 'user_hashTag')
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
  updateLink: async (
    user: User,
    links: Link[],
    transactionManager?: EntityManager,
  ): Promise<void> => {
    try {
      user.links = links;
      if (transactionManager) {
        await transactionManager.save(user);
      } else {
        await user.save();
      }
    } catch (error) {
      console.error('Error updating link:');
      throw error;
    }
  },
  getUserRoles: async (userId: string): Promise<Role[]> => {
    try {
      const userWithRoles = await User.createQueryBuilder('user')
        .leftJoinAndSelect('user.mUserRole', 'mUserRole')
        .leftJoinAndSelect('mUserRole.role', 'role')
        .where('user.id = :userId', { userId })
        .getOne();

      if (!userWithRoles?.mUserRole) {
        return [];
      }

      return userWithRoles.mUserRole.map((mUserRole) => mUserRole.role!);
    } catch (error) {
      console.error('Error getting user roles:');
      throw error;
    }
  },
  getAllUsers: async (): Promise<User[]> => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      console.error('Error getting all users:');
      throw error;
    }
  },
};
