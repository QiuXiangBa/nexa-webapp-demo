import { isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';

export interface MerchantMapMerchant {
  merchantId: number;
  merchantName: string;
  riskLevel?: string;
  issueRulePermission?: string;
  assetId: number;
  assetCode?: string;
  assetName?: string;
}

const mockMerchants: MerchantMapMerchant[] = [
  { merchantId: 1, merchantName: '外婆家', issueRulePermission: 'ENABLED', assetId: 101, assetCode: 'M1_DEFAULT', assetName: '餐饮积分币' },
  { merchantId: 2, merchantName: '壹品奶茶', issueRulePermission: 'ENABLED', assetId: 102, assetCode: 'M2_DEFAULT', assetName: '奶茶积分币' },
  { merchantId: 3, merchantName: '清心雅舍', issueRulePermission: 'ENABLED', assetId: 103, assetCode: 'M3_DEFAULT', assetName: '茶饮权益币' },
  { merchantId: 4, merchantName: '时光酒吧', issueRulePermission: 'ENABLED', assetId: 104, assetCode: 'M4_DEFAULT', assetName: '酒吧消费币' },
  { merchantId: 5, merchantName: '星巴克', issueRulePermission: 'ENABLED', assetId: 105, assetCode: 'M5_DEFAULT', assetName: '咖啡消费币' },
  { merchantId: 6, merchantName: '7-11便利店', issueRulePermission: 'ENABLED', assetId: 106, assetCode: 'M6_DEFAULT', assetName: '便利店积分币' },
  { merchantId: 7, merchantName: '麦当劳', issueRulePermission: 'ENABLED', assetId: 107, assetCode: 'M7_DEFAULT', assetName: '快餐权益币' }
];

export const fetchMerchantMapMerchants = async (keyword = '', limit = 50): Promise<MerchantMapMerchant[]> => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (isMockMode) {
    return mockMerchants.filter((item) => {
      if (!normalizedKeyword) {
        return true;
      }
      return (
        item.merchantName.toLowerCase().includes(normalizedKeyword)
        || (item.assetName || '').toLowerCase().includes(normalizedKeyword)
        || (item.assetCode || '').toLowerCase().includes(normalizedKeyword)
      );
    }).slice(0, limit);
  }
  return unwrap(await http.get<MerchantMapMerchant[]>('/merchant/map/merchants', { params: { keyword, limit } }));
};

