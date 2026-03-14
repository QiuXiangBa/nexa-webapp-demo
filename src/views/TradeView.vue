<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';
import TradeActionGrid, { type TradeActionItem } from '@/components/trade/TradeActionGrid.vue';
import TradeAssetCard, { type TradeAssetCardModel } from '@/components/trade/TradeAssetCard.vue';
import { fetchTradeAssets, type TradeAsset } from '@/services/trade';
import { parseError } from '@/services/http';
import { trackAction } from '@/services/telemetry';
import actionAuctionIcon from '@/assets/icons/pages/trade/action-auction.svg';
import actionTradeIcon from '@/assets/icons/pages/trade/action-trade.svg';
import actionCollectIcon from '@/assets/icons/pages/trade/action-collect.svg';
import actionServiceIcon from '@/assets/icons/pages/trade/action-service.svg';
import actionOtherIcon from '@/assets/icons/pages/trade/action-other.svg';
import searchIcon from '@/assets/icons/pages/trade/search.svg';
import starOutlineIcon from '@/assets/icons/pages/trade/star-outline.svg';
import starActiveIcon from '@/assets/icons/pages/trade/star-active.svg';
import AppPageState, { type AppPageStateType } from '@/components/common/AppPageState.vue';

// 交易中心页（Figma node: 17:2972）
// 负责：页面区块编排、mock 数据绑定、分类激活态切换
// 不负责：底部导航壳层（由 LayoutView + BottomTabBar 统一承载）
const keyword = ref('');
const loading = ref(false);
const loadError = ref('');
const activeCategory = ref('全部');
const router = useRouter();
const categories = ['全部', '艺术品', '餐饮', '科技', '生产'];
const assets = ref<TradeAsset[]>([]);
const favoriteIds = ref<Set<string>>(new Set());
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const actionItems: TradeActionItem[] = [
  { key: 'auction', label: '拍卖', iconUrl: actionAuctionIcon },
  { key: 'trade', label: '交易', iconUrl: actionTradeIcon },
  { key: 'collect', label: '收藏', iconUrl: actionCollectIcon },
  { key: 'service', label: '客服', iconUrl: actionServiceIcon },
  { key: 'other', label: '其他', iconUrl: actionOtherIcon }
];

const heroItems = [
  { assetId: 1, image: '/pages/trade/c9ead2ba-9e05-4ea2-a1e8-da21ad30edaa.jpg' },
  { assetId: 2, image: '/pages/trade/f3136042-90a6-4fd2-b63e-df32564ec0d2.jpg' },
  { assetId: 3, image: '/pages/trade/0545d837-ca7d-4832-8052-bc11bc31379f.jpg' }
];
const favoriteHeroIds = ref<Set<number>>(new Set([1]));
const currentHeroIndex = ref(0);

const onHeroChange = (index: number) => {
  currentHeroIndex.value = index;
};

const onHeroClick = (assetId: number) => {
  void router.push(`/trade/assets/${assetId}`);
};

const onToggleHeroFavorite = (assetId: number) => {
  if (favoriteHeroIds.value.has(assetId)) {
    favoriteHeroIds.value.delete(assetId);
    favoriteHeroIds.value = new Set(favoriteHeroIds.value);
    message.success('已取消收藏');
  } else {
    favoriteHeroIds.value.add(assetId);
    favoriteHeroIds.value = new Set(favoriteHeroIds.value);
    message.success('已加入收藏');
  }
};

const hotItems = [
  { assetId: 1, image: '/pages/trade/b0d2c1ed-6935-4b02-ac59-01b38ab1d7d7.jpg' },
  { assetId: 2, image: '/pages/trade/06ad477d-8ae1-4d4e-9136-52c83acf2be1.png' },
  { assetId: 3, image: '/pages/trade/64ac4632-f808-45ba-964b-c8e8e80bc252.png' },
  { assetId: 4, image: '/pages/trade/1f245841-e292-4b91-acb4-25eebca1a439.png' }
];

const onHotItemClick = (assetId: number) => {
  void router.push(`/trade/assets/${assetId}`);
};

const cardCovers = [
  '/pages/trade/069a847c-1de2-479d-97de-a6aaea8199d6.png',
  '/pages/trade/b86f520c-eb65-49c1-8cb0-d94d046672f1.png'
];

const cardAvatar = '/pages/trade/00168475-eef1-44b7-ad62-8f40e2fcecfb.png';

const cards = computed<TradeAssetCardModel[]>(() => {
  return assets.value.map((item, index) => ({
    id: String(item.assetId),
    cover: cardCovers[index % cardCovers.length],
    avatar: cardAvatar,
    name: item.assetName,
    mode: item.tradeMode === 'FIXED_PRICE' ? '一口价' : '可拍卖',
    price: item.displayPrice || '999,999,999',
    favorite: favoriteIds.value.has(String(item.assetId))
  }));
});

type SortOrder = 'default' | 'desc' | 'asc';
const sortOrder = ref<SortOrder>('default');

const sortLabel = computed(() => {
  if (sortOrder.value === 'asc') return '价值';
  if (sortOrder.value === 'desc') return '价值';
  return '价值';
});

const onSortToggle = () => {
  if (sortOrder.value === 'default') sortOrder.value = 'desc';
  else if (sortOrder.value === 'desc') sortOrder.value = 'asc';
  else sortOrder.value = 'default';
};

const cardsSorted = computed(() => {
  if (sortOrder.value === 'default') return cards.value;
  return [...cards.value].sort((a, b) => {
    const pa = parseFloat(a.price.replace(/,/g, '')) || 0;
    const pb = parseFloat(b.price.replace(/,/g, '')) || 0;
    return sortOrder.value === 'desc' ? pb - pa : pa - pb;
  });
});

const cardsDisplayed = computed(() => cardsSorted.value.slice(0, 6));
const pageState = computed<AppPageStateType>(() => {
  // 有数据时继续展示旧内容，避免切换时内容消失引起闪屏
  // 只在完全没有数据时才展示骨架屏
  if (loading.value && cardsDisplayed.value.length === 0) {
    return 'loading';
  }
  if (loadError.value && cardsDisplayed.value.length === 0) {
    return 'error';
  }
  if (!loading.value && cardsDisplayed.value.length === 0) {
    return 'empty';
  }
  return 'ready';
});

const loadAssets = async () => {
  loading.value = true;
  loadError.value = '';
  try {
    assets.value = await fetchTradeAssets(keyword.value, activeCategory.value, 50);
    trackAction({ action: 'trade_filter_search', status: 'success', scene: 'trade', detail: `keyword=${keyword.value};category=${activeCategory.value}` });
  } catch (error) {
    loadError.value = parseError(error, '加载交易资产失败');
    trackAction({ action: 'trade_filter_search', status: 'failed', scene: 'trade', detail: loadError.value });
    message.error(loadError.value);
  } finally {
    loading.value = false;
  }
};

const onSearch = () => {
  void loadAssets();
};

const onCardClick = (id: string) => {
  void router.push(`/trade/assets/${id}`);
};

const onToggleFavorite = (id: string) => {
  if (favoriteIds.value.has(id)) {
    favoriteIds.value.delete(id);
    message.success('已取消收藏');
  } else {
    favoriteIds.value.add(id);
    message.success('已加入收藏');
  }
};

watch(keyword, () => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    void loadAssets();
  }, 300);
});

onMounted(() => {
  void loadAssets();
});

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer);
    searchTimer = null;
  }
});
</script>

<template>
  <div class="trade-page">
    <h2 class="trade-title">交易中心</h2>

    <div class="trade-search">
      <input v-model="keyword" type="text" class="trade-search-input" placeholder="输入数字资产名称搜索" data-testid="trade-search-input" />
      <button class="trade-search-button" type="button" aria-label="搜索" @click="onSearch">
        <img
          :src="searchIcon"
          alt="搜索"
          class="search-icon-img"
        />
      </button>
    </div>

    <div class="trade-actions-section">
      <TradeActionGrid :items="actionItems" />
    </div>

    <van-tabs
      v-model:active="activeCategory"
      class="trade-category-tabs"
      :border="false"
      animated
      swipeable
      @change="loadAssets"
    >
      <van-tab v-for="cat in categories" :key="cat" :name="cat" :title="cat">
        <!-- 刷新时顶部进度条，不打断已有内容展示 -->
        <div class="trade-refresh-bar" :class="{ active: loading }" />
        <AppPageState
          :state="pageState"
          :error-description="loadError || '加载交易资产失败'"
          empty-description="暂无交易资产"
          :skeleton-rows="7"
          :min-height="420"
          @retry="loadAssets"
        >
          <div class="trade-content-panel">
            <section class="trade-hero-section">
              <van-swipe
                class="trade-hero-swipe"
                :autoplay="0"
                :loop="true"
                :show-indicators="false"
                @change="onHeroChange"
              >
                <van-swipe-item
                  v-for="item in heroItems"
                  :key="item.assetId"
                  class="trade-hero-swipe-item"
                >
                  <article class="trade-hero-card" role="button" @click="onHeroClick(item.assetId)">
                    <img :src="item.image" alt="数字资产" class="trade-hero-image" />
                    <button
                      class="trade-hero-star-btn"
                      type="button"
                      :aria-label="favoriteHeroIds.has(item.assetId) ? '取消收藏' : '加入收藏'"
                      @click.stop="onToggleHeroFavorite(item.assetId)"
                    >
                      <img
                        :src="favoriteHeroIds.has(item.assetId) ? starActiveIcon : starOutlineIcon"
                        alt=""
                        class="trade-hero-star"
                      />
                    </button>
                  </article>
                </van-swipe-item>
              </van-swipe>

              <div class="trade-hero-dots">
                <span
                  v-for="(_, idx) in heroItems"
                  :key="idx"
                  class="dot"
                  :class="{ active: idx === currentHeroIndex }"
                />
              </div>
            </section>

            <section class="trade-hot-panel">
              <h3 class="trade-hot-title">热门数字资产</h3>

              <div class="trade-hot-thumbnails">
                <img
                  v-for="item in hotItems"
                  :key="item.assetId"
                  :src="item.image"
                  alt="热门数字资产"
                  class="trade-hot-thumb"
                  role="button"
                  @click="onHotItemClick(item.assetId)"
                />
              </div>

              <button type="button" class="trade-sort-btn" :class="{ active: sortOrder !== 'default' }" @click="onSortToggle">
                {{ sortLabel }}
                <span class="trade-sort-arrow" :class="sortOrder">▼</span>
              </button>

              <div class="trade-card-list">
                <TradeAssetCard
                  v-for="card in cardsDisplayed"
                  :key="card.id"
                  :model="card"
                  @click="onCardClick"
                  @toggle-favorite="onToggleFavorite"
                />
              </div>
            </section>
          </div>
        </AppPageState>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style scoped>
.trade-page {
  /* 页面容器留白交给 PageContainer，页面内只保留区块编排。 */
  display: flex;
  flex-direction: column;
}

.trade-title {
  margin: 0 0 calc(20 * 100vw / var(--nexa-design-width));
  text-align: center;
  color: var(--nexa-color-black);
  font-size: calc(16 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: 1.2;
}

.trade-search {
  /* 搜索框：设计稿宽 340、高 30，右侧固定 42 宽按钮 */
  width: calc(340 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
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

.trade-search-input {
  border: 0;
  outline: none;
  background: transparent;
  color: var(--nexa-color-black);
  padding: 0 calc(12 * 100vw / var(--nexa-design-width));
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  line-height: 1;
}

.trade-search-input::placeholder {
  color: #b1b1b1;
}

.trade-search-button {
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

.search-icon-img {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

/* 刷新进度条：有旧数据时替代骨架屏，轻量提示正在加载 */
.trade-refresh-bar {
  height: 2px;
  background: transparent;
  overflow: hidden;
  position: relative;
  margin-bottom: calc(4 * 100vw / var(--nexa-design-width));
}

.trade-refresh-bar.active::after {
  content: '';
  position: absolute;
  left: -50%;
  top: 0;
  width: 40%;
  height: 100%;
  background: var(--nexa-color-brand-primary, #3fbbfa);
  border-radius: 1px;
  animation: trade-bar-slide 0.8s ease-in-out infinite;
}

@keyframes trade-bar-slide {
  0%   { left: -40%; }
  100% { left: 110%; }
}

/* van-tabs 分类：复刻原灰底白色胶囊 tab 样式 */
.trade-category-tabs {
  width: calc(356 * 100vw / var(--nexa-design-width));
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
}

.trade-category-tabs :deep(.van-tabs__nav) {
  background: #f0f0f0;
  border-radius: calc(8 * 100vw / var(--nexa-design-width));
  padding: calc(3 * 100vw / var(--nexa-design-width)) calc(4 * 100vw / var(--nexa-design-width));
  gap: 0;
  height: auto;
}

.trade-category-tabs :deep(.van-tabs__wrap) {
  height: auto;
}

.trade-category-tabs :deep(.van-tab) {
  flex: 1;
  padding: calc(4 * 100vw / var(--nexa-design-width)) calc(6 * 100vw / var(--nexa-design-width));
  font-size: calc(9 * 100vw / var(--nexa-design-width));
  color: #888;
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  background: transparent;
  transition: background 0.2s ease, color 0.2s ease, font-weight 0.2s ease;
  line-height: 1.4;
}

.trade-category-tabs :deep(.van-tab--active) {
  background: #fff;
  color: #333;
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.trade-category-tabs :deep(.van-tabs__line) {
  display: none;
}

/* 防止 van-swipe 产生横向溢出 */
.trade-category-tabs :deep(.van-tabs__content),
.trade-category-tabs :deep(.van-swipe),
.trade-category-tabs :deep(.van-swipe-item) {
  width: 100%;
  overflow: hidden;
}

.trade-hero-section {
  margin-top: 0;
}

.trade-actions-section {
  width: calc(280 * 100vw / var(--nexa-design-width));
  margin-left: auto;
  margin-right: auto;
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
  margin-bottom: calc(12 * 100vw / var(--nexa-design-width));
}

.trade-content-panel {
  width: calc(356 * 100vw / var(--nexa-design-width));
  margin-left: auto;
  margin-right: auto;
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
  background: var(--nexa-color-surface-muted);
  border-radius: calc(20 * 100vw / var(--nexa-design-width));
  padding: 0 0 calc(12 * 100vw / var(--nexa-design-width));
}

.trade-hero-swipe {
  width: 100%;
  border-radius: calc(12 * 100vw / var(--nexa-design-width));
  overflow: hidden;
}

.trade-hero-swipe-item {
  padding: calc(8 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
  background: var(--nexa-color-surface-muted);
  box-sizing: border-box;
}

.trade-hero-card {
  width: 100%;
  height: calc(130 * 100vw / var(--nexa-design-width));
  border: calc(1 * 100vw / var(--nexa-design-width)) solid #3fbbfa;
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  overflow: hidden;
  position: relative;
  background: var(--nexa-color-surface-card);
  cursor: pointer;
  transition: opacity 0.15s;
}

.trade-hero-card:active {
  opacity: 0.85;
}

.trade-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.trade-hero-star-btn {
  position: absolute;
  right: calc(2 * 100vw / var(--nexa-design-width));
  bottom: calc(2 * 100vw / var(--nexa-design-width));
  width: calc(28 * 100vw / var(--nexa-design-width));
  height: calc(28 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.trade-hero-star {
  width: calc(14 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.trade-hero-dots {
  height: calc(14 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(6 * 100vw / var(--nexa-design-width));
}

.dot {
  width: calc(4 * 100vw / var(--nexa-design-width));
  height: calc(4 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  background: #d9d9d9;
}

.dot.active {
  width: calc(10 * 100vw / var(--nexa-design-width));
  border-radius: calc(2 * 100vw / var(--nexa-design-width));
  background: #ff6000;
}

.trade-hot-panel {
  /* 热门区块：浅灰底大容器，承载缩略图、排序按钮和双列卡片 */
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
  background: transparent;
  border-radius: 0;
  padding: 0 calc(8 * 100vw / var(--nexa-design-width));
}

.trade-hot-title {
  margin: 0;
  color: var(--nexa-color-text-tertiary);
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: 1;
  font-weight: 700;
}

.trade-hot-thumbnails {
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
  display: grid;
  grid-template-columns: repeat(4, calc(82 * 100vw / var(--nexa-design-width)));
  justify-content: space-between;
  gap: calc(0 * 100vw / var(--nexa-design-width));
}

.trade-hot-thumb {
  width: calc(82 * 100vw / var(--nexa-design-width));
  height: calc(82 * 100vw / var(--nexa-design-width));
  border: calc(1 * 100vw / var(--nexa-design-width)) solid var(--nexa-color-brand-primary);
  border-radius: calc(6 * 100vw / var(--nexa-design-width));
  object-fit: cover;
  background: var(--nexa-color-surface-card);
  cursor: pointer;
  transition: opacity 0.15s;
}

.trade-hot-thumb:active {
  opacity: 0.75;
}

.trade-sort-btn {
  margin-top: calc(12 * 100vw / var(--nexa-design-width));
  margin-left: calc(28 * 100vw / var(--nexa-design-width));
  min-width: calc(50 * 100vw / var(--nexa-design-width));
  padding: 0 calc(8 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
  border: calc(1 * 100vw / var(--nexa-design-width)) solid transparent;
  border-radius: calc(12 * 100vw / var(--nexa-design-width));
  background: var(--nexa-color-surface-page);
  color: var(--nexa-color-text-tertiary);
  font-size: calc(8 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(3 * 100vw / var(--nexa-design-width));
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;
}

.trade-sort-btn.active {
  background: #e8f7ff;
  color: var(--nexa-color-brand-primary, #3fbbfa);
  border-color: var(--nexa-color-brand-primary, #3fbbfa);
}

.trade-sort-arrow {
  font-size: calc(6 * 100vw / var(--nexa-design-width));
  display: inline-block;
  transition: transform 0.2s ease;
}

.trade-sort-arrow.asc {
  transform: rotate(180deg);
}

.trade-sort-arrow.desc {
  transform: rotate(0deg);
}

.trade-sort-arrow.default {
  opacity: 0.5;
}

.trade-card-list {
  margin-top: calc(10 * 100vw / var(--nexa-design-width));
  display: grid;
  grid-template-columns: repeat(2, calc(144 * 100vw / var(--nexa-design-width)));
  justify-content: center;
  gap: calc(16 * 100vw / var(--nexa-design-width));
}
</style>
