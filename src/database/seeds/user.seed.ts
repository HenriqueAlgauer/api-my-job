import { Repository } from 'typeorm';
import { User, UserRole } from '../../api/components/users/entities/user.entity';
import { calcHashedPassword } from '../../utils';

export const userSeedData = [
  {
    name: 'Admin',
    email: 'admin@myjob.com',
    plainPassword: 'Admin@123',
    role: UserRole.ADMIN,
    bio: 'Administrador da plataforma. Desenvolvedor Full Stack apaixonado por tecnologia.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    name: 'João Silva',
    email: 'joao@myjob.com',
    plainPassword: 'User@123',
    role: UserRole.USER,
    bio: 'Desenvolvedor frontend com foco em React e Next.js.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
  },
];

export async function seedUsers(repo: Repository<User>): Promise<User[]> {
  const users: User[] = [];

  for (const data of userSeedData) {
    const existing = await repo.findOne({ where: { email: data.email } });
    if (existing) {
      users.push(existing);
      continue;
    }

    const { password, salt } = calcHashedPassword(data.plainPassword);

    const user = repo.create({
      name: data.name,
      email: data.email,
      password,
      salt,
      role: data.role,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    });

    users.push(await repo.save(user));
  }

  console.log(`✔ ${users.length} users seeded`);
  return users;
}
