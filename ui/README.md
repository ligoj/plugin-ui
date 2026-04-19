# plugin-ui UI

Vue sources for the Ligoj "ui" plugin — the shared UI shell (dashboard,
system administration, API documentation, subscribe wizard). Built with
Vite in library mode; the output bundle is placed under the Java module's
webjars classpath so the Ligoj host serves it at `/webjars/ui/vue/index.js`
(reached via the host's `/main/*` proxy servlet in runtime).

## Layout

```
ui/
├── package.json
├── vite.config.js            # library build → ../src/main/resources/.../webjars/ui/vue/
├── index.html                # standalone dev entry
└── src/
    ├── index.js              # plugin contract entry (default export)
    ├── UiPlugin.vue          # root component (Phase 1: placeholder shell)
    └── service.js            # service / feature implementations
```

## Commands

```sh
npm install
npm run dev        # standalone dev server on :5175; proxies /rest to :8080
npm run build      # writes ../src/main/resources/META-INF/resources/webjars/ui/vue/index.js
```

## Migration status

This workspace is being ported from the legacy Cascade.js implementation
that still lives under `../src/main/resources/META-INF/resources/webjars/`
(`main.js`, `home/`, `system/`, `api/`, etc.). Phase 1 ships only the
plugin contract and an empty shell; subsequent phases port:

1. Utility functions in legacy `main.js` → composables
2. `home/*` views (dashboard, project, manual)
3. `system/*` views (bench, cache, role, user, plugin, node)
4. `api/*` views (home, token) + `subscribe-wizard/` + `node-*`
