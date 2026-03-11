import { BizError, isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { mockState, waitMock } from '@/services/mock-state';

export interface WalletOverview {
  userId: number;
  quoteCurrency: string;
  pricingMethod: string;
  assetCount: number;
  totalBalance: string;
  availableBalance: string;
  frozenBalance: string;
  snapshotAt?: number | string;
}

export interface WalletBalance {
  userId: number;
  totalBalance: string;
  availableBalance: string;
  frozenBalance: string;
}

export interface WalletAssetHolding {
  walletAssetId: number;
  userId: number;
  assetId: number;
  assetCode: string;
  assetName: string;
  assetPrecision: number;
  totalBalance: string;
  availableBalance: string;
  frozenBalance: string;
  updatedAt?: number | string;
}

export interface PageResult<T> {
  pageNo: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  records: T[];
}

export interface AssetLedger {
  id: number;
  userId?: number;
  assetId?: number;
  assetCode?: string;
  assetName?: string;
  bizType: string;
  bizId: number;
  delta: string;
  balanceAfter: string;
  createdAt?: number | string;
}

export interface AssetDetail {
  assetId: number;
  orderId: number;
  merchantId: number;
  amount: string;
  status: string;
  generatedAt?: number | string;
}

export const fetchWalletOverview = async (): Promise<WalletOverview> => {
  if (isMockMode) {
    await waitMock();
    return {
      userId: mockState.wallet.userId,
      quoteCurrency: 'CNY',
      pricingMethod: 'PAR_1_1',
      assetCount: mockState.walletAssets.length,
      totalBalance: mockState.wallet.totalBalance,
      availableBalance: mockState.wallet.availableBalance,
      frozenBalance: mockState.wallet.frozenBalance,
      snapshotAt: Date.now()
    };
  }
  return unwrap(await http.get<WalletOverview>('/wallets/me/overview'));
};

export const fetchWalletBalance = async (): Promise<WalletBalance> => {
  const overview = await fetchWalletOverview();
  return {
    userId: overview.userId,
    totalBalance: overview.totalBalance,
    availableBalance: overview.availableBalance,
    frozenBalance: overview.frozenBalance
  };
};

export const fetchWalletAssets = async (pageNo = 1, pageSize = 20): Promise<PageResult<WalletAssetHolding>> => {
  if (isMockMode) {
    await waitMock();
    const start = (pageNo - 1) * pageSize;
    const records = mockState.walletAssets.slice(start, start + pageSize).map((item) => ({ ...item }));
    return {
      pageNo,
      pageSize,
      total: mockState.walletAssets.length,
      hasMore: start + pageSize < mockState.walletAssets.length,
      records
    };
  }
  return unwrap(await http.get<PageResult<WalletAssetHolding>>('/wallets/me/assets', { params: { pageNo, pageSize } }));
};

export const fetchAssetLedger = async (limit = 20): Promise<AssetLedger[]> => {
  if (isMockMode) {
    await waitMock();
    return mockState.ledger.slice(0, limit).map((item) => ({ ...item }));
  }
  const page = unwrap(
    await http.get<PageResult<AssetLedger>>('/wallets/me/asset-ledgers', {
      params: { pageNo: 1, pageSize: limit }
    })
  );
  return page.records || [];
};

export const fetchAssetLedgerByAssetId = async (assetId: number, limit = 30): Promise<AssetLedger[]> => {
  if (isMockMode) {
    await waitMock();
    return mockState.ledger.filter((item) => item.assetId === assetId).slice(0, limit).map((item) => ({ ...item }));
  }
  const page = unwrap(
    await http.get<PageResult<AssetLedger>>('/wallets/me/asset-ledgers', {
      params: { assetId, pageNo: 1, pageSize: limit }
    })
  );
  return page.records || [];
};

export const fetchAssetDetail = async (assetId: number): Promise<AssetDetail> => {
  if (isMockMode) {
    await waitMock();
    const detail = mockState.assets.find((item) => item.assetId === assetId);
    if (!detail) {
      throw new BizError(`未找到资产 ${assetId}`);
    }
    return { ...detail };
  }
  return unwrap(await http.get<AssetDetail>(`/assets/${assetId}`));
};
