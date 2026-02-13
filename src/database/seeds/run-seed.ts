import { AppDataSource } from '../data-source';
import { Technology } from '../../api/components/technologies/entities/technology.entity';
import { Tag } from '../../api/components/tags/entities/tag.entity';
import { User } from '../../api/components/users/entities/user.entity';
import { Post } from '../../api/components/posts/entities/post.entity';
import { Project } from '../../api/components/projects/entities/project.entity';
import { Study } from '../../api/components/studies/entities/study.entity';
import { Message } from '../../api/components/messages/entities/message.entity';
import { FileEntity } from '../../api/components/files/entities/file.entity';

import { seedTechnologies } from './technology.seed';
import { seedTags } from './tag.seed';
import { seedUsers } from './user.seed';
import { seedPosts } from './post.seed';
import { seedProjects } from './project.seed';
import { seedStudies } from './study.seed';
import { seedMessages } from './message.seed';
import { seedFiles } from './file.seed';

async function runSeed() {
  console.log('🌱 Starting seed...\n');

  await AppDataSource.initialize();
  console.log('📦 Database connected\n');

  // 1. Entidades sem dependências
  const technologies = await seedTechnologies(AppDataSource.getRepository(Technology));
  const tags = await seedTags(AppDataSource.getRepository(Tag));
  const users = await seedUsers(AppDataSource.getRepository(User));

  // 2. Entidades com dependências
  await seedPosts(AppDataSource.getRepository(Post), users, tags);
  await seedProjects(AppDataSource.getRepository(Project), technologies);
  await seedStudies(AppDataSource.getRepository(Study), technologies);

  // 3. Entidades standalone
  await seedMessages(AppDataSource.getRepository(Message));
  await seedFiles(AppDataSource.getRepository(FileEntity));

  console.log('\n✅ Seed completed successfully!');
  console.log('\n📋 Credentials:');
  console.log('   Admin: admin@myjob.com / Admin@123');
  console.log('   User:  joao@myjob.com  / User@123');

  await AppDataSource.destroy();
  process.exit(0);
}

runSeed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
