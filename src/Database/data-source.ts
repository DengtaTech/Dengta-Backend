import { DataSource } from 'typeorm';
import { User } from './Entities/user.js';
import { Footprint } from './Entities/footprint.js';
import { UserCredential } from './Entities/userCredential.js';
import { Role } from './Entities/role.js';
import { UserRole } from './Entities/userRole.js';
import { Followship } from './Entities/followship.js';
import { ProfileTagType } from './Entities/profileTagType.js';
import { ProfileHashTag } from './Entities/profileHashTag.js';
import { FootprintTagType } from './Entities/footprintTagType.js';
import { FootprintHashTag } from './Entities/footprintHashTag.js';
import { ReactionType } from './Entities/reactionType.js';
import { FootprintReaction } from './Entities/footprintReaction.js';
import { Link } from './Entities/link.js';
import { FootprintEmbedding } from './Entities/footprintEmbedding.js';
import { FootprintTagTypeEmbedding } from './Entities/footprintTagTypeEmbedding.js';
import { UserEmbedding } from './Entities/userEmbedding.js';
import { ProfileTagTypeEmbedding } from './Entities/profileTagTypeEmbedding.js';
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
    UserRole,
    Followship,
    ProfileTagType,
    ProfileHashTag,
    FootprintTagType,
    FootprintHashTag,
    ReactionType,
    FootprintReaction,
    Link,
    FootprintEmbedding,
    FootprintTagTypeEmbedding,
    UserEmbedding,
    ProfileTagTypeEmbedding,
    SearchHistory,
  ],
});
