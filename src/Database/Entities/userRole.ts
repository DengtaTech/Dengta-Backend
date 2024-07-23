import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
} from 'typeorm';
import { User } from './user.js';
import { Role } from './role.js';

@Entity({ name: 'UserRoles' })
export class UserRole {
  @PrimaryColumn({ type: 'bigint', unsigned: true })
  userId!: number;

  @PrimaryColumn({ type: 'bigint', unsigned: true })
  roleId!: number;

  @Column({
    type: 'datetime',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role?: Relation<Role>;
}
