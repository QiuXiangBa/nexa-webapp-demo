<script setup lang="ts">
export interface MeProfileAction {
  key: 'scan' | 'qrcode' | 'setting';
  icon: string;
  alt: string;
}

defineProps<{
  nickname: string;
  userId: string;
  avatar: string;
  copyIcon: string;
  badgeIcon: string;
  actions: MeProfileAction[];
}>();

const emit = defineEmits<{
  'click:action': [key: MeProfileAction['key']];
}>();
</script>

<template>
  <section class="me-profile-card">
    <div class="me-profile-main">
      <div class="me-avatar-wrap">
        <img :src="avatar" alt="头像" class="me-avatar" />
        <span class="me-avatar-badge">
          <img :src="badgeIcon" alt="认证" class="me-avatar-badge-icon" />
        </span>
      </div>

      <div class="me-profile-text">
        <h2 class="me-name">{{ nickname }}</h2>
        <div class="me-id-row">
          <span class="me-id">ID:{{ userId }}</span>
          <img :src="copyIcon" alt="复制" class="me-copy-icon" />
        </div>
      </div>

      <div class="me-action-list">
        <button
          v-for="action in actions"
          :key="action.key"
          type="button"
          class="me-action-btn"
          :class="`me-action-btn--${action.key}`"
          @click="emit('click:action', action.key)"
        >
          <img :src="action.icon" :alt="action.alt" class="me-action-icon" />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.me-profile-card {
  width: 100%;
  height: calc(200 * 100vw / var(--nexa-design-width));
  background: #fff;
  border-radius: 0 0 calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
  padding: calc(113 * 100vw / var(--nexa-design-width)) calc(20 * 100vw / var(--nexa-design-width)) 0;
}

.me-profile-main {
  display: grid;
  grid-template-columns: calc(40 * 100vw / var(--nexa-design-width)) 1fr auto;
  align-items: center;
  column-gap: calc(14 * 100vw / var(--nexa-design-width));
}

.me-avatar-wrap {
  position: relative;
  width: calc(40 * 100vw / var(--nexa-design-width));
  height: calc(40 * 100vw / var(--nexa-design-width));
}

.me-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: calc(1 * 100vw / var(--nexa-design-width)) solid #aac2ff;
  object-fit: cover;
}

.me-avatar-badge {
  position: absolute;
  right: calc(-2 * 100vw / var(--nexa-design-width));
  bottom: calc(-2 * 100vw / var(--nexa-design-width));
  width: calc(12 * 100vw / var(--nexa-design-width));
  height: calc(12 * 100vw / var(--nexa-design-width));
  background: #10c0f3;
  border: calc(0.6 * 100vw / var(--nexa-design-width)) solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.me-avatar-badge-icon {
  width: calc(7 * 100vw / var(--nexa-design-width));
  height: calc(6 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.me-name {
  margin: 0;
  color: #363636;
  font-size: calc(17 * 100vw / var(--nexa-design-width));
  font-weight: 700;
  line-height: calc(24 * 100vw / var(--nexa-design-width));
}

.me-id-row {
  margin-top: calc(1 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  gap: calc(7 * 100vw / var(--nexa-design-width));
}

.me-id {
  color: #363636;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 400;
  line-height: calc(19 * 100vw / var(--nexa-design-width));
}

.me-copy-icon {
  width: calc(14 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
  object-fit: contain;
}

.me-action-list {
  width: calc(75 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.me-action-btn {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
  border: 0;
  padding: 0;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.me-action-btn--scan {
  width: calc(14 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
}

.me-action-btn--setting {
  width: calc(14 * 100vw / var(--nexa-design-width));
  height: calc(14 * 100vw / var(--nexa-design-width));
}

.me-action-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
