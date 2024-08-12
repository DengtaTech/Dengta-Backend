import { Dengta } from '../../Types/common.js';
import { Link } from '../../Database/Entities/link.js';
import { EntityManager } from 'typeorm';
import { User } from '../../Database/Entities/user.js';
export const linkRepo = {
  initLink: async (
    links: Dengta.ILink[],
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
  insertNewLink: async (
    user: User,
    sourceName: string,
    url: string,
    transactionManager?: EntityManager,
  ): Promise<Link> => {
    try {
      if (transactionManager) {
        const link = new Link();
        link.sourceName = sourceName;
        link.url = url;
        link.user = user;
        const savedLink = await transactionManager.save(link);
        return savedLink;
      } else {
        const link = new Link();
        link.sourceName = sourceName;
        link.url = url;
        link.user = user;
        const savedLink = await link.save();
        return savedLink;
      }
    } catch (error) {
      console.error('Error finding user by id:');
      throw error;
    }
  },
  deleteLink: async (
    user: User,
    transactionManager?: EntityManager,
  ): Promise<void> => {
    try {
      if (transactionManager) {
        await transactionManager.delete(Link, { user: user });
      } else {
        await Link.delete({ user: user });
      }
    } catch (error) {
      console.error('Error deleting link by user:');
      throw error;
    }
  },
};
