import { isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { mockState, waitMock } from '@/services/mock-state';

export interface WithdrawalRecord {
  id: number;
  assetId?: number;
  amount: string;
  status: string;
  statusDesc?: string;
  rejectReason?: string;
  reviewedAt?: number | string;
  paidAt?: number | string;
  createdAt?: number | string;
}

export interface SubmitWithdrawalResp {
  withdrawalId: number;
  status: string;
  assetId?: number;
}

export const submitWithdrawal = async (assetId: number, amount: string): Promise<SubmitWithdrawalResp> => {
  if (isMockMode) {
    await waitMock();
    mockState.seq.withdrawalId += 1;
    const item: WithdrawalRecord = {
      id: mockState.seq.withdrawalId,
      assetId,
      amount,
      status: 'PENDING_REVIEW',
      statusDesc: '待审核',
      createdAt: Date.now()
    };
    mockState.withdrawals.unshift(item);
    return { withdrawalId: item.id, status: item.status, assetId };
  }
  return unwrap(await http.post<SubmitWithdrawalResp>('/withdrawals', { assetId, amount }));
};

export const fetchMyWithdrawals = async (limit = 20): Promise<WithdrawalRecord[]> => {
  if (isMockMode) {
    await waitMock();
    return mockState.withdrawals.slice(0, limit).map((item) => ({ ...item }));
  }
  return unwrap(await http.get<WithdrawalRecord[]>('/withdrawals/me', { params: { limit } }));
};
