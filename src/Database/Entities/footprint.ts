import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, Relation } from "typeorm";
import { User } from "./user.js";

@Entity({ name: 'Footprints' })
export class Footprint extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    title!: string;

    // @Column({ type: "varchar", length: 255, nullable: true })
    // subtitle!: string;

    // @Column({ type: "text", nullable: true })
    // content!: string;

    // @Column({ type: "varchar", length: 255, nullable: true })
    // titleImage!: string;

    // @Column({ type: "int", default: 0 })
    // totalLike!: number;

    // @Column({ type: "varchar", length: 50, default: 'draft' })
    // status!: string;

    // @Column({ type: "int", default: 0 })
    // milestone!: number;

    @ManyToOne(() => User, user => user.footprints)
    @JoinColumn({ name: 'userId' })
    user?: Relation<User>;
}
