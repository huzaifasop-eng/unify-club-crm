import { Injectable, Logger } from '@nestjs/common';
import { NotificationChannel, NotificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationProvider } from './notification.types';
import { ConsoleEmailProvider } from './providers/console-email.provider';
import { ConsoleWhatsAppProvider } from './providers/console-whatsapp.provider';
import { ConsolePushProvider } from './providers/console-push.provider';

interface SendOpts {
  recipientId?: string;
  branchId?: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private consoleEmailProvider: ConsoleEmailProvider,
    private consoleWhatsAppProvider: ConsoleWhatsAppProvider,
    private consolePushProvider: ConsolePushProvider,
  ) {}

  /**
   * Resolves the active email provider based on NOTIFICATION_EMAIL_PROVIDER.
   * Currently only 'console' is implemented; future PRs can add 'smtp' etc.
   * without changing any call sites.
   */
  private getEmailProvider(): NotificationProvider {
    const providerName = process.env.NOTIFICATION_EMAIL_PROVIDER || 'console';
    switch (providerName) {
      case 'console':
      // case 'smtp': return this.smtpProvider; // future implementation
      default:
        return this.consoleEmailProvider;
    }
  }

  private getWhatsAppProvider(): NotificationProvider {
    const providerName = process.env.NOTIFICATION_WHATSAPP_PROVIDER || 'console';
    switch (providerName) {
      case 'console':
      // case 'whatsapp_cloud_api': return this.whatsappCloudApiProvider; // future implementation
      default:
        return this.consoleWhatsAppProvider;
    }
  }

  private getPushProvider(): NotificationProvider {
    const providerName = process.env.NOTIFICATION_PUSH_PROVIDER || 'console';
    switch (providerName) {
      case 'console':
      // case 'firebase': return this.firebaseProvider; // future implementation
      default:
        return this.consolePushProvider;
    }
  }

  private async dispatch(
    provider: NotificationProvider,
    channel: NotificationChannel,
    to: string,
    subject: string | undefined,
    body: string,
    opts?: SendOpts,
  ) {
    let status: NotificationStatus = NotificationStatus.SENT;
    let result: { success: boolean; providerMessageId?: string; error?: string };

    try {
      result = await provider.send({
        channel: channel as any,
        to,
        subject,
        body,
      });
      if (!result.success) status = NotificationStatus.FAILED;
    } catch (err) {
      this.logger.error(`Notification dispatch failed: ${err}`);
      result = { success: false, error: String(err) };
      status = NotificationStatus.FAILED;
    }

    const notification = await this.prisma.notification.create({
      data: {
        branchId: opts?.branchId,
        recipientId: opts?.recipientId,
        channel,
        title: subject || channel,
        body,
        status,
        sentAt: status === NotificationStatus.SENT ? new Date() : undefined,
      },
    });

    return { ...result, notification };
  }

  sendEmail(to: string, subject: string, body: string, opts?: SendOpts) {
    return this.dispatch(this.getEmailProvider(), NotificationChannel.EMAIL, to, subject, body, opts);
  }

  sendWhatsApp(to: string, body: string, opts?: SendOpts) {
    return this.dispatch(
      this.getWhatsAppProvider(),
      NotificationChannel.WHATSAPP,
      to,
      undefined,
      body,
      opts,
    );
  }

  sendPush(to: string, body: string, opts?: SendOpts) {
    return this.dispatch(this.getPushProvider(), NotificationChannel.PUSH, to, undefined, body, opts);
  }
}
