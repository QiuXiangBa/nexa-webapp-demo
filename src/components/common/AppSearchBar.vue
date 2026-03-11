<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
  }>(),
  {
    modelValue: '',
    placeholder: '输入数字资产名称搜索'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
}>();

const keyword = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
});
</script>

<template>
  <div class="app-search-bar">
    <van-search
      v-model="keyword"
      :placeholder="placeholder"
      shape="round"
      show-action
      @search="emit('search', keyword)"
    >
      <template #action>
        <button type="button" class="search-action-btn" @click="emit('search', keyword)">搜索</button>
      </template>
    </van-search>
  </div>
</template>

<style scoped>
.search-action-btn {
  border: 0;
  background: transparent;
  color: var(--nexa-color-brand-primary);
  font-size: var(--nexa-font-size-14);
}
</style>
