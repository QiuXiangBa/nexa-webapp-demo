<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';
import MerchantMapModeCard, { type MerchantMapModeCardModel } from '@/components/merchant-map/MerchantMapModeCard.vue';
import MerchantMapOverlayTopBar from '@/components/merchant-map/MerchantMapOverlayTopBar.vue';
import AppBizImage from '@/components/common/AppBizImage.vue';
import { fetchMerchantMapMerchants, type MerchantMapMerchant } from '@/services/merchant-map';
import { parseError } from '@/services/http';

// 商家地图默认地图模式子页（Figma node: 70:3424 / 70:3581）
// 负责：全屏地图 + 顶部搜索 + 底部抽屉列表/详情态切换
// 不负责：真实地图 SDK 与实时定位（当前版本使用静态地图图层）
const keyword = ref('');
const loading = ref(false);
const router = useRouter();
interface MerchantMapDetailModel extends MerchantMapModeCardModel {
  description: string;
  distanceText: string;
}

const merchants = ref<MerchantMapDetailModel[]>([]);
const isSheetCollapsed = ref(true);
const selectedMerchantId = ref<string | null>(null);
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const mapBgUrl = '/pages/merchant-map-default/fd3dc128-225d-4ed1-a48c-24b7192d7ae4.png';
const searchIconUrl = '/pages/merchant-map-default/507cb208-fcad-4172-9167-6fc5846857c7.svg';
const mapRadiusUrl = '/pages/merchant-map-default/3fa8ce6c-4d56-4307-803a-89d71512a9a6.svg';
const locateButtonUrl = '/pages/merchant-map-default/ccc8ced0-67c4-4b33-bd49-5a5595041e23.svg';
const addressIconUrl = '/pages/merchant-map-default/e45528a0-c98e-48b7-84c3-d93568a427ad.svg';
const jtRight = '/pages/merchant-map-default/jt-right.svg';

const mapLogos = [
  '/pages/merchant-map-default/3d4e26da-0549-4fd6-806f-94b8cfb21cd5.jpg',
  '/pages/merchant-map-default/1db287ff-ac30-4e32-bc20-c1e348516a7c.png',
  '/pages/merchant-map-default/857c9e76-7bcb-4db4-a565-a9896280dcc6.png',
  '/pages/merchant-map-default/35018120-b59d-4137-8154-f4457669c441.png',
  '/pages/merchant-map-default/1c3cdccd-bab6-48c8-a6aa-e45b3a0c4a33.png',
  '/pages/merchant-map-default/24244db0-3b00-441f-80a5-f065f91cef06.png',
  '/pages/merchant-map-default/9c72fcee-5155-483e-9b7a-38d8ee32beb4.png'
];

const markerPoints = [
  { top: '28%', left: '58%' },
  { top: '36%', left: '16%' },
  { top: '40%', left: '52%' },
  { top: '49%', left: '44%' },
  { top: '58%', left: '74%' },
  { top: '64%', left: '28%' },
  { top: '71%', left: '64%' }
];

const toCard = (merchant: MerchantMapMerchant, index: number): MerchantMapDetailModel => ({
  id: String(merchant.merchantId),
  name: merchant.merchantName,
  ratio: merchant.issueRulePermission === 'ENABLED' ? '0.02%' : '--',
  distance: '1.7 km',
  logoUrl: mapLogos[index % mapLogos.length],
  description: `${merchant.merchantName}商家介绍 商家介绍 商家介绍 商家介绍 商家介绍 商家介绍 商家介绍`,
  distanceText: `${203 + index * 37}米`
});

const visibleList = computed(() => merchants.value.slice(0, 4));
const visibleMarkers = computed(() => merchants.value.slice(0, 7));
const selectedMerchant = computed(() => {
  return merchants.value.find((item) => item.id === selectedMerchantId.value) ?? null;
});
const sheetHandleTip = computed(() => {
  if (isSheetCollapsed.value) {
    return selectedMerchant.value ? '展开商家详情' : '展开商家列表';
  }
  return selectedMerchant.value ? '收起商家详情' : '收起商家列表';
});
const locateBottom = computed(() =>
  isSheetCollapsed.value
    ? 'calc(56 * 100vw / var(--nexa-design-width) + env(safe-area-inset-bottom))'
    : 'calc(288 * 100vw / var(--nexa-design-width) + env(safe-area-inset-bottom))'
);

const onBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }
  void router.push('/merchant-map');
};

const toggleSheet = () => {
  isSheetCollapsed.value = !isSheetCollapsed.value;
};

// 地图页交互约定：
// 1) 点击商家 marker 或列表卡片，进入“商家详情”态；
// 2) 收起抽屉不丢失选中状态，重新展开仍展示当前商家详情；
// 3) 点击地址行跳转到“定位管理”页。
const openMerchantDetail = (item: MerchantMapDetailModel) => {
  selectedMerchantId.value = item.id;
  isSheetCollapsed.value = false;
};

const triggerSearch = () => {
  void loadMerchants(keyword.value);
};

const handleAddressRowClick = () => {
  router.push('/merchant-map/location-manage').catch(() => undefined);
};

const openMerchantAssetDetail = () => {
  if (!selectedMerchant.value) {
    return;
  }
  router
    .push({
      path: '/merchant-map/detail',
      query: {
        merchantId: selectedMerchant.value.id,
        merchantName: selectedMerchant.value.name,
        logoUrl: selectedMerchant.value.logoUrl,
        issuedAt: '2025年12月'
      }
    })
    .catch(() => undefined);
};

const loadMerchants = async (value: string) => {
  loading.value = true;
  try {
    const rows = await fetchMerchantMapMerchants(value, 50);
    merchants.value = rows.map((item, index) => toCard(item, index));
    if (selectedMerchantId.value && !merchants.value.some((item) => item.id === selectedMerchantId.value)) {
      selectedMerchantId.value = null;
    }
  } catch (error) {
    message.error(parseError(error, '加载商家地图失败'));
  } finally {
    loading.value = false;
  }
};

watch(keyword, () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => void loadMerchants(keyword.value), 300);
});

onMounted(() => void loadMerchants(''));

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer);
    searchTimer = null;
  }
});
</script>

<template>
  <div class="merchant-map-page">
    <div v-if="loading" class="merchant-map-default-loading-mask">
      <van-loading type="spinner" size="20px" color="#3fbbfa">加载中...</van-loading>
    </div>

    <img :src="mapBgUrl" alt="" class="map-bg" />
    <img :src="mapRadiusUrl" alt="" class="map-radius" />

    <MerchantMapOverlayTopBar v-model="keyword" :search-icon-url="searchIconUrl" @search="triggerSearch" @back="onBack" />

    <div class="map-marker-layer">
      <button
        v-for="(item, index) in visibleMarkers"
        :key="item.id"
        type="button"
        class="marker"
        :class="{ 'marker-active': selectedMerchant?.id === item.id }"
        :style="markerPoints[index]"
        @click="openMerchantDetail(item)"
      >
        <AppBizImage :src="item.logoUrl" :alt="item.name" fallback-src="/pages/common/logo-fallback.svg" />
      </button>
    </div>

    <button type="button" class="locate-btn" aria-label="定位" :style="{ bottom: locateBottom }">
      <img :src="locateButtonUrl" alt="" />
    </button>

    <section class="bottom-sheet" :class="{ 'bottom-sheet-collapsed': isSheetCollapsed }">
      <button type="button" class="sheet-handle" @click="toggleSheet">
        <span class="sheet-handle-bar" />
        <span class="sheet-handle-tip">{{ sheetHandleTip }}</span>
      </button>

      <div v-show="!isSheetCollapsed" class="sheet-content">
        <button type="button" class="address-row" @click="handleAddressRowClick">
          <img :src="addressIconUrl" alt="" class="address-icon" />
          <span class="address-text">用户所在地地址 - A幢 </span>
          <img :src="jtRight" alt="" class="address-icon" />
        </button>

        <template v-if="selectedMerchant">
          <section class="merchant-detail-panel">
            <div class="merchant-detail-head">
              <AppBizImage :src="selectedMerchant.logoUrl" :alt="selectedMerchant.name" fallback-src="/pages/common/logo-fallback.svg" class="merchant-detail-logo" />
              <div class="merchant-detail-main">
                <h3 class="merchant-detail-name">{{ selectedMerchant.name }}</h3>
                <p class="merchant-detail-desc">{{ selectedMerchant.description }}</p>
              </div>
            </div>
            <p class="merchant-detail-ratio">数字资产发行比例：{{ selectedMerchant.ratio }}</p>
            <div class="merchant-detail-divider" />

            <button type="button" class="merchant-detail-go" @click="openMerchantAssetDetail">
              <span class="merchant-detail-go-circle">
                <img src="/pages/merchant-map-default/89eb1969-8355-4a6e-9545-e9dac3593c18.svg" alt="" class="merchant-detail-go-icon" />
              </span>
              <span class="merchant-detail-go-dist">{{ selectedMerchant?.distanceText || '距离--' }}</span>
            </button>



          </section>
        </template>
        <div v-else class="list-wrap">
          <button v-for="item in visibleList" :key="item.id" type="button" class="list-item-button" @click="openMerchantDetail(item)">
            <MerchantMapModeCard :model="item" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.merchant-map-page {
  position: relative;
  /* 全屏地图容器直接跟随可视区，不再用设计稿高度做 dvh 缩放。 */
  height: 100dvh;
  background: #f9faff;
  overflow: hidden;
}

.merchant-map-default-loading-mask {
  position: absolute;
  inset: 0;
  z-index: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(249, 250, 255, 0.66);
}

.map-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100dvh;
  object-fit: cover;
}

.map-radius {
  position: absolute;
  left: calc(104 * 100vw / var(--nexa-design-width));
  top: calc(178 * 100vw / var(--nexa-design-width));
  width: calc(286 * 100vw / var(--nexa-design-width));
  height: calc(320 * 100vw / var(--nexa-design-width));
}

.map-marker-layer {
  position: absolute;
  inset: 0;
}

.marker {
  position: absolute;
  width: calc(20 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  border: 1px solid #3fbbfa;
  border-radius: calc(3 * 100vw / var(--nexa-design-width));
  overflow: hidden;
  background: transparent;
  padding: 0;
}

.marker-active {
  border-color: #0d7ab5;
  box-shadow: 0 0 0 calc(1 * 100vw / var(--nexa-design-width)) rgba(13, 122, 181, 0.28);
}

.marker :deep(.van-image) {
  width: 100%;
  height: 100%;
}

.marker :deep(.van-image__img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.locate-btn {
  position: absolute;
  right: calc(10 * 100vw / var(--nexa-design-width));
  width: calc(24 * 100vw / var(--nexa-design-width));
  height: calc(24 * 100vw / var(--nexa-design-width));
  border: 0;
  background: transparent;
  padding: 0;
}

.locate-btn img {
  width: 100%;
  height: 100%;
}

.bottom-sheet {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  max-height: min(calc(280 * 100vw / var(--nexa-design-width)), 100dvh);
  background: #f9faff;
  border-radius: calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width)) 0 0;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.14);
  /* flex 列布局：handle 吸顶，内容区独立滚动 */
  display: flex;
  flex-direction: column;
  transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease, background 0.25s ease;
  z-index: 100;
  overflow: hidden;
}

.bottom-sheet-collapsed {
  max-height: min(calc(42 * 100vw / var(--nexa-design-width)), 100dvh);
  background: transparent;
  box-shadow: none;
}

.sheet-handle {
  /* 不参与滚动，始终吸顶 */
  flex-shrink: 0;
  width: 100%;
  padding: calc(4 * 100vw / var(--nexa-design-width)) 0 calc(6 * 100vw / var(--nexa-design-width));
  border: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sheet-handle-bar {
  width: calc(40 * 100vw / var(--nexa-design-width));
  height: calc(4 * 100vw / var(--nexa-design-width));
  border-radius: calc(30 * 100vw / var(--nexa-design-width));
  background: #bebebe;
}

.sheet-handle-tip {
  margin-top: calc(4 * 100vw / var(--nexa-design-width));
  color: #7e818d;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 600;
}

.sheet-content {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 0 calc(15 * 100vw / var(--nexa-design-width)) calc(max(12 * 100vw / var(--nexa-design-width), env(safe-area-inset-bottom)));
}

.address-row {
  width: 100%;
  height: calc(40 * 100vw / var(--nexa-design-width));
  border: 0;
  background: #fff;
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  display: grid;
  grid-template-columns: calc(10 * 100vw / var(--nexa-design-width)) 1fr auto auto;
  align-items: center;
  column-gap: calc(8 * 100vw / var(--nexa-design-width));
  padding: 0 calc(10 * 100vw / var(--nexa-design-width));
}

.address-icon {
  width: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(15 * 100vw / var(--nexa-design-width));
}

.address-text {
  text-align: left;
  color: #000;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.address-arrow {
  color: #4f4f4f;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
}

.address-distance {
  color: #7e818d;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 400;
  white-space: nowrap;
}

.list-wrap {
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
  gap: calc(6 * 100vw / var(--nexa-design-width));
}

.list-item-button {
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
}

.merchant-detail-panel {
  width: 100%;
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
  display: flex;
  flex-direction: column;
}

.merchant-detail-head {
  display: grid;
  grid-template-columns: calc(94 * 100vw / var(--nexa-design-width)) 1fr;
  column-gap: calc(10 * 100vw / var(--nexa-design-width));
  align-items: start;
}

.merchant-detail-logo {
  width: calc(94 * 100vw / var(--nexa-design-width));
  height: calc(94 * 100vw / var(--nexa-design-width));
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  display: block;
}

.merchant-detail-logo :deep(.van-image__img) {
  object-fit: cover;
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
}

.merchant-detail-main {
  min-width: 0;
}

.merchant-detail-name {
  margin: calc(8 * 100vw / var(--nexa-design-width)) 0 0;
  color: #7e818d;
  font-size: calc(34 / 3 * 100vw / var(--nexa-design-width));
  line-height: 1.3;
  font-weight: 700;
}

.merchant-detail-desc {
  margin: calc(8 * 100vw / var(--nexa-design-width)) 0 0;
  color: #7e818d;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: 1.3;
  font-weight: 500;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.merchant-detail-ratio {
  margin: calc(8 * 100vw / var(--nexa-design-width)) 0 0;
  text-align: center;
  color: #7e818d;
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: 1.2;
  font-weight: 700;
}

.merchant-detail-divider {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
  width: 100%;
  height: 1px;
  background: #989c9e;
}

.merchant-detail-go {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: calc(6 * 100vw / var(--nexa-design-width));
  margin-left: auto;
  border: 0;
  background: transparent;
  padding: 0;
}

.merchant-detail-go-circle {
  width: calc(24 * 100vw / var(--nexa-design-width));
  height: calc(24 * 100vw / var(--nexa-design-width));
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.merchant-detail-go-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.merchant-detail-go-dist {
  margin: calc(2 * 100vw / var(--nexa-design-width)) 0 0;
  color: #7e818d;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
}
</style>
