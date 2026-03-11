import { logout, refresh } from '@/services/auth';
import { isMockMode } from '@/services/http';
import { authStore } from '@/store/auth';

const toTimestamp = (value: unknown): number | undefined => {
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

// 应用启动/路由进入前统一做会话恢复：
// 1) access 未过期 -> 直接通过
// 2) access 过期但 refresh 可用 -> 自动刷新
// 3) refresh 失效 -> 清理会话
export const restoreSession = async (): Promise<boolean> => {
  if (isMockMode) {
    return true;
  }
  const session = authStore.getSession();
  if (!session?.accessToken) {
    return false;
  }
  if (authStore.isRefreshTokenExpired()) {
    authStore.clearSession();
    return false;
  }
  if (!authStore.isAccessTokenExpired()) {
    return true;
  }
  if (!session.refreshToken) {
    authStore.clearSession();
    return false;
  }

  try {
    const refreshed = await refresh({ refreshToken: session.refreshToken });
    authStore.saveSession({
      userId: refreshed.userId ?? session.userId,
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken || session.refreshToken,
      accessTokenExpiresAt: toTimestamp(refreshed.accessTokenExpiresAt),
      refreshTokenExpiresAt: toTimestamp(refreshed.refreshTokenExpiresAt)
    });
    return true;
  } catch (_error) {
    authStore.clearSession();
    return false;
  }
};

export const logoutSession = async (): Promise<void> => {
  const session = authStore.getSession();
  try {
    if (session && !isMockMode) {
      await logout({ accessToken: session.accessToken, refreshToken: session.refreshToken });
    }
  } finally {
    authStore.clearSession();
  }
};

