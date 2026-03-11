import { isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { mockState, waitMock } from '@/services/mock-state';

export interface MerchantApplication {
  id: number;
  applicantUserId: number;
  merchantName: string;
  bizLicenseNo: string;
  status: string;
  merchantId?: number;
  reviewAuthenticityResult?: string;
  reviewQualificationResult?: string;
  reviewRiskLevel?: string;
  reviewComment?: string;
  rejectReason?: string;
  draftContractId?: number;
  createdAt?: number | string;
  reviewedAt?: number | string;
  joinedAt?: number | string;
}

export interface MerchantEntryGuide {
  statusCode: string;
  statusText: string;
  guideText: string;
}

export const submitMerchantApplication = async (payload: {
  merchantName: string;
  bizLicenseNo: string;
  contactName: string;
  contactPhone: string;
}): Promise<{ applicationId: number; status: string }> => {
  if (isMockMode) {
    await waitMock();
    mockState.seq.merchantApplicationId += 1;
    const createdAt = Date.now();
    const application = {
      id: mockState.seq.merchantApplicationId,
      applicantUserId: mockState.user.userId,
      merchantName: payload.merchantName,
      bizLicenseNo: payload.bizLicenseNo,
      status: 'PENDING',
      reviewAuthenticityResult: 'PENDING',
      reviewQualificationResult: 'PENDING',
      reviewRiskLevel: 'PENDING',
      reviewComment: '已提交，等待审核',
      createdAt
    };
    mockState.merchantApplications.unshift(application);
    return { applicationId: application.id, status: application.status };
  }
  return unwrap(await http.post<{ applicationId: number; status: string }>('/merchant/applications', payload));
};

export const fetchMyMerchantApplications = async (): Promise<MerchantApplication[]> => {
  if (isMockMode) {
    await waitMock();
    return [...mockState.merchantApplications];
  }
  return unwrap(await http.get<MerchantApplication[]>('/merchant/applications/me'));
};

export const pickLatestMerchantApplication = (rows: MerchantApplication[]): MerchantApplication | null => {
  if (!rows.length) {
    return null;
  }
  return [...rows].sort((a, b) => (b.id || 0) - (a.id || 0))[0] || null;
};

export const fetchMyLatestMerchantApplication = async (): Promise<MerchantApplication | null> => {
  const rows = await fetchMyMerchantApplications();
  return pickLatestMerchantApplication(rows);
};

export const toMerchantEntryGuide = (status?: string): MerchantEntryGuide => {
  switch (status) {
    case 'PENDING':
      return {
        statusCode: 'PENDING',
        statusText: '申请审核中',
        guideText: '资料已提交，等待平台审核。请在“商家申请页”查看进度。'
      };
    case 'APPROVED':
      return {
        statusCode: 'APPROVED',
        statusText: '已审核通过',
        guideText: '审核已通过，等待完成加入。请前往“商家申请页”查看后续状态。'
      };
    case 'JOINED':
      return {
        statusCode: 'JOINED',
        statusText: '已完成加入',
        guideText: '您已完成商家加入，可继续查看申请详情与关联信息。'
      };
    case 'REJECTED':
      return {
        statusCode: 'REJECTED',
        statusText: '申请已驳回',
        guideText: '请根据驳回原因修正资料后重新提交。'
      };
    default:
      return {
        statusCode: 'NONE',
        statusText: '未提交申请',
        guideText: '请前往“商家申请页”填写商家信息并提交申请。'
      };
  }
};
