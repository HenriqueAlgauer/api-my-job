import { Base } from '../../base/entity';
import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity({ name: 'posts' })
export class Post extends Base{

  @Column({ unique: true })
  slug: string; // URL amigável (ex: "como-usar-nestjs")

  @Column()
  title: string;

  @Column({ type: 'text', comment: 'Conteúdo principal do post, pode ser em Markdown' })
  content: string;

  @Column({ comment: 'URL da imagem de capa' })
  coverImageUrl: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.DRAFT })
  status: PostStatus;
  
  // Relação Muitos-para-Um com Usuário (Autor)
  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  // Relação Muitos-para-Muitos com Tags
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
  })
  @JoinTable({
    name: 'post_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

}