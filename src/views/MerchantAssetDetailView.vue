<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from '@/utils/message';
import MerchantAssetHeader from '@/components/merchant-detail/MerchantAssetHeader.vue';
import MerchantTrendPanel from '@/components/merchant-detail/MerchantTrendPanel.vue';
import MerchantInfoCard, { type MerchantInfoRow } from '@/components/merchant-detail/MerchantInfoCard.vue';
import MerchantRulesPanel, { type MerchantRuleItem } from '@/components/merchant-detail/MerchantRulesPanel.vue';
import MerchantContractCard from '@/components/merchant-detail/MerchantContractCard.vue';

// 商家明细页（Figma node: 70:3756）
// 负责：展示商家资产明细（头图、趋势图、基础信息、规则、合约）
// 不负责：底部导航和地图定位逻辑（由商家地图页负责）
const route = useRoute();
const router = useRouter();

const coverUrl = '/pages/merchant-asset-detail/ed46a6f8-3a0c-4578-a0dd-ed86f2db5d55.png';
const defaultLogoUrl = '/pages/merchant-asset-detail/48fcf2e2-1c65-4d68-b412-4ad7998a3d67.png';
const backIconUrl = '/pages/merchant-asset-detail/ddbd6b71-8159-4bd2-968d-99e0b416d91e.svg';

const trendMode = ref<'value' | 'amount'>('amount');

const merchantName = computed(() => (route.query.merchantName as string) || '麦当劳');
const issuedAt = computed(() => (route.query.issuedAt as string) || '2025年12月');
const logoUrl = computed(() => (route.query.logoUrl as string) || defaultLogoUrl);

const trendPoints = [
  { dayLabel: '一', value: 1, amount: 120 },
  { dayLabel: '二', value: 1.5, amount: 180 },
  { dayLabel: '三', value: 1.5, amount: 180 },
  { dayLabel: '四', value: 2, amount: 220 },
  { dayLabel: '五', value: 2.3, amount: 260 },
  { dayLabel: '六', value: 2.6, amount: 300 },
  { dayLabel: '日', value: 3, amount: 360 }
];

const infoRows = computed<MerchantInfoRow[]>(() => [
  { label: '资产名称', value: `${merchantName.value}数资诺` },
  { label: '关联商家', value: '金拱门有限公司' },
  { label: '我的持有数量', value: '500', withCoinIcon: true, withArrow: true },
  { label: '当前参考价值', value: '¥ 10 / 1', withCoinIcon: true },
  { label: '数资发行总量', value: '999,999,99', withCoinIcon: true }
]);

const ruleItems = computed<MerchantRuleItem[]>(() => [
  {
    title: '该资产的生成规则',
    detail:
      '规则说明 规则说明 规则说明 规则说明 规则说明 规则说明 规则说明 规则说明 规则说明 规则说明'
  },
  { title: '是否可提现', detail: '可随时提现' },
  { title: '是否可长期持有', detail: '可长期持有' },
  { title: '是否有锁定期', detail: '无锁定期' }
]);

const onBack = () => {
  router.back();
};

const onViewContract = () => {
  message.info('查看合约功能即将开放');
};
</script>

<template>
  <div class="merchant-detail-page">
    <MerchantAssetHeader
      :cover-url="coverUrl"
      :logo-url="logoUrl"
      :merchant-name="merchantName"
      :issued-at="issuedAt"
      :back-icon-url="backIconUrl"
      @back="onBack"
    />

    <main class="merchant-detail-main">
      <MerchantTrendPanel :date-label="'2026年1月17日'" :mode="trendMode" :points="trendPoints" @change-mode="trendMode = $event" />

      <MerchantInfoCard :rows="infoRows" />

      <MerchantRulesPanel :rules="ruleItems" />

      <MerchantContractCard
        :contract-no="'ABC-123_DEF-4567'"
        :chain-at="'2025年12月31日'"
        :contract-text="'点击查看合约'"
        @view-contract="onViewContract"
      />
    </main>
  </div>
</template>

<style scoped>
.merchant-detail-page {
  min-height: 100dvh;
  background: #f9faff;
}

/* 主内容区采用页面内边距自管，避免污染全局 Layout */
.merchant-detail-main {
  margin-top: calc(14 * 100vw / var(--nexa-design-width));
  padding: 0 calc(35 * 100vw / var(--nexa-design-width)) calc(34 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  gap: calc(20 * 100vw / var(--nexa-design-width));
}
</style>
