import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0)
  salary: number;

  @IsBoolean()
  remote: boolean;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsNumber()
  @IsOptional()
  experience?: number;
}
