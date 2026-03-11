<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { message } from '@/utils/message';
import { fetchMyRebates, type RebateRecord } from '@/services/rebate';
import { formatStatus, formatTime } from '@/utils/format';
import { parseError } from '@/services/http';

const loading = ref(false);
const rows = ref<RebateRecord[]>([]);

const load = async () => {
  loading.value = true;
  try {
    rows.value = await fetchMyRebates(30);
  } catch (error) {
    message.error(parseError(error, '加载返利记录失败'));
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  void load();
});
</script>

<template>
  <section class="rebate-section panel">
    <div class="panel-header">
      <span>我的返利</span>
      <van-button size="small" plain type="primary" @click="load">刷新</van-button>
    </div>

    <div v-if="loading" class="panel-loading">
      <van-loading size="20px" vertical>加载中...</van-loading>
    </div>

    <van-empty v-else-if="!rows.length" description="暂无返利记录" />

    <div v-else class="rebate-list">
      <div v-for="row in rows" :key="row.id" class="rebate-item">
        <div class="rebate-main">
          <span>返利#{{ row.id }}</span>
          <span>{{ row.rebateAmount }}</span>
        </div>
        <div class="rebate-sub">订单ID：{{ row.orderId }}</div>
        <div class="rebate-sub">被邀请人：{{ row.inviteeId }}</div>
        <div class="rebate-sub">状态：{{ formatStatus(row.status) }}</div>
        <div class="rebate-sub">结算时间：{{ formatTime(row.settledAt) }}</div>
      </div>
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

.panel-loading {
  padding: 18px 0;
}

.rebate-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rebate-item {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  padding: 10px;
}

.rebate-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
}

.rebate-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}
</style>
