import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from './user.js';

@Entity({ name: 'Cards' })
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  cardUrl!: string;

  @Column({ type: 'int', default: 0 })
  clickTime!: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column('uuid')
  userId!: string;

  @Column('uuid', { nullable: true })
  footprintId!: string | null;

  @Column({ type: 'boolean', default: true }) // in mysql, boolean is tinyint(1)
  latest!: boolean;

  @OneToOne(() => User, (user) => user.card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;
}
