import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TechnologyType } from '../entities/technology.entity';

export class CreateTechnologyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ enum: TechnologyType })
  @IsEnum(TechnologyType)
  @IsOptional()
  type?: TechnologyType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  logoUrl: string;
}
