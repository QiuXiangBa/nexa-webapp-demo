<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { message } from '@/utils/message';
import { useRouter } from 'vue-router';
import MerchantCategoryTabs, { type MerchantCategory } from '@/components/merchant-map/MerchantCategoryTabs.vue';
import MerchantListCard, { type MerchantListCardModel } from '@/components/merchant-map/MerchantListCard.vue';
import { fetchMerchantMapMerchants, type MerchantMapMerchant } from '@/services/merchant-map';
import { parseError } from '@/services/http';
import AppPageState, { type AppPageStateType } from '@/components/common/AppPageState.vue';

// 商家地图页（Figma node: 25:3379）
// 负责：页面区块编排、分类切换、关键字过滤、商家列表渲染
// 不负责：全局底部导航与路由外壳（由 LayoutView 统一管理）
interface MerchantMapItem extends MerchantListCardModel {
  categoryKey: string;
}

const keyword = ref('');
const loading = ref(false);
const loadError = ref('');
const activeCategory = ref('nearby');
const merchants = ref<MerchantMapItem[]>([]);
const router = useRouter();
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const categories: MerchantCategory[] = [
  { key: 'nearby', label: '附近' },
  { key: 'food', label: '餐饮' },
  { key: 'store', label: '便利店' },
  { key: 'movie', label: '电影' },
  { key: 'other', label: '其他' }
];

const mapLogos = [
  '/pages/merchant-map/98a76fc6-1d5e-4da9-b3a9-c5ff7ffdf607.jpg',
  '/pages/merchant-map/07e2b111-a3a8-4ede-866b-c513759bb71a.png',
  '/pages/merchant-map/61ef3c95-f611-4192-a5e9-dc040e76a41b.png',
  '/pages/merchant-map/f6f71dec-b5c0-4cfb-b7fd-b6c5e67bad6f.png',
  '/pages/merchant-map/46a5ec13-23bb-479f-94b1-4115cce0c77c.png',
  '/pages/merchant-map/8048df4a-bcaf-47a1-bebc-dc5ebb9cb6c4.png',
  '/pages/merchant-map/e1536fd5-770a-4217-ac2e-923e7b0cf8b0.png'
];

const inferCategory = (merchant: MerchantMapMerchant): string => {
  const content = `${merchant.merchantName} ${merchant.assetName || ''}`.toLowerCase();
  if (content.includes('咖啡') || content.includes('奶茶') || content.includes('茶') || content.includes('餐') || content.includes('饮')) {
    return 'food';
  }
  if (content.includes('便利') || content.includes('超市')) {
    return 'store';
  }
  if (content.includes('影') || content.includes('电影')) {
    return 'movie';
  }
  return 'other';
};

const toCard = (merchant: MerchantMapMerchant, index: number): MerchantMapItem => ({
  id: String(merchant.merchantId),
  name: merchant.merchantName,
  ratio: merchant.issueRulePermission === 'ENABLED' ? '0.02%' : '--',
  distance: `${(0.2 + index * 0.3).toFixed(1)} km`,
  logoUrl: mapLogos[index % mapLogos.length],
  categoryKey: inferCategory(merchant)
});

const loadMerchants = async (value: string) => {
  loading.value = true;
  loadError.value = '';
  try {
    const rows = await fetchMerchantMapMerchants(value, 50);
    merchants.value = rows.map((item, index) => toCard(item, index));
  } catch (error) {
    loadError.value = parseError(error, '加载商家地图失败');
    message.error(loadError.value);
  } finally {
    loading.value = false;
  }
};

const triggerSearch = () => {
  void loadMerchants(keyword.value);
};

const openMapDefaultMode = () => {
  router.push('/merchant-map/default').catch(() => undefined);
};

const openLocationManage = () => {
  router.push('/merchant-map/location-manage').catch(() => undefined);
};

// 交互约定：
// 1) "附近" 分类展示全部商家，其他分类按 categoryKey 过滤
// 2) 地图列表由服务端API返回，定位图与距离文案仍为前端占位
const filteredMerchants = computed(() => {
  return merchants.value.filter((item) => {
    const matchCategory = activeCategory.value === 'nearby' || item.categoryKey === activeCategory.value;
    return matchCategory;
  });
});

const pageState = computed<AppPageStateType>(() => {
  if (loading.value) {
    return 'loading';
  }
  if (loadError.value && filteredMerchants.value.length === 0) {
    return 'error';
  }
  if (filteredMerchants.value.length === 0) {
    return 'empty';
  }
  return 'ready';
});

const emptyDescription = computed(() => (activeCategory.value === 'nearby' ? '暂无商家数据' : '该分类暂无商家'));

watch(keyword, () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    void loadMerchants(keyword.value);
  }, 300);
});

onMounted(() => {
  void loadMerchants('');
});

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer);
    searchTimer = null;
  }
});
</script>

<template>
  <div class="merchant-map-page">
    <h2 class="merchant-map-title">数字资产商家地图</h2>

    <div class="merchant-map-search">
      <input v-model="keyword" type="text" class="merchant-map-search-input" placeholder="输入数字资产名称搜索" />
      <button class="merchant-map-search-button" type="button" aria-label="搜索" @click="triggerSearch">
        <img src="/pages/merchant-map/507cb208-fcad-4172-9167-6fc5846857c7.svg" alt="搜索" class="merchant-map-search-icon" />
      </button>
    </div>

    <section class="merchant-map-location">
      <h3 class="merchant-map-section-title">资产商家定位</h3>
      <button type="button" class="map-mode-entry" @click="openMapDefaultMode">
        <img
          src="/pages/merchant-map/ea8412d2-f494-4c56-a3cd-49bd2ab81423.jpg"
          alt="资产商家定位"
          class="merchant-map-image"
        />
      </button>

      <button type="button" class="merchant-map-address" @click="openLocationManage">
        <img src="/pages/merchant-map/e45528a0-c98e-48b7-84c3-d93568a427ad.svg" alt="定位" class="merchant-map-address-icon" />
        <span class="merchant-map-address-text">用户所在地地址 - A幢</span>
        <span class="merchant-map-address-arrow">›</span>
      </button>
    </section>

    <div class="merchant-map-divider" />
    <MerchantCategoryTabs :items="categories" :active-key="activeCategory" @change="activeCategory = $event" />

    <AppPageState
      :state="pageState"
      :error-description="loadError || '加载商家地图失败'"
      :empty-description="emptyDescription"
      :skeleton-rows="5"
      :min-height="220"
      @retry="triggerSearch"
    >
      <section class="merchant-map-list">
        <MerchantListCard v-for="item in filteredMerchants" :key="item.id" :model="item" />
      </section>
    </AppPageState>
  </div>
</template>

<style scoped>
.merchant-map-page {
  /* 页面容器留白交给 PageContainer，页面仅负责业务区块编排。 */
  display: flex;
  flex-direction: column;
}

.merchant-map-title {
  margin: 0;
  text-align: center;
  color: var(--nexa-color-black);
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: 1.2;
}

.merchant-map-search {
  /* 搜索框：设计稿宽 340，按 390 基准换算 */
  width: calc(340 * 100vw / var(--nexa-design-width));
  margin: calc(20 * 100vw / var(--nexa-design-width)) auto 0;
  height: calc(30 * 100vw / var(--nexa-design-width));
  border: calc(1 * 100vw / var(--nexa-design-width)) solid var(--nexa-color-brand-primary);
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: var(--nexa-color-surface-card);
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.24);
  display: grid;
  grid-template-columns: 1fr calc(42 * 100vw / var(--nexa-design-width));
  align-items: center;
  overflow: hidden;
}

.merchant-map-search-input {
  border: 0;
  outline: none;
  background: transparent;
  color: var(--nexa-color-black);
  padding: 0 calc(12 * 100vw / var(--nexa-design-width));
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: 1;
}

.merchant-map-search-input::placeholder {
  color: #b1b1b1;
}

.merchant-map-search-button {
  width: calc(41 * 100vw / var(--nexa-design-width));
  height: calc(26 * 100vw / var(--nexa-design-width));
  margin-right: calc(2 * 100vw / var(--nexa-design-width));
  border: 0;
  border-radius: calc(8 * 100vw / var(--nexa-design-width));
  background: var(--nexa-color-brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.merchant-map-search-icon {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.merchant-map-location {
  margin-top: calc(15 * 100vw / var(--nexa-design-width));
}

.merchant-map-section-title {
  margin: 0 0 calc(9 * 100vw / var(--nexa-design-width));
  color: var(--nexa-color-text-tertiary);
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: 1.2;
  font-weight: 700;
}

.merchant-map-image {
  /* 地图图块：维持设计稿 340x200 的视觉比例 */
  width: calc(340 * 100vw / var(--nexa-design-width));
  height: calc(200 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  display: block;
  object-fit: cover;
}

.map-mode-entry {
  border: 0;
  padding: 0;
  background: transparent;
}

.merchant-map-address {
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  width: 100%;
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
}

.merchant-map-address-icon {
  width: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(15 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.merchant-map-address-text {
  margin-left: calc(8 * 100vw / var(--nexa-design-width));
  color: var(--nexa-color-black);
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 500;
}

.merchant-map-address-arrow {
  margin-left: calc(2 * 100vw / var(--nexa-design-width));
  color: #9fa7b6;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  line-height: 1;
}

.merchant-map-divider {
  width: calc(339 * 100vw / var(--nexa-design-width));
  height: 1px;
  background: #9fa7b6;
  opacity: 0.4;
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
}

.merchant-map-list {
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  gap: calc(10 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(20 * 100vw / var(--nexa-design-width));
}
</style>
