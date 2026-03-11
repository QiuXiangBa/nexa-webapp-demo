<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    amount: string | number;
    unit?: string;
    actionText?: string;
  }>(),
  {
    unit: '',
    actionText: ''
  }
);
</script>

<template>
  <div class="total-income-card">
    <div class="total-income-main">
      <h4>{{ title }}</h4>
      <div class="amount-row">
        <span class="amount">{{ amount }}</span>
        <span v-if="unit" class="unit">{{ unit }}</span>
      </div>
    </div>
    <div v-if="actionText" class="total-income-action">{{ actionText }}</div>
  </div>
</template>

<style scoped>
.total-income-card {
  border-radius: var(--nexa-radius-lg);
  overflow: hidden;
  border: 1px solid var(--nexa-color-border-default);
}

.total-income-main {
  padding: var(--nexa-space-16);
  color: var(--nexa-color-text-inverse);
  background: var(--nexa-gradient-income-card);
}

.total-income-main h4 {
  margin: 0;
  font-size: var(--nexa-font-size-18);
  text-align: center;
}

.amount-row {
  margin-top: var(--nexa-space-12);
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: var(--nexa-space-8);
}

.amount {
  font-size: 40px;
  line-height: 1;
  font-weight: 600;
}

.unit {
  font-size: 22px;
}

.total-income-action {
  background: var(--nexa-color-surface-muted);
  color: var(--nexa-color-text-secondary);
  text-align: center;
  font-size: var(--nexa-font-size-13);
  padding: var(--nexa-space-10) var(--nexa-space-12);
}
</style>
