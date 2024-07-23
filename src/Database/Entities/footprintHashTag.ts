import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
} from 'typeorm';
import { FootprintTagType } from './footprintTagType.js';
import { Footprint } from './footprint.js';

@Entity({ name: 'FootprintHashTags' })
export class FootprintHashTag {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  footprintId!: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  footprintTagTypeId!: number;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => Footprint, (footprint) => footprint.footprintHashTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'footprintId' })
  footprint?: Relation<Footprint>;

  @ManyToOne(
    () => FootprintTagType,
    (footprintTagType) => footprintTagType.footprintHashTags,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'footprintTagTypeId' })
  footprintTagType?: Relation<FootprintTagType>;
}
