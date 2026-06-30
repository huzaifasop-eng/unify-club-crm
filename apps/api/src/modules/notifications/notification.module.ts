import { Global, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ConsoleEmailProvider } from './providers/console-email.provider';
import { ConsoleWhatsAppProvider } from './providers/console-whatsapp.provider';
import { ConsolePushProvider } from './providers/console-push.provider';

/**
 * Global provider-agnostic notification infrastructure module.
 *
 * NOTE on naming: at the time this module was created there was no
 * pre-existing "Notifications Center" placeholder CRUD module in
 * src/modules/notifications, so this infra module is named `NotificationModule`
 * (singular) and lives alongside any future `NotificationsModule` (plural)
 * placeholder controller for the Notification model CRUD endpoints, to avoid
 * a naming collision if one is added later.
 */
@Global()
@Module({
  providers: [NotificationService, ConsoleEmailProvider, ConsoleWhatsAppProvider, ConsolePushProvider],
  exports: [NotificationService],
})
export class NotificationModule {}
