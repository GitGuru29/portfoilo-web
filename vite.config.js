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
})
