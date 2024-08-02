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

@Entity({ name: 'Users_Roles' })
export class User_Role {
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

  @ManyToOne(() => User, (user) => user.user_role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(() => Role, (role) => role.user_role)
  @JoinColumn({ name: 'roleId' })
  role?: Relation<Role>;
}
