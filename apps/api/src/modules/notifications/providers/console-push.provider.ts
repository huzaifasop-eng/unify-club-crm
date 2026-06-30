import { Injectable } from '@nestjs/common';
import { NotificationProvider, SendNotificationInput } from '../notification.types';

@Injectable()
export class ConsolePushProvider implements NotificationProvider {
  async send(input: SendNotificationInput) {
    console.log('[MockPushProvider] Sending push notification to', input.to, 'body:', input.body);
    return { success: true, providerMessageId: 'mock-' + Date.now() };
  }
}
