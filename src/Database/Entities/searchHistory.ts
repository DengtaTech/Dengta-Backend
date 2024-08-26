import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  ManyToOne,
  Relation,
  Column,
} from 'typeorm';
import { User } from './user.js';

@Entity({ name: 'SearchHistory' })
export class SearchHistory extends BaseEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  content!: string;

  @CreateDateColumn({ primary: true })
  searchAt!: Date;

  @ManyToOne(() => User)
  user?: Relation<User>;
}
