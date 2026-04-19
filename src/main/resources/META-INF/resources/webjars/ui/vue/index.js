import { resolveComponent as c, openBlock as m, createElementBlock as p, createVNode as a, withCtx as l, createTextVNode as o, onMounted as d, createElementVNode as r, computed as h, toDisplayString as w, Fragment as j, renderList as S } from "vue";
import { useAppStore as _, useI18nStore as T } from "@ligoj/host";
import { useRoute as $ } from "vue-router";
const x = (t, s) => {
  const n = t.__vccOpts || t;
  for (const [e, i] of s)
    n[e] = i;
  return n;
}, O = { class: "plugin-ui-shell" }, N = {
  __name: "UiPlugin",
  setup(t) {
    return (s, n) => {
      const e = c("v-alert"), i = c("v-list-subheader"), u = c("v-list-item"), f = c("v-list");
      return m(), p("div", O, [
        a(e, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: l(() => [...n[0] || (n[0] = [
            o(" plugin-ui is being migrated from the legacy Cascade.js implementation — most views below are placeholders and link back to their legacy sources. ", -1)
          ])]),
          _: 1
        }),
        a(f, {
          density: "compact",
          class: "mb-4"
        }, {
          default: l(() => [
            a(i, null, {
              default: l(() => [...n[1] || (n[1] = [
                o("Dashboard", -1)
              ])]),
              _: 1
            }),
            a(u, {
              to: "/home",
              "prepend-icon": "mdi-view-dashboard",
              title: "Overview"
            }),
            a(u, {
              to: "/home/project",
              "prepend-icon": "mdi-folder-multiple",
              title: "Projects"
            }),
            a(u, {
              to: "/home/manual",
              "prepend-icon": "mdi-book-open-page-variant",
              title: "Manual"
            }),
            a(i, null, {
              default: l(() => [...n[2] || (n[2] = [
                o("System", -1)
              ])]),
              _: 1
            }),
            a(u, {
              to: "/system",
              "prepend-icon": "mdi-cog",
              title: "System administration"
            }),
            a(i, null, {
              default: l(() => [...n[3] || (n[3] = [
                o("API", -1)
              ])]),
              _: 1
            }),
            a(u, {
              to: "/api",
              "prepend-icon": "mdi-api",
              title: "API reference"
            }),
            a(u, {
              to: "/api/token",
              "prepend-icon": "mdi-key-variant",
              title: "API tokens"
            }),
            a(i, null, {
              default: l(() => [...n[4] || (n[4] = [
                o("Onboarding", -1)
              ])]),
              _: 1
            }),
            a(u, {
              to: "/subscribe",
              "prepend-icon": "mdi-playlist-plus",
              title: "Subscribe wizard"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}, P = /* @__PURE__ */ x(N, [["__scopeId", "data-v-9cfeae95"]]), g = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, k = { class: "pa-4" }, A = {
  __name: "HomeView",
  setup(t) {
    const s = _(), { t: n } = T();
    return d(() => {
      s.setTitle(n("nav.home") || "Home"), s.setBreadcrumbs([{ title: n("nav.home") || "Home" }]);
    }), (e, i) => {
      const u = c("v-alert");
      return m(), p("div", k, [
        i[1] || (i[1] = r("h1", { class: "text-h4 mb-4" }, "Dashboard", -1)),
        a(u, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...i[0] || (i[0] = [
            o(" Dashboard view — port from legacy ", -1),
            r("code", null, "webjars/home/home.js", -1),
            o(" (projects grid, quick actions). TODO. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, D = { class: "pa-4" }, I = {
  __name: "ProjectListView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("Projects"), s.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects" }
      ]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", D, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "Projects", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Project list — legacy ", -1),
            r("code", null, "webjars/home/project/", -1),
            o(". TODO: wire ", -1),
            r("code", null, "rest/project", -1),
            o(", DataTable with search, links to detail view. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, B = { class: "pa-4" }, V = { class: "text-h4 mb-4" }, L = {
  __name: "ProjectDetailView",
  setup(t) {
    const s = $(), n = _(), e = h(() => s.params.id);
    return d(() => {
      n.setTitle(`Project ${e.value}`), n.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        { title: e.value }
      ]);
    }), (i, u) => {
      const f = c("v-alert");
      return m(), p("div", B, [
        r("h1", V, "Project #" + w(e.value), 1),
        a(f, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...u[0] || (u[0] = [
            o(" Project detail — legacy ", -1),
            r("code", null, "webjars/home/project/project.js", -1),
            o(". TODO: subscriptions panel, parameters, audit metadata. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, U = { class: "pa-4" }, C = {
  __name: "ManualView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("Manual"), s.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", U, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Embedded user manual — legacy ", -1),
            r("code", null, "webjars/home/manual/", -1),
            o(". TODO. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, z = { class: "pa-4" }, R = {
  __name: "SystemView",
  setup(t) {
    const s = _(), n = [
      { to: "/system/user", icon: "mdi-account-multiple", title: "Users", subtitle: "Active sessions and accounts" },
      { to: "/system/role", icon: "mdi-shield-account", title: "Roles", subtitle: "Authorization rules" },
      { to: "/system/plugin", icon: "mdi-puzzle", title: "Plugins", subtitle: "Installed feature plugins" },
      { to: "/system/node", icon: "mdi-server", title: "Nodes", subtitle: "Service & tool registrations" },
      { to: "/system/cache", icon: "mdi-database-refresh", title: "Cache", subtitle: "Invalidate application caches" },
      { to: "/system/bench", icon: "mdi-speedometer", title: "Bench", subtitle: "Diagnostics" }
    ];
    return d(() => {
      s.setTitle("System"), s.setBreadcrumbs([{ title: "System" }]);
    }), (e, i) => {
      const u = c("v-list-item"), f = c("v-list");
      return m(), p("div", z, [
        i[0] || (i[0] = r("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        a(f, null, {
          default: l(() => [
            (m(), p(j, null, S(n, (y) => a(u, {
              key: y.to,
              to: y.to,
              "prepend-icon": y.icon,
              title: y.title,
              subtitle: y.subtitle
            }, null, 8, ["to", "prepend-icon", "title", "subtitle"])), 64))
          ]),
          _: 1
        })
      ]);
    };
  }
}, H = { class: "pa-4" }, E = {
  __name: "SystemUserView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("System users"), s.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", H, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "System — Users", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Legacy ", -1),
            r("code", null, "webjars/system/user/", -1),
            o(". TODO: active sessions list from ", -1),
            r("code", null, "rest/system/user", -1),
            o(", kick session action. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, F = { class: "pa-4" }, M = {
  __name: "SystemRoleView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("Roles"), s.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", F, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "System — Roles", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Legacy ", -1),
            r("code", null, "webjars/system/role/", -1),
            o(". TODO: CRUD over ", -1),
            r("code", null, "rest/system/security/role", -1),
            o(", authorization pattern editor. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, q = { class: "pa-4" }, W = {
  __name: "SystemPluginView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("Plugins"), s.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plugins" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", q, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "System — Plugins", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Legacy ", -1),
            r("code", null, "webjars/system/plugin/", -1),
            o(". TODO: installed-plugin grid, install/uninstall/restart actions against ", -1),
            r("code", null, "rest/system/plugin", -1),
            o(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, G = { class: "pa-4" }, Y = {
  __name: "SystemNodeView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("Nodes"), s.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", G, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "System — Nodes", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Legacy ", -1),
            r("code", null, "webjars/system/node/", -1),
            o(". TODO: hierarchical node tree (service → tool → instance), parameter editor, tool-icon rendering via ", -1),
            r("code", null, "useUiHelpers", -1),
            o(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, J = { class: "pa-4" }, K = {
  __name: "SystemCacheView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("Cache"), s.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Cache" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", J, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "System — Cache", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Legacy ", -1),
            r("code", null, "webjars/system/cache/", -1),
            o(". TODO: invalidate caches (global + per-name) via ", -1),
            r("code", null, "rest/system/cache", -1),
            o(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, Q = { class: "pa-4" }, X = {
  __name: "SystemBenchView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("Bench"), s.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", Q, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "System — Bench", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Legacy ", -1),
            r("code", null, "webjars/system/bench/", -1),
            o(". TODO: diagnostics endpoint panel. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, Z = { class: "pa-4" }, tt = {
  __name: "ApiHomeView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("API"), s.setBreadcrumbs([{ title: "API" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", Z, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "API", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Legacy ", -1),
            r("code", null, "webjars/api/", -1),
            o(". TODO: OpenAPI/Swagger rendering or static docs panel. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, et = { class: "pa-4" }, st = {
  __name: "ApiTokenView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("API tokens"), s.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", et, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "API — Tokens", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Legacy ", -1),
            r("code", null, "webjars/api/token/", -1),
            o(". TODO: personal API token management (create / revoke) via ", -1),
            r("code", null, "rest/security/api-token", -1),
            o(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, nt = { class: "pa-4" }, ot = {
  __name: "SubscribeWizardView",
  setup(t) {
    const s = _();
    return d(() => {
      s.setTitle("Subscribe"), s.setBreadcrumbs([{ title: "Subscribe" }]);
    }), (n, e) => {
      const i = c("v-alert");
      return m(), p("div", nt, [
        e[1] || (e[1] = r("h1", { class: "text-h4 mb-4" }, "Subscribe wizard", -1)),
        a(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: l(() => [...e[0] || (e[0] = [
            o(" Legacy ", -1),
            r("code", null, "webjars/subscribe-wizard/", -1),
            o(". TODO: multi-step flow (select project → pick service → pick tool → configure parameters) backing ", -1),
            r("code", null, "rest/subscription", -1),
            o(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
};
function ut(t) {
  if (!t || typeof t != "object") return t;
  for (const s of Object.keys(t)) {
    const n = t[s];
    (n == null || n === "" || n === !1) && delete t[s];
  }
  return t;
}
function dt(t) {
  return typeof t != "string" ? "" : t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function _t(t) {
  return typeof t != "string" ? "" : t.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function ft(t) {
  if (!t) return "??";
  if (t.firstName && t.lastName)
    return t.firstName.charAt(0) + t.lastName.charAt(0);
  if (t.fullName) {
    const n = t.fullName.split(" ");
    return n.length === 1 ? t.fullName.charAt(0) + (t.fullName.length >= 2 ? t.fullName.charAt(1) : "") : n[0].charAt(0) + n[n.length - 1].charAt(0);
  }
  const s = (t.id || t || "??").toString();
  return (s.length === 1 ? s + s : s).slice(0, 2);
}
function yt(t) {
  if (!t) return "";
  if (t.fullName) return t.fullName;
  if (t.firstName && t.lastName) return `${t.firstName} ${t.lastName}`;
  if (t.firstName) return `${t.firstName} ${(t.id || "").substring(1)}`;
  if (t.lastName) return `${v((t.id || "").charAt(0))}. ${t.lastName}`;
  const s = (t.id || t || "??").toString();
  return `${v(s.charAt(0))}. ${v(s.substring(1))}`;
}
function v(t) {
  return t && t.charAt(0).toUpperCase() + t.slice(1);
}
function vt(t) {
  if (!t) return null;
  const s = t.split(":");
  return s.length > 2 ? s.slice(0, 3).join("-") : null;
}
function bt(t) {
  if (!t) return null;
  const s = t.split(":");
  return s.length > 1 ? s.slice(0, 2).join("-") : null;
}
function gt(t) {
  return (t || "").split(":")[1] || null;
}
function ht(t) {
  return (t || "").split(":")[2] || null;
}
function wt(t) {
  if (!t) return [];
  const s = t.split(":"), n = [];
  for (let e = 2; e <= s.length; e++)
    n.push(s.slice(0, e).join("-"));
  return n;
}
function it(t) {
  return t ? (t.service || (t.service = t.refined && it(t.refined) || t), t.service) : null;
}
function rt(t) {
  return t ? t.tool ? t.tool : t.refined ? (t.tool = t.refined.refined ? rt(t.refined) : t, t.tool) : null : null;
}
const at = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function jt(t) {
  return t ? t.replace(/[-[()\]${},;_:]/g, " ").replace(at, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const St = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, lt = {
  sample: g.sample
}, b = [
  { path: "/home", name: "ui-home", component: A },
  { path: "/home/manual", name: "ui-manual", component: C },
  { path: "/home/project", name: "ui-project-list", component: I },
  { path: "/home/project/:id", name: "ui-project-detail", component: L },
  { path: "/system", name: "ui-system", component: R },
  { path: "/system/user", name: "ui-system-user", component: E },
  { path: "/system/role", name: "ui-system-role", component: M },
  { path: "/system/plugin", name: "ui-system-plugin", component: W },
  { path: "/system/node", name: "ui-system-node", component: Y },
  { path: "/system/cache", name: "ui-system-cache", component: K },
  { path: "/system/bench", name: "ui-system-bench", component: X },
  { path: "/api", name: "ui-api", component: tt },
  { path: "/api/token", name: "ui-api-token", component: st },
  { path: "/subscribe", name: "ui-subscribe", component: ot }
], Tt = {
  id: "ui",
  label: "UI",
  component: P,
  routes: b,
  install({ router: t }) {
    for (const s of b)
      t.addRoute(s);
  },
  feature(t, ...s) {
    const n = lt[t];
    if (!n) throw new Error(`Plugin "ui" has no feature "${t}"`);
    return n(...s);
  },
  service: g,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  St as TARGET_TYPE_ICON,
  Tt as default,
  yt as getFullName,
  wt as getHierarchyIds,
  it as getService,
  bt as getServiceFromId,
  gt as getServiceNameFromId,
  rt as getTool,
  vt as getToolFromId,
  ht as getToolNameFromId,
  dt as htmlEscape,
  _t as htmlUnescape,
  jt as normalize,
  g as service,
  ft as toUser2Letters,
  ut as trimObject
};
