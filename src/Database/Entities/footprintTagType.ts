import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, Relation } from 'typeorm';
import { FootprintHashTag } from './footprintHashTag.js';

@Entity({ name: 'FootprintTagType' })
export class FootprintTagType extends BaseEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id!: number;

    @Column({ type: 'varchar' })
    content!: string;

    @Column({ type: "datetime", nullable: false, default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @OneToMany(() => FootprintHashTag, footprintHashTag => footprintHashTag.footprintTagType,{ cascade: true })
    footprintHashTags?: Relation<FootprintHashTag[]>;
}
