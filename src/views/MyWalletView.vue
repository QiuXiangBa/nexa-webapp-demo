<script setup lang="ts">
import { message } from '@/utils/message';
import { useRouter } from 'vue-router';
import WalletTotalCard from '@/components/wallet/WalletTotalCard.vue';
import WalletActionSection from '@/components/wallet/WalletActionSection.vue';

// 我的钱包页（Figma node: 54:2662）
// 负责：资产总览卡片 + 结算/明细功能分组入口展示
// 不负责：通用顶栏、底部导航和全局壳层（由 LayoutView 管理）
const router = useRouter();

const withdrawIconUrl = '/pages/my-wallet/08cace1f-bf45-4544-b72f-5ed9104c1d68.svg';
const recordIconUrl = '/pages/my-wallet/91bd086a-ed8b-498b-a2eb-604019107ba3.svg';
const arrowIconUrl = '/pages/my-wallet/2171001b-2e05-4cd5-b0e4-9688a588b2d5.svg';

interface WalletActionGroup {
  title: string;
  rows: Array<{
    key: string;
    name: string;
    hint: string;
    iconType: 'image' | 'bank';
    iconUrl?: string;
  }>;
}

const groups: WalletActionGroup[] = [
  {
    title: '结算管理界面',
    rows: [{ key: 'withdraw', name: '数字资产提现', hint: '点击前往', iconType: 'image', iconUrl: withdrawIconUrl }]
  },
  {
    title: '结算至银行卡',
    rows: [{ key: 'bank-card', name: '银行卡名称', hint: '点击更换', iconType: 'bank' }]
  },
  {
    title: '明细管理',
    rows: [{ key: 'income-record', name: '收益记录', hint: '点击查看', iconType: 'image', iconUrl: recordIconUrl }]
  }
];

const onSelectAction = (key: string) => {
  if (key === 'withdraw') {
    router.push('/me/wallet/withdraw').catch(() => undefined);
    return;
  }
  if (key === 'income-record') {
    router.push('/me/consume-record').catch(() => undefined);
    return;
  }
  message.info('功能建设中');
};
</script>

<template>
  <div class="my-wallet-page">
    <section class="wallet-total-section">
      <WalletTotalCard amount="¥ 999,999,9" />
    </section>

    <WalletActionSection
      v-for="group in groups"
      :key="group.title"
      :title="group.title"
      :rows="group.rows"
      :arrow-icon-url="arrowIconUrl"
      @select="onSelectAction"
    />
  </div>
</template>

<style scoped>
.my-wallet-page {
  min-height: 100%;
}

.wallet-total-section {
  margin-top: calc(18 * 100vw / var(--nexa-design-width));
}
</style>
