import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;
}