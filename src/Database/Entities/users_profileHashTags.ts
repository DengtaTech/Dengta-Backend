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

@Entity({ name: 'Users_ProfileHashTags' })
export class User_ProfileHashTag extends BaseEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @PrimaryColumn('uuid')
  profileHashTagId!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.user_profileHashTag, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(
    () => ProfileHashTag,
    (profileHashTag) => profileHashTag.user_profileHashTag,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'profileHashTagId' })
  profileHashTag?: Relation<ProfileHashTag>;
}
