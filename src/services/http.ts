import type { ApiOut } from '@/types/api';
import axios from 'axios';
import { authStore } from '@/store/auth';

export class BizError extends Error {
  code: number;

  constructor(message: string, code = 500) {
    super(message);
    this.name = 'BizError';
    this.code = code;
  }
}

const COMMON_ERROR_CODE_MAP: Record<number, string> = {
  400: '请求参数有误',
  401: '登录状态失效，请重新登录',
  403: '无权限执行此操作',
  404: '请求资源不存在',
  409: '数据状态冲突，请刷新后重试',
  429: '请求过于频繁，请稍后再试',
  500: '系统繁忙，请稍后重试'
};

export const unwrap = <T>(out: ApiOut<T>): T => {
  if (out.code !== 200) {
    throw new BizError(out.desc || '请求失败', out.code);
  }
  return out.data as T;
};

export const parseError = (error: unknown, fallback: string): string => {
  if (error instanceof BizError) {
    const mapped = COMMON_ERROR_CODE_MAP[error.code];
    if (mapped) {
      return mapped;
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};

export const isMockMode = (import.meta.env.VITE_API_MODE || 'mock').toLowerCase() !== 'api';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8092',
  timeout: 8000
});

const parseTimestamp = (value: unknown): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  const asNumber = Number(value);
  if (Number.isFinite(asNumber)) {
    return asNumber;
  }
  const asDate = new Date(String(value)).getTime();
  return Number.isFinite(asDate) ? asDate : undefined;
};

let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = async (): Promise<boolean> => {
  const session = authStore.getSession();
  if (!session?.refreshToken) {
    return false;
  }
  try {
    const out = (await client.post('/auth/refresh', { refreshToken: session.refreshToken })) as ApiOut<{
      userId: number;
      accessToken: string;
      refreshToken?: string;
      accessTokenExpiresAt?: unknown;
      refreshTokenExpiresAt?: unknown;
    }>;
    if (out.code !== 200 || !out.data?.accessToken) {
      authStore.clearSession();
      return false;
    }
    authStore.saveSession({
      userId: out.data.userId ?? session.userId,
      accessToken: out.data.accessToken,
      refreshToken: out.data.refreshToken || session.refreshToken,
      accessTokenExpiresAt: parseTimestamp(out.data.accessTokenExpiresAt),
      refreshTokenExpiresAt: parseTimestamp(out.data.refreshTokenExpiresAt)
    });
    return true;
  } catch (_error) {
    authStore.clearSession();
    return false;
  }
};

const ensureRefreshed = async (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

client.interceptors.request.use((config) => {
  const token = authStore.getSession()?.accessToken;
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers || {};
    config.headers.Authorization = token;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

const requestWithRefresh = async <T>(
  fn: () => Promise<ApiOut<T>>,
  retryOnNoLogin = true
): Promise<ApiOut<T>> => {
  const out = await fn();
  if (retryOnNoLogin && out.code === 401) {
    const refreshed = await ensureRefreshed();
    if (refreshed) {
      return await fn();
    }
  }
  return out;
};

const http = {
  get: async <T>(url: string, config?: { params?: Record<string, unknown> }) => {
    if (isMockMode) {
      throw new BizError('Mock模式下未启用网络请求');
    }
    return await requestWithRefresh<T>(() => client.get(url, config) as Promise<ApiOut<T>>);
  },
  post: async <T>(url: string, body?: unknown, config?: { params?: Record<string, unknown> }) => {
    if (isMockMode) {
      throw new BizError('Mock模式下未启用网络请求');
    }
    return await requestWithRefresh<T>(() => client.post(url, body, config) as Promise<ApiOut<T>>);
  }
};

export default http;
