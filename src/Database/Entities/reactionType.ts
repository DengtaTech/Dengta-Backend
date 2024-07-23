import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
} from 'typeorm';
import { FootprintReaction } from './footprintReaction.js';

@Entity({ name: 'ReactionType' })
export class ReactionType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(
    () => FootprintReaction,
    (footprintReaction) => footprintReaction.reactionType,
    { cascade: true },
  )
  reactions?: Relation<FootprintReaction[]>;
}
