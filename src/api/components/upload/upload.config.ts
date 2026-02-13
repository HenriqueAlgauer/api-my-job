import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomBytes } from 'crypto';
import { BadRequestException } from '@nestjs/common';

/**
 * config multer p/ upload de arquivos
 */

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * config storage multer
 */
export const multerConfig = {
  storage: diskStorage({
    // Define o destino onde os arquivos serão salvos
    destination: (req, file, cb) => {
      const category = req.path.split('/').pop() || 'default';
      const uploadPath = join(process.cwd(), 'uploads', category);
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${randomBytes(16).toString('hex')}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10, // max 10 arquivos p/req
  },

  fileFilter: (req, file, cb) => {
    // valida mime do arquivo
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          `Tipo de arquivo não permitido. Tipos aceitos: ${ALLOWED_IMAGE_TYPES.join(', ')}`
        ),
        false,
      );
    }
    cb(null, true);
  },
};

/**
 * valida se o arquivo é uma imagem
 */
export function isImageFile(mimetype: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimetype);
}

/**
 * formata o tamanho do arquivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
