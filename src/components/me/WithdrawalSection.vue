<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { message } from '@/utils/message';
import { fetchWalletAssets, type WalletAssetHolding } from '@/services/wallet';
import { fetchMyWithdrawals, submitWithdrawal, type WithdrawalRecord } from '@/services/withdrawal';
import { formatStatus, formatTime } from '@/utils/format';
import { parseError } from '@/services/http';
import { trackAction } from '@/services/telemetry';

const loading = ref(false);
const loadError = ref('');
const submitting = ref(false);
const rows = ref<WithdrawalRecord[]>([]);
const assets = ref<WalletAssetHolding[]>([]);
const assetNameMap = ref<Record<number, string>>({});
const assetPickerOpen = ref(false);

const form = reactive({
  assetId: undefined as number | undefined,
  amountText: ''
});

const latestStatusGuide = (status?: string): { title: string; desc: string } => {
  switch (status) {
    case 'PENDING_REVIEW':
      return { title: '当前有待审核提现', desc: '申请已提交，等待平台审核。请关注“提现记录”状态变化。' };
    case 'PENDING_PAYOUT':
      return { title: '当前有待打款提现', desc: '提现审核通过，正在等待打款处理。' };
    case 'COMPLETED':
      return { title: '最近一笔提现已完成', desc: '提现已处理完成，可继续发起新的提现申请。' };
    case 'REJECTED':
      return { title: '最近一笔提现被驳回', desc: '请根据驳回原因修正后重新提交。' };
    default:
      return { title: '暂无提现记录', desc: '可先选择资产并发起第一笔提现。' };
  }
};

const selectedAssetLabel = computed(() => {
  if (!form.assetId) {
    return '';
  }
  const item = assets.value.find((asset) => asset.assetId === form.assetId);
  if (!item) {
    return '';
  }
  return `${item.assetName}(${item.assetCode}) 可用:${item.availableBalance}`;
});

const loadAssets = async () => {
  try {
    const page = await fetchWalletAssets(1, 100);
    assets.value = page.records || [];
    assetNameMap.value = assets.value.reduce<Record<number, string>>((map, item) => {
      map[item.assetId] = item.assetName;
      return map;
    }, {});
  } catch (error) {
    message.error(parseError(error, '加载资产列表失败'));
  }
};

const load = async () => {
  loading.value = true;
  loadError.value = '';
  try {
    rows.value = await fetchMyWithdrawals(30);
  } catch (error) {
    loadError.value = parseError(error, '加载提现记录失败');
    message.error(loadError.value);
  } finally {
    loading.value = false;
  }
};

const onSelectAsset = (assetId: number) => {
  form.assetId = assetId;
  assetPickerOpen.value = false;
};

const submit = async () => {
  if (!assets.value.length) {
    message.warning('当前暂无可提现资产');
    return;
  }
  if (!form.assetId) {
    message.warning('请选择资产');
    return;
  }
  const amount = Number(form.amountText);
  if (!Number.isFinite(amount) || amount <= 0) {
    message.warning('请输入提现金额');
    return;
  }
  submitting.value = true;
  try {
    await submitWithdrawal(form.assetId, String(amount));
    trackAction({ action: 'withdraw_submit', status: 'success', scene: 'withdrawal', detail: `assetId=${form.assetId};amount=${amount}` });
    message.success('提现申请已提交');
    form.assetId = undefined;
    form.amountText = '';
    await load();
  } catch (error) {
    trackAction({ action: 'withdraw_submit', status: 'failed', scene: 'withdrawal', detail: parseError(error, '提交提现失败') });
    message.error(parseError(error, '提交提现失败'));
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  void Promise.all([loadAssets(), load()]);
});
</script>

<template>
  <div class="withdraw-section">
    <div class="tip-card">
      <div class="tip-title">{{ latestStatusGuide(rows[0]?.status).title }}</div>
      <div class="tip-desc">{{ latestStatusGuide(rows[0]?.status).desc }}</div>
    </div>

    <div v-if="loadError" class="tip-card tip-error">
      <div class="tip-title">提现记录加载失败</div>
      <div class="tip-desc">{{ loadError }}</div>
    </div>

    <section class="panel">
      <h3 class="panel-title">发起提现</h3>
      <van-field
        :model-value="selectedAssetLabel"
        readonly
        is-link
        label="资产"
        placeholder="请选择资产"
        @click="assetPickerOpen = true"
      />
      <van-field v-model="form.amountText" type="number" label="金额" placeholder="请输入提现金额" />
      <van-button type="primary" block :loading="submitting" data-testid="withdraw-submit" @click="submit">提交</van-button>
    </section>

    <section class="panel">
      <div class="panel-header">
        <span>提现记录</span>
        <van-button size="small" plain type="primary" @click="load">刷新</van-button>
      </div>
      <div v-if="loading" class="panel-loading">
        <van-loading size="20px" vertical>加载中...</van-loading>
      </div>
      <van-empty v-else-if="!rows.length" description="暂无提现记录" />
      <div v-else class="record-list">
        <div v-for="row in rows" :key="row.id" class="record-row">
          <div class="record-main">
            <span>#{{ row.id }}</span>
            <span>{{ row.amount }}</span>
          </div>
          <div class="record-sub">资产：{{ row.assetId ? `${assetNameMap[row.assetId] || '未知资产'}(#${row.assetId})` : '-' }}</div>
          <div class="record-sub">状态：{{ row.statusDesc || formatStatus(row.status) }}</div>
          <div class="record-sub">驳回：{{ row.rejectReason || '-' }}</div>
          <div class="record-sub">申请时间：{{ formatTime(row.createdAt) }}</div>
        </div>
      </div>
    </section>

    <van-action-sheet v-model:show="assetPickerOpen" title="请选择资产">
      <div class="asset-picker-list">
        <button v-for="item in assets" :key="item.assetId" type="button" class="asset-picker-item" @click="onSelectAsset(item.assetId)">
          {{ `${item.assetName}(${item.assetCode}) 可用:${item.availableBalance}` }}
        </button>
      </div>
    </van-action-sheet>
  </div>
</template>

<style scoped>
.withdraw-section {
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
  color: #0f172a;
  font-weight: 600;
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

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.panel-loading {
  padding: 18px 0;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-row {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  padding: 10px;
}

.record-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
}

.record-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.asset-picker-list {
  padding: 8px 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.asset-picker-item {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  text-align: left;
  background: #fff;
  font-size: 13px;
  color: #0f172a;
}
</style>
