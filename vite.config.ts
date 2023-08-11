import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [uni()],
	server: {
		// proxy: {
		// 	'/api': {
		// 		target: 'http://sit.lai-do.com/',
		// 		changeOrigin: true,
		// 		rewrite: (path) => {
		// 			return path.replace(/^\/api/, '/');
		// 		}
		// 	}
		// }
	},
	resolve: {
		// 配置路径别名
		alias: {
			'@': path.resolve(__dirname, '/src')
		}
	}
});
