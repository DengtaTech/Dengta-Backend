import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { Bowl } from './bowl.js';
import { User } from './user.js';

@Entity({ name: 'MBowlPush' })
export class MBowlPush extends BaseEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @PrimaryColumn('uuid')
  bowlId!: string;

  @Column({
    type: 'enum',
    enum: ['normal', 'deleted'],
    default: 'normal',
  })
  status!: string;

  @ManyToOne(() => Bowl, (bowl) => bowl.pushCounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bowlId' })
  bowl?: Relation<Bowl>;

  @ManyToOne(() => User, (user) => user.mBowlPushs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;
}
