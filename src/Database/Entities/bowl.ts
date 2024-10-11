import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from './user.js';

@Entity({ name: 'Bowls' })
export class Bowl extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  content!: string;

  @Column({ type: 'int', default: 0 })
  pushCount!: number;

  @Column({
    type: 'enum',
    enum: ['waiting', 'accepted'],
    nullable: false,
  })
  status!: string;

  @Column('uuid')
  userId!: string;

  @Column('uuid')
  commenterId!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.bowls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;
}
