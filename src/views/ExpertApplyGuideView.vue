<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';
import AppHeroHeader from '@/components/common/AppHeroHeader.vue';
import ExpertGuideContentCard, { type ExpertGuideSection } from '@/components/expert-apply-guide/ExpertGuideContentCard.vue';
import ExpertGuideConfirmSection, { type ExpertGuideConfirmItem } from '@/components/expert-apply-guide/ExpertGuideConfirmSection.vue';
import ExpertGuideFooter from '@/components/expert-apply-guide/ExpertGuideFooter.vue';

// 达人申请说明页（Figma node: 91:186）
// 负责：展示达人权益说明、责任确认，并在确认后引导进入达人申请表单
// 不负责：达人申请表单提交流程（由 ExpertApplyView 负责）
const router = useRouter();

const backIconUrl = '/pages/expert-apply-guide/caa24431-fced-47f8-b86b-5950e7e45702.svg';
const badgeIconUrl = '/pages/expert-apply-guide/34577f2d-4461-42bf-ac4d-60d74c083c26.svg';
const checkIconUrl = '/pages/expert-apply-guide/e56ba6f3-fb71-4314-81ec-76e20e35d77e.svg';

const introParagraphs = [
  '达人是平台认证的「数字资产推广节点」。',
  '通过达人邀请加入的用户与商家，其消费与资产发行行为，都会为达人持续产生数字资产收益。'
];

const sections: ExpertGuideSection[] = [
  {
    key: 'fit',
    title: '达人适合哪些人？',
    color: 'primary',
    intro: '如果你：',
    bullets: ['有微信群 / 社群 / 线下资源', '有商家资源 / 地推能力', '想参与一个长期收益模型', '不想直播、不想拍视频、不想囤货'],
    emphasize: '*不拼颜值、不拼话术，只拼连接能力。*'
  },
  {
    key: 'user-income',
    title: '用户消费绑定收益',
    color: 'primary',
    intro: '用户通过你的达人码注册后：',
    bullets: ['用户在平台内消费', '你将持续获得一定比例的数字资产奖励', '奖励实时记录，可随时查看、提现']
  },
  {
    key: 'merchant-income',
    title: '商家入驻绑定收益',
    color: 'primary',
    intro: '商家通过你的达人码入驻后：',
    bullets: ['商家后续发布的数字资产', '你将按规则获得长期数字资产分润', '商家越活跃，你的收益越稳定']
  },
  {
    key: 'onchain',
    title: '数字资产上链 & 个人所有权',
    color: 'primary',
    bullets: ['达人获得的所有数字资产将以个人名义生成智能合约并上链。', '平台无权挪用、冻结、篡改。']
  }
];

const confirmItems = reactive<ExpertGuideConfirmItem[]>([
  { key: 'confirm-intro', label: '我已了解达人权益说明', checked: true },
  { key: 'confirm-volatility', label: '我知晓数字资产可提现，但可能存在价值波动', checked: false },
  { key: 'confirm-contract', label: '我同意生成并绑定个人智能合约', checked: false }
]);

const onToggle = (key: string) => {
  const target = confirmItems.find((item) => item.key === key);
  if (!target) return;
  target.checked = !target.checked;
};

const onBack = () => {
  router.back();
};

const onSubmit = () => {
  const allChecked = confirmItems.every((item) => item.checked);
  if (!allChecked) {
    message.warning('请先完成权益与责任确认');
    return;
  }
  void router.push('/expert-apply');
};
</script>

<template>
  <div class="expert-guide-page">
    <AppHeroHeader
      :title="'达人权益说明'"
      :subtitle="'加入数字资产分发网络，获得长期链上收益'"
      :back-icon-url="backIconUrl"
      :badge-icon-url="badgeIconUrl"
      :title-size-px="26"
      :subtitle-margin-top-px="8"
      @back="onBack"
    />

    <main class="expert-guide-main-card">
      <ExpertGuideContentCard :intro-title="'达人身份说明'" :intro-paragraphs="introParagraphs" :sections="sections" />
      <ExpertGuideConfirmSection :items="confirmItems" :check-icon-url="checkIconUrl" @toggle="onToggle" />
    </main>

    <ExpertGuideFooter :button-text="'立即申请成为达人'" @submit="onSubmit" />
  </div>
</template>

<style scoped>
.expert-guide-page {
  min-height: 100dvh;
  background: #f4f6f9;
  position: relative;
}

/* 白色内容卡与头部重叠，形成与设计稿一致的层次 */
.expert-guide-main-card {
  width: calc(354 * 100vw / var(--nexa-design-width));
  margin: calc(-44 * 100vw / var(--nexa-design-width)) auto 0;
  background: #fff;
  border-top-left-radius: calc(20 * 100vw / var(--nexa-design-width));
  border-top-right-radius: calc(20 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(72 * 100vw / var(--nexa-design-width) + env(safe-area-inset-bottom) + 20px);
  position: relative;
  z-index: 2;
}
</style>
