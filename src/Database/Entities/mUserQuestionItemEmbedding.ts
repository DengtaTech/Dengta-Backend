import {
  Entity,
  PrimaryColumn,
  JoinColumn,
  Relation,
  Column,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { MUserQuestionItem } from './mUserQuestionItem.js';

@Entity({ name: 'MUserQuestionItemEmbedding' })
export class MUserQuestionItemEmbedding extends BaseEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @PrimaryColumn()
  questionItemId!: number;

  @Column({ type: 'json', nullable: false })
  responseEmbedding!: number[];

  @OneToOne(
    () => MUserQuestionItem,
    (mUserQuestionItem) => mUserQuestionItem.embedding,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'userId', referencedColumnName: 'userId' },
    { name: 'questionItemId', referencedColumnName: 'questionItemId' },
  ])
  mUserQuestionItem?: Relation<MUserQuestionItem>;
}
