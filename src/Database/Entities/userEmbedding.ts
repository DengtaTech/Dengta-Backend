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
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'json', nullable: false })
  selfIntroEmbedding!: number[];

  @OneToOne(() => User, (user) => user.selfIntroEmbedding, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;
}
