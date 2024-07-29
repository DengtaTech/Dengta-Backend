import { Signup } from '../../Application/Features/User/SignUp/Types/api.js';
import { Link } from '../../Database/Entities/link.js';
import { EntityManager } from 'typeorm';
export const linkRepo = {
  initLink: async (
    links: Signup.ILink[],
    userId: string,
    transactionManager: EntityManager,
  ): Promise<Link[]> => {
    try {
      const linkEntities = links.map((link) => {
        const newLink = new Link();
        newLink.type = link.type;
        newLink.url = link.url;
        newLink.userId = userId;
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
