<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';
import { fetchMyLatestMerchantApplication, toMerchantEntryGuide, type MerchantApplication } from '@/services/merchant';
import { parseError } from '@/services/http';
import { formatTime } from '@/utils/format';

const router = useRouter();
const loading = ref(false);
const latest = ref<MerchantApplication | null>(null);

const load = async () => {
  loading.value = true;
  try {
    latest.value = await fetchMyLatestMerchantApplication();
  } catch (error) {
    message.error(parseError(error, '加载商家申请状态失败'));
  } finally {
    loading.value = false;
  }
};

const goMerchantApply = () => {
  void router.push('/merchant-apply');
};

onMounted(() => {
  void load();
});
</script>

<template>
  <section class="merchant-section panel">
    <div class="panel-header">
      <span>商家申请入口</span>
      <van-button size="small" plain type="primary" @click="load">刷新</van-button>
    </div>

    <div class="guide-box">
      <div class="guide-title">{{ toMerchantEntryGuide(latest?.status).statusText }}</div>
      <div class="guide-sub">{{ toMerchantEntryGuide(latest?.status).guideText }}</div>
      <van-button type="primary" size="small" @click="goMerchantApply">前往商家申请页</van-button>
    </div>

    <van-cell-group v-if="latest" inset>
      <van-cell title="申请单号" :value="String(latest.id)" />
      <van-cell title="商家名称" :value="latest.merchantName" />
      <van-cell title="提交时间" :value="formatTime(latest.createdAt)" />
      <van-cell title="审核时间" :value="formatTime(latest.reviewedAt)" />
      <van-cell title="加入时间" :value="formatTime(latest.joinedAt)" />
    </van-cell-group>

    <div v-if="loading" class="panel-loading">
      <van-loading size="20px" vertical>加载中...</van-loading>
    </div>
  </section>
</template>

<style scoped>
.panel {
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}

.guide-box {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.guide-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.guide-sub {
  font-size: 12px;
  color: #475569;
}

.panel-loading {
  padding: 16px 0;
}
</style>
