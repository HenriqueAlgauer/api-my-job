import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Technology } from '../../technologies/entities/technology.entity';

export enum ProjectStatus {
  PLANNING = 'planning',
  DEVELOPMENT = 'development',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  shortDescription: string;

  @Column({ type: 'text' })
  fullDescription: string;

  @Column({ comment: 'URL da imagem principal de destaque' })
  mainImageUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  galleryImageUrls: string[];

  @Column({ nullable: true })
  githubRepoUrl: string;

  @Column({ nullable: true })
  liveSiteUrl: string;
  
  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.DEVELOPMENT })
  status: ProjectStatus;

  // Relação Muitos-para-Muitos com Tecnologias
  @ManyToMany(() => Technology, (technology) => technology.projects, {
    cascade: true, // Permite criar/associar tecnologias ao salvar um projeto
  })
  @JoinTable({
    name: 'project_technologies',
    joinColumn: { name: 'project_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'technology_id', referencedColumnName: 'id' },
  })
  technologies: Technology[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}