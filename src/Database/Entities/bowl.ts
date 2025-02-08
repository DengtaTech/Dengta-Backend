import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  Relation,
  OneToMany,
} from 'typeorm';
import { User } from './user.js';
import { MBowlLike } from './mbowlLikes.js';

@Entity({ name: 'Bowls' })
export class Bowl extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  content!: string;

  // 不管誰推的
  @Column({ type: 'int', default: 0 })
  totalPushCount!: number;

  @Column({
    type: 'enum',
    enum: ['waiting', 'accepted'],
    nullable: false,
  })
  status!: string;

  // 被敲者（即接受敲碗的用戶）
  @Column('uuid')
  userId!: string;

  // 敲碗者（即發起敲碗行為的用戶）
  @Column('uuid')
  commenterId!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  // 關聯被敲者
  @ManyToOne(() => User, (user) => user.bowls, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  author?: Relation<User>;

  // 關聯敲碗者
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commenterId' })
  commenter?: Relation<User>;

  @OneToMany(() => MBowlLike, (bowlLike) => bowlLike.bowl)
  pushCounts?: Relation<MBowlLike[]>;
}
