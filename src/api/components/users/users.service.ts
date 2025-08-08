import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { calcHashedPassword } from '../../../utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('Email already in use');

    const { password, salt } = calcHashedPassword(dto.password);
    const user = this.userRepo.create({
      ...dto,
      password,
      salt,
    });

    const saved = await this.userRepo.save(user);
    delete (saved as any).password;
    delete (saved as any).salt;
    return saved;
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      where: { active: true, deleted: false },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id, active: true, deleted: false },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email, active: true, deleted: false },
      select: ['id', 'name', 'email', 'password', 'salt', 'role'],
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.password) {
      const { password, salt } = calcHashedPassword(dto.password);
      dto.password = password;
      (dto as any).salt = salt;
    }

    Object.assign(user, dto);
    const saved = await this.userRepo.save(user);
    delete (saved as any).password;
    delete (saved as any).salt;
    return saved;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.deleted = true;
    user.deletedAt = new Date();
    await this.userRepo.save(user);
  }
}
