import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;
}
