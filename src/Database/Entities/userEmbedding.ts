import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Relation,
  OneToOne,
} from 'typeorm';

import { User } from './user.js';

@Entity({ name: 'UserEmbedding' })
export class UserEmbedding extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: string;

  @Column({ type: 'json', nullable: false })
  profileEmbedding!: number[];

  @OneToOne(() => User, (user) => user.selfIntroEmbedding, {
    onDelete: 'CASCADE',
  })
  user?: Relation<User>;
}
