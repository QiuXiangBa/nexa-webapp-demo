<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from '@/utils/message';
import { login, register } from '@/services/auth';
import { parseError } from '@/services/http';
import { authStore } from '@/store/auth';
import { trackAction } from '@/services/telemetry';

const router = useRouter();
const route = useRoute();
const activeTab = ref<'login' | 'register'>('login');
const loading = ref(false);

const loginForm = reactive({
  phone: '',
  password: ''
});

const registerForm = reactive({
  phone: '',
  password: '',
  inviterIdText: ''
});

const isPhoneValid = (phone: string) => /^[0-9]{11,20}$/.test(phone.trim());

const toTimestamp = (value: unknown): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  const asNumber = Number(value);
  if (Number.isFinite(asNumber)) {
    return asNumber;
  }
  const asDate = new Date(String(value)).getTime();
  return Number.isFinite(asDate) ? asDate : undefined;
};

const resolveRedirectPath = (): string => {
  const redirect = route.query.redirect;
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    return redirect;
  }
  return '/home';
};

const validateLogin = (): boolean => {
  if (!isPhoneValid(loginForm.phone)) {
    message.warning('请输入11-20位数字手机号');
    return false;
  }
  if (!loginForm.password.trim()) {
    message.warning('请输入密码');
    return false;
  }
  return true;
};

const validateRegister = (): boolean => {
  if (!isPhoneValid(registerForm.phone)) {
    message.warning('请输入11-20位数字手机号');
    return false;
  }
  if (registerForm.password.trim().length < 8) {
    message.warning('密码至少8位');
    return false;
  }
  if (registerForm.inviterIdText.trim()) {
    const inviterId = Number(registerForm.inviterIdText.trim());
    if (!Number.isFinite(inviterId) || inviterId <= 0) {
      message.warning('邀请人ID必须为正整数');
      return false;
    }
  }
  return true;
};

const onLogin = async () => {
  if (!validateLogin()) {
    return;
  }
  loading.value = true;
  try {
    const session = await login({ phone: loginForm.phone, password: loginForm.password });
    authStore.saveSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      userId: session.userId,
      accessTokenExpiresAt: toTimestamp(session.accessTokenExpiresAt),
      refreshTokenExpiresAt: toTimestamp(session.refreshTokenExpiresAt)
    });
    message.success('登录成功');
    trackAction({ action: 'login_submit', status: 'success', scene: 'auth' });
    await router.replace(resolveRedirectPath());
  } catch (error) {
    trackAction({ action: 'login_submit', status: 'failed', scene: 'auth', detail: parseError(error, '登录失败') });
    message.error(parseError(error, '登录失败'));
  } finally {
    loading.value = false;
  }
};

const onRegister = async () => {
  if (!validateRegister()) {
    return;
  }
  loading.value = true;
  try {
    const inviterId = registerForm.inviterIdText.trim() ? Number(registerForm.inviterIdText.trim()) : undefined;
    await register({
      phone: registerForm.phone,
      password: registerForm.password,
      inviterId
    });
    message.success('注册成功，请登录');
    activeTab.value = 'login';
  } catch (error) {
    message.error(parseError(error, '注册失败'));
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="brand-title">Nexa To C WebApp</h1>
      <p class="brand-subtitle">数字资产用户端 MVP（Vue）</p>

      <van-tabs v-model:active="activeTab" animated>
        <van-tab title="登录" name="login">
          <div class="auth-form">
            <van-field v-model="loginForm.phone" label="手机号" placeholder="请输入手机号" data-testid="login-phone" />
            <van-field
              v-model="loginForm.password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              data-testid="login-password"
            />
            <van-button type="primary" :loading="loading" block data-testid="login-submit" @click="onLogin">登录</van-button>
          </div>
        </van-tab>
        <van-tab title="注册" name="register">
          <div class="auth-form">
            <van-field v-model="registerForm.phone" label="手机号" placeholder="请输入手机号" />
            <van-field v-model="registerForm.password" type="password" label="密码" placeholder="至少8位" />
            <van-field v-model="registerForm.inviterIdText" type="digit" label="邀请人ID" placeholder="可选" />
            <van-button type="primary" :loading="loading" block @click="onRegister">注册</van-button>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f7fb;
}

.auth-card {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.brand-title {
  margin: 0;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.brand-subtitle {
  margin: 6px 0 14px;
  text-align: center;
  font-size: 12px;
  color: #64748b;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0 4px;
}
</style>
