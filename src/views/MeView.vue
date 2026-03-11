<script setup lang="ts">
import { message } from '@/utils/message';
import { useRouter } from 'vue-router';

// 我的页（Figma node: 24:3186）
// 负责：个人信息头部 + 功能入口列表
// 不负责：底部导航和全局壳层（由 LayoutView 管理）
const avatarUrl = '/pages/me/2e35a6da-3c4f-4b89-9ead-c2dd8e078f35.png';
const badgeIconUrl = '/pages/me/40959180-d20d-46be-b127-d2da834ec1dc.svg';
const actionExpandUrl = '/pages/me/59ee5673-0337-47bd-8ec6-9a7466563d29.svg';
const actionQrUrl = '/pages/me/3b910eea-1f81-43d4-a2a5-02ce04e984e5.svg';
const idCopyIconUrl = '/pages/me/71414263-7fdd-45ae-8d08-46aeec229441.svg';
const menuWalletIconUrl = '/pages/me/2998d692-d0a6-4055-81d6-66731e840c38.svg';
const menuConsumeIconUrl = '/pages/me/d56f4969-89dd-4164-a00f-eb4edba063ad.svg';
const menuAuthorizeIconUrl = '/pages/me/8b959453-e837-46e5-8332-432ce1159e99.svg';
const menuContractIconUrl = '/pages/me/ed74b368-c212-4332-8a37-3c17c5a77a02.svg';
const menuArrowIconUrl = '/pages/me/da975236-e443-4e90-bc2e-5397630431f7.svg';

interface MenuItem {
  key: string;
  title: string;
  icon: string;
}

const router = useRouter();

const menuItems: MenuItem[] = [
  { key: 'wallet', title: '我的钱包', icon: menuWalletIconUrl },
  { key: 'consume', title: '消费记录', icon: menuConsumeIconUrl },
  { key: 'authorize', title: '达人授权记录', icon: menuAuthorizeIconUrl },
  { key: 'contract', title: '我的智能合约', icon: menuContractIconUrl }
];

const onAction = () => {
  message.info('功能建设中');
};

const onOpenPayReceiveCode = () => {
  router.push('/me/pay-receive-code').catch(() => undefined);
};

const onOpenExpertCode = () => {
  router.push('/me/expert-code').catch(() => undefined);
};

const onMenuClick = (item: MenuItem) => {
  if (item.key === 'wallet') {
    router.push('/me/wallet').catch(() => undefined);
    return;
  }
  if (item.key === 'consume') {
    router.push('/me/consume-record').catch(() => undefined);
    return;
  }
  if (item.key === 'authorize') {
    router.push('/me/expert-record').catch(() => undefined);
    return;
  }
  if (item.key === 'contract') {
    router.push('/me/contracts').catch(() => undefined);
    return;
  }
  message.info(`${item.title} 功能建设中`);
};
</script>

<template>
  <div class="me-page">
    <section class="me-profile-card">
      <div class="profile-main">
        <div class="avatar-wrap">
          <img :src="avatarUrl" alt="" class="avatar" />
          <span class="avatar-badge">
            <img :src="badgeIconUrl" alt="" />
          </span>
        </div>

        <div class="profile-texts">
          <h2 class="nickname">用户昵称</h2>
          <div class="user-id-row">
            <span>ID:12345678</span>
            <button type="button" class="copy-btn" @click="onAction">
              <img :src="idCopyIconUrl" alt="" />
            </button>
          </div>
        </div>
      </div>

      <div class="profile-actions">
        <button type="button" class="action-btn" @click="onOpenExpertCode">
          <img :src="actionExpandUrl" alt="" />
        </button>
        <button type="button" class="action-btn" @click="onOpenPayReceiveCode">
          <img :src="actionQrUrl" alt="" />
        </button>
      </div>
    </section>

    <section class="me-menu-list">
      <button v-for="item in menuItems" :key="item.key" type="button" class="menu-row" @click="onMenuClick(item)">
        <img :src="item.icon" alt="" class="menu-icon" />
        <span class="menu-title">{{ item.title }}</span>
        <img :src="menuArrowIconUrl" alt="" class="menu-arrow" />
      </button>
    </section>
  </div>
</template>

<style scoped>
.me-page {
  min-height: 100%;
}

/* 顶部白底卡片：Figma 高 200，底部圆角 10 */
.me-profile-card {
  width: 100%;
  height: calc(129 * 100vw / var(--nexa-design-width));
  background: #fff;
  border-radius: 0 0 calc(10 * 100vw / var(--nexa-design-width)) calc(10 * 100vw / var(--nexa-design-width));
  padding: calc(24 * 100vw / var(--nexa-design-width)) calc(24 * 100vw / var(--nexa-design-width)) 0;
  display: flex;
  justify-content: space-between;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: calc(12 * 100vw / var(--nexa-design-width));
}

.avatar-wrap {
  width: calc(40 * 100vw / var(--nexa-design-width));
  height: calc(40 * 100vw / var(--nexa-design-width));
  position: relative;
  padding: calc(1 * 100vw / var(--nexa-design-width));
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-badge {
  position: absolute;
  right: calc(-0 * 100vw / var(--nexa-design-width));
  bottom: calc(-0 * 100vw / var(--nexa-design-width));
  width: calc(12 * 100vw / var(--nexa-design-width));
  height: calc(12 * 100vw / var(--nexa-design-width));
  border-radius: 50%;
  background: #10c0f3;
  border: 0.6px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-badge img {
  width: calc(7 * 100vw / var(--nexa-design-width));
  height: calc(6 * 100vw / var(--nexa-design-width));
}

.nickname {
  margin: 0;
  color: #363636;
  font-size: calc(17 * 100vw / var(--nexa-design-width));
  line-height: calc(24 * 100vw / var(--nexa-design-width));
  font-weight: 700;
}

.user-id-row {
  margin-top: calc(2 * 100vw / var(--nexa-design-width));
  display: flex;
  align-items: center;
  gap: calc(6 * 100vw / var(--nexa-design-width));
  color: #363636;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  line-height: calc(19 * 100vw / var(--nexa-design-width));
}

.copy-btn,
.action-btn {
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn img {
  width: calc(10 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
}

.profile-actions {
  display: flex;
  align-items: center;
  gap: calc(20 * 100vw / var(--nexa-design-width));
  margin-top: calc(4 * 100vw / var(--nexa-design-width));
}

.action-btn img {
  width: calc(20 * 100vw / var(--nexa-design-width));
  height: calc(20 * 100vw / var(--nexa-design-width));
}

.me-menu-list {
  margin-top: calc(8 * 100vw / var(--nexa-design-width));
}

.menu-row {
  width: 100%;
  height: calc(40 * 100vw / var(--nexa-design-width));
  border: 0;
  border-bottom: 1px solid #e4e5e5;
  background: #fff;
  padding: 0 calc(20 * 100vw / var(--nexa-design-width));
  display: grid;
  grid-template-columns: calc(16 * 100vw / var(--nexa-design-width)) 1fr calc(5 * 100vw / var(--nexa-design-width));
  align-items: center;
  column-gap: calc(14 * 100vw / var(--nexa-design-width));
}

.menu-icon {
  width: calc(16 * 100vw / var(--nexa-design-width));
  height: calc(16 * 100vw / var(--nexa-design-width));
}

.menu-title {
  text-align: left;
  color: #363636;
  font-size: calc(10 * 100vw / var(--nexa-design-width));
  font-weight: 500;
  line-height: calc(40 * 100vw / var(--nexa-design-width));
}

.menu-arrow {
  width: calc(5 * 100vw / var(--nexa-design-width));
  height: calc(10 * 100vw / var(--nexa-design-width));
}
</style>
