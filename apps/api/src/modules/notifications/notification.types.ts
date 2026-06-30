export enum NotificationChannelType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export interface SendNotificationInput {
  channel: NotificationChannelType;
  to: string; // email address, phone number, or device token depending on channel
  subject?: string;
  body: string;
  metadata?: Record<string, any>;
}

export interface NotificationProvider {
  send(input: SendNotificationInput): Promise<{
    success: boolean;
    providerMessageId?: string;
    error?: string;
  }>;
}
