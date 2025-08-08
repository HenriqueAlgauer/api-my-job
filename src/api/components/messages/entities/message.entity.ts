import { Base } from '../../base/entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'messages' })
export class Message extends Base {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  read: boolean;
}
