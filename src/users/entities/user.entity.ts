import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  SEEKER = 'seeker',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })  // same as unique:users,email in Laravel
  email: string;

  @Column()
  password: string;  // will be hashed with bcrypt

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SEEKER, // default role is seeker
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}