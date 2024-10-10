import {
  Entity,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
  OneToOne,
  Index,
  BeforeInsert,
  BeforeUpdate,
  PrimaryColumn,
} from 'typeorm';
import { Footprint } from './footprint.js';
import { UserCredential } from './userCredential.js';
import { MUserRole } from './mUserRole.js';
import { Followship } from './followship.js';
import { MUserFootprintReaction } from './mUserFootprintReaction.js';
import { Link } from './link.js';
import { UserEmbedding } from './userEmbedding.js';
import { SearchHistory } from './searchHistory.js';
import { MUserProfileHashTag } from './mUserProfileHashTag.js';
import { Notification } from './notification.js';
import { MUserQuestionItem } from './mUserQuestionItem.js';
@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
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

  @BeforeInsert()
  @BeforeUpdate()
  setFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  @Column({ type: 'varchar', length: 50, nullable: false })
  lifeRole!: string;

  @Column({ type: 'date', nullable: false })
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

  // @Column({ type: 'varchar', length: 255, nullable: true })
  // clerkId!: string | null;

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

  @OneToMany(() => MUserRole, (mUserRole) => mUserRole.user, { cascade: true })
  mUserRole?: Relation<MUserRole[]>;

  @OneToMany(
    () => MUserProfileHashTag,
    (mUserProfileHashTag) => mUserProfileHashTag.user,
    {
      cascade: true,
    },
  )
  mUserProfileHashTag?: Relation<MUserProfileHashTag[]>;

  @OneToMany(
    () => MUserFootprintReaction,
    (mUserFootprintReaction) => mUserFootprintReaction.user,
    { cascade: true },
  )
  mUserFootprintReaction?: Relation<MUserFootprintReaction[]>;

  @OneToMany(() => Followship, (followship) => followship.follower, {
    cascade: true,
  })
  follows?: Relation<Followship[]>;

  @OneToMany(() => Followship, (followship) => followship.followee, {
    cascade: true,
  })
  followedBy?: Relation<Followship[]>;

  @OneToOne(() => UserCredential, (userCredential) => userCredential.user, {
    cascade: true,
  })
  userCredential?: Relation<UserCredential>;

  @OneToOne(() => UserEmbedding, (userEmbedding) => userEmbedding.user, {
    cascade: true,
  })
  embedding?: Relation<UserEmbedding>;

  @OneToMany(() => SearchHistory, (history) => history.user, { cascade: true })
  searchHistories?: Relation<SearchHistory[]>;

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  })
  notifications?: Relation<Notification[]>;

  @OneToMany(
    () => MUserQuestionItem,
    (mUserQuestionItem) => mUserQuestionItem.user,
    {
      cascade: true,
    },
  )
  questionResponses?: Relation<MUserQuestionItem[]>;
}
