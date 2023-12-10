import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv  } from 'vite';





// @ts-ignore
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
		plugins: [sveltekit()],
		server:{
			port: env.PUBLIC_SITE_PORT,
			strictPort:false,
		},
    };
});