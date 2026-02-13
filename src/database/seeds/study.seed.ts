import { Repository } from 'typeorm';
import { Study, StudyType } from '../../api/components/studies/entities/study.entity';
import { Technology } from '../../api/components/technologies/entities/technology.entity';

export function getStudySeedData(technologies: Technology[]) {
  const techMap = new Map(technologies.map((t) => [t.name, t]));

  return [
    {
      title: 'Análise e Desenvolvimento de Sistemas',
      institution: 'Universidade Federal',
      description: 'Graduação em Análise e Desenvolvimento de Sistemas com foco em engenharia de software, banco de dados, estrutura de dados e desenvolvimento web.',
      startDate: new Date('2020-02-01'),
      endDate: new Date('2023-12-15'),
      certificateUrl: null,
      type: StudyType.GRADUATION,
      technologies: [
        techMap.get('JavaScript'),
        techMap.get('Python'),
        techMap.get('PostgreSQL'),
        techMap.get('Git'),
      ].filter(Boolean),
    },
    {
      title: 'NestJS: Criando APIs Profissionais',
      institution: 'Udemy',
      description: 'Curso completo de NestJS abordando módulos, controllers, services, guards, interceptors, pipes, TypeORM e autenticação JWT.',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-03-20'),
      certificateUrl: 'https://udemy.com/certificate/nestjs-123',
      type: StudyType.COURSE,
      technologies: [
        techMap.get('NestJS'),
        techMap.get('TypeScript'),
        techMap.get('PostgreSQL'),
        techMap.get('Node.js'),
      ].filter(Boolean),
    },
    {
      title: 'React Avançado',
      institution: 'Rocketseat',
      description: 'Bootcamp focado em React com Next.js, testes automatizados, CI/CD, deploy e boas práticas de desenvolvimento frontend.',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-09-30'),
      certificateUrl: 'https://rocketseat.com/certificate/react-456',
      type: StudyType.BOOTCAMP,
      technologies: [
        techMap.get('React'),
        techMap.get('Next.js'),
        techMap.get('TypeScript'),
        techMap.get('Tailwind CSS'),
      ].filter(Boolean),
    },
    {
      title: 'Docker & Kubernetes Essentials',
      institution: 'Linux Foundation',
      description: 'Certificação em containerização com Docker e orquestração com Kubernetes. Aborda criação de imagens, Docker Compose, pods, services e deployments.',
      startDate: new Date('2024-05-10'),
      endDate: new Date('2024-07-15'),
      certificateUrl: 'https://linuxfoundation.org/certificate/docker-k8s-789',
      type: StudyType.CERTIFICATION,
      technologies: [
        techMap.get('Docker'),
        techMap.get('Node.js'),
      ].filter(Boolean),
    },
    {
      title: 'MongoDB para Desenvolvedores',
      institution: 'MongoDB University',
      description: 'Curso oficial da MongoDB University cobrindo modelagem de dados, queries avançadas, aggregation pipeline e performance tuning.',
      startDate: new Date('2024-08-01'),
      endDate: null,
      certificateUrl: null,
      type: StudyType.COURSE,
      technologies: [
        techMap.get('MongoDB'),
        techMap.get('Node.js'),
      ].filter(Boolean),
    },
  ];
}

export async function seedStudies(
  repo: Repository<Study>,
  technologies: Technology[],
): Promise<Study[]> {
  const studies: Study[] = [];
  const seedData = getStudySeedData(technologies);

  for (const data of seedData) {
    const existing = await repo.findOne({
      where: { title: data.title, institution: data.institution },
    });
    if (existing) {
      studies.push(existing);
      continue;
    }

    const study = repo.create(data);
    studies.push(await repo.save(study));
  }

  console.log(`✔ ${studies.length} studies seeded`);
  return studies;
}
