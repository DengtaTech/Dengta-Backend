import { Entity, PrimaryColumn, ManyToOne, JoinColumn, BaseEntity, Relation, Column } from "typeorm";
import { User } from "./user.js";

@Entity({ name: 'Followship' })
export class Followship extends BaseEntity {
    @PrimaryColumn({ type: "bigint", unsigned: true })
    followerId!: number;

    @PrimaryColumn({ type: "bigint", unsigned: true })
    followeeId!: number;

    @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @ManyToOne(() => User, user => user.followers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "followerId" })
    follower?: Relation<User>;

    @ManyToOne(() => User, user => user.followees, { onDelete: "CASCADE" })
    @JoinColumn({ name: "followeeId" })
    followee?: Relation<User>;
    
}
