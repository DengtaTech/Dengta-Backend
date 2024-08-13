import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Relation,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { ProfileHashTag } from './profileHashTag.js';

@Entity({ name: 'ProfileHashTagEmbedding' })
export class ProfileHashTagEmbedding extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'json', nullable: false })
  contentEmbedding!: number[];

  @Column('uuid')
  profileHashTagId!: string;

  @OneToOne(
    () => ProfileHashTag,
    (profileHashTag) => profileHashTag.embedding,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'profileHashTagId' })
  profileHashTag?: Relation<ProfileHashTag>;
}
