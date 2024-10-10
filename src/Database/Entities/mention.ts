import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'Mention' })
export class Mention extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id!: string;

  @PrimaryColumn({ type: 'varchar', length: 50 })
  startTimestamp!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  keyword!: string;

  @Column({ type: 'int', default: 0 })
  footprints!: number;

  @Column({ type: 'int', default: 0 })
  search!: number;
}
