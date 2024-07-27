import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
  OneToOne,
} from 'typeorm';
import { FootprintHashTag } from './footprintHashTag.js';
import { FootprintTagTypeEmbedding } from './footprintTagTypeEmbedding.js';

@Entity({ name: 'FootprintTagType' })
export class FootprintTagType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'varchar' })
  content!: string;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(
    () => FootprintHashTag,
    (footprintHashTag) => footprintHashTag.footprintTagType,
    { cascade: true },
  )
  footprintHashTags?: Relation<FootprintHashTag[]>;

  @OneToOne(
    () => FootprintTagTypeEmbedding,
    (embedding) => embedding.footprintTagType,
    { cascade: true },
  )
  embedding?: Relation<FootprintTagTypeEmbedding>;
}
