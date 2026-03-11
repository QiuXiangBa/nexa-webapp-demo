const ACCESS_TOKEN_KEY = 'nexa_webapp_access_token';
const REFRESH_TOKEN_KEY = 'nexa_webapp_refresh_token';
const USER_ID_KEY = 'nexa_webapp_user_id';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'nexa_webapp_access_token_expires_at';
const REFRESH_TOKEN_EXPIRES_AT_KEY = 'nexa_webapp_refresh_token_expires_at';

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  userId?: number;
  accessTokenExpiresAt?: number;
  refreshTokenExpiresAt?: number;
}

const parseExpiresAt = (value: unknown): number | undefined => {
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

export const authStore = {
  getSession(): AuthSession | null {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) {
      return null;
    }
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
    const userIdRaw = localStorage.getItem(USER_ID_KEY);
    const userId = userIdRaw ? Number(userIdRaw) : undefined;
    const accessTokenExpiresAt = parseExpiresAt(localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY));
    const refreshTokenExpiresAt = parseExpiresAt(localStorage.getItem(REFRESH_TOKEN_EXPIRES_AT_KEY));
    return { accessToken, refreshToken, userId, accessTokenExpiresAt, refreshTokenExpiresAt };
  },

  saveSession(session: AuthSession): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    if (session.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    if (session.userId !== undefined) {
      localStorage.setItem(USER_ID_KEY, String(session.userId));
    } else {
      localStorage.removeItem(USER_ID_KEY);
    }
    const accessTokenExpiresAt = parseExpiresAt(session.accessTokenExpiresAt);
    const refreshTokenExpiresAt = parseExpiresAt(session.refreshTokenExpiresAt);
    if (accessTokenExpiresAt !== undefined) {
      localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(accessTokenExpiresAt));
    } else {
      localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
    }
    if (refreshTokenExpiresAt !== undefined) {
      localStorage.setItem(REFRESH_TOKEN_EXPIRES_AT_KEY, String(refreshTokenExpiresAt));
    } else {
      localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
    }
  },

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY);
  },

  isAccessTokenExpired(offsetMs = 5000): boolean {
    const session = this.getSession();
    if (!session?.accessTokenExpiresAt) {
      return false;
    }
    return Date.now() + offsetMs >= session.accessTokenExpiresAt;
  },

  isRefreshTokenExpired(offsetMs = 5000): boolean {
    const session = this.getSession();
    if (!session?.refreshTokenExpiresAt) {
      return false;
    }
    return Date.now() + offsetMs >= session.refreshTokenExpiresAt;
  }
};
