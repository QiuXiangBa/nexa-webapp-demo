import { isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { mockState, waitMock } from '@/services/mock-state';

export interface UserProfile {
  userId: number;
  phone: string;
  accountStatus: string;
  realnameStatus: string;
  inviterId?: number;
}

export const fetchMe = async (): Promise<UserProfile> => {
  if (isMockMode) {
    await waitMock();
    return { ...mockState.user };
  }
  return unwrap(await http.get<UserProfile>('/users/me'));
};
