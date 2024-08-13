import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Relation,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { FootprintHashTag } from './footprintHashTag.js';
@Entity({ name: 'FootprintHashTagEmbedding' })
export class FootprintHashTagEmbedding extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'json', nullable: false })
  contentEmbedding!: number[];

  @Column('uuid')
  footprintHashTagId!: string;
  
  @OneToOne(
    () => FootprintHashTag,
    (footprintHashTag) => footprintHashTag.embedding,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'footprintHashTagId' })
  footprintHashTag?: Relation<FootprintHashTag>;
}
