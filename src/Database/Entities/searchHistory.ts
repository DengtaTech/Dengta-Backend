import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  Relation,
  Unique,
  Column,
} from 'typeorm';
import { User } from './user.js';

@Entity({ name: 'SearchHistory' })
@Unique(['userId', 'searchAt'])
export class SearchHistory extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  userId!: string;

  @PrimaryColumn({ type: 'varchar', length: 255 })
  content!: string;

  @Column()
  searchAt!: Date;

  @ManyToOne(() => User)
  user?: Relation<User>;
}
