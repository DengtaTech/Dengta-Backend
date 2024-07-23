import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    Relation
} from 'typeorm';
import { User } from './user.js';

@Entity({ name: 'Links' })
export class Link extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id!: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    type!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    url!: string;

    @Column({
        type: 'datetime',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @Column({ type: 'bigint', nullable: false, unsigned: true })
    userId!: number;

    @ManyToOne(() => User, (user) => user.links, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user?: Relation<User>;
}
