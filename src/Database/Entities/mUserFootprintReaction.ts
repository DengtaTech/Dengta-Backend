import {
  Entity,
  PrimaryColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
} from 'typeorm';
import { User } from './user.js';
import { Footprint } from './footprint.js';
import { ReactionType } from './reactionType.js';

@Entity({ name: 'MUserFootprintReaction' })
export class MUserFootprintReaction extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  userId!: string;

  @PrimaryColumn('uuid')
  footprintId!: string;

  @Column('uuid', { nullable: false })
  reactionTypeId!: string;

  @ManyToOne(() => User, (user) => user.mUserFootprintReaction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(() => Footprint, (footprint) => footprint.mUserFootprintReaction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'footprintId' })
  footprint?: Relation<Footprint>;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.mUserFootprintReaction,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'reactionTypeId' })
  reactionType?: Relation<ReactionType>;
}
