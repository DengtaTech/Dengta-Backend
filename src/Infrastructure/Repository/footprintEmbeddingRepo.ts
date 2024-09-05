import { EntityManager } from 'typeorm';
import { FootprintEmbedding } from '../../Database/Entities/footprintEmbedding.js';
import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';
import { Footprint } from '../../Database/Entities/footprint.js';

export const footprintEmbeddingRepo = {
  findById: async (
    id: FootprintEmbedding['id'],
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(FootprintEmbedding, {
        where: { id },
      });
    } else {
      return await FootprintEmbedding.findOne({ where: { id } });
    }
  },
  findByFootprintId: async (
    footprintId: Footprint['id'],
    transactionManager?: EntityManager,
  ) => {
    if (transactionManager) {
      return await transactionManager.findOne(FootprintEmbedding, {
        where: { id: footprintId },
      });
    } else {
      return await FootprintEmbedding.findOne({ where: { id: footprintId } });
    }
  },
  insertFootprintEmbedding: async (
    footprintEmbedding: Embedding.IFootprintEmbeddingDto,
    transactionManager: EntityManager,
  ) => {
    try {
      const newFootprintEmbedding = new FootprintEmbedding();
      Object.assign(newFootprintEmbedding, footprintEmbedding);

      const savedFootprintEmbedding = await transactionManager.save(
        newFootprintEmbedding,
      );
      return savedFootprintEmbedding;
    } catch (error) {
      console.error('Failed to insert footprintEmbedding:');
      throw error;
    }
  },
  updateFootprintEmbedding: async (
    footprintId: Footprint['id'],
    updateFootprintEmbedding: Embedding.IUpdateFootprintEmbeddingDto,
    transactionManager: EntityManager,
  ) => {
    const footprintEmbedding = await transactionManager.findOne(
      FootprintEmbedding,
      {
        where: { footprintId },
      },
    );

    if (!footprintEmbedding) {
      throw new Error('FootprintEmbedding not found');
    }

    Object.assign(footprintEmbedding, updateFootprintEmbedding);
    try {
      await transactionManager.save(footprintEmbedding);
    } catch (error) {
      console.error('Failed to update footprintEmbedding:');
      throw error;
    }
  },
  getLastKPublishedFootprintEmbeddingWithAllRelationsByUserId: async (
    userId: string,
    k: number,
    transactionManager?: EntityManager,
  ): Promise<Embedding.IEmbeddingFootprintWithHashTagEmbedding[]> => {
    if (transactionManager) {
      const footprints = await Footprint.createQueryBuilder('footprint')
        .leftJoinAndSelect('footprint.embedding', 'footprintEmbedding')
        .leftJoinAndSelect(
          'footprint.mFootprintFootprintHashTag',
          'mFootprintFootprintHashTags',
        )
        .leftJoinAndSelect(
          'mFootprintFootprintHashTags.footprintHashTag',
          'footprintHashTag',
        )
        .leftJoinAndSelect(
          'footprintHashTag.embedding',
          'footprintHashTagEmbedding',
        )
        .where('footprint.userId = :userId and footprint.status = :status', {
          userId,
          status: 'published',
        })
        .orderBy('footprint.createdAt', 'DESC')
        .take(k)
        .getMany();

      if (!footprints) {
        return [];
      }

      const footprintsEmbedding = footprints.map((footprint) => {
        return {
          id: footprint.id,
          createdAt: footprint.createdAt,
          titleEmbedding: footprint.embedding?.titleEmbedding || [],
          contentEmbedding: footprint.embedding?.contentEmbedding || [],
          hashTagEmbeddings:
            footprint.mFootprintFootprintHashTag?.map(
              (tag) => tag.footprintHashTag?.embedding?.contentEmbedding || [],
            ) || [],
        };
      });

      return footprintsEmbedding;
    } else {
      const footprints = await Footprint.createQueryBuilder('footprint')
        .leftJoinAndSelect('footprint.embedding', 'footprintEmbedding')
        .leftJoinAndSelect(
          'footprint.mFootprintFootprintHashTag',
          'mFootprintFootprintHashTags',
        )
        .leftJoinAndSelect(
          'mFootprintFootprintHashTags.footprintHashTag',
          'footprintHashTag',
        )
        .leftJoinAndSelect(
          'footprintHashTag.embedding',
          'footprintHashTagEmbedding',
        )
        .where('footprint.userId = :userId and footprint.status = :status', {
          userId,
          status: 'published',
        })
        .orderBy('footprint.createdAt', 'DESC')
        .take(k)
        .getMany();

      if (!footprints) {
        return [];
      }

      const footprintsEmbedding = footprints.map((footprint) => {
        return {
          id: footprint.id,
          createdAt: footprint.createdAt,
          titleEmbedding: footprint.embedding?.titleEmbedding || [],
          contentEmbedding: footprint.embedding?.contentEmbedding || [],
          hashTagEmbeddings:
            footprint.mFootprintFootprintHashTag?.map(
              (tag) => tag.footprintHashTag?.embedding?.contentEmbedding || [],
            ) || [],
        };
      });
      return footprintsEmbedding;
    }
  },
  getAllPublishedFootprintEmbeddingWithAllRelationsByUserId: async (
    userId: string,
    transactionManager?: EntityManager,
  ): Promise<Embedding.IEmbeddingFootprintWithHashTagEmbedding[]> => {
    if (transactionManager) {
      const footprints = await Footprint.createQueryBuilder('footprint')
        .leftJoinAndSelect('footprint.embedding', 'footprintEmbedding')
        .leftJoinAndSelect(
          'footprint.mFootprintFootprintHashTag',
          'mFootprintFootprintHashTags',
        )
        .leftJoinAndSelect(
          'mFootprintFootprintHashTags.footprintHashTag',
          'footprintHashTag',
        )
        .leftJoinAndSelect(
          'footprintHashTag.embedding',
          'footprintHashTagEmbedding',
        )
        .where('footprint.userId = :userId and footprint.status = :status', {
          userId,
          status: 'published',
        })
        .orderBy('footprint.createdAt', 'DESC')
        .getMany();

      if (!footprints) {
        return [];
      }

      const footprintsEmbedding = footprints.map((footprint) => {
        return {
          id: footprint.id,
          createdAt: footprint.createdAt,
          titleEmbedding: footprint.embedding?.titleEmbedding || [],
          contentEmbedding: footprint.embedding?.contentEmbedding || [],
          hashTagEmbeddings:
            footprint.mFootprintFootprintHashTag?.map(
              (tag) => tag.footprintHashTag?.embedding?.contentEmbedding || [],
            ) || [],
        };
      });

      return footprintsEmbedding;
    } else {
      const footprints = await Footprint.createQueryBuilder('footprint')
        .leftJoinAndSelect('footprint.embedding', 'footprintEmbedding')
        .leftJoinAndSelect(
          'footprint.mFootprintFootprintHashTag',
          'mFootprintFootprintHashTags',
        )
        .leftJoinAndSelect(
          'mFootprintFootprintHashTags.footprintHashTag',
          'footprintHashTag',
        )
        .leftJoinAndSelect(
          'footprintHashTag.embedding',
          'footprintHashTagEmbedding',
        )
        .where('footprint.userId = :userId and footprint.status = :status', {
          userId,
          status: 'published',
        })
        .orderBy('footprint.createdAt', 'DESC')
        .getMany();

      if (!footprints) {
        return [];
      }

      const footprintsEmbedding = footprints.map((footprint) => {
        return {
          id: footprint.id,
          createdAt: footprint.createdAt,
          titleEmbedding: footprint.embedding?.titleEmbedding || [],
          contentEmbedding: footprint.embedding?.contentEmbedding || [],
          hashTagEmbeddings:
            footprint.mFootprintFootprintHashTag?.map(
              (tag) => tag.footprintHashTag?.embedding?.contentEmbedding || [],
            ) || [],
        };
      });

      return footprintsEmbedding;
    }
  },
};
