import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
} from 'typeorm';
import { ProfileHashTag } from './profileHashTag.js';

@Entity({ name: 'ProfileTagType' })
export class ProfileTagType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'varchar' })
  content!: string;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(
    () => ProfileHashTag,
    (profileHashTag) => profileHashTag.profileTagType,
    { cascade: true },
  )
  profileHashTags?: Relation<ProfileHashTag[]>;
}
