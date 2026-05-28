import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { Job } from '../jobs/entities/job.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private appRepo: Repository<Application>,

    @InjectRepository(Job)
    private jobRepo: Repository<Job>,

    private mailService: MailService, // inject mail service
    private usersService: UsersService, // inject users service
  ) {}

  async apply(
    userId: number, 
    dto: CreateApplicationDto,
    resumeFile?: string,
  ): Promise<Application> {
    // Check job exists
    const job = await this.jobRepo.findOne({ where: { id: dto.jobId } });
    if (!job) throw new NotFoundException('Job not found');

    // Prevent duplicate applications
    // Same as Laravel's unique validation on composite key
    const existing = await this.appRepo.findOne({
      where: { userId, jobId: dto.jobId },
    });
    if (existing) throw new ConflictException('You already applied for this job');

    const application = this.appRepo.create({
      userId,
      jobId: dto.jobId,
      coverLetter: dto.coverLetter,
      resumeFile,
    });

    const saved = await this.appRepo.save(application);
    const user = await this.usersService.findOne(saved.userId);
    if (!user) throw new NotFoundException('User not found');

    // Queue email AFTER saving — non-blocking
    // API responds immediately, email sends in background
    // Same as Laravel's dispatch() after save
    await this.mailService.sendApplicationConfirmation({
      applicantEmail: user.email,
      applicantName: user.name,
      jobTitle: job.title,
      company: job.company,
    });

    return saved;
  }

  // Get all applications by logged-in user
  async myApplications(userId: number): Promise<Application[]> {
    return this.appRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // Get all applications for a job (employer view)
  async jobApplications(jobId: number): Promise<Application[]> {
    return this.appRepo.find({
      where: { jobId },
      order: { createdAt: 'DESC' },
    });
  }
}