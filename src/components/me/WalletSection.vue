<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { message } from '@/utils/message';
import {
  fetchAssetLedgerByAssetId,
  fetchWalletAssets,
  fetchWalletOverview,
  type AssetLedger,
  type WalletAssetHolding,
  type WalletOverview
} from '@/services/wallet';
import { formatTime } from '@/utils/format';
import { parseError } from '@/services/http';

const loading = ref(false);
const ledgerLoading = ref(false);
const overview = ref<WalletOverview | null>(null);
const holdings = ref<WalletAssetHolding[]>([]);
const selectedHolding = ref<WalletAssetHolding | null>(null);
const ledgers = ref<AssetLedger[]>([]);
const detailOpen = ref(false);

const load = async () => {
  loading.value = true;
  try {
    const [overviewData, holdingPage] = await Promise.all([fetchWalletOverview(), fetchWalletAssets(1, 50)]);
    overview.value = overviewData;
    holdings.value = holdingPage.records || [];
  } catch (error) {
    message.error(parseError(error, '加载钱包数据失败'));
  } finally {
    loading.value = false;
  }
};

const openAssetDetail = async (row: WalletAssetHolding) => {
  selectedHolding.value = row;
  detailOpen.value = true;
  ledgerLoading.value = true;
  try {
    ledgers.value = await fetchAssetLedgerByAssetId(row.assetId, 50);
  } catch (error) {
    message.error(parseError(error, '加载资产流水失败'));
    ledgers.value = [];
  } finally {
    ledgerLoading.value = false;
  }
};

onMounted(() => {
  void load();
});
</script>

<template>
  <div class="wallet-section">
    <section class="panel">
      <div class="panel-header">
        <span>钱包总览</span>
        <van-button size="small" plain type="primary" @click="load">刷新</van-button>
      </div>
      <div v-if="loading" class="panel-loading">
        <van-loading size="20px" vertical>加载中...</van-loading>
      </div>
      <van-cell-group v-else inset>
        <van-cell title="总资产" :value="overview?.totalBalance ?? '0'" />
        <van-cell title="可用资产" :value="overview?.availableBalance ?? '0'" />
        <van-cell title="冻结资产" :value="overview?.frozenBalance ?? '0'" />
        <van-cell title="资产种类" :value="String(overview?.assetCount ?? 0)" />
      </van-cell-group>
    </section>

    <section class="panel">
      <div class="panel-header">
        <span>资产持仓</span>
        <span>{{ holdings.length }} 项</span>
      </div>
      <div v-if="loading" class="panel-loading">
        <van-loading size="20px" vertical>加载中...</van-loading>
      </div>
      <div v-else class="holding-list">
        <button
          v-for="item in holdings"
          :key="item.assetId"
          type="button"
          class="holding-row"
          @click="openAssetDetail(item)"
        >
          <div class="holding-title">{{ item.assetName }}</div>
          <div class="holding-sub">ID {{ item.assetId }} · {{ item.assetCode }}</div>
          <div class="holding-value">可用 {{ item.availableBalance }}</div>
        </button>
      </div>
    </section>

    <van-popup v-model:show="detailOpen" position="bottom" round :style="{ height: '85%' }">
      <div class="drawer-body">
        <h3 class="drawer-title">资产详情与流水</h3>
        <van-cell-group inset>
          <van-cell title="资产ID" :value="String(selectedHolding?.assetId ?? '-')" />
          <van-cell title="资产名称" :value="selectedHolding?.assetName ?? '-'" />
          <van-cell title="编码" :value="selectedHolding?.assetCode ?? '-'" />
          <van-cell title="总余额" :value="selectedHolding?.totalBalance ?? '-'" />
          <van-cell title="可用余额" :value="selectedHolding?.availableBalance ?? '-'" />
          <van-cell title="冻结余额" :value="selectedHolding?.frozenBalance ?? '-'" />
        </van-cell-group>

        <div class="drawer-ledger-title">流水记录</div>
        <div v-if="ledgerLoading" class="panel-loading">
          <van-loading size="20px" vertical>加载中...</van-loading>
        </div>
        <van-empty v-else-if="!ledgers.length" description="暂无流水记录" />
        <div v-else class="ledger-list">
          <div v-for="row in ledgers" :key="row.id" class="ledger-row">
            <div class="ledger-main">{{ row.bizType }} · {{ row.delta }}</div>
            <div class="ledger-sub">余额 {{ row.balanceAfter }}</div>
            <div class="ledger-time">{{ formatTime(row.createdAt) }}</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped>
.wallet-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel {
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.panel-loading {
  padding: 18px 0;
}

.holding-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.holding-row {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  text-align: left;
  padding: 10px;
}

.holding-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.holding-sub {
  margin-top: 2px;
  font-size: 12px;
  color: #64748b;
}

.holding-value {
  margin-top: 6px;
  font-size: 13px;
  color: #111827;
}

.drawer-body {
  padding: 12px 12px 18px;
}

.drawer-title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 700;
}

.drawer-ledger-title {
  margin: 12px 4px 8px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.ledger-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ledger-row {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  background: #fff;
}

.ledger-main {
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
}

.ledger-sub,
.ledger-time {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}
</style>
