import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity('jobs') // table name = jobs
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column({ type: 'bigint' })
  salary: number;

  @Column({ default: false })
  remote: boolean;

  @Column({ nullable: true })
  experience: number;

  // One job has many applications
  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;
}