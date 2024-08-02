import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
} from 'typeorm';
import { User_Role } from './userRole.js';

@Entity({ name: 'Roles' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @OneToMany(() => User_Role, (user_role) => user_role.user, { cascade: true })
  user_role?: Relation<User_Role[]>;
}
