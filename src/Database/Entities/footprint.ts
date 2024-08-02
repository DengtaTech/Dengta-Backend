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
import { User_Footprint_Reaction } from './users_footprints_reactions.js';
import { FootprintEmbedding } from './footprintEmbedding.js';
import { Footprint_FootprintHashTag } from './footprints_footprintHashTags.js';

@Entity({ name: 'Footprints' })
export class Footprint extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: true })
  content!: string | null;

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

  @Column({ type: 'boolean', nullable: false, default: false }) // in mysql, boolean is tinyint(1)
  milestone!: boolean;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, (user) => user.footprints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @OneToMany(
    () => User_Footprint_Reaction,
    (user_footprint_reaction) => user_footprint_reaction.footprint,
    { cascade: true },
  )
  user_footprint_reaction?: Relation<User_Footprint_Reaction[]>;

  @OneToMany(
    () => Footprint_FootprintHashTag,
    (footprint_footprintHashTag) => footprint_footprintHashTag.footprint,
    { cascade: true },
  )
  footprint_footprintHashTag?: Relation<Footprint_FootprintHashTag[]>;

  @OneToOne(() => FootprintEmbedding, (embedding) => embedding.footprint, {
    onDelete: 'CASCADE',
  })
  embedding?: Relation<FootprintEmbedding>;
}
