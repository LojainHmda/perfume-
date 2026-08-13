import { apiGet, apiSend, setToken } from './client';

interface LoginResponse {
  token: string;
  expiresAt: number;
  username: string;
}

export const loginRequest = async (username: string, password: string): Promise<LoginResponse> => {
  const result = await apiSend<LoginResponse>('POST', '/api/admin/login', { username, password });
  setToken(result.token);
  return result;
};

export const sessionRequest = () =>
  apiGet<{ username: string; expiresAt: number }>('/api/admin/session');

export const logoutRequest = async (): Promise<void> => {
  try {
    await apiSend('POST', '/api/admin/logout');
  } finally {
    setToken(null);
  }
};
