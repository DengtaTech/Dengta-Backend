import { DataSource } from 'typeorm';
import fs from 'fs';
import { User } from '../../../src/Database/Entities/user.js';
import { Footprint } from '../../../src/Database/Entities/footprint.js';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../../../src/utils/jwt.js';
import {
  nativeReactions,
  type NativeReaction,
} from '../../../src/Application/Features/Footprint/Reaction/Types/reactions.js';

export const testHelper = {
  clearDatabase: async (dataSource: DataSource) => {
    const tablesQuery = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `);
    const tables = tablesQuery.map(
      (row: { TABLE_NAME: string }) => row.TABLE_NAME,
    );
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    for (const table of tables) {
      await dataSource.query(`TRUNCATE TABLE \`${table}\`;`);
    }
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
  },
  createFakeUsers: async (dataSource: DataSource) => {
    const users = fs.readFileSync(
      'src/Test/mockData/fakeUser-api.json',
      'utf8',
    );
    const userData = JSON.parse(users);
    const userArray: User[] = [];
    for (const user of userData) {
      userArray.push(user);
    }
    return await dataSource.getRepository(User).save(userArray);
  },
  generateToken: async (userId: string) => {
    const tokenobj = await auth.generateAccessToken(userId);
    return tokenobj.token;
  },
  createFakeFootprints: async (dataSource: DataSource, userId: string) => {
    const footprints = fs.readFileSync(
      'src/Test/mockData/fakeFootprint-api.json',
      'utf8',
    );
    const footprintData = JSON.parse(footprints);
    footprintData.forEach((footprint: Footprint) => {
      footprint.userId = userId;
    });
    return await dataSource.getRepository(Footprint).save(footprintData);
  },
  addHashtagsToFootprint: async (
    dataSource: DataSource,
    footprintId: string,
    hashtags: string[],
  ) => {
    for (const hashtag of hashtags) {
      const [existingHashtag] = await dataSource.query(
        `
        SELECT id FROM FootprintHashTags WHERE content = ?
      `,
        [hashtag],
      );

      let hashtagId;
      if (existingHashtag) {
        hashtagId = existingHashtag.id;
      } else {
        const newId = uuidv4();
        await dataSource.query(
          `
          INSERT INTO FootprintHashTags (id, content)
          VALUES (?, ?)
        `,
          [newId, hashtag],
        );
        hashtagId = newId;
      }

      await dataSource.query(
        `
        INSERT IGNORE INTO MFootprintFootprintHashTag (footprintId, footprintHashTagId)
        VALUES (?, ?)
      `,
        [footprintId, hashtagId],
      );
    }
  },
  addReactionsToFootprint: async (
    dataSource: DataSource,
    footprintId: string,
    userIds: string[],
    reactions: NativeReaction[],
  ) => {
    for (const reaction of nativeReactions) {
      await dataSource.query(
        `
        INSERT IGNORE INTO ReactionType (id, name)
        VALUES (?, ?)
      `,
        [uuidv4(), reaction],
      );
    }

    for (let i = 0; i < userIds.length; i++) {
      const userId = userIds[i];
      const reaction = reactions[i % reactions.length];

      const [reactionType] = await dataSource.query(
        `
        SELECT id FROM ReactionType WHERE name = ?
      `,
        [reaction],
      );

      await dataSource.query(
        `
        INSERT INTO MUserFootprintReaction (userId, footprintId, reactionTypeId)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE reactionTypeId = VALUES(reactionTypeId)
      `,
        [userId, footprintId, reactionType.id],
      );

      await dataSource.query(
        `
        UPDATE Footprints
        SET totalLike = totalLike + 1
        WHERE id = ?
      `,
        [footprintId],
      );
    }
  },
};
