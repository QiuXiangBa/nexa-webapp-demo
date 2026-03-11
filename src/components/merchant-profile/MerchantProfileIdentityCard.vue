<script setup lang="ts">
import AppBizImage from '@/components/common/AppBizImage.vue';

export interface MerchantIdentityItem {
  key: string;
  label: string;
  previewUrl: string;
}

// 法人身份卡片
// props.items: 身份证件项（人像面/国徽面）
// emit.upload: 点击证件图触发上传
const props = defineProps<{
  items: MerchantIdentityItem[];
}>();

const emit = defineEmits<{
  (event: 'upload', key: string): void;
}>();
</script>

<template>
  <section class="identity-section">
    <p class="section-label">必填信息·法人身份</p>
    <div class="identity-card">
      <div v-for="(item, index) in props.items" :key="item.key" class="identity-row" :class="{ 'row-last': index === props.items.length - 1 }">
        <div class="row-label">{{ item.label }}</div>
        <button type="button" class="identity-upload" @click="emit('upload', item.key)">
          <AppBizImage :src="item.previewUrl" :alt="item.label" fallback-src="/pages/common/image-fallback.svg" class="identity-upload-preview" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.identity-section {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
}

.section-label {
  margin: 0 0 calc(6 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 500;
}

.identity-card {
  width: calc(348.4 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
  overflow: hidden;
}

.identity-row {
  width: calc(319.28 * 100vw / var(--nexa-design-width));
  height: calc(104 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: calc(84 * 100vw / var(--nexa-design-width)) 1fr;
  align-items: center;
}

.identity-row.row-last {
  border-bottom: 0;
}

.row-label {
  color: #363636;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  line-height: calc(16 * 100vw / var(--nexa-design-width));
}

.identity-upload {
  width: calc(131.04 * 100vw / var(--nexa-design-width));
  height: calc(90.48 * 100vw / var(--nexa-design-width));
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.identity-upload-preview {
  width: 100%;
  height: 100%;
}

.identity-upload-preview :deep(.van-image__img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
</style>
