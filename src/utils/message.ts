import { showFailToast, showSuccessToast, showToast } from 'vant';

// 统一消息提示封装：避免业务层直接依赖具体 UI 组件库的消息 API 细节。
export const message = {
  success(text: string) {
    showSuccessToast(text);
  },
  error(text: string) {
    showFailToast(text);
  },
  info(text: string) {
    showToast(text);
  },
  warning(text: string) {
    showToast({
      message: text,
      icon: 'warning-o'
    });
  }
};
