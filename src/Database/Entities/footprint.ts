import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.js';
import { MUserFootprintReaction } from './mUserFootprintReaction.js';
import { FootprintEmbedding } from './footprintEmbedding.js';
import { MFootprintFootprintHashTag } from './mFootprintFootprintHashTag.js';

@Entity({ name: 'Footprints' })
export class Footprint extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title!: string | null;

  @Column({ type: 'text', nullable: true })
  content!: string | null;

  @Column({
    type: 'enum',
    enum: ['life', 'career', 'other'],
    nullable: true,
  })
  category!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  titleImage!: string | null;

  @Column({ type: 'int', default: 0 })
  totalLike!: number;

  @Column({
    type: 'enum',
    enum: ['draft', 'published', 'invisible'],
    nullable: false,
  })
  status!: string;

  @Column({ type: 'boolean', default: false })
  isQuickPost!: boolean;

  @Column({ type: 'boolean', default: false }) // in mysql, boolean is tinyint(1)
  milestone!: boolean;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  occurAt!: Date;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, (user) => user.footprints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @OneToMany(
    () => MUserFootprintReaction,
    (mUserFootprintReaction) => mUserFootprintReaction.footprint,
    { cascade: true },
  )
  mUserFootprintReaction?: Relation<MUserFootprintReaction[]>;

  @OneToMany(
    () => MFootprintFootprintHashTag,
    (mFootprintFootprintHashTag) => mFootprintFootprintHashTag.footprint,
    { cascade: true },
  )
  mFootprintFootprintHashTag?: Relation<MFootprintFootprintHashTag[]>;

  @OneToOne(() => FootprintEmbedding, (embedding) => embedding.footprint, {
    onDelete: 'CASCADE',
  })
  embedding?: Relation<FootprintEmbedding>;
}
