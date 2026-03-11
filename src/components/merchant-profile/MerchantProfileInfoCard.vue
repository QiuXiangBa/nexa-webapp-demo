<script setup lang="ts">
export interface MerchantProfileFormModel {
  avatarHint: string;
  merchantName: string;
  industryLabel: string;
  contactPhone: string;
  operationTypeLabel: string;
  regionLabel: string;
}

// 企业信息卡片
// props.formModel: 当前表单模型
// props.arrowIconUrl: 右侧箭头图标
// emit.update: 输入型字段更新
// emit.pick: 点击选择型字段
// emit.addAvatar: 点击商家头像行
const props = defineProps<{
  formModel: MerchantProfileFormModel;
  arrowIconUrl: string;
}>();

const emit = defineEmits<{
  (event: 'update', payload: Partial<MerchantProfileFormModel>): void;
  (event: 'pick', field: 'industryLabel' | 'operationTypeLabel' | 'regionLabel'): void;
  (event: 'addAvatar'): void;
}>();
</script>

<template>
  <section class="profile-section">
    <p class="section-label">必填信息·企业信息</p>
    <div class="info-card">
      <button type="button" class="info-row row-click" @click="emit('addAvatar')">
        <span class="row-label">商家头像</span>
        <span class="row-value row-value-right">{{ props.formModel.avatarHint }}</span>
        <img class="row-arrow" :src="props.arrowIconUrl" alt="" />
      </button>

      <div class="info-row">
        <label class="row-label" for="merchant-name">商家名称</label>
        <input
          id="merchant-name"
          class="row-input"
          type="text"
          placeholder="请输入名称"
          :value="props.formModel.merchantName"
          data-testid="merchant-name"
          @input="emit('update', { merchantName: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <button type="button" class="info-row row-click" @click="emit('pick', 'industryLabel')">
        <span class="row-label">经营行业</span>
        <span class="row-value row-value-right">{{ props.formModel.industryLabel }}</span>
        <img class="row-arrow" :src="props.arrowIconUrl" alt="" />
      </button>

      <div class="info-row">
        <label class="row-label" for="merchant-contact-phone">联系电话</label>
        <input
          id="merchant-contact-phone"
          class="row-input"
          type="tel"
          maxlength="11"
          inputmode="numeric"
          placeholder="请填写11位手机号"
          :value="props.formModel.contactPhone"
          data-testid="merchant-contact-phone"
          @input="emit('update', { contactPhone: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <button type="button" class="info-row row-click" @click="emit('pick', 'operationTypeLabel')">
        <span class="row-label">经营类型</span>
        <span class="row-value row-value-right">{{ props.formModel.operationTypeLabel }}</span>
        <img class="row-arrow" :src="props.arrowIconUrl" alt="" />
      </button>

      <button type="button" class="info-row row-click row-last" @click="emit('pick', 'regionLabel')">
        <span class="row-label">经营地区</span>
        <span class="row-value row-value-right">{{ props.formModel.regionLabel }}</span>
        <img class="row-arrow" :src="props.arrowIconUrl" alt="" />
      </button>
    </div>
  </section>
</template>

<style scoped>
.profile-section {
  margin-top: calc(6 * 100vw / var(--nexa-design-width));
}

.section-label {
  margin: 0 0 calc(6 * 100vw / var(--nexa-design-width));
  color: #989c9e;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(30 * 100vw / var(--nexa-design-width));
  font-weight: 500;
}

.info-card {
  width: calc(348 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
  overflow: hidden;
}

.info-row {
  width: calc(319.28 * 100vw / var(--nexa-design-width));
  height: calc(54.08 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  border: 0;
  border-bottom: 1px solid #eee;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0;
}

.info-row.row-last {
  border-bottom: 0;
}

.row-label {
  width: calc(80 * 100vw / var(--nexa-design-width));
  color: #363636;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  line-height: calc(54 * 100vw / var(--nexa-design-width));
  text-align: left;
}

.row-value {
  color: #989c9e;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(54 * 100vw / var(--nexa-design-width));
}

.row-value-right {
  flex: 1;
  text-align: right;
}

.row-arrow {
  width: calc(7.28 * 100vw / var(--nexa-design-width));
  height: calc(14.56 * 100vw / var(--nexa-design-width));
  margin-left: calc(10 * 100vw / var(--nexa-design-width));
}

.row-input {
  flex: 1;
  border: 0;
  outline: none;
  color: #363636;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(54 * 100vw / var(--nexa-design-width));
  background: transparent;
}

.row-input::placeholder {
  color: #989c9e;
}

.row-click {
  cursor: pointer;
}
</style>
