import { Signup } from '../../Application/Features/User/SignUp/Types/api.js';
import { User } from '../../Database/Entities/user.js';
import { EntityManager, Relation, Brackets } from 'typeorm';
import { Link } from '../../Database/Entities/link.js';
import { Role } from '../../Database/Entities/role.js';
import { GetUserInfo } from '../../Application/Features/User/GetUserInfo/Types/api.js';
import { SearchFollowees } from '../../Application/Features/User/SearchFollowees/Types/api.js';

export const userRepo = {
  findById: async (
    userId: string,
    transactionManager?: EntityManager | undefined,
    joinColumns?: string[],
  ): Promise<GetUserInfo.UserWithHashtagsAndLinks | null> => {
    try {
      const findOneOptions = {
        where: { id: userId },
        relations: joinColumns,
      };

      const user = transactionManager
        ? await transactionManager.findOne(User, findOneOptions)
        : await User.findOne(findOneOptions);
      if (!user) {
        return null;
      }
      // 處理 links
      if (joinColumns?.includes('links')) {
        if (user.links && user.links.length > 0) {
          user.links = user.links.map((link) => {
            const { sourceName, url } = link;
            return { sourceName, url };
          }) as Relation<Link[]>;
        } else {
          user.links = [] as Relation<Link[]>;
        }
      }
      // 處理 mUserProfileHashTag，並改名為 hashtags
      if (
        joinColumns?.includes('mUserProfileHashTag') &&
        joinColumns?.includes('mUserProfileHashTag.profileHashTag')
      ) {
        if (user.mUserProfileHashTag && user.mUserProfileHashTag.length > 0) {
          const hashtags = user.mUserProfileHashTag.map(
            (hashTag) => hashTag.profileHashTag?.content,
          ) as string[];
          delete user.mUserProfileHashTag;
          (user as any).hashtags = hashtags; // 添加新的 hashtags 屬性
        } else {
          // 如果 mUserProfileHashTag 不存在或為空，設置 hashtags 為空陣列
          delete user.mUserProfileHashTag;
          (user as any).hashtags = [];
        }
      }
      return user as GetUserInfo.UserWithHashtagsAndLinks;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  },
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
      newUser.id = userInfoObj.clerkId;
      newUser.email = userInfoObj.email;
      newUser.firstName = userInfoObj.firstName;
      newUser.lastName = userInfoObj.lastName;
      newUser.lifeRole = userInfoObj.lifeRole;
      newUser.birthday = userInfoObj.birthday;
      newUser.provider = userInfoObj.provider as string;
      newUser.avatar = '';
      newUser.gender = userInfoObj.gender;
      const savedUser = await transactionManager.save(newUser);
      return savedUser;
    } catch (error) {
      console.error('Failed to save user:');
      throw error;
    }
  },
  findByNameAndTag: (async ({
    keywords,
    followerId,
    transactionManager,
  }: {
    keywords?: string;
    followerId?: User['id'];
    transactionManager?: EntityManager;
  }) => {
    try {
      if (keywords === undefined && followerId === undefined) {
        throw new Error(
          'keywords and followerId cannot be both undefined. This operation should have been blocked by TS type guard',
        );
      }

      const query = transactionManager
        ? transactionManager.getRepository(User).createQueryBuilder('user')
        : User.createQueryBuilder('user');

      query
        .leftJoinAndSelect('user.mUserProfileHashTag', 'user_hashTag')
        .leftJoinAndSelect('user_hashTag.profileHashTag', 'hashTag');

      if (keywords) {
        query
          .where(
            new Brackets((qb) =>
              qb
                .where(
                  'MATCH(user.fullName) AGAINST (:keywords IN NATURAL LANGUAGE MODE)',
                )
                .orWhere(
                  'MATCH(hashTag.content) AGAINST (:keywords IN NATURAL LANGUAGE MODE)',
                ),
            ),
          )
          .addSelect(
            `MATCH(user.fullName) AGAINST (:keywords IN NATURAL LANGUAGE MODE) +
             MATCH(hashTag.content) AGAINST (:keywords IN NATURAL LANGUAGE MODE)`,
            'relevance_score',
          )
          .orderBy('relevance_score', 'DESC')
          .setParameter('keywords', keywords);
      }

      if (followerId) {
        query
          .leftJoinAndSelect('user.followedBy', 'followedBy')
          .andWhere('followedBy.followerId = :followerId', {
            followerId: followerId,
          });
      }

      return await query.getMany();
    } catch (error) {
      console.error('Error finding user by name and tag:');
      throw error;
    }
  }) as {
    (_: {
      keywords?: string;
      followerId: User['id'];
      transactionManager?: EntityManager;
    }): Promise<SearchFollowees.ISearchFolloweesDto[]>;
    (_: {
      keywords: string;
      followerId?: never;
      transactionManager?: EntityManager;
    }): Promise<User[]>;
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
