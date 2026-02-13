import { Repository } from 'typeorm';
import { Post, PostStatus } from '../../api/components/posts/entities/post.entity';
import { User } from '../../api/components/users/entities/user.entity';
import { Tag } from '../../api/components/tags/entities/tag.entity';

function isTag(value: Tag | undefined): value is Tag {
  return value !== undefined;
}

export function getPostSeedData(users: User[], tags: Tag[]) {
  const admin = users[0];
  const joao = users[1] || users[0];

  const tagMap = new Map(tags.map((t) => [t.name, t]));

  return [
    {
      slug: 'introducao-ao-nestjs',
      title: 'Introdução ao NestJS: Construindo APIs robustas com Node.js',
      content: `# Introdução ao NestJS

NestJS é um framework progressivo para construção de aplicações server-side eficientes e escaláveis com Node.js.

## Por que NestJS?

- **Arquitetura modular**: Facilita a organização do código
- **TypeScript nativo**: Tipagem estática desde o início
- **Injeção de dependência**: Padrão enterprise out-of-the-box
- **Decorators**: Sintaxe limpa e declarativa

## Primeiros passos

\`\`\`bash
npm i -g @nestjs/cli
nest new meu-projeto
\`\`\`

## Conclusão

NestJS é uma excelente escolha para quem quer construir APIs profissionais com Node.js.`,
      coverImageUrl: 'https://picsum.photos/seed/nestjs/1200/630',
      status: PostStatus.PUBLISHED,
      author: admin,
      tags: [tagMap.get('NestJS'), tagMap.get('Node.js'), tagMap.get('Backend'), tagMap.get('TypeScript')].filter(isTag),
    },
    {
      slug: 'react-hooks-guia-completo',
      title: 'React Hooks: Guia Completo para Iniciantes',
      content: `# React Hooks: Guia Completo

Os Hooks revolucionaram a forma como escrevemos componentes React.

## useState

\`\`\`tsx
const [count, setCount] = useState(0);
\`\`\`

## useEffect

\`\`\`tsx
useEffect(() => {
  document.title = \`Você clicou \${count} vezes\`;
}, [count]);
\`\`\`

## useContext

Compartilhe estado entre componentes sem prop drilling.

## Hooks customizados

Crie seus próprios hooks para reutilizar lógica entre componentes.`,
      coverImageUrl: 'https://picsum.photos/seed/react-hooks/1200/630',
      status: PostStatus.PUBLISHED,
      author: joao,
      tags: [tagMap.get('React'), tagMap.get('Frontend'), tagMap.get('JavaScript'), tagMap.get('Tutorial')].filter(isTag),
    },
    {
      slug: 'docker-para-desenvolvedores',
      title: 'Docker para Desenvolvedores: Do Zero ao Deploy',
      content: `# Docker para Desenvolvedores

Docker simplifica o processo de desenvolvimento, teste e deploy de aplicações.

## Conceitos básicos

- **Imagem**: Template read-only para criar containers
- **Container**: Instância em execução de uma imagem
- **Dockerfile**: Receita para construir uma imagem

## Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
\`\`\`

## Conclusão

Docker é essencial no toolkit de qualquer desenvolvedor moderno.`,
      coverImageUrl: 'https://picsum.photos/seed/docker/1200/630',
      status: PostStatus.PUBLISHED,
      author: admin,
      tags: [tagMap.get('Docker'), tagMap.get('DevOps'), tagMap.get('Boas Práticas')].filter(isTag),
    },
    {
      slug: 'typescript-avancado-generics',
      title: 'TypeScript Avançado: Dominando Generics',
      content: `# TypeScript Avançado: Generics

Generics permitem criar componentes reutilizáveis que funcionam com múltiplos tipos.

## Syntax básica

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\`

## Constraints

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
\`\`\`

## Utility Types

TypeScript oferece tipos utilitários poderosos como \`Partial<T>\`, \`Pick<T, K>\` e \`Omit<T, K>\`.`,
      coverImageUrl: 'https://picsum.photos/seed/typescript/1200/630',
      status: PostStatus.DRAFT,
      author: admin,
      tags: [tagMap.get('TypeScript'), tagMap.get('Boas Práticas'), tagMap.get('Tutorial')].filter(isTag),
    },
    {
      slug: 'api-rest-boas-praticas',
      title: 'Boas Práticas para Design de APIs REST',
      content: `# Boas Práticas para APIs REST

## Nomenclatura de recursos

- Use substantivos no plural: \`/users\`, \`/posts\`
- Evite verbos nas URLs
- Use kebab-case: \`/user-profiles\`

## Códigos HTTP

- **200**: Sucesso
- **201**: Criado
- **400**: Bad Request
- **404**: Não encontrado
- **500**: Erro interno

## Versionamento

Use versionamento na URL: \`/api/v1/users\`

## Paginação

\`\`\`json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
\`\`\``,
      coverImageUrl: 'https://picsum.photos/seed/api-rest/1200/630',
      status: PostStatus.PUBLISHED,
      author: joao,
      tags: [tagMap.get('API REST'), tagMap.get('Backend'), tagMap.get('Boas Práticas'), tagMap.get('Arquitetura')].filter(isTag),
    },
  ];
}

export async function seedPosts(
  repo: Repository<Post>,
  users: User[],
  tags: Tag[],
): Promise<Post[]> {
  const posts: Post[] = [];
  const seedData = getPostSeedData(users, tags);

  for (const data of seedData) {
    const existing = await repo.findOne({ where: { slug: data.slug } });
    if (existing) {
      posts.push(existing);
      continue;
    }

    const post = repo.create(data);
    posts.push(await repo.save(post));
  }

  console.log(`✔ ${posts.length} posts seeded`);
  return posts;
}

