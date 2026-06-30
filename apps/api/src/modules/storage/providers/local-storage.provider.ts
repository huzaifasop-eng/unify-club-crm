import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { StorageProvider, UploadResult } from '../storage.types';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
  private getDir(): string {
    const dir = process.env.STORAGE_LOCAL_DIR || './uploads';
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  }

  async upload(fileName: string, buffer: Buffer, mimeType?: string): Promise<UploadResult> {
    const dir = this.getDir();
    const key = `${Date.now()}-${fileName}`;
    const filePath = path.join(dir, key);
    fs.writeFileSync(filePath, buffer);

    return {
      url: `/uploads/${key}`,
      key,
      sizeBytes: buffer.length,
      mimeType,
    };
  }

  async delete(key: string): Promise<void> {
    const dir = this.getDir();
    const filePath = path.join(dir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
