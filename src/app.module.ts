import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsModule } from './jobs/jobs.module';
import { Job } from './jobs/entities/job.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ApplicationsModule } from './applications/applications.module';
import { Application } from './applications/entities/application.entity';
import { BullModule } from '@nestjs/bull';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    // Load .env file globally — same as Laravel's env()
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect to PostgreSQL — same as config/database.php in Laravel
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [Job, User, Application],
        synchronize: true, // Auto-creates tables — like running migrations automatically
                           // WARNING: set to false in production
      }),
      inject: [ConfigService],
    }),

    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    JobsModule,

    AuthModule,

    UsersModule,

    ApplicationsModule,

    MailModule,
  ],
})
export class AppModule {}