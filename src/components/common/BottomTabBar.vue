<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import iconHome from '@/assets/icons/home.svg';
import iconMap from '@/assets/icons/map.svg';
import iconTrade from '@/assets/icons/trade.svg';
import iconMe from '@/assets/icons/me.svg';
import iconSpace from '@/assets/icons/space.svg';

const router = useRouter();
const route = useRoute();

const iconMapByKey: Record<string, string> = {
  home: iconHome,
  map: iconMap,
  trade: iconTrade,
  me: iconMe,
  space: iconSpace
};

const menus = [
  { key: '/space', label: '中证空间', icon: 'space' },
  { key: '/merchant-map', label: '商家地图', icon: 'map' },
  { key: '/home', label: '首页', icon: 'home' },
  { key: '/trade', label: '交易中心', icon: 'trade' },
  { key: '/me', label: '我的', icon: 'me' }
];

const activeMenu = computed(() => {
  const found = menus.find((item) => route.path.startsWith(item.key));
  return found ? found.key : '/home';
});

const onMenuSelect = (index: string) => {
  if (index !== route.path) {
    void router.push(index);
  }
};
</script>

<template>
  <nav class="mobile-tabbar">
    <button
        v-for="item in menus"
        :key="item.key"
        type="button"
        class="tab-item"
        :class="{ active: item.key === activeMenu }"
        @click="onMenuSelect(item.key)"
    >
          <span class="tab-icon">
            <img
                :src="iconMapByKey[item.icon]"
                :alt="item.label"
                class="tab-icon-img"
            />
          </span>
      <span class="tab-label">{{ item.label }}</span>
    </button>
  </nav>
</template>
