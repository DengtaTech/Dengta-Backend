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

  @Column({ type: 'json', nullable: true })
  selfIntroEmbedding?: number[];

  @Column({ type: 'json', nullable: false })
  lifeRoleEmbedding!: number[];

  @Column('uuid')
  userId!: string;

  @OneToOne(() => User, (user) => user.embedding, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;
}
