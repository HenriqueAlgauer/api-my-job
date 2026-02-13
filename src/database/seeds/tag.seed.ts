import { Repository } from 'typeorm';
import { Tag } from '../../api/components/tags/entities/tag.entity';

export const tagSeedData = [
  { name: 'NestJS' },
  { name: 'React' },
  { name: 'TypeScript' },
  { name: 'JavaScript' },
  { name: 'Node.js' },
  { name: 'Backend' },
  { name: 'Frontend' },
  { name: 'DevOps' },
  { name: 'Docker' },
  { name: 'PostgreSQL' },
  { name: 'API REST' },
  { name: 'Tutorial' },
  { name: 'Boas Práticas' },
  { name: 'Arquitetura' },
  { name: 'Testes' },
];

export async function seedTags(repo: Repository<Tag>): Promise<Tag[]> {
  const tags: Tag[] = [];

  for (const data of tagSeedData) {
    const existing = await repo.findOne({ where: { name: data.name } });
    if (existing) {
      tags.push(existing);
      continue;
    }

    const tag = repo.create(data);
    tags.push(await repo.save(tag));
  }

  console.log(`✔ ${tags.length} tags seeded`);
  return tags;
}
