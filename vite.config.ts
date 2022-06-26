import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import netlifyEdge from '@netlify/vite-plugin-netlify-edge';

export default defineConfig(() => {
	return {
		plugins: [
			qwikVite({ ssr: { outDir: '.netlify/edge-functions/entry.netlify' } }),
			netlifyEdge({ functionName: 'entry.netlify' }),
		],
	};
});
