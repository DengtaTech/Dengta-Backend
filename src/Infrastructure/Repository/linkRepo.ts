import { Link } from '../../Database/Entities/link.js';
import { EntityManager } from 'typeorm';
export const linkRepo = {
    initLink: async (
        links: Signup.ILink[],
        userId: number,
        transactionManager: EntityManager,
    ): Promise<void> => {
        try {
            const linkEntities = links.map(link => {
                const newLink = new Link();
                newLink.type = link.type;
                newLink.url = link.url;
                newLink.userId = userId;
                return newLink;
            });
            // 批量插入
            await transactionManager.save(linkEntities);
        } catch (error) {
            console.error('Failed to save user:');
            throw error;
        }
    }
};
