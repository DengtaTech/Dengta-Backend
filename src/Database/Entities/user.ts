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
import { UserRole } from './userRole.js';
import { Followship } from './followship.js';
import { ProfileHashTag } from './profileHashTag.js';
import { FootprintReaction } from './footprintReaction.js';
import { Link } from './link.js';
import { UserEmbedding } from './userEmbedding.js';
import { SearchHistory } from './searchHistory.js';

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  @Index({ fulltext: true, parser: 'ngram' })
  name!: string;

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

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(() => Footprint, (footprint) => footprint.user, { cascade: true })
  footprints?: Relation<Footprint[]>;

  @OneToMany(() => Link, (link) => link.user, { cascade: true })
  links?: Relation<Link[]>;

  @OneToMany(() => UserRole, (userRole) => userRole.user, { cascade: true })
  userRoles?: Relation<UserRole[]>;

  @OneToMany(() => ProfileHashTag, (profileHashTag) => profileHashTag.user, {
    cascade: true,
  })
  profileHashTags?: Relation<ProfileHashTag[]>;

  @OneToMany(
    () => FootprintReaction,
    (footprintReaction) => footprintReaction.user,
    { cascade: true },
  )
  footprintReactions?: Relation<FootprintReaction[]>;

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
