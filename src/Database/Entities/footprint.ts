import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, Relation, OneToMany } from "typeorm";
import { User } from "./user.js";
import { FootprintReaction } from "./footprintReaction.js";

@Entity({ name: 'Footprints' })
export class Footprint extends BaseEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    title!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    subtitle!: string;

    @Column({ type: "text", nullable: true })
    content!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    titleImage!: string;

    @Column({ type: "int", default: 0 })
    totalLike!: number;

    @Column({ type: "varchar", length: 50, default: 'draft' })
    status!: string;

    @Column({ type: "int", default: 0 })
    milestone!: number;

    @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "bigint", nullable: false, unsigned: true })
    userId!: number;

    @ManyToOne(() => User, user => user.footprints, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user?: Relation<User>;

    @OneToMany(() => FootprintReaction, footprintReaction => footprintReaction.footprint,{ cascade: true })
    reactions?: Relation<FootprintReaction[]>;
}
