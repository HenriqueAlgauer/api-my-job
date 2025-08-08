import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { Technology } from './entities/technology.entity';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(Technology)
    private readonly technologyRepo: Repository<Technology>,
  ) {}

  async create(dto: CreateTechnologyDto): Promise<Technology> {
    const technology = this.technologyRepo.create(dto);
    return this.technologyRepo.save(technology);
  }

  async findAll(): Promise<Technology[]> {
    return this.technologyRepo.find();
  }

  async findOne(id: string): Promise<Technology> {
    const technology = await this.technologyRepo.findOne({ where: { id } });
    if (!technology) throw new NotFoundException('Technology not found');
    return technology;
  }

  async update(id: string, dto: UpdateTechnologyDto): Promise<Technology> {
    const technology = await this.findOne(id);
    Object.assign(technology, dto);
    return this.technologyRepo.save(technology);
  }

  async remove(id: string): Promise<void> {
    const technology = await this.findOne(id);
    await this.technologyRepo.remove(technology);
  }
}
