import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, Relation } from "typeorm";
import { User } from "./user.js";

@Entity({ name: 'UserCredentials' })
export class UserCredential extends BaseEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id!: number;

    @Column({ type: "varchar", length: 255, unique: true , nullable: false})
    email!: string;

    @Column({ type: "varchar", length: 255 , nullable: false})
    password!: string;

    @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "bigint", nullable: false, unsigned: true })
    userId!: number;

    @OneToOne(() => User, user => user.userCredential,{ onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user?: Relation<User>;


}
