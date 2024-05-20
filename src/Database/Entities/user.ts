import { Entity, PrimaryGeneratedColumn, Column, BaseEntity , OneToMany, Relation, OneToOne } from "typeorm";
import { Footprint } from "./footprint.js";
import { UserCredential } from "./userCredential.js";

@Entity({ name: 'Users' })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    accountName!: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    realName!: string;

    // @Column({ type: "date", nullable: false })
    // birthday!: Date;

    @Column({ type: "varchar", default: 'native' })
    provider!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    avatar!: string;

    // @Column({ type: "varchar", length: 255, nullable: true })
    // backgroundImage!: string;

    // @Column({ type: "int", nullable: true })
    // gender!: number;

    // @Column({ type: "varchar", length: 50, nullable: true })
    // phone!: string;

    // @Column({ type: "varchar", length: 255, nullable: true })
    // lifeRole!: string;

    // @Column({ type: "varchar", length: 255, nullable: true })
    // selfIntro!: string;

    // @Column({ type: "varchar", length: 255, nullable: true })
    // fbLink!: string;

    // @Column({ type: "varchar", length: 255, nullable: true })
    // igLink!: string;

    // @Column({ type: "varchar", length: 255, nullable: true })
    // linkedInLink!: string;

    // @Column({ type: "int", nullable: true })
    // isActive!: number;
    @OneToMany(() => Footprint, footprint => footprint.user,{ cascade: true })
    footprints?: Relation<Footprint[]>;

    @OneToOne(() => UserCredential, userCredential => userCredential.user,{ cascade: true })
    userCredential?: Relation<UserCredential>;
}
