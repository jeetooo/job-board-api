import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';
import { MailService } from '../mail/mail.service';

interface FindAllOptions {
  page: number;
  limit: number;
  search: string;
  remote?: boolean;
}

@Injectable()
export class JobsService {
  constructor(
    // Same as injecting a Model in Laravel
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,

    private mailService: MailService,
  ) {}

  // GET /jobs — same as Job::all()
  async findAll({ page, limit, search, remote }: FindAllOptions) {
    const skip = (page - 1) * limit; // same as Laravel's offset()

    // Build where conditions dynamically
    // Same as Laravel's when() chaining
    const where: any = {};

    if (search) {
      // Search in title OR company
      // Like('%laravel%') = SQL LIKE '%laravel%'
      where.title = ILike(`%${search}%`);
    }

    if (remote !== undefined) {
      where.remote = remote;
    }

    const [jobs, total] = await this.jobRepo.findAndCount({
      where,
      skip, // same as ->offset() in Laravel
      take: limit, // same as ->limit() in Laravel
      order: { createdAt: 'DESC' }, // newest first
    });

    // Return pagination metadata — same as Laravel's paginate()
    return {
      data: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // GET /jobs/:id — same as Job::findOrFail($id)
  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepo.findOne({ where: { id } });
    if (!job) throw new NotFoundException(`Job #${id} not found`);
    return job;
  }

  // POST /jobs — same as Job::create($data)
  async create(dto: CreateJobDto): Promise<Job> {
    const job = this.jobRepo.create(dto);
    const saved = await this.jobRepo.save(job);

    // Queue confirmation email — non-blocking
    await this.mailService.sendJobPostedConfirmation({
      employerEmail: 'employer@example.com', // in production use req.user.email
      jobTitle: saved.title,
    });

    return saved;
  }

  // PATCH /jobs/:id — same as $job->update($data)
  async update(id: number, dto: UpdateJobDto): Promise<Job> {
    const job = await this.findOne(id);
    Object.assign(job, dto);
    return this.jobRepo.save(job);
  }

  // DELETE /jobs/:id — same as $job->delete()
  async remove(id: number): Promise<{ message: string }> {
    const job = await this.findOne(id);
    await this.jobRepo.remove(job);
    return { message: `Job #${id} deleted successfully` };
  }
}