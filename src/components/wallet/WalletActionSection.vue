<script setup lang="ts">
// 钱包功能分组列表
// props.title: 分组标题
// props.rows: 当前分组的功能行
// emit.select: 点击某行时抛出 key
interface WalletActionRow {
  key: string;
  name: string;
  hint: string;
  iconType: 'image' | 'bank';
  iconUrl?: string;
}

const props = defineProps<{
  title: string;
  rows: WalletActionRow[];
  arrowIconUrl: string;
}>();

const emit = defineEmits<{
  select: [key: string];
}>();
</script>

<template>
  <section class="wallet-action-section">
    <div class="section-title">{{ props.title }}</div>
    <button v-for="row in props.rows" :key="row.key" type="button" class="section-row" @click="emit('select', row.key)">
      <span class="row-left">
        <img v-if="row.iconType === 'image'" :src="row.iconUrl" alt="" class="row-icon" />
        <span v-else class="bank-icon" aria-hidden="true">
          <i class="bank-line top" />
          <i class="bank-line short" />
          <i class="bank-line long" />
        </span>
        <span class="row-name">{{ row.name }}</span>
      </span>
      <span class="row-right">
        <span class="row-hint">{{ row.hint }}</span>
        <img :src="props.arrowIconUrl" alt="" class="row-arrow" />
      </span>
    </button>
  </section>
</template>

<style scoped>
.wallet-action-section {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
}

.section-title {
  height: calc(30 * 100vw / var(--nexa-design-width));
  padding: 0 calc(20 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(30 * 100vw / var(--nexa-design-width));
}

.section-row {
  width: 100%;
  height: calc(40 * 100vw / var(--nexa-design-width));
  background: #fff;
  border: 0;
  border-bottom: 1px solid #eef0f4;
  padding: 0 calc(20 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row-left {
  display: inline-flex;
  align-items: center;
  gap: calc(12 * 100vw / var(--nexa-design-width));
}

.row-icon {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
}

/* 银行卡图标：按设计稿组合块重建，避免引入不匹配资源 */
.bank-icon {
  width: calc(24 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
  border-radius: calc(2 * 100vw / var(--nexa-design-width));
  background: #33b48a;
  position: relative;
  flex-shrink: 0;
}

.bank-line {
  position: absolute;
  left: 0;
  display: block;
}

.bank-line.top {
  top: 0;
  width: 100%;
  height: calc(2 * 100vw / var(--nexa-design-width));
  background: #e8bd49;
}

.bank-line.short {
  top: calc(6 * 100vw / var(--nexa-design-width));
  width: calc(9 * 100vw / var(--nexa-design-width));
  height: calc(1 * 100vw / var(--nexa-design-width));
  background: #cbdcec;
}

.bank-line.long {
  top: calc(10 * 100vw / var(--nexa-design-width));
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(1 * 100vw / var(--nexa-design-width));
  background: #cbdcec;
}

.row-name {
  color: #363636;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 500;
}

.row-right {
  display: inline-flex;
  align-items: center;
  gap: calc(10 * 100vw / var(--nexa-design-width));
}

.row-hint {
  color: #989c9e;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
}

.row-arrow {
  width: calc(5 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
}
</style>
