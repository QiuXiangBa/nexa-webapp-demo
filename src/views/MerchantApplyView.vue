<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from '@/utils/message';
import { submitMerchantApplication } from '@/services/merchant';
import { parseError } from '@/services/http';
import { trackAction } from '@/services/telemetry';
import AppHeroHeader from '@/components/common/AppHeroHeader.vue';
import MerchantProfileInfoCard, { type MerchantProfileFormModel } from '@/components/merchant-profile/MerchantProfileInfoCard.vue';
import MerchantProfileQualificationCard, { type MerchantQualificationItem } from '@/components/merchant-profile/MerchantProfileQualificationCard.vue';
import MerchantProfileIdentityCard, { type MerchantIdentityItem } from '@/components/merchant-profile/MerchantProfileIdentityCard.vue';
import MerchantProfileSubmitBar from '@/components/merchant-profile/MerchantProfileSubmitBar.vue';

// 商家资料填写页（Figma node: 90:144）
// 负责：按移动端设计稿展示资料录入与上传区块，并执行提交申请动作
// 不负责：底部导航和全局壳层布局（当前页面为独立子页面）
const router = useRouter();

const backIconUrl = '/pages/merchant-apply/4c82df46-f8ab-4679-b903-3ce0001d0f09.svg';
const arrowIconUrl = '/pages/merchant-apply/6d7b2da2-98ec-462c-96e5-57110b44a832.svg';
const uploadIconUrl = '/pages/merchant-apply/3c5d7a3e-ec3c-4050-800c-c1ad05127f5b.svg';

const profileForm = reactive<MerchantProfileFormModel>({
  avatarHint: '点击添加',
  merchantName: '',
  industryLabel: '请选择最符合的一项',
  contactPhone: '',
  operationTypeLabel: '请选择最符合的一项',
  regionLabel: '省、市、区'
});

const qualificationItems = ref<MerchantQualificationItem[]>([
  { key: 'biz-license', label: '营业执照' },
  { key: 'industry-license', label: '行业资质' },
  { key: 'tax-proof', label: '纳税凭证' }
]);

const identityItems = ref<MerchantIdentityItem[]>([
  {
    key: 'id-front',
    label: '人像面',
    previewUrl: '/pages/merchant-apply/11c2197b-2981-43b7-9679-0d1907e0fac1.svg'
  },
  {
    key: 'id-back',
    label: '国徽面',
    previewUrl: '/pages/merchant-apply/2f9c54b4-bef1-4fe0-bee9-84ab53a8ff13.svg'
  }
]);

const submitting = ref(false);

const onBack = () => {
  router.back();
};

const onFormUpdate = (payload: Partial<MerchantProfileFormModel>) => {
  if (payload.contactPhone !== undefined) {
    profileForm.contactPhone = payload.contactPhone.replace(/\D/g, '').slice(0, 11);
  }
  if (payload.merchantName !== undefined) {
    profileForm.merchantName = payload.merchantName;
  }
};

const onPickField = (field: 'industryLabel' | 'operationTypeLabel' | 'regionLabel') => {
  message.info(`${field} 选择器待接入`);
};

const onUpload = (key: string) => {
  message.info(`上传功能待接入：${key}`);
};

const validate = (): string | null => {
  if (!profileForm.merchantName.trim()) {
    return '请输入商家名称';
  }
  if (!/^1\d{10}$/.test(profileForm.contactPhone)) {
    return '请填写11位手机号';
  }
  return null;
};

const submit = async () => {
  const validateMessage = validate();
  if (validateMessage) {
    message.warning(validateMessage);
    return;
  }

  submitting.value = true;
  try {
    await submitMerchantApplication({
      merchantName: profileForm.merchantName.trim(),
      bizLicenseNo: `AUTO-${Date.now()}`,
      contactName: profileForm.merchantName.trim(),
      contactPhone: profileForm.contactPhone
    });
    trackAction({ action: 'merchant_apply_submit', status: 'success', scene: 'merchant_apply_profile' });
    // message.success('申请提交成功');
    router.push('/contract/sign');
  } catch (error) {
    trackAction({ action: 'merchant_apply_submit', status: 'failed', scene: 'merchant_apply_profile', detail: parseError(error, '申请提交失败') });
    message.error(parseError(error, '申请提交失败'));
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="merchant-profile-page">
    <AppHeroHeader :back-icon-url="backIconUrl" :title="'完善商家信息'" @back="onBack" />

    <main class="merchant-profile-main">
      <MerchantProfileInfoCard
        :form-model="profileForm"
        :arrow-icon-url="arrowIconUrl"
        @update="onFormUpdate"
        @pick="onPickField"
        @add-avatar="onUpload('merchant-avatar')"
      />

      <MerchantProfileQualificationCard :items="qualificationItems" :upload-icon-url="uploadIconUrl" @upload="onUpload" />

      <MerchantProfileIdentityCard :items="identityItems" @upload="onUpload" />
    </main>

    <MerchantProfileSubmitBar :loading="submitting" :button-text="'提交材料'" @submit="submit" />
  </div>
</template>

<style scoped>
.merchant-profile-page {
  min-height: 100dvh;
  background: #f4f6f9;
  position: relative;
}

/* 主内容区固定为 348 宽并居中，底部留出提交栏（72）+ safe-area + 额外间距防遮挡 */
.merchant-profile-main {
  width: calc(348 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  padding-bottom: calc(72 * 100vw / var(--nexa-design-width) + env(safe-area-inset-bottom) + 20px);
}
</style>
