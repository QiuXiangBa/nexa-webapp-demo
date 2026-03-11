<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import WalletWithdrawRow from '@/components/wallet-withdraw/WalletWithdrawRow.vue';

// 钱包提现页（Figma node: 55:3292）
// 负责：展示待提现总额与分商家提现输入行
// 不负责：通用顶栏与实际提现提交（当前为 UI 还原阶段）

interface WithdrawRow {
  id: string;
  name: string;
  available: number;
  iconUrl: string;
  withdraw: number;
}

const router = useRouter();

const rows = ref<WithdrawRow[]>([
  { id: 'm1',  name: '麦当劳',     available: 1280.50,  iconUrl: '/pages/wallet-withdraw/edbee03e-20f7-4874-9493-d127e43b0461.jpg', withdraw: 0 },
  { id: 'm2',  name: '外婆家',     available: 860.00,   iconUrl: '/pages/wallet-withdraw/727405b4-6d25-4868-b8b2-71debbf4548e.png', withdraw: 0 },
  { id: 'm3',  name: '壹品奶茶',   available: 420.75,   iconUrl: '/pages/wallet-withdraw/f693d1e3-87c4-4913-b1c3-afe73a934f0a.png', withdraw: 0 },
  { id: 'm4',  name: '7-11便利店', available: 235.20,   iconUrl: '/pages/wallet-withdraw/98b9b83a-1ff7-466b-ae88-1b5f4d4dbea5.png', withdraw: 0 },
  { id: 'm5',  name: '时光酒吧',   available: 980.00,   iconUrl: '/pages/wallet-withdraw/e12e78cf-01df-4b54-8eb7-fc0c9c3e56a7.png', withdraw: 0 },
  { id: 'm6',  name: '星巴克',     available: 560.30,   iconUrl: '/pages/wallet-withdraw/8e5ca905-d42c-46b8-b33a-fc9507709bd1.png', withdraw: 0 },
  { id: 'm7',  name: '清心雅舍',   available: 340.00,   iconUrl: '/pages/wallet-withdraw/0c47de0e-d1ef-4926-8d75-4fd1e631ca74.png', withdraw: 0 },
  { id: 'm8',  name: '肯德基',     available: 715.80,   iconUrl: '/pages/wallet-withdraw/edbee03e-20f7-4874-9493-d127e43b0461.jpg', withdraw: 0 },
  { id: 'm9',  name: '必胜客',     available: 190.00,   iconUrl: '/pages/wallet-withdraw/727405b4-6d25-4868-b8b2-71debbf4548e.png', withdraw: 0 },
  { id: 'm10', name: '海底捞',     available: 2100.60,  iconUrl: '/pages/wallet-withdraw/f693d1e3-87c4-4913-b1c3-afe73a934f0a.png', withdraw: 0 },
  { id: 'm11', name: '瑞幸咖啡',   available: 88.50,    iconUrl: '/pages/wallet-withdraw/98b9b83a-1ff7-466b-ae88-1b5f4d4dbea5.png', withdraw: 0 },
  { id: 'm12', name: '喜茶',       available: 305.00,   iconUrl: '/pages/wallet-withdraw/e12e78cf-01df-4b54-8eb7-fc0c9c3e56a7.png', withdraw: 0 },
]);

const total = computed(() =>
  rows.value.reduce((sum, r) => sum + r.withdraw, 0).toFixed(2)
);

const hasWithdraw = computed(() => rows.value.some((r) => r.withdraw > 0));

const onWithdrawChange = (id: string, value: number) => {
  const row = rows.value.find((r) => r.id === id);
  if (row) row.withdraw = value;
};

const submit = () => {
  // TODO: 调用提现接口
  router.back();
};
</script>

<template>
  <div class="wallet-withdraw-page">
    <section class="summary-card">
      <div class="summary-label">本次提现总额</div>
      <div class="summary-amount">
        <span class="summary-value">{{ total }}</span>
        <span class="summary-unit">元</span>
      </div>
    </section>

    <section class="table-head">
      <span>我的数字资产</span>
      <span class="table-head-right">提现金额</span>
    </section>

    <section class="rows-wrap">
      <WalletWithdrawRow
        v-for="row in rows"
        :key="row.id"
        :item="row"
        @change="onWithdrawChange"
      />
    </section>

    <div class="footer-placeholder" />
    <footer class="withdraw-footer">
      <button
        type="button"
        class="submit-btn"
        :class="{ active: hasWithdraw }"
        :disabled="!hasWithdraw"
        @click="submit"
      >
        即刻提现
      </button>
    </footer>
  </div>
</template>

<style scoped>
.wallet-withdraw-page {
  min-height: 100%;
  padding-bottom: calc(80 * 100vw / var(--nexa-design-width));
}

.summary-card {
  position: sticky;
  top: var(--nexa-topbar-total-height);
  z-index: 10;
  background: #fff;
  border-radius: 0 0 calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
  padding: calc(16 * 100vw / var(--nexa-design-width)) calc(20 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.summary-label {
  color: #989c9e;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.summary-amount {
  display: flex;
  align-items: baseline;
  gap: calc(4 * 100vw / var(--nexa-design-width));
}

.summary-value {
  color: #000;
  font-size: calc(24 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.summary-unit {
  color: #989c9e;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.table-head {
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(30 * 100vw / var(--nexa-design-width));
  background: #f9faff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(16 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.table-head-right {
  padding-right: calc(60 * 100vw / var(--nexa-design-width));
}

.rows-wrap {
  background: #fff;
}

.footer-placeholder {
  height: calc(72 * 100vw / var(--nexa-design-width));
}

.withdraw-footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: calc(12 * 100vw / var(--nexa-design-width)) calc(20 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(max(12 * 100vw / var(--nexa-design-width), env(safe-area-inset-bottom)));
  background: #fff;
  box-shadow: 0 -1px 0 #eef0f4;
}

.submit-btn {
  width: 100%;
  height: calc(44 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(22 * 100vw / var(--nexa-design-width));
  background: #d9dee8;
  color: #fff;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  transition: background 0.2s;
  cursor: not-allowed;
}

.submit-btn.active {
  background: #3fbbfa;
  cursor: pointer;
}
</style>
