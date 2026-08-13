/**
 * Thin fetch wrapper for the house API.
 *
 * The admin bearer token lives in localStorage so a reload keeps the session;
 * the server still decides whether that token is worth anything.
 */
const TOKEN_KEY = 'checkmate_admin_token_v2';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string | null): void => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — the session simply won't survive a reload */
  }
};

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const parse = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T & { error?: string }) : ({} as T & { error?: string });

  if (!response.ok) {
    throw new ApiError(payload.error ?? `Request failed (${response.status})`, response.status);
  }

  return payload as T;
};

export const apiGet = async <T>(path: string): Promise<T> =>
  parse<T>(await fetch(path, { headers: { ...authHeaders() } }));

export const apiSend = async <T>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown
): Promise<T> =>
  parse<T>(
    await fetch(path, {
      method,
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  );

export interface UploadResult {
  url: string;
  kind: 'image' | 'video';
  mimeType: string;
  size: number;
  originalName: string;
}

/** Multipart upload. Returns the public URL the file is now served from. */
export const apiUpload = async (file: File): Promise<UploadResult> => {
  const form = new FormData();
  form.append('file', file);

  const response = await fetch('/api/uploads', {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form,
  });

  return parse<UploadResult>(response);
};
