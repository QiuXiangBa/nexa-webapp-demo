import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import pxToViewport from 'postcss-px-to-viewport-8-plugin';

// 390 基线仅作用于业务样式源码，避免全局 token / 第三方样式被误转换。
const BIZ_STYLE_INCLUDE = [/\/src\/views\//, /\/src\/components\//, /\/src\/styles\.css$/];
const STYLE_EXCLUDE = [/\/node_modules\//, /\/src\/styles\/tokens\.css$/];

export default defineConfig({
  base: './',
  // 将页面图标目录作为静态资源根目录，支持按页面路径直接使用 /pages/<page>/<icon>
  publicDir: 'src/assets/icons',
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        pxToViewport({
          unitToConvert: 'px',
          viewportWidth: 390,
          unitPrecision: 6,
          propList: ['*'],
          viewportUnit: 'vw',
          fontViewportUnit: 'vw',
          minPixelValue: 1,
          mediaQuery: false,
          replace: true,
          include: BIZ_STYLE_INCLUDE,
          exclude: STYLE_EXCLUDE
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
