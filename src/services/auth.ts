import { BizError, isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { mockState, waitMock } from '@/services/mock-state';

export interface LoginResp {
  userId: number;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: number | string | Date;
  refreshTokenExpiresAt?: number | string | Date;
}

interface RegisterResp {
  userId: number;
}

interface LogoutResp {
  success: boolean;
}

interface RealnameResp {
  userId: number;
  realnameStatus: string;
}

export const register = async (_payload: { phone: string; password: string; inviterId?: number }): Promise<RegisterResp> => {
  if (isMockMode) {
    await waitMock();
    return { userId: mockState.user.userId };
  }
  return unwrap(await http.post<RegisterResp>('/auth/register', _payload));
};

export const login = async (_payload: { phone: string; password: string }): Promise<LoginResp> => {
  if (isMockMode) {
    await waitMock();
    return {
      userId: mockState.user.userId,
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      accessTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24,
      refreshTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
    };
  }
  return unwrap(await http.post<LoginResp>('/auth/login', _payload));
};

export const refresh = async (_payload: { refreshToken: string }): Promise<LoginResp> => {
  if (isMockMode) {
    await waitMock();
    return {
      userId: mockState.user.userId,
      accessToken: 'mock-access-token-refresh',
      refreshToken: 'mock-refresh-token',
      accessTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24,
      refreshTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
    };
  }
  return unwrap(await http.post<LoginResp>('/auth/refresh', _payload));
};

export const logout = async (_payload: { accessToken?: string; refreshToken?: string }): Promise<LogoutResp> => {
  if (isMockMode) {
    await waitMock();
    return { success: true };
  }
  return unwrap(await http.post<LogoutResp>('/auth/logout', _payload));
};

export const submitRealnameVerify = async (payload: { realName: string; idNo: string }): Promise<RealnameResp> => {
  if (!payload.realName || !payload.idNo) {
    throw new BizError('实名信息不完整');
  }
  if (!isMockMode) {
    return unwrap(await http.post<RealnameResp>('/users/me/realname', payload));
  }
  await waitMock();
  mockState.user.realnameStatus = 'PENDING';
  return {
    userId: mockState.user.userId,
    realnameStatus: mockState.user.realnameStatus
  };
};
