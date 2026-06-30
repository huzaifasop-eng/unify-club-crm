import { Injectable } from '@nestjs/common';
import { NotificationProvider, SendNotificationInput } from '../notification.types';

@Injectable()
export class ConsoleEmailProvider implements NotificationProvider {
  async send(input: SendNotificationInput) {
    console.log(
      '[MockEmailProvider] Sending email to',
      input.to,
      'subject:',
      input.subject,
      'body:',
      input.body,
    );
    return { success: true, providerMessageId: 'mock-' + Date.now() };
  }
}
