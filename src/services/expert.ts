import { BizError, isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { waitMock } from '@/services/mock-state';

interface MockExpertApplication {
  applicationId: number;
  applicantUserId: number;
  realName: string;
  idNo: string;
  status: string;
  rejectReason?: string;
  createdAt: number;
  updatedAt: number;
}

let mockExpertAppSeq = 12000;
let mockLatestExpertApplication: MockExpertApplication | null = null;

export interface ExpertApplicationStatus {
  applicationId: number;
  applicantUserId: number;
  realName: string;
  idNo: string;
  status: string;
  rejectReason?: string;
  createdAt?: number | string;
  updatedAt?: number | string;
}

export const submitExpertApplication = async (payload: { realName: string; idNo: string }): Promise<{ applicationId: number; status: string }> => {
  if (!payload.realName || !payload.idNo) {
    throw new BizError('达人申请信息不完整');
  }

  if (isMockMode) {
    await waitMock();
    const now = Date.now();
    mockExpertAppSeq += 1;
    mockLatestExpertApplication = {
      applicationId: mockExpertAppSeq,
      applicantUserId: 10001,
      realName: payload.realName,
      idNo: payload.idNo,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now
    };
    return { applicationId: mockLatestExpertApplication.applicationId, status: mockLatestExpertApplication.status };
  }

  return unwrap(await http.post<{ applicationId: number; status: string }>('/experts/applications', payload));
};

export const fetchMyLatestExpertApplication = async (): Promise<ExpertApplicationStatus | null> => {
  if (isMockMode) {
    await waitMock();
    if (!mockLatestExpertApplication) {
      return null;
    }
    return { ...mockLatestExpertApplication };
  }

  const result = unwrap(await http.get<ExpertApplicationStatus | null>('/experts/applications/me/latest'));
  return result || null;
};
