import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { ManifestOptions, VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest.json';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/systemnote-pro',
	plugins: [
		react(),
		legacy(),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: 'auto',
			manifestFilename: 'manifest.json',
			manifest: manifest as ManifestOptions,
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
				maximumFileSizeToCacheInBytes: 2097152 * 20,
				runtimeCaching: [
					{
						handler: 'StaleWhileRevalidate',
						urlPattern: ({ url }) => url.pathname === '/_config',
						method: 'GET',
					},
				],
			},
		}),
	],
	// server: {
	// 	https: {
	// 		key: fs.readFileSync('.ionic/ssl/key.pem'), // Path to your private key
	// 		cert: fs.readFileSync('.ionic/ssl/cert.pem'), // Path to your certificate
	// 	},
	// },
});
