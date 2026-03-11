<script setup lang="ts">
export interface ExpertProfileFormModel {
  nickname: string;
  mobile: string;
  wechat: string;
  email: string;
}

// 达人基础信息卡
// props.model: 表单值
// emit.update: 字段更新
const props = defineProps<{
  model: ExpertProfileFormModel;
}>();

const emit = defineEmits<{
  (event: 'update', payload: Partial<ExpertProfileFormModel>): void;
}>();
</script>

<template>
  <section class="basic-info-section">
    <p class="section-label">基础信息</p>

    <div class="info-card">
      <div class="info-row">
        <label class="row-label" for="expert-nickname">达人昵称</label>
        <input
          id="expert-nickname"
          class="row-input"
          type="text"
          :value="props.model.nickname"
          placeholder="请输入名称（可后续修改）"
          data-testid="expert-nickname"
          @input="emit('update', { nickname: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <div class="info-row">
        <label class="row-label" for="expert-mobile">手机号码</label>
        <input
          id="expert-mobile"
          class="row-input"
          type="tel"
          maxlength="11"
          inputmode="numeric"
          :value="props.model.mobile"
          placeholder="请填写11位手机号"
          data-testid="expert-mobile"
          @input="emit('update', { mobile: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <div class="info-row">
        <label class="row-label" for="expert-wechat">微信号码</label>
        <input
          id="expert-wechat"
          class="row-input"
          type="text"
          :value="props.model.wechat"
          placeholder="请输入微信账号（选填）"
          @input="emit('update', { wechat: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <div class="info-row row-last">
        <label class="row-label" for="expert-email">邮箱号码</label>
        <input
          id="expert-email"
          class="row-input"
          type="email"
          :value="props.model.email"
          placeholder="请输入邮箱账号（选填）"
          @input="emit('update', { email: ($event.target as HTMLInputElement).value })"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.basic-info-section {
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
  width: calc(307 * 100vw / var(--nexa-design-width));
  height: calc(216 * 100vw / var(--nexa-design-width));
  border-radius: calc(10 * 100vw / var(--nexa-design-width));
  background: #fff;
  overflow: hidden;
}

.info-row {
  width: calc(272.48 * 100vw / var(--nexa-design-width));
  height: calc(54.08 * 100vw / var(--nexa-design-width));
  margin: 0 auto;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.info-row.row-last {
  border-bottom: 0;
}

.row-label {
  width: calc(83.2 * 100vw / var(--nexa-design-width));
  color: #363636;
  font-size: calc(14 * 100vw / var(--nexa-design-width));
  line-height: calc(54.08 * 100vw / var(--nexa-design-width));
}

.row-input {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  color: #363636;
  font-size: calc(12 * 100vw / var(--nexa-design-width));
  line-height: calc(54.08 * 100vw / var(--nexa-design-width));
}

.row-input::placeholder {
  color: #989c9e;
}
</style>
