import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { multerConfig } from './upload.config';
import { UploadService } from './upload.service';
import {
  UploadResponseDto,
  MultipleUploadResponseDto,
} from './dto/upload-response.dto';

/**
 * Controller responsável pelos endpoints de upload de arquivos
 *
 * Endpoints disponíveis:
 * - POST /upload/:category - Upload de arquivo único
 * - POST /upload/:category/multiple - Upload de múltiplos arquivos
 * - DELETE /upload/:category/:filename - Deletar um arquivo
 */
@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':category')
  @ApiOperation({
    summary: 'Upload de arquivo único',
    description:
      'Faz upload de um único arquivo de imagem. Categorias comuns: projects, blog, profile',
  })
  @ApiParam({
    name: 'category',
    description: 'Categoria/pasta onde o arquivo será salvo',
    example: 'projects',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de imagem (JPEG, PNG, WebP, GIF)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivo enviado com sucesso',
    type: UploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Arquivo inválido (tipo não permitido ou muito grande)',
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('category') category: string,
  ): UploadResponseDto {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    return this.uploadService.processFile(file, category);
  }

  @Post(':category/multiple')
  @ApiOperation({
    summary: 'Upload de múltiplos arquivos',
    description: 'Faz upload de até 10 arquivos de imagem de uma vez',
  })
  @ApiParam({
    name: 'category',
    description: 'Categoria/pasta onde os arquivos serão salvos',
    example: 'projects',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Múltiplos arquivos de imagem',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivos enviados com sucesso',
    type: MultipleUploadResponseDto,
  })
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('category') category: string,
  ): MultipleUploadResponseDto {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    return this.uploadService.processMultipleFiles(files, category);
  }

  @Delete(':category/:filename')
  @ApiOperation({
    summary: 'Deletar arquivo',
    description: 'Remove um arquivo do sistema de arquivos',
  })
  @ApiParam({
    name: 'category',
    description: 'Categoria onde o arquivo está salvo',
    example: 'projects',
  })
  @ApiParam({
    name: 'filename',
    description: 'Nome do arquivo a ser deletado',
    example: '1707825600000-a1b2c3d4e5f6.png',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Arquivo não encontrado',
  })
  async deleteFile(
    @Param('category') category: string,
    @Param('filename') filename: string,
  ): Promise<{ message: string }> {
    await this.uploadService.deleteFile(category, filename);
    return {
      message: `Arquivo ${filename} deletado com sucesso da categoria ${category}`,
    };
  }
}
