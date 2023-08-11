import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import babel from 'vite-plugin-babel';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [babel(), uni()],
	server: {
		proxy: {
			'/api': {
				target: 'http://sit.lai-do.com/',
				changeOrigin: true,
				rewrite: (path) => {
					return path.replace(/^\/api/, '/');
				}
			}
		}
	},
	resolve: {
		// 配置路径别名
		alias: {
			'@': path.resolve(__dirname, '/src')
		}
	},
	build: {
		// 输出文件目录
		outDir: 'libs',
		minify: 'terser',
		target: 'es2015',
		lib: {
			entry: path.resolve(__dirname, './src/main.ts'),
			name: 'libs',
			fileName: (format) => `uniApp.${format}.js`,
			formats: ['es'] // 默认['es', 'umd']
		},
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true
			}
		}
	}
});
