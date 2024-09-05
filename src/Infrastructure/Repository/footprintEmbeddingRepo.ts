import { EntityManager } from 'typeorm';
import { FootprintEmbedding } from '../../Database/Entities/footprintEmbedding.js';
import { Embedding } from '../../Application/Features/Recommendation/Embedding/Types/api.js';
import { Footprint } from '../../Database/Entities/footprint.js';

export const footprintEmbeddingRepo = {
  findById: async (
    id: FootprintEmbedding['id'],
    transactionManager?: EntityManager,
  ) => {
    return footprintEmbeddingRepo.findOneById(id, transactionManager);
  },
  findByFootprintId: async (
    footprintId: Footprint['id'],
    transactionManager?: EntityManager,
  ) => {
    return footprintEmbeddingRepo.findOneById(footprintId, transactionManager);
  },
  findOneById: async (id: string, transactionManager?: EntityManager) => {
    if (transactionManager) {
      return await transactionManager.findOne(FootprintEmbedding, {
        where: { id },
      });
    }
    return await FootprintEmbedding.findOne({ where: { id } });
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
    const footprintEmbedding = await footprintEmbeddingRepo.findOneById(
      footprintId,
      transactionManager,
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
  getPublishedFootprintEmbeddingWithAllRelationsByUserId: async (
    userId: string,
    limit?: number,
    transactionManager?: EntityManager,
  ): Promise<Embedding.IEmbeddingFootprintWithHashTagEmbedding[]> => {
    const query = (
      transactionManager?.createQueryBuilder(Footprint, 'footprint') ||
      Footprint.createQueryBuilder('footprint')
    )
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
      .orderBy('footprint.createdAt', 'DESC');

    if (limit) {
      query.take(limit);
    }

    const footprints = await query.getMany();

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
  },
};
