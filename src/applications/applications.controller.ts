import { Controller, Post, Get, Body, Param, UseGuards, Request, UseInterceptors,
  UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Multer storage config — same as Laravel's Storage::disk()
const resumeStorage = diskStorage({
  destination: './uploads',  // save to /uploads folder
  filename: (req, file, cb) => {
    // Generate unique filename: resume-123456789-originalname.pdf
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `resume-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

// File filter — only allow PDF, DOC, DOCX
const fileFilter = (req: any, file: any, cb: any) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);  // accept file
  } else {
    cb(new BadRequestException('Only PDF, DOC, DOCX files are allowed'), false);
  }
};

@Controller('applications')
@UseGuards(JwtAuthGuard) // all routes require login
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // POST /applications — apply for a job
  @Post()
  @UseInterceptors(FileInterceptor('resume', {
    storage: resumeStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max — same as Laravel's max:5120
  }))
  apply(
    @Body() dto: CreateApplicationDto,
    @Request() req,
    @UploadedFile() resume?: Express.Multer.File,
  ) {
    return this.applicationsService.apply(
      req.user.id,
      dto,
      resume?.filename,  // pass filename to service
    );
  }

  // GET /applications/my — my applications
  @Get('my')
  myApplications(@Request() req) {
    return this.applicationsService.myApplications(req.user.id);
  }

  // GET /applications/job/:jobId — applications for a job
  @Get('job/:jobId')
  jobApplications(@Param('jobId') jobId: string) {
    return this.applicationsService.jobApplications(+jobId);
  }
}