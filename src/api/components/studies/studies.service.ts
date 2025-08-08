import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateStudyDto } from './dto/create-study.dto';
import { UpdateStudyDto } from './dto/update-study.dto';
import { Study } from './entities/study.entity';
import { Technology } from '../technologies/entities/technology.entity';

@Injectable()
export class StudiesService {
  constructor(
    @InjectRepository(Study)
    private readonly studyRepo: Repository<Study>,
    @InjectRepository(Technology)
    private readonly technologyRepo: Repository<Technology>,
  ) {}

  async create(dto: CreateStudyDto): Promise<Study> {
    const { technologyIds, ...data } = dto;
    const study = this.studyRepo.create(data);

    if (technologyIds?.length) {
      study.technologies = await this.technologyRepo.findBy({
        id: In(technologyIds),
      });
    }

    return this.studyRepo.save(study);
  }

  async findAll(): Promise<Study[]> {
    return this.studyRepo.find({
      relations: ['technologies'],
      where: { active: true, deleted: false },
    });
  }

  async findOne(id: string): Promise<Study> {
    const study = await this.studyRepo.findOne({
      where: { id, active: true, deleted: false },
      relations: ['technologies'],
    });
    if (!study) throw new NotFoundException('Study not found');
    return study;
  }

  async update(id: string, dto: UpdateStudyDto): Promise<Study> {
    const { technologyIds, ...data } = dto;
    const study = await this.findOne(id);

    Object.assign(study, data);

    if (technologyIds) {
      study.technologies = await this.technologyRepo.findBy({
        id: In(technologyIds),
      });
    }

    return this.studyRepo.save(study);
  }

  async remove(id: string): Promise<void> {
    const study = await this.findOne(id);
    study.deleted = true;
    study.deletedAt = new Date();
    await this.studyRepo.save(study);
  }
}
