import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
} from 'typeorm';
import { User_Footprint_Reaction } from './users_footprints_reactions.js';

@Entity({ name: 'ReactionType' })
export class ReactionType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  name!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(
    () => User_Footprint_Reaction,
    (user_footprint_reaction) => user_footprint_reaction.reactionType,
    { cascade: true },
  )
  user_footprint_reaction?: Relation<User_Footprint_Reaction[]>;
}
