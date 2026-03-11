<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';
import SpaceHeader from '@/components/space/SpaceHeader.vue';
import SpaceEntryCards from '@/components/space/SpaceEntryCards.vue';
import SpaceSectionList from '@/components/space/SpaceSectionList.vue';
import AppPageState, { type AppPageStateType } from '@/components/common/AppPageState.vue';
import type { SpaceEntryItem } from '@/components/space/SpaceEntryCard.vue';
import type { SpaceSection } from '@/components/space/SpaceSectionCard.vue';
import { fetchMyLatestMerchantApplication, toMerchantEntryGuide } from '@/services/merchant';
import { parseError } from '@/services/http';

const router = useRouter();
const merchantStatus = ref<string | undefined>(undefined);
const loading = ref(false);
const loadError = ref('');

const pageTitle = '数字资产 · 可信空间说明';
const pageSubtitle = '欢迎来到数字资产空间。在这里，您的每一次消费都不再是\n单纯的支出，而是个人数字资产的积累与可信价值的共建。';

const entryItems = ref<SpaceEntryItem[]>([
  {
    key: 'asset',
    title: '数字资产',
    desc: '商家发行准入申请',
    icon: '/pages/space/2998d692-d0a6-4055-81d6-66731e840c38.svg'
  },
  {
    key: 'expert',
    title: '数资达人',
    desc: '身份认证申请',
    icon: '/pages/space/8b959453-e837-46e5-8332-432ce1159e99.svg'
  }
]);

const sections: SpaceSection[] = [
  {
    key: 'what',
    title: '一、 什么是您的“数字资产”？',
    lines: [
      '在我们的生态中，消费即贡献。',
      '每一份数字资产的产生，都对应着实体商家的真实经营折扣',
      '入金，资产价值看得见、摸得着。',
      '通过独特的“共识储备”模型，生态价值随全网消费总量持续',
      '积淀。这意味着，您持有的资产具有稳健的增值潜力。',
      '它既是您的消费凭证，也是您的信用背书，未来可用于全生',
      '态商品的权益兑换。'
    ]
  },
  {
    key: 'how',
    title: '二、 如何打造“可信空间”？',
    lines: [
      '我们利用区块链技术与智能合约，为您构建一个透明、公正的数字资产环境。',
      '资产分发、价值计算、结算流程均由智能合约自动执行，排除',
      '人为干预。',
      '每一笔共识资金的流入与流出均在链上存证，实时可查，确',
      '保每一分价值都流向该去的地方。',
      '平台、商家、用户共同维护储备池，形成“我为生态做贡献，生态',
      '为我创价值”的正向循环。'
    ]
  },
  {
    key: 'value',
    title: '三、 用户核心价值',
    lines: [
      '通过日常消费，让您的财富在时间长廊中稳健起跳。',
      '资产持有量即是您的社会信用分，解锁更多高阶权益。',
      '拒绝短期泡沫，拥抱基于真实贸易的数字化未来。',
      '让消费更有温度，让价值无处不在。'
    ]
  }
];

const onEntryClick = (key: SpaceEntryItem['key']) => {
  if (key === 'asset') {
    void router.push('/merchant-apply/guide');
    return;
  }
  void router.push('/expert-apply/guide');
};

const loadMerchantGuide = async () => {
  loading.value = true;
  loadError.value = '';
  try {
    const latest = await fetchMyLatestMerchantApplication();
    merchantStatus.value = latest?.status;
    const guide = toMerchantEntryGuide(merchantStatus.value);
    entryItems.value = entryItems.value.map((item) => (
      item.key === 'asset'
        ? { ...item, desc: guide.statusText }
        : item
    ));
  } catch (error) {
    loadError.value = parseError(error, '加载商家申请状态失败');
    message.error(loadError.value);
  } finally {
    loading.value = false;
  }
};

const entryState = computed<AppPageStateType>(() => {
  if (loading.value) {
    return 'loading';
  }
  if (loadError.value) {
    return 'error';
  }
  return 'ready';
});

onMounted(() => {
  void loadMerchantGuide();
});
</script>

<template>
  <div class="space-page">
    <SpaceHeader :title="pageTitle" :subtitle="pageSubtitle" />
    <AppPageState
      :state="entryState"
      :error-description="loadError || '加载商家申请状态失败'"
      :skeleton-rows="3"
      :min-height="120"
      @retry="loadMerchantGuide"
    >
      <SpaceEntryCards :items="entryItems" @click:item="onEntryClick" />
    </AppPageState>
    <SpaceSectionList :sections="sections" />
  </div>
</template>

<style scoped>
.space-page {
  min-height: 100%;
  padding: calc(38 * 100vw / var(--nexa-design-width)) calc(25 * 100vw / var(--nexa-design-width)) calc(22 * 100vw / var(--nexa-design-width));
  background: #f9faff;
}
</style>
