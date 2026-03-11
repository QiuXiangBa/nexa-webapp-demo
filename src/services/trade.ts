import { isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { fetchAssetDetail } from '@/services/wallet';

export interface TradeAsset {
  assetId: number;
  assetCode: string;
  assetName: string;
  merchantId: number;
  merchantName: string;
  categoryCode: string;
  tradeMode: string;
  displayPrice: string;
}

export interface TradeAssetDetail {
  assetId: number;
  assetCode: string;
  assetName: string;
  merchantId: number;
  merchantName: string;
  categoryCode: string;
  tradeMode: string;
  displayPrice: string;
  orderId?: number;
  amount?: string;
  status?: string;
  generatedAt?: number | string;
}

const mockAssets: TradeAsset[] = [
  { assetId: 1, assetCode: 'M1_DEFAULT', assetName: '数字艺术藏品', merchantId: 101, merchantName: '星河艺术', categoryCode: 'ART', tradeMode: 'AUCTION', displayPrice: '999999999' },
  { assetId: 2, assetCode: 'M2_DEFAULT', assetName: '咖啡消费币', merchantId: 102, merchantName: '星巴克', categoryCode: 'FOOD', tradeMode: 'FIXED_PRICE', displayPrice: '999999999' },
  { assetId: 3, assetCode: 'M3_DEFAULT', assetName: '科技权益币', merchantId: 103, merchantName: '未来科技', categoryCode: 'TECH', tradeMode: 'FIXED_PRICE', displayPrice: '999999999' },
  { assetId: 4, assetCode: 'M4_DEFAULT', assetName: '生产积分币', merchantId: 104, merchantName: '智造工厂', categoryCode: 'PRODUCTION', tradeMode: 'AUCTION', displayPrice: '999999999' }
];

const toCategoryCode = (category: string): string => {
  switch (category) {
    case '艺术品':
      return 'ART';
    case '餐饮':
      return 'FOOD';
    case '科技':
      return 'TECH';
    case '生产':
      return 'PRODUCTION';
    default:
      return 'ALL';
  }
};

export const fetchTradeAssets = async (keyword = '', category = '全部', limit = 50): Promise<TradeAsset[]> => {
  if (isMockMode) {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const categoryCode = toCategoryCode(category);
    return mockAssets.filter((item) => {
      const matchCategory = categoryCode === 'ALL' || item.categoryCode === categoryCode;
      const matchKeyword = !normalizedKeyword
        || item.assetName.toLowerCase().includes(normalizedKeyword)
        || item.assetCode.toLowerCase().includes(normalizedKeyword)
        || item.merchantName.toLowerCase().includes(normalizedKeyword);
      return matchCategory && matchKeyword;
    }).slice(0, limit);
  }
  return unwrap(await http.get<TradeAsset[]>('/trade/assets', {
    params: { keyword, category, limit }
  }));
};

export const fetchTradeAssetDetail = async (assetId: number): Promise<TradeAssetDetail> => {
  const assets = await fetchTradeAssets('', '全部', 200);
  const tradeAsset = assets.find((item) => item.assetId === assetId);

  if (isMockMode) {
    return {
      assetId,
      assetCode: tradeAsset?.assetCode || `ASSET_${assetId}`,
      assetName: tradeAsset?.assetName || `数字资产-${assetId}`,
      merchantId: tradeAsset?.merchantId || 0,
      merchantName: tradeAsset?.merchantName || '未知商家',
      categoryCode: tradeAsset?.categoryCode || 'ALL',
      tradeMode: tradeAsset?.tradeMode || 'FIXED_PRICE',
      displayPrice: tradeAsset?.displayPrice || '0'
    };
  }

  const walletAssetDetail = await fetchAssetDetail(assetId);
  return {
    assetId,
    assetCode: tradeAsset?.assetCode || `ASSET_${assetId}`,
    assetName: tradeAsset?.assetName || `数字资产-${assetId}`,
    merchantId: tradeAsset?.merchantId || walletAssetDetail.merchantId,
    merchantName: tradeAsset?.merchantName || `商家${walletAssetDetail.merchantId}`,
    categoryCode: tradeAsset?.categoryCode || 'ALL',
    tradeMode: tradeAsset?.tradeMode || 'FIXED_PRICE',
    displayPrice: tradeAsset?.displayPrice || '0',
    orderId: walletAssetDetail.orderId,
    amount: walletAssetDetail.amount,
    status: walletAssetDetail.status,
    generatedAt: walletAssetDetail.generatedAt
  };
};
