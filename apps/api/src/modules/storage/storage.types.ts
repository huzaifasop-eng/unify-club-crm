export interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
  mimeType?: string;
}

export interface StorageProvider {
  upload(fileName: string, buffer: Buffer, mimeType?: string): Promise<UploadResult>;
  delete(key: string): Promise<void>;
}
