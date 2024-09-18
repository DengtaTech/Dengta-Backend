import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Relation,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.js';

@Entity({ name: 'UserEmbedding' })
export class UserEmbedding extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'json', nullable: false })
  selfIntroEmbedding!: number[];

  @Column({ type: 'varchar', length: 50 })
  userId!: string;

  @OneToOne(() => User, (user) => user.selfIntroEmbedding, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;
}
