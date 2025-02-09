import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Relation,
  Column,
  BaseEntity,
} from 'typeorm';
import { User } from './user.js';
import { QuestionItem } from './questionItems.js';
import { MUserQuestionItemEmbedding } from './mUserQuestionItemEmbedding.js';

@Entity({ name: 'MUserQuestionItem' })
export class MUserQuestionItem extends BaseEntity {
  @PrimaryColumn('uuid')
  userId!: string;

  @PrimaryColumn()
  questionItemId!: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  response!: string | null;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.questionResponses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: Relation<User>;

  @ManyToOne(() => QuestionItem, (questionitem) => questionitem.userResponses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'questionItemId' })
  questionItem?: Relation<QuestionItem>;

  @OneToOne(
    () => MUserQuestionItemEmbedding,
    (embedding) => embedding.mUserQuestionItem,
    {
      onDelete: 'CASCADE',
    },
  )
  embedding?: Relation<MUserQuestionItemEmbedding>;
}
