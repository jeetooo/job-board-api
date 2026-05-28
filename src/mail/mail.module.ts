import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail', // queue name
    }),
  ],
  providers: [MailProcessor, MailService],
  exports: [MailService],
})
export class MailModule {}