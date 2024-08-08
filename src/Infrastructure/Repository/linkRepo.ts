import { Signup } from '../../Application/Features/User/SignUp/Types/api.js';
import { Link } from '../../Database/Entities/link.js';
import { EntityManager } from 'typeorm';
import { User } from '../../Database/Entities/user.js';
export const linkRepo = {
  initLink: async (
    links: Signup.ILink[],
    user: User,
    transactionManager: EntityManager,
  ): Promise<Link[]> => {
    try {
      const linkEntities = links.map((link) => {
        const newLink = new Link();
        newLink.sourceName = link.sourceName;
        newLink.url = link.url;
        newLink.user = user;
        return newLink;
      });
      // 批量插入
      const savedLinks = await transactionManager.save(linkEntities);
      return savedLinks;
    } catch (error) {
      console.error('Failed to save user:');
      throw error;
    }
  },
};
