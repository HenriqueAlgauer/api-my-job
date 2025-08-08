import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
  ) {}

  async create(dto: CreateFileDto): Promise<FileEntity> {
    const file = this.fileRepo.create(dto);
    return this.fileRepo.save(file);
  }

  async findAll(): Promise<FileEntity[]> {
    return this.fileRepo.find({
      where: { active: true, deleted: false },
    });
  }

  async findOne(id: string): Promise<FileEntity> {
    const file = await this.fileRepo.findOne({
      where: { id, active: true, deleted: false },
    });
    if (!file) throw new NotFoundException('File not found');
    return file;
  }

  async update(id: string, dto: UpdateFileDto): Promise<FileEntity> {
    const file = await this.findOne(id);
    Object.assign(file, dto);
    return this.fileRepo.save(file);
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    file.deleted = true;
    file.deletedAt = new Date();
    await this.fileRepo.save(file);
  }
}
