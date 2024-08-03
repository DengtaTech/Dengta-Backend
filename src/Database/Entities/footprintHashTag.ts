import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
  OneToOne,
} from 'typeorm';
import { MFootprintFootprintHashTag } from './mFootprintFootprintHashTag.js';
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
    () => MFootprintFootprintHashTag,
    (mFootprintFootprintHashTag) => mFootprintFootprintHashTag.footprintHashTag,
    { cascade: true },
  )
  mFootprintFootprintHashTag?: Relation<MFootprintFootprintHashTag[]>;

  @OneToOne(
    () => FootprintHashTagEmbedding,
    (embedding) => embedding.footprintHashTag,
    { cascade: true },
  )
  embedding?: Relation<FootprintHashTagEmbedding>;
}
