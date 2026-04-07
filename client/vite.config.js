import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ["9974-2401-4900-1c83-54c-68bc-e0ac-5421-dc78.ngrok-free.app"],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
