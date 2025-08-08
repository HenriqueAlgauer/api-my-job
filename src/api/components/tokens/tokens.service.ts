import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepo: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: string, tokenValue: string, expiresAt: Date): Promise<Token> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const token = this.tokenRepo.create({
      token: tokenValue,
      expiresAt,
      user,
    });

    return this.tokenRepo.save(token);
  }

  async findByToken(tokenValue: string): Promise<Token | null> {
    return this.tokenRepo.findOne({
      where: { token: tokenValue },
      relations: ['user'],
    });
  }

  async removeByUser(userId: string): Promise<void> {
    await this.tokenRepo
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId })
      .execute();
  }

  async removeExpired(): Promise<void> {
    await this.tokenRepo
      .createQueryBuilder()
      .delete()
      .where('expires_at < :now', { now: new Date() })
      .execute();
  }
}
