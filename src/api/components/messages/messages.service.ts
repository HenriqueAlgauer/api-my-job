import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepo.create(dto);
    return this.messageRepo.save(message);
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepo.find({
      where: { active: true, deleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.messageRepo.findOne({
      where: { id, active: true, deleted: false },
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(id: string, dto: UpdateMessageDto): Promise<Message> {
    const message = await this.findOne(id);
    Object.assign(message, dto);
    return this.messageRepo.save(message);
  }

  async markAsRead(id: string): Promise<Message> {
    const message = await this.findOne(id);
    message.read = true;
    return this.messageRepo.save(message);
  }

  async remove(id: string): Promise<void> {
    const message = await this.findOne(id);
    message.deleted = true;
    message.deletedAt = new Date();
    await this.messageRepo.save(message);
  }
}
