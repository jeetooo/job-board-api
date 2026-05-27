import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;
}