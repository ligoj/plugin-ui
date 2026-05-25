import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// Library build for the "ui" plugin — Ligoj's shared-UI (dashboard, system,
// api-docs, subscribe wizard). Same shape as plugin-id: host loads the
// bundle dynamically from /main/ui/vue/index.js (proxied to the backend's
// /ligoj-api/webjars/ui/vue/index.js by app-ui's /main/* servlet).
//
// Shared deps (vue, pinia, vue-router, vuetify, @ligoj/host) are external —
// the host's import map resolves them to its own instances so reactivity
// and pinia stores remain singletons.

// Path to the Ligoj host repo, sitting beside `ligoj-plugins/` in the
// developer workspace. Used to resolve `@ligoj/host` for tests and the
// standalone dev server (runtime uses the host's import map).
const HOST_SRC = resolve(__dirname, '../../../ligoj/app-ui/src/main/webapp/src')

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@ligoj/host': resolve(HOST_SRC, 'host.js'),
      '@': HOST_SRC,
    },
    dedupe: ['vue', 'pinia', 'vue-router', 'vuetify'],
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: resolve(
      __dirname,
      '../src/main/resources/META-INF/resources/webjars/ui/vue',
    ),
    emptyOutDir: true,
    rollupOptions: {
      external: ['vue', 'vue-router', 'pinia', 'vuetify', '@ligoj/host'],
      output: {
        assetFileNames: 'index.[ext]',
      },
    },
  },

  server: {
    port: 5175,
    proxy: {
      '/rest': { target: 'http://localhost:8080', changeOrigin: true },
      '/webjars': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/__tests__/setup.js'],
    exclude: ['node_modules/**', 'dist/**'],
    css: false,
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
})
