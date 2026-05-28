import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';

// This is the worker — same as Laravel's job handle() method
// It runs in the background processing queued jobs
@Processor('mail') // queue name = 'mail'
export class MailProcessor {

  @Process('application-confirmation')
  async handleApplicationConfirmation(job: Job) {
    const { applicantEmail, applicantName, jobTitle, company } = job.data;

    // In production replace this with real email using nodemailer
    // For now we log — same as Laravel's Log::info() in a job
    console.log('📧 Sending email to:', applicantEmail);
    console.log(`Dear ${applicantName},`);
    console.log(`Your application for ${jobTitle} at ${company} was received.`);
    console.log('We will get back to you soon.');
    console.log('---');

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { sent: true, to: applicantEmail };
  }

  @Process('job-posted')
  async handleJobPosted(job: Job) {
    const { employerEmail, jobTitle } = job.data;

    console.log('📧 Sending job posted confirmation to:', employerEmail);
    console.log(`Your job "${jobTitle}" has been posted successfully.`);
    console.log('---');

    return { sent: true };
  }
}