import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, Relation } from 'typeorm';
import { UserRole } from './userRole.js';

@Entity({ name: 'Roles' })
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id!: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    type!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description!: string;

    @OneToMany(() => UserRole, userRole => userRole.user,{ cascade: true })
    userRoles?: Relation<UserRole[]>;
}
