import { apiGet, apiSend } from './client';

export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  modifiedAt: string;
}

export const listUploads = () => apiGet<{ files: UploadedFile[] }>('/api/uploads');

export const deleteUpload = (name: string) =>
  apiSend<{ ok: true }>('DELETE', `/api/uploads/${encodeURIComponent(name)}`);
