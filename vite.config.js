import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        // Vite defaults to the IPv6 loopback ([::1]) on macOS, but `localhost`
        // resolves to 127.0.0.1 here — so the browser gets connection-refused.
        // Bind IPv4 explicitly.
        host: '127.0.0.1',
    },
    build: {
        cssCodeSplit: true,
        chunkSizeWarningLimit: 900,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (
                        id.includes('node_modules/three') || 
                        id.includes('node_modules/@react-three') ||
                        id.includes('node_modules/three-stdlib')
                    ) {
                        return 'vendor-three';
                    }
                    if (
                        id.includes('node_modules/react-markdown') || 
                        id.includes('node_modules/remark-gfm') ||
                        id.includes('node_modules/micromark') ||
                        id.includes('node_modules/mdast-util') ||
                        id.includes('node_modules/unist-util') ||
                        id.includes('node_modules/unified')
                    ) {
                        return 'vendor-markdown';
                    }
                    if (
                        id.includes('node_modules/framer-motion') || 
                        id.includes('node_modules/gsap') || 
                        id.includes('node_modules/lenis')
                    ) {
                        return 'vendor-animation';
                    }
                    if (
                        id.includes('node_modules/lucide-react') || 
                        id.includes('node_modules/react-icons')
                    ) {
                        return 'vendor-icons';
                    }
                    if (
                        id.includes('node_modules/react/') || 
                        id.includes('node_modules/react-dom/') || 
                        id.includes('node_modules/react-router') || 
                        id.includes('node_modules/zustand')
                    ) {
                        return 'vendor-react-core';
                    }
                },
            },
        },
    },
})
