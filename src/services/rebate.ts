import { isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { mockState, waitMock } from '@/services/mock-state';

export interface RebateRecord {
  id: number;
  orderId: number;
  inviteeId: number;
  rebateAmount: string;
  status: string;
  settledAt?: number | string;
}

export const fetchMyRebates = async (limit = 20): Promise<RebateRecord[]> => {
  if (isMockMode) {
    await waitMock();
    return mockState.rebates.slice(0, limit);
  }
  return unwrap(await http.get<RebateRecord[]>('/rebates/me', { params: { limit } }));
};
