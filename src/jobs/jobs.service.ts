import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    // Same as injecting a Model in Laravel
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  // GET /jobs — same as Job::all()
  findAll(): Promise<Job[]> {
    return this.jobRepo.find();
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
    return this.jobRepo.save(job);
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