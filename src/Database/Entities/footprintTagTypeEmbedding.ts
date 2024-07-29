import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Relation,
  OneToOne,
} from 'typeorm';

import { FootprintTagType } from './footprintTagType.js';

@Entity({ name: 'FootprintEmbedding' })
export class FootprintTagTypeEmbedding extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'json', nullable: false })
  contentEmbedding!: number[];

  @OneToOne(
    () => FootprintTagType,
    (footprintTagType) => footprintTagType.embedding,
    {
      onDelete: 'CASCADE',
    },
  )
  footprintTagType?: Relation<FootprintTagType>;
}
