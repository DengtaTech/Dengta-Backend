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
import { MUserProfileHashTag } from './mUserProfileHashTag.js';
import { ProfileHashTagEmbedding } from './profileHashTagEmbedding.js';

@Entity({ name: 'ProfileHashTags' })
export class ProfileHashTag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  @Index({ fulltext: true, parser: 'ngram' })
  content!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(
    () => MUserProfileHashTag,
    (mUserProfileHashTag) => mUserProfileHashTag.profileHashTag,
    { cascade: true },
  )
  mUserProfileHashTag?: Relation<MUserProfileHashTag[]>;

  @OneToOne(
    () => ProfileHashTagEmbedding,
    (profileHashTagEmbedding) => profileHashTagEmbedding.profileHashTag,
    { cascade: true },
  )
  embedding?: Relation<ProfileHashTagEmbedding>;
}
