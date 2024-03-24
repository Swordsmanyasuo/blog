import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path"

const getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};
export default ({ mode }) => {
  return defineConfig({
    plugins: [vue()],
    server: {
      hmr: true,
      port: 3002,
      proxy: {
        '/api': {
          target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_TARGET, // 目标代理接口地址
          secure: false,
          changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
          pathRewrite: {
            '^/api': '/api',
          },
        },
      },
    },
    resolve: {
      // 配置路径别名
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        output: {
          manualChunks (id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      },
      chunkFileNames: (chunkInfo) => {
        const facadeModuleId = chunkInfo.facadeModuleId
          ? chunkInfo.facadeModuleId.split('/')
          : [];
        const fileName =
          facadeModuleId[facadeModuleId.length - 2] || '[name]';
        return `js/${fileName}/[name].[hash].js`;
      }
    }
  })
}
