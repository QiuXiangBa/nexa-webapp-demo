export interface MockUserProfile {
  userId: number;
  phone: string;
  accountStatus: string;
  realnameStatus: string;
  inviterId?: number;
}

export interface MockWalletBalance {
  userId: number;
  totalBalance: string;
  availableBalance: string;
  frozenBalance: string;
}

export interface MockWalletAssetHolding {
  walletAssetId: number;
  userId: number;
  assetId: number;
  assetCode: string;
  assetName: string;
  assetPrecision: number;
  totalBalance: string;
  availableBalance: string;
  frozenBalance: string;
  updatedAt: number | string;
}

export interface MockAssetLedger {
  id: number;
  assetId?: number;
  assetCode?: string;
  assetName?: string;
  bizType: string;
  bizId: number;
  delta: string;
  balanceAfter: string;
  createdAt: number | string;
}

export interface MockAssetDetail {
  assetId: number;
  orderId: number;
  merchantId: number;
  amount: string;
  status: string;
  generatedAt: number | string;
}

export interface MockRebateRecord {
  id: number;
  orderId: number;
  inviteeId: number;
  rebateAmount: string;
  status: string;
  settledAt: number | string;
}

export interface MockWithdrawalRecord {
  id: number;
  assetId?: number;
  amount: string;
  status: string;
  rejectReason?: string;
  reviewedAt?: number | string;
  paidAt?: number | string;
  createdAt?: number | string;
}

export interface MockMerchantApplication {
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
  createdAt: number | string;
  reviewedAt?: number | string;
  joinedAt?: number | string;
}

export interface MockContractRecord {
  id: number;
  merchantId: number;
  contractNo: string;
  status: string;
  paramDigest: string;
  signedAt?: number | string;
  hashValue?: string;
  chainTxHash?: string;
  chainNotice?: string;
  notarizedAt?: number | string;
  createdAt?: number | string;
}

const now = Date.now();

export const mockState = {
  user: {
    userId: 10001,
    phone: '13800138000',
    accountStatus: 'ACTIVE',
    realnameStatus: 'UNVERIFIED',
    inviterId: 9001
  } as MockUserProfile,
  wallet: {
    userId: 10001,
    totalBalance: '2688.500000',
    availableBalance: '2528.500000',
    frozenBalance: '160.000000'
  } as MockWalletBalance,
  walletAssets: [
    {
      walletAssetId: 1,
      userId: 10001,
      assetId: 1,
      assetCode: 'NEXA_COFFEE',
      assetName: '咖啡积分币',
      assetPrecision: 6,
      totalBalance: '1888.500000',
      availableBalance: '1788.500000',
      frozenBalance: '100.000000',
      updatedAt: now - 1000 * 60 * 30
    },
    {
      walletAssetId: 2,
      userId: 10001,
      assetId: 2,
      assetCode: 'NEXA_FIT',
      assetName: '运动权益币',
      assetPrecision: 6,
      totalBalance: '800.000000',
      availableBalance: '740.000000',
      frozenBalance: '60.000000',
      updatedAt: now - 1000 * 60 * 20
    }
  ] as MockWalletAssetHolding[],
  assets: [
    {
      assetId: 1,
      orderId: 20001,
      merchantId: 30001,
      amount: '88.500000',
      status: 'AVAILABLE',
      generatedAt: now - 1000 * 60 * 60 * 24
    },
    {
      assetId: 2,
      orderId: 20002,
      merchantId: 30002,
      amount: '120.000000',
      status: 'AVAILABLE',
      generatedAt: now - 1000 * 60 * 60 * 12
    }
  ] as MockAssetDetail[],
  ledger: [
    {
      id: 1,
      assetId: 1,
      assetCode: 'NEXA_COFFEE',
      assetName: '咖啡积分币',
      bizType: 'CONSUME_ORDER',
      bizId: 20001,
      delta: '+88.500000',
      balanceAfter: '2488.500000',
      createdAt: now - 1000 * 60 * 60 * 24
    },
    {
      id: 2,
      assetId: 2,
      assetCode: 'NEXA_FIT',
      assetName: '运动权益币',
      bizType: 'REBATE',
      bizId: 50001,
      delta: '+40.000000',
      balanceAfter: '2528.500000',
      createdAt: now - 1000 * 60 * 60 * 20
    }
  ] as MockAssetLedger[],
  rebates: [
    {
      id: 50001,
      orderId: 20003,
      inviteeId: 10002,
      rebateAmount: '40.000000',
      status: 'SETTLED',
      settledAt: now - 1000 * 60 * 60 * 20
    }
  ] as MockRebateRecord[],
  withdrawals: [
    {
      id: 70001,
      assetId: 1,
      amount: '120.000000',
      status: 'COMPLETED',
      reviewedAt: now - 1000 * 60 * 60 * 72,
      paidAt: now - 1000 * 60 * 60 * 70,
      createdAt: now - 1000 * 60 * 60 * 75
    },
    {
      id: 70002,
      assetId: 2,
      amount: '60.000000',
      status: 'PENDING_REVIEW',
      createdAt: now - 1000 * 60 * 60 * 3
    }
  ] as MockWithdrawalRecord[],
  merchantApplications: [
    {
      id: 80001,
      applicantUserId: 10001,
      merchantName: 'Nexa Coffee',
      bizLicenseNo: 'LIC-NEXA-001',
      status: 'APPROVED',
      merchantId: 30001,
      reviewAuthenticityResult: 'APPROVED',
      reviewQualificationResult: 'APPROVED',
      reviewRiskLevel: 'LOW',
      reviewComment: '资料齐全，允许加入',
      draftContractId: 90001,
      createdAt: now - 1000 * 60 * 60 * 96,
      reviewedAt: now - 1000 * 60 * 60 * 90,
      joinedAt: now - 1000 * 60 * 60 * 88
    }
  ] as MockMerchantApplication[],
  contracts: [
    {
      id: 90001,
      merchantId: 30001,
      contractNo: 'NEXA-C-20260225-001',
      status: 'NOTARIZED',
      paramDigest: 'DIGEST-8f3a11',
      signedAt: now - 1000 * 60 * 60 * 84,
      hashValue: '0xhash_demo_90001',
      chainTxHash: '0xtx_demo_90001',
      chainNotice: '模拟上链成功，等待生效',
      notarizedAt: now - 1000 * 60 * 60 * 80,
      createdAt: now - 1000 * 60 * 60 * 86
    }
  ] as MockContractRecord[],
  seq: {
    merchantApplicationId: 81000,
    contractId: 91000,
    withdrawalId: 71000,
    rebateId: 51000,
    ledgerId: 10
  }
};

export const waitMock = async (ms = 160): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
