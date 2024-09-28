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

const notificationTypes = [
  'system',
  'is_followed',
  'follower_footprint',
  'footprint_reaction',
] as const;
type NotificationType = (typeof notificationTypes)[number];

@Entity({ name: 'Notification' })
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @Column({ type: 'varchar', length: 50, nullable: false })
  userId!: string;

  @Column({
    type: 'enum',
    enum: notificationTypes,
    nullable: false,
  })
  type!: NotificationType;

  @Column({ type: 'text', nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ type: 'boolean', default: false })
  isRead!: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'relatedUserId' })
  relatedUser?: Relation<User>;

  @Column({ nullable: true })
  relatedUserId?: string;

  @ManyToOne(() => Footprint)
  @JoinColumn({ name: 'relatedFootprintId' })
  relatedFootprint?: Relation<Footprint>;

  @Column({ nullable: true })
  relatedFootprintId?: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
