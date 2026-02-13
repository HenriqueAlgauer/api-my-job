import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
  UploadResponseDto,
  MultipleUploadResponseDto,
} from './dto/upload-response.dto';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  private getBaseUrl(): string {
    const baseUrl = this.configService.get<string>('BASE_URL');
    if (baseUrl) {
      return baseUrl;
    }

    const port = this.configService.get<number>('PORT', 3000);
    return `http://localhost:${port}`;
  }

  processFile(file: Express.Multer.File, category: string): UploadResponseDto {
    const baseUrl = this.getBaseUrl();

    return {
      originalName: file.originalname,
      filename: file.filename,
      url: `${baseUrl}/uploads/${category}/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
      category,
    };
  }

  processMultipleFiles(
    files: Express.Multer.File[],
    category: string,
  ): MultipleUploadResponseDto {
    const processedFiles = files.map((file) =>
      this.processFile(file, category),
    );

    return {
      files: processedFiles,
      count: processedFiles.length,
    };
  }

  async deleteFile(category: string, filename: string): Promise<void> {
    const filePath = join(process.cwd(), 'uploads', category, filename);

    try {
      await fs.access(filePath); 
      await fs.unlink(filePath); 
    } catch (error) {
      throw new NotFoundException(
        `Arquivo ${filename} não encontrado na categoria ${category}`,
      );
    }
  }

  async deleteMultipleFiles(
    category: string,
    filenames: string[],
  ): Promise<{ deleted: number; errors: string[] }> {
    const errors: string[] = [];
    let deleted = 0;

    for (const filename of filenames) {
      try {
        await this.deleteFile(category, filename);
        deleted++;
      } catch (error) {
        errors.push(filename);
      }
    }

    return { deleted, errors };
  }

  extractFilenameFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    } catch {
      return null;
    }
  }
}
