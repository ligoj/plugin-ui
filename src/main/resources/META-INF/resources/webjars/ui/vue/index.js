import { resolveComponent as n, openBlock as c, createElementBlock as J, createVNode as e, withCtx as t, createTextVNode as l, ref as i, computed as ce, onMounted as me, createElementVNode as u, Fragment as ve, renderList as ke, createBlock as B, toDisplayString as C, createCommentVNode as K, normalizeClass as Oe, mergeProps as Ue, unref as ie, withDirectives as Ge, withModifiers as xe, vShow as He, watch as Ie, reactive as Ve, normalizeStyle as $e, withKeys as he, onBeforeUnmount as We, h as be } from "vue";
import { useApi as fe, useAppStore as pe, useI18nStore as Ke, useDataTable as Ae, useErrorStore as Je, useAuthStore as Te } from "@ligoj/host";
import { useRouter as Ne, useRoute as De } from "vue-router";
const we = (m, T) => {
  const j = m.__vccOpts || m;
  for (const [I, R] of T)
    j[I] = R;
  return j;
}, Ze = { class: "plugin-ui-shell" }, Xe = {
  __name: "UiPlugin",
  setup(m) {
    return (T, j) => {
      const I = n("v-alert"), R = n("v-list-subheader"), d = n("v-list-item"), D = n("v-list");
      return c(), J("div", Ze, [
        e(I, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...j[0] || (j[0] = [
            l(" plugin-ui is being migrated from the legacy Cascade.js implementation — most views below are placeholders and link back to their legacy sources. ", -1)
          ])]),
          _: 1
        }),
        e(D, {
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            e(R, null, {
              default: t(() => [...j[1] || (j[1] = [
                l("Dashboard", -1)
              ])]),
              _: 1
            }),
            e(d, {
              to: "/home",
              "prepend-icon": "mdi-view-dashboard",
              title: "Overview"
            }),
            e(d, {
              to: "/home/project",
              "prepend-icon": "mdi-folder-multiple",
              title: "Projects"
            }),
            e(d, {
              to: "/home/manual",
              "prepend-icon": "mdi-book-open-page-variant",
              title: "Manual"
            }),
            e(R, null, {
              default: t(() => [...j[2] || (j[2] = [
                l("System", -1)
              ])]),
              _: 1
            }),
            e(d, {
              to: "/system",
              "prepend-icon": "mdi-cog",
              title: "System administration"
            }),
            e(R, null, {
              default: t(() => [...j[3] || (j[3] = [
                l("API", -1)
              ])]),
              _: 1
            }),
            e(d, {
              to: "/api",
              "prepend-icon": "mdi-api",
              title: "API reference"
            }),
            e(d, {
              to: "/api/token",
              "prepend-icon": "mdi-key-variant",
              title: "API tokens"
            }),
            e(R, null, {
              default: t(() => [...j[4] || (j[4] = [
                l("Onboarding", -1)
              ])]),
              _: 1
            }),
            e(d, {
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
}, Ye = /* @__PURE__ */ we(Xe, [["__scopeId", "data-v-9cfeae95"]]), Re = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, Qe = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, et = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mb-4"
}, tt = { class: "ml-1 text-caption" }, lt = { class: "d-flex align-start mb-2" }, nt = { class: "flex-grow-1 truncate" }, at = { class: "text-subtitle-1 font-weight-medium truncate" }, ot = { class: "text-caption text-medium-emphasis" }, st = {
  key: 0,
  class: "sub-strip"
}, it = {
  key: 0,
  class: "text-caption text-medium-emphasis ml-1"
}, rt = { style: { width: "28px" } }, ut = { class: "truncate" }, dt = { class: "truncate text-medium-emphasis" }, ct = {
  __name: "HomeView",
  setup(m) {
    const T = fe(), j = pe(), I = i(!1), R = i(null), d = i([]), D = i(""), U = i(null), P = i("md"), $ = ce(() => {
      var N, O, z;
      const p = /* @__PURE__ */ new Map();
      for (const A of d.value) {
        const V = ((N = A.project) == null ? void 0 : N.id) ?? A.project;
        if (V == null) continue;
        let r = p.get(V);
        r || (r = {
          id: V,
          name: ((O = A.project) == null ? void 0 : O.name) || String(V),
          pkey: ((z = A.project) == null ? void 0 : z.pkey) || "",
          subscriptions: []
        }, p.set(V, r)), r.subscriptions.push(A);
      }
      return [...p.values()].sort((A, V) => A.name.localeCompare(V.name));
    }), s = ce(() => {
      var N, O, z;
      const p = /* @__PURE__ */ new Map();
      for (const A of d.value) {
        const V = ((z = (O = (N = A.node) == null ? void 0 : N.refined) == null ? void 0 : O.refined) == null ? void 0 : z.id) || "";
        V && p.set(V, (p.get(V) || 0) + 1);
      }
      return [...p.entries()].sort((A, V) => V[1] - A[1]).map(([A, V]) => ({
        id: A,
        count: V,
        icon: h(A),
        label: A.split(":").slice(-1)[0]
      }));
    }), S = ce(() => {
      var N;
      const p = (N = D.value) == null ? void 0 : N.trim().toLowerCase();
      return $.value.filter((O) => U.value && !O.subscriptions.some(
        (A) => {
          var V, r, v;
          return ((v = (r = (V = A.node) == null ? void 0 : V.refined) == null ? void 0 : r.refined) == null ? void 0 : v.id) === U.value;
        }
      ) ? !1 : !p || O.name.toLowerCase().includes(p) || O.pkey.toLowerCase().includes(p) ? !0 : O.subscriptions.some(
        (z) => {
          var A, V, r, v;
          return (((A = z.node) == null ? void 0 : A.name) || "").toLowerCase().includes(p) || (((V = z.node) == null ? void 0 : V.id) || "").toLowerCase().includes(p) || (((v = (r = z.node) == null ? void 0 : r.refined) == null ? void 0 : v.name) || "").toLowerCase().includes(p);
        }
      ));
    });
    function h(p) {
      return p.includes(":scm:") ? "mdi-source-branch" : p.includes(":build:") ? "mdi-hammer-wrench" : p.includes(":bt") ? "mdi-bug" : p.includes(":km:") ? "mdi-book-open-variant" : p.includes(":vm") ? "mdi-server" : p.includes(":prov") ? "mdi-cloud" : p.includes(":id") ? "mdi-account-group" : p.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    function q(p) {
      var N, O, z;
      return h(((z = (O = (N = p.node) == null ? void 0 : N.refined) == null ? void 0 : O.refined) == null ? void 0 : z.id) || "");
    }
    function E(p) {
      var A, V, r;
      const N = ((r = (V = (A = p.node) == null ? void 0 : A.refined) == null ? void 0 : V.refined) == null ? void 0 : r.id) || "", O = ["primary", "teal", "indigo", "purple", "orange", "blue-grey", "green"];
      let z = 0;
      for (const v of N) z += v.charCodeAt(0);
      return O[z % O.length];
    }
    async function f() {
      I.value = !0, R.value = null;
      const p = await T.get("rest/subscription");
      Array.isArray(p) ? d.value = p : Array.isArray(p == null ? void 0 : p.data) ? d.value = p.data : d.value = [], I.value = !1;
    }
    return me(() => {
      j.setTitle("Dashboard"), j.setBreadcrumbs([{ title: "Home" }]), f();
    }), (p, N) => {
      const O = n("v-spacer"), z = n("v-text-field"), A = n("v-icon"), V = n("v-btn"), r = n("v-btn-toggle"), v = n("v-chip"), _ = n("v-alert"), o = n("v-progress-linear"), L = n("v-tooltip"), x = n("v-table"), ee = n("v-card-text"), G = n("v-card");
      return c(), J("div", null, [
        u("div", Qe, [
          N[6] || (N[6] = u("h1", { class: "text-h4" }, "Dashboard", -1)),
          e(O),
          e(z, {
            modelValue: D.value,
            "onUpdate:modelValue": N[0] || (N[0] = (k) => D.value = k),
            "prepend-inner-icon": "mdi-magnify",
            label: "Filter projects or tools",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field",
            clearable: ""
          }, null, 8, ["modelValue"]),
          e(r, {
            modelValue: P.value,
            "onUpdate:modelValue": N[1] || (N[1] = (k) => P.value = k),
            mandatory: "",
            density: "compact",
            color: "primary"
          }, {
            default: t(() => [
              e(V, {
                value: "sm",
                title: "Small tiles"
              }, {
                default: t(() => [
                  e(A, null, {
                    default: t(() => [...N[2] || (N[2] = [
                      l("mdi-view-comfy", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(V, {
                value: "md",
                title: "Medium tiles"
              }, {
                default: t(() => [
                  e(A, null, {
                    default: t(() => [...N[3] || (N[3] = [
                      l("mdi-view-grid", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(V, {
                value: "lg",
                title: "List"
              }, {
                default: t(() => [
                  e(A, null, {
                    default: t(() => [...N[4] || (N[4] = [
                      l("mdi-view-list", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"]),
          e(V, {
            variant: "outlined",
            "prepend-icon": "mdi-folder-multiple",
            to: "/home/project"
          }, {
            default: t(() => [...N[5] || (N[5] = [
              l(" All projects ", -1)
            ])]),
            _: 1
          })
        ]),
        s.value.length ? (c(), J("div", et, [
          (c(!0), J(ve, null, ke(s.value, (k) => (c(), B(v, {
            key: k.id,
            color: U.value === k.id ? "primary" : void 0,
            variant: U.value === k.id ? "elevated" : "tonal",
            size: "small",
            onClick: (a) => U.value = U.value === k.id ? null : k.id
          }, {
            default: t(() => [
              e(A, {
                start: "",
                size: "small"
              }, {
                default: t(() => [
                  l(C(k.icon), 1)
                ]),
                _: 2
              }, 1024),
              l(" " + C(k.label) + " ", 1),
              u("span", tt, C(k.count), 1)
            ]),
            _: 2
          }, 1032, ["color", "variant", "onClick"]))), 128))
        ])) : K("", !0),
        R.value ? (c(), B(_, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(R.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        I.value ? (c(), B(o, {
          key: 2,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : K("", !0),
        !I.value && S.value.length === 0 && !R.value ? (c(), B(_, {
          key: 3,
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...N[7] || (N[7] = [
            l(" No projects match the current filter. ", -1)
          ])]),
          _: 1
        })) : K("", !0),
        u("div", {
          class: Oe(["tile-grid", `size-${P.value}`])
        }, [
          (c(!0), J(ve, null, ke(S.value, (k) => (c(), B(G, {
            key: k.id,
            class: "tile",
            hover: "",
            to: `/home/project/${k.id}`
          }, {
            default: t(() => [
              e(ee, { class: "pa-3" }, {
                default: t(() => [
                  u("div", lt, [
                    u("div", nt, [
                      u("div", at, C(k.name), 1),
                      u("div", ot, C(k.pkey), 1)
                    ]),
                    e(v, {
                      size: "x-small",
                      variant: "tonal"
                    }, {
                      default: t(() => [
                        l(C(k.subscriptions.length), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  P.value !== "lg" ? (c(), J("div", st, [
                    (c(!0), J(ve, null, ke(k.subscriptions.slice(0, P.value === "sm" ? 4 : 8), (a) => {
                      var b, te, Z, Y;
                      return c(), B(L, {
                        key: a.id,
                        text: `${((te = (b = a.node) == null ? void 0 : b.refined) == null ? void 0 : te.name) || "—"} → ${((Z = a.node) == null ? void 0 : Z.name) || ((Y = a.node) == null ? void 0 : Y.id)}`,
                        location: "top"
                      }, {
                        activator: t(({ props: y }) => [
                          e(A, Ue({ ref_for: !0 }, y, {
                            size: "small",
                            color: E(a),
                            class: "mr-1"
                          }), {
                            default: t(() => [
                              l(C(q(a)), 1)
                            ]),
                            _: 2
                          }, 1040, ["color"])
                        ]),
                        _: 2
                      }, 1032, ["text"]);
                    }), 128)),
                    k.subscriptions.length > (P.value === "sm" ? 4 : 8) ? (c(), J("span", it, " +" + C(k.subscriptions.length - (P.value === "sm" ? 4 : 8)), 1)) : K("", !0)
                  ])) : (c(), B(x, {
                    key: 1,
                    density: "compact",
                    class: "mt-2",
                    style: { background: "transparent" }
                  }, {
                    default: t(() => [
                      u("tbody", null, [
                        (c(!0), J(ve, null, ke(k.subscriptions, (a) => {
                          var b, te, Z, Y;
                          return c(), J("tr", {
                            key: a.id
                          }, [
                            u("td", rt, [
                              e(A, {
                                size: "small",
                                color: E(a)
                              }, {
                                default: t(() => [
                                  l(C(q(a)), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            u("td", ut, C(((te = (b = a.node) == null ? void 0 : b.refined) == null ? void 0 : te.name) || "—"), 1),
                            u("td", dt, C(((Z = a.node) == null ? void 0 : Z.name) || ((Y = a.node) == null ? void 0 : Y.id)), 1)
                          ]);
                        }), 128))
                      ])
                    ]),
                    _: 2
                  }, 1024))
                ]),
                _: 2
              }, 1024)
            ]),
            _: 2
          }, 1032, ["to"]))), 128))
        ], 2)
      ]);
    };
  }
}, mt = /* @__PURE__ */ we(ct, [["__scopeId", "data-v-3f6316a9"]]);
function Rl(m) {
  if (!m || typeof m != "object") return m;
  for (const T of Object.keys(m)) {
    const j = m[T];
    (j == null || j === "" || j === !1) && delete m[T];
  }
  return m;
}
function Ll(m) {
  return typeof m != "string" ? "" : m.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function El(m) {
  return typeof m != "string" ? "" : m.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function pt(m) {
  if (!m) return "??";
  if (m.firstName && m.lastName)
    return m.firstName.charAt(0) + m.lastName.charAt(0);
  if (m.fullName) {
    const j = m.fullName.split(" ");
    return j.length === 1 ? m.fullName.charAt(0) + (m.fullName.length >= 2 ? m.fullName.charAt(1) : "") : j[0].charAt(0) + j[j.length - 1].charAt(0);
  }
  const T = (m.id || m || "??").toString();
  return (T.length === 1 ? T + T : T).slice(0, 2);
}
function Le(m) {
  if (!m) return "";
  if (m.fullName) return m.fullName;
  if (m.firstName && m.lastName) return `${m.firstName} ${m.lastName}`;
  if (m.firstName) return `${m.firstName} ${(m.id || "").substring(1)}`;
  if (m.lastName) return `${Se((m.id || "").charAt(0))}. ${m.lastName}`;
  const T = (m.id || m || "??").toString();
  return `${Se(T.charAt(0))}. ${Se(T.substring(1))}`;
}
function Se(m) {
  return m && m.charAt(0).toUpperCase() + m.slice(1);
}
function Bl(m) {
  if (!m) return null;
  const T = m.split(":");
  return T.length > 2 ? T.slice(0, 3).join("-") : null;
}
function ql(m) {
  if (!m) return null;
  const T = m.split(":");
  return T.length > 1 ? T.slice(0, 2).join("-") : null;
}
function Ml(m) {
  return (m || "").split(":")[1] || null;
}
function Fl(m) {
  return (m || "").split(":")[2] || null;
}
function Ol(m) {
  if (!m) return [];
  const T = m.split(":"), j = [];
  for (let I = 2; I <= T.length; I++)
    j.push(T.slice(0, I).join("-"));
  return j;
}
function vt(m) {
  return m ? (m.service || (m.service = m.refined && vt(m.refined) || m), m.service) : null;
}
function ft(m) {
  return m ? m.tool ? m.tool : m.refined ? (m.tool = m.refined.refined ? ft(m.refined) : m, m.tool) : null : null;
}
const _t = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function yt(m) {
  return m ? m.replace(/[-[()\]${},;_:]/g, " ").replace(_t, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const Gl = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, gt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, bt = { class: "text-caption" }, kt = {
  key: 1,
  class: "text-disabled"
}, wt = { class: "mb-4" }, xt = {
  __name: "ProjectListView",
  setup(m) {
    const T = Ne(), j = fe(), I = pe(), { t: R } = Ke(), d = Ae("project", { defaultSort: "name" }), D = i(25);
    let U = null, P = {};
    const $ = i(null), s = i(!1), S = i(null), h = i({ name: "", pkey: "", teamLeader: "", description: "" }), q = i(!1), E = i(!1), f = i(null), p = i(!1), N = i(!1);
    let O = "";
    const z = ce(() => [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Description", key: "description", sortable: !1 },
      { title: "Manager", key: "teamLeader", sortable: !1, width: "220px" },
      { title: "Created", key: "createdDate", sortable: !0, width: "140px" },
      { title: "Subs", key: "nbSubscriptions", sortable: !1, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ]), A = {
      required: (a) => !!a || "Required",
      pkey: (a) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(a || "") || "Use lowercase letters, digits, dash"
    };
    function V(a) {
      if (!a) return "";
      const b = typeof a == "number" ? new Date(a) : new Date(a);
      return isNaN(b.getTime()) ? "" : b.toISOString().slice(0, 10);
    }
    function r(a) {
      P = a, d.load(a);
    }
    function v() {
      clearTimeout(U), U = setTimeout(
        () => d.load({ page: 1, itemsPerPage: D.value, sortBy: P.sortBy }),
        300
      );
    }
    function _(a) {
      const b = yt(a || "").split(" ").filter(Boolean);
      return b.length ? b.join("-") : "";
    }
    function o() {
      var b;
      if (((b = S.value) == null ? void 0 : b.nbSubscriptions) > 0) return;
      const a = _(h.value.name);
      (!h.value.pkey || h.value.pkey === O) && (h.value.pkey = a, O = a);
    }
    function L() {
      S.value = null, h.value = { name: "", pkey: "", teamLeader: "", description: "" }, O = "", s.value = !0;
    }
    function x(a) {
      var b;
      S.value = a, h.value = {
        name: a.name || "",
        pkey: a.pkey || "",
        teamLeader: ((b = a.teamLeader) == null ? void 0 : b.id) || "",
        description: a.description || ""
      }, O = a.pkey || "", s.value = !0;
    }
    function ee(a) {
      f.value = a, N.value = !1, E.value = !0;
    }
    async function G() {
      var Y, y, H;
      const { valid: a } = await $.value.validate();
      if (!a) return;
      if (d.demoMode.value) {
        s.value = !1;
        return;
      }
      q.value = !0;
      const b = {
        id: (Y = S.value) == null ? void 0 : Y.id,
        name: h.value.name,
        pkey: h.value.pkey,
        teamLeader: h.value.teamLeader,
        description: h.value.description
      }, te = (y = S.value) != null && y.id ? "put" : "post", Z = await j[te]("rest/project", b);
      q.value = !1, Z !== null && (s.value = !1, !((H = S.value) != null && H.id) && typeof Z != "object" ? T.push(`/home/project/${Z}`) : d.load(P));
    }
    async function k() {
      if (d.demoMode.value) {
        E.value = !1;
        return;
      }
      p.value = !0;
      const a = N.value ? "?deleteRemoteData=true" : "";
      await j.del(`rest/project/${f.value.id}${a}`), p.value = !1, E.value = !1, d.load(P);
    }
    return me(() => {
      I.setTitle("Projects"), I.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), (a, b) => {
      const te = n("v-spacer"), Z = n("v-text-field"), Y = n("v-btn"), y = n("v-alert"), H = n("v-skeleton-loader"), le = n("v-avatar"), W = n("v-chip"), oe = n("v-icon"), re = n("v-data-table-server"), F = n("v-card-title"), se = n("v-textarea"), de = n("v-form"), _e = n("v-card-text"), w = n("v-card-actions"), g = n("v-card"), Q = n("v-dialog"), M = n("v-checkbox");
      return c(), J("div", null, [
        u("div", gt, [
          b[13] || (b[13] = u("h1", { class: "text-h4" }, "Projects", -1)),
          e(te),
          e(Z, {
            modelValue: ie(d).search.value,
            "onUpdate:modelValue": [
              b[0] || (b[0] = (ne) => ie(d).search.value = ne),
              v
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(Y, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: L
          }, {
            default: t(() => [...b[12] || (b[12] = [
              l(" New ", -1)
            ])]),
            _: 1
          })
        ]),
        ie(d).error.value ? (c(), B(y, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(ie(d).error.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        ie(d).demoMode.value ? (c(), B(y, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...b[14] || (b[14] = [
            l(" Running without a live backend — results below are sample data. ", -1)
          ])]),
          _: 1
        })) : K("", !0),
        ie(d).loading.value && ie(d).items.value.length === 0 ? (c(), B(H, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : K("", !0),
        ie(d).error.value ? K("", !0) : Ge((c(), B(re, {
          key: 3,
          "items-per-page": D.value,
          "onUpdate:itemsPerPage": b[1] || (b[1] = (ne) => D.value = ne),
          headers: z.value,
          items: ie(d).items.value,
          "items-length": ie(d).totalItems.value,
          loading: ie(d).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": r,
          "onClick:row": b[2] || (b[2] = (ne, { item: ae }) => ie(T).push(`/home/project/${ae.id}`))
        }, {
          "item.teamLeader": t(({ item: ne }) => {
            var ae;
            return [
              (ae = ne.teamLeader) != null && ae.id ? (c(), J(ve, { key: 0 }, [
                e(le, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: t(() => [
                    u("span", bt, C(ie(pt)(ne.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                l(" " + C(ie(Le)(ne.teamLeader)), 1)
              ], 64)) : (c(), J("span", kt, "—"))
            ];
          }),
          "item.createdDate": t(({ item: ne }) => [
            l(C(V(ne.createdDate)), 1)
          ]),
          "item.nbSubscriptions": t(({ item: ne }) => [
            e(W, {
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(C(ne.nbSubscriptions || 0), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          "item.actions": t(({ item: ne }) => [
            e(Y, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: xe((ae) => x(ne), ["stop"])
            }, {
              default: t(() => [
                e(oe, { size: "small" }, {
                  default: t(() => [...b[15] || (b[15] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(Y, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: xe((ae) => ee(ne), ["stop"])
            }, {
              default: t(() => [
                e(oe, { size: "small" }, {
                  default: t(() => [...b[16] || (b[16] = [
                    l("mdi-delete", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["items-per-page", "headers", "items", "items-length", "loading"])), [
          [He, ie(d).items.value.length > 0 || !ie(d).loading.value]
        ]),
        e(Q, {
          modelValue: s.value,
          "onUpdate:modelValue": b[8] || (b[8] = (ne) => s.value = ne),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(g, null, {
              default: t(() => [
                e(F, null, {
                  default: t(() => {
                    var ne;
                    return [
                      l(C((ne = S.value) != null && ne.id ? "Edit project" : "New project"), 1)
                    ];
                  }),
                  _: 1
                }),
                e(_e, null, {
                  default: t(() => [
                    e(de, {
                      ref_key: "formRef",
                      ref: $,
                      onSubmit: xe(G, ["prevent"])
                    }, {
                      default: t(() => {
                        var ne, ae;
                        return [
                          e(Z, {
                            modelValue: h.value.name,
                            "onUpdate:modelValue": [
                              b[3] || (b[3] = (ye) => h.value.name = ye),
                              o
                            ],
                            label: "Name",
                            rules: [A.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          e(Z, {
                            modelValue: h.value.pkey,
                            "onUpdate:modelValue": b[4] || (b[4] = (ye) => h.value.pkey = ye),
                            label: "Project key (pkey)",
                            rules: [A.required, A.pkey],
                            disabled: ((ne = S.value) == null ? void 0 : ne.nbSubscriptions) > 0,
                            hint: ((ae = S.value) == null ? void 0 : ae.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          e(Z, {
                            modelValue: h.value.teamLeader,
                            "onUpdate:modelValue": b[5] || (b[5] = (ye) => h.value.teamLeader = ye),
                            label: "Team leader (user id)",
                            rules: [A.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(se, {
                            modelValue: h.value.description,
                            "onUpdate:modelValue": b[6] || (b[6] = (ye) => h.value.description = ye),
                            label: "Description",
                            rows: "3",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue"])
                        ];
                      }),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(w, null, {
                  default: t(() => [
                    e(te),
                    e(Y, {
                      variant: "text",
                      onClick: b[7] || (b[7] = (ne) => s.value = !1)
                    }, {
                      default: t(() => [...b[17] || (b[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Y, {
                      color: "primary",
                      variant: "elevated",
                      loading: q.value,
                      onClick: G
                    }, {
                      default: t(() => [...b[18] || (b[18] = [
                        l("Save", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        e(Q, {
          modelValue: E.value,
          "onUpdate:modelValue": b[11] || (b[11] = (ne) => E.value = ne),
          "max-width": "500"
        }, {
          default: t(() => [
            e(g, null, {
              default: t(() => [
                e(F, null, {
                  default: t(() => [...b[19] || (b[19] = [
                    l("Delete project", -1)
                  ])]),
                  _: 1
                }),
                e(_e, null, {
                  default: t(() => {
                    var ne;
                    return [
                      u("p", wt, [
                        b[20] || (b[20] = l(" Are you sure you want to delete ", -1)),
                        u("strong", null, C((ne = f.value) == null ? void 0 : ne.name), 1),
                        b[21] || (b[21] = l("? ", -1))
                      ]),
                      e(M, {
                        modelValue: N.value,
                        "onUpdate:modelValue": b[9] || (b[9] = (ae) => N.value = ae),
                        label: "Also remove remote data associated with this project's subscriptions",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(w, null, {
                  default: t(() => [
                    e(te),
                    e(Y, {
                      variant: "text",
                      onClick: b[10] || (b[10] = (ne) => E.value = !1)
                    }, {
                      default: t(() => [...b[22] || (b[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Y, {
                      color: "error",
                      variant: "elevated",
                      loading: p.value,
                      onClick: k
                    }, {
                      default: t(() => [...b[23] || (b[23] = [
                        l("Delete", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}, Vt = /* @__PURE__ */ we(xt, [["__scopeId", "data-v-6023d08b"]]), Ct = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, $t = { class: "text-h4" }, St = { class: "text-h6 text-medium-emphasis" }, ht = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, Ut = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, Tt = { key: 0 }, Nt = {
  key: 0,
  class: "ml-1"
}, Pt = { key: 1 }, jt = {
  key: 0,
  class: "ml-1"
}, zt = { key: 2 }, It = {
  key: 0,
  class: "ml-1"
}, At = { class: "d-flex align-center mb-2" }, Dt = { class: "mb-3" }, Rt = {
  __name: "ProjectDetailView",
  setup(m) {
    const T = De();
    Ne();
    const j = fe(), I = pe();
    Je();
    const R = i(!1), d = i(null), D = ce(() => {
      var _;
      return ((_ = d.value) == null ? void 0 : _.subscriptions) || [];
    }), U = i(null), P = i(!1), $ = i({ name: "", pkey: "", teamLeader: "", description: "" }), s = i(!1), S = i(!1), h = i(null), q = i(!1), E = i(!1), f = {
      required: (_) => !!_ || "Required"
    }, p = [
      { title: "Service", key: "service", sortable: !1, width: "180px" },
      { title: "Tool", key: "tool", sortable: !1, width: "180px" },
      { title: "Node", key: "node", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function N(_) {
      if (!_) return "";
      const o = new Date(_);
      return isNaN(o.getTime()) ? "" : o.toISOString().slice(0, 16).replace("T", " ");
    }
    function O(_) {
      var ee, G, k;
      const o = ((k = (G = (ee = _.node) == null ? void 0 : ee.refined) == null ? void 0 : G.refined) == null ? void 0 : k.id) || "", L = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let x = 0;
      for (const a of o) x += a.charCodeAt(0);
      return L[x % L.length];
    }
    function z(_) {
      var L, x, ee;
      const o = ((ee = (x = (L = _.node) == null ? void 0 : L.refined) == null ? void 0 : x.refined) == null ? void 0 : ee.id) || "";
      return o.includes(":scm:") ? "mdi-source-branch" : o.includes(":build:") ? "mdi-hammer-wrench" : o.includes(":bt") ? "mdi-bug" : o.includes(":km:") ? "mdi-book-open-variant" : o.includes(":vm") ? "mdi-server" : o.includes(":prov") ? "mdi-cloud" : o.includes(":id") ? "mdi-account-group" : o.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function A() {
      var L;
      R.value = !0;
      const _ = T.params.id, o = await j.get(`rest/project/${_}`);
      d.value = o || null, R.value = !1, o && ($.value = {
        name: o.name || "",
        pkey: o.pkey || "",
        teamLeader: ((L = o.teamLeader) == null ? void 0 : L.id) || "",
        description: o.description || ""
      }, I.setTitle(o.name), I.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        { title: o.name }
      ]));
    }
    async function V() {
      const { valid: _ } = await U.value.validate();
      if (!_) return;
      s.value = !0;
      const o = {
        id: d.value.id,
        name: $.value.name,
        pkey: $.value.pkey,
        teamLeader: $.value.teamLeader,
        description: $.value.description
      };
      await j.put("rest/project", o), s.value = !1, P.value = !1, await A();
    }
    function r(_) {
      h.value = _, q.value = !1, S.value = !0;
    }
    async function v() {
      E.value = !0, await j.del(`rest/subscription/${h.value.id}/${q.value ? "true" : "false"}`), E.value = !1, S.value = !1, await A();
    }
    return Ie(() => T.params.id, (_) => {
      _ && A();
    }), me(A), (_, o) => {
      const L = n("v-skeleton-loader"), x = n("v-spacer"), ee = n("v-btn"), G = n("v-icon"), k = n("v-card-text"), a = n("v-card"), b = n("v-chip"), te = n("v-alert"), Z = n("v-data-table"), Y = n("v-card-title"), y = n("v-text-field"), H = n("v-textarea"), le = n("v-form"), W = n("v-card-actions"), oe = n("v-dialog"), re = n("v-checkbox");
      return c(), J("div", null, [
        R.value && !d.value ? (c(), B(L, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : K("", !0),
        d.value ? (c(), J(ve, { key: 1 }, [
          u("div", Ct, [
            u("div", null, [
              u("h1", $t, [
                l(C(d.value.name) + " ", 1),
                u("span", St, "(" + C(d.value.pkey) + ")", 1)
              ]),
              d.value.description ? (c(), J("p", ht, C(d.value.description), 1)) : K("", !0)
            ]),
            e(x),
            d.value.manageSubscriptions ? (c(), B(ee, {
              key: 0,
              color: "primary",
              "prepend-icon": "mdi-plus",
              to: `/home/project/${d.value.id}/subscription`
            }, {
              default: t(() => [...o[10] || (o[10] = [
                l(" Add subscription ", -1)
              ])]),
              _: 1
            }, 8, ["to"])) : K("", !0),
            e(ee, {
              variant: "outlined",
              "prepend-icon": "mdi-pencil",
              onClick: o[0] || (o[0] = (F) => P.value = !0)
            }, {
              default: t(() => [...o[11] || (o[11] = [
                l(" Edit ", -1)
              ])]),
              _: 1
            })
          ]),
          e(a, {
            variant: "tonal",
            class: "mb-4"
          }, {
            default: t(() => [
              e(k, { class: "py-2" }, {
                default: t(() => [
                  u("div", Ut, [
                    d.value.teamLeader ? (c(), J("span", Tt, [
                      e(G, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[12] || (o[12] = [
                          l("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      o[13] || (o[13] = u("strong", null, "Manager:", -1)),
                      l(" " + C(ie(Le)(d.value.teamLeader)) + " ", 1),
                      d.value.teamLeader.id ? (c(), J("span", Nt, "(" + C(d.value.teamLeader.id) + ")", 1)) : K("", !0)
                    ])) : K("", !0),
                    d.value.createdDate ? (c(), J("span", Pt, [
                      e(G, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[14] || (o[14] = [
                          l("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      o[15] || (o[15] = u("strong", null, "Created:", -1)),
                      l(" " + C(N(d.value.createdDate)) + " ", 1),
                      d.value.createdBy ? (c(), J("span", jt, " by " + C(d.value.createdBy.id || d.value.createdBy), 1)) : K("", !0)
                    ])) : K("", !0),
                    d.value.lastModifiedDate ? (c(), J("span", zt, [
                      e(G, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[16] || (o[16] = [
                          l("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      o[17] || (o[17] = u("strong", null, "Updated:", -1)),
                      l(" " + C(N(d.value.lastModifiedDate)) + " ", 1),
                      d.value.lastModifiedBy ? (c(), J("span", It, " by " + C(d.value.lastModifiedBy.id || d.value.lastModifiedBy), 1)) : K("", !0)
                    ])) : K("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          u("div", At, [
            o[18] || (o[18] = u("h2", { class: "text-h6" }, "Subscriptions", -1)),
            e(b, {
              class: "ml-2",
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(C(D.value.length), 1)
              ]),
              _: 1
            })
          ]),
          D.value.length === 0 ? (c(), B(te, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: t(() => [...o[19] || (o[19] = [
              l(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (c(), B(Z, {
            key: 1,
            headers: p,
            items: D.value,
            "item-value": "id",
            "items-per-page": -1,
            "hide-default-footer": "",
            density: "compact"
          }, {
            "item.service": t(({ item: F }) => [
              e(b, {
                size: "small",
                variant: "tonal",
                color: O(F)
              }, {
                default: t(() => {
                  var se, de, _e;
                  return [
                    e(G, {
                      start: "",
                      size: "small"
                    }, {
                      default: t(() => [
                        l(C(z(F)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    l(" " + C(((_e = (de = (se = F.node) == null ? void 0 : se.refined) == null ? void 0 : de.refined) == null ? void 0 : _e.name) || "—"), 1)
                  ];
                }),
                _: 2
              }, 1032, ["color"])
            ]),
            "item.tool": t(({ item: F }) => {
              var se, de;
              return [
                l(C(((de = (se = F.node) == null ? void 0 : se.refined) == null ? void 0 : de.name) || "—"), 1)
              ];
            }),
            "item.node": t(({ item: F }) => {
              var se;
              return [
                u("code", null, C((se = F.node) == null ? void 0 : se.id), 1)
              ];
            }),
            "item.actions": t(({ item: F }) => [
              d.value.manageSubscriptions ? (c(), B(ee, {
                key: 0,
                icon: "",
                size: "small",
                variant: "text",
                color: "error",
                onClick: (se) => r(F),
                title: "Unsubscribe"
              }, {
                default: t(() => [
                  e(G, { size: "small" }, {
                    default: t(() => [...o[20] || (o[20] = [
                      l("mdi-close", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["onClick"])) : K("", !0)
            ]),
            _: 1
          }, 8, ["items"]))
        ], 64)) : K("", !0),
        e(oe, {
          modelValue: P.value,
          "onUpdate:modelValue": o[6] || (o[6] = (F) => P.value = F),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(Y, null, {
                  default: t(() => [...o[21] || (o[21] = [
                    l("Edit project", -1)
                  ])]),
                  _: 1
                }),
                e(k, null, {
                  default: t(() => [
                    e(le, {
                      ref_key: "formRef",
                      ref: U,
                      onSubmit: xe(V, ["prevent"])
                    }, {
                      default: t(() => {
                        var F;
                        return [
                          e(y, {
                            modelValue: $.value.name,
                            "onUpdate:modelValue": o[1] || (o[1] = (se) => $.value.name = se),
                            label: "Name",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(y, {
                            modelValue: $.value.pkey,
                            "onUpdate:modelValue": o[2] || (o[2] = (se) => $.value.pkey = se),
                            label: "Project key (pkey)",
                            rules: [f.required],
                            disabled: (((F = d.value) == null ? void 0 : F.nbSubscriptions) || D.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          e(y, {
                            modelValue: $.value.teamLeader,
                            "onUpdate:modelValue": o[3] || (o[3] = (se) => $.value.teamLeader = se),
                            label: "Team leader (user id)",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(H, {
                            modelValue: $.value.description,
                            "onUpdate:modelValue": o[4] || (o[4] = (se) => $.value.description = se),
                            label: "Description",
                            rows: "3",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue"])
                        ];
                      }),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(x),
                    e(ee, {
                      variant: "text",
                      onClick: o[5] || (o[5] = (F) => P.value = !1)
                    }, {
                      default: t(() => [...o[22] || (o[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(ee, {
                      color: "primary",
                      variant: "elevated",
                      loading: s.value,
                      onClick: V
                    }, {
                      default: t(() => [...o[23] || (o[23] = [
                        l("Save", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        e(oe, {
          modelValue: S.value,
          "onUpdate:modelValue": o[9] || (o[9] = (F) => S.value = F),
          "max-width": "480"
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(Y, null, {
                  default: t(() => [...o[24] || (o[24] = [
                    l("Unsubscribe", -1)
                  ])]),
                  _: 1
                }),
                e(k, null, {
                  default: t(() => {
                    var F, se;
                    return [
                      u("p", Dt, [
                        o[25] || (o[25] = l(" Remove subscription to ", -1)),
                        u("strong", null, C((se = (F = h.value) == null ? void 0 : F.node) == null ? void 0 : se.name), 1),
                        o[26] || (o[26] = l("? ", -1))
                      ]),
                      e(re, {
                        modelValue: q.value,
                        "onUpdate:modelValue": o[7] || (o[7] = (de) => q.value = de),
                        label: "Also delete remote data on the target service",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(x),
                    e(ee, {
                      variant: "text",
                      onClick: o[8] || (o[8] = (F) => S.value = !1)
                    }, {
                      default: t(() => [...o[27] || (o[27] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(ee, {
                      color: "error",
                      variant: "elevated",
                      loading: E.value,
                      onClick: v
                    }, {
                      default: t(() => [...o[28] || (o[28] = [
                        l(" Remove ", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}, Lt = { class: "mb-3" }, Et = { class: "code-sample" }, Bt = {
  __name: "ManualView",
  setup(m) {
    const T = pe(), j = Te(), I = "/", R = typeof window < "u" ? window.location.origin : "", d = ce(() => j.userName || "<you>");
    return me(() => {
      T.setTitle("Manual"), T.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (D, U) => {
      const P = n("v-icon"), $ = n("v-card-title"), s = n("v-card-text"), S = n("v-card"), h = n("v-list-item"), q = n("v-list"), E = n("v-col"), f = n("router-link");
      n("v-code-block");
      const p = n("v-row");
      return c(), J("div", null, [
        U[12] || (U[12] = u("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        e(p, null, {
          default: t(() => [
            e(E, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(S, {
                  variant: "tonal",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e($, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(P, null, {
                          default: t(() => [...U[0] || (U[0] = [
                            l("mdi-book-open-page-variant", -1)
                          ])]),
                          _: 1
                        }),
                        U[1] || (U[1] = l(" Getting started ", -1))
                      ]),
                      _: 1
                    }),
                    e(s, null, {
                      default: t(() => [...U[2] || (U[2] = [
                        u("p", { class: "mb-2" }, " Ligoj aggregates the tools your projects rely on (source control, bug tracking, continuous integration, knowledge base, cloud provisioning) behind a single dashboard and API. ", -1),
                        u("p", { class: "mb-0" }, " Create a project, attach subscriptions, and hand your team a single entry point for everything. ", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                e(S, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(q, {
                      lines: "two",
                      density: "compact"
                    }, {
                      default: t(() => [
                        e(h, {
                          "prepend-icon": "mdi-folder-plus",
                          title: "Create a project",
                          subtitle: "Name, project key, manager — add subscriptions afterwards.",
                          to: "/home/project"
                        }),
                        e(h, {
                          "prepend-icon": "mdi-playlist-plus",
                          title: "Subscribe to a tool",
                          subtitle: "Pick a service, a tool, and a node for an existing or new instance.",
                          to: "/subscribe"
                        }),
                        e(h, {
                          "prepend-icon": "mdi-view-dashboard",
                          title: "Open the dashboard",
                          subtitle: "Tiles for every project you have access to.",
                          to: "/"
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            e(E, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(S, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e($, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(P, null, {
                          default: t(() => [...U[3] || (U[3] = [
                            l("mdi-api", -1)
                          ])]),
                          _: 1
                        }),
                        U[4] || (U[4] = l(" Automation ", -1))
                      ]),
                      _: 1
                    }),
                    e(s, null, {
                      default: t(() => [
                        u("p", Lt, [
                          U[7] || (U[7] = l(" Every screen is backed by a REST endpoint. Browse the full catalogue on the ", -1)),
                          e(f, { to: "/api" }, {
                            default: t(() => [...U[5] || (U[5] = [
                              l("API reference page", -1)
                            ])]),
                            _: 1
                          }),
                          U[8] || (U[8] = l(" (OpenAPI / Swagger UI), and generate an ", -1)),
                          e(f, { to: "/api/token" }, {
                            default: t(() => [...U[6] || (U[6] = [
                              l("API token", -1)
                            ])]),
                            _: 1
                          }),
                          U[9] || (U[9] = l(" to call it from scripts without exposing your password. ", -1))
                        ]),
                        K("", !0),
                        u("pre", Et, 'curl "' + C(ie(R)) + C(ie(I)) + "rest/project?api-key=<token>&api-user=" + C(d.value) + '"', 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                e(S, { variant: "outlined" }, {
                  default: t(() => [
                    e($, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(P, null, {
                          default: t(() => [...U[10] || (U[10] = [
                            l("mdi-help-circle", -1)
                          ])]),
                          _: 1
                        }),
                        U[11] || (U[11] = l(" More resources ", -1))
                      ]),
                      _: 1
                    }),
                    e(q, {
                      lines: "one",
                      density: "compact"
                    }, {
                      default: t(() => [
                        e(h, {
                          "prepend-icon": "mdi-github",
                          title: "GitHub repository",
                          subtitle: "Source, issues, release notes",
                          href: "https://github.com/ligoj/ligoj",
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }),
                        e(h, {
                          "prepend-icon": "mdi-bug",
                          title: "Report an issue",
                          href: "https://github.com/ligoj/ligoj/issues",
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }),
                        e(h, {
                          "prepend-icon": "mdi-book",
                          title: "Wiki",
                          href: "https://github.com/ligoj/ligoj/wiki",
                          target: "_blank",
                          rel: "noopener noreferrer"
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}, qt = /* @__PURE__ */ we(Bt, [["__scopeId", "data-v-bfb1a017"]]), Mt = { class: "pa-4" }, Ft = {
  __name: "SystemView",
  setup(m) {
    const T = pe(), j = [
      { to: "/system/information", icon: "mdi-information-outline", title: "Information", subtitle: "Memory, CPU, timezone, build" },
      { to: "/system/configuration", icon: "mdi-tune", title: "Configuration", subtitle: "Key/value settings and encrypt helper" },
      { to: "/system/user", icon: "mdi-account-multiple", title: "Users", subtitle: "Active sessions and accounts" },
      { to: "/system/role", icon: "mdi-shield-account", title: "Roles", subtitle: "Authorization rules" },
      { to: "/system/plugin", icon: "mdi-puzzle", title: "Plugins", subtitle: "Installed feature plugins" },
      { to: "/system/node", icon: "mdi-server", title: "Nodes", subtitle: "Service & tool registrations" },
      { to: "/system/cache", icon: "mdi-database-refresh", title: "Cache", subtitle: "Invalidate application caches" },
      { to: "/system/bench", icon: "mdi-speedometer", title: "Bench", subtitle: "Diagnostics" }
    ];
    return me(() => {
      T.setTitle("System"), T.setBreadcrumbs([{ title: "System" }]);
    }), (I, R) => {
      const d = n("v-list-item"), D = n("v-list");
      return c(), J("div", Mt, [
        R[0] || (R[0] = u("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        e(D, null, {
          default: t(() => [
            (c(), J(ve, null, ke(j, (U) => e(d, {
              key: U.to,
              to: U.to,
              "prepend-icon": U.icon,
              title: U.title,
              subtitle: U.subtitle
            }, null, 8, ["to", "prepend-icon", "title", "subtitle"])), 64))
          ]),
          _: 1
        })
      ]);
    };
  }
}, Ot = { class: "d-flex align-center mb-4" }, Gt = { class: "mb-3" }, Ht = { class: "d-flex align-center mb-1" }, Wt = { class: "text-caption" }, Kt = { class: "d-flex mt-1 text-caption text-medium-emphasis ga-3" }, Jt = {
  __name: "SystemInfoView",
  setup(m) {
    const T = fe(), j = pe(), I = Te(), R = i(!1), d = i(null), D = i(null), U = i(""), P = i(""), $ = i(""), s = Ve({
      used: 0,
      committedFree: 0,
      free: 0,
      max: 0,
      pctUsed: 0,
      pctCommittedFree: 0,
      pctFree: 0
    }), S = Ve({ application: "", default: "", original: "" }), h = ce(() => p("JSESSIONID") || ""), q = ce(() => {
      const V = I.appSettings || {}, r = parseInt(V.buildTimestamp, 10);
      return {
        number: V.buildNumber ?? "",
        timestamp: Number.isNaN(r) ? V.buildTimestamp ?? "" : r,
        date: Number.isNaN(r) ? "" : new Date(r).toISOString().slice(0, 19).replace("T", " "),
        version: V.buildVersion ?? ""
      };
    }), E = ce(
      () => `Used: ${f(s.used)} · Committed-free: ${f(s.committedFree)} · Free: ${f(s.free)} / ${f(s.max)}`
    );
    function f(V) {
      if (V == null || isNaN(V)) return "—";
      const r = ["B", "KB", "MB", "GB", "TB"];
      let v = V, _ = 0;
      for (; v >= 1024 && _ < r.length - 1; )
        v /= 1024, _++;
      return `${v.toFixed(v < 10 && _ > 0 ? 1 : 0)} ${r[_]}`;
    }
    function p(V) {
      const r = document.cookie.split(";");
      for (const v of r) {
        const [_, ...o] = v.trim().split("=");
        if (_ === V) return decodeURIComponent(o.join("="));
      }
      return null;
    }
    async function N() {
      var r, v, _, o, L, x, ee, G, k, a, b, te;
      R.value = !0, d.value = null;
      const V = await T.get("rest/system");
      if (V) {
        U.value = ((r = V.cpu) == null ? void 0 : r.total) ?? "", P.value = (v = V.date) != null && v.date ? new Date(V.date.date).toISOString() : "", $.value = ((_ = V.date) == null ? void 0 : _.date) ?? "", S.application = ((o = V.date) == null ? void 0 : o.timeZone) ?? "", S.default = ((L = V.date) == null ? void 0 : L.defaultTimeZone) ?? "", S.original = ((x = V.date) == null ? void 0 : x.originalDefaultTimeZone) ?? "";
        const Z = ((ee = V.memory) == null ? void 0 : ee.maxMemory) || (((G = V.memory) == null ? void 0 : G.totalMemory) || 0) + 1e6, Y = (((k = V.memory) == null ? void 0 : k.totalMemory) ?? 0) - (((a = V.memory) == null ? void 0 : a.freeMemory) ?? 0), y = ((b = V.memory) == null ? void 0 : b.freeMemory) ?? 0, H = Math.max(0, Z - (((te = V.memory) == null ? void 0 : te.totalMemory) ?? 0));
        s.used = Y, s.committedFree = y, s.free = H, s.max = Z, s.pctUsed = O(Y / Z * 100), s.pctCommittedFree = O(y / Z * 100), s.pctFree = O(100 - s.pctUsed - s.pctCommittedFree);
      }
      R.value = !1;
    }
    function O(V) {
      return Math.round(V * 10) / 10;
    }
    async function z(V, r) {
      if (r) {
        D.value = V;
        try {
          await fetch(`/rest/system/timezone/${V}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "text/plain" },
            body: r
          });
        } catch {
        }
        D.value = null;
      }
    }
    async function A(V) {
      try {
        await navigator.clipboard.writeText(V || "");
      } catch {
      }
    }
    return me(() => {
      j.setTitle("System information"), j.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Information" }]), N();
    }), (V, r) => {
      const v = n("v-spacer"), _ = n("v-btn"), o = n("v-alert"), L = n("v-icon"), x = n("v-card-title"), ee = n("v-tooltip"), G = n("v-text-field"), k = n("v-col"), a = n("v-row"), b = n("v-card-text"), te = n("v-card");
      return c(), J("div", null, [
        u("div", Ot, [
          r[8] || (r[8] = u("h1", { class: "text-h4" }, "System information", -1)),
          e(v),
          e(_, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            loading: R.value,
            onClick: N
          }, {
            default: t(() => [...r[7] || (r[7] = [
              l(" Refresh ", -1)
            ])]),
            _: 1
          }, 8, ["loading"])
        ]),
        d.value ? (c(), B(o, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(d.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(a, null, {
          default: t(() => [
            e(k, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(te, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(x, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(L, null, {
                          default: t(() => [...r[9] || (r[9] = [
                            l("mdi-server-outline", -1)
                          ])]),
                          _: 1
                        }),
                        r[10] || (r[10] = l(" System ", -1))
                      ]),
                      _: 1
                    }),
                    e(b, null, {
                      default: t(() => [
                        u("div", Gt, [
                          u("div", Ht, [
                            r[11] || (r[11] = u("span", { class: "text-body-2 text-medium-emphasis flex-grow-1" }, "Memory", -1)),
                            u("span", Wt, C(f(s.used)) + " / " + C(f(s.max)), 1)
                          ]),
                          e(ee, {
                            text: E.value,
                            location: "top"
                          }, {
                            activator: t(({ props: Z }) => [
                              u("div", Ue({ class: "memory-bar" }, Z), [
                                u("div", {
                                  class: "mem-used",
                                  style: $e({ width: s.pctUsed + "%" })
                                }, null, 4),
                                u("div", {
                                  class: "mem-committed",
                                  style: $e({ width: s.pctCommittedFree + "%" })
                                }, null, 4),
                                u("div", {
                                  class: "mem-free",
                                  style: $e({ width: s.pctFree + "%" })
                                }, null, 4)
                              ], 16)
                            ]),
                            _: 1
                          }, 8, ["text"]),
                          u("div", Kt, [
                            u("span", null, [
                              e(L, {
                                size: "x-small",
                                class: "mem-dot-used"
                              }, {
                                default: t(() => [...r[12] || (r[12] = [
                                  l("mdi-circle", -1)
                                ])]),
                                _: 1
                              }),
                              l(" Used " + C(s.pctUsed) + "%", 1)
                            ]),
                            u("span", null, [
                              e(L, {
                                size: "x-small",
                                class: "mem-dot-commit"
                              }, {
                                default: t(() => [...r[13] || (r[13] = [
                                  l("mdi-circle", -1)
                                ])]),
                                _: 1
                              }),
                              l(" Committed free " + C(s.pctCommittedFree) + "%", 1)
                            ]),
                            u("span", null, [
                              e(L, {
                                size: "x-small",
                                class: "mem-dot-free"
                              }, {
                                default: t(() => [...r[14] || (r[14] = [
                                  l("mdi-circle", -1)
                                ])]),
                                _: 1
                              }),
                              l(" Free " + C(s.pctFree) + "%", 1)
                            ])
                          ])
                        ]),
                        e(G, {
                          "model-value": U.value,
                          label: "CPU load (total)",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2"
                        }, null, 8, ["model-value"]),
                        e(a, { dense: "" }, {
                          default: t(() => [
                            e(k, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(G, {
                                  "model-value": P.value,
                                  label: "Local date",
                                  readonly: "",
                                  density: "compact",
                                  variant: "outlined"
                                }, null, 8, ["model-value"])
                              ]),
                              _: 1
                            }),
                            e(k, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(G, {
                                  "model-value": $.value,
                                  label: "Timestamp",
                                  readonly: "",
                                  density: "compact",
                                  variant: "outlined"
                                }, null, 8, ["model-value"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            e(k, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(te, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(x, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(L, null, {
                          default: t(() => [...r[15] || (r[15] = [
                            l("mdi-map-clock", -1)
                          ])]),
                          _: 1
                        }),
                        r[16] || (r[16] = l(" Time zone ", -1))
                      ]),
                      _: 1
                    }),
                    e(b, null, {
                      default: t(() => [
                        e(G, {
                          modelValue: S.application,
                          "onUpdate:modelValue": r[0] || (r[0] = (Z) => S.application = Z),
                          label: "Application",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: D.value === "application",
                          onBlur: r[1] || (r[1] = (Z) => z("application", S.application)),
                          onKeyup: r[2] || (r[2] = he((Z) => z("application", S.application), ["enter"]))
                        }, null, 8, ["modelValue", "loading"]),
                        e(G, {
                          modelValue: S.default,
                          "onUpdate:modelValue": r[3] || (r[3] = (Z) => S.default = Z),
                          label: "System",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: D.value === "default",
                          onBlur: r[4] || (r[4] = (Z) => z("default", S.default)),
                          onKeyup: r[5] || (r[5] = he((Z) => z("default", S.default), ["enter"]))
                        }, null, 8, ["modelValue", "loading"]),
                        e(G, {
                          "model-value": S.original,
                          label: "System (initial)",
                          readonly: "",
                          density: "compact",
                          variant: "outlined"
                        }, null, 8, ["model-value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            e(k, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(te, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(x, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(L, null, {
                          default: t(() => [...r[17] || (r[17] = [
                            l("mdi-account-key", -1)
                          ])]),
                          _: 1
                        }),
                        r[18] || (r[18] = l(" Session ", -1))
                      ]),
                      _: 1
                    }),
                    e(b, null, {
                      default: t(() => [
                        e(G, {
                          "model-value": h.value,
                          label: "Identifier",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          "append-inner-icon": "mdi-content-copy",
                          "onClick:appendInner": r[6] || (r[6] = (Z) => A(h.value))
                        }, null, 8, ["model-value"]),
                        e(G, {
                          "model-value": ie(I).userName,
                          label: "User",
                          readonly: "",
                          density: "compact",
                          variant: "outlined"
                        }, null, 8, ["model-value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            e(k, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(te, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(x, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(L, null, {
                          default: t(() => [...r[19] || (r[19] = [
                            l("mdi-source-commit", -1)
                          ])]),
                          _: 1
                        }),
                        r[20] || (r[20] = l(" Build ", -1))
                      ]),
                      _: 1
                    }),
                    e(b, null, {
                      default: t(() => [
                        e(G, {
                          "model-value": q.value.number,
                          label: "Number",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2"
                        }, null, 8, ["model-value"]),
                        e(a, { dense: "" }, {
                          default: t(() => [
                            e(k, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(G, {
                                  "model-value": q.value.timestamp,
                                  label: "Timestamp",
                                  readonly: "",
                                  density: "compact",
                                  variant: "outlined"
                                }, null, 8, ["model-value"])
                              ]),
                              _: 1
                            }),
                            e(k, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(G, {
                                  "model-value": q.value.date,
                                  label: "Date",
                                  readonly: "",
                                  density: "compact",
                                  variant: "outlined"
                                }, null, 8, ["model-value"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        e(G, {
                          "model-value": q.value.version,
                          label: "Version",
                          readonly: "",
                          density: "compact",
                          variant: "outlined"
                        }, null, 8, ["model-value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}, Zt = /* @__PURE__ */ we(Jt, [["__scopeId", "data-v-ac54960b"]]), Xt = { class: "d-flex align-center mb-4" }, Yt = {
  key: 0,
  class: "text-medium-emphasis"
}, Qt = {
  key: 1,
  class: "config-value"
}, el = { class: "text-body-2 text-medium-emphasis" }, tl = {
  __name: "SystemConfigurationView",
  setup(m) {
    const T = fe(), j = pe(), I = i([]), R = i(!1), d = i(null), D = i(""), U = i(""), P = i(!1), $ = i(null), s = i(!1), S = i(null), h = i({ name: "", value: "", system: !1, secured: !1 }), q = i(!1), E = i(!1), f = i(null), p = i(!1), N = { required: (k) => k !== "" && k != null || "Required" }, O = [
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Value", key: "value", sortable: !1 },
      { title: "", key: "secured", sortable: !1, width: "40px", align: "center" },
      { title: "", key: "source", sortable: !1, width: "60px", align: "center" },
      { title: "Source", key: "sourceText", sortable: !0, width: "200px" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ], z = {
      systemEnvironment: "mdi-desktop-classic",
      systemProperties: "mdi-language-java",
      applicationConfig: "mdi-file-code",
      database: "mdi-database",
      classpath: "mdi-file-code-outline"
    };
    function A(k) {
      if (!k) return "mdi-help-circle-outline";
      const a = k.split(":")[0];
      return z[k.includes("classpath") ? "classpath" : a] || "mdi-help-circle-outline";
    }
    function V(k) {
      if (!k.source) return "";
      const a = `Source: ${k.source}`;
      return k.overridden ? `${a} — overridden` : a;
    }
    async function r() {
      R.value = !0, d.value = null;
      const k = await T.get("rest/system/configuration");
      I.value = Array.isArray(k) ? k : (k == null ? void 0 : k.data) || [], I.value.sort((a, b) => String(a.name).localeCompare(String(b.name))), R.value = !1;
    }
    async function v() {
      if (D.value) {
        P.value = !0;
        try {
          const k = await fetch("/rest/system/security/crypto", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "text/plain" },
            body: D.value
          });
          U.value = k.ok ? await k.text() : "";
        } catch {
          U.value = "";
        } finally {
          P.value = !1;
        }
      }
    }
    async function _(k) {
      try {
        await navigator.clipboard.writeText(k || "");
      } catch {
      }
    }
    function o() {
      S.value = null, h.value = { name: "", value: "", system: !1, secured: !1 }, s.value = !0;
    }
    function L(k) {
      S.value = k, h.value = {
        name: k.name,
        value: k.secured ? "" : k.value ?? "",
        system: !1,
        secured: !!k.secured
      }, s.value = !0;
    }
    function x(k) {
      f.value = k, E.value = !0;
    }
    async function ee() {
      var b;
      const { valid: k } = await $.value.validate();
      if (!k) return;
      q.value = !0;
      const a = {
        name: h.value.name,
        oldName: ((b = S.value) == null ? void 0 : b.name) || "",
        system: !!h.value.system,
        secured: !!h.value.secured,
        value: h.value.value
      };
      await T.post("rest/system/configuration", a), q.value = !1, s.value = !1, r();
    }
    async function G() {
      p.value = !0, await T.del(`rest/system/configuration/${encodeURIComponent(f.value.name)}/true`), p.value = !1, E.value = !1, r();
    }
    return me(() => {
      j.setTitle("System configuration"), j.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Configuration" }]), r();
    }), (k, a) => {
      const b = n("v-spacer"), te = n("v-btn"), Z = n("v-icon"), Y = n("v-card-title"), y = n("v-text-field"), H = n("v-col"), le = n("v-row"), W = n("v-card-text"), oe = n("v-card"), re = n("v-alert"), F = n("v-tooltip"), se = n("v-data-table"), de = n("v-textarea"), _e = n("v-checkbox"), w = n("v-form"), g = n("v-card-actions"), Q = n("v-dialog");
      return c(), J("div", null, [
        u("div", Xt, [
          a[12] || (a[12] = u("h1", { class: "text-h4" }, "System configuration", -1)),
          e(b),
          e(te, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            loading: R.value,
            onClick: r
          }, {
            default: t(() => [...a[10] || (a[10] = [
              l(" Refresh ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(te, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            class: "ml-2",
            onClick: o
          }, {
            default: t(() => [...a[11] || (a[11] = [
              l(" New key ", -1)
            ])]),
            _: 1
          })
        ]),
        e(oe, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(Y, { class: "text-subtitle-1 d-flex align-center ga-2" }, {
              default: t(() => [
                e(Z, null, {
                  default: t(() => [...a[13] || (a[13] = [
                    l("mdi-shield-key", -1)
                  ])]),
                  _: 1
                }),
                a[14] || (a[14] = l(" Encrypt helper ", -1))
              ]),
              _: 1
            }),
            e(W, null, {
              default: t(() => [
                e(le, { dense: "" }, {
                  default: t(() => [
                    e(H, {
                      cols: "12",
                      md: "5"
                    }, {
                      default: t(() => [
                        e(y, {
                          modelValue: D.value,
                          "onUpdate:modelValue": a[0] || (a[0] = (M) => D.value = M),
                          label: "Text to encrypt",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "",
                          onKeyup: he(v, ["enter"])
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    e(H, { cols: "auto" }, {
                      default: t(() => [
                        e(te, {
                          color: "primary",
                          "prepend-icon": "mdi-lock",
                          loading: P.value,
                          disabled: !D.value,
                          onClick: v
                        }, {
                          default: t(() => [...a[15] || (a[15] = [
                            l("Encrypt", -1)
                          ])]),
                          _: 1
                        }, 8, ["loading", "disabled"])
                      ]),
                      _: 1
                    }),
                    e(H, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: t(() => [
                        e(y, {
                          "model-value": U.value,
                          label: "Result",
                          variant: "outlined",
                          density: "compact",
                          readonly: "",
                          "hide-details": "",
                          "append-inner-icon": "mdi-content-copy",
                          "onClick:appendInner": a[1] || (a[1] = (M) => _(U.value))
                        }, null, 8, ["model-value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        d.value ? (c(), B(re, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(d.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(se, {
          headers: O,
          items: I.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact",
          class: "configuration-table"
        }, {
          "item.value": t(({ item: M }) => [
            M.secured ? (c(), J("span", Yt, "•••••")) : (c(), J("code", Qt, C(M.value), 1))
          ]),
          "item.secured": t(({ item: M }) => [
            M.secured ? (c(), B(Z, {
              key: 0,
              size: "small",
              color: "primary",
              title: "Secured"
            }, {
              default: t(() => [...a[16] || (a[16] = [
                l("mdi-lock", -1)
              ])]),
              _: 1
            })) : K("", !0)
          ]),
          "item.source": t(({ item: M }) => [
            M.source ? (c(), B(F, {
              key: 0,
              text: V(M),
              location: "top"
            }, {
              activator: t(({ props: ne }) => [
                e(Z, Ue(ne, {
                  size: "small",
                  color: M.overridden ? "warning" : void 0
                }), {
                  default: t(() => [
                    l(C(A(M.source)), 1)
                  ]),
                  _: 2
                }, 1040, ["color"])
              ]),
              _: 2
            }, 1032, ["text"])) : K("", !0),
            M.overridden ? (c(), B(Z, {
              key: 1,
              size: "x-small",
              color: "warning",
              class: "ml-1",
              title: "Overridden"
            }, {
              default: t(() => [...a[17] || (a[17] = [
                l("mdi-alert", -1)
              ])]),
              _: 1
            })) : K("", !0)
          ]),
          "item.sourceText": t(({ item: M }) => [
            u("span", el, C(M.source), 1)
          ]),
          "item.actions": t(({ item: M }) => [
            e(te, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (ne) => L(M),
              title: "Edit"
            }, {
              default: t(() => [
                e(Z, { size: "small" }, {
                  default: t(() => [...a[18] || (a[18] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(te, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (ne) => x(M),
              title: "Delete"
            }, {
              default: t(() => [
                e(Z, { size: "small" }, {
                  default: t(() => [...a[19] || (a[19] = [
                    l("mdi-delete", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["items", "loading"]),
        e(Q, {
          modelValue: s.value,
          "onUpdate:modelValue": a[7] || (a[7] = (M) => s.value = M),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(Y, null, {
                  default: t(() => [
                    l(C(S.value ? "Edit configuration" : "New configuration"), 1)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(w, {
                      ref_key: "formRef",
                      ref: $,
                      onSubmit: xe(ee, ["prevent"])
                    }, {
                      default: t(() => [
                        e(y, {
                          modelValue: h.value.name,
                          "onUpdate:modelValue": a[2] || (a[2] = (M) => h.value.name = M),
                          label: "Name",
                          rules: [N.required],
                          variant: "outlined",
                          density: "compact",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(de, {
                          modelValue: h.value.value,
                          "onUpdate:modelValue": a[3] || (a[3] = (M) => h.value.value = M),
                          label: "Value",
                          rules: [N.required],
                          counter: 1023,
                          maxlength: "1023",
                          rows: "3",
                          variant: "outlined",
                          density: "compact",
                          class: "mb-2"
                        }, null, 8, ["modelValue", "rules"]),
                        e(_e, {
                          modelValue: h.value.system,
                          "onUpdate:modelValue": a[4] || (a[4] = (M) => h.value.system = M),
                          label: "Override system environment / properties",
                          density: "compact",
                          "hide-details": ""
                        }, null, 8, ["modelValue"]),
                        e(_e, {
                          modelValue: h.value.secured,
                          "onUpdate:modelValue": a[5] || (a[5] = (M) => h.value.secured = M),
                          label: "Secured (value is encrypted at rest)",
                          density: "compact",
                          "hide-details": ""
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(b),
                    e(te, {
                      variant: "text",
                      onClick: a[6] || (a[6] = (M) => s.value = !1)
                    }, {
                      default: t(() => [...a[20] || (a[20] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(te, {
                      color: "primary",
                      variant: "elevated",
                      loading: q.value,
                      onClick: ee
                    }, {
                      default: t(() => [...a[21] || (a[21] = [
                        l("Save", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        e(Q, {
          modelValue: E.value,
          "onUpdate:modelValue": a[9] || (a[9] = (M) => E.value = M),
          "max-width": "440"
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(Y, null, {
                  default: t(() => [...a[22] || (a[22] = [
                    l("Delete configuration", -1)
                  ])]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => {
                    var M;
                    return [
                      a[23] || (a[23] = l(" Remove key ", -1)),
                      u("code", null, C((M = f.value) == null ? void 0 : M.name), 1),
                      a[24] || (a[24] = l("? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(b),
                    e(te, {
                      variant: "text",
                      onClick: a[8] || (a[8] = (M) => E.value = !1)
                    }, {
                      default: t(() => [...a[25] || (a[25] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(te, {
                      color: "error",
                      variant: "elevated",
                      loading: p.value,
                      onClick: G
                    }, {
                      default: t(() => [...a[26] || (a[26] = [
                        l("Delete", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}, ll = /* @__PURE__ */ we(tl, [["__scopeId", "data-v-16951a5f"]]), nl = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, al = {
  __name: "SystemUserView",
  setup(m) {
    const T = fe(), j = pe(), I = Ae("system/user/roles", { defaultSort: "login" }), R = i(25);
    let d = null, D = {};
    const U = i([]), P = i(null), $ = i(!1), s = i(null), S = i({ login: "", roles: [] }), h = i(!1), q = i(!1), E = i(null), f = i(!1), p = {
      required: (L) => !!L || "Required",
      requiredArray: (L) => Array.isArray(L) && L.length > 0 || "Pick at least one role"
    }, N = [
      { title: "Login", key: "login", sortable: !0, width: "220px" },
      { title: "Roles", key: "roles", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    function O(L) {
      D = L, I.load(L);
    }
    function z() {
      clearTimeout(d), d = setTimeout(
        () => I.load({ page: 1, itemsPerPage: R.value, sortBy: D.sortBy }),
        300
      );
    }
    async function A() {
      const L = await T.get("rest/system/security/role");
      Array.isArray(L) ? U.value = L : Array.isArray(L == null ? void 0 : L.data) && (U.value = L.data);
    }
    function V() {
      s.value = null, S.value = { login: "", roles: [] }, $.value = !0;
    }
    function r(L) {
      s.value = L, S.value = {
        login: L.login,
        roles: (L.roles || []).map((x) => x.id)
      }, $.value = !0;
    }
    function v(L) {
      E.value = L, q.value = !0;
    }
    async function _() {
      const { valid: L } = await P.value.validate();
      if (!L) return;
      h.value = !0;
      const x = { login: S.value.login, roles: S.value.roles }, ee = s.value ? "put" : "post";
      await T[ee]("rest/system/user", x), h.value = !1, $.value = !1, I.load(D);
    }
    async function o() {
      f.value = !0, await T.del(`rest/system/user/${encodeURIComponent(E.value.login)}`), f.value = !1, q.value = !1, I.load(D);
    }
    return me(() => {
      j.setTitle("System users"), j.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]), A();
    }), (L, x) => {
      const ee = n("v-spacer"), G = n("v-text-field"), k = n("v-btn"), a = n("v-alert"), b = n("v-chip"), te = n("v-icon"), Z = n("v-data-table-server"), Y = n("v-card-title"), y = n("v-autocomplete"), H = n("v-form"), le = n("v-card-text"), W = n("v-card-actions"), oe = n("v-card"), re = n("v-dialog");
      return c(), J("div", null, [
        u("div", nl, [
          x[9] || (x[9] = u("h1", { class: "text-h4" }, "System users", -1)),
          e(ee),
          e(G, {
            modelValue: ie(I).search.value,
            "onUpdate:modelValue": [
              x[0] || (x[0] = (F) => ie(I).search.value = F),
              z
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(k, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: V
          }, {
            default: t(() => [...x[8] || (x[8] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        ie(I).error.value ? (c(), B(a, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(ie(I).error.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(Z, {
          headers: N,
          items: ie(I).items.value,
          "items-length": ie(I).totalItems.value,
          loading: ie(I).loading.value,
          "items-per-page": R.value,
          "onUpdate:itemsPerPage": x[1] || (x[1] = (F) => R.value = F),
          "item-value": "login",
          hover: "",
          "onUpdate:options": O
        }, {
          "item.roles": t(({ item: F }) => [
            (c(!0), J(ve, null, ke(F.roles || [], (se) => (c(), B(b, {
              key: se.id,
              size: "x-small",
              variant: "tonal",
              class: "mr-1"
            }, {
              default: t(() => [
                l(C(se.name), 1)
              ]),
              _: 2
            }, 1024))), 128))
          ]),
          "item.actions": t(({ item: F }) => [
            e(k, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (se) => r(F)
            }, {
              default: t(() => [
                e(te, { size: "small" }, {
                  default: t(() => [...x[10] || (x[10] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(k, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (se) => v(F)
            }, {
              default: t(() => [
                e(te, { size: "small" }, {
                  default: t(() => [...x[11] || (x[11] = [
                    l("mdi-delete", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["items", "items-length", "loading", "items-per-page"]),
        e(re, {
          modelValue: $.value,
          "onUpdate:modelValue": x[5] || (x[5] = (F) => $.value = F),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(Y, null, {
                  default: t(() => [
                    l(C(s.value ? "Edit system user" : "New system user"), 1)
                  ]),
                  _: 1
                }),
                e(le, null, {
                  default: t(() => [
                    e(H, {
                      ref_key: "formRef",
                      ref: P,
                      onSubmit: xe(_, ["prevent"])
                    }, {
                      default: t(() => [
                        e(G, {
                          modelValue: S.value.login,
                          "onUpdate:modelValue": x[2] || (x[2] = (F) => S.value.login = F),
                          label: "Login",
                          rules: [p.required],
                          disabled: !!s.value,
                          variant: "outlined",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules", "disabled"]),
                        e(y, {
                          modelValue: S.value.roles,
                          "onUpdate:modelValue": x[3] || (x[3] = (F) => S.value.roles = F),
                          label: "Roles",
                          items: U.value,
                          "item-value": "id",
                          "item-title": "name",
                          multiple: "",
                          chips: "",
                          "closable-chips": "",
                          variant: "outlined",
                          rules: [p.requiredArray]
                        }, null, 8, ["modelValue", "items", "rules"])
                      ]),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(ee),
                    e(k, {
                      variant: "text",
                      onClick: x[4] || (x[4] = (F) => $.value = !1)
                    }, {
                      default: t(() => [...x[12] || (x[12] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(k, {
                      color: "primary",
                      variant: "elevated",
                      loading: h.value,
                      onClick: _
                    }, {
                      default: t(() => [...x[13] || (x[13] = [
                        l("Save", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        e(re, {
          modelValue: q.value,
          "onUpdate:modelValue": x[7] || (x[7] = (F) => q.value = F),
          "max-width": "420"
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(Y, null, {
                  default: t(() => [...x[14] || (x[14] = [
                    l("Delete system user", -1)
                  ])]),
                  _: 1
                }),
                e(le, null, {
                  default: t(() => {
                    var F;
                    return [
                      x[15] || (x[15] = l("Remove ", -1)),
                      u("strong", null, C((F = E.value) == null ? void 0 : F.login), 1),
                      x[16] || (x[16] = l(" from system accounts?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(ee),
                    e(k, {
                      variant: "text",
                      onClick: x[6] || (x[6] = (F) => q.value = !1)
                    }, {
                      default: t(() => [...x[17] || (x[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(k, {
                      color: "error",
                      variant: "elevated",
                      loading: f.value,
                      onClick: o
                    }, {
                      default: t(() => [...x[18] || (x[18] = [
                        l("Delete", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}, ol = /* @__PURE__ */ we(al, [["__scopeId", "data-v-3bd83da2"]]), sl = { class: "d-flex align-center mb-4" }, il = {
  __name: "SystemRoleView",
  setup(m) {
    const T = fe(), j = pe(), I = i([]), R = i(!1), d = i(null), D = i(null), U = i(!1), P = i(null), $ = i({ name: "", apiPatterns: [], uiPatterns: [] }), s = i(!1), S = i(!1), h = i(null), q = i(!1), E = { required: (r) => !!r || "Required" }, f = [
      { title: "Name", key: "name", sortable: !0, width: "180px" },
      { title: "API patterns", key: "authApi", sortable: !1 },
      { title: "UI patterns", key: "authUi", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    async function p() {
      R.value = !0, d.value = null;
      const r = await T.get("rest/system/security/role/withAuth"), v = (r == null ? void 0 : r.data) || r || [];
      for (const _ of v)
        _["authorizations-api"] = (_.authorizations || []).filter((o) => o.type === "api"), _["authorizations-ui"] = (_.authorizations || []).filter((o) => o.type === "ui");
      I.value = v, R.value = !1;
    }
    function N() {
      P.value = null, $.value = { name: "", apiPatterns: [], uiPatterns: [] }, U.value = !0;
    }
    function O(r) {
      P.value = r, $.value = {
        name: r.name,
        apiPatterns: (r["authorizations-api"] || []).map((v) => v.pattern),
        uiPatterns: (r["authorizations-ui"] || []).map((v) => v.pattern)
      }, U.value = !0;
    }
    function z(r) {
      h.value = r, S.value = !0;
    }
    async function A() {
      var o;
      const { valid: r } = await D.value.validate();
      if (!r) return;
      s.value = !0;
      const v = {
        id: (o = P.value) == null ? void 0 : o.id,
        name: $.value.name,
        authorizations: [
          ...$.value.apiPatterns.map((L) => ({ pattern: L, type: "api" })),
          ...$.value.uiPatterns.map((L) => ({ pattern: L, type: "ui" }))
        ]
      }, _ = P.value ? "put" : "post";
      await T[_]("rest/system/security/role", v), s.value = !1, U.value = !1, p();
    }
    async function V() {
      q.value = !0, await T.del(`rest/system/security/role/${h.value.id}`), q.value = !1, S.value = !1, p();
    }
    return me(() => {
      j.setTitle("Roles"), j.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]), p();
    }), (r, v) => {
      const _ = n("v-spacer"), o = n("v-btn"), L = n("v-alert"), x = n("v-icon"), ee = n("v-data-table"), G = n("v-card-title"), k = n("v-text-field"), a = n("v-combobox"), b = n("v-form"), te = n("v-card-text"), Z = n("v-card-actions"), Y = n("v-card"), y = n("v-dialog");
      return c(), J("div", null, [
        u("div", sl, [
          v[8] || (v[8] = u("h1", { class: "text-h4" }, "Roles", -1)),
          e(_),
          e(o, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: N
          }, {
            default: t(() => [...v[7] || (v[7] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        d.value ? (c(), B(L, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(d.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(ee, {
          headers: f,
          items: I.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.authApi": t(({ item: H }) => [
            (c(!0), J(ve, null, ke(H["authorizations-api"], (le) => (c(), J("code", {
              key: le.id || le.pattern,
              class: "auth-token"
            }, C(le.pattern), 1))), 128))
          ]),
          "item.authUi": t(({ item: H }) => [
            (c(!0), J(ve, null, ke(H["authorizations-ui"], (le) => (c(), J("code", {
              key: le.id || le.pattern,
              class: "auth-token"
            }, C(le.pattern), 1))), 128))
          ]),
          "item.actions": t(({ item: H }) => [
            e(o, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (le) => O(H)
            }, {
              default: t(() => [
                e(x, { size: "small" }, {
                  default: t(() => [...v[9] || (v[9] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(o, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (le) => z(H)
            }, {
              default: t(() => [
                e(x, { size: "small" }, {
                  default: t(() => [...v[10] || (v[10] = [
                    l("mdi-delete", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["items", "loading"]),
        e(y, {
          modelValue: U.value,
          "onUpdate:modelValue": v[4] || (v[4] = (H) => U.value = H),
          "max-width": "640",
          persistent: ""
        }, {
          default: t(() => [
            e(Y, null, {
              default: t(() => [
                e(G, null, {
                  default: t(() => [
                    l(C(P.value ? "Edit role" : "New role"), 1)
                  ]),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => [
                    e(b, {
                      ref_key: "formRef",
                      ref: D,
                      onSubmit: xe(A, ["prevent"])
                    }, {
                      default: t(() => [
                        e(k, {
                          modelValue: $.value.name,
                          "onUpdate:modelValue": v[0] || (v[0] = (H) => $.value.name = H),
                          label: "Name",
                          rules: [E.required],
                          variant: "outlined",
                          class: "mb-4",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(a, {
                          modelValue: $.value.apiPatterns,
                          "onUpdate:modelValue": v[1] || (v[1] = (H) => $.value.apiPatterns = H),
                          label: "API authorization patterns (regex)",
                          items: $.value.apiPatterns,
                          chips: "",
                          "closable-chips": "",
                          multiple: "",
                          variant: "outlined",
                          hint: "Press Enter after each pattern",
                          "persistent-hint": "",
                          class: "mb-4"
                        }, null, 8, ["modelValue", "items"]),
                        e(a, {
                          modelValue: $.value.uiPatterns,
                          "onUpdate:modelValue": v[2] || (v[2] = (H) => $.value.uiPatterns = H),
                          label: "UI authorization patterns (regex)",
                          items: $.value.uiPatterns,
                          chips: "",
                          "closable-chips": "",
                          multiple: "",
                          variant: "outlined",
                          hint: "Press Enter after each pattern",
                          "persistent-hint": "",
                          class: "mb-2"
                        }, null, 8, ["modelValue", "items"])
                      ]),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(Z, null, {
                  default: t(() => [
                    e(_),
                    e(o, {
                      variant: "text",
                      onClick: v[3] || (v[3] = (H) => U.value = !1)
                    }, {
                      default: t(() => [...v[11] || (v[11] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(o, {
                      color: "primary",
                      variant: "elevated",
                      loading: s.value,
                      onClick: A
                    }, {
                      default: t(() => [...v[12] || (v[12] = [
                        l("Save", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        e(y, {
          modelValue: S.value,
          "onUpdate:modelValue": v[6] || (v[6] = (H) => S.value = H),
          "max-width": "420"
        }, {
          default: t(() => [
            e(Y, null, {
              default: t(() => [
                e(G, null, {
                  default: t(() => [...v[13] || (v[13] = [
                    l("Delete role", -1)
                  ])]),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => {
                    var H;
                    return [
                      v[14] || (v[14] = l("Delete role ", -1)),
                      u("strong", null, C((H = h.value) == null ? void 0 : H.name), 1),
                      v[15] || (v[15] = l("?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(Z, null, {
                  default: t(() => [
                    e(_),
                    e(o, {
                      variant: "text",
                      onClick: v[5] || (v[5] = (H) => S.value = !1)
                    }, {
                      default: t(() => [...v[16] || (v[16] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(o, {
                      color: "error",
                      variant: "elevated",
                      loading: q.value,
                      onClick: V
                    }, {
                      default: t(() => [...v[17] || (v[17] = [
                        l("Delete", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}, rl = /* @__PURE__ */ we(il, [["__scopeId", "data-v-e3ba71a8"]]), ul = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, dl = { key: 0 }, cl = { key: 0 }, ml = {
  __name: "SystemPluginView",
  setup(m) {
    const T = fe(), j = pe(), I = [
      { id: "central", label: "Maven Central" },
      { id: "nexus", label: "OSSRH Nexus" }
    ], R = i("central"), d = i([]), D = i(!1), U = i(null), P = i(!1), $ = i(!1), s = i(!1), S = i(""), h = i(!1), q = i(!1), E = [
      { title: "", key: "type", sortable: !1, width: "40px" },
      { title: "Artifact", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0 },
      { title: "Vendor", key: "vendor", sortable: !0, width: "160px" },
      { title: "Version", key: "version", sortable: !1, width: "280px" },
      { title: "Nodes", key: "nodes", sortable: !0, width: "80px", align: "center" },
      { title: "Subs", key: "subscriptions", sortable: !0, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function f(v) {
      var o, L;
      const _ = (L = (o = v.plugin) == null ? void 0 : o.type) == null ? void 0 : L.toLowerCase();
      return _ ? _ === "feature" ? "mdi-wrench" : _ === "service" ? "mdi-puzzle" : _ === "tool" ? "mdi-hammer-wrench" : "mdi-puzzle" : "mdi-link-off";
    }
    async function p() {
      D.value = !0, U.value = null;
      const v = await T.get(`rest/system/plugin?repository=${R.value}`);
      d.value = Array.isArray(v) ? v : (v == null ? void 0 : v.data) || [], D.value = !1;
    }
    async function N() {
      P.value = !0, await T.put(`rest/system/plugin/cache?repository=${R.value}`), P.value = !1, p();
    }
    async function O() {
      $.value = !0, await T.put("rest/system/plugin/restart"), $.value = !1;
    }
    async function z(v, _ = !1) {
      q.value = !0;
      const o = `repository=${R.value}&javadoc=${_ ? !1 : h.value}`;
      await T.post(`rest/system/plugin/${encodeURIComponent(v)}?${o}`), q.value = !1, s.value = !1, S.value = "", h.value = !1, p();
    }
    function A() {
      S.value && z(S.value.trim());
    }
    async function V(v) {
      await T.del(`rest/system/plugin/${v.plugin.artifact}/${v.latestLocalVersion}`), p();
    }
    async function r(v) {
      confirm(`Delete plug-in ${v}?`) && (await T.del(`rest/system/plugin/${v}`), p());
    }
    return me(() => {
      j.setTitle("Plug-ins"), j.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plug-ins" }]), p();
    }), (v, _) => {
      const o = n("v-spacer"), L = n("v-select"), x = n("v-btn"), ee = n("v-alert"), G = n("v-icon"), k = n("v-chip"), a = n("v-data-table"), b = n("v-card-title"), te = n("v-text-field"), Z = n("v-checkbox"), Y = n("v-card-text"), y = n("v-card-actions"), H = n("v-card"), le = n("v-dialog");
      return c(), J("div", null, [
        u("div", ul, [
          _[9] || (_[9] = u("h1", { class: "text-h4" }, "Plugins", -1)),
          e(o),
          e(L, {
            modelValue: R.value,
            "onUpdate:modelValue": [
              _[0] || (_[0] = (W) => R.value = W),
              p
            ],
            items: I,
            "item-value": "id",
            "item-title": "label",
            label: "Repository",
            density: "compact",
            "hide-details": "",
            variant: "outlined",
            style: { "max-width": "200px" }
          }, null, 8, ["modelValue"]),
          e(x, {
            variant: "outlined",
            "prepend-icon": "mdi-magnify-plus",
            onClick: N,
            loading: P.value
          }, {
            default: t(() => [..._[6] || (_[6] = [
              l(" Check versions ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(x, {
            color: "error",
            variant: "outlined",
            "prepend-icon": "mdi-restart",
            onClick: O,
            loading: $.value
          }, {
            default: t(() => [..._[7] || (_[7] = [
              l(" Restart ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(x, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: _[1] || (_[1] = (W) => s.value = !0)
          }, {
            default: t(() => [..._[8] || (_[8] = [
              l("Install", -1)
            ])]),
            _: 1
          })
        ]),
        U.value ? (c(), B(ee, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(U.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(a, {
          headers: E,
          items: d.value,
          loading: D.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.type": t(({ item: W }) => {
            var oe;
            return [
              e(G, {
                size: "small",
                title: (oe = W.plugin) == null ? void 0 : oe.type
              }, {
                default: t(() => [
                  l(C(f(W)), 1)
                ]),
                _: 2
              }, 1032, ["title"])
            ];
          }),
          "item.version": t(({ item: W }) => {
            var oe;
            return [
              u("span", null, C(((oe = W.plugin) == null ? void 0 : oe.version) || "—"), 1),
              W.latestLocalVersion ? (c(), B(k, {
                key: 0,
                size: "x-small",
                color: "primary",
                class: "ml-1",
                closable: "",
                "onClick:close": (re) => V(W),
                title: "Cancel local install"
              }, {
                default: t(() => [
                  l(C(W.latestLocalVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick:close"])) : K("", !0),
              W.newVersion && W.newVersion !== W.latestLocalVersion ? (c(), B(k, {
                key: 1,
                size: "x-small",
                color: "success",
                class: "ml-1",
                onClick: (re) => z(W.plugin.artifact, !0),
                title: "Upgrade available — click to install"
              }, {
                default: t(() => [
                  e(G, {
                    start: "",
                    size: "x-small"
                  }, {
                    default: t(() => [..._[10] || (_[10] = [
                      l("mdi-arrow-up", -1)
                    ])]),
                    _: 1
                  }),
                  l(C(W.newVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : K("", !0)
            ];
          }),
          "item.nodes": t(({ item: W }) => {
            var oe, re;
            return [
              ((re = (oe = W.plugin) == null ? void 0 : oe.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (c(), J("span", dl, C(W.nodes ?? 0), 1)) : K("", !0)
            ];
          }),
          "item.subscriptions": t(({ item: W }) => {
            var oe, re;
            return [
              ((re = (oe = W.plugin) == null ? void 0 : oe.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (c(), J("span", cl, C(W.subscriptions ?? 0), 1)) : K("", !0)
            ];
          }),
          "item.actions": t(({ item: W }) => [
            W.deleted ? (c(), B(G, {
              key: 0,
              size: "small",
              color: "warning",
              title: "Deletion scheduled"
            }, {
              default: t(() => [..._[11] || (_[11] = [
                l("mdi-cancel", -1)
              ])]),
              _: 1
            })) : (c(), B(x, {
              key: 1,
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (oe) => r(W.plugin.artifact),
              title: "Delete plug-in"
            }, {
              default: t(() => [
                e(G, { size: "small" }, {
                  default: t(() => [..._[12] || (_[12] = [
                    l("mdi-delete", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          _: 1
        }, 8, ["items", "loading"]),
        e(le, {
          modelValue: s.value,
          "onUpdate:modelValue": _[5] || (_[5] = (W) => s.value = W),
          "max-width": "520"
        }, {
          default: t(() => [
            e(H, null, {
              default: t(() => [
                e(b, null, {
                  default: t(() => [..._[13] || (_[13] = [
                    l("Install plug-in", -1)
                  ])]),
                  _: 1
                }),
                e(Y, null, {
                  default: t(() => [
                    e(te, {
                      modelValue: S.value,
                      "onUpdate:modelValue": _[2] || (_[2] = (W) => S.value = W),
                      label: "Artifact id (e.g. plugin-prov-aws)",
                      variant: "outlined",
                      hint: `Repository: ${R.value}`,
                      "persistent-hint": "",
                      class: "mb-2",
                      autofocus: ""
                    }, null, 8, ["modelValue", "hint"]),
                    e(Z, {
                      modelValue: h.value,
                      "onUpdate:modelValue": _[3] || (_[3] = (W) => h.value = W),
                      label: "Install Javadoc bundle",
                      density: "compact",
                      "hide-details": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                e(y, null, {
                  default: t(() => [
                    e(o),
                    e(x, {
                      variant: "text",
                      onClick: _[4] || (_[4] = (W) => s.value = !1)
                    }, {
                      default: t(() => [..._[14] || (_[14] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(x, {
                      color: "primary",
                      variant: "elevated",
                      loading: q.value,
                      disabled: !S.value,
                      onClick: A
                    }, {
                      default: t(() => [..._[15] || (_[15] = [
                        l("Install", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}, pl = { class: "d-flex align-center mb-4" }, vl = {
  __name: "SystemNodeView",
  setup(m) {
    const T = fe(), j = pe(), I = i([]), R = i(!1), d = i(null), D = i(!1), U = i(null), P = i(!1), $ = [
      { title: "Identifier", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Status", key: "status", sortable: !0, width: "120px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function s(E) {
      var p;
      const f = (p = E == null ? void 0 : E.toLowerCase) == null ? void 0 : p.call(E);
      return f === "up" ? "success" : f === "down" ? "error" : f === "unknown" ? "warning" : "grey";
    }
    async function S() {
      R.value = !0, d.value = null;
      const E = await T.get("rest/node");
      I.value = Array.isArray(E) ? E : (E == null ? void 0 : E.data) || [], R.value = !1;
    }
    function h(E) {
      U.value = E, D.value = !0;
    }
    async function q() {
      P.value = !0, await T.del(`rest/node/${encodeURIComponent(U.value.id)}`), P.value = !1, D.value = !1, S();
    }
    return me(() => {
      j.setTitle("Nodes"), j.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]), S();
    }), (E, f) => {
      const p = n("v-spacer"), N = n("v-btn"), O = n("v-alert"), z = n("v-chip"), A = n("v-icon"), V = n("v-data-table"), r = n("v-card-title"), v = n("v-card-text"), _ = n("v-card-actions"), o = n("v-card"), L = n("v-dialog");
      return c(), J("div", null, [
        u("div", pl, [
          f[3] || (f[3] = u("h1", { class: "text-h4" }, "Nodes", -1)),
          e(p),
          e(N, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            to: "/subscribe"
          }, {
            default: t(() => [...f[2] || (f[2] = [
              l("New subscription", -1)
            ])]),
            _: 1
          })
        ]),
        d.value ? (c(), B(O, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(d.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(V, {
          headers: $,
          items: I.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.id": t(({ item: x }) => [
            u("code", null, C(x.id), 1)
          ]),
          "item.status": t(({ item: x }) => [
            x.status ? (c(), B(z, {
              key: 0,
              size: "x-small",
              color: s(x.status),
              variant: "tonal"
            }, {
              default: t(() => [
                l(C(x.status), 1)
              ]),
              _: 2
            }, 1032, ["color"])) : K("", !0)
          ]),
          "item.actions": t(({ item: x }) => [
            e(N, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (ee) => h(x)
            }, {
              default: t(() => [
                e(A, { size: "small" }, {
                  default: t(() => [...f[4] || (f[4] = [
                    l("mdi-delete", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["items", "loading"]),
        e(L, {
          modelValue: D.value,
          "onUpdate:modelValue": f[1] || (f[1] = (x) => D.value = x),
          "max-width": "460"
        }, {
          default: t(() => [
            e(o, null, {
              default: t(() => [
                e(r, null, {
                  default: t(() => [...f[5] || (f[5] = [
                    l("Delete node", -1)
                  ])]),
                  _: 1
                }),
                e(v, null, {
                  default: t(() => {
                    var x, ee;
                    return [
                      f[6] || (f[6] = l(" Delete ", -1)),
                      u("strong", null, C((x = U.value) == null ? void 0 : x.name), 1),
                      f[7] || (f[7] = l(" (", -1)),
                      u("code", null, C((ee = U.value) == null ? void 0 : ee.id), 1),
                      f[8] || (f[8] = l(")? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(_, null, {
                  default: t(() => [
                    e(p),
                    e(N, {
                      variant: "text",
                      onClick: f[0] || (f[0] = (x) => D.value = !1)
                    }, {
                      default: t(() => [...f[9] || (f[9] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(N, {
                      color: "error",
                      variant: "elevated",
                      loading: P.value,
                      onClick: q
                    }, {
                      default: t(() => [...f[10] || (f[10] = [
                        l("Delete", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}, fl = { class: "d-flex align-center mb-4" }, _l = { class: "d-flex align-center ga-2" }, yl = { class: "d-flex align-center ga-2" }, gl = {
  __name: "SystemCacheView",
  setup(m) {
    const T = fe(), j = pe(), I = i([]), R = i(!1), d = i(null), D = i(null), U = [
      { title: "Cache", key: "id", sortable: !0 },
      { title: "Size", key: "size", sortable: !0, width: "100px" },
      { title: "Hits", key: "hitCount", sortable: !0, width: "160px" },
      { title: "Misses", key: "missCount", sortable: !0, width: "160px" },
      { title: "Avg get (ms)", key: "averageGetTime", sortable: !0, width: "140px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function P(S, h, q) {
      return h && q === 1 || S >= 90 ? "success" : S >= 80 ? "primary" : S >= 50 ? "warning" : "error";
    }
    async function $() {
      R.value = !0, d.value = null;
      const S = await T.get("rest/system/cache");
      Array.isArray(S) ? I.value = S : S === null && (d.value = "Unable to load caches"), R.value = !1;
    }
    async function s(S) {
      D.value = S.id, await T.post(`rest/system/cache/${encodeURIComponent(S.id)}`), D.value = null, $();
    }
    return me(() => {
      j.setTitle("Caches"), j.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Caches" }]), $();
    }), (S, h) => {
      const q = n("v-spacer"), E = n("v-btn"), f = n("v-alert"), p = n("v-chip"), N = n("v-icon"), O = n("v-data-table");
      return c(), J("div", null, [
        u("div", fl, [
          h[1] || (h[1] = u("h1", { class: "text-h4" }, "Caches", -1)),
          e(q),
          e(E, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            onClick: $
          }, {
            default: t(() => [...h[0] || (h[0] = [
              l("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        d.value ? (c(), B(f, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(d.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(O, {
          headers: U,
          items: I.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.hitCount": t(({ item: z }) => [
            u("div", _l, [
              u("span", null, C(z.hitCount ?? 0), 1),
              z.hitPercentage != null && (z.hitCount ?? 0) > 0 ? (c(), B(p, {
                key: 0,
                size: "x-small",
                color: P(z.hitPercentage, !0, z.hitCount)
              }, {
                default: t(() => [
                  l(C(Math.round(z.hitPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : K("", !0)
            ])
          ]),
          "item.missCount": t(({ item: z }) => [
            u("div", yl, [
              u("span", null, C(z.missCount ?? 0), 1),
              z.missPercentage != null && (z.missCount ?? 0) > 1 ? (c(), B(p, {
                key: 0,
                size: "x-small",
                color: P(100 - z.missPercentage, !1)
              }, {
                default: t(() => [
                  l(C(Math.round(z.missPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : K("", !0)
            ])
          ]),
          "item.averageGetTime": t(({ item: z }) => [
            l(C(z.averageGetTime ?? "—"), 1)
          ]),
          "item.actions": t(({ item: z }) => [
            e(E, {
              icon: "",
              size: "small",
              variant: "text",
              loading: D.value === z.id,
              onClick: (A) => s(z),
              title: "Invalidate cache"
            }, {
              default: t(() => [
                e(N, { size: "small" }, {
                  default: t(() => [...h[2] || (h[2] = [
                    l("mdi-broom", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["loading", "onClick"])
          ]),
          _: 1
        }, 8, ["items", "loading"])
      ]);
    };
  }
}, bl = { key: 1 }, kl = {
  __name: "SystemBenchView",
  setup(m) {
    const T = fe(), j = pe(), I = [
      { key: "insert", step: "INSERT", method: "post", url: "rest/system/bench/prepare" },
      { key: "select", step: "SELECT", method: "get", url: "rest/system/bench/read" },
      { key: "select-all", step: "SELECT *", method: "get", url: "rest/system/bench/read/all" },
      { key: "update", step: "UPDATE", method: "put", url: "rest/system/bench/update" },
      { key: "delete", step: "DELETE", method: "del", url: "rest/system/bench/delete" }
    ], R = i(!1), d = i(null), D = i(I.map((P) => ({ step: P.step, duration: null, loading: !1 })));
    async function U() {
      R.value = !0, d.value = null, D.value = I.map((P) => ({ step: P.step, duration: null, loading: !1 }));
      for (let P = 0; P < I.length; P++) {
        D.value[P].loading = !0;
        try {
          const $ = I[P].method === "post" || I[P].method === "put" ? void 0 : null, s = $ === null ? await T[I[P].method](I[P].url) : await T[I[P].method](I[P].url, $);
          D.value[P].duration = (s == null ? void 0 : s.duration) ?? "—";
        } catch ($) {
          d.value = `${I[P].step} failed: ${$.message || $}`;
          break;
        } finally {
          D.value[P].loading = !1;
        }
      }
      R.value = !1;
    }
    return me(() => {
      j.setTitle("Bench"), j.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (P, $) => {
      const s = n("v-card-text"), S = n("v-card"), h = n("v-btn"), q = n("v-alert"), E = n("v-progress-circular"), f = n("v-table");
      return c(), J("div", null, [
        $[3] || ($[3] = u("h1", { class: "text-h4 mb-4" }, "Database bench", -1)),
        e(S, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(s, null, {
              default: t(() => [...$[0] || ($[0] = [
                l(" Runs a sequence of ", -1),
                u("code", null, "INSERT", -1),
                l(" → ", -1),
                u("code", null, "SELECT", -1),
                l(" → ", -1),
                u("code", null, "SELECT *", -1),
                l(" → ", -1),
                u("code", null, "UPDATE", -1),
                l(" → ", -1),
                u("code", null, "DELETE", -1),
                l(" calls and reports each step's duration. Handy to validate that the backend's persistence layer is responsive. ", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }),
        e(h, {
          color: "primary",
          "prepend-icon": "mdi-play",
          loading: R.value,
          onClick: U
        }, {
          default: t(() => [...$[1] || ($[1] = [
            l(" Run bench ", -1)
          ])]),
          _: 1
        }, 8, ["loading"]),
        d.value ? (c(), B(q, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mt-4"
        }, {
          default: t(() => [
            l(C(d.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        D.value.length ? (c(), B(f, {
          key: 1,
          density: "compact",
          class: "mt-4",
          style: { "max-width": "600px" }
        }, {
          default: t(() => [
            $[2] || ($[2] = u("thead", null, [
              u("tr", null, [
                u("th", null, "Step"),
                u("th", null, "Duration (ms)")
              ])
            ], -1)),
            u("tbody", null, [
              (c(!0), J(ve, null, ke(D.value, (p) => (c(), J("tr", {
                key: p.step
              }, [
                u("td", null, C(p.step), 1),
                u("td", null, [
                  p.loading ? (c(), B(E, {
                    key: 0,
                    size: "16",
                    width: "2",
                    indeterminate: ""
                  })) : (c(), J("span", bl, C(p.duration ?? "—"), 1))
                ])
              ]))), 128))
            ])
          ]),
          _: 1
        })) : K("", !0)
      ]);
    };
  }
}, wl = { class: "d-flex align-center mb-4" }, xl = {
  __name: "ApiHomeView",
  setup(m) {
    const T = pe(), j = i(!0), I = i(null), R = "/", d = `${R}rest/swagger-ui-bundle.js`, D = `${R}rest/swagger-ui-standalone-preset.js`, U = `${R}rest/swagger-ui.css`, P = `${R}rest/index.css`, $ = `${R}rest/openapi.json`;
    function s() {
      return () => ({
        fn: {
          opsFilter(f, p) {
            const N = p.toLowerCase();
            return f.map((z) => (z._root.entries[1][1] = z._root.entries[1][1].filter((A) => {
              const V = JSON.parse(JSON.stringify(A)), r = (V.operation.summary || "").toString().toLowerCase(), v = (V.operation.description || "").toString().toLowerCase();
              return V.path.toLowerCase().includes(N) || r.includes(N) || v.includes(N);
            }), z)).filter((z) => z._root.entries[1][1].size > 0);
          }
        }
      });
    }
    function S(f, p) {
      if (document.getElementById(p)) return;
      const N = document.createElement("link");
      N.id = p, N.rel = "stylesheet", N.href = f, document.head.appendChild(N);
    }
    function h(f) {
      var p;
      (p = document.getElementById(f)) == null || p.remove();
    }
    function q(f, p) {
      return new Promise((N, O) => {
        if (document.getElementById(p)) {
          N();
          return;
        }
        const A = document.createElement("script");
        A.id = p, A.src = f, A.async = !0, A.onload = N, A.onerror = () => O(new Error(`Failed to load ${f}`)), document.head.appendChild(A);
      });
    }
    function E() {
      const { SwaggerUIBundle: f, SwaggerUIStandalonePreset: p } = window;
      if (!f) {
        I.value = "Swagger UI bundle is unavailable.";
        return;
      }
      window.ui = f({
        url: $,
        dom_id: "#swagger-ui",
        displayRequestDuration: !0,
        deepLinking: !1,
        presets: [f.presets.apis, p],
        plugins: [f.plugins.FiltrePreset, s()].filter(Boolean),
        filter: !0,
        layout: "StandaloneLayout",
        validatorUrl: "https://validator.swagger.io/validator"
      });
    }
    return me(async () => {
      T.setTitle("API"), T.setBreadcrumbs([{ title: "API" }]), S(U, "swagger-ui-css"), S(P, "swagger-ui-extra-css");
      try {
        await Promise.all([
          q(d, "swagger-ui-bundle"),
          q(D, "swagger-ui-preset")
        ]), E();
      } catch (f) {
        I.value = f.message || "Unable to load Swagger UI.";
      } finally {
        j.value = !1;
      }
    }), We(() => {
      h("swagger-ui-css"), h("swagger-ui-extra-css"), delete window.ui;
    }), (f, p) => {
      const N = n("v-spacer"), O = n("v-btn"), z = n("v-alert"), A = n("v-progress-linear");
      return c(), J("div", null, [
        u("div", wl, [
          p[1] || (p[1] = u("h1", { class: "text-h4" }, "API reference", -1)),
          e(N),
          e(O, {
            variant: "outlined",
            "prepend-icon": "mdi-code-tags",
            href: `${ie(R)}rest/openapi.json`,
            target: "_blank"
          }, {
            default: t(() => [...p[0] || (p[0] = [
              l(" Download OpenAPI ", -1)
            ])]),
            _: 1
          }, 8, ["href"])
        ]),
        I.value ? (c(), B(z, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(I.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        j.value ? (c(), B(A, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : K("", !0),
        p[2] || (p[2] = u("div", {
          id: "swagger-ui",
          class: "swagger-container"
        }, null, -1))
      ]);
    };
  }
}, Vl = /* @__PURE__ */ we(xl, [["__scopeId", "data-v-f74586ba"]]), Cl = { class: "d-flex align-center mb-4" }, $l = { class: "mb-0 text-body-2" }, Sl = {
  __name: "ApiTokenView",
  setup(m) {
    const T = fe(), j = pe(), I = Te(), R = "/", d = typeof window < "u" ? window.location.origin : "", D = ce(() => I.userName || "<you>"), U = i([]), P = i(!1), $ = i(null), s = i(!1), S = i(null), h = i(""), q = i(!1), E = i(!1), f = i(""), p = i(""), N = i(!1), O = i(""), z = i(""), A = i(!1), V = i(!1), r = i(!1), v = i(""), _ = i(!1), o = { required: (Y) => !!Y || "Required" }, L = [
      { title: "Name", key: "name", sortable: !0 },
      { title: "", key: "actions", sortable: !1, width: "140px", align: "end" }
    ];
    async function x() {
      P.value = !0, $.value = null;
      const Y = await T.get("rest/api/token");
      U.value = Array.isArray(Y) ? Y.map((y) => ({ name: y })) : [], P.value = !1;
    }
    function ee() {
      h.value = "", s.value = !0;
    }
    async function G() {
      const { valid: Y } = await S.value.validate();
      if (!Y) return;
      q.value = !0;
      const y = await T.post(`rest/api/token/${encodeURIComponent(h.value)}`);
      q.value = !1, y !== null && (f.value = h.value, p.value = typeof y == "string" ? y : (y == null ? void 0 : y.id) || "", s.value = !1, E.value = !0, x());
    }
    async function k(Y, y) {
      O.value = Y, z.value = "", V.value = !1, N.value = !0, A.value = !0;
      const H = `rest/api/token/${encodeURIComponent(Y)}`, le = y === "regen" ? await T.put(H) : await T.get(H);
      z.value = typeof le == "string" ? le : (le == null ? void 0 : le.id) || "", A.value = !1;
    }
    async function a() {
      try {
        await navigator.clipboard.writeText(z.value), V.value = !0, setTimeout(() => {
          V.value = !1;
        }, 2e3);
      } catch {
      }
    }
    async function b() {
      try {
        await navigator.clipboard.writeText(p.value);
      } catch {
      }
    }
    function te(Y) {
      v.value = Y, r.value = !0;
    }
    async function Z() {
      _.value = !0, await T.del(`rest/api/token/${encodeURIComponent(v.value)}`), _.value = !1, r.value = !1, x();
    }
    return me(() => {
      j.setTitle("API tokens"), j.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]), x();
    }), (Y, y) => {
      const H = n("v-spacer"), le = n("v-btn"), W = n("v-card-text"), oe = n("v-card"), re = n("v-alert"), F = n("v-icon"), se = n("v-data-table"), de = n("v-card-title"), _e = n("v-text-field"), w = n("v-form"), g = n("v-card-actions"), Q = n("v-dialog"), M = n("v-progress-linear"), ne = n("v-textarea");
      return c(), J("div", null, [
        u("div", Cl, [
          y[11] || (y[11] = u("h1", { class: "text-h4" }, "API tokens", -1)),
          e(H),
          e(le, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: ee
          }, {
            default: t(() => [...y[10] || (y[10] = [
              l("New token", -1)
            ])]),
            _: 1
          })
        ]),
        e(oe, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(W, null, {
              default: t(() => [
                y[13] || (y[13] = u("p", { class: "mb-2" }, [
                  l(" Tokens let you call the Ligoj API without a password. Pass the token in the "),
                  u("code", null, "api-key"),
                  l(" parameter along with your user id in "),
                  u("code", null, "api-user"),
                  l(". ")
                ], -1)),
                u("p", $l, [
                  y[12] || (y[12] = l(" Example: ", -1)),
                  u("code", null, " GET " + C(ie(d)) + C(ie(R)) + "rest/project?api-key=<token>&api-user=" + C(D.value), 1)
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        $.value ? (c(), B(re, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C($.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(se, {
          headers: L,
          items: U.value,
          loading: P.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.actions": t(({ item: ae }) => [
            e(le, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Show token",
              onClick: (ye) => k(ae.name, "load")
            }, {
              default: t(() => [
                e(F, { size: "small" }, {
                  default: t(() => [...y[14] || (y[14] = [
                    l("mdi-eye", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(le, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Regenerate",
              onClick: (ye) => k(ae.name, "regen")
            }, {
              default: t(() => [
                e(F, { size: "small" }, {
                  default: t(() => [...y[15] || (y[15] = [
                    l("mdi-refresh", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(le, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              title: "Delete",
              onClick: (ye) => te(ae.name)
            }, {
              default: t(() => [
                e(F, { size: "small" }, {
                  default: t(() => [...y[16] || (y[16] = [
                    l("mdi-delete", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["items", "loading"]),
        e(Q, {
          modelValue: s.value,
          "onUpdate:modelValue": y[2] || (y[2] = (ae) => s.value = ae),
          "max-width": "480",
          persistent: ""
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [...y[17] || (y[17] = [
                    l("New API token", -1)
                  ])]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(w, {
                      ref_key: "createFormRef",
                      ref: S,
                      onSubmit: xe(G, ["prevent"])
                    }, {
                      default: t(() => [
                        e(_e, {
                          modelValue: h.value,
                          "onUpdate:modelValue": y[0] || (y[0] = (ae) => h.value = ae),
                          label: "Name",
                          rules: [o.required],
                          variant: "outlined",
                          autofocus: "",
                          maxlength: "250"
                        }, null, 8, ["modelValue", "rules"])
                      ]),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(H),
                    e(le, {
                      variant: "text",
                      onClick: y[1] || (y[1] = (ae) => s.value = !1)
                    }, {
                      default: t(() => [...y[18] || (y[18] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(le, {
                      color: "primary",
                      variant: "elevated",
                      loading: q.value,
                      onClick: G
                    }, {
                      default: t(() => [...y[19] || (y[19] = [
                        l("Create", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        e(Q, {
          modelValue: N.value,
          "onUpdate:modelValue": y[5] || (y[5] = (ae) => N.value = ae),
          "max-width": "520"
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [
                    y[20] || (y[20] = l(" Token: ", -1)),
                    u("code", null, C(O.value), 1)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    A.value ? (c(), B(M, {
                      key: 0,
                      indeterminate: "",
                      color: "primary",
                      class: "mb-3"
                    })) : K("", !0),
                    e(ne, {
                      modelValue: z.value,
                      "onUpdate:modelValue": y[3] || (y[3] = (ae) => z.value = ae),
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": a
                    }, null, 8, ["modelValue"]),
                    V.value ? (c(), B(re, {
                      key: 1,
                      type: "success",
                      variant: "tonal",
                      density: "compact",
                      class: "mt-2"
                    }, {
                      default: t(() => [...y[21] || (y[21] = [
                        l(" Copied to clipboard. ", -1)
                      ])]),
                      _: 1
                    })) : K("", !0)
                  ]),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(H),
                    e(le, {
                      variant: "text",
                      onClick: y[4] || (y[4] = (ae) => N.value = !1)
                    }, {
                      default: t(() => [...y[22] || (y[22] = [
                        l("Close", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        e(Q, {
          modelValue: E.value,
          "onUpdate:modelValue": y[7] || (y[7] = (ae) => E.value = ae),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [
                    y[23] || (y[23] = l(" New token: ", -1)),
                    u("code", null, C(f.value), 1)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(re, {
                      type: "info",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-3"
                    }, {
                      default: t(() => [...y[24] || (y[24] = [
                        l(" Save this value now — you can re-display it later through ", -1),
                        u("strong", null, "Show token", -1),
                        l(". ", -1)
                      ])]),
                      _: 1
                    }),
                    e(ne, {
                      "model-value": p.value,
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": b
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(H),
                    e(le, {
                      color: "primary",
                      onClick: y[6] || (y[6] = (ae) => E.value = !1)
                    }, {
                      default: t(() => [...y[25] || (y[25] = [
                        l("Done", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        e(Q, {
          modelValue: r.value,
          "onUpdate:modelValue": y[9] || (y[9] = (ae) => r.value = ae),
          "max-width": "420"
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [...y[26] || (y[26] = [
                    l("Delete token", -1)
                  ])]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    y[27] || (y[27] = l("Revoke token ", -1)),
                    u("code", null, C(v.value), 1),
                    y[28] || (y[28] = l("?", -1))
                  ]),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(H),
                    e(le, {
                      variant: "text",
                      onClick: y[8] || (y[8] = (ae) => r.value = !1)
                    }, {
                      default: t(() => [...y[29] || (y[29] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(le, {
                      color: "error",
                      variant: "elevated",
                      loading: _.value,
                      onClick: Z
                    }, {
                      default: t(() => [...y[30] || (y[30] = [
                        l("Revoke", -1)
                      ])]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}, hl = { class: "d-flex align-center mb-4" }, Ul = { class: "pa-4" }, Tl = { class: "pa-4" }, Nl = { class: "text-body-2 text-medium-emphasis mb-4" }, Pl = { class: "d-flex align-center pa-2" }, jl = {
  __name: "SubscribeWizardView",
  setup(m) {
    const T = De(), j = Ne(), I = fe(), R = pe(), d = ce(() => T.query.project ?? T.params.id ?? null), D = i(null), U = i(!1), P = i(null), $ = i(1), s = Ve({
      service: null,
      tool: null,
      node: null,
      mode: null
    }), S = i([]), h = i([]), q = i([]), E = i([]), f = Ve({}), p = i(null), N = i(!1), O = i(!1), z = i(!1), A = i(!1), V = i(!1), r = ce(() => ["Service", "Tool", "Node", "Mode", "Parameters"]), v = ce(() => (w) => w === 1 ? !0 : w === 2 ? !!s.service : w === 3 ? !!s.tool : w === 4 ? !!s.node : w === 5 ? !!s.node && !!s.mode : !1), _ = ce(() => $.value === 1 ? !!s.service : $.value === 2 ? !!s.tool : $.value === 3 ? !!s.node : $.value === 4 ? !!s.mode : !1), o = ce(() => {
      var Q;
      const w = (Q = s.tool) == null ? void 0 : Q.mode, g = [];
      return (w === "all" || w === "create") && g.push({ value: "create", label: "Create — provision a new instance inside the tool" }), (w === "all" || w === "link" || !w) && g.push({ value: "link", label: "Link — attach this project to an existing instance" }), g;
    }), L = ce(
      () => D.value ? `/home/project/${D.value.id}` : "/home/project"
    );
    function x(w) {
      return !w.type || w.type === "text" || w.type === "password" || w.type === "node" || w.type === "project";
    }
    function ee(w) {
      return w.type === "password" || (w.name || "").toLowerCase().includes("password");
    }
    function G(w) {
      const g = w.mandatory || w.required ? " *" : "";
      return `${w.name || w.id}${g}`;
    }
    function k(w) {
      const g = [];
      return (w.mandatory || w.required) && g.push((Q) => Q !== "" && Q != null || "Required"), g;
    }
    async function a() {
      if (!d.value) return;
      U.value = !0;
      const w = await I.get(`rest/project/${d.value}`);
      D.value = w || null, U.value = !1;
    }
    async function b() {
      N.value = !0, S.value = await H("rest/node?refined=service&rows=1000"), N.value = !1;
    }
    async function te(w) {
      O.value = !0, h.value = await H(`rest/node?refined=${encodeURIComponent(w)}&rows=1000`), O.value = !1;
    }
    async function Z(w) {
      z.value = !0, q.value = await H(`rest/node?refined=${encodeURIComponent(w)}&rows=1000`), z.value = !1;
    }
    async function Y(w, g) {
      A.value = !0;
      const Q = await I.get(`rest/node/${encodeURIComponent(w)}/parameter/${g.toUpperCase()}`);
      E.value = Array.isArray(Q) ? Q : (Q == null ? void 0 : Q.data) || [];
      for (const M of Object.keys(f)) delete f[M];
      for (const M of E.value)
        M.defaultValue != null ? f[M.id] = y(M) : M.type === "bool" ? f[M.id] = !1 : M.type === "multiselect" || M.type === "tags" ? f[M.id] = [] : f[M.id] = "";
      A.value = !1;
    }
    function y(w) {
      return w.type === "integer" ? Number(w.defaultValue) : w.type === "bool" ? w.defaultValue === !0 || w.defaultValue === "true" : w.defaultValue;
    }
    async function H(w) {
      const g = await I.get(w);
      return Array.isArray(g) ? le(g) : Array.isArray(g == null ? void 0 : g.data) ? le(g.data) : [];
    }
    function le(w) {
      return w.filter((g) => g.enabled !== !1);
    }
    function W(w) {
      var g;
      ((g = s.service) == null ? void 0 : g.id) !== w.id && (s.service = w, s.tool = null, s.node = null, s.mode = null, h.value = [], q.value = []);
    }
    function oe(w) {
      var g;
      ((g = s.tool) == null ? void 0 : g.id) !== w.id && (s.tool = w, s.node = null, s.mode = null, q.value = []);
    }
    function re(w) {
      var g;
      ((g = s.node) == null ? void 0 : g.id) !== w.id && (s.node = w, s.mode = null);
    }
    Ie($, async (w) => {
      w === 1 && S.value.length === 0 && await b(), w === 2 && s.service && h.value.length === 0 && await te(s.service.id), w === 3 && s.tool && q.value.length === 0 && await Z(s.tool.id), w === 4 && !s.mode && o.value.length > 0 && (s.mode = o.value[0].value), w === 5 && s.node && s.mode && await Y(s.node.id, s.mode);
    });
    async function F() {
      const { valid: w } = p.value ? await p.value.validate() : { valid: !0 };
      if (!w) return;
      V.value = !0, P.value = null;
      const g = {
        node: s.node.id,
        project: Number(d.value),
        mode: s.mode,
        parameters: E.value.map((M) => se(M)).filter(Boolean)
      }, Q = await I.post("rest/subscription", g);
      V.value = !1, Q != null ? j.push(`/home/project/${d.value}`) : P.value = "Subscription creation failed — please review the highlighted parameters.";
    }
    function se(w) {
      const g = f[w.id];
      if ((g === "" || g == null || Array.isArray(g) && g.length === 0) && !w.mandatory && !w.required)
        return null;
      const Q = { parameter: w.id };
      return w.type === "integer" ? { ...Q, integer: Number(g) } : w.type === "bool" ? { ...Q, bool: !!g } : w.type === "multiselect" || w.type === "tags" ? { ...Q, selections: g || [] } : w.type === "select" ? { ...Q, text: g } : { ...Q, text: g };
    }
    me(async () => {
      R.setTitle("Subscribe"), R.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        ...d.value ? [{ title: d.value, to: `/home/project/${d.value}` }, { title: "Subscribe" }] : [{ title: "Subscribe" }]
      ]), await a(), D.value && await b();
    });
    const de = {
      name: "StepChoice",
      props: {
        heading: String,
        sub: String,
        choices: { type: Array, default: () => [] },
        loading: Boolean,
        selectedId: String
      },
      emits: ["select"],
      setup(w, { emit: g }) {
        return () => be("div", { class: "pa-4" }, [
          be("h3", { class: "text-h6 mb-1" }, w.heading),
          w.sub && be("p", { class: "text-body-2 text-medium-emphasis mb-4" }, w.sub),
          w.loading ? be("div", { class: "text-body-2 text-medium-emphasis pa-4" }, "Loading…") : w.choices.length ? be(
            "div",
            { class: "choice-grid" },
            w.choices.map(
              (Q) => be(
                "button",
                {
                  key: Q.id,
                  type: "button",
                  class: [
                    "choice-card",
                    { "choice-card--active": Q.id === w.selectedId }
                  ],
                  onClick: () => g("select", Q),
                  title: Q.description || void 0
                },
                [
                  be("div", { class: "choice-icon" }, _e(Q)),
                  be("div", { class: "choice-name" }, Q.name || Q.id)
                ]
              )
            )
          ) : be("div", { class: "text-body-2 text-medium-emphasis" }, "No entries available.")
        ]);
      }
    };
    function _e(w) {
      var Q;
      const g = (w == null ? void 0 : w.uiClasses) || ((Q = w == null ? void 0 : w.refined) == null ? void 0 : Q.uiClasses);
      return g && g.startsWith("$") ? g.slice(1) : g ? be("i", { class: g }) : be("i", { class: "mdi mdi-puzzle" });
    }
    return (w, g) => {
      const Q = n("v-spacer"), M = n("v-btn"), ne = n("router-link"), ae = n("v-alert"), ye = n("v-radio"), Ee = n("v-radio-group"), Be = n("v-progress-linear"), Ce = n("v-text-field"), qe = n("v-checkbox"), Pe = n("v-select"), Me = n("v-form"), Fe = n("v-stepper");
      return c(), J("div", null, [
        u("div", hl, [
          g[3] || (g[3] = u("h1", { class: "text-h4" }, "Subscribe", -1)),
          e(Q),
          e(M, {
            variant: "text",
            to: L.value
          }, {
            default: t(() => [...g[2] || (g[2] = [
              l("Cancel", -1)
            ])]),
            _: 1
          }, 8, ["to"])
        ]),
        d.value ? U.value ? (c(), B(ae, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...g[7] || (g[7] = [
            l(" Loading project… ", -1)
          ])]),
          _: 1
        })) : D.value ? (c(), B(ae, {
          key: 2,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            g[8] || (g[8] = l(" Adding a subscription to ", -1)),
            u("strong", null, C(D.value.name), 1),
            l(" (" + C(D.value.pkey) + "). ", 1),
            g[9] || (g[9] = u("br", null, null, -1)),
            g[10] || (g[10] = u("span", { class: "text-caption text-warning" }, "Subscribing is not an idempotent operation — removing a subscription later may not clean up remote data automatically.", -1))
          ]),
          _: 1
        })) : K("", !0) : (c(), B(ae, {
          key: 0,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            g[5] || (g[5] = l(" No project selected. The wizard needs a project — ", -1)),
            e(ne, { to: "/home/project" }, {
              default: t(() => [...g[4] || (g[4] = [
                l("pick one", -1)
              ])]),
              _: 1
            }),
            g[6] || (g[6] = l(`, then open this page from the project's "Add subscription" button. `, -1))
          ]),
          _: 1
        })),
        P.value ? (c(), B(ae, {
          key: 3,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(C(P.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        D.value ? (c(), B(Fe, {
          key: 4,
          modelValue: $.value,
          "onUpdate:modelValue": g[1] || (g[1] = (ue) => $.value = ue),
          items: r.value,
          "alt-labels": "",
          editable: v.value,
          class: "mb-4"
        }, {
          "item.1": t(() => {
            var ue;
            return [
              e(de, {
                heading: "Select a service",
                sub: "A service groups features implemented by one or more tools.",
                choices: S.value,
                loading: N.value,
                "selected-id": (ue = s.service) == null ? void 0 : ue.id,
                onSelect: W
              }, null, 8, ["choices", "loading", "selected-id"])
            ];
          }),
          "item.2": t(() => {
            var ue, X;
            return [
              e(de, {
                heading: `Select a tool providing ${((ue = s.service) == null ? void 0 : ue.name) ?? "…"}`,
                sub: "A tool is one implementation of the service; several instances may be deployed.",
                choices: h.value,
                loading: O.value,
                "selected-id": (X = s.tool) == null ? void 0 : X.id,
                onSelect: oe
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.3": t(() => {
            var ue, X;
            return [
              e(de, {
                heading: `Pick a node running ${((ue = s.tool) == null ? void 0 : ue.name) ?? "…"}`,
                sub: "A node is a running instance of the tool.",
                choices: q.value,
                loading: z.value,
                "selected-id": (X = s.node) == null ? void 0 : X.id,
                onSelect: re
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.4": t(() => [
            u("div", Ul, [
              g[11] || (g[11] = u("h3", { class: "text-h6 mb-2" }, "Subscription mode", -1)),
              g[12] || (g[12] = u("p", { class: "text-body-2 text-medium-emphasis mb-4" }, [
                u("strong", null, "Link"),
                l(" attaches this project to an existing instance in the tool. "),
                u("strong", null, "Create"),
                l(" additionally provisions a new instance inside the tool. ")
              ], -1)),
              e(Ee, {
                modelValue: s.mode,
                "onUpdate:modelValue": g[0] || (g[0] = (ue) => s.mode = ue),
                inline: ""
              }, {
                default: t(() => [
                  (c(!0), J(ve, null, ke(o.value, (ue) => (c(), B(ye, {
                    key: ue.value,
                    value: ue.value,
                    label: ue.label
                  }, null, 8, ["value", "label"]))), 128))
                ]),
                _: 1
              }, 8, ["modelValue"])
            ])
          ]),
          "item.5": t(() => {
            var ue;
            return [
              u("div", Tl, [
                g[16] || (g[16] = u("h3", { class: "text-h6 mb-1" }, "Parameters", -1)),
                u("p", Nl, [
                  g[13] || (g[13] = l(" Values required to link the project to ", -1)),
                  u("code", null, C((ue = s.node) == null ? void 0 : ue.id), 1),
                  g[14] || (g[14] = l(". ", -1))
                ]),
                A.value ? (c(), B(Be, {
                  key: 0,
                  indeterminate: "",
                  color: "primary",
                  class: "mb-3"
                })) : K("", !0),
                !A.value && E.value.length === 0 ? (c(), B(ae, {
                  key: 1,
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: t(() => [...g[15] || (g[15] = [
                    l(" This subscription requires no additional parameters — just click Create. ", -1)
                  ])]),
                  _: 1
                })) : K("", !0),
                e(Me, {
                  ref_key: "paramFormRef",
                  ref: p
                }, {
                  default: t(() => [
                    (c(!0), J(ve, null, ke(E.value, (X) => (c(), J("div", {
                      key: X.id,
                      class: "mb-3"
                    }, [
                      x(X) ? (c(), B(Ce, {
                        key: 0,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        type: ee(X) ? "password" : "text",
                        label: G(X),
                        rules: k(X),
                        hint: X.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "label", "rules", "hint"])) : X.type === "integer" ? (c(), B(Ce, {
                        key: 1,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        modelModifiers: { number: !0 },
                        type: "number",
                        min: X.min,
                        max: X.max,
                        label: G(X),
                        rules: k(X),
                        hint: X.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "max", "label", "rules", "hint"])) : X.type === "bool" ? (c(), B(qe, {
                        key: 2,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        label: G(X),
                        hint: X.description,
                        "persistent-hint": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "hint"])) : X.type === "select" ? (c(), B(Pe, {
                        key: 3,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        items: X.values || [],
                        label: G(X),
                        rules: k(X),
                        hint: X.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : X.type === "multiselect" || X.type === "tags" ? (c(), B(Pe, {
                        key: 4,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        items: X.values || [],
                        label: G(X),
                        rules: k(X),
                        hint: X.description,
                        "persistent-hint": "",
                        chips: "",
                        multiple: "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : (c(), B(Ce, {
                        key: 5,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        label: G(X),
                        rules: k(X),
                        hint: `${X.description || ""} [${X.type}]`,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "rules", "hint"]))
                    ]))), 128))
                  ]),
                  _: 1
                }, 512)
              ])
            ];
          }),
          actions: t(({ prev: ue, next: X }) => [
            u("div", Pl, [
              $.value > 1 ? (c(), B(M, {
                key: 0,
                variant: "text",
                "prepend-icon": "mdi-arrow-left",
                onClick: ue
              }, {
                default: t(() => [...g[17] || (g[17] = [
                  l("Previous", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : K("", !0),
              e(Q),
              $.value < r.value.length ? (c(), B(M, {
                key: 1,
                color: "primary",
                disabled: !_.value,
                "append-icon": "mdi-arrow-right",
                onClick: X
              }, {
                default: t(() => [...g[18] || (g[18] = [
                  l("Next", -1)
                ])]),
                _: 1
              }, 8, ["disabled", "onClick"])) : (c(), B(M, {
                key: 2,
                color: "success",
                "prepend-icon": "mdi-check",
                loading: V.value,
                disabled: !s.node,
                onClick: F
              }, {
                default: t(() => [...g[19] || (g[19] = [
                  l("Create subscription", -1)
                ])]),
                _: 1
              }, 8, ["loading", "disabled"]))
            ])
          ]),
          _: 1
        }, 8, ["modelValue", "items", "editable"])) : K("", !0)
      ]);
    };
  }
}, je = /* @__PURE__ */ we(jl, [["__scopeId", "data-v-47b9f499"]]), zl = {
  sample: Re.sample
}, ze = [
  { path: "/home", name: "ui-home", component: mt },
  { path: "/home/manual", name: "ui-manual", component: qt },
  { path: "/home/project", name: "ui-project-list", component: Vt },
  { path: "/home/project/:id", name: "ui-project-detail", component: Rt },
  { path: "/system", name: "ui-system", component: Ft },
  { path: "/system/information", name: "ui-system-information", component: Zt },
  { path: "/system/configuration", name: "ui-system-configuration", component: ll },
  { path: "/system/user", name: "ui-system-user", component: ol },
  { path: "/system/role", name: "ui-system-role", component: rl },
  { path: "/system/plugin", name: "ui-system-plugin", component: ml },
  { path: "/system/node", name: "ui-system-node", component: vl },
  { path: "/system/cache", name: "ui-system-cache", component: gl },
  { path: "/system/bench", name: "ui-system-bench", component: kl },
  { path: "/api", name: "ui-api", component: Vl },
  { path: "/api/token", name: "ui-api-token", component: Sl },
  { path: "/subscribe", name: "ui-subscribe", component: je },
  // Project-scoped entry used by ProjectDetailView's "Add subscription" button.
  { path: "/home/project/:id/subscription", name: "ui-subscribe-project", component: je }
], Hl = {
  id: "ui",
  label: "UI",
  component: Ye,
  routes: ze,
  install({ router: m }) {
    for (const T of ze)
      m.addRoute(T);
  },
  feature(m, ...T) {
    const j = zl[m];
    if (!j) throw new Error(`Plugin "ui" has no feature "${m}"`);
    return j(...T);
  },
  service: Re,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  Gl as TARGET_TYPE_ICON,
  Hl as default,
  Le as getFullName,
  Ol as getHierarchyIds,
  vt as getService,
  ql as getServiceFromId,
  Ml as getServiceNameFromId,
  ft as getTool,
  Bl as getToolFromId,
  Fl as getToolNameFromId,
  Ll as htmlEscape,
  El as htmlUnescape,
  yt as normalize,
  Re as service,
  pt as toUser2Letters,
  Rl as trimObject
};
