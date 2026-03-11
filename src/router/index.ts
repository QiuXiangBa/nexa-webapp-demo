import { createRouter, createWebHashHistory } from 'vue-router';
import { isMockMode } from '@/services/http';
import { authStore } from '@/store/auth';
import { restoreSession } from '@/services/session';
import type { NavBarMeta } from '@/types/nav-bar';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue')
    },
    {
      path: '/',
      name: 'root',
      component: () => import('@/views/LayoutView.vue'),
      children: [
        { path: '', redirect: '/home' },
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: {
            title: '首页',
            pageContainer: {
              paddingTop: 38,
              paddingBottom: 20,
              paddingX: 25,
              background: 'var(--nexa-color-surface-page)',
              fullHeight: true,
              withSafeBottom: true
            }
          }
        },
        {
          path: '/merchant-map',
          name: 'merchant-map',
          component: () => import('@/views/MerchantMapView.vue'),
          meta: {
            title: '商家地图',
            pageContainer: {
              paddingTop: 38,
              paddingBottom: 18,
              paddingX: 25,
              background: 'var(--nexa-color-surface-page)',
              fullHeight: true,
              withSafeBottom: true
            }
          }
        },
        {
          path: '/merchant-map/default',
          name: 'merchant-map-default',
          component: () => import('@/views/MerchantMapDefaultView.vue'),
          meta: {
            showBottomTab: false,
            pageContainer: { fullHeight: true, withSafeBottom: false }
          }
        },
        {
          path: '/merchant-map/location-manage',
          name: 'merchant-map-location-manage',
          component: () => import('@/views/LocationManageView.vue'),
          meta: {
            showBottomTab: false,
            pageContainer: {
              paddingTop: 0,
              paddingBottom: 0,
              paddingX: 0,
              background: 'var(--nexa-color-surface-page)',
              fullHeight: true,
              withSafeBottom: false
            }
          }
        },
        {
          path: '/space',
          name: 'space',
          component: () => import('@/views/SpaceView.vue'),
          meta: { title: '中证空间', pageContainer: { fullHeight: true, withSafeBottom: true } }
        },
        {
          path: '/trade',
          name: 'trade',
          component: () => import('@/views/TradeView.vue'),
          meta: {
            title: '交易中心',
            pageContainer: {
              paddingTop: 38,
              paddingBottom: 18,
              paddingX: 0,
              background: 'var(--nexa-color-surface-page)',
              fullHeight: true,
              withSafeBottom: true
            }
          }
        },
        {
          path: '/me',
          name: 'me',
          component: () => import('@/views/MeView.vue'),
          meta: {
            title: '我的',
            pageContainer: {
              paddingTop: 0,
              paddingBottom: 0,
              paddingX: 0,
              background: 'var(--nexa-color-surface-page)',
              fullHeight: true,
              withSafeBottom: true
            }
          }
        },
        {
          path: '/home/consumer-income-detail',
          name: 'home-consumer-income-detail',
          component: () => import('@/views/ConsumerIncomeDetailView.vue'),
          meta: {
            navBar: {
              mode: 'standard',
              title: '数字资产消费详情',
              showBack: true,
              fallbackPath: '/home',
              rightAction: 'none',
              bordered: false
            } satisfies NavBarMeta,
            showBottomTab: false,
            pageContainer: {
              paddingTop: 70,
              paddingBottom: 0,
              paddingX: 20,
              background: 'var(--nexa-color-surface-page)',
              fullHeight: true,
              withSafeBottom: false
            }
          }
        },
        {
          path: '/home/zspace-income-detail',
          name: 'home-zspace-income-detail',
          component: () => import('@/views/ZSpaceIncomeDetailView.vue'),
          meta: {
            navBar: {
              mode: 'standard',
              title: '数字资产分润详情',
              showBack: true,
              fallbackPath: '/home',
              rightAction: 'none',
              bordered: false
            } satisfies NavBarMeta,
            showBottomTab: false,
            pageContainer: {
              paddingTop: 70,
              paddingBottom: 0,
              paddingX: 20,
              background: 'var(--nexa-color-surface-page)',
              fullHeight: true,
              withSafeBottom: false
            }
          }
        },
        {
          path: '/me/wallet',
          name: 'me-wallet',
          component: () => import('@/views/MyWalletView.vue'),
          meta: {
            navBar: {
              mode: 'standard',
              title: '数字资产结算',
              showBack: true,
              fallbackPath: '/me',
              rightAction: 'none',
              bordered: false
            } satisfies NavBarMeta,
            showBottomTab: false,
            pageContainer: {
              paddingTop: 70,
              paddingBottom: 0,
              paddingX: 0,
              background: 'var(--nexa-color-surface-page)',
              fullHeight: true,
              withSafeBottom: false
            }
          }
        },
        {
          path: '/me/wallet/withdraw',
          name: 'me-wallet-withdraw',
          component: () => import('@/views/WalletWithdrawView.vue'),
          meta: {
            navBar: {
              mode: 'standard',
              title: '提现管理界面',
              showBack: true,
              fallbackPath: '/me/wallet',
              rightAction: 'none',
              bordered: false
            } satisfies NavBarMeta,
            showBottomTab: false,
            pageContainer: {
              paddingTop: 70,
              paddingBottom: 0,
              paddingX: 0,
              background: 'var(--nexa-color-surface-page)',
              fullHeight: true,
              withSafeBottom: false
            }
          }
        }
      ]
    },
    {
      path: '/merchant-map/detail',
      name: 'merchant-map-detail',
      component: () => import('@/views/MerchantAssetDetailView.vue'),
      meta: {
        navBar: {
          mode: 'custom',
          title: '商家明细',
          showBack: true,
          fallbackPath: '/merchant-map'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/trade/assets/:assetId',
      name: 'trade-asset-detail',
      component: () => import('@/views/TradeAssetDetailView.vue')
    },
    {
      path: '/merchant-apply/guide',
      name: 'merchant-apply-guide',
      component: () => import('@/views/MerchantApplyGuideView.vue'),
      meta: {
        navBar: {
          mode: 'custom',
          title: '数字资产发行准入指南',
          showBack: true,
          fallbackPath: '/space'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/merchant-apply',
      name: 'merchant-apply',
      component: () => import('@/views/MerchantApplyView.vue'),
      meta: {
        navBar: {
          mode: 'custom',
          title: '完善商家信息',
          showBack: true,
          fallbackPath: '/merchant-apply/guide'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/expert-apply/guide',
      name: 'expert-apply-guide',
      component: () => import('@/views/ExpertApplyGuideView.vue'),
      meta: {
        navBar: {
          mode: 'custom',
          title: '达人权益说明',
          showBack: true,
          fallbackPath: '/space'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/expert-apply',
      name: 'expert-apply',
      component: () => import('@/views/ExpertApplyView.vue'),
      meta: {
        navBar: {
          mode: 'custom',
          title: '填写达人信息',
          showBack: true,
          fallbackPath: '/expert-apply/guide'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/me/consume-record',
      name: 'me-consume-record',
      component: () => import('@/views/ConsumeRecordView.vue'),
      meta: {
        navBar: {
          mode: 'standard',
          title: '收益明细记录',
          showBack: true,
          fallbackPath: '/me'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/me/expert-record',
      name: 'me-expert-record',
      component: () => import('@/views/ExpertRecordView.vue'),
      meta: {
        navBar: {
          mode: 'standard',
          title: '达人授权记录',
          showBack: true,
          fallbackPath: '/me'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/me/contracts',
      name: 'me-contracts',
      component: () => import('@/views/MyContractView.vue'),
      meta: {
        navBar: {
          mode: 'standard',
          title: '我的智能合约',
          showBack: true,
          fallbackPath: '/me'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/me/contracts/detail',
      name: 'me-contract-detail',
      component: () => import('@/views/MyContractDetailView.vue'),
      meta: {
        navBar: {
          mode: 'standard',
          title: '链上智能合约',
          subtitle: '加入数字资产分发网络，获得长期链上收益',
          showBack: true,
          fallbackPath: '/me/contracts'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/contract/sign',
      name: 'contract-sign',
      component: () => import('@/views/ContractSignView.vue'),
      meta: {
        navBar: {
          mode: 'standard',
          title: '链上智能合约',
          subtitle: '加入数字资产分发网络，获得长期链上收益',
          showBack: true,
          fallbackPath: '/me'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/me/pay-receive-code',
      name: 'me-pay-receive-code',
      component: () => import('@/views/PayReceiveCodeView.vue'),
      meta: {
        navBar: {
          mode: 'standard',
          title: '数字资产付款码',
          showBack: true,
          fallbackPath: '/me'
        } satisfies NavBarMeta
      }
    },
    {
      path: '/me/expert-code',
      name: 'me-expert-code',
      component: () => import('@/views/ExpertCodeView.vue'),
      meta: {
        navBar: {
          mode: 'standard',
          title: '达人授权码',
          showBack: true,
          fallbackPath: '/me'
        } satisfies NavBarMeta
      }
    }
  ]
});

router.afterEach((to) => {
  const title = (to.meta?.title as string) || (to.meta?.navBar as NavBarMeta | undefined)?.title;
  if (title) {
    document.title = title;
  }
});

router.beforeEach((to) => {
  const check = async () => {
    if (isMockMode) {
      return true;
    }
    await restoreSession();
    const hasAccessToken = Boolean(authStore.getSession()?.accessToken);
    if (to.path === '/auth') {
      if (hasAccessToken) {
        return '/home';
      }
      return true;
    }
    if (!hasAccessToken) {
      return {
        path: '/auth',
        query: { redirect: to.fullPath }
      };
    }
    return true;
  };
  return check();
});

export default router;
