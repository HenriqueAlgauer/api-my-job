import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Nome original do arquivo',
    example: 'projeto-screenshot.png',
  })
  originalName: string;

  @ApiProperty({
    description: 'Nome do arquivo salvo no servidor',
    example: '1707825600000-a1b2c3d4e5f6.png',
  })
  filename: string;

  @ApiProperty({
    description: 'URL completa para acessar o arquivo',
    example: 'http://localhost:3000/uploads/projects/1707825600000-a1b2c3d4e5f6.png',
  })
  url: string;

  @ApiProperty({
    description: 'Tipo MIME do arquivo',
    example: 'image/png',
  })
  mimetype: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em bytes',
    example: 245678,
  })
  size: number;

  @ApiProperty({
    description: 'Categoria/pasta do upload',
    example: 'projects',
  })
  category: string;
}

/**
 * multiplos arquivos
 */
export class MultipleUploadResponseDto {
  @ApiProperty({
    description: 'Lista de arquivos enviados com sucesso',
    type: [UploadResponseDto],
  })
  files: UploadResponseDto[];

  @ApiProperty({
    description: 'Quantidade total de arquivos enviados',
    example: 3,
  })
  count: number;
}
