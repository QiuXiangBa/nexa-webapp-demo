<script setup lang="ts">
// 钱包总资产卡片
// props.amount: 可结算总资产价值文案
const props = defineProps<{
  amount: string;
}>();
</script>

<template>
  <section class="wallet-total-card">
    <div class="wallet-total-title">可结算总资产价值</div>
    <div class="wallet-total-amount">{{ props.amount }}</div>
  </section>
</template>

<style scoped>
/* 总资产卡片：Figma 300x90 渐变块，圆角 5 */
.wallet-total-card {
  width: calc(300 * 100vw / var(--nexa-design-width));
  height: calc(90 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  background: linear-gradient(180deg, #2eb8cf 0%, #0174ae 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wallet-total-title {
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
  color: #fff;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(20 * 100vw / var(--nexa-design-width));
}

.wallet-total-amount {
  margin-top: calc(6 * 100vw / var(--nexa-design-width));
  color: #fff;
  font-size: calc(47 * 100vw / var(--nexa-design-width) / 3);
  font-weight: 700;
  line-height: calc(48 * 100vw / var(--nexa-design-width));
}
</style>
