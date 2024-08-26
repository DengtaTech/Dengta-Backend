import {
  Entity,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  Relation,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.js';
import { Footprint } from './footprint.js';

@Entity({ name: 'Notification' })
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @Column({ nullable: false })
  userId!: string;

  @Column({
    type: 'enum',
    enum: ['system', 'is_followed', 'follower_footprint', 'footprint_reaction'],
    nullable: false,
  })
  type!: string;

  @Column({ type: 'text', nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'relatedUserId' })
  relatedUser?: Relation<User>;

  @ManyToOne(() => Footprint)
  @JoinColumn({ name: 'relatedFootprintId' })
  relatedFootprint?: Relation<Footprint>;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
