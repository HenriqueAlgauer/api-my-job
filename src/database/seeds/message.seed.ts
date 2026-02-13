import { Repository } from 'typeorm';
import { Message } from '../../api/components/messages/entities/message.entity';

export const messageSeedData = [
  {
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',
    subject: 'Oportunidade de Freelance',
    content: 'Olá! Vi seu portfólio e gostei muito do seu trabalho. Tenho um projeto de e-commerce que precisa de um desenvolvedor full stack. Podemos conversar sobre isso?',
    read: false,
  },
  {
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    subject: 'Proposta de Trabalho',
    content: 'Bom dia! Sou recrutadora da TechCorp e seu perfil chamou nossa atenção. Temos uma vaga de desenvolvedor backend sênior que acredito ser do seu interesse. Quando podemos agendar uma conversa?',
    read: true,
  },
  {
    name: 'Pedro Almeida',
    email: 'pedro@dev.com',
    subject: 'Dúvida sobre o post de NestJS',
    content: 'Parabéns pelo artigo sobre NestJS! Fiquei com uma dúvida sobre a parte de injeção de dependência. Poderia explicar melhor como funciona o escopo dos providers?',
    read: false,
  },
];

export async function seedMessages(repo: Repository<Message>): Promise<Message[]> {
  const count = await repo.count();
  if (count > 0) {
    console.log(`✔ Messages already seeded (${count} found)`);
    return repo.find();
  }

  const messages: Message[] = [];

  for (const data of messageSeedData) {
    const message = repo.create(data);
    messages.push(await repo.save(message));
  }

  console.log(`✔ ${messages.length} messages seeded`);
  return messages;
}
