<script setup lang="ts">
export interface MerchantQualificationItem {
  key: string;
  label: string;
}

// 企业资质卡片
// props.items: 资质项列表
// props.uploadIconUrl: 上传加号图标
// emit.upload: 点击上传区域
const props = defineProps<{
  items: MerchantQualificationItem[];
  uploadIconUrl: string;
}>();

const emit = defineEmits<{
  (event: 'upload', key: string): void;
}>();
</script>

<template>
  <section class="qualification-section">
    <p class="section-label">必填信息·企业资质</p>
    <div class="qualification-card">
      <div v-for="(item, index) in props.items" :key="item.key" class="qualification-row" :class="{ 'row-last': index === props.items.length - 1 }">
        <div class="row-label">{{ item.label }}</div>
        <button type="button" class="upload-box" @click="emit('upload', item.key)">
          <img class="upload-icon" :src="props.uploadIconUrl" alt="" />
          <span class="upload-text">点击上传</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.qualification-section {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
}

.section-label {
  margin: 0 0 calc(6 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 500;
}

.qualification-card {
  width: calc(348 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
  overflow: hidden;
}

.qualification-row {
  width: calc(319.28 * 100vw / var(--nexa-design-width));
  height: calc(104 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: calc(86 * 100vw / var(--nexa-design-width)) 1fr;
  align-items: center;
}

.qualification-row.row-last {
  border-bottom: 0;
}

.row-label {
  color: #363636;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  line-height: calc(16 * 100vw / var(--nexa-design-width));
}

.upload-box {
  width: calc(104 * 100vw / var(--nexa-design-width));
  height: calc(72 * 100vw / var(--nexa-design-width));
  border: 1px solid #ececec;
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: rgba(245, 245, 245, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: calc(2 * 100vw / var(--nexa-design-width));
  padding: 0;
  cursor: pointer;
}

.upload-icon {
  width: calc(20.8 * 100vw / var(--nexa-design-width));
  height: calc(20.8 * 100vw / var(--nexa-design-width));
}

.upload-text {
  color: #989c9e;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(12 * 100vw / var(--nexa-design-width));
}
</style>
