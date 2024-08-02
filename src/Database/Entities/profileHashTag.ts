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
import { User_ProfileHashTag } from './users_profileHashTags.js';
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
    () => User_ProfileHashTag,
    (user_profileHashTag) => user_profileHashTag.profileHashTag,
    { cascade: true },
  )
  user_profileHashTag?: Relation<User_ProfileHashTag[]>;

  @OneToOne(
    () => ProfileHashTagEmbedding,
    (profileHashTagEmbedding) => profileHashTagEmbedding.profileHashTag,
    { cascade: true },
  )
  embedding?: Relation<ProfileHashTagEmbedding>;
}
