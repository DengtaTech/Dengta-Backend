import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
  BaseEntity,
} from 'typeorm';
import { User } from './user.js';
import { Role } from './role.js';

@Entity({ name: 'MUserRole' })
export class MUserRole extends BaseEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @PrimaryColumn('uuid')
  roleId!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.mUserRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(() => Role, (role) => role.mUserRole)
  @JoinColumn({ name: 'roleId' })
  role?: Relation<Role>;
}
