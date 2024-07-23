import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
} from 'typeorm';
import { User } from './user.js';
import { FootprintTagType } from './footprintTagType.js';

@Entity({ name: 'FootprintHashTags' })
export class FootprintHashTag {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  userId!: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  footprintTagTypeId!: number;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.footprintHashTags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(
    () => FootprintTagType,
    (footprintTagType) => footprintTagType.footprintHashTags,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'footprintTagTypeId' })
  footprintTagType?: Relation<FootprintTagType>;
}
