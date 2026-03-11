<script setup lang="ts">
import { ref } from 'vue';
import AppTopBarStandard from '@/components/common/AppTopBarStandard.vue';
import ExpertRecordGroup from '@/components/expert-record/ExpertRecordGroup.vue';

// 达人授权记录页（Figma node: 54:2931）
// 负责：授权记录分组展示 + 用户/商家授权 tab 视觉切换
// 不负责：底部导航和全局壳层（由 LayoutView 管理）
const activeTab = ref<'user' | 'merchant'>('user');

const userGroups = [
  {
    dateLabel: '2026年02月03日',
    items: [
      { id: 'u-1', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '审核中', statusClass: 'pending' },
      { id: 'u-2', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '审核中', statusClass: 'pending' },
      { id: 'u-3', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '审核中', statusClass: 'pending' },
      { id: 'u-4', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '审核中', statusClass: 'pending' }
    ]
  },
  {
    dateLabel: '2026年02月02日',
    items: [
      { id: 'u-5', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '审核中', statusClass: 'pending' },
      { id: 'u-6', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '拒绝', statusClass: 'reject' }
    ]
  },
  {
    dateLabel: '2026年02月01日',
    items: [
      { id: 'u-7', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '已通过', statusClass: 'pass' },
      { id: 'u-8', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '已通过', statusClass: 'pass' },
      { id: 'u-9', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '已通过', statusClass: 'pass' },
      { id: 'u-10', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '已通过', statusClass: 'pass' },
      { id: 'u-11', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '已通过', statusClass: 'pass' },
      { id: 'u-12', nickname: '用户昵称', authTypeText: '扫码授权', statusText: '已通过', statusClass: 'pass' }
    ]
  }
] as const;

const merchantGroups = [
  {
    dateLabel: '2026年02月03日',
    items: [
      { id: 'm-1', nickname: '商家昵称', authTypeText: '扫码授权', statusText: '审核中', statusClass: 'pending' },
      { id: 'm-2', nickname: '商家昵称', authTypeText: '扫码授权', statusText: '审核中', statusClass: 'pending' }
    ]
  }
] as const;

</script>

<template>
  <div class="expert-record-page">
    <AppTopBarStandard title="达人授权记录" fallback-path="/me" />

    <section class="record-panel-wrap">
      <div class="record-panel">
        <div class="record-inner">
          <van-tabs v-model:active="activeTab" class="record-tabs" :border="false" animated swipeable>
            <van-tab title="用户授权" name="user">
              <div class="tab-content">
                <ExpertRecordGroup v-for="group in userGroups" :key="group.dateLabel" :date-label="group.dateLabel" :items="group.items" />
              </div>
            </van-tab>
            <van-tab title="商家授权" name="merchant">
              <div class="tab-content">
                <ExpertRecordGroup
                  v-for="group in merchantGroups"
                  :key="`merchant-${group.dateLabel}`"
                  :date-label="group.dateLabel"
                  :items="group.items"
                />
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.expert-record-page {
  min-height: 100dvh;
  background: #f9faff;
  padding-top: calc(70 * 100vw / var(--nexa-design-width));
}

.record-panel-wrap {
  margin-top: calc(0 * 100vw / var(--nexa-design-width));
  display: flex;
  justify-content: center;
}

.record-panel {
  width: calc(354 * 100vw / var(--nexa-design-width));
  border-radius: calc(20 * 100vw / var(--nexa-design-width));
  background: #fff;
  display: flex;
  justify-content: center;
  padding-top: calc(17 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(17 * 100vw / var(--nexa-design-width));
}

.record-inner {
  width: calc(330 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width)) 0 0;
  background: #f9faff;
  padding: calc(6 * 100vw / var(--nexa-design-width)) calc(14 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(20 * 100vw / var(--nexa-design-width));
}

.record-tabs :deep(.van-tabs__wrap) {
  height: calc(23 * 100vw / var(--nexa-design-width));
  width: calc(140 * 100vw / var(--nexa-design-width));
}

.record-tabs :deep(.van-tabs__nav) {
  background: transparent;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.record-tabs :deep(.van-tab) {
  padding: 0;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 400;
  color: #989c9e;
  line-height: calc(23 * 100vw / var(--nexa-design-width));
  border-radius: calc(5 * 100vw / var(--nexa-design-width)) calc(5 * 100vw / var(--nexa-design-width)) 0 0;
}

.record-tabs :deep(.van-tab--active) {
  background: #3fbbfa;
  color: #fff;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.record-tabs :deep(.van-tabs__line) {
  display: none;
}

.tab-content {
  padding-top: calc(8 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  gap: calc(8 * 100vw / var(--nexa-design-width));
}
</style>
