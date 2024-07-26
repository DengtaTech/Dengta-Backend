import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
  OneToOne,
} from 'typeorm';

import { User } from './user.js';

@Entity({ name: 'UserEmbedding' })
export class UserEmbedding extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ type: 'json', nullable: false })
  profileEmbedding!: number[];

  @OneToOne(() => User, (user) => user.selfIntroEmbedding, {
    onDelete: 'CASCADE',
  })
  user?: Relation<User>;
}
