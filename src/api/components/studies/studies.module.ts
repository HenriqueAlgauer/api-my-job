import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudiesService } from './studies.service';
import { StudiesController } from './studies.controller';
import { Study } from './entities/study.entity';
import { Technology } from '../technologies/entities/technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Study, Technology])],
  controllers: [StudiesController],
  providers: [StudiesService],
})
export class StudiesModule {}
