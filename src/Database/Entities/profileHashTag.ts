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
import { ProfileTagType } from './profileTagType.js';

@Entity({ name: 'ProfileHashTags' })
export class ProfileHashTag extends BaseEntity {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  userId!: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  profileTagTypeId!: number;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.profileHashTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(
    () => ProfileTagType,
    (profileTagType) => profileTagType.profileHashTags,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'profileTagTypeId' })
  profileTagType?: Relation<ProfileTagType>;
}
