import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    root: 'src/client',
    build: {
        outDir: '../../dist/client',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            cardgameforge: path.resolve(__dirname, '../../src'),
        },
    },
});
