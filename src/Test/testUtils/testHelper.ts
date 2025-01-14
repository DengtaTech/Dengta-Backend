import { DataSource } from 'typeorm';
import fs from 'fs';
import { Readable } from 'stream';
import { MUserProfileHashTag } from '../../../src/Database/Entities/mUserProfileHashTag.js';
import { ProfileHashTag } from '../../Database/Entities/profileHashTag.js';
import { Footprint } from '../../../src/Database/Entities/footprint.js';
import { Notification } from '../../../src/Database/Entities/notification.js';
import { FootprintHashTag } from '../../../src/Database/Entities/footprintHashTag.js';
import { MFootprintFootprintHashTag } from '../../../src/Database/Entities/mFootprintFootprintHashTag.js';
import { ReactionType } from '../../../src/Database/Entities/reactionType.js';
import { MUserFootprintReaction } from '../../../src/Database/Entities/mUserFootprintReaction.js';
import { auth } from '../../../src/utils/jwt.js';
import {
  nativeReactions,
  type NativeReaction,
} from '../../../src/Application/Features/Footprint/Reaction/Types/reactions.js';

import { signUpHandler } from '../../Application/Features/User/SignUp/signUpHandler.js';
import { initFootprintHandler } from '../../Application/Features/Footprint/InitFootprint/initFootprintHandler.js';
import { publishFootprintHandler } from '../../Application/Features/Footprint/PublishFootprint/publishFootprintHandler.js';
import { patchUserInfoHandler } from '../../Application/Features/User/PatchUserInfo/patchUserInfoHandler.js';
import { insertResponseHandler } from '../../Application/Features/QuestionItem/InsertResponse/insertResponseHandler.js';
import path from 'path';
import { uploadAvatarHandler } from '../../Application/Features/User/UploadAvatar/uploadAvatarHandler.js';
import { initFixedDbData } from '../../Database/data-source.js';

export type TFootprintJson = Footprint & {
  hashtags: string[];
  reactions: Record<NativeReaction, number>;
};

export const testHelper = {
  reactionTypesIdMap: {} as Record<string, string>,
  userToFootprintsMap: {} as Record<string, TFootprintJson[]>,
  initReactionTypes: async (dataSource: DataSource) => {
    const reactionTypeRepo = dataSource.getRepository(ReactionType);
    const reactionTypes = await reactionTypeRepo.save(
      nativeReactions.map((reaction: NativeReaction) => ({ name: reaction })),
    );
    for (const reactionType of reactionTypes) {
      testHelper.reactionTypesIdMap[reactionType.name] = reactionType.id;
    }
  },
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
    const usersJsonFile = fs.readFileSync(
      'src/Test/mockData/fakeUser-api.json',
      'utf8',
    );
    const userDataParsed = JSON.parse(usersJsonFile);
    const userIds: string[] = [];

    // const userRepo = dataSource.getRepository(User);
    // const userCredRepo = dataSource.getRepository(UserCredential);
    // const linkRepo = dataSource.getRepository(Link);
    const hashtagRepo = dataSource.getRepository(ProfileHashTag);
    const mUserProfileHashTagRepo =
      dataSource.getRepository(MUserProfileHashTag);

    for (const userRaw of userDataParsed) {
      const { password, links, hashtags } = userRaw;

      const signUpRes = await signUpHandler.handle({
        firstName: userRaw.firstName,
        lastName: userRaw.lastName,
        lifeRole: userRaw.lifeRole,
        gender: userRaw.gender,
        birthday: new Date('1990-01-01'),
        email: userRaw.email,
        password: password,
        links: [...links],
        clerkId: userRaw.clerkId,
        provider: 'native',
      });
      const userId = signUpRes.data.user.id;
      userIds.push(userId);

      // const linksPromise = links.length
      //   ? linkRepo.save(links.map((link: Link) => ({ ...link, userId })))
      //   : Promise.resolve();

      // Process hashtags
      let hashtagIds: string[] = [];
      if (hashtags.length) {
        const existingHashtags = await hashtagRepo.find({
          where: hashtags.map((hashtag: ProfileHashTag) => ({
            content: hashtag,
          })),
        });

        const existingHashtagContents = existingHashtags.map(
          (hashtag) => hashtag.content,
        );
        const newHashtags = hashtags.filter(
          (hashtag: string) => !existingHashtagContents.includes(hashtag),
        );

        if (newHashtags.length) {
          const savedHashtags = await hashtagRepo.save(
            newHashtags.map((hashtag: string) => ({ content: hashtag })),
          );
          hashtagIds = savedHashtags.map(
            (hashtag: ProfileHashTag) => hashtag.id,
          );
        }

        hashtagIds = [
          ...hashtagIds,
          ...existingHashtags.map((hashtag) => hashtag.id),
        ];
      }

      const mUserProfileHashTagPromise = hashtagIds.length
        ? mUserProfileHashTagRepo.save(
            hashtagIds.map((id) => ({
              userId,
              profileHashTagId: id,
            })),
          )
        : Promise.resolve();

      await Promise.all([mUserProfileHashTagPromise]);
    }

    return userIds;
  },
  generateToken: async (userId: string) => {
    const tokenobj = await auth.generateAccessToken(userId);
    return tokenobj.token;
  },
  createFakeFootprints: async (dataSource: DataSource, userIds: string[]) => {
    const footprintsJsonFile = fs.readFileSync(
      'src/Test/mockData/fakeFootprint-api.json',
      'utf8',
    );
    const footprintData = JSON.parse(footprintsJsonFile);

    const footprintRepo = dataSource.getRepository(Footprint);
    const hashtagRepo = dataSource.getRepository(FootprintHashTag);
    const mFootprintFootprintHashTagRepo = dataSource.getRepository(
      MFootprintFootprintHashTag,
    );
    const mUserFootprintReactionRepo = dataSource.getRepository(
      MUserFootprintReaction,
    );

    const footprintIds: string[] = [];
    const footprintPromises = footprintData.map(
      async (footprint: TFootprintJson, index: number) => {
        const { hashtags, reactions, ...footprintDetails } = footprint;
        const randomUserId = userIds[index % userIds.length];
        const newFootprint = await footprintRepo.save({
          ...footprintDetails,
          userId: randomUserId,
        });
        const footprintId = newFootprint.id;
        footprintIds.push(footprintId);

        if (testHelper.userToFootprintsMap[randomUserId]) {
          testHelper.userToFootprintsMap[randomUserId].push(footprint);
        } else {
          testHelper.userToFootprintsMap[randomUserId] = [footprint];
        }

        // Process hashtags
        const hashtagPromises = hashtags.map(async (hashtag: string) => {
          let existingHashtag = await hashtagRepo.findOne({
            where: { content: hashtag },
          });
          if (!existingHashtag) {
            existingHashtag = await hashtagRepo.save({ content: hashtag });
          }
          return existingHashtag.id;
        });

        const hashtagIds = await Promise.all(hashtagPromises);
        if (hashtagIds.length > 0) {
          await mFootprintFootprintHashTagRepo.save(
            hashtagIds.map((id) => ({
              footprintId,
              footprintHashTagId: id,
            })),
          );
        }

        if (!testHelper.reactionTypesIdMap) {
          throw new Error('Reaction types not initialized');
        }

        let counter = 0; // 一個 user 只能對同一個 footprint 有一個 reaction，footprint 的 totalLike 不能多於 user 的數量
        const reactionTypes = nativeReactions; // List of reaction types
        const reactionPromises = reactionTypes.map(
          async (reactionName: NativeReaction) => {
            const reactionCount = reactions[reactionName];
            const reactionTypeId = testHelper.reactionTypesIdMap[reactionName];

            if (reactionTypeId && reactionCount > 0) {
              const reactionEntities = Array(reactionCount)
                .fill(null)
                .map(() => {
                  const obj = {
                    footprintId,
                    reactionTypeId,
                    userId: userIds[counter % userIds.length],
                  };
                  counter++;
                  return obj;
                });

              await mUserFootprintReactionRepo.save(reactionEntities);
            }
          },
        );

        await Promise.all(reactionPromises);
      },
    );

    await Promise.all(footprintPromises);
    return footprintIds;
  },
  sortAlphabetically: (arr: string[]): string[] =>
    [...arr].sort((a, b) => a.localeCompare(b)),
  sortByOccurAt: (arr: TFootprintJson[]): TFootprintJson[] => {
    return arr.sort((a, b) => {
      const dateA = new Date(a.occurAt).getTime();
      const dateB = new Date(b.occurAt).getTime();
      return dateB - dateA;
    });
  },
  createFakeOfficialNotifications: async (
    dataSource: DataSource,
    userId: string,
  ) => {
    const notifications = fs.readFileSync(
      'src/Test/mockData/fakeOfficialNotification-api.json',
      'utf8',
    );

    const notificationData = JSON.parse(notifications);

    const baseTime = new Date();

    for (const notification of notificationData) {
      notification.userId = userId;

      notification.createdAt = new Date(baseTime);
      baseTime.setSeconds(baseTime.getSeconds() + 1);

      await dataSource.getRepository(Notification).save(notification);
    }

    return notificationData;
  },
  createFakeUsersForRecommendation: async (userNumber: number) => {
    await initFixedDbData();

    const usertsJsonFile = fs.readFileSync(
      'src/Test/mockData/fakeUser-ch.json',
      'utf8',
    );
    const userDataParsed = JSON.parse(usertsJsonFile);

    const fakeUserIds: string[] = [];
    let counter = 0;
    const uploadPromises = [];
    for (const [index, userRaw] of userDataParsed.entries()) {
      const signUpRes = await signUpHandler.handle({
        firstName: userRaw.firstName,
        lastName: userRaw.lastName,
        lifeRole: userRaw.lifeRole,
        gender: userRaw.gender,
        birthday: new Date('1990-01-01'),
        email: userRaw.email,
        password: 'test',
        links: [],
        clerkId: userRaw.clerkId,
        provider: 'native',
      });

      await patchUserInfoHandler.handle(signUpRes.data.user.id, {
        selfIntro: userRaw.selfIntro,
        hashtags: userRaw.hashtags,
        links: [],
      });

      const questionRes = userRaw.questionResponses.map(
        (response: string, index: number) => ({
          id: index + 1,
          response,
        }),
      );

      await insertResponseHandler.handle(signUpRes.data.user.id, {
        questionRes,
      });

      const avatarFilename = `avatar${index + 1}.jpg`;
      const avatarPath = path.join(
        'src/Test/mockData',
        'avatars',
        avatarFilename,
      );
      if (fs.existsSync(avatarPath)) {
        const fileBuffer = fs.readFileSync(avatarPath);

        const mockFile: Express.Multer.File = {
          fieldname: 'avatar',
          originalname: avatarFilename,
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: fileBuffer,
          size: fileBuffer.length,
          stream: Readable.from(fileBuffer),
          destination: '',
          filename: '',
          path: '',
        };

        const uploadPromise = uploadAvatarHandler
          .handle(signUpRes.data.user.id, mockFile)
          .catch((error) => {
            console.error(
              `Failed to upload avatar for user ${signUpRes.data.user.id}:`,
              error,
            );
          });

        uploadPromises.push(uploadPromise);
      } else {
        console.warn(
          `Avatar file not found for user ${signUpRes.data.user.id}: ${avatarFilename}`,
        );
      }
      for (let i = 0; i < userRaw.footprints.length; i++) {
        const footprintData = userRaw.footprints[i];
        const footprintInitRes = await initFootprintHandler.handle(
          signUpRes.data.user.id,
          'draft',
        );
        await publishFootprintHandler.handle(signUpRes.data.user.id, {
          footprintId: footprintInitRes.data.footprint.id,
          title: footprintData.title,
          content: footprintData.content,
          hashtags: footprintData.tags,
          category: i % 2 == 0 ? 'career' : 'life',
          milestone: i % 2 == 0,
          occurAt: new Date(`2021-0${i + 1}-01`),
          status: 'published',
        });
      }

      fakeUserIds.push(signUpRes.data.user.id);

      counter++;
      if (counter >= userNumber) {
        break;
      }
    }
    await Promise.all(uploadPromises);
    return fakeUserIds;
  },
};
