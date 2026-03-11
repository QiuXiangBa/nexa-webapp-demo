<script setup lang="ts">
export interface SpaceEntryItem {
  key: 'asset' | 'expert';
  title: string;
  desc: string;
  icon: string;
}

const props = defineProps<{
  item: SpaceEntryItem;
}>();

const emit = defineEmits<{
  click: [key: SpaceEntryItem['key']];
}>();

const onClick = () => {
  emit('click', props.item.key);
};
</script>

<template>
  <button type="button" class="entry-card" @click="onClick">
    <div class="entry-card-head">
      <h3 class="entry-card-title">{{ item.title }}</h3>
      <img :src="item.icon" :alt="item.title" class="entry-card-icon" />
    </div>
    <p class="entry-card-desc">{{ item.desc }}</p>
  </button>
</template>

<style scoped>
.entry-card {
  width: calc(160 * 100vw / var(--nexa-design-width));
  height: calc(70 * 100vw / var(--nexa-design-width));
  padding: calc(8 * 100vw / var(--nexa-design-width)) calc(16 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(5 * 100vw / var(--nexa-design-width));
  background: linear-gradient(180deg, #2eb8cf 0%, #0a82b5 100%);
  box-shadow: 0 calc(1 * 100vw / var(--nexa-design-width)) calc(2 * 100vw / var(--nexa-design-width)) rgba(0, 0, 0, 0.12);
  color: #fff;
  text-align: left;
}

.entry-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.entry-card-title {
  margin: 0;
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: 1.1;
  text-shadow: 0 calc(1 * 100vw / var(--nexa-design-width)) calc(4 * 100vw / var(--nexa-design-width)) rgba(0, 0, 0, 0.24);
}

.entry-card-icon {
  width: calc(40 * 100vw / var(--nexa-design-width));
  height: calc(40 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.entry-card-desc {
  margin: calc(8 * 100vw / var(--nexa-design-width)) 0 0;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  line-height: 1.2;
}
</style>
