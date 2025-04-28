import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHtmlPlugin } from 'vite-plugin-html';
import { visualizer } from 'rollup-plugin-visualizer';

// 模拟 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'prod';

  console.log('当前mode是:', mode);
  console.log('isProduction:', isProduction);

  return {
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          tags: isProduction
            ? [
                {
                  injectTo: 'head',
                  tag: 'script',
                  attrs: {
                    src: 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
                  },
                },
                {
                  injectTo: 'head',
                  tag: 'script',
                  attrs: {
                    src: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
                  },
                },
              ]
            : [],
        },
      }),
      visualizer({
        open: true, // 打包完成后自动打开浏览器查看
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      rollupOptions: {
        // 打包时，不把 react 和 react-dom 打到 bundle 里
        external: isProduction ? ['react', 'react-dom'] : [],
        // 告诉打包器：页面上已经有全局变量 React 和 ReactDOM 了（是通过 <script> 引的 CDN）
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
  };
});
