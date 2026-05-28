import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]), 
    MailModule
  ], // same as Eloquent knowing which model to use
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}