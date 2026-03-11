import { BizError, isMockMode, unwrap } from '@/services/http';
import http from '@/services/http';
import { mockState, waitMock } from '@/services/mock-state';

export interface ContractRecord {
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

const buildDigest = (fullText: string): string => {
  const value = fullText.trim().slice(0, 8) || 'nexa';
  return `DIGEST-${value.toUpperCase()}`;
};

const findContract = (id: number): ContractRecord => {
  const item = mockState.contracts.find((record) => record.id === id);
  if (!item) {
    throw new BizError(`合约不存在: ${id}`);
  }
  return item;
};

export const createDraftContract = async (payload: { merchantId: number; fullText: string }): Promise<ContractRecord> => {
  if (isMockMode) {
    await waitMock();
    mockState.seq.contractId += 1;
    const item: ContractRecord = {
      id: mockState.seq.contractId,
      merchantId: payload.merchantId,
      contractNo: `NEXA-C-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${mockState.seq.contractId}`,
      status: 'DRAFT',
      paramDigest: buildDigest(payload.fullText),
      createdAt: Date.now()
    };
    mockState.contracts.unshift(item);
    return { ...item };
  }
  return unwrap(await http.post<ContractRecord>('/contracts', payload));
};

export const submitContract = async (id: number): Promise<ContractRecord> => {
  if (isMockMode) {
    await waitMock();
    const item = findContract(id);
    if (item.status !== 'DRAFT') {
      throw new BizError('仅草稿状态可提交');
    }
    item.status = 'TO_SIGN';
    return { ...item };
  }
  return unwrap(await http.post<ContractRecord>(`/contracts/${id}/submit`));
};

export const signContract = async (id: number): Promise<ContractRecord> => {
  if (isMockMode) {
    await waitMock();
    const item = findContract(id);
    if (item.status !== 'TO_SIGN') {
      throw new BizError('仅待签署状态可签署');
    }
    item.status = 'SIGNED';
    item.signedAt = Date.now();
    return { ...item };
  }
  return unwrap(await http.post<ContractRecord>(`/contracts/${id}/sign`));
};

export const notarizeContract = async (id: number): Promise<ContractRecord> => {
  if (isMockMode) {
    await waitMock();
    const item = findContract(id);
    if (item.status !== 'SIGNED') {
      throw new BizError('仅已签署状态可上链');
    }
    item.status = 'NOTARIZED';
    item.hashValue = `0xhash_demo_${id}`;
    item.chainTxHash = `0xtx_demo_${id}`;
    item.chainNotice = '链上哈希为模拟数据，正式版将接入真实链上存证';
    item.notarizedAt = Date.now();
    return { ...item };
  }
  return unwrap(await http.post<ContractRecord>(`/contracts/${id}/notarize`));
};

export const activateContract = async (id: number): Promise<ContractRecord> => {
  if (isMockMode) {
    await waitMock();
    const item = findContract(id);
    if (item.status !== 'NOTARIZED') {
      throw new BizError('仅已上链状态可生效');
    }
    item.status = 'EFFECTIVE';
    return { ...item };
  }
  return unwrap(await http.post<ContractRecord>(`/contracts/${id}/activate`));
};

export const fetchContractDetail = async (id: number): Promise<ContractRecord> => {
  if (isMockMode) {
    await waitMock();
    return { ...findContract(id) };
  }
  return unwrap(await http.get<ContractRecord>(`/contracts/${id}`));
};

export const fetchContracts = async (merchantId: number, limit = 20): Promise<ContractRecord[]> => {
  if (isMockMode) {
    await waitMock();
    return mockState.contracts.filter((item) => item.merchantId === merchantId).slice(0, limit).map((item) => ({ ...item }));
  }
  return unwrap(await http.get<ContractRecord[]>('/contracts', { params: { merchantId, limit } }));
};
