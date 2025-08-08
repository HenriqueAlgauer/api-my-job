import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Technology } from '../technologies/entities/technology.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Technology)
    private readonly technologyRepo: Repository<Technology>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const { technologyIds, ...data } = dto;
    const project = this.projectRepo.create(data);

    if (technologyIds?.length) {
      project.technologies = await this.technologyRepo.findBy({
        id: In(technologyIds),
      });
    }

    return this.projectRepo.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepo.find({ relations: ['technologies'] });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['technologies'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const { technologyIds, ...data } = dto;
    const project = await this.findOne(id);

    Object.assign(project, data);

    if (technologyIds) {
      project.technologies = await this.technologyRepo.findBy({
        id: In(technologyIds),
      });
    }

    return this.projectRepo.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepo.remove(project);
  }
}
