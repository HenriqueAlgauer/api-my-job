import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './api/components/projects/projects.module';
import { TechnologiesModule } from './api/components/technologies/technologies.module';
import { PostsModule } from './api/components/posts/posts.module';
import { TagsModule } from './api/components/tags/tags.module';
import { UsersModule } from './api/components/users/users.module';
import { AuthModule } from './api/components/auth/auth.module';
import { TokensModule } from './api/components/tokens/tokens.module';
import { FilesModule } from './api/components/files/files.module';
import { MessagesModule } from './api/components/messages/messages.module';
import { StudiesModule } from './api/components/studies/studies.module';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from './settings';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: parseInt(DB_PORT, 10),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
    }),
    ProjectsModule,
    TechnologiesModule,
    PostsModule,
    TagsModule,
    UsersModule,
    AuthModule,
    TokensModule,
    FilesModule,
    MessagesModule,
    StudiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
