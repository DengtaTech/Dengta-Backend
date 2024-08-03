import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Relation,
} from 'typeorm';
import { MUserRole } from './mUserRole.js';

@Entity({ name: 'Roles' })
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @OneToMany(() => MUserRole, (mUserRole) => mUserRole.role, { cascade: true })
  mUserRole?: Relation<MUserRole[]>;
}
