import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
  OneToOne,
  Index,
} from 'typeorm';
import { Footprint } from './footprint.js';
import { UserCredential } from './userCredential.js';
import { User_Role } from './userRole.js';
import { Followship } from './followship.js';
import { User_Footprint_Reaction } from './users_footprints_reactions.js';
import { Link } from './link.js';
import { UserEmbedding } from './userEmbedding.js';
import { SearchHistory } from './searchHistory.js';
import { User_ProfileHashTag } from './users_profileHashTags.js';

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Index({ fulltext: true, parser: 'ngram' })
  fullName!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  firstName!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastName!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lifeRole!: string;

  @Column({ type: 'date', nullable: true })
  birthday!: Date;

  @Column({ type: 'varchar', default: 'native' })
  provider!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  avatar!: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'nonbinary', 'notdisclosed'],
    nullable: false,
  })
  gender!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  selfIntro!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clerkId!: string | null;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(() => Footprint, (footprint) => footprint.user, { cascade: true })
  footprints?: Relation<Footprint[]>;

  @OneToMany(() => Link, (link) => link.user, { cascade: true })
  links?: Relation<Link[]>;

  @OneToMany(() => User_Role, (user_role) => user_role.user, { cascade: true })
  user_role?: Relation<User_Role[]>;

  @OneToMany(
    () => User_ProfileHashTag,
    (user_profileHashTag) => user_profileHashTag.user,
    {
      cascade: true,
    },
  )
  user_profileHashTag?: Relation<User_ProfileHashTag[]>;

  @OneToMany(
    () => User_Footprint_Reaction,
    (user_footprint_reaction) => user_footprint_reaction.user,
    { cascade: true },
  )
  user_footprint_reaction?: Relation<User_Footprint_Reaction[]>;

  @OneToMany(() => Followship, (followship) => followship.follower, {
    cascade: true,
  })
  followers?: Relation<Followship[]>;

  @OneToMany(() => Followship, (followship) => followship.followee, {
    cascade: true,
  })
  followees?: Relation<Followship[]>;

  @OneToOne(() => UserCredential, (userCredential) => userCredential.user, {
    cascade: true,
  })
  userCredential?: Relation<UserCredential>;

  @OneToOne(() => UserEmbedding, (userEmbedding) => userEmbedding.user, {
    cascade: true,
  })
  selfIntroEmbedding?: Relation<UserEmbedding>;

  @OneToMany(() => SearchHistory, (history) => history.user, { cascade: true })
  searchHistories?: Relation<SearchHistory[]>;
}
