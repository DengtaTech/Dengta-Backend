import {
  Entity,
  PrimaryColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from './user.js';
import { Footprint } from './footprint.js';
import { ReactionType } from './reactionType.js';

@Entity({ name: 'Users_Footprints_Reactions' })
export class User_Footprint_Reaction extends BaseEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @PrimaryColumn('uuid')
  footprintId!: string;

  @PrimaryColumn('uuid')
  reactionTypeId!: string;

  @ManyToOne(() => User, (user) => user.user_footprint_reaction, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(
    () => Footprint,
    (footprint) => footprint.user_footprint_reaction,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'footprintId' })
  footprint?: Relation<Footprint>;

  @ManyToOne(
    () => ReactionType,
    (reactionType) => reactionType.user_footprint_reaction,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'reactionTypeId' })
  reactionType?: Relation<ReactionType>;
}
