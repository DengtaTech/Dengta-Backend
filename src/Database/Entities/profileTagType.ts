import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
  OneToOne,
} from 'typeorm';
import { ProfileHashTag } from './profileHashTag.js';
import { ProfileTagTypeEmbedding } from './profileTagTypeEmbedding.js';

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

  @OneToOne(
    () => ProfileTagTypeEmbedding,
    (profileTagTypeEmbedding) => profileTagTypeEmbedding.profileTagType,
    { cascade: true },
  )
  embedding?: Relation<ProfileTagTypeEmbedding>;
}
