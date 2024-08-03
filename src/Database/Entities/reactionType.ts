import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
} from 'typeorm';
import { MUserFootprintReaction } from './mUserFootprintReaction.js';

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
    () => MUserFootprintReaction,
    (mUserFootprintReaction) => mUserFootprintReaction.reactionType,
    { cascade: true },
  )
  mUserFootprintReaction?: Relation<MUserFootprintReaction[]>;
}
