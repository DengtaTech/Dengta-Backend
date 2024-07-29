import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
  Index,
} from 'typeorm';
import { ProfileHashTag } from './profileHashTag.js';

@Entity({ name: 'ProfileTagType' })
export class ProfileTagType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'varchar' })
  @Index({ fulltext: true, parser: 'ngram' })
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
