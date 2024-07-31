import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Relation,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { ProfileTagType } from './profileTagType.js';

@Entity({ name: 'ProfileTagType' })
export class ProfileTagTypeEmbedding extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'json', nullable: false })
  contentEmbedding!: number[];

  @OneToOne(
    () => ProfileTagType,
    (profileTagType) => profileTagType.embedding,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'profileTagTypeId' })
  profileTagType?: Relation<ProfileTagType>;
}
