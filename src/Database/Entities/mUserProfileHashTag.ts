import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
  BaseEntity,
} from 'typeorm';
import { User } from './user.js';
import { ProfileHashTag } from './profileHashTag.js';

@Entity({ name: 'MUserProfileHashTag' })
export class MUserProfileHashTag extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  userId!: string;

  @PrimaryColumn('uuid')
  profileHashTagId!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.mUserProfileHashTag, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(
    () => ProfileHashTag,
    (profileHashTag) => profileHashTag.mUserProfileHashTag,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'profileHashTagId' })
  profileHashTag?: Relation<ProfileHashTag>;
}
