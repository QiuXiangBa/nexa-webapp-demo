<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppHeroHeader from '@/components/common/AppHeroHeader.vue';
import MerchantRightsSection from '@/components/merchant-apply-guide/MerchantRightsSection.vue';
import MerchantMaterialSection, { type MaterialItem } from '@/components/merchant-apply-guide/MerchantMaterialSection.vue';
import MerchantConfirmChecklist, { type ConfirmItem } from '@/components/merchant-apply-guide/MerchantConfirmChecklist.vue';
import MerchantApplyGuideFooter from '@/components/merchant-apply-guide/MerchantApplyGuideFooter.vue';

// 商家申请说明页（Figma node: 90:61）
// 负责：展示准入指南、材料准备清单与确认项，并跳转到申请表单页
// 不负责：商家申请表单提交（由 MerchantApplyView 负责）
const router = useRouter();

const backIconUrl = '/pages/merchant-apply-guide/e16db6f2-ff4c-47bf-a542-7a067c297df1.svg';
const certImageUrl = '/pages/merchant-apply-guide/3cff8bdf-080b-4548-a75a-8e1f2280c59e.png';

const rightsItems = [
  {
    title: '获得数字资产发行资格',
    content:
      '申请通过后，您可为用户的真实消费行为，记录对应比例的数字资产。数字资产归用户所有，不归商家所有。\n用户可在满足条件的基础上，随时申请提现。'
  },
  {
    title: '发行规则公开展示',
    content: '您声明的数字资产规则，将在蚂蚁链平台公开展示并通过智能合约进行存证。'
  },
  {
    title: '参与统一的用户资产体系',
    content: '用户在不同商家消费所获得的数字资产，将统一记录在其个人账户中。这有助于建立长期、可持续的用户关系。'
  }
];

const neutralRules = [
  '平台不参与任何商家经营行为',
  '平台不代商家做任何承诺',
  '平台不干预用户与商家的交易关系',
  '平台仅作为规则记录和资产记账方'
];

const stageIntro = '当前阶段，平台暂不提供以下功能：';
const stageRules = ['数字资产交易或流通', '消费或支付入口'];

const materialHint = '证件需拍摄原件或复印件盖章，且在有效期内。';

const materialItems: MaterialItem[] = [
  { key: 'biz', title: '营业执照', desc: '企业执照或个体户执照', imageUrl: certImageUrl },
  { key: 'industry', title: '行业资质', desc: '部分行业需要，按行业补充', imageUrl: certImageUrl },
  { key: 'legal', title: '法人或经营者证件', desc: '身份证或护照等', imageUrl: certImageUrl },
  { key: 'verify', title: '实名认证信息', desc: '企业对公银行开户信息或法人信息', imageUrl: certImageUrl }
];

const confirms = reactive<ConfirmItem[]>([
  { key: 'rule-own', label: '数字资产规则由商家自行制定并承担责任', checked: true },
  { key: 'rule-notify', label: '数字资产规则由商家自行制定并承担责任', checked: false },
  { key: 'rule-last', label: '数字资产规则由商家自行制定并承担责任', checked: false }
]);

const onToggleConfirm = (key: string) => {
  const current = confirms.find((item) => item.key === key);
  if (!current) return;
  current.checked = !current.checked;
};

const goBack = () => {
  router.back();
};

const startApply = () => {
  void router.push('/merchant-apply');
};
</script>

<template>
  <div class="merchant-guide-page">
    <AppHeroHeader
      :title="'数字资产发行准入指南'"
      :subtitle="'提前准备材料，发行更顺畅'"
      :back-icon-url="backIconUrl"
      @back="goBack"
    />

    <main class="guide-main-card">
      <MerchantRightsSection :items="rightsItems" :neutral-rules="neutralRules" :stage-intro="stageIntro" :stage-rules="stageRules" />

      <MerchantMaterialSection :hint="materialHint" :materials="materialItems" />

      <MerchantConfirmChecklist :items="confirms" @toggle="onToggleConfirm" />
    </main>

    <MerchantApplyGuideFooter :button-text="'我已了解，开始申请'" @start="startApply" />
  </div>
</template>

<style scoped>
/* --guide-footer-h: footer 按钮区高度（上padding 30 + 按钮 40 + 下padding 30） */
.merchant-guide-page {
  --guide-footer-h: calc(72 * 100vw / var(--nexa-design-width));
  min-height: 100dvh;
  background: #f4f6f9;
  position: relative;
}

/* 白色内容卡与头部重叠，按设计稿形成分层关系 */
/* padding-bottom 留出 footer 高度 + safe-area，避免内容被遮挡 */
.guide-main-card {
  width: calc(360 * 100vw / var(--nexa-design-width));
  margin: calc(-52 * 100vw / var(--nexa-design-width)) auto 0;
  border-radius: calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width)) 0 0;
  background: #fff;
  padding: calc(26 * 100vw / var(--nexa-design-width)) calc(28 * 100vw / var(--nexa-design-width));
  padding-bottom: calc(var(--guide-footer-h) + env(safe-area-inset-bottom) + 20px);
  position: relative;
  z-index: 2;
}
</style>
