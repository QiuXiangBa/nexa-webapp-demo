<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';
import { submitExpertApplication } from '@/services/expert';
import { parseError } from '@/services/http';
import { trackAction } from '@/services/telemetry';
import AppHeroHeader from '@/components/common/AppHeroHeader.vue';
import ExpertBasicInfoCard, { type ExpertProfileFormModel } from '@/components/expert-profile/ExpertBasicInfoCard.vue';
import ExpertPromotionTypeCard, { type ExpertOptionItem } from '@/components/expert-profile/ExpertPromotionTypeCard.vue';
import ExpertPromotionResourceCard from '@/components/expert-profile/ExpertPromotionResourceCard.vue';
import ExpertProfileSubmitBar from '@/components/expert-profile/ExpertProfileSubmitBar.vue';

// 达人申请资料填写页（Figma node: 94:253）
// 负责：达人基础资料录入、多选偏好采集、提交申请
// 不负责：申请状态展示（由达人记录页承接）
const router = useRouter();

const backIconUrl = '/pages/expert-apply/210a89c2-e6da-4e00-a1c4-1de7a021a2b0.svg';
const badgeIconUrl = '/pages/expert-apply/f4188245-c5a6-45a0-ab94-0893089df052.svg';
const checkIconUrl = '/pages/expert-apply/d56ff9db-814e-45bf-9253-a50429ee94fc.svg';

const formModel = reactive<ExpertProfileFormModel>({
  nickname: '',
  mobile: '',
  wechat: '',
  email: ''
});

const promotionTypeItems = reactive<ExpertOptionItem[]>([
  { key: 'community', label: '社群推广（微信群 / QQ 群等）', checked: true },
  { key: 'offline', label: '线下推广（地推 / 门店合作）', checked: false },
  { key: 'merchant-connect', label: '商家资源对接', checked: true },
  { key: 'private-share', label: '个人推荐 / 私域分享', checked: true }
]);

const promotionResourceItems = reactive<ExpertOptionItem[]>([
  { key: 'local-merchants', label: '有多个本地商家或资源', checked: true },
  { key: 'social-groups', label: '运营多个500人社交媒体群', checked: false },
  { key: 'field-promotion', label: '擅长线下地推', checked: true }
]);

const submitting = ref(false);

const onBack = () => {
  router.back();
};

const onFormUpdate = (payload: Partial<ExpertProfileFormModel>) => {
  if (payload.mobile !== undefined) {
    formModel.mobile = payload.mobile.replace(/\D/g, '').slice(0, 11);
  }
  if (payload.nickname !== undefined) {
    formModel.nickname = payload.nickname;
  }
  if (payload.wechat !== undefined) {
    formModel.wechat = payload.wechat;
  }
  if (payload.email !== undefined) {
    formModel.email = payload.email;
  }
};

const toggleOption = (list: ExpertOptionItem[], key: string) => {
  const target = list.find((item) => item.key === key);
  if (!target) return;
  target.checked = !target.checked;
};

const validate = (): string | null => {
  if (!formModel.nickname.trim()) {
    return '请输入达人昵称';
  }
  if (!/^1\d{10}$/.test(formModel.mobile)) {
    return '请填写11位手机号';
  }
  if (formModel.email && !/^\S+@\S+\.\S+$/.test(formModel.email)) {
    return '邮箱格式不正确';
  }
  return null;
};

const submit = async () => {
  const validationError = validate();
  if (validationError) {
    message.warning(validationError);
    return;
  }

  submitting.value = true;
  try {
    // 当前服务端仍使用 realName/idNo 字段，这里先按“昵称/手机号”进行映射提交。
    await submitExpertApplication({
      realName: formModel.nickname.trim(),
      idNo: formModel.mobile
    });

    trackAction({ action: 'expert_apply_submit', status: 'success', scene: 'expert_apply_profile' });
    // message.success('达人申请提交成功');
    router.push('/contract/sign');
  } catch (error) {
    trackAction({ action: 'expert_apply_submit', status: 'failed', scene: 'expert_apply_profile', detail: parseError(error, '达人申请提交失败') });
    message.error(parseError(error, '达人申请提交失败'));
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="expert-profile-page">
    <AppHeroHeader :back-icon-url="backIconUrl" :badge-icon-url="badgeIconUrl" :title="'填写达人信息'" @back="onBack" />

    <main class="expert-profile-main">
      <ExpertBasicInfoCard :model="formModel" @update="onFormUpdate" />

      <ExpertPromotionTypeCard :items="promotionTypeItems" :check-icon-url="checkIconUrl" @toggle="(key) => toggleOption(promotionTypeItems, key)" />

      <ExpertPromotionResourceCard
        :items="promotionResourceItems"
        :check-icon-url="checkIconUrl"
        :hint-text="'积极填写，有助于后期平台资源扶持'"
        @toggle="(key) => toggleOption(promotionResourceItems, key)"
      />
    </main>

    <ExpertProfileSubmitBar :loading="submitting" :button-text="'提交申请'" @submit="submit" />
  </div>
</template>

<style scoped>
.expert-profile-page {
  min-height: 100dvh;
  background: #f4f6f9;
  position: relative;
}

/* 页面主体区按设计稿 307 宽居中，底部预留避免被 fixed submit bar 遮挡 */
.expert-profile-main {
  width: calc(307 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  padding-bottom: calc(72 * 100vw / var(--nexa-design-width) + env(safe-area-inset-bottom) + 20px);
}
</style>
