import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Relation,
  OneToOne,
} from 'typeorm';

import { Footprint } from './footprint.js';

@Entity({ name: 'FootprintEmbedding' })
export class FootprintEmbedding extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'json', nullable: false })
  titleEmbedding!: number[];

  @Column({ type: 'json', nullable: false })
  contentEmbedding!: number[];

  @OneToOne(() => Footprint, (footprint) => footprint.embedding, {
    onDelete: 'CASCADE',
  })
  footprint?: Relation<Footprint>;
}
