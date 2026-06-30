import { Injectable, Logger } from '@nestjs/common';
import { StorageProvider } from './storage.types';
import { LocalStorageProvider } from './providers/local-storage.provider';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);

  constructor(private localStorageProvider: LocalStorageProvider) {}

  /**
   * Resolves the active storage provider based on STORAGE_PROVIDER.
   * Only 'local' is implemented today; 's3' and 'cloudinary' fall back to
   * local with a warning so a future PR can wire in the real providers
   * without changing any call sites.
   */
  private getProvider(): StorageProvider {
    const providerName = process.env.STORAGE_PROVIDER || 'local';
    switch (providerName) {
      case 'local':
        return this.localStorageProvider;
      case 's3':
        this.logger.warn('STORAGE_PROVIDER=s3 is not yet implemented, falling back to local storage');
        return this.localStorageProvider;
      case 'cloudinary':
        this.logger.warn(
          'STORAGE_PROVIDER=cloudinary is not yet implemented, falling back to local storage',
        );
        return this.localStorageProvider;
      default:
        return this.localStorageProvider;
    }
  }

  upload(fileName: string, buffer: Buffer, mimeType?: string) {
    return this.getProvider().upload(fileName, buffer, mimeType);
  }

  delete(key: string) {
    return this.getProvider().delete(key);
  }
}
