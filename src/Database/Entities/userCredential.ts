import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, Relation } from "typeorm";
import { User } from "./user.js";

@Entity({ name: 'UserCredentials' })
export class UserCredential extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, unique: true })
    email!: string;

    @Column({ type: "varchar", length: 255 })
    password!: string;

    @OneToOne(() => User, user => user.userCredential)
    @JoinColumn({ name: 'userId' })
    user?: Relation<User>;
}
