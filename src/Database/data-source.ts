import { DataSource } from 'typeorm';
import { User } from './Entities/user.js';
import { Footprint } from './Entities/footprint.js';
import { UserCredential } from './Entities/userCredential.js';
import { Role } from './Entities/role.js';
import { MUserRole } from './Entities/mUserRole.js';
import { Followship } from './Entities/followship.js';
import { MUserProfileHashTag } from './Entities/mUserProfileHashTag.js';
import { ProfileHashTag } from './Entities/profileHashTag.js';
import { Notification } from './Entities/notification.js';

import { FootprintHashTag } from './Entities/footprintHashTag.js';
import { ReactionType } from './Entities/reactionType.js';
import { MUserFootprintReaction } from './Entities/mUserFootprintReaction.js';
import { Link } from './Entities/link.js';
import { FootprintEmbedding } from './Entities/footprintEmbedding.js';
import { FootprintHashTagEmbedding } from './Entities/footprintHashTagEmbedding.js';
import { MFootprintFootprintHashTag } from './Entities/mFootprintFootprintHashTag.js';

import { UserEmbedding } from './Entities/userEmbedding.js';
import { ProfileHashTagEmbedding } from './Entities/profileHashTagEmbedding.js';
import { SearchHistory } from './Entities/searchHistory.js';
import { nativeReactions } from '../Application/Features/Footprint/Reaction/Types/reactions.js';
import { reactionTypeRepo } from '../Infrastructure/Repository/reactionTypeRepo.js';
import { userRepo } from '../Infrastructure/Repository/userRepo.js';
import { signUpHandler } from '../Application/Features/User/SignUp/signUpHandler.js';
import { Signup } from '../Application/Features/User/SignUp/Types/api.js';
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;
const MYSQL_PORT = process.env.MYSQL_PORT;
const MYSQL_HOST = process.env.MYSQL_HOST;

export const Database = new DataSource({
  type: 'mysql',
  host: MYSQL_HOST,
  username: MYSQL_USER,
  port: MYSQL_PORT ? Number(MYSQL_PORT) : undefined,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    User,
    Footprint,
    UserCredential,
    Role,
    MUserRole,
    Followship,
    Notification,
    MUserProfileHashTag,
    ProfileHashTag,
    FootprintHashTagEmbedding,
    FootprintHashTag,
    ReactionType,
    MUserFootprintReaction,
    Link,
    FootprintEmbedding,
    MFootprintFootprintHashTag,
    UserEmbedding,
    ProfileHashTagEmbedding,
    SearchHistory,
  ],
});

export async function initFixedDbData() {
  for (const reaction of nativeReactions) {
    const maybeExistReaction = await reactionTypeRepo.findByName(reaction);
    if (maybeExistReaction === null) {
      const newReaction = new ReactionType();
      newReaction.name = reaction;
      await newReaction.save();
    }
  }

  const roles = [
    {
      name: 'user',
      description: 'User role',
    },
    {
      name: 'admin',
      description: 'Admin role',
    },
  ];

  for (const role of roles) {
    const maybeExistRole = await Role.findOne({ where: { name: role.name } });
    if (!maybeExistRole) {
      await Role.insert(role);
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL as string;
  const adminPassword = process.env.ADMIN_PASSWORD as string;

  console.log('adminEmail', adminEmail);
  console.log('adminPassword', adminPassword);

  const maybeExistAdmin = await userRepo.findByEmail(adminEmail);

  if (!maybeExistAdmin) {
    const admin: Signup.ISignUpReq = {
      firstName: 'admin',
      lastName: 'admin',
      lifeRole: 'admin',
      birthday: new Date(),
      gender: 'notdisclosed',
      email: adminEmail,
      links: [],
      password: adminPassword,
      clerkId: 'user_12CWER123....',
      avatar: '',
    };

    const res = await signUpHandler.handle(admin);
    const adminUser = res.data.user;

    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    const mUserRole = new MUserRole();
    mUserRole.userId = adminUser.id;
    mUserRole.roleId = adminRole.id;

    await mUserRole.save();
  }
}
