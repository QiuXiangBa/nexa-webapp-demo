// 业务动态图策略：
// 1) UI 静态资源继续走本地路径（/pages/...）
// 2) 业务动态图片仅允许白名单域名
// 3) 支持后端返回 key 时通过 CDN Base URL 拼接

const rawAllowedHosts = String(import.meta.env.VITE_BIZ_IMAGE_ALLOWED_HOSTS || '').trim();
const rawCdnBaseUrl = String(import.meta.env.VITE_BIZ_IMAGE_CDN_BASE_URL || '').trim();
const rawApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim();

const normalizeHost = (value: string): string => value.trim().toLowerCase();

const parseHost = (value: string): string => {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return '';
  }
};

const createAllowedHostSet = (): Set<string> => {
  const hosts = new Set<string>();

  rawAllowedHosts
    .split(',')
    .map(normalizeHost)
    .filter(Boolean)
    .forEach((host) => hosts.add(host));

  // 开发阶段兜底：若未显式配置白名单，默认允许 API 主机 + 本地回环。
  if (hosts.size === 0) {
    const apiHost = parseHost(rawApiBaseUrl);
    if (apiHost) {
      hosts.add(apiHost);
    }
    hosts.add('localhost');
    hosts.add('127.0.0.1');
  }

  return hosts;
};

const allowedHostSet = createAllowedHostSet();

const isHttpProtocol = (protocol: string): boolean => protocol === 'http:' || protocol === 'https:';

const isAllowedHost = (hostname: string): boolean => {
  const host = normalizeHost(hostname);
  if (allowedHostSet.has(host)) {
    return true;
  }

  // 支持 *.example.com 这种子域名通配规则。
  for (const allowed of allowedHostSet) {
    if (!allowed.startsWith('*.')) {
      continue;
    }
    const domain = allowed.slice(2);
    if (host === domain || host.endsWith(`.${domain}`)) {
      return true;
    }
  }

  return false;
};

const toAbsoluteUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const buildFromCdnBase = (value: string): string | null => {
  if (!rawCdnBaseUrl) {
    return null;
  }

  const base = toAbsoluteUrl(rawCdnBaseUrl);
  if (!base || !isHttpProtocol(base.protocol) || !isAllowedHost(base.hostname)) {
    return null;
  }

  const normalizedKey = value.replace(/^\/+/, '');
  return new URL(normalizedKey, base.toString().endsWith('/') ? base.toString() : `${base.toString()}/`).toString();
};

export const DEFAULT_BIZ_IMAGE_FALLBACK = '/pages/common/image-fallback.svg';

export const resolveBizImageSrc = (raw?: string | null): string | null => {
  if (!raw) {
    return null;
  }

  const value = raw.trim();
  if (!value) {
    return null;
  }

  // 本地资源或同源路径。
  if (value.startsWith('/')) {
    return value;
  }

  // 用户临时预览或小图 data URI（上传前）允许通过。
  if (value.startsWith('blob:') || value.startsWith('data:')) {
    return value;
  }

  const absolute = toAbsoluteUrl(value);
  if (absolute) {
    if (!isHttpProtocol(absolute.protocol)) {
      return null;
    }
    return isAllowedHost(absolute.hostname) ? absolute.toString() : null;
  }

  // 非绝对地址按 key 走 CDN Base URL。
  return buildFromCdnBase(value);
};

export const getSafeBizImageSrc = (raw?: string | null, fallbackSrc: string = DEFAULT_BIZ_IMAGE_FALLBACK): string => {
  return resolveBizImageSrc(raw) || fallbackSrc;
};

