import { Entity, PrimaryColumn, BaseEntity, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { User } from './user.js';
import { Footprint } from './footprint.js';
import { ReactionType } from './reactionType.js';

@Entity({ name: 'FootprintReactions' })
export class FootprintReaction extends BaseEntity {
    @PrimaryColumn({ type: "bigint", unsigned: true })
    userId!: number;

    @PrimaryColumn({ type: "bigint", unsigned: true })
    footprintId!: number;

    @PrimaryColumn({ type: "bigint", unsigned: true })
    reactionTypeId!: number;

    @ManyToOne(() => User, user => user.footprintReactions, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'userId' })
    user?: Relation<User>;

    @ManyToOne(() => Footprint, footprint => footprint.reactions, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'footprintId' })
    footprint?: Relation<Footprint>;

    @ManyToOne(() => ReactionType, reactionType => reactionType.reactions, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'reactionTypeId' })
    reactionType?: Relation<ReactionType>;
}
