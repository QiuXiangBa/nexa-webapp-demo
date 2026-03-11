const STATUS_MAP: Record<string, string> = {
  NORMAL: '正常',
  ACTIVE: '启用',
  DISABLED: '禁用',
  UNVERIFIED: '未实名',
  PENDING: '待审核',
  APPROVED: '已通过',
  REJECTED: '已驳回',
  JOINED: '已加入',
  AVAILABLE: '可用',
  SETTLED: '已结算',
  PENDING_REVIEW: '待审核',
  PENDING_PAYOUT: '待打款',
  COMPLETED: '已完成',
  DRAFT: '草稿',
  TO_SIGN: '待签署',
  SIGNED: '已签署',
  NOTARIZED: '已上链',
  EFFECTIVE: '已生效'
};

const pad = (value: number): string => String(value).padStart(2, '0');

export const formatStatus = (status?: string | null): string => {
  if (!status) {
    return '-';
  }
  return STATUS_MAP[status] || status;
};

export const formatTime = (value?: number | string | null): string => {
  if (value === undefined || value === null || value === '') {
    return '-';
  }
  let ts: number;
  if (typeof value === 'number') {
    ts = value;
  } else if (/^\d+$/.test(value)) {
    ts = Number(value);
  } else {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return '-';
    }
    ts = parsed;
  }

  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};
