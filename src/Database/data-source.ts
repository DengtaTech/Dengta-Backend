import { DataSource } from 'typeorm';
import { User } from './Entities/user.js';
import { Footprint } from './Entities/footprint.js';
import { UserCredential } from './Entities/userCredential.js';
import { Role } from './Entities/role.js';
import { User_Role } from './Entities/userRole.js';
import { Followship } from './Entities/followship.js';
import { User_ProfileHashTag } from './Entities/users_profileHashTags.js';
import { ProfileHashTag } from './Entities/profileHashTag.js';

import { FootprintHashTag } from './Entities/footprintHashTag.js';
import { ReactionType } from './Entities/reactionType.js';
import { User_Footprint_Reaction } from './Entities/users_footprints_reactions.js';
import { Link } from './Entities/link.js';
import { FootprintEmbedding } from './Entities/footprintEmbedding.js';
import { FootprintHashTagEmbedding } from './Entities/footprintHashTagEmbedding.js';
import { Footprint_FootprintHashTag } from './Entities/footprints_footprintHashTags.js';

import { UserEmbedding } from './Entities/userEmbedding.js';
import { ProfileHashTagEmbedding } from './Entities/profileHashTagEmbedding.js';
import { SearchHistory } from './Entities/searchHistory.js';
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
  entities: [
    User,
    Footprint,
    UserCredential,
    Role,
    User_Role,
    Followship,
    User_ProfileHashTag,
    ProfileHashTag,
    FootprintHashTagEmbedding,
    FootprintHashTag,
    ReactionType,
    User_Footprint_Reaction,
    Link,
    FootprintEmbedding,
    Footprint_FootprintHashTag,
    UserEmbedding,
    ProfileHashTagEmbedding,
    SearchHistory,
  ],
});
