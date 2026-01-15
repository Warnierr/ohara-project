import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
                    'postprocessing': ['@react-three/postprocessing']
                }
            }
        }
    }
})
