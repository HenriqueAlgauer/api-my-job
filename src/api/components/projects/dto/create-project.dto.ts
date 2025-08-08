import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mainImageUrl: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  galleryImageUrls?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  githubRepoUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  liveSiteUrl?: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  technologyIds?: string[];
}
