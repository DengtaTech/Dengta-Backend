import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { MUserQuestionItem } from './mUserQuestionItem.js';

@Entity({ name: 'QuestionItem' })
export class QuestionItem extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  content!: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @OneToMany(
    () => MUserQuestionItem,
    (mUserQuestionItem) => mUserQuestionItem.questionItem,
  )
  userResponses?: MUserQuestionItem[];
}
