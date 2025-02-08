import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { Bowl } from './bowl.js';
import { User } from './user.js';

@Entity({ name: 'MBowlLikes' })
export class MBowlLike extends BaseEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @PrimaryColumn('uuid')
  bowlId!: string;

  @ManyToOne(() => Bowl, (bowl) => bowl.pushCounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bowlId' })
  bowl?: Relation<Bowl>;

  @ManyToOne(() => User, (user) => user.mBowlLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;
}
