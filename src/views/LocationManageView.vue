<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';

// 定位管理页（Figma node: 234:2309）
// 负责：地址搜索、当前位置、收藏地址与历史记录的列表编排
// 不负责：真实定位 SDK 与地图导航能力（当前为 UI + 交互占位）
const router = useRouter();
const keyword = ref('');
const expandArrowUrl = '/pages/merchant-map-location-manage/jt-down.svg';

const currentAddress = '地址 地址 地址 地址 地址 地址';
const favoriteAddresses = [
  '地址 地址 地址 地址 地址 地址',
  '地址 地址 地址 地址 地址 地址',
  '地址 地址 地址 地址 地址 地址'
];
const historyAddresses = [
  '地址 地址 地址 地址 地址 地址',
  '地址 地址 地址 地址 地址 地址',
  '地址 地址 地址 地址 地址 地址',
  '地址 地址 地址 地址 地址 地址'
];

const normalizedKeyword = computed(() => keyword.value.trim());

const displayCurrentAddress = computed(() => currentAddress);
const displayFavorites = computed(() => {
  if (!normalizedKeyword.value) {
    return favoriteAddresses;
  }
  return favoriteAddresses.filter((item) => item.includes(normalizedKeyword.value));
});
const displayHistory = computed(() => {
  if (!normalizedKeyword.value) {
    return historyAddresses;
  }
  return historyAddresses.filter((item) => item.includes(normalizedKeyword.value));
});

const onBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }
  void router.push('/merchant-map/default');
};

const onSearch = () => {
  if (!normalizedKeyword.value) {
    message.info('请输入地址关键字');
    return;
  }
  message.info('地址搜索能力待接入');
};

const onRelocate = () => {
  message.info('重新定位中...');
};

const onNavigate = (_address: string) => {
  message.success('导航能力待接入');
};

const onExpandMore = () => {
  message.info('展开更多能力待接入');
};
</script>

<template>
  <div class="location-manage-page">
    <header class="location-header">
      <button type="button" class="location-back-btn" aria-label="返回" @click="onBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <h1 class="location-title">定位管理</h1>
    </header>

    <section class="location-search-section">
      <div class="location-search-bar">
        <span class="search-prefix-icon" aria-hidden="true">
          <span class="search-prefix-dot" />
        </span>
        <input v-model="keyword" type="text" class="location-search-input" placeholder="点击输入地址" />
        <button type="button" class="location-search-btn" aria-label="搜索" @click="onSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="10.5" cy="10.5" r="5.8" />
            <path d="M15.2 15.2L20 20" />
          </svg>
        </button>
      </div>
    </section>

    <section class="location-block">
      <h2 class="location-block-title">当前位置</h2>
      <div class="location-card location-card-single">
        <span class="location-address-text">{{ displayCurrentAddress }}</span>
        <button type="button" class="location-relocate-btn" @click="onRelocate">
          <span class="location-relocate-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3fbbfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5.2" />
              <path d="M12 2.5V5.3M12 18.7V21.5M2.5 12H5.3M18.7 12H21.5" />
            </svg>
          </span>
          <span>重新定位</span>
        </button>
      </div>
    </section>

    <section class="location-block">
      <h2 class="location-block-title">我的收藏</h2>
      <div class="location-list-card location-list-card-favorite">
        <div v-for="(item, index) in displayFavorites" :key="`favorite-${index}`" class="location-list-row">
          <span class="location-address-text">{{ item }}</span>
          <button type="button" class="location-navigate-btn" aria-label="导航" @click="onNavigate(item)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3.5 10.8L19.7 4.4L13.2 20.6L10.3 13.7L3.5 10.8Z" />
            </svg>
          </button>
        </div>
        <button type="button" class="location-expand-btn" @click="onExpandMore">
          展开更多
          <img :src="expandArrowUrl" alt="" class="location-expand-arrow" />
        </button>
      </div>
    </section>

    <section class="location-block">
      <h2 class="location-block-title">历史记录</h2>
      <div class="location-list-card location-list-card-history">
        <div v-for="(item, index) in displayHistory" :key="`history-${index}`" class="location-list-row">
          <span class="location-address-text">{{ item }}</span>
          <button type="button" class="location-navigate-btn" aria-label="导航" @click="onNavigate(item)">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3.5 10.8L19.7 4.4L13.2 20.6L10.3 13.7L3.5 10.8Z" />
            </svg>
          </button>
        </div>
        <button type="button" class="location-expand-btn" @click="onExpandMore">
          展开更多
          <img :src="expandArrowUrl" alt="" class="location-expand-arrow" />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.location-manage-page {
  min-height: 100%;
  background: var(--nexa-color-surface-page);
  padding: calc(24 * 100vw / var(--nexa-design-width)) calc(25 * 100vw / var(--nexa-design-width))
    calc(24 * 100vw / var(--nexa-design-width));
}

.location-header {
  position: relative;
  height: calc(40 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-back-btn {
  position: absolute;
  left: 0;
  top: 0;
  width: calc(40 * 100vw / var(--nexa-design-width));
  height: calc(40 * 100vw / var(--nexa-design-width));
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-back-btn svg {
  width: calc(20 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
}

.location-title {
  margin: 0;
  color: #000;
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  line-height: calc(60 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.location-search-section {
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
}

.location-search-bar {
  width: calc(340 * 100vw / var(--nexa-design-width));
  height: calc(34 * 100vw / var(--nexa-design-width));
  border: 1px solid var(--nexa-color-brand-primary);
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
  display: grid;
  grid-template-columns: calc(24 * 100vw / var(--nexa-design-width)) 1fr calc(46 * 100vw / var(--nexa-design-width));
  align-items: center;
  padding-left: calc(6 * 100vw / var(--nexa-design-width));
  overflow: hidden;
}

.search-prefix-icon {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  border: 1px solid var(--nexa-color-brand-primary);
  position: relative;
}

.search-prefix-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(6 * 100vw / var(--nexa-design-width));
  height: calc(6 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  background: var(--nexa-color-brand-primary);
  transform: translate(-50%, -50%);
}

.location-search-input {
  border: 0;
  outline: none;
  background: transparent;
  color: #7e818d;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  padding: 0 calc(8 * 100vw / var(--nexa-design-width));
}

.location-search-input::placeholder {
  color: #b1b1b1;
}

.location-search-btn {
  width: calc(42 * 100vw / var(--nexa-design-width));
  height: calc(26 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(8 * 100vw / var(--nexa-design-width));
  background: var(--nexa-color-brand-primary);
  margin-right: calc(2 * 100vw / var(--nexa-design-width));
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-search-btn svg {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
}

.location-block {
  margin-top: calc(14 * 100vw / var(--nexa-design-width));
}

.location-block-title {
  margin: 0 0 calc(6 * 100vw / var(--nexa-design-width));
  color: #7e818d;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.location-card,
.location-list-card {
  width: calc(340 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
}

.location-card-single {
  height: calc(34 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(10 * 100vw / var(--nexa-design-width));
}

.location-address-text {
  color: #7e818d;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.location-relocate-btn {
  border: 0;
  background: transparent;
  color: var(--nexa-color-brand-primary);
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 400;
  height: calc(24 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  gap: calc(4 * 100vw / var(--nexa-design-width));
  padding: 0;
  flex-shrink: 0;
}

.location-relocate-icon {
  width: calc(12 * 100vw / var(--nexa-design-width));
  height: calc(12 * 100vw / var(--nexa-design-width));
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.location-relocate-icon svg {
  width: 100%;
  height: 100%;
}

.location-list-card {
  padding: calc(6 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width))
    calc(4 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  gap: calc(10 * 100vw / var(--nexa-design-width));
}

.location-list-card-favorite {
  min-height: calc(145 * 100vw / var(--nexa-design-width));
}

.location-list-card-history {
  min-height: calc(186 * 100vw / var(--nexa-design-width));
}

.location-list-row {
  height: calc(34 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: calc(10 * 100vw / var(--nexa-design-width));
}

.location-list-row .location-address-text {
  flex: 1;
}

.location-navigate-btn {
  width: calc(42 * 100vw / var(--nexa-design-width));
  height: calc(26 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(8 * 100vw / var(--nexa-design-width));
  background: var(--nexa-color-brand-primary);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.location-navigate-btn svg {
  width: calc(14 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
}

.location-expand-btn {
  width: 100%;
  height: calc(16 * 100vw / var(--nexa-design-width));
  border: 0;
  background: transparent;
  color: #b1b1b1;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: calc(16 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.location-expand-arrow {
  margin-top: calc(-1 * 100vw / var(--nexa-design-width));
  width: calc(6 * 100vw / var(--nexa-design-width));
  height: calc(3 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}
</style>
