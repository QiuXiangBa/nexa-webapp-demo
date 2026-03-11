import { isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { waitMock } from '@/services/mock-state';

export interface HomeTrendPoint {
  date: string;
  value: string;
}

export interface HomeDistributionItem {
  name: string;
  value: string;
  percent: number;
  color: string;
}

export interface HomeListItem {
  merchantName: string;
  amount: string;
  time?: number;
}

export interface HomeIncomeSection {
  amount: string;
  monthLabel: string;
  trendPoints: HomeTrendPoint[];
  distItems: HomeDistributionItem[];
  distOptions: string[];
  listItems: HomeListItem[];
}

export interface HomeOverview {
  consumer: HomeIncomeSection;
  zspace: HomeIncomeSection;
}

const sampleDates = (totalDays: number, points: number): { date: string; idx: number }[] => {
  const today = new Date();
  return Array.from({ length: points }, (_, i) => {
    const daysAgo = Math.round((totalDays - 1) * (1 - i / (points - 1)));
    const d = new Date(today);
    d.setDate(today.getDate() - daysAgo);
    return { date: `${d.getMonth() + 1}/${d.getDate()}`, idx: i };
  });
};

const mockOverview: HomeOverview = {
  consumer: {
    amount: '999999.9',
    monthLabel: '',
    trendPoints: sampleDates(7, 7).map(({ date, idx }) => ({ date, value: String((1 + idx * 0.3).toFixed(1)) })),
    distOptions: ['消费类型', '消费地区'],
    distItems: [
      { name: '饮食', value: '1000诺', percent: 52, color: '#1677ff' },
      { name: '娱乐', value: '600诺', percent: 18, color: '#45b7ff' },
      { name: '交通', value: '400诺', percent: 28, color: '#d9dee8' }
    ],
    listItems: [
      { merchantName: '外婆家', amount: '0.5', time: Date.now() - 15 * 60 * 1000 },
      { merchantName: '7-11', amount: '0.5', time: Date.now() - 45 * 60 * 1000 },
      { merchantName: '麦当劳', amount: '0.5', time: Date.now() - 90 * 60 * 1000 },
      { merchantName: '星巴克', amount: '0.5', time: Date.now() - 3 * 60 * 60 * 1000 },
      { merchantName: '肯德基', amount: '0.5', time: Date.now() - 4 * 60 * 60 * 1000 },
      { merchantName: '必胜客', amount: '0.5', time: Date.now() - 5 * 60 * 60 * 1000 }
    ]
  },
  zspace: {
    amount: '999999.9',
    monthLabel: '',
    trendPoints: sampleDates(7, 7).map(({ date, idx }) => ({ date, value: String((0.8 + idx * 0.25).toFixed(1)) })),
    distOptions: ['地区分布', '性别分布', '消费分布'],
    distItems: [
      { name: '杭州香', value: '1000诺', percent: 52, color: '#1677ff' },
      { name: '上海香', value: '600诺', percent: 18, color: '#45b7ff' },
      { name: '深圳香', value: '400诺', percent: 28, color: '#d9dee8' }
    ],
    listItems: [
      { merchantName: '周ID', amount: '0.5诺', time: Date.now() - 20 * 60 * 1000 },
      { merchantName: '商家名称', amount: '0.5诺', time: Date.now() - 60 * 60 * 1000 },
      { merchantName: '中证数字', amount: '0.5诺', time: Date.now() - 2 * 60 * 60 * 1000 },
      { merchantName: '中证科技', amount: '0.4诺', time: Date.now() - 3 * 60 * 60 * 1000 },
      { merchantName: '中证金融', amount: '0.3诺', time: Date.now() - 4 * 60 * 60 * 1000 },
      { merchantName: '中证传媒', amount: '0.2诺', time: Date.now() - 5 * 60 * 60 * 1000 }
    ]
  }
};

export const fetchHomeOverview = async (days = 7, top = 3): Promise<HomeOverview> => {
  if (isMockMode) {
    await waitMock();
    return JSON.parse(JSON.stringify(mockOverview)) as HomeOverview;
  }
  return unwrap(await http.get<HomeOverview>('/home/overview', { params: { days, top } }));
};

// 从今天往前 totalDays 天，按 points 个等间距采样，返回 [日期, 索引] 数组
const POINTS = 7;

const mockTrendPoints: Record<string, Record<number, HomeTrendPoint[]>> = {
  consumer: {
    7: sampleDates(7, POINTS).map(({ date, idx }) => ({
      date, value: String((1 + idx * 0.3).toFixed(1))
    })),
    30: sampleDates(30, POINTS).map(({ date, idx }) => ({
      date, value: String((1 + Math.sin(idx / 2) * 0.8 + idx * 0.3).toFixed(2))
    })),
    90: sampleDates(90, POINTS).map(({ date, idx }) => ({
      date, value: String((1 + Math.sin(idx / 2) * 1.5 + idx * 0.3).toFixed(2))
    }))
  },
  zspace: {
    7: sampleDates(7, POINTS).map(({ date, idx }) => ({
      date, value: String((0.8 + idx * 0.25).toFixed(1))
    })),
    30: sampleDates(30, POINTS).map(({ date, idx }) => ({
      date, value: String((0.8 + Math.cos(idx / 2) * 0.6 + idx * 0.25).toFixed(2))
    })),
    90: sampleDates(90, POINTS).map(({ date, idx }) => ({
      date, value: String((0.8 + Math.cos(idx / 2) * 1.2 + idx * 0.25).toFixed(2))
    }))
  }
};

export const fetchTrendPoints = async (
  type: 'consumer' | 'zspace',
  period: 7 | 30 | 90
): Promise<HomeTrendPoint[]> => {
  if (isMockMode) {
    await waitMock();
    return JSON.parse(JSON.stringify(mockTrendPoints[type][period])) as HomeTrendPoint[];
  }
  return unwrap(await http.get<HomeTrendPoint[]>('/home/trend', { params: { type, days: period } }));
};

const mockDistItems: Record<string, Record<string, HomeDistributionItem[]>> = {
  consumer: {
    消费类型: [
      { name: '饮食', value: '1000诺', percent: 52, color: '#1677ff' },
      { name: '娱乐', value: '600诺', percent: 20, color: '#45b7ff' },
      { name: '交通', value: '400诺', percent: 28, color: '#d9dee8' }
    ],
    消费地区: [
      { name: '华东', value: '1200诺', percent: 48, color: '#1677ff' },
      { name: '华南', value: '700诺', percent: 28, color: '#45b7ff' },
      { name: '其他', value: '600诺', percent: 24, color: '#d9dee8' }
    ]
  },
  zspace: {
    地区分布: [
      { name: '杭州', value: '1000诺', percent: 52, color: '#1677ff' },
      { name: '上海', value: '600诺', percent: 18, color: '#45b7ff' },
      { name: '深圳', value: '400诺', percent: 28, color: '#d9dee8' }
    ],
    性别分布: [
      { name: '男', value: '1400诺', percent: 56, color: '#1677ff' },
      { name: '女', value: '1100诺', percent: 44, color: '#45b7ff' }
    ],
    消费分布: [
      { name: '餐饮', value: '900诺', percent: 36, color: '#1677ff' },
      { name: '零售', value: '800诺', percent: 32, color: '#45b7ff' },
      { name: '其他', value: '800诺', percent: 32, color: '#d9dee8' }
    ]
  }
};

export const fetchDistItems = async (
  type: 'consumer' | 'zspace',
  tab: string
): Promise<HomeDistributionItem[]> => {
  if (isMockMode) {
    await waitMock();
    return JSON.parse(JSON.stringify(mockDistItems[type][tab] || [])) as HomeDistributionItem[];
  }
  return unwrap(await http.get<HomeDistributionItem[]>('/home/distribution', { params: { type, tab } }));
};
