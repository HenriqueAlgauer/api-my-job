import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const { authorId, tagIds, ...data } = dto;

    const author = await this.userRepo.findOne({ where: { id: authorId } });
    if (!author) throw new NotFoundException('Author not found');

    const post = this.postRepo.create({ ...data, author });

    if (tagIds?.length) {
      post.tags = await this.tagRepo.findBy({ id: In(tagIds) });
    }

    return this.postRepo.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepo.find({
      relations: ['author', 'tags'],
      where: { active: true, deleted: false },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id, active: true, deleted: false },
      relations: ['author', 'tags'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const { authorId, tagIds, ...data } = dto;
    const post = await this.findOne(id);

    Object.assign(post, data);

    if (authorId) {
      const author = await this.userRepo.findOne({ where: { id: authorId } });
      if (!author) throw new NotFoundException('Author not found');
      post.author = author;
    }

    if (tagIds) {
      post.tags = await this.tagRepo.findBy({ id: In(tagIds) });
    }

    return this.postRepo.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    post.deleted = true;
    post.deletedAt = new Date();
    await this.postRepo.save(post);
  }
}
