import { Repository } from 'typeorm';
import { FileEntity } from '../../api/components/files/entities/file.entity';

export const fileSeedData = [
  {
    originalName: 'profile-photo.jpg',
    fileName: 'profile-photo-1700000000.jpg',
    mimeType: 'image/jpeg',
    size: 245000,
    url: 'https://picsum.photos/seed/profile/400/400',
  },
  {
    originalName: 'cover-nestjs.png',
    fileName: 'cover-nestjs-1700000001.png',
    mimeType: 'image/png',
    size: 512000,
    url: 'https://picsum.photos/seed/cover-nestjs/1200/630',
  },
  {
    originalName: 'curriculum.pdf',
    fileName: 'curriculum-1700000002.pdf',
    mimeType: 'application/pdf',
    size: 180000,
    url: 'https://example.com/files/curriculum.pdf',
  },
];

export async function seedFiles(repo: Repository<FileEntity>): Promise<FileEntity[]> {
  const count = await repo.count();
  if (count > 0) {
    console.log(`✔ Files already seeded (${count} found)`);
    return repo.find();
  }

  const files: FileEntity[] = [];

  for (const data of fileSeedData) {
    const file = repo.create(data);
    files.push(await repo.save(file));
  }

  console.log(`✔ ${files.length} files seeded`);
  return files;
}
