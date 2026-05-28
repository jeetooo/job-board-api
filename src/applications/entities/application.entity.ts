import {
  Entity, PrimaryGeneratedColumn, CreateDateColumn,
  ManyToOne, JoinColumn, Column
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  // ManyToOne = belongsTo in Laravel
  // Many applications belong to one User
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  // Many applications belong to one Job
  @ManyToOne(() => Job, { eager: true })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column()
  jobId: number;

  @Column({ nullable: true })
  coverLetter: string;

  @Column({ nullable: true })
  resumeFile: string;  // stores the filename

  @Column({ default: 'pending' })
  status: string; // pending, accepted, rejected

  @CreateDateColumn()
  createdAt: Date;
}