<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';
import {
  activateContract,
  createDraftContract,
  fetchContractDetail,
  fetchContracts,
  notarizeContract,
  signContract,
  submitContract,
  type ContractRecord
} from '@/services/contract';
import { formatStatus, formatTime } from '@/utils/format';
import { parseError } from '@/services/http';
import { fetchMyLatestMerchantApplication } from '@/services/merchant';

const router = useRouter();
const merchantId = ref<number>();
const loading = ref(false);
const loadError = ref('');
const creating = ref(false);
const detailOpen = ref(false);
const rows = ref<ContractRecord[]>([]);
const detail = ref<ContractRecord | null>(null);
const form = reactive({ merchantIdText: '', fullText: '' });
const merchantGuide = ref('请输入 merchant_id 查询合约列表');

const refreshMerchantContext = async () => {
  try {
    const latest = await fetchMyLatestMerchantApplication();
    if (!latest) {
      merchantGuide.value = '尚未提交商家申请，请先前往商家申请页。';
      return;
    }
    if (latest.merchantId) {
      merchantId.value = latest.merchantId;
      form.merchantIdText = String(latest.merchantId);
      merchantGuide.value = `已识别商家ID：${latest.merchantId}，可直接创建与查询合约。`;
      return;
    }
    if (latest.status === 'PENDING') {
      merchantGuide.value = '商家申请审核中，暂不可创建合约。';
    } else if (latest.status === 'APPROVED') {
      merchantGuide.value = '商家申请已通过，等待完成加入后可创建合约。';
    } else if (latest.status === 'REJECTED') {
      merchantGuide.value = '商家申请已驳回，请修正后重新提交。';
    } else {
      merchantGuide.value = '当前商家状态暂不可创建合约，请先完成商家申请流程。';
    }
  } catch (error) {
    merchantGuide.value = `商家状态加载失败：${parseError(error, '请稍后重试')}`;
  }
};

const load = async () => {
  if (!merchantId.value) {
    message.warning('请先确认 merchant_id');
    return;
  }
  loading.value = true;
  loadError.value = '';
  try {
    rows.value = await fetchContracts(merchantId.value, 30);
  } catch (error) {
    loadError.value = parseError(error, '加载合约列表失败');
    message.error(loadError.value);
  } finally {
    loading.value = false;
  }
};

const create = async () => {
  const merchantIdNumber = Number(form.merchantIdText);
  if (!Number.isFinite(merchantIdNumber) || merchantIdNumber <= 0 || !form.fullText.trim()) {
    message.warning('请填写 merchant_id 与合约全文');
    return;
  }
  creating.value = true;
  try {
    await createDraftContract({ merchantId: merchantIdNumber, fullText: form.fullText });
    message.success('草案创建成功');
    merchantId.value = merchantIdNumber;
    form.fullText = '';
    await load();
  } catch (error) {
    message.error(parseError(error, '创建草案失败'));
  } finally {
    creating.value = false;
  }
};

const openDetail = async (id: number) => {
  try {
    detail.value = await fetchContractDetail(id);
    detailOpen.value = true;
  } catch (error) {
    message.error(parseError(error, '查询详情失败'));
  }
};

const flow = async (id: number, action: 'submit' | 'sign' | 'notarize' | 'activate') => {
  try {
    if (action === 'submit') await submitContract(id);
    if (action === 'sign') await signContract(id);
    if (action === 'notarize') await notarizeContract(id);
    if (action === 'activate') await activateContract(id);
    const actionMap: Record<typeof action, string> = {
      submit: '提交成功',
      sign: '签署成功',
      notarize: '上链成功',
      activate: '生效成功'
    };
    message.success(actionMap[action]);
    await load();
  } catch (error) {
    message.error(parseError(error, '操作失败'));
  }
};

onMounted(() => {
  void refreshMerchantContext().then(() => {
    if (merchantId.value) {
      void load();
    }
  });
});
</script>

<template>
  <div class="contract-section">
    <div class="tip-card">
      <div class="tip-title">合约流程指引</div>
      <div class="tip-desc">{{ merchantGuide }}</div>
    </div>

    <div v-if="loadError" class="tip-card tip-error">
      <div class="tip-title">合约列表加载失败</div>
      <div class="tip-desc">{{ loadError }}</div>
    </div>

    <section class="panel">
      <h3 class="panel-title">草案合约创建</h3>
      <van-field v-model="form.merchantIdText" type="digit" label="merchant_id" placeholder="请输入商家ID" />
      <van-field v-model="form.fullText" type="textarea" rows="6" autosize label="合约全文" placeholder="请输入合约全文" />
      <div class="panel-actions">
        <van-button type="primary" :loading="creating" @click="create">创建草案</van-button>
        <van-button v-if="!merchantId" plain type="primary" @click="router.push('/merchant-apply')">前往商家申请</van-button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <span>合约列表</span>
        <div class="panel-query">
          <van-field v-model="form.merchantIdText" type="digit" placeholder="merchant_id" />
          <van-button size="small" type="primary" @click="merchantId = Number(form.merchantIdText) || undefined; load()">查询</van-button>
        </div>
      </div>

      <div v-if="loading" class="panel-loading">
        <van-loading size="20px" vertical>加载中...</van-loading>
      </div>
      <van-empty v-else-if="!rows.length" description="暂无合约记录，请先创建草案或检查商家状态" />
      <div v-else class="contract-list">
        <div v-for="row in rows" :key="row.id" class="contract-item">
          <div class="contract-main">{{ row.contractNo }}</div>
          <div class="contract-sub">状态：{{ formatStatus(row.status) }}</div>
          <div class="contract-sub">参数摘要：{{ row.paramDigest || '-' }}</div>
          <div class="contract-sub">创建时间：{{ formatTime(row.createdAt) }}</div>
          <div class="contract-actions">
            <van-button size="mini" type="primary" plain @click="openDetail(row.id)">详情</van-button>
            <van-button size="mini" type="primary" plain :disabled="row.status !== 'DRAFT'" @click="flow(row.id, 'submit')">提交</van-button>
            <van-button size="mini" type="primary" plain :disabled="row.status !== 'TO_SIGN'" @click="flow(row.id, 'sign')">签署</van-button>
            <van-button size="mini" type="primary" plain :disabled="row.status !== 'SIGNED'" @click="flow(row.id, 'notarize')">上链</van-button>
            <van-button size="mini" type="primary" plain :disabled="row.status !== 'NOTARIZED'" @click="flow(row.id, 'activate')">生效</van-button>
          </div>
        </div>
      </div>
    </section>

    <van-popup v-model:show="detailOpen" position="bottom" round :style="{ height: '80%' }">
      <div class="drawer-body">
        <h3 class="drawer-title">合约详情</h3>
        <van-cell-group inset>
          <van-cell title="ID" :value="String(detail?.id ?? '-')" />
          <van-cell title="merchant_id" :value="String(detail?.merchantId ?? '-')" />
          <van-cell title="合约编号" :value="detail?.contractNo ?? '-'" />
          <van-cell title="状态" :value="formatStatus(detail?.status)" />
          <van-cell title="参数摘要" :value="detail?.paramDigest || '-'" />
          <van-cell title="合约哈希" :value="detail?.hashValue || '-'" />
          <van-cell title="链上交易Hash" :value="detail?.chainTxHash || '-'" />
          <van-cell title="链路说明" :value="detail?.chainNotice || '-'" />
          <van-cell title="签署时间" :value="formatTime(detail?.signedAt)" />
          <van-cell title="上链时间" :value="formatTime(detail?.notarizedAt)" />
          <van-cell title="创建时间" :value="formatTime(detail?.createdAt)" />
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
.contract-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-card {
  border-radius: 10px;
  background: #eaf6ff;
  border: 1px solid #b5ddff;
  padding: 10px 12px;
}

.tip-error {
  background: #fff1f0;
  border-color: #ffccc7;
}

.tip-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.tip-desc {
  margin-top: 4px;
  font-size: 12px;
  color: #475569;
}

.panel {
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.panel-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.panel-actions {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.panel-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-query {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-query :deep(.van-field) {
  flex: 1;
}

.panel-loading {
  padding: 18px 0;
}

.contract-list {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contract-item {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  background: #fff;
}

.contract-main {
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
}

.contract-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.contract-actions {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.drawer-body {
  padding: 12px;
}

.drawer-title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 700;
}
</style>
