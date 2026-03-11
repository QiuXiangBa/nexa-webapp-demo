<script setup lang="ts">
// 商家资产合约信息卡
// props: 合约编号、上链时间、查看文案
// emit.view-contract: 点击“查看合约”行
defineProps<{
  contractNo: string;
  chainAt: string;
  contractText: string;
}>();

const emit = defineEmits<{
  (event: 'view-contract'): void;
}>();

const arrowIconUrl = '/pages/merchant-detail/b63811ee-cce9-470f-8e57-a3801f44c6ce.svg';

const onViewContract = () => {
  emit('view-contract');
};
</script>

<template>
  <section class="merchant-contract-panel">
    <h2 class="section-title">数字资产合约信息</h2>

    <div class="merchant-contract-card">
      <div class="contract-row with-divider">
        <span class="row-label">合约编号</span>
        <span class="row-value">{{ contractNo }}</span>
      </div>
      <div class="contract-row with-divider">
        <span class="row-label">上链时间</span>
        <span class="row-value">{{ chainAt }}</span>
      </div>
      <button type="button" class="contract-row view-row" @click="onViewContract">
        <span class="row-label">查看合约</span>
        <span class="row-value">
          {{ contractText }}
          <img :src="arrowIconUrl" alt="" />
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.merchant-contract-panel {
  width: calc(307 * 100vw / var(--nexa-design-width));
}

.section-title {
  margin: 0;
  color: #7e818d;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.merchant-contract-card {
  margin-top: calc(6 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: linear-gradient(180deg, #2eb8cf 0%, #0a82b5 100%);
  padding: 0 calc(18 * 100vw / var(--nexa-design-width));
}

.contract-row {
  width: 100%;
  height: calc(40 * 100vw / var(--nexa-design-width));
  border: 0;
  background: transparent;
  display: grid;
  grid-template-columns: calc(70 * 100vw / var(--nexa-design-width)) 1fr;
  align-items: center;
  padding: 0;
}

.with-divider {
  border-bottom: 1px solid #eee;
}

.row-label {
  color: #fff;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 700;
  text-align: left;
}

.row-value {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  color: #fff;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 500;
}

.row-value img {
  width: calc(6 * 100vw / var(--nexa-design-width));
  height: calc(12 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.view-row {
  cursor: pointer;
}
</style>
