import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Relation,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Footprint } from './footprint.js';

@Entity({ name: 'FootprintEmbedding' })
export class FootprintEmbedding extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'json', nullable: false })
  titleEmbedding!: number[];

  @Column({ type: 'json', nullable: false })
  contentEmbedding!: number[];

  @OneToOne(() => Footprint, (footprint) => footprint.embedding, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'footprintId' })
  footprint?: Relation<Footprint>;
}
