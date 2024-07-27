import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  Relation,
  Index,
} from 'typeorm';
import { User } from './user.js';

@Entity({ name: 'SearchHistory' })
@Index(['userId'])
export class SearchHistory extends BaseEntity {
  @PrimaryColumn({ type: 'bigint', unsigned: true, nullable: false })
  userId!: number;

  @PrimaryColumn({ type: 'varchar', length: 255, nullable: false })
  content!: string;

  @CreateDateColumn()
  searchAt!: Date;

  @ManyToOne(() => User)
  user?: Relation<User>;
}
