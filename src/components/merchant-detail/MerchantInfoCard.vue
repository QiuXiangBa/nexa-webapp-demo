<script setup lang="ts">
// 商家基础信息卡
// props.rows: 键值行列表，withCoinIcon=true 时渲染币种图标
export interface MerchantInfoRow {
  label: string;
  value: string;
  withCoinIcon?: boolean;
  withArrow?: boolean;
}

defineProps<{
  rows: MerchantInfoRow[];
}>();

const coinIconUrl = '/pages/merchant-detail/e03ba4b5-09c0-49c6-9ee9-ea8bbde650f4.jpg';
const arrowIconUrl = '/pages/merchant-detail/b63811ee-cce9-470f-8e57-a3801f44c6ce.svg';
</script>

<template>
  <section class="merchant-info-panel">
    <h2 class="section-title">数字资产基础信息</h2>
    <div class="merchant-info-card">
      <div v-for="(row, index) in rows" :key="`${row.label}-${index}`" class="info-row" :class="{ 'with-divider': index < rows.length - 1 }">
        <span class="row-label">{{ row.label }}</span>
        <span class="row-value">
          {{ row.value }}
          <img v-if="row.withCoinIcon" :src="coinIconUrl" alt="" />
          <img v-if="row.withArrow" :src="arrowIconUrl" alt="" class="arrow-icon" />
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.merchant-info-panel {
  width: calc(307 * 100vw / var(--nexa-design-width));
}

.section-title {
  margin: 0;
  color: #7e818d;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.merchant-info-card {
  margin-top: calc(6 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: linear-gradient(180deg, #2eb8cf 0%, #0a82b5 100%);
  padding: 0 calc(12 * 100vw / var(--nexa-design-width));
}

.info-row {
  height: calc(30 * 100vw / var(--nexa-design-width));
  display: grid;
  grid-template-columns: calc(90 * 100vw / var(--nexa-design-width)) 1fr;
  align-items: center;
}

.with-divider {
  border-bottom: 1px solid #eee;
}

.row-label {
  color: #fff;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 700;
}

.row-value {
  display: inline-flex;
  justify-self: end;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  color: #fff;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 500;
}

.row-value img {
  width: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  object-fit: cover;
}

.row-value .arrow-icon {
  width: calc(4 * 100vw / var(--nexa-design-width));
  height: calc(8 * 100vw / var(--nexa-design-width));
  border-radius: 0;
}
</style>
