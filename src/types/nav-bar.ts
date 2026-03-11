export type NavBarMode = 'none' | 'tab' | 'standard' | 'overlay' | 'custom';

export type NavBarRightAction = 'none' | 'more' | 'share' | 'message' | 'scan' | 'filter';

// 通用顶栏 meta 定义。
// 当前先给标准二级页落地，tab / overlay / custom 作为后续统一收口的约定保留。
export interface NavBarMeta {
  mode: NavBarMode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  fallbackPath?: string;
  rightAction?: NavBarRightAction;
  bordered?: boolean;
  transparent?: boolean;
  collapseOnScroll?: boolean;
}
