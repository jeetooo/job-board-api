import { IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApplicationDto {
  @IsNumber()
  @Type(() => Number)
  jobId: number;

  @IsString()
  @IsOptional()
  coverLetter?: string;
}