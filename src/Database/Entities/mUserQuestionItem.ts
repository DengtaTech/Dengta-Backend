import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  Column,
  BaseEntity,
} from 'typeorm';
import { User } from './user.js';
import { QuestionItem } from './questionItems.js';

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
}
