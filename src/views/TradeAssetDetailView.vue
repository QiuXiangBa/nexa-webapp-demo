<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from '@/utils/message';
import { parseError } from '@/services/http';
import { fetchTradeAssetDetail, type TradeAssetDetail } from '@/services/trade';
import TradeDetailTopBar from '@/components/trade-detail/TradeDetailTopBar.vue';
import TradeDetailHero from '@/components/trade-detail/TradeDetailHero.vue';
import TradeDetailSearchStrip from '@/components/trade-detail/TradeDetailSearchStrip.vue';
import TradeDetailBottomPanel from '@/components/trade-detail/TradeDetailBottomPanel.vue';

// 交易详情页（Figma node: 96:254）
// 负责：详情数据加载、交易详情视觉还原、收藏/预交易/购买入口动作反馈
// 不负责：真实下单闭环（当前版本仅入口反馈）
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const favorite = ref(false);
const detail = ref<TradeAssetDetail | null>(null);

const heroImageUrl = '/pages/trade-asset-detail/895420a5-79f0-4bc8-9a97-7529f33da9e5.png';
const sellerAvatarUrl = '/pages/trade-asset-detail/83ce6dc6-5f34-4063-b44d-ff7ebcca50a0.png';
const searchIconUrl = '/pages/trade-asset-detail/158aaa0e-8391-42c0-8bce-4f8caaf89492.svg';
const arrowIconUrl = '/pages/trade-asset-detail/c7c61748-ce72-4448-8b0a-9b533dc88b91.svg';
const backButtonUrl = '/pages/trade-asset-detail/bd5602c1-39c1-4a19-8b91-1de6d6a1281e.svg';
const favoriteIconUrl = '/pages/trade-asset-detail/b0fbe112-6d72-49db-9555-33ffa983ea23.svg';
const cartIconUrl = '/pages/trade-asset-detail/604ce866-1c01-471f-87b1-a9eafe3850e2.svg';

const descriptionText = '商品说明 商品说明 商品说明 商品说明 商品说明 商品说明 商品说明 商品说明 商品说明 商品说明 商品说明 商品说明';

const assetId = computed(() => {
  const id = Number(route.params.assetId);
  return Number.isFinite(id) ? id : 0;
});

const formatPrice = (raw?: string): string => {
  const value = String(raw || '0').replace(/\D/g, '');
  if (!value) return '￥ 0';
  return `￥ ${value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
};

const sellerName = computed(() => detail.value?.merchantName ? `卖家 / ${detail.value.merchantName}` : '卖家 / 店铺名称');
const priceText = computed(() => formatPrice(detail.value?.displayPrice));
const titleText = computed(() => `${detail.value?.assetName || '数字商品名称'} ${detail.value?.assetName || '数字商品名称'}`);

const load = async () => {
  if (!assetId.value) {
    message.error('资产ID无效');
    return;
  }

  loading.value = true;
  try {
    detail.value = await fetchTradeAssetDetail(assetId.value);
  } catch (error) {
    message.error(parseError(error, '加载资产详情失败'));
  } finally {
    loading.value = false;
  }
};

const onBack = () => {
  router.back();
};

const onSearch = () => {
  message.info('搜索入口待接入');
};

const onConsult = () => {
  message.info('咨询入口待接入');
};

const onFavorite = () => {
  favorite.value = !favorite.value;
  message.success(favorite.value ? '已加入收藏' : '已取消收藏');
};

const onPreTrade = () => {
  message.info('预交易入口已触发');
};

const onBuyNow = () => {
  message.info('立即购买入口已触发');
};

onMounted(() => {
  void load();
});
</script>

<template>
  <div class="trade-detail-page">
    <div v-if="loading" class="trade-detail-loading-mask">
      <van-loading type="spinner" size="20px" color="#3fbbfa">加载中...</van-loading>
    </div>

    <TradeDetailTopBar :seller-name="sellerName" :avatar-url="sellerAvatarUrl" :back-button-url="backButtonUrl" @back="onBack" />

    <TradeDetailHero :hero-image-url="heroImageUrl" :description="descriptionText" />

    <TradeDetailSearchStrip
      :text="'相关搜索 · 产品名称 / 关键词'"
      :search-icon-url="searchIconUrl"
      :arrow-icon-url="arrowIconUrl"
      @search="onSearch"
    />

    <TradeDetailBottomPanel
      :thumb-url="heroImageUrl"
      :price-text="priceText"
      :title-text="titleText"
      :favorite="favorite"
      :favorite-icon-url="favoriteIconUrl"
      :cart-icon-url="cartIconUrl"
      @consult="onConsult"
      @favorite="onFavorite"
      @pre-trade="onPreTrade"
      @buy-now="onBuyNow"
    />
  </div>
</template>

<style scoped>
.trade-detail-page {
  min-height: 100dvh;
  background: #f9faff;
  position: relative;
  overflow-x: hidden;
  /* 为固定底部面板留出空间，防止内容被遮 */
  padding-bottom: calc(120 * 100vw / var(--nexa-design-width) + env(safe-area-inset-bottom));
}

.trade-detail-loading-mask {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(249, 250, 255, 0.66);
}
</style>
