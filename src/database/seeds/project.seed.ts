import { Repository } from 'typeorm';
import {
  Project,
  ProjectStatus,
} from '../../api/components/projects/entities/project.entity';
import { Technology } from '../../api/components/technologies/entities/technology.entity';

export function getProjectSeedData(technologies: Technology[]) {
  const techMap = new Map(technologies.map((t) => [t.name, t]));

  return [
    {
      title: 'Portfolio Pessoal',
      shortDescription: 'Site pessoal com blog, projetos e formulário de contato.',
      fullDescription: `Aplicação full stack desenvolvida como portfólio pessoal. O frontend foi construído com Next.js e Tailwind CSS, enquanto o backend utiliza NestJS com PostgreSQL. Inclui sistema de blog com markdown, área de projetos, formulário de contato e painel administrativo.`,
      mainImageUrl: 'https://picsum.photos/seed/portfolio/1200/630',
      galleryImageUrls: [
        'https://picsum.photos/seed/portfolio-1/800/450',
        'https://picsum.photos/seed/portfolio-2/800/450',
        'https://picsum.photos/seed/portfolio-3/800/450',
      ],
      githubRepoUrl: 'https://github.com/user/portfolio',
      liveSiteUrl: 'https://meuportfolio.com',
      status: ProjectStatus.DEVELOPMENT,
      technologies: [
        techMap.get('Next.js'),
        techMap.get('NestJS'),
        techMap.get('TypeScript'),
        techMap.get('PostgreSQL'),
        techMap.get('Tailwind CSS'),
        techMap.get('Docker'),
      ].filter(Boolean),
    },
    {
      title: 'E-commerce API',
      shortDescription: 'API RESTful completa para sistema de e-commerce.',
      fullDescription: `API robusta para e-commerce construída com NestJS. Possui autenticação JWT, gerenciamento de produtos, carrinho de compras, sistema de pedidos e integração com gateway de pagamento. Utiliza PostgreSQL como banco de dados e Redis para cache.`,
      mainImageUrl: 'https://picsum.photos/seed/ecommerce/1200/630',
      galleryImageUrls: [
        'https://picsum.photos/seed/ecommerce-1/800/450',
        'https://picsum.photos/seed/ecommerce-2/800/450',
      ],
      githubRepoUrl: 'https://github.com/user/ecommerce-api',
      liveSiteUrl: null,
      status: ProjectStatus.COMPLETED,
      technologies: [
        techMap.get('NestJS'),
        techMap.get('TypeScript'),
        techMap.get('PostgreSQL'),
        techMap.get('Redis'),
        techMap.get('Docker'),
        techMap.get('Node.js'),
      ].filter(Boolean),
    },
    {
      title: 'Task Manager Mobile',
      shortDescription: 'App mobile de gerenciamento de tarefas com React Native.',
      fullDescription: `Aplicativo mobile para gerenciamento de tarefas e produtividade. Desenvolvido com React Native, possui funcionalidades como criação de tarefas, categorização, notificações push e sincronização offline. O backend utiliza Node.js com MongoDB.`,
      mainImageUrl: 'https://picsum.photos/seed/taskmanager/1200/630',
      galleryImageUrls: [
        'https://picsum.photos/seed/taskmanager-1/800/450',
        'https://picsum.photos/seed/taskmanager-2/800/450',
      ],
      githubRepoUrl: 'https://github.com/user/task-manager',
      liveSiteUrl: null,
      status: ProjectStatus.COMPLETED,
      technologies: [
        techMap.get('React Native'),
        techMap.get('TypeScript'),
        techMap.get('Node.js'),
        techMap.get('MongoDB'),
      ].filter(Boolean),
    },
    {
      title: 'Dashboard Analytics',
      shortDescription: 'Dashboard interativo para visualização de dados em tempo real.',
      fullDescription: `Dashboard de analytics construído com React e integrado a múltiplas fontes de dados. Possui gráficos interativos, filtros dinâmicos, exportação de relatórios e atualização em tempo real via WebSockets. Utiliza Python no backend para processamento de dados.`,
      mainImageUrl: 'https://picsum.photos/seed/dashboard/1200/630',
      galleryImageUrls: [
        'https://picsum.photos/seed/dashboard-1/800/450',
      ],
      githubRepoUrl: 'https://github.com/user/dashboard-analytics',
      liveSiteUrl: 'https://dashboard.meuportfolio.com',
      status: ProjectStatus.PLANNING,
      technologies: [
        techMap.get('React'),
        techMap.get('TypeScript'),
        techMap.get('Python'),
        techMap.get('PostgreSQL'),
        techMap.get('Docker'),
      ].filter(Boolean),
    },
  ];
}

export async function seedProjects(
  repo: Repository<Project>,
  technologies: Technology[],
): Promise<Project[]> {
  const projects: Project[] = [];
  const seedData = getProjectSeedData(technologies);

  for (const data of seedData) {
    const existing = await repo.findOne({ where: { title: data.title } });
    if (existing) {
      projects.push(existing);
      continue;
    }

    const project = repo.create(data);
    projects.push(await repo.save(project));
  }

  console.log(`✔ ${projects.length} projects seeded`);
  return projects;
}
