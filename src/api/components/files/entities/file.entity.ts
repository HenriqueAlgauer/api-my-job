import { Base } from '../../base/entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'files' })
export class FileEntity extends Base {
  @Column()
  originalName: string;

  @Column()
  fileName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  url: string;
}
