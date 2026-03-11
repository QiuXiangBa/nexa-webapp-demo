<script setup lang="ts">
import { ref, watch } from 'vue';
import AppBizImage from '@/components/common/AppBizImage.vue';

interface WithdrawItem {
  id: string;
  name: string;
  available: number;
  iconUrl: string;
  withdraw: number;
}

const props = defineProps<{ item: WithdrawItem }>();
const emit = defineEmits<{ (e: 'change', id: string, value: number): void }>();

const inputValue = ref(props.item.withdraw);

watch(inputValue, (val) => {
  emit('change', props.item.id, Number(val) || 0);
});

const setAll = () => {
  inputValue.value = props.item.available;
};
</script>

<template>
  <div class="withdraw-row">
    <div class="merchant-col">
      <AppBizImage
        :src="props.item.iconUrl"
        alt=""
        fallback-src="/pages/common/logo-fallback.svg"
        class="merchant-icon"
      />
      <div class="merchant-texts">
        <div class="merchant-name">{{ props.item.name }}</div>
        <div class="merchant-available">可提 {{ props.item.available.toLocaleString() }} 元</div>
      </div>
    </div>

    <div class="controls-col">
      <van-stepper
        v-model="inputValue"
        :min="0"
        :max="props.item.available"
        :step="0.01"
        :decimal-length="2"
        input-width="60px"
        button-size="28px"
        class="withdraw-stepper"
      />
      <button type="button" class="all-btn" @click="setAll">全部</button>
    </div>
  </div>
</template>

<style scoped>
.withdraw-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(10 * 100vw / var(--nexa-design-width)) calc(16 * 100vw / var(--nexa-design-width));
  border-bottom: 1px solid #eef0f4;
  background: #fff;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}

.merchant-col {
  display: flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  min-width: 0;
  flex: 1;
}

.merchant-icon {
  flex-shrink: 0;
  width: calc(36 * 100vw / var(--nexa-design-width));
  height: calc(36 * 100vw / var(--nexa-design-width));
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
}

.merchant-icon :deep(.van-image__img) {
  object-fit: cover;
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
}

.merchant-texts {
  min-width: 0;
}

.merchant-name {
  color: #000;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(18 * 100vw / var(--nexa-design-width));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.merchant-available {
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(16 * 100vw / var(--nexa-design-width));
}

.controls-col {
  display: flex;
  align-items: center;
  gap: calc(8 * 100vw / var(--nexa-design-width));
  flex-shrink: 0;
}

.withdraw-stepper :deep(.van-stepper__minus),
.withdraw-stepper :deep(.van-stepper__plus) {
  width: calc(28 * 100vw / var(--nexa-design-width));
  height: calc(28 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  background: #f2f3f5;
  color: #333;
}

.withdraw-stepper :deep(.van-stepper__input) {
  background: #f9faff;
  border-radius: calc(4 * 100vw / var(--nexa-design-width));
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  height: calc(28 * 100vw / var(--nexa-design-width));
}

.all-btn {
  height: calc(28 * 100vw / var(--nexa-design-width));
  padding: 0 calc(8 * 100vw / var(--nexa-design-width));
  border-radius: calc(14 * 100vw / var(--nexa-design-width));
  border: 1px solid #3fbbfa;
  background: #fff;
  color: #3fbbfa;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}
</style>
