import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const TARGET_EXTENSIONS = new Set(['.vue', '.css', '.scss', '.less']);

/**
 * 非法尺寸公式：
 * 1) px 与 scale 变量相乘（length * length）
 * 2) px 与视口单位相乘（length * length）
 * 这两类表达式会导致样式失效或尺寸异常放大。
 */
const ILLEGAL_RULES = [
  {
    code: 'PX_TIMES_SCALE_VAR',
    regex: /(\d+(\.\d+)?)px\s*\*\s*var\(--nexa-scale-[a-z0-9-]+\)|var\(--nexa-scale-[a-z0-9-]+\)\s*\*\s*(\d+(\.\d+)?)px/i,
    message: '禁止使用 px 与 --nexa-scale-* 相乘，请改为 calc(N * 100vw / var(--nexa-design-width))'
  },
  {
    code: 'PX_TIMES_VIEWPORT',
    regex: /(\d+(\.\d+)?)px\s*\*\s*100(?:vw|vh|dvh)|100(?:vw|vh|dvh)\s*\*\s*(\d+(\.\d+)?)px/i,
    message: '禁止使用 px 与 100vw/100vh/100dvh 相乘，请改为 calc(N * 100vw / var(--nexa-design-width))'
  }
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const issues = [];

  lines.forEach((line, index) => {
    ILLEGAL_RULES.forEach((rule) => {
      if (rule.regex.test(line)) {
        issues.push({
          filePath,
          line: index + 1,
          code: rule.code,
          message: rule.message,
          snippet: line.trim()
        });
      }
    });
  });

  return issues;
}

if (!fs.existsSync(SRC_DIR)) {
  console.error('[size-rules] src 目录不存在，无法执行扫描。');
  process.exit(1);
}

const sourceFiles = walk(SRC_DIR);
const violations = sourceFiles.flatMap(scanFile);

if (violations.length > 0) {
  console.error('[size-rules] 检测到非法尺寸公式：');
  violations.forEach((item) => {
    const rel = path.relative(ROOT, item.filePath);
    console.error(`- ${rel}:${item.line} [${item.code}] ${item.message}`);
    console.error(`  ${item.snippet}`);
  });
  process.exit(1);
}

console.log(`[size-rules] 通过，共扫描 ${sourceFiles.length} 个样式文件，未发现非法尺寸公式。`);
