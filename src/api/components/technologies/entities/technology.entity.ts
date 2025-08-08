import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Study } from '../../studies/entities/study.entity';

export enum TechnologyType {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  DEVOPS = 'devops',
  MOBILE = 'mobile',
  OTHER = 'other',
}

@Entity({ name: 'technologies' })
export class Technology {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: TechnologyType, default: TechnologyType.OTHER })
  type: TechnologyType;

  @Column({ comment: 'URL para o logo da tecnologia' })
  logoUrl: string;

  @ManyToMany(() => Project, (project) => project.technologies)
  projects: Project[];

  @ManyToMany(() => Study, (study) => study.technologies)
  studies: Study[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
