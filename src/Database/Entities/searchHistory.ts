import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  Relation,
  Index,
  Column,
} from 'typeorm';
import { User } from './user.js';

@Entity({ name: 'SearchHistory' })
export class SearchHistory extends BaseEntity {
  @PrimaryColumn({ type: 'bigint', unsigned: true, nullable: false })
  userId!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  content!: string;

  @CreateDateColumn({ primary: true })
  searchAt!: Date;

  @ManyToOne(() => User)
  user?: Relation<User>;
}
