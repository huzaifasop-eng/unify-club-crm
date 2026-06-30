import { Injectable } from '@nestjs/common';
import { NotificationProvider, SendNotificationInput } from '../notification.types';

@Injectable()
export class ConsoleWhatsAppProvider implements NotificationProvider {
  async send(input: SendNotificationInput) {
    console.log('[MockWhatsAppProvider] Sending WhatsApp message to', input.to, 'body:', input.body);
    return { success: true, providerMessageId: 'mock-' + Date.now() };
  }
}
