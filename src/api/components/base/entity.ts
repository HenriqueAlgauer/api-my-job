import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: true,
  })
  active: boolean;

  @Column({
    default: false,
  })
  deleted: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;
}
