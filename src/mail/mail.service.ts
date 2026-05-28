import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mail') private mailQueue: Queue,
  ) {}

  // Queue application confirmation email
  // Same as Laravel's SendApplicationEmail::dispatch($data)
  async sendApplicationConfirmation(data: {
    applicantEmail: string;
    applicantName: string;
    jobTitle: string;
    company: string;
  }) {
    await this.mailQueue.add('application-confirmation', data, {
      attempts: 3,        // retry 3 times if fails — same as Laravel's tries
      backoff: 5000,      // wait 5s between retries
      removeOnComplete: true,
    });
    console.log('✅ Email job queued for:', data.applicantEmail);
  }

  // Queue job posted confirmation
  async sendJobPostedConfirmation(data: {
    employerEmail: string;
    jobTitle: string;
  }) {
    await this.mailQueue.add('job-posted', data, {
      attempts: 3,
      removeOnComplete: true,
    });
  }
}