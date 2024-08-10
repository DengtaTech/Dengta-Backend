import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
} from 'typeorm';
import { MUserFootprintReaction } from './mUserFootprintReaction.js';
import { nativeReactions, type NativeReaction } from '../../Application/Features/Footprint/Reaction/Types/reactions.js';

@Entity({ name: 'ReactionType' })
export class ReactionType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: nativeReactions, nullable: false })
  name!: NativeReaction;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(
    () => MUserFootprintReaction,
    (mUserFootprintReaction) => mUserFootprintReaction.reactionType,
    { cascade: true },
  )
  mUserFootprintReaction?: Relation<MUserFootprintReaction[]>;
}
