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

@Entity({ name: 'MFootprintFootprintHashTag' })
export class MFootprintFootprintHashTag {
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
    (footprint) => footprint.mFootprintFootprintHashTag,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'footprintId' })
  footprint?: Relation<Footprint>;

  @ManyToOne(
    () => FootprintHashTag,
    (footprintHashTag) => footprintHashTag.mFootprintFootprintHashTag,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'footprintHashTagId' })
  footprintHashTag?: Relation<FootprintHashTag>;
}
