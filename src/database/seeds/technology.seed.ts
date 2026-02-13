import { Repository } from 'typeorm';
import {
  Technology,
  TechnologyType,
} from '../../api/components/technologies/entities/technology.entity';

export const technologySeedData = [
  {
    name: 'TypeScript',
    type: TechnologyType.FRONTEND,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  },
  {
    name: 'JavaScript',
    type: TechnologyType.FRONTEND,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  },
  {
    name: 'React',
    type: TechnologyType.FRONTEND,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  {
    name: 'Next.js',
    type: TechnologyType.FRONTEND,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  },
  {
    name: 'Node.js',
    type: TechnologyType.BACKEND,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  {
    name: 'NestJS',
    type: TechnologyType.BACKEND,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
  },
  {
    name: 'PostgreSQL',
    type: TechnologyType.DATABASE,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  },
  {
    name: 'MongoDB',
    type: TechnologyType.DATABASE,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  },
  {
    name: 'Docker',
    type: TechnologyType.DEVOPS,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
  {
    name: 'Redis',
    type: TechnologyType.DATABASE,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
  },
  {
    name: 'Tailwind CSS',
    type: TechnologyType.FRONTEND,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  },
  {
    name: 'React Native',
    type: TechnologyType.MOBILE,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  {
    name: 'Git',
    type: TechnologyType.DEVOPS,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  },
  {
    name: 'Python',
    type: TechnologyType.BACKEND,
    logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  },
];

export async function seedTechnologies(repo: Repository<Technology>): Promise<Technology[]> {
  const technologies: Technology[] = [];

  for (const data of technologySeedData) {
    const existing = await repo.findOne({ where: { name: data.name } });
    if (existing) {
      technologies.push(existing);
      continue;
    }

    const technology = repo.create(data);
    technologies.push(await repo.save(technology));
  }

  console.log(`✔ ${technologies.length} technologies seeded`);
  return technologies;
}
