import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
  OneToOne,
} from 'typeorm';
import { Footprint_FootprintHashTag } from './footprints_footprintHashTags.js';
import { FootprintHashTagEmbedding } from './footprintHashTagEmbedding.js';

@Entity({ name: 'FootprintHashTags' })
export class FootprintHashTag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  content!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(
    () => Footprint_FootprintHashTag,
    (footprint_footprintHashTag) => footprint_footprintHashTag.footprintHashTag,
    { cascade: true },
  )
  footprint_footprintHashTag?: Relation<Footprint_FootprintHashTag[]>;

  @OneToOne(
    () => FootprintHashTagEmbedding,
    (embedding) => embedding.footprintHashTag,
    { cascade: true },
  )
  embedding?: Relation<FootprintHashTagEmbedding>;
}
