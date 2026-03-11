<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { message } from '@/utils/message';
import { fetchMe, type UserProfile } from '@/services/user';
import { submitRealnameVerify } from '@/services/auth';
import { parseError } from '@/services/http';
import { formatStatus } from '@/utils/format';

const loading = ref(false);
const submitting = ref(false);
const data = ref<UserProfile | null>(null);
const form = reactive({ realName: '', idNo: '' });

const load = async () => {
  loading.value = true;
  try {
    data.value = await fetchMe();
  } catch (error) {
    message.error(parseError(error, '加载用户信息失败'));
  } finally {
    loading.value = false;
  }
};

const onSubmitVerify = async () => {
  if (!form.realName.trim()) {
    message.warning('请输入真实姓名');
    return;
  }
  if (!form.idNo.trim()) {
    message.warning('请输入证件号码');
    return;
  }
  submitting.value = true;
  try {
    await submitRealnameVerify(form);
    message.success('实名提交成功');
    form.realName = '';
    form.idNo = '';
    await load();
  } catch (error) {
    message.error(parseError(error, '实名提交失败'));
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  void load();
});
</script>

<template>
  <div class="profile-section">
    <section class="panel">
      <div class="panel-header">
        <span>我的资料</span>
        <van-button size="small" plain type="primary" @click="load">刷新</van-button>
      </div>

      <div v-if="loading" class="panel-loading">
        <van-loading size="20px" vertical>加载中...</van-loading>
      </div>

      <van-cell-group v-else inset>
        <van-cell title="用户ID" :value="String(data?.userId ?? '-')" />
        <van-cell title="手机号" :value="data?.phone ?? '-'" />
        <van-cell title="账号状态" :value="formatStatus(data?.accountStatus)" />
        <van-cell title="实名状态" :value="formatStatus(data?.realnameStatus)" />
        <van-cell title="邀请人ID" :value="String(data?.inviterId ?? '-')" />
      </van-cell-group>
    </section>

    <section class="panel">
      <h3 class="panel-title">实名提交</h3>
      <van-field v-model="form.realName" label="真实姓名" placeholder="请输入真实姓名" />
      <van-field v-model="form.idNo" label="证件号码" placeholder="请输入证件号码" />
      <van-button type="primary" block :loading="submitting" @click="onSubmitVerify">提交实名</van-button>
    </section>
  </div>
</template>

<style scoped>
.profile-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel {
  border-radius: 12px;
  background: #fff;
  padding: 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.panel-title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.panel-loading {
  padding: 18px 0;
}
</style>
