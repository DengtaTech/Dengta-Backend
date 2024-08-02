import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
} from 'typeorm';
import { FootprintHashTag } from './footprintHashTag.js';
import { Footprint } from './footprint.js';

@Entity({ name: 'Footprints_FootprintHashTags' })
export class Footprint_FootprintHashTag {
  @PrimaryColumn('uuid')
  footprintId!: string;

  @PrimaryColumn('uuid')
  footprintHashTagId!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(
    () => Footprint,
    (footprint) => footprint.footprint_footprintHashTag,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'footprintId' })
  footprint?: Relation<Footprint>;

  @ManyToOne(
    () => FootprintHashTag,
    (footprintHashTag) => footprintHashTag.footprint_footprintHashTag,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'footprintHashTagId' })
  footprintHashTag?: Relation<FootprintHashTag>;
}
