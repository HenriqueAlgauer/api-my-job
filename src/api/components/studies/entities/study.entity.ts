import { Base } from '../../base/entity';
import { Technology } from '../../technologies/entities/technology.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

export enum StudyType {
  GRADUATION = 'graduation',
  COURSE = 'course',
  CERTIFICATION = 'certification',
  BOOTCAMP = 'bootcamp',
  OTHER = 'other',
}

@Entity({ name: 'studies' })
export class Study extends Base {
  @Column()
  title: string;

  @Column()
  institution: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'start_date' })
  startDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  certificateUrl: string;

  @Column({ type: 'enum', enum: StudyType, default: StudyType.COURSE })
  type: StudyType;

  @ManyToMany(() => Technology, (technology) => technology.studies, {
    cascade: true,
  })
  @JoinTable({
    name: 'study_technologies',
    joinColumn: { name: 'study_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'technology_id', referencedColumnName: 'id' },
  })
  technologies: Technology[];
}
