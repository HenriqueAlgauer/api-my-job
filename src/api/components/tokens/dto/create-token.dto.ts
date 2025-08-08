import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  expiresAt: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
