import { resolveComponent as n, openBlock as m, createElementBlock as J, createVNode as e, withCtx as t, createTextVNode as l, ref as s, computed as ce, onMounted as me, createElementVNode as u, Fragment as ve, renderList as ke, createBlock as q, toDisplayString as h, createCommentVNode as K, normalizeClass as Fe, mergeProps as Te, unref as se, withDirectives as Oe, withModifiers as xe, vShow as Ge, watch as ze, reactive as Ve, normalizeProps as He, guardReactiveProps as We, withKeys as Se, onBeforeUnmount as Ke, h as be } from "vue";
import { useApi as fe, useAppStore as pe, useI18nStore as Je, useDataTable as Ie, useErrorStore as Ze, useAuthStore as he } from "@ligoj/host";
import { useRouter as Ue, useRoute as Ae } from "vue-router";
const we = (d, U) => {
  const T = d.__vccOpts || d;
  for (const [I, R] of U)
    T[I] = R;
  return T;
}, Xe = { class: "plugin-ui-shell" }, Ye = {
  __name: "UiPlugin",
  setup(d) {
    return (U, T) => {
      const I = n("v-alert"), R = n("v-list-subheader"), c = n("v-list-item"), D = n("v-list");
      return m(), J("div", Xe, [
        e(I, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...T[0] || (T[0] = [
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
              default: t(() => [...T[1] || (T[1] = [
                l("Dashboard", -1)
              ])]),
              _: 1
            }),
            e(c, {
              to: "/home",
              "prepend-icon": "mdi-view-dashboard",
              title: "Overview"
            }),
            e(c, {
              to: "/home/project",
              "prepend-icon": "mdi-folder-multiple",
              title: "Projects"
            }),
            e(c, {
              to: "/home/manual",
              "prepend-icon": "mdi-book-open-page-variant",
              title: "Manual"
            }),
            e(R, null, {
              default: t(() => [...T[2] || (T[2] = [
                l("System", -1)
              ])]),
              _: 1
            }),
            e(c, {
              to: "/system",
              "prepend-icon": "mdi-cog",
              title: "System administration"
            }),
            e(R, null, {
              default: t(() => [...T[3] || (T[3] = [
                l("API", -1)
              ])]),
              _: 1
            }),
            e(c, {
              to: "/api",
              "prepend-icon": "mdi-api",
              title: "API reference"
            }),
            e(c, {
              to: "/api/token",
              "prepend-icon": "mdi-key-variant",
              title: "API tokens"
            }),
            e(R, null, {
              default: t(() => [...T[4] || (T[4] = [
                l("Onboarding", -1)
              ])]),
              _: 1
            }),
            e(c, {
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
}, Qe = /* @__PURE__ */ we(Ye, [["__scopeId", "data-v-9cfeae95"]]), De = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, et = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, tt = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mb-4"
}, lt = { class: "ml-1 text-caption" }, nt = { class: "d-flex align-start mb-2" }, at = { class: "flex-grow-1 truncate" }, ot = { class: "text-subtitle-1 font-weight-medium truncate" }, it = { class: "text-caption text-medium-emphasis" }, st = {
  key: 0,
  class: "sub-strip"
}, rt = {
  key: 0,
  class: "text-caption text-medium-emphasis ml-1"
}, ut = { style: { width: "28px" } }, dt = { class: "truncate" }, ct = { class: "truncate text-medium-emphasis" }, mt = {
  __name: "HomeView",
  setup(d) {
    const U = fe(), T = pe(), I = s(!1), R = s(null), c = s([]), D = s(""), P = s(null), j = s("md"), C = ce(() => {
      var N, G, z;
      const p = /* @__PURE__ */ new Map();
      for (const A of c.value) {
        const V = ((N = A.project) == null ? void 0 : N.id) ?? A.project;
        if (V == null) continue;
        let r = p.get(V);
        r || (r = {
          id: V,
          name: ((G = A.project) == null ? void 0 : G.name) || String(V),
          pkey: ((z = A.project) == null ? void 0 : z.pkey) || "",
          subscriptions: []
        }, p.set(V, r)), r.subscriptions.push(A);
      }
      return [...p.values()].sort((A, V) => A.name.localeCompare(V.name));
    }), i = ce(() => {
      var N, G, z;
      const p = /* @__PURE__ */ new Map();
      for (const A of c.value) {
        const V = ((z = (G = (N = A.node) == null ? void 0 : N.refined) == null ? void 0 : G.refined) == null ? void 0 : z.id) || "";
        V && p.set(V, (p.get(V) || 0) + 1);
      }
      return [...p.entries()].sort((A, V) => V[1] - A[1]).map(([A, V]) => ({
        id: A,
        count: V,
        icon: S(A),
        label: A.split(":").slice(-1)[0]
      }));
    }), $ = ce(() => {
      var N;
      const p = (N = D.value) == null ? void 0 : N.trim().toLowerCase();
      return C.value.filter((G) => P.value && !G.subscriptions.some(
        (A) => {
          var V, r, v;
          return ((v = (r = (V = A.node) == null ? void 0 : V.refined) == null ? void 0 : r.refined) == null ? void 0 : v.id) === P.value;
        }
      ) ? !1 : !p || G.name.toLowerCase().includes(p) || G.pkey.toLowerCase().includes(p) ? !0 : G.subscriptions.some(
        (z) => {
          var A, V, r, v;
          return (((A = z.node) == null ? void 0 : A.name) || "").toLowerCase().includes(p) || (((V = z.node) == null ? void 0 : V.id) || "").toLowerCase().includes(p) || (((v = (r = z.node) == null ? void 0 : r.refined) == null ? void 0 : v.name) || "").toLowerCase().includes(p);
        }
      ));
    });
    function S(p) {
      return p.includes(":scm:") ? "mdi-source-branch" : p.includes(":build:") ? "mdi-hammer-wrench" : p.includes(":bt") ? "mdi-bug" : p.includes(":km:") ? "mdi-book-open-variant" : p.includes(":vm") ? "mdi-server" : p.includes(":prov") ? "mdi-cloud" : p.includes(":id") ? "mdi-account-group" : p.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    function M(p) {
      var N, G, z;
      return S(((z = (G = (N = p.node) == null ? void 0 : N.refined) == null ? void 0 : G.refined) == null ? void 0 : z.id) || "");
    }
    function E(p) {
      var A, V, r;
      const N = ((r = (V = (A = p.node) == null ? void 0 : A.refined) == null ? void 0 : V.refined) == null ? void 0 : r.id) || "", G = ["primary", "teal", "indigo", "purple", "orange", "blue-grey", "green"];
      let z = 0;
      for (const v of N) z += v.charCodeAt(0);
      return G[z % G.length];
    }
    async function f() {
      I.value = !0, R.value = null;
      const p = await U.get("rest/subscription");
      Array.isArray(p) ? c.value = p : Array.isArray(p == null ? void 0 : p.data) ? c.value = p.data : c.value = [], I.value = !1;
    }
    return me(() => {
      T.setTitle("Dashboard"), T.setBreadcrumbs([{ title: "Home" }]), f();
    }), (p, N) => {
      const G = n("v-spacer"), z = n("v-text-field"), A = n("v-icon"), V = n("v-btn"), r = n("v-btn-toggle"), v = n("v-chip"), y = n("v-alert"), o = n("v-progress-linear"), L = n("v-tooltip"), x = n("v-table"), Q = n("v-card-text"), te = n("v-card");
      return m(), J("div", null, [
        u("div", et, [
          N[6] || (N[6] = u("h1", { class: "text-h4" }, "Dashboard", -1)),
          e(G),
          e(z, {
            modelValue: D.value,
            "onUpdate:modelValue": N[0] || (N[0] = (_) => D.value = _),
            "prepend-inner-icon": "mdi-magnify",
            label: "Filter projects or tools",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field",
            clearable: ""
          }, null, 8, ["modelValue"]),
          e(r, {
            modelValue: j.value,
            "onUpdate:modelValue": N[1] || (N[1] = (_) => j.value = _),
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
        i.value.length ? (m(), J("div", tt, [
          (m(!0), J(ve, null, ke(i.value, (_) => (m(), q(v, {
            key: _.id,
            color: P.value === _.id ? "primary" : void 0,
            variant: P.value === _.id ? "elevated" : "tonal",
            size: "small",
            onClick: (a) => P.value = P.value === _.id ? null : _.id
          }, {
            default: t(() => [
              e(A, {
                start: "",
                size: "small"
              }, {
                default: t(() => [
                  l(h(_.icon), 1)
                ]),
                _: 2
              }, 1024),
              l(" " + h(_.label) + " ", 1),
              u("span", lt, h(_.count), 1)
            ]),
            _: 2
          }, 1032, ["color", "variant", "onClick"]))), 128))
        ])) : K("", !0),
        R.value ? (m(), q(y, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(R.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        I.value ? (m(), q(o, {
          key: 2,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : K("", !0),
        !I.value && $.value.length === 0 && !R.value ? (m(), q(y, {
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
          class: Fe(["tile-grid", `size-${j.value}`])
        }, [
          (m(!0), J(ve, null, ke($.value, (_) => (m(), q(te, {
            key: _.id,
            class: "tile",
            hover: "",
            to: `/home/project/${_.id}`
          }, {
            default: t(() => [
              e(Q, { class: "pa-3" }, {
                default: t(() => [
                  u("div", nt, [
                    u("div", at, [
                      u("div", ot, h(_.name), 1),
                      u("div", it, h(_.pkey), 1)
                    ]),
                    e(v, {
                      size: "x-small",
                      variant: "tonal"
                    }, {
                      default: t(() => [
                        l(h(_.subscriptions.length), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  j.value !== "lg" ? (m(), J("div", st, [
                    (m(!0), J(ve, null, ke(_.subscriptions.slice(0, j.value === "sm" ? 4 : 8), (a) => {
                      var k, ee, X, B;
                      return m(), q(L, {
                        key: a.id,
                        text: `${((ee = (k = a.node) == null ? void 0 : k.refined) == null ? void 0 : ee.name) || "—"} → ${((X = a.node) == null ? void 0 : X.name) || ((B = a.node) == null ? void 0 : B.id)}`,
                        location: "top"
                      }, {
                        activator: t(({ props: g }) => [
                          e(A, Te({ ref_for: !0 }, g, {
                            size: "small",
                            color: E(a),
                            class: "mr-1"
                          }), {
                            default: t(() => [
                              l(h(M(a)), 1)
                            ]),
                            _: 2
                          }, 1040, ["color"])
                        ]),
                        _: 2
                      }, 1032, ["text"]);
                    }), 128)),
                    _.subscriptions.length > (j.value === "sm" ? 4 : 8) ? (m(), J("span", rt, " +" + h(_.subscriptions.length - (j.value === "sm" ? 4 : 8)), 1)) : K("", !0)
                  ])) : (m(), q(x, {
                    key: 1,
                    density: "compact",
                    class: "mt-2",
                    style: { background: "transparent" }
                  }, {
                    default: t(() => [
                      u("tbody", null, [
                        (m(!0), J(ve, null, ke(_.subscriptions, (a) => {
                          var k, ee, X, B;
                          return m(), J("tr", {
                            key: a.id
                          }, [
                            u("td", ut, [
                              e(A, {
                                size: "small",
                                color: E(a)
                              }, {
                                default: t(() => [
                                  l(h(M(a)), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            u("td", dt, h(((ee = (k = a.node) == null ? void 0 : k.refined) == null ? void 0 : ee.name) || "—"), 1),
                            u("td", ct, h(((X = a.node) == null ? void 0 : X.name) || ((B = a.node) == null ? void 0 : B.id)), 1)
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
}, pt = /* @__PURE__ */ we(mt, [["__scopeId", "data-v-3f6316a9"]]);
function Rl(d) {
  if (!d || typeof d != "object") return d;
  for (const U of Object.keys(d)) {
    const T = d[U];
    (T == null || T === "" || T === !1) && delete d[U];
  }
  return d;
}
function Ll(d) {
  return typeof d != "string" ? "" : d.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function El(d) {
  return typeof d != "string" ? "" : d.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function vt(d) {
  if (!d) return "??";
  if (d.firstName && d.lastName)
    return d.firstName.charAt(0) + d.lastName.charAt(0);
  if (d.fullName) {
    const T = d.fullName.split(" ");
    return T.length === 1 ? d.fullName.charAt(0) + (d.fullName.length >= 2 ? d.fullName.charAt(1) : "") : T[0].charAt(0) + T[T.length - 1].charAt(0);
  }
  const U = (d.id || d || "??").toString();
  return (U.length === 1 ? U + U : U).slice(0, 2);
}
function Re(d) {
  if (!d) return "";
  if (d.fullName) return d.fullName;
  if (d.firstName && d.lastName) return `${d.firstName} ${d.lastName}`;
  if (d.firstName) return `${d.firstName} ${(d.id || "").substring(1)}`;
  if (d.lastName) return `${$e((d.id || "").charAt(0))}. ${d.lastName}`;
  const U = (d.id || d || "??").toString();
  return `${$e(U.charAt(0))}. ${$e(U.substring(1))}`;
}
function $e(d) {
  return d && d.charAt(0).toUpperCase() + d.slice(1);
}
function Bl(d) {
  if (!d) return null;
  const U = d.split(":");
  return U.length > 2 ? U.slice(0, 3).join("-") : null;
}
function ql(d) {
  if (!d) return null;
  const U = d.split(":");
  return U.length > 1 ? U.slice(0, 2).join("-") : null;
}
function Ml(d) {
  return (d || "").split(":")[1] || null;
}
function Fl(d) {
  return (d || "").split(":")[2] || null;
}
function Ol(d) {
  if (!d) return [];
  const U = d.split(":"), T = [];
  for (let I = 2; I <= U.length; I++)
    T.push(U.slice(0, I).join("-"));
  return T;
}
function ft(d) {
  return d ? (d.service || (d.service = d.refined && ft(d.refined) || d), d.service) : null;
}
function _t(d) {
  return d ? d.tool ? d.tool : d.refined ? (d.tool = d.refined.refined ? _t(d.refined) : d, d.tool) : null : null;
}
const yt = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function gt(d) {
  return d ? d.replace(/[-[()\]${},;_:]/g, " ").replace(yt, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const Gl = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, bt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, kt = { class: "text-caption" }, wt = {
  key: 1,
  class: "text-disabled"
}, xt = { class: "mb-4" }, Vt = {
  __name: "ProjectListView",
  setup(d) {
    const U = Ue(), T = fe(), I = pe(), { t: R } = Je(), c = Ie("project", { defaultSort: "name" }), D = s(25);
    let P = null, j = {};
    const C = s(null), i = s(!1), $ = s(null), S = s({ name: "", pkey: "", teamLeader: "", description: "" }), M = s(!1), E = s(!1), f = s(null), p = s(!1), N = s(!1);
    let G = "";
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
      const k = typeof a == "number" ? new Date(a) : new Date(a);
      return isNaN(k.getTime()) ? "" : k.toISOString().slice(0, 10);
    }
    function r(a) {
      j = a, c.load(a);
    }
    function v() {
      clearTimeout(P), P = setTimeout(
        () => c.load({ page: 1, itemsPerPage: D.value, sortBy: j.sortBy }),
        300
      );
    }
    function y(a) {
      const k = gt(a || "").split(" ").filter(Boolean);
      return k.length ? k.join("-") : "";
    }
    function o() {
      var k;
      if (((k = $.value) == null ? void 0 : k.nbSubscriptions) > 0) return;
      const a = y(S.value.name);
      (!S.value.pkey || S.value.pkey === G) && (S.value.pkey = a, G = a);
    }
    function L() {
      $.value = null, S.value = { name: "", pkey: "", teamLeader: "", description: "" }, G = "", i.value = !0;
    }
    function x(a) {
      var k;
      $.value = a, S.value = {
        name: a.name || "",
        pkey: a.pkey || "",
        teamLeader: ((k = a.teamLeader) == null ? void 0 : k.id) || "",
        description: a.description || ""
      }, G = a.pkey || "", i.value = !0;
    }
    function Q(a) {
      f.value = a, N.value = !1, E.value = !0;
    }
    async function te() {
      var B, g, H;
      const { valid: a } = await C.value.validate();
      if (!a) return;
      if (c.demoMode.value) {
        i.value = !1;
        return;
      }
      M.value = !0;
      const k = {
        id: (B = $.value) == null ? void 0 : B.id,
        name: S.value.name,
        pkey: S.value.pkey,
        teamLeader: S.value.teamLeader,
        description: S.value.description
      }, ee = (g = $.value) != null && g.id ? "put" : "post", X = await T[ee]("rest/project", k);
      M.value = !1, X !== null && (i.value = !1, !((H = $.value) != null && H.id) && typeof X != "object" ? U.push(`/home/project/${X}`) : c.load(j));
    }
    async function _() {
      if (c.demoMode.value) {
        E.value = !1;
        return;
      }
      p.value = !0;
      const a = N.value ? "?deleteRemoteData=true" : "";
      await T.del(`rest/project/${f.value.id}${a}`), p.value = !1, E.value = !1, c.load(j);
    }
    return me(() => {
      I.setTitle("Projects"), I.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), (a, k) => {
      const ee = n("v-spacer"), X = n("v-text-field"), B = n("v-btn"), g = n("v-alert"), H = n("v-skeleton-loader"), le = n("v-avatar"), W = n("v-chip"), oe = n("v-icon"), re = n("v-data-table-server"), O = n("v-card-title"), ie = n("v-textarea"), de = n("v-form"), _e = n("v-card-text"), w = n("v-card-actions"), b = n("v-card"), Y = n("v-dialog"), F = n("v-checkbox");
      return m(), J("div", null, [
        u("div", bt, [
          k[13] || (k[13] = u("h1", { class: "text-h4" }, "Projects", -1)),
          e(ee),
          e(X, {
            modelValue: se(c).search.value,
            "onUpdate:modelValue": [
              k[0] || (k[0] = (ne) => se(c).search.value = ne),
              v
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(B, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: L
          }, {
            default: t(() => [...k[12] || (k[12] = [
              l(" New ", -1)
            ])]),
            _: 1
          })
        ]),
        se(c).error.value ? (m(), q(g, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(se(c).error.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        se(c).demoMode.value ? (m(), q(g, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...k[14] || (k[14] = [
            l(" Running without a live backend — results below are sample data. ", -1)
          ])]),
          _: 1
        })) : K("", !0),
        se(c).loading.value && se(c).items.value.length === 0 ? (m(), q(H, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : K("", !0),
        se(c).error.value ? K("", !0) : Oe((m(), q(re, {
          key: 3,
          "items-per-page": D.value,
          "onUpdate:itemsPerPage": k[1] || (k[1] = (ne) => D.value = ne),
          headers: z.value,
          items: se(c).items.value,
          "items-length": se(c).totalItems.value,
          loading: se(c).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": r,
          "onClick:row": k[2] || (k[2] = (ne, { item: ae }) => se(U).push(`/home/project/${ae.id}`))
        }, {
          "item.teamLeader": t(({ item: ne }) => {
            var ae;
            return [
              (ae = ne.teamLeader) != null && ae.id ? (m(), J(ve, { key: 0 }, [
                e(le, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: t(() => [
                    u("span", kt, h(se(vt)(ne.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                l(" " + h(se(Re)(ne.teamLeader)), 1)
              ], 64)) : (m(), J("span", wt, "—"))
            ];
          }),
          "item.createdDate": t(({ item: ne }) => [
            l(h(V(ne.createdDate)), 1)
          ]),
          "item.nbSubscriptions": t(({ item: ne }) => [
            e(W, {
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(h(ne.nbSubscriptions || 0), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          "item.actions": t(({ item: ne }) => [
            e(B, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: xe((ae) => x(ne), ["stop"])
            }, {
              default: t(() => [
                e(oe, { size: "small" }, {
                  default: t(() => [...k[15] || (k[15] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(B, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: xe((ae) => Q(ne), ["stop"])
            }, {
              default: t(() => [
                e(oe, { size: "small" }, {
                  default: t(() => [...k[16] || (k[16] = [
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
          [Ge, se(c).items.value.length > 0 || !se(c).loading.value]
        ]),
        e(Y, {
          modelValue: i.value,
          "onUpdate:modelValue": k[8] || (k[8] = (ne) => i.value = ne),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(b, null, {
              default: t(() => [
                e(O, null, {
                  default: t(() => {
                    var ne;
                    return [
                      l(h((ne = $.value) != null && ne.id ? "Edit project" : "New project"), 1)
                    ];
                  }),
                  _: 1
                }),
                e(_e, null, {
                  default: t(() => [
                    e(de, {
                      ref_key: "formRef",
                      ref: C,
                      onSubmit: xe(te, ["prevent"])
                    }, {
                      default: t(() => {
                        var ne, ae;
                        return [
                          e(X, {
                            modelValue: S.value.name,
                            "onUpdate:modelValue": [
                              k[3] || (k[3] = (ye) => S.value.name = ye),
                              o
                            ],
                            label: "Name",
                            rules: [A.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          e(X, {
                            modelValue: S.value.pkey,
                            "onUpdate:modelValue": k[4] || (k[4] = (ye) => S.value.pkey = ye),
                            label: "Project key (pkey)",
                            rules: [A.required, A.pkey],
                            disabled: ((ne = $.value) == null ? void 0 : ne.nbSubscriptions) > 0,
                            hint: ((ae = $.value) == null ? void 0 : ae.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          e(X, {
                            modelValue: S.value.teamLeader,
                            "onUpdate:modelValue": k[5] || (k[5] = (ye) => S.value.teamLeader = ye),
                            label: "Team leader (user id)",
                            rules: [A.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(ie, {
                            modelValue: S.value.description,
                            "onUpdate:modelValue": k[6] || (k[6] = (ye) => S.value.description = ye),
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
                    e(ee),
                    e(B, {
                      variant: "text",
                      onClick: k[7] || (k[7] = (ne) => i.value = !1)
                    }, {
                      default: t(() => [...k[17] || (k[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(B, {
                      color: "primary",
                      variant: "elevated",
                      loading: M.value,
                      onClick: te
                    }, {
                      default: t(() => [...k[18] || (k[18] = [
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
        e(Y, {
          modelValue: E.value,
          "onUpdate:modelValue": k[11] || (k[11] = (ne) => E.value = ne),
          "max-width": "500"
        }, {
          default: t(() => [
            e(b, null, {
              default: t(() => [
                e(O, null, {
                  default: t(() => [...k[19] || (k[19] = [
                    l("Delete project", -1)
                  ])]),
                  _: 1
                }),
                e(_e, null, {
                  default: t(() => {
                    var ne;
                    return [
                      u("p", xt, [
                        k[20] || (k[20] = l(" Are you sure you want to delete ", -1)),
                        u("strong", null, h((ne = f.value) == null ? void 0 : ne.name), 1),
                        k[21] || (k[21] = l("? ", -1))
                      ]),
                      e(F, {
                        modelValue: N.value,
                        "onUpdate:modelValue": k[9] || (k[9] = (ae) => N.value = ae),
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
                    e(ee),
                    e(B, {
                      variant: "text",
                      onClick: k[10] || (k[10] = (ne) => E.value = !1)
                    }, {
                      default: t(() => [...k[22] || (k[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(B, {
                      color: "error",
                      variant: "elevated",
                      loading: p.value,
                      onClick: _
                    }, {
                      default: t(() => [...k[23] || (k[23] = [
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
}, Ct = /* @__PURE__ */ we(Vt, [["__scopeId", "data-v-6023d08b"]]), $t = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, St = { class: "text-h4" }, ht = { class: "text-h6 text-medium-emphasis" }, Ut = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, Pt = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, Nt = { key: 0 }, jt = {
  key: 0,
  class: "ml-1"
}, Tt = { key: 1 }, zt = {
  key: 0,
  class: "ml-1"
}, It = { key: 2 }, At = {
  key: 0,
  class: "ml-1"
}, Dt = { class: "d-flex align-center mb-2" }, Rt = { class: "mb-3" }, Lt = {
  __name: "ProjectDetailView",
  setup(d) {
    const U = Ae();
    Ue();
    const T = fe(), I = pe();
    Ze();
    const R = s(!1), c = s(null), D = ce(() => {
      var y;
      return ((y = c.value) == null ? void 0 : y.subscriptions) || [];
    }), P = s(null), j = s(!1), C = s({ name: "", pkey: "", teamLeader: "", description: "" }), i = s(!1), $ = s(!1), S = s(null), M = s(!1), E = s(!1), f = {
      required: (y) => !!y || "Required"
    }, p = [
      { title: "Service", key: "service", sortable: !1, width: "180px" },
      { title: "Tool", key: "tool", sortable: !1, width: "180px" },
      { title: "Node", key: "node", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function N(y) {
      if (!y) return "";
      const o = new Date(y);
      return isNaN(o.getTime()) ? "" : o.toISOString().slice(0, 16).replace("T", " ");
    }
    function G(y) {
      var Q, te, _;
      const o = ((_ = (te = (Q = y.node) == null ? void 0 : Q.refined) == null ? void 0 : te.refined) == null ? void 0 : _.id) || "", L = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let x = 0;
      for (const a of o) x += a.charCodeAt(0);
      return L[x % L.length];
    }
    function z(y) {
      var L, x, Q;
      const o = ((Q = (x = (L = y.node) == null ? void 0 : L.refined) == null ? void 0 : x.refined) == null ? void 0 : Q.id) || "";
      return o.includes(":scm:") ? "mdi-source-branch" : o.includes(":build:") ? "mdi-hammer-wrench" : o.includes(":bt") ? "mdi-bug" : o.includes(":km:") ? "mdi-book-open-variant" : o.includes(":vm") ? "mdi-server" : o.includes(":prov") ? "mdi-cloud" : o.includes(":id") ? "mdi-account-group" : o.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function A() {
      var L;
      R.value = !0;
      const y = U.params.id, o = await T.get(`rest/project/${y}`);
      c.value = o || null, R.value = !1, o && (C.value = {
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
      const { valid: y } = await P.value.validate();
      if (!y) return;
      i.value = !0;
      const o = {
        id: c.value.id,
        name: C.value.name,
        pkey: C.value.pkey,
        teamLeader: C.value.teamLeader,
        description: C.value.description
      };
      await T.put("rest/project", o), i.value = !1, j.value = !1, await A();
    }
    function r(y) {
      S.value = y, M.value = !1, $.value = !0;
    }
    async function v() {
      E.value = !0, await T.del(`rest/subscription/${S.value.id}/${M.value ? "true" : "false"}`), E.value = !1, $.value = !1, await A();
    }
    return ze(() => U.params.id, (y) => {
      y && A();
    }), me(A), (y, o) => {
      const L = n("v-skeleton-loader"), x = n("v-spacer"), Q = n("v-btn"), te = n("v-icon"), _ = n("v-card-text"), a = n("v-card"), k = n("v-chip"), ee = n("v-alert"), X = n("v-data-table"), B = n("v-card-title"), g = n("v-text-field"), H = n("v-textarea"), le = n("v-form"), W = n("v-card-actions"), oe = n("v-dialog"), re = n("v-checkbox");
      return m(), J("div", null, [
        R.value && !c.value ? (m(), q(L, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : K("", !0),
        c.value ? (m(), J(ve, { key: 1 }, [
          u("div", $t, [
            u("div", null, [
              u("h1", St, [
                l(h(c.value.name) + " ", 1),
                u("span", ht, "(" + h(c.value.pkey) + ")", 1)
              ]),
              c.value.description ? (m(), J("p", Ut, h(c.value.description), 1)) : K("", !0)
            ]),
            e(x),
            c.value.manageSubscriptions ? (m(), q(Q, {
              key: 0,
              color: "primary",
              "prepend-icon": "mdi-plus",
              to: `/home/project/${c.value.id}/subscription`
            }, {
              default: t(() => [...o[10] || (o[10] = [
                l(" Add subscription ", -1)
              ])]),
              _: 1
            }, 8, ["to"])) : K("", !0),
            e(Q, {
              variant: "outlined",
              "prepend-icon": "mdi-pencil",
              onClick: o[0] || (o[0] = (O) => j.value = !0)
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
              e(_, { class: "py-2" }, {
                default: t(() => [
                  u("div", Pt, [
                    c.value.teamLeader ? (m(), J("span", Nt, [
                      e(te, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[12] || (o[12] = [
                          l("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      o[13] || (o[13] = u("strong", null, "Manager:", -1)),
                      l(" " + h(se(Re)(c.value.teamLeader)) + " ", 1),
                      c.value.teamLeader.id ? (m(), J("span", jt, "(" + h(c.value.teamLeader.id) + ")", 1)) : K("", !0)
                    ])) : K("", !0),
                    c.value.createdDate ? (m(), J("span", Tt, [
                      e(te, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[14] || (o[14] = [
                          l("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      o[15] || (o[15] = u("strong", null, "Created:", -1)),
                      l(" " + h(N(c.value.createdDate)) + " ", 1),
                      c.value.createdBy ? (m(), J("span", zt, " by " + h(c.value.createdBy.id || c.value.createdBy), 1)) : K("", !0)
                    ])) : K("", !0),
                    c.value.lastModifiedDate ? (m(), J("span", It, [
                      e(te, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[16] || (o[16] = [
                          l("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      o[17] || (o[17] = u("strong", null, "Updated:", -1)),
                      l(" " + h(N(c.value.lastModifiedDate)) + " ", 1),
                      c.value.lastModifiedBy ? (m(), J("span", At, " by " + h(c.value.lastModifiedBy.id || c.value.lastModifiedBy), 1)) : K("", !0)
                    ])) : K("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          u("div", Dt, [
            o[18] || (o[18] = u("h2", { class: "text-h6" }, "Subscriptions", -1)),
            e(k, {
              class: "ml-2",
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(h(D.value.length), 1)
              ]),
              _: 1
            })
          ]),
          D.value.length === 0 ? (m(), q(ee, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: t(() => [...o[19] || (o[19] = [
              l(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (m(), q(X, {
            key: 1,
            headers: p,
            items: D.value,
            "item-value": "id",
            "items-per-page": -1,
            "hide-default-footer": "",
            density: "compact"
          }, {
            "item.service": t(({ item: O }) => [
              e(k, {
                size: "small",
                variant: "tonal",
                color: G(O)
              }, {
                default: t(() => {
                  var ie, de, _e;
                  return [
                    e(te, {
                      start: "",
                      size: "small"
                    }, {
                      default: t(() => [
                        l(h(z(O)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    l(" " + h(((_e = (de = (ie = O.node) == null ? void 0 : ie.refined) == null ? void 0 : de.refined) == null ? void 0 : _e.name) || "—"), 1)
                  ];
                }),
                _: 2
              }, 1032, ["color"])
            ]),
            "item.tool": t(({ item: O }) => {
              var ie, de;
              return [
                l(h(((de = (ie = O.node) == null ? void 0 : ie.refined) == null ? void 0 : de.name) || "—"), 1)
              ];
            }),
            "item.node": t(({ item: O }) => {
              var ie;
              return [
                u("code", null, h((ie = O.node) == null ? void 0 : ie.id), 1)
              ];
            }),
            "item.actions": t(({ item: O }) => [
              c.value.manageSubscriptions ? (m(), q(Q, {
                key: 0,
                icon: "",
                size: "small",
                variant: "text",
                color: "error",
                onClick: (ie) => r(O),
                title: "Unsubscribe"
              }, {
                default: t(() => [
                  e(te, { size: "small" }, {
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
          modelValue: j.value,
          "onUpdate:modelValue": o[6] || (o[6] = (O) => j.value = O),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(B, null, {
                  default: t(() => [...o[21] || (o[21] = [
                    l("Edit project", -1)
                  ])]),
                  _: 1
                }),
                e(_, null, {
                  default: t(() => [
                    e(le, {
                      ref_key: "formRef",
                      ref: P,
                      onSubmit: xe(V, ["prevent"])
                    }, {
                      default: t(() => {
                        var O;
                        return [
                          e(g, {
                            modelValue: C.value.name,
                            "onUpdate:modelValue": o[1] || (o[1] = (ie) => C.value.name = ie),
                            label: "Name",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(g, {
                            modelValue: C.value.pkey,
                            "onUpdate:modelValue": o[2] || (o[2] = (ie) => C.value.pkey = ie),
                            label: "Project key (pkey)",
                            rules: [f.required],
                            disabled: (((O = c.value) == null ? void 0 : O.nbSubscriptions) || D.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          e(g, {
                            modelValue: C.value.teamLeader,
                            "onUpdate:modelValue": o[3] || (o[3] = (ie) => C.value.teamLeader = ie),
                            label: "Team leader (user id)",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(H, {
                            modelValue: C.value.description,
                            "onUpdate:modelValue": o[4] || (o[4] = (ie) => C.value.description = ie),
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
                    e(Q, {
                      variant: "text",
                      onClick: o[5] || (o[5] = (O) => j.value = !1)
                    }, {
                      default: t(() => [...o[22] || (o[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Q, {
                      color: "primary",
                      variant: "elevated",
                      loading: i.value,
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
          modelValue: $.value,
          "onUpdate:modelValue": o[9] || (o[9] = (O) => $.value = O),
          "max-width": "480"
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(B, null, {
                  default: t(() => [...o[24] || (o[24] = [
                    l("Unsubscribe", -1)
                  ])]),
                  _: 1
                }),
                e(_, null, {
                  default: t(() => {
                    var O, ie;
                    return [
                      u("p", Rt, [
                        o[25] || (o[25] = l(" Remove subscription to ", -1)),
                        u("strong", null, h((ie = (O = S.value) == null ? void 0 : O.node) == null ? void 0 : ie.name), 1),
                        o[26] || (o[26] = l("? ", -1))
                      ]),
                      e(re, {
                        modelValue: M.value,
                        "onUpdate:modelValue": o[7] || (o[7] = (de) => M.value = de),
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
                    e(Q, {
                      variant: "text",
                      onClick: o[8] || (o[8] = (O) => $.value = !1)
                    }, {
                      default: t(() => [...o[27] || (o[27] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Q, {
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
}, Et = { class: "mb-3" }, Bt = { class: "code-sample" }, qt = {
  __name: "ManualView",
  setup(d) {
    const U = pe(), T = he(), I = "/", R = typeof window < "u" ? window.location.origin : "", c = ce(() => T.userName || "<you>");
    return me(() => {
      U.setTitle("Manual"), U.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (D, P) => {
      const j = n("v-icon"), C = n("v-card-title"), i = n("v-card-text"), $ = n("v-card"), S = n("v-list-item"), M = n("v-list"), E = n("v-col"), f = n("router-link");
      n("v-code-block");
      const p = n("v-row");
      return m(), J("div", null, [
        P[12] || (P[12] = u("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        e(p, null, {
          default: t(() => [
            e(E, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e($, {
                  variant: "tonal",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(C, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(j, null, {
                          default: t(() => [...P[0] || (P[0] = [
                            l("mdi-book-open-page-variant", -1)
                          ])]),
                          _: 1
                        }),
                        P[1] || (P[1] = l(" Getting started ", -1))
                      ]),
                      _: 1
                    }),
                    e(i, null, {
                      default: t(() => [...P[2] || (P[2] = [
                        u("p", { class: "mb-2" }, " Ligoj aggregates the tools your projects rely on (source control, bug tracking, continuous integration, knowledge base, cloud provisioning) behind a single dashboard and API. ", -1),
                        u("p", { class: "mb-0" }, " Create a project, attach subscriptions, and hand your team a single entry point for everything. ", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                e($, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(M, {
                      lines: "two",
                      density: "compact"
                    }, {
                      default: t(() => [
                        e(S, {
                          "prepend-icon": "mdi-folder-plus",
                          title: "Create a project",
                          subtitle: "Name, project key, manager — add subscriptions afterwards.",
                          to: "/home/project"
                        }),
                        e(S, {
                          "prepend-icon": "mdi-playlist-plus",
                          title: "Subscribe to a tool",
                          subtitle: "Pick a service, a tool, and a node for an existing or new instance.",
                          to: "/subscribe"
                        }),
                        e(S, {
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
                e($, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(C, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(j, null, {
                          default: t(() => [...P[3] || (P[3] = [
                            l("mdi-api", -1)
                          ])]),
                          _: 1
                        }),
                        P[4] || (P[4] = l(" Automation ", -1))
                      ]),
                      _: 1
                    }),
                    e(i, null, {
                      default: t(() => [
                        u("p", Et, [
                          P[7] || (P[7] = l(" Every screen is backed by a REST endpoint. Browse the full catalogue on the ", -1)),
                          e(f, { to: "/api" }, {
                            default: t(() => [...P[5] || (P[5] = [
                              l("API reference page", -1)
                            ])]),
                            _: 1
                          }),
                          P[8] || (P[8] = l(" (OpenAPI / Swagger UI), and generate an ", -1)),
                          e(f, { to: "/api/token" }, {
                            default: t(() => [...P[6] || (P[6] = [
                              l("API token", -1)
                            ])]),
                            _: 1
                          }),
                          P[9] || (P[9] = l(" to call it from scripts without exposing your password. ", -1))
                        ]),
                        K("", !0),
                        u("pre", Bt, 'curl "' + h(se(R)) + h(se(I)) + "rest/project?api-key=<token>&api-user=" + h(c.value) + '"', 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                e($, { variant: "outlined" }, {
                  default: t(() => [
                    e(C, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(j, null, {
                          default: t(() => [...P[10] || (P[10] = [
                            l("mdi-help-circle", -1)
                          ])]),
                          _: 1
                        }),
                        P[11] || (P[11] = l(" More resources ", -1))
                      ]),
                      _: 1
                    }),
                    e(M, {
                      lines: "one",
                      density: "compact"
                    }, {
                      default: t(() => [
                        e(S, {
                          "prepend-icon": "mdi-github",
                          title: "GitHub repository",
                          subtitle: "Source, issues, release notes",
                          href: "https://github.com/ligoj/ligoj",
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }),
                        e(S, {
                          "prepend-icon": "mdi-bug",
                          title: "Report an issue",
                          href: "https://github.com/ligoj/ligoj/issues",
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }),
                        e(S, {
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
}, Mt = /* @__PURE__ */ we(qt, [["__scopeId", "data-v-bfb1a017"]]), Ft = { class: "pa-4" }, Ot = {
  __name: "SystemView",
  setup(d) {
    const U = pe(), T = [
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
      U.setTitle("System"), U.setBreadcrumbs([{ title: "System" }]);
    }), (I, R) => {
      const c = n("v-list-item"), D = n("v-list");
      return m(), J("div", Ft, [
        R[0] || (R[0] = u("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        e(D, null, {
          default: t(() => [
            (m(), J(ve, null, ke(T, (P) => e(c, {
              key: P.to,
              to: P.to,
              "prepend-icon": P.icon,
              title: P.title,
              subtitle: P.subtitle
            }, null, 8, ["to", "prepend-icon", "title", "subtitle"])), 64))
          ]),
          _: 1
        })
      ]);
    };
  }
}, Gt = { class: "d-flex align-center mb-4" }, Ht = { class: "mb-3" }, Wt = { class: "d-flex align-center mb-1" }, Kt = { class: "text-caption" }, Jt = { class: "d-flex mt-1 text-caption text-medium-emphasis ga-3" }, Zt = {
  __name: "SystemInfoView",
  setup(d) {
    const U = fe(), T = pe(), I = he(), R = s(!1), c = s(null), D = s(null), P = s(""), j = s(""), C = s(""), i = Ve({
      used: 0,
      committedFree: 0,
      free: 0,
      max: 0,
      pctUsed: 0,
      pctCommittedFree: 0,
      pctFree: 0
    }), $ = Ve({ application: "", default: "", original: "" }), S = ce(() => p("JSESSIONID") || ""), M = ce(() => {
      const V = I.appSettings || {}, r = parseInt(V.buildTimestamp, 10);
      return {
        number: V.buildNumber ?? "",
        timestamp: Number.isNaN(r) ? V.buildTimestamp ?? "" : r,
        date: Number.isNaN(r) ? "" : new Date(r).toISOString().slice(0, 19).replace("T", " "),
        version: V.buildVersion ?? ""
      };
    }), E = ce(
      () => `Used: ${f(i.used)} · Committed-free: ${f(i.committedFree)} · Free: ${f(i.free)} / ${f(i.max)}`
    );
    function f(V) {
      if (V == null || isNaN(V)) return "—";
      const r = ["B", "KB", "MB", "GB", "TB"];
      let v = V, y = 0;
      for (; v >= 1024 && y < r.length - 1; )
        v /= 1024, y++;
      return `${v.toFixed(v < 10 && y > 0 ? 1 : 0)} ${r[y]}`;
    }
    function p(V) {
      const r = document.cookie.split(";");
      for (const v of r) {
        const [y, ...o] = v.trim().split("=");
        if (y === V) return decodeURIComponent(o.join("="));
      }
      return null;
    }
    async function N() {
      var r, v, y, o, L, x, Q, te, _, a, k, ee;
      R.value = !0, c.value = null;
      const V = await U.get("rest/system");
      if (V) {
        P.value = ((r = V.cpu) == null ? void 0 : r.total) ?? "", j.value = (v = V.date) != null && v.date ? new Date(V.date.date).toISOString() : "", C.value = ((y = V.date) == null ? void 0 : y.date) ?? "", $.application = ((o = V.date) == null ? void 0 : o.timeZone) ?? "", $.default = ((L = V.date) == null ? void 0 : L.defaultTimeZone) ?? "", $.original = ((x = V.date) == null ? void 0 : x.originalDefaultTimeZone) ?? "";
        const X = ((Q = V.memory) == null ? void 0 : Q.maxMemory) || (((te = V.memory) == null ? void 0 : te.totalMemory) || 0) + 1e6, B = (((_ = V.memory) == null ? void 0 : _.totalMemory) ?? 0) - (((a = V.memory) == null ? void 0 : a.freeMemory) ?? 0), g = ((k = V.memory) == null ? void 0 : k.freeMemory) ?? 0, H = Math.max(0, X - (((ee = V.memory) == null ? void 0 : ee.totalMemory) ?? 0));
        i.used = B, i.committedFree = g, i.free = H, i.max = X, i.pctUsed = G(B / X * 100), i.pctCommittedFree = G(g / X * 100), i.pctFree = G(100 - i.pctUsed - i.pctCommittedFree);
      }
      R.value = !1;
    }
    function G(V) {
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
      T.setTitle("System information"), T.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Information" }]), N();
    }), (V, r) => {
      const v = n("v-spacer"), y = n("v-btn"), o = n("v-alert"), L = n("v-icon"), x = n("v-card-title"), Q = n("v-progress-linear"), te = n("v-tooltip"), _ = n("v-text-field"), a = n("v-col"), k = n("v-row"), ee = n("v-card-text"), X = n("v-card");
      return m(), J("div", null, [
        u("div", Gt, [
          r[8] || (r[8] = u("h1", { class: "text-h4" }, "System information", -1)),
          e(v),
          e(y, {
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
        c.value ? (m(), q(o, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(c.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(k, null, {
          default: t(() => [
            e(a, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(X, {
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
                    e(ee, null, {
                      default: t(() => [
                        u("div", Ht, [
                          u("div", Wt, [
                            r[11] || (r[11] = u("span", { class: "text-body-2 text-medium-emphasis flex-grow-1" }, "Memory", -1)),
                            u("span", Kt, h(f(i.used)) + " / " + h(f(i.max)), 1)
                          ]),
                          e(te, {
                            text: E.value,
                            location: "top"
                          }, {
                            activator: t(({ props: B }) => [
                              u("div", He(We(B)), [
                                e(Q, {
                                  "model-value": i.pctUsed,
                                  "buffer-value": i.pctUsed + i.pctCommittedFree,
                                  color: "error",
                                  "buffer-color": "warning",
                                  "buffer-opacity": "0.8",
                                  "bg-color": "success",
                                  "bg-opacity": "0.35",
                                  height: "14",
                                  rounded: ""
                                }, null, 8, ["model-value", "buffer-value"])
                              ], 16)
                            ]),
                            _: 1
                          }, 8, ["text"]),
                          u("div", Jt, [
                            u("span", null, [
                              e(L, {
                                size: "x-small",
                                color: "error"
                              }, {
                                default: t(() => [...r[12] || (r[12] = [
                                  l("mdi-circle", -1)
                                ])]),
                                _: 1
                              }),
                              l(" Used " + h(i.pctUsed) + "%", 1)
                            ]),
                            u("span", null, [
                              e(L, {
                                size: "x-small",
                                color: "warning"
                              }, {
                                default: t(() => [...r[13] || (r[13] = [
                                  l("mdi-circle", -1)
                                ])]),
                                _: 1
                              }),
                              l(" Committed free " + h(i.pctCommittedFree) + "%", 1)
                            ]),
                            u("span", null, [
                              e(L, {
                                size: "x-small",
                                color: "success"
                              }, {
                                default: t(() => [...r[14] || (r[14] = [
                                  l("mdi-circle", -1)
                                ])]),
                                _: 1
                              }),
                              l(" Free " + h(i.pctFree) + "%", 1)
                            ])
                          ])
                        ]),
                        e(_, {
                          "model-value": P.value,
                          label: "CPU load (total)",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2"
                        }, null, 8, ["model-value"]),
                        e(k, { dense: "" }, {
                          default: t(() => [
                            e(a, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(_, {
                                  "model-value": j.value,
                                  label: "Local date",
                                  readonly: "",
                                  density: "compact",
                                  variant: "outlined"
                                }, null, 8, ["model-value"])
                              ]),
                              _: 1
                            }),
                            e(a, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(_, {
                                  "model-value": C.value,
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
            e(a, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(X, {
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
                    e(ee, null, {
                      default: t(() => [
                        e(_, {
                          modelValue: $.application,
                          "onUpdate:modelValue": r[0] || (r[0] = (B) => $.application = B),
                          label: "Application",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: D.value === "application",
                          onBlur: r[1] || (r[1] = (B) => z("application", $.application)),
                          onKeyup: r[2] || (r[2] = Se((B) => z("application", $.application), ["enter"]))
                        }, null, 8, ["modelValue", "loading"]),
                        e(_, {
                          modelValue: $.default,
                          "onUpdate:modelValue": r[3] || (r[3] = (B) => $.default = B),
                          label: "System",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: D.value === "default",
                          onBlur: r[4] || (r[4] = (B) => z("default", $.default)),
                          onKeyup: r[5] || (r[5] = Se((B) => z("default", $.default), ["enter"]))
                        }, null, 8, ["modelValue", "loading"]),
                        e(_, {
                          "model-value": $.original,
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
            e(a, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(X, {
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
                    e(ee, null, {
                      default: t(() => [
                        e(_, {
                          "model-value": S.value,
                          label: "Identifier",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          "append-inner-icon": "mdi-content-copy",
                          "onClick:appendInner": r[6] || (r[6] = (B) => A(S.value))
                        }, null, 8, ["model-value"]),
                        e(_, {
                          "model-value": se(I).userName,
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
            e(a, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(X, {
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
                    e(ee, null, {
                      default: t(() => [
                        e(_, {
                          "model-value": M.value.number,
                          label: "Number",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2"
                        }, null, 8, ["model-value"]),
                        e(k, { dense: "" }, {
                          default: t(() => [
                            e(a, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(_, {
                                  "model-value": M.value.timestamp,
                                  label: "Timestamp",
                                  readonly: "",
                                  density: "compact",
                                  variant: "outlined"
                                }, null, 8, ["model-value"])
                              ]),
                              _: 1
                            }),
                            e(a, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(_, {
                                  "model-value": M.value.date,
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
                        e(_, {
                          "model-value": M.value.version,
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
}, Xt = { class: "system-config-page" }, Yt = { class: "d-flex align-center mb-4" }, Qt = {
  key: 0,
  class: "text-medium-emphasis"
}, el = ["title"], tl = {
  __name: "SystemConfigurationView",
  setup(d) {
    const U = fe(), T = pe(), I = s([]), R = s(!1), c = s(null), D = s(""), P = s(""), j = s(!1), C = s(null), i = s(!1), $ = s(null), S = s({ name: "", value: "", system: !1, secured: !1 }), M = s(!1), E = s(!1), f = s(null), p = s(!1), N = { required: (_) => _ !== "" && _ != null || "Required" }, G = [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Value", key: "value", sortable: !1 },
      { title: "", key: "secured", sortable: !1, width: "32px", align: "center" },
      { title: "", key: "source", sortable: !1, width: "56px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "88px", align: "end" }
    ], z = {
      systemEnvironment: "mdi-desktop-classic",
      systemProperties: "mdi-language-java",
      applicationConfig: "mdi-file-code",
      database: "mdi-database",
      classpath: "mdi-file-code-outline"
    };
    function A(_) {
      if (!_) return "mdi-help-circle-outline";
      const a = _.split(":")[0];
      return z[_.includes("classpath") ? "classpath" : a] || "mdi-help-circle-outline";
    }
    function V(_) {
      if (!_.source) return "";
      const a = `Source: ${_.source}`;
      return _.overridden ? `${a} — overridden` : a;
    }
    async function r() {
      R.value = !0, c.value = null;
      const _ = await U.get("rest/system/configuration");
      I.value = Array.isArray(_) ? _ : (_ == null ? void 0 : _.data) || [], I.value.sort((a, k) => String(a.name).localeCompare(String(k.name))), R.value = !1;
    }
    async function v() {
      if (D.value) {
        j.value = !0;
        try {
          const _ = await fetch("/rest/system/security/crypto", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "text/plain" },
            body: D.value
          });
          P.value = _.ok ? await _.text() : "";
        } catch {
          P.value = "";
        } finally {
          j.value = !1;
        }
      }
    }
    async function y(_) {
      try {
        await navigator.clipboard.writeText(_ || "");
      } catch {
      }
    }
    function o() {
      $.value = null, S.value = { name: "", value: "", system: !1, secured: !1 }, i.value = !0;
    }
    function L(_) {
      $.value = _, S.value = {
        name: _.name,
        value: _.secured ? "" : _.value ?? "",
        system: !1,
        secured: !!_.secured
      }, i.value = !0;
    }
    function x(_) {
      f.value = _, E.value = !0;
    }
    async function Q() {
      var k;
      const { valid: _ } = await C.value.validate();
      if (!_) return;
      M.value = !0;
      const a = {
        name: S.value.name,
        oldName: ((k = $.value) == null ? void 0 : k.name) || "",
        system: !!S.value.system,
        secured: !!S.value.secured,
        value: S.value.value
      };
      await U.post("rest/system/configuration", a), M.value = !1, i.value = !1, r();
    }
    async function te() {
      p.value = !0, await U.del(`rest/system/configuration/${encodeURIComponent(f.value.name)}/true`), p.value = !1, E.value = !1, r();
    }
    return me(() => {
      T.setTitle("System configuration"), T.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Configuration" }]), r();
    }), (_, a) => {
      const k = n("v-spacer"), ee = n("v-btn"), X = n("v-icon"), B = n("v-card-title"), g = n("v-text-field"), H = n("v-col"), le = n("v-row"), W = n("v-card-text"), oe = n("v-card"), re = n("v-alert"), O = n("v-tooltip"), ie = n("v-data-table"), de = n("v-textarea"), _e = n("v-checkbox"), w = n("v-form"), b = n("v-card-actions"), Y = n("v-dialog");
      return m(), J("div", Xt, [
        u("div", Yt, [
          a[12] || (a[12] = u("h1", { class: "text-h4" }, "System configuration", -1)),
          e(k),
          e(ee, {
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
          e(ee, {
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
            e(B, { class: "text-subtitle-1 d-flex align-center ga-2" }, {
              default: t(() => [
                e(X, null, {
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
                        e(g, {
                          modelValue: D.value,
                          "onUpdate:modelValue": a[0] || (a[0] = (F) => D.value = F),
                          label: "Text to encrypt",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "",
                          onKeyup: Se(v, ["enter"])
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    e(H, { cols: "auto" }, {
                      default: t(() => [
                        e(ee, {
                          color: "primary",
                          "prepend-icon": "mdi-lock",
                          loading: j.value,
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
                        e(g, {
                          "model-value": P.value,
                          label: "Result",
                          variant: "outlined",
                          density: "compact",
                          readonly: "",
                          "hide-details": "",
                          "append-inner-icon": "mdi-content-copy",
                          "onClick:appendInner": a[1] || (a[1] = (F) => y(P.value))
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
        c.value ? (m(), q(re, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(c.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(ie, {
          headers: G,
          items: I.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact",
          class: "configuration-table"
        }, {
          "item.value": t(({ item: F }) => [
            F.secured ? (m(), J("span", Qt, "•••••")) : (m(), J("code", {
              key: 1,
              class: "config-value",
              title: F.value
            }, h(F.value), 9, el))
          ]),
          "item.secured": t(({ item: F }) => [
            F.secured ? (m(), q(X, {
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
          "item.source": t(({ item: F }) => [
            F.source ? (m(), q(O, {
              key: 0,
              text: V(F),
              location: "top"
            }, {
              activator: t(({ props: ne }) => [
                e(X, Te(ne, {
                  size: "small",
                  color: F.overridden ? "warning" : void 0
                }), {
                  default: t(() => [
                    l(h(A(F.source)), 1)
                  ]),
                  _: 2
                }, 1040, ["color"])
              ]),
              _: 2
            }, 1032, ["text"])) : K("", !0),
            F.overridden ? (m(), q(X, {
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
          "item.actions": t(({ item: F }) => [
            e(ee, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (ne) => L(F),
              title: "Edit"
            }, {
              default: t(() => [
                e(X, { size: "small" }, {
                  default: t(() => [...a[18] || (a[18] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(ee, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (ne) => x(F),
              title: "Delete"
            }, {
              default: t(() => [
                e(X, { size: "small" }, {
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
        e(Y, {
          modelValue: i.value,
          "onUpdate:modelValue": a[7] || (a[7] = (F) => i.value = F),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(B, null, {
                  default: t(() => [
                    l(h($.value ? "Edit configuration" : "New configuration"), 1)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(w, {
                      ref_key: "formRef",
                      ref: C,
                      onSubmit: xe(Q, ["prevent"])
                    }, {
                      default: t(() => [
                        e(g, {
                          modelValue: S.value.name,
                          "onUpdate:modelValue": a[2] || (a[2] = (F) => S.value.name = F),
                          label: "Name",
                          rules: [N.required],
                          variant: "outlined",
                          density: "compact",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(de, {
                          modelValue: S.value.value,
                          "onUpdate:modelValue": a[3] || (a[3] = (F) => S.value.value = F),
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
                          modelValue: S.value.system,
                          "onUpdate:modelValue": a[4] || (a[4] = (F) => S.value.system = F),
                          label: "Override system environment / properties",
                          density: "compact",
                          "hide-details": ""
                        }, null, 8, ["modelValue"]),
                        e(_e, {
                          modelValue: S.value.secured,
                          "onUpdate:modelValue": a[5] || (a[5] = (F) => S.value.secured = F),
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
                e(b, null, {
                  default: t(() => [
                    e(k),
                    e(ee, {
                      variant: "text",
                      onClick: a[6] || (a[6] = (F) => i.value = !1)
                    }, {
                      default: t(() => [...a[20] || (a[20] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(ee, {
                      color: "primary",
                      variant: "elevated",
                      loading: M.value,
                      onClick: Q
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
        e(Y, {
          modelValue: E.value,
          "onUpdate:modelValue": a[9] || (a[9] = (F) => E.value = F),
          "max-width": "440"
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(B, null, {
                  default: t(() => [...a[22] || (a[22] = [
                    l("Delete configuration", -1)
                  ])]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => {
                    var F;
                    return [
                      a[23] || (a[23] = l(" Remove key ", -1)),
                      u("code", null, h((F = f.value) == null ? void 0 : F.name), 1),
                      a[24] || (a[24] = l("? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(b, null, {
                  default: t(() => [
                    e(k),
                    e(ee, {
                      variant: "text",
                      onClick: a[8] || (a[8] = (F) => E.value = !1)
                    }, {
                      default: t(() => [...a[25] || (a[25] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(ee, {
                      color: "error",
                      variant: "elevated",
                      loading: p.value,
                      onClick: te
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
}, ll = /* @__PURE__ */ we(tl, [["__scopeId", "data-v-5a0b4150"]]), nl = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, al = {
  __name: "SystemUserView",
  setup(d) {
    const U = fe(), T = pe(), I = Ie("system/user/roles", { defaultSort: "login" }), R = s(25);
    let c = null, D = {};
    const P = s([]), j = s(null), C = s(!1), i = s(null), $ = s({ login: "", roles: [] }), S = s(!1), M = s(!1), E = s(null), f = s(!1), p = {
      required: (L) => !!L || "Required",
      requiredArray: (L) => Array.isArray(L) && L.length > 0 || "Pick at least one role"
    }, N = [
      { title: "Login", key: "login", sortable: !0, width: "220px" },
      { title: "Roles", key: "roles", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    function G(L) {
      D = L, I.load(L);
    }
    function z() {
      clearTimeout(c), c = setTimeout(
        () => I.load({ page: 1, itemsPerPage: R.value, sortBy: D.sortBy }),
        300
      );
    }
    async function A() {
      const L = await U.get("rest/system/security/role");
      Array.isArray(L) ? P.value = L : Array.isArray(L == null ? void 0 : L.data) && (P.value = L.data);
    }
    function V() {
      i.value = null, $.value = { login: "", roles: [] }, C.value = !0;
    }
    function r(L) {
      i.value = L, $.value = {
        login: L.login,
        roles: (L.roles || []).map((x) => x.id)
      }, C.value = !0;
    }
    function v(L) {
      E.value = L, M.value = !0;
    }
    async function y() {
      const { valid: L } = await j.value.validate();
      if (!L) return;
      S.value = !0;
      const x = { login: $.value.login, roles: $.value.roles }, Q = i.value ? "put" : "post";
      await U[Q]("rest/system/user", x), S.value = !1, C.value = !1, I.load(D);
    }
    async function o() {
      f.value = !0, await U.del(`rest/system/user/${encodeURIComponent(E.value.login)}`), f.value = !1, M.value = !1, I.load(D);
    }
    return me(() => {
      T.setTitle("System users"), T.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]), A();
    }), (L, x) => {
      const Q = n("v-spacer"), te = n("v-text-field"), _ = n("v-btn"), a = n("v-alert"), k = n("v-chip"), ee = n("v-icon"), X = n("v-data-table-server"), B = n("v-card-title"), g = n("v-autocomplete"), H = n("v-form"), le = n("v-card-text"), W = n("v-card-actions"), oe = n("v-card"), re = n("v-dialog");
      return m(), J("div", null, [
        u("div", nl, [
          x[9] || (x[9] = u("h1", { class: "text-h4" }, "System users", -1)),
          e(Q),
          e(te, {
            modelValue: se(I).search.value,
            "onUpdate:modelValue": [
              x[0] || (x[0] = (O) => se(I).search.value = O),
              z
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(_, {
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
        se(I).error.value ? (m(), q(a, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(se(I).error.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(X, {
          headers: N,
          items: se(I).items.value,
          "items-length": se(I).totalItems.value,
          loading: se(I).loading.value,
          "items-per-page": R.value,
          "onUpdate:itemsPerPage": x[1] || (x[1] = (O) => R.value = O),
          "item-value": "login",
          hover: "",
          "onUpdate:options": G
        }, {
          "item.roles": t(({ item: O }) => [
            (m(!0), J(ve, null, ke(O.roles || [], (ie) => (m(), q(k, {
              key: ie.id,
              size: "x-small",
              variant: "tonal",
              class: "mr-1"
            }, {
              default: t(() => [
                l(h(ie.name), 1)
              ]),
              _: 2
            }, 1024))), 128))
          ]),
          "item.actions": t(({ item: O }) => [
            e(_, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (ie) => r(O)
            }, {
              default: t(() => [
                e(ee, { size: "small" }, {
                  default: t(() => [...x[10] || (x[10] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(_, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (ie) => v(O)
            }, {
              default: t(() => [
                e(ee, { size: "small" }, {
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
          modelValue: C.value,
          "onUpdate:modelValue": x[5] || (x[5] = (O) => C.value = O),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(B, null, {
                  default: t(() => [
                    l(h(i.value ? "Edit system user" : "New system user"), 1)
                  ]),
                  _: 1
                }),
                e(le, null, {
                  default: t(() => [
                    e(H, {
                      ref_key: "formRef",
                      ref: j,
                      onSubmit: xe(y, ["prevent"])
                    }, {
                      default: t(() => [
                        e(te, {
                          modelValue: $.value.login,
                          "onUpdate:modelValue": x[2] || (x[2] = (O) => $.value.login = O),
                          label: "Login",
                          rules: [p.required],
                          disabled: !!i.value,
                          variant: "outlined",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules", "disabled"]),
                        e(g, {
                          modelValue: $.value.roles,
                          "onUpdate:modelValue": x[3] || (x[3] = (O) => $.value.roles = O),
                          label: "Roles",
                          items: P.value,
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
                    e(Q),
                    e(_, {
                      variant: "text",
                      onClick: x[4] || (x[4] = (O) => C.value = !1)
                    }, {
                      default: t(() => [...x[12] || (x[12] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(_, {
                      color: "primary",
                      variant: "elevated",
                      loading: S.value,
                      onClick: y
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
          modelValue: M.value,
          "onUpdate:modelValue": x[7] || (x[7] = (O) => M.value = O),
          "max-width": "420"
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(B, null, {
                  default: t(() => [...x[14] || (x[14] = [
                    l("Delete system user", -1)
                  ])]),
                  _: 1
                }),
                e(le, null, {
                  default: t(() => {
                    var O;
                    return [
                      x[15] || (x[15] = l("Remove ", -1)),
                      u("strong", null, h((O = E.value) == null ? void 0 : O.login), 1),
                      x[16] || (x[16] = l(" from system accounts?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(Q),
                    e(_, {
                      variant: "text",
                      onClick: x[6] || (x[6] = (O) => M.value = !1)
                    }, {
                      default: t(() => [...x[17] || (x[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(_, {
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
}, ol = /* @__PURE__ */ we(al, [["__scopeId", "data-v-3bd83da2"]]), il = { class: "d-flex align-center mb-4" }, sl = {
  __name: "SystemRoleView",
  setup(d) {
    const U = fe(), T = pe(), I = s([]), R = s(!1), c = s(null), D = s(null), P = s(!1), j = s(null), C = s({ name: "", apiPatterns: [], uiPatterns: [] }), i = s(!1), $ = s(!1), S = s(null), M = s(!1), E = { required: (r) => !!r || "Required" }, f = [
      { title: "Name", key: "name", sortable: !0, width: "180px" },
      { title: "API patterns", key: "authApi", sortable: !1 },
      { title: "UI patterns", key: "authUi", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    async function p() {
      R.value = !0, c.value = null;
      const r = await U.get("rest/system/security/role/withAuth"), v = (r == null ? void 0 : r.data) || r || [];
      for (const y of v)
        y["authorizations-api"] = (y.authorizations || []).filter((o) => o.type === "api"), y["authorizations-ui"] = (y.authorizations || []).filter((o) => o.type === "ui");
      I.value = v, R.value = !1;
    }
    function N() {
      j.value = null, C.value = { name: "", apiPatterns: [], uiPatterns: [] }, P.value = !0;
    }
    function G(r) {
      j.value = r, C.value = {
        name: r.name,
        apiPatterns: (r["authorizations-api"] || []).map((v) => v.pattern),
        uiPatterns: (r["authorizations-ui"] || []).map((v) => v.pattern)
      }, P.value = !0;
    }
    function z(r) {
      S.value = r, $.value = !0;
    }
    async function A() {
      var o;
      const { valid: r } = await D.value.validate();
      if (!r) return;
      i.value = !0;
      const v = {
        id: (o = j.value) == null ? void 0 : o.id,
        name: C.value.name,
        authorizations: [
          ...C.value.apiPatterns.map((L) => ({ pattern: L, type: "api" })),
          ...C.value.uiPatterns.map((L) => ({ pattern: L, type: "ui" }))
        ]
      }, y = j.value ? "put" : "post";
      await U[y]("rest/system/security/role", v), i.value = !1, P.value = !1, p();
    }
    async function V() {
      M.value = !0, await U.del(`rest/system/security/role/${S.value.id}`), M.value = !1, $.value = !1, p();
    }
    return me(() => {
      T.setTitle("Roles"), T.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]), p();
    }), (r, v) => {
      const y = n("v-spacer"), o = n("v-btn"), L = n("v-alert"), x = n("v-icon"), Q = n("v-data-table"), te = n("v-card-title"), _ = n("v-text-field"), a = n("v-combobox"), k = n("v-form"), ee = n("v-card-text"), X = n("v-card-actions"), B = n("v-card"), g = n("v-dialog");
      return m(), J("div", null, [
        u("div", il, [
          v[8] || (v[8] = u("h1", { class: "text-h4" }, "Roles", -1)),
          e(y),
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
        c.value ? (m(), q(L, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(c.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(Q, {
          headers: f,
          items: I.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.authApi": t(({ item: H }) => [
            (m(!0), J(ve, null, ke(H["authorizations-api"], (le) => (m(), J("code", {
              key: le.id || le.pattern,
              class: "auth-token"
            }, h(le.pattern), 1))), 128))
          ]),
          "item.authUi": t(({ item: H }) => [
            (m(!0), J(ve, null, ke(H["authorizations-ui"], (le) => (m(), J("code", {
              key: le.id || le.pattern,
              class: "auth-token"
            }, h(le.pattern), 1))), 128))
          ]),
          "item.actions": t(({ item: H }) => [
            e(o, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (le) => G(H)
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
        e(g, {
          modelValue: P.value,
          "onUpdate:modelValue": v[4] || (v[4] = (H) => P.value = H),
          "max-width": "640",
          persistent: ""
        }, {
          default: t(() => [
            e(B, null, {
              default: t(() => [
                e(te, null, {
                  default: t(() => [
                    l(h(j.value ? "Edit role" : "New role"), 1)
                  ]),
                  _: 1
                }),
                e(ee, null, {
                  default: t(() => [
                    e(k, {
                      ref_key: "formRef",
                      ref: D,
                      onSubmit: xe(A, ["prevent"])
                    }, {
                      default: t(() => [
                        e(_, {
                          modelValue: C.value.name,
                          "onUpdate:modelValue": v[0] || (v[0] = (H) => C.value.name = H),
                          label: "Name",
                          rules: [E.required],
                          variant: "outlined",
                          class: "mb-4",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(a, {
                          modelValue: C.value.apiPatterns,
                          "onUpdate:modelValue": v[1] || (v[1] = (H) => C.value.apiPatterns = H),
                          label: "API authorization patterns (regex)",
                          items: C.value.apiPatterns,
                          chips: "",
                          "closable-chips": "",
                          multiple: "",
                          variant: "outlined",
                          hint: "Press Enter after each pattern",
                          "persistent-hint": "",
                          class: "mb-4"
                        }, null, 8, ["modelValue", "items"]),
                        e(a, {
                          modelValue: C.value.uiPatterns,
                          "onUpdate:modelValue": v[2] || (v[2] = (H) => C.value.uiPatterns = H),
                          label: "UI authorization patterns (regex)",
                          items: C.value.uiPatterns,
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
                e(X, null, {
                  default: t(() => [
                    e(y),
                    e(o, {
                      variant: "text",
                      onClick: v[3] || (v[3] = (H) => P.value = !1)
                    }, {
                      default: t(() => [...v[11] || (v[11] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(o, {
                      color: "primary",
                      variant: "elevated",
                      loading: i.value,
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
        e(g, {
          modelValue: $.value,
          "onUpdate:modelValue": v[6] || (v[6] = (H) => $.value = H),
          "max-width": "420"
        }, {
          default: t(() => [
            e(B, null, {
              default: t(() => [
                e(te, null, {
                  default: t(() => [...v[13] || (v[13] = [
                    l("Delete role", -1)
                  ])]),
                  _: 1
                }),
                e(ee, null, {
                  default: t(() => {
                    var H;
                    return [
                      v[14] || (v[14] = l("Delete role ", -1)),
                      u("strong", null, h((H = S.value) == null ? void 0 : H.name), 1),
                      v[15] || (v[15] = l("?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(X, null, {
                  default: t(() => [
                    e(y),
                    e(o, {
                      variant: "text",
                      onClick: v[5] || (v[5] = (H) => $.value = !1)
                    }, {
                      default: t(() => [...v[16] || (v[16] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(o, {
                      color: "error",
                      variant: "elevated",
                      loading: M.value,
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
}, rl = /* @__PURE__ */ we(sl, [["__scopeId", "data-v-e3ba71a8"]]), ul = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, dl = { key: 0 }, cl = { key: 0 }, ml = {
  __name: "SystemPluginView",
  setup(d) {
    const U = fe(), T = pe(), I = [
      { id: "central", label: "Maven Central" },
      { id: "nexus", label: "OSSRH Nexus" }
    ], R = s("central"), c = s([]), D = s(!1), P = s(null), j = s(!1), C = s(!1), i = s(!1), $ = s(""), S = s(!1), M = s(!1), E = [
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
      const y = (L = (o = v.plugin) == null ? void 0 : o.type) == null ? void 0 : L.toLowerCase();
      return y ? y === "feature" ? "mdi-wrench" : y === "service" ? "mdi-puzzle" : y === "tool" ? "mdi-hammer-wrench" : "mdi-puzzle" : "mdi-link-off";
    }
    async function p() {
      D.value = !0, P.value = null;
      const v = await U.get(`rest/system/plugin?repository=${R.value}`);
      c.value = Array.isArray(v) ? v : (v == null ? void 0 : v.data) || [], D.value = !1;
    }
    async function N() {
      j.value = !0, await U.put(`rest/system/plugin/cache?repository=${R.value}`), j.value = !1, p();
    }
    async function G() {
      C.value = !0, await U.put("rest/system/plugin/restart"), C.value = !1;
    }
    async function z(v, y = !1) {
      M.value = !0;
      const o = `repository=${R.value}&javadoc=${y ? !1 : S.value}`;
      await U.post(`rest/system/plugin/${encodeURIComponent(v)}?${o}`), M.value = !1, i.value = !1, $.value = "", S.value = !1, p();
    }
    function A() {
      $.value && z($.value.trim());
    }
    async function V(v) {
      await U.del(`rest/system/plugin/${v.plugin.artifact}/${v.latestLocalVersion}`), p();
    }
    async function r(v) {
      confirm(`Delete plug-in ${v}?`) && (await U.del(`rest/system/plugin/${v}`), p());
    }
    return me(() => {
      T.setTitle("Plug-ins"), T.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plug-ins" }]), p();
    }), (v, y) => {
      const o = n("v-spacer"), L = n("v-select"), x = n("v-btn"), Q = n("v-alert"), te = n("v-icon"), _ = n("v-chip"), a = n("v-data-table"), k = n("v-card-title"), ee = n("v-text-field"), X = n("v-checkbox"), B = n("v-card-text"), g = n("v-card-actions"), H = n("v-card"), le = n("v-dialog");
      return m(), J("div", null, [
        u("div", ul, [
          y[9] || (y[9] = u("h1", { class: "text-h4" }, "Plugins", -1)),
          e(o),
          e(L, {
            modelValue: R.value,
            "onUpdate:modelValue": [
              y[0] || (y[0] = (W) => R.value = W),
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
            loading: j.value
          }, {
            default: t(() => [...y[6] || (y[6] = [
              l(" Check versions ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(x, {
            color: "error",
            variant: "outlined",
            "prepend-icon": "mdi-restart",
            onClick: G,
            loading: C.value
          }, {
            default: t(() => [...y[7] || (y[7] = [
              l(" Restart ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(x, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: y[1] || (y[1] = (W) => i.value = !0)
          }, {
            default: t(() => [...y[8] || (y[8] = [
              l("Install", -1)
            ])]),
            _: 1
          })
        ]),
        P.value ? (m(), q(Q, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(P.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(a, {
          headers: E,
          items: c.value,
          loading: D.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.type": t(({ item: W }) => {
            var oe;
            return [
              e(te, {
                size: "small",
                title: (oe = W.plugin) == null ? void 0 : oe.type
              }, {
                default: t(() => [
                  l(h(f(W)), 1)
                ]),
                _: 2
              }, 1032, ["title"])
            ];
          }),
          "item.version": t(({ item: W }) => {
            var oe;
            return [
              u("span", null, h(((oe = W.plugin) == null ? void 0 : oe.version) || "—"), 1),
              W.latestLocalVersion ? (m(), q(_, {
                key: 0,
                size: "x-small",
                color: "primary",
                class: "ml-1",
                closable: "",
                "onClick:close": (re) => V(W),
                title: "Cancel local install"
              }, {
                default: t(() => [
                  l(h(W.latestLocalVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick:close"])) : K("", !0),
              W.newVersion && W.newVersion !== W.latestLocalVersion ? (m(), q(_, {
                key: 1,
                size: "x-small",
                color: "success",
                class: "ml-1",
                onClick: (re) => z(W.plugin.artifact, !0),
                title: "Upgrade available — click to install"
              }, {
                default: t(() => [
                  e(te, {
                    start: "",
                    size: "x-small"
                  }, {
                    default: t(() => [...y[10] || (y[10] = [
                      l("mdi-arrow-up", -1)
                    ])]),
                    _: 1
                  }),
                  l(h(W.newVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : K("", !0)
            ];
          }),
          "item.nodes": t(({ item: W }) => {
            var oe, re;
            return [
              ((re = (oe = W.plugin) == null ? void 0 : oe.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (m(), J("span", dl, h(W.nodes ?? 0), 1)) : K("", !0)
            ];
          }),
          "item.subscriptions": t(({ item: W }) => {
            var oe, re;
            return [
              ((re = (oe = W.plugin) == null ? void 0 : oe.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (m(), J("span", cl, h(W.subscriptions ?? 0), 1)) : K("", !0)
            ];
          }),
          "item.actions": t(({ item: W }) => [
            W.deleted ? (m(), q(te, {
              key: 0,
              size: "small",
              color: "warning",
              title: "Deletion scheduled"
            }, {
              default: t(() => [...y[11] || (y[11] = [
                l("mdi-cancel", -1)
              ])]),
              _: 1
            })) : (m(), q(x, {
              key: 1,
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (oe) => r(W.plugin.artifact),
              title: "Delete plug-in"
            }, {
              default: t(() => [
                e(te, { size: "small" }, {
                  default: t(() => [...y[12] || (y[12] = [
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
          modelValue: i.value,
          "onUpdate:modelValue": y[5] || (y[5] = (W) => i.value = W),
          "max-width": "520"
        }, {
          default: t(() => [
            e(H, null, {
              default: t(() => [
                e(k, null, {
                  default: t(() => [...y[13] || (y[13] = [
                    l("Install plug-in", -1)
                  ])]),
                  _: 1
                }),
                e(B, null, {
                  default: t(() => [
                    e(ee, {
                      modelValue: $.value,
                      "onUpdate:modelValue": y[2] || (y[2] = (W) => $.value = W),
                      label: "Artifact id (e.g. plugin-prov-aws)",
                      variant: "outlined",
                      hint: `Repository: ${R.value}`,
                      "persistent-hint": "",
                      class: "mb-2",
                      autofocus: ""
                    }, null, 8, ["modelValue", "hint"]),
                    e(X, {
                      modelValue: S.value,
                      "onUpdate:modelValue": y[3] || (y[3] = (W) => S.value = W),
                      label: "Install Javadoc bundle",
                      density: "compact",
                      "hide-details": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(o),
                    e(x, {
                      variant: "text",
                      onClick: y[4] || (y[4] = (W) => i.value = !1)
                    }, {
                      default: t(() => [...y[14] || (y[14] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(x, {
                      color: "primary",
                      variant: "elevated",
                      loading: M.value,
                      disabled: !$.value,
                      onClick: A
                    }, {
                      default: t(() => [...y[15] || (y[15] = [
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
  setup(d) {
    const U = fe(), T = pe(), I = s([]), R = s(!1), c = s(null), D = s(!1), P = s(null), j = s(!1), C = [
      { title: "Identifier", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Status", key: "status", sortable: !0, width: "120px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function i(E) {
      var p;
      const f = (p = E == null ? void 0 : E.toLowerCase) == null ? void 0 : p.call(E);
      return f === "up" ? "success" : f === "down" ? "error" : f === "unknown" ? "warning" : "grey";
    }
    async function $() {
      R.value = !0, c.value = null;
      const E = await U.get("rest/node");
      I.value = Array.isArray(E) ? E : (E == null ? void 0 : E.data) || [], R.value = !1;
    }
    function S(E) {
      P.value = E, D.value = !0;
    }
    async function M() {
      j.value = !0, await U.del(`rest/node/${encodeURIComponent(P.value.id)}`), j.value = !1, D.value = !1, $();
    }
    return me(() => {
      T.setTitle("Nodes"), T.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]), $();
    }), (E, f) => {
      const p = n("v-spacer"), N = n("v-btn"), G = n("v-alert"), z = n("v-chip"), A = n("v-icon"), V = n("v-data-table"), r = n("v-card-title"), v = n("v-card-text"), y = n("v-card-actions"), o = n("v-card"), L = n("v-dialog");
      return m(), J("div", null, [
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
        c.value ? (m(), q(G, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(c.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(V, {
          headers: C,
          items: I.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.id": t(({ item: x }) => [
            u("code", null, h(x.id), 1)
          ]),
          "item.status": t(({ item: x }) => [
            x.status ? (m(), q(z, {
              key: 0,
              size: "x-small",
              color: i(x.status),
              variant: "tonal"
            }, {
              default: t(() => [
                l(h(x.status), 1)
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
              onClick: (Q) => S(x)
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
                    var x, Q;
                    return [
                      f[6] || (f[6] = l(" Delete ", -1)),
                      u("strong", null, h((x = P.value) == null ? void 0 : x.name), 1),
                      f[7] || (f[7] = l(" (", -1)),
                      u("code", null, h((Q = P.value) == null ? void 0 : Q.id), 1),
                      f[8] || (f[8] = l(")? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(y, null, {
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
                      loading: j.value,
                      onClick: M
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
  setup(d) {
    const U = fe(), T = pe(), I = s([]), R = s(!1), c = s(null), D = s(null), P = [
      { title: "Cache", key: "id", sortable: !0 },
      { title: "Size", key: "size", sortable: !0, width: "100px" },
      { title: "Hits", key: "hitCount", sortable: !0, width: "160px" },
      { title: "Misses", key: "missCount", sortable: !0, width: "160px" },
      { title: "Avg get (ms)", key: "averageGetTime", sortable: !0, width: "140px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function j($, S, M) {
      return S && M === 1 || $ >= 90 ? "success" : $ >= 80 ? "primary" : $ >= 50 ? "warning" : "error";
    }
    async function C() {
      R.value = !0, c.value = null;
      const $ = await U.get("rest/system/cache");
      Array.isArray($) ? I.value = $ : $ === null && (c.value = "Unable to load caches"), R.value = !1;
    }
    async function i($) {
      D.value = $.id, await U.post(`rest/system/cache/${encodeURIComponent($.id)}`), D.value = null, C();
    }
    return me(() => {
      T.setTitle("Caches"), T.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Caches" }]), C();
    }), ($, S) => {
      const M = n("v-spacer"), E = n("v-btn"), f = n("v-alert"), p = n("v-chip"), N = n("v-icon"), G = n("v-data-table");
      return m(), J("div", null, [
        u("div", fl, [
          S[1] || (S[1] = u("h1", { class: "text-h4" }, "Caches", -1)),
          e(M),
          e(E, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            onClick: C
          }, {
            default: t(() => [...S[0] || (S[0] = [
              l("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        c.value ? (m(), q(f, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(c.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(G, {
          headers: P,
          items: I.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.hitCount": t(({ item: z }) => [
            u("div", _l, [
              u("span", null, h(z.hitCount ?? 0), 1),
              z.hitPercentage != null && (z.hitCount ?? 0) > 0 ? (m(), q(p, {
                key: 0,
                size: "x-small",
                color: j(z.hitPercentage, !0, z.hitCount)
              }, {
                default: t(() => [
                  l(h(Math.round(z.hitPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : K("", !0)
            ])
          ]),
          "item.missCount": t(({ item: z }) => [
            u("div", yl, [
              u("span", null, h(z.missCount ?? 0), 1),
              z.missPercentage != null && (z.missCount ?? 0) > 1 ? (m(), q(p, {
                key: 0,
                size: "x-small",
                color: j(100 - z.missPercentage, !1)
              }, {
                default: t(() => [
                  l(h(Math.round(z.missPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : K("", !0)
            ])
          ]),
          "item.averageGetTime": t(({ item: z }) => [
            l(h(z.averageGetTime ?? "—"), 1)
          ]),
          "item.actions": t(({ item: z }) => [
            e(E, {
              icon: "",
              size: "small",
              variant: "text",
              loading: D.value === z.id,
              onClick: (A) => i(z),
              title: "Invalidate cache"
            }, {
              default: t(() => [
                e(N, { size: "small" }, {
                  default: t(() => [...S[2] || (S[2] = [
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
  setup(d) {
    const U = fe(), T = pe(), I = [
      { key: "insert", step: "INSERT", method: "post", url: "rest/system/bench/prepare" },
      { key: "select", step: "SELECT", method: "get", url: "rest/system/bench/read" },
      { key: "select-all", step: "SELECT *", method: "get", url: "rest/system/bench/read/all" },
      { key: "update", step: "UPDATE", method: "put", url: "rest/system/bench/update" },
      { key: "delete", step: "DELETE", method: "del", url: "rest/system/bench/delete" }
    ], R = s(!1), c = s(null), D = s(I.map((j) => ({ step: j.step, duration: null, loading: !1 })));
    async function P() {
      R.value = !0, c.value = null, D.value = I.map((j) => ({ step: j.step, duration: null, loading: !1 }));
      for (let j = 0; j < I.length; j++) {
        D.value[j].loading = !0;
        try {
          const C = I[j].method === "post" || I[j].method === "put" ? void 0 : null, i = C === null ? await U[I[j].method](I[j].url) : await U[I[j].method](I[j].url, C);
          D.value[j].duration = (i == null ? void 0 : i.duration) ?? "—";
        } catch (C) {
          c.value = `${I[j].step} failed: ${C.message || C}`;
          break;
        } finally {
          D.value[j].loading = !1;
        }
      }
      R.value = !1;
    }
    return me(() => {
      T.setTitle("Bench"), T.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (j, C) => {
      const i = n("v-card-text"), $ = n("v-card"), S = n("v-btn"), M = n("v-alert"), E = n("v-progress-circular"), f = n("v-table");
      return m(), J("div", null, [
        C[3] || (C[3] = u("h1", { class: "text-h4 mb-4" }, "Database bench", -1)),
        e($, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(i, null, {
              default: t(() => [...C[0] || (C[0] = [
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
        e(S, {
          color: "primary",
          "prepend-icon": "mdi-play",
          loading: R.value,
          onClick: P
        }, {
          default: t(() => [...C[1] || (C[1] = [
            l(" Run bench ", -1)
          ])]),
          _: 1
        }, 8, ["loading"]),
        c.value ? (m(), q(M, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mt-4"
        }, {
          default: t(() => [
            l(h(c.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        D.value.length ? (m(), q(f, {
          key: 1,
          density: "compact",
          class: "mt-4",
          style: { "max-width": "600px" }
        }, {
          default: t(() => [
            C[2] || (C[2] = u("thead", null, [
              u("tr", null, [
                u("th", null, "Step"),
                u("th", null, "Duration (ms)")
              ])
            ], -1)),
            u("tbody", null, [
              (m(!0), J(ve, null, ke(D.value, (p) => (m(), J("tr", {
                key: p.step
              }, [
                u("td", null, h(p.step), 1),
                u("td", null, [
                  p.loading ? (m(), q(E, {
                    key: 0,
                    size: "16",
                    width: "2",
                    indeterminate: ""
                  })) : (m(), J("span", bl, h(p.duration ?? "—"), 1))
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
  setup(d) {
    const U = pe(), T = s(!0), I = s(null), R = "/", c = `${R}rest/swagger-ui-bundle.js`, D = `${R}rest/swagger-ui-standalone-preset.js`, P = `${R}rest/swagger-ui.css`, j = `${R}rest/index.css`, C = `${R}rest/openapi.json`;
    function i() {
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
    function $(f, p) {
      if (document.getElementById(p)) return;
      const N = document.createElement("link");
      N.id = p, N.rel = "stylesheet", N.href = f, document.head.appendChild(N);
    }
    function S(f) {
      var p;
      (p = document.getElementById(f)) == null || p.remove();
    }
    function M(f, p) {
      return new Promise((N, G) => {
        if (document.getElementById(p)) {
          N();
          return;
        }
        const A = document.createElement("script");
        A.id = p, A.src = f, A.async = !0, A.onload = N, A.onerror = () => G(new Error(`Failed to load ${f}`)), document.head.appendChild(A);
      });
    }
    function E() {
      const { SwaggerUIBundle: f, SwaggerUIStandalonePreset: p } = window;
      if (!f) {
        I.value = "Swagger UI bundle is unavailable.";
        return;
      }
      window.ui = f({
        url: C,
        dom_id: "#swagger-ui",
        displayRequestDuration: !0,
        deepLinking: !1,
        presets: [f.presets.apis, p],
        plugins: [f.plugins.FiltrePreset, i()].filter(Boolean),
        filter: !0,
        layout: "StandaloneLayout",
        validatorUrl: "https://validator.swagger.io/validator"
      });
    }
    return me(async () => {
      U.setTitle("API"), U.setBreadcrumbs([{ title: "API" }]), $(P, "swagger-ui-css"), $(j, "swagger-ui-extra-css");
      try {
        await Promise.all([
          M(c, "swagger-ui-bundle"),
          M(D, "swagger-ui-preset")
        ]), E();
      } catch (f) {
        I.value = f.message || "Unable to load Swagger UI.";
      } finally {
        T.value = !1;
      }
    }), Ke(() => {
      S("swagger-ui-css"), S("swagger-ui-extra-css"), delete window.ui;
    }), (f, p) => {
      const N = n("v-spacer"), G = n("v-btn"), z = n("v-alert"), A = n("v-progress-linear");
      return m(), J("div", null, [
        u("div", wl, [
          p[1] || (p[1] = u("h1", { class: "text-h4" }, "API reference", -1)),
          e(N),
          e(G, {
            variant: "outlined",
            "prepend-icon": "mdi-code-tags",
            href: `${se(R)}rest/openapi.json`,
            target: "_blank"
          }, {
            default: t(() => [...p[0] || (p[0] = [
              l(" Download OpenAPI ", -1)
            ])]),
            _: 1
          }, 8, ["href"])
        ]),
        I.value ? (m(), q(z, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(I.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        T.value ? (m(), q(A, {
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
  setup(d) {
    const U = fe(), T = pe(), I = he(), R = "/", c = typeof window < "u" ? window.location.origin : "", D = ce(() => I.userName || "<you>"), P = s([]), j = s(!1), C = s(null), i = s(!1), $ = s(null), S = s(""), M = s(!1), E = s(!1), f = s(""), p = s(""), N = s(!1), G = s(""), z = s(""), A = s(!1), V = s(!1), r = s(!1), v = s(""), y = s(!1), o = { required: (B) => !!B || "Required" }, L = [
      { title: "Name", key: "name", sortable: !0 },
      { title: "", key: "actions", sortable: !1, width: "140px", align: "end" }
    ];
    async function x() {
      j.value = !0, C.value = null;
      const B = await U.get("rest/api/token");
      P.value = Array.isArray(B) ? B.map((g) => ({ name: g })) : [], j.value = !1;
    }
    function Q() {
      S.value = "", i.value = !0;
    }
    async function te() {
      const { valid: B } = await $.value.validate();
      if (!B) return;
      M.value = !0;
      const g = await U.post(`rest/api/token/${encodeURIComponent(S.value)}`);
      M.value = !1, g !== null && (f.value = S.value, p.value = typeof g == "string" ? g : (g == null ? void 0 : g.id) || "", i.value = !1, E.value = !0, x());
    }
    async function _(B, g) {
      G.value = B, z.value = "", V.value = !1, N.value = !0, A.value = !0;
      const H = `rest/api/token/${encodeURIComponent(B)}`, le = g === "regen" ? await U.put(H) : await U.get(H);
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
    async function k() {
      try {
        await navigator.clipboard.writeText(p.value);
      } catch {
      }
    }
    function ee(B) {
      v.value = B, r.value = !0;
    }
    async function X() {
      y.value = !0, await U.del(`rest/api/token/${encodeURIComponent(v.value)}`), y.value = !1, r.value = !1, x();
    }
    return me(() => {
      T.setTitle("API tokens"), T.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]), x();
    }), (B, g) => {
      const H = n("v-spacer"), le = n("v-btn"), W = n("v-card-text"), oe = n("v-card"), re = n("v-alert"), O = n("v-icon"), ie = n("v-data-table"), de = n("v-card-title"), _e = n("v-text-field"), w = n("v-form"), b = n("v-card-actions"), Y = n("v-dialog"), F = n("v-progress-linear"), ne = n("v-textarea");
      return m(), J("div", null, [
        u("div", Cl, [
          g[11] || (g[11] = u("h1", { class: "text-h4" }, "API tokens", -1)),
          e(H),
          e(le, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: Q
          }, {
            default: t(() => [...g[10] || (g[10] = [
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
                g[13] || (g[13] = u("p", { class: "mb-2" }, [
                  l(" Tokens let you call the Ligoj API without a password. Pass the token in the "),
                  u("code", null, "api-key"),
                  l(" parameter along with your user id in "),
                  u("code", null, "api-user"),
                  l(". ")
                ], -1)),
                u("p", $l, [
                  g[12] || (g[12] = l(" Example: ", -1)),
                  u("code", null, " GET " + h(se(c)) + h(se(R)) + "rest/project?api-key=<token>&api-user=" + h(D.value), 1)
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        C.value ? (m(), q(re, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(C.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(ie, {
          headers: L,
          items: P.value,
          loading: j.value,
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
              onClick: (ye) => _(ae.name, "load")
            }, {
              default: t(() => [
                e(O, { size: "small" }, {
                  default: t(() => [...g[14] || (g[14] = [
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
              onClick: (ye) => _(ae.name, "regen")
            }, {
              default: t(() => [
                e(O, { size: "small" }, {
                  default: t(() => [...g[15] || (g[15] = [
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
              onClick: (ye) => ee(ae.name)
            }, {
              default: t(() => [
                e(O, { size: "small" }, {
                  default: t(() => [...g[16] || (g[16] = [
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
        e(Y, {
          modelValue: i.value,
          "onUpdate:modelValue": g[2] || (g[2] = (ae) => i.value = ae),
          "max-width": "480",
          persistent: ""
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [...g[17] || (g[17] = [
                    l("New API token", -1)
                  ])]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(w, {
                      ref_key: "createFormRef",
                      ref: $,
                      onSubmit: xe(te, ["prevent"])
                    }, {
                      default: t(() => [
                        e(_e, {
                          modelValue: S.value,
                          "onUpdate:modelValue": g[0] || (g[0] = (ae) => S.value = ae),
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
                e(b, null, {
                  default: t(() => [
                    e(H),
                    e(le, {
                      variant: "text",
                      onClick: g[1] || (g[1] = (ae) => i.value = !1)
                    }, {
                      default: t(() => [...g[18] || (g[18] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(le, {
                      color: "primary",
                      variant: "elevated",
                      loading: M.value,
                      onClick: te
                    }, {
                      default: t(() => [...g[19] || (g[19] = [
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
        e(Y, {
          modelValue: N.value,
          "onUpdate:modelValue": g[5] || (g[5] = (ae) => N.value = ae),
          "max-width": "520"
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [
                    g[20] || (g[20] = l(" Token: ", -1)),
                    u("code", null, h(G.value), 1)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    A.value ? (m(), q(F, {
                      key: 0,
                      indeterminate: "",
                      color: "primary",
                      class: "mb-3"
                    })) : K("", !0),
                    e(ne, {
                      modelValue: z.value,
                      "onUpdate:modelValue": g[3] || (g[3] = (ae) => z.value = ae),
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": a
                    }, null, 8, ["modelValue"]),
                    V.value ? (m(), q(re, {
                      key: 1,
                      type: "success",
                      variant: "tonal",
                      density: "compact",
                      class: "mt-2"
                    }, {
                      default: t(() => [...g[21] || (g[21] = [
                        l(" Copied to clipboard. ", -1)
                      ])]),
                      _: 1
                    })) : K("", !0)
                  ]),
                  _: 1
                }),
                e(b, null, {
                  default: t(() => [
                    e(H),
                    e(le, {
                      variant: "text",
                      onClick: g[4] || (g[4] = (ae) => N.value = !1)
                    }, {
                      default: t(() => [...g[22] || (g[22] = [
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
        e(Y, {
          modelValue: E.value,
          "onUpdate:modelValue": g[7] || (g[7] = (ae) => E.value = ae),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [
                    g[23] || (g[23] = l(" New token: ", -1)),
                    u("code", null, h(f.value), 1)
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
                      default: t(() => [...g[24] || (g[24] = [
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
                      "onClick:appendInner": k
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                }),
                e(b, null, {
                  default: t(() => [
                    e(H),
                    e(le, {
                      color: "primary",
                      onClick: g[6] || (g[6] = (ae) => E.value = !1)
                    }, {
                      default: t(() => [...g[25] || (g[25] = [
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
        e(Y, {
          modelValue: r.value,
          "onUpdate:modelValue": g[9] || (g[9] = (ae) => r.value = ae),
          "max-width": "420"
        }, {
          default: t(() => [
            e(oe, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [...g[26] || (g[26] = [
                    l("Delete token", -1)
                  ])]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    g[27] || (g[27] = l("Revoke token ", -1)),
                    u("code", null, h(v.value), 1),
                    g[28] || (g[28] = l("?", -1))
                  ]),
                  _: 1
                }),
                e(b, null, {
                  default: t(() => [
                    e(H),
                    e(le, {
                      variant: "text",
                      onClick: g[8] || (g[8] = (ae) => r.value = !1)
                    }, {
                      default: t(() => [...g[29] || (g[29] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(le, {
                      color: "error",
                      variant: "elevated",
                      loading: y.value,
                      onClick: X
                    }, {
                      default: t(() => [...g[30] || (g[30] = [
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
}, hl = { class: "d-flex align-center mb-4" }, Ul = { class: "pa-4" }, Pl = { class: "pa-4" }, Nl = { class: "text-body-2 text-medium-emphasis mb-4" }, jl = { class: "d-flex align-center pa-2" }, Tl = {
  __name: "SubscribeWizardView",
  setup(d) {
    const U = Ae(), T = Ue(), I = fe(), R = pe(), c = ce(() => U.query.project ?? U.params.id ?? null), D = s(null), P = s(!1), j = s(null), C = s(1), i = Ve({
      service: null,
      tool: null,
      node: null,
      mode: null
    }), $ = s([]), S = s([]), M = s([]), E = s([]), f = Ve({}), p = s(null), N = s(!1), G = s(!1), z = s(!1), A = s(!1), V = s(!1), r = ce(() => ["Service", "Tool", "Node", "Mode", "Parameters"]), v = ce(() => (w) => w === 1 ? !0 : w === 2 ? !!i.service : w === 3 ? !!i.tool : w === 4 ? !!i.node : w === 5 ? !!i.node && !!i.mode : !1), y = ce(() => C.value === 1 ? !!i.service : C.value === 2 ? !!i.tool : C.value === 3 ? !!i.node : C.value === 4 ? !!i.mode : !1), o = ce(() => {
      var Y;
      const w = (Y = i.tool) == null ? void 0 : Y.mode, b = [];
      return (w === "all" || w === "create") && b.push({ value: "create", label: "Create — provision a new instance inside the tool" }), (w === "all" || w === "link" || !w) && b.push({ value: "link", label: "Link — attach this project to an existing instance" }), b;
    }), L = ce(
      () => D.value ? `/home/project/${D.value.id}` : "/home/project"
    );
    function x(w) {
      return !w.type || w.type === "text" || w.type === "password" || w.type === "node" || w.type === "project";
    }
    function Q(w) {
      return w.type === "password" || (w.name || "").toLowerCase().includes("password");
    }
    function te(w) {
      const b = w.mandatory || w.required ? " *" : "";
      return `${w.name || w.id}${b}`;
    }
    function _(w) {
      const b = [];
      return (w.mandatory || w.required) && b.push((Y) => Y !== "" && Y != null || "Required"), b;
    }
    async function a() {
      if (!c.value) return;
      P.value = !0;
      const w = await I.get(`rest/project/${c.value}`);
      D.value = w || null, P.value = !1;
    }
    async function k() {
      N.value = !0, $.value = await H("rest/node?refined=service&rows=1000"), N.value = !1;
    }
    async function ee(w) {
      G.value = !0, S.value = await H(`rest/node?refined=${encodeURIComponent(w)}&rows=1000`), G.value = !1;
    }
    async function X(w) {
      z.value = !0, M.value = await H(`rest/node?refined=${encodeURIComponent(w)}&rows=1000`), z.value = !1;
    }
    async function B(w, b) {
      A.value = !0;
      const Y = await I.get(`rest/node/${encodeURIComponent(w)}/parameter/${b.toUpperCase()}`);
      E.value = Array.isArray(Y) ? Y : (Y == null ? void 0 : Y.data) || [];
      for (const F of Object.keys(f)) delete f[F];
      for (const F of E.value)
        F.defaultValue != null ? f[F.id] = g(F) : F.type === "bool" ? f[F.id] = !1 : F.type === "multiselect" || F.type === "tags" ? f[F.id] = [] : f[F.id] = "";
      A.value = !1;
    }
    function g(w) {
      return w.type === "integer" ? Number(w.defaultValue) : w.type === "bool" ? w.defaultValue === !0 || w.defaultValue === "true" : w.defaultValue;
    }
    async function H(w) {
      const b = await I.get(w);
      return Array.isArray(b) ? le(b) : Array.isArray(b == null ? void 0 : b.data) ? le(b.data) : [];
    }
    function le(w) {
      return w.filter((b) => b.enabled !== !1);
    }
    function W(w) {
      var b;
      ((b = i.service) == null ? void 0 : b.id) !== w.id && (i.service = w, i.tool = null, i.node = null, i.mode = null, S.value = [], M.value = []);
    }
    function oe(w) {
      var b;
      ((b = i.tool) == null ? void 0 : b.id) !== w.id && (i.tool = w, i.node = null, i.mode = null, M.value = []);
    }
    function re(w) {
      var b;
      ((b = i.node) == null ? void 0 : b.id) !== w.id && (i.node = w, i.mode = null);
    }
    ze(C, async (w) => {
      w === 1 && $.value.length === 0 && await k(), w === 2 && i.service && S.value.length === 0 && await ee(i.service.id), w === 3 && i.tool && M.value.length === 0 && await X(i.tool.id), w === 4 && !i.mode && o.value.length > 0 && (i.mode = o.value[0].value), w === 5 && i.node && i.mode && await B(i.node.id, i.mode);
    });
    async function O() {
      const { valid: w } = p.value ? await p.value.validate() : { valid: !0 };
      if (!w) return;
      V.value = !0, j.value = null;
      const b = {
        node: i.node.id,
        project: Number(c.value),
        mode: i.mode,
        parameters: E.value.map((F) => ie(F)).filter(Boolean)
      }, Y = await I.post("rest/subscription", b);
      V.value = !1, Y != null ? T.push(`/home/project/${c.value}`) : j.value = "Subscription creation failed — please review the highlighted parameters.";
    }
    function ie(w) {
      const b = f[w.id];
      if ((b === "" || b == null || Array.isArray(b) && b.length === 0) && !w.mandatory && !w.required)
        return null;
      const Y = { parameter: w.id };
      return w.type === "integer" ? { ...Y, integer: Number(b) } : w.type === "bool" ? { ...Y, bool: !!b } : w.type === "multiselect" || w.type === "tags" ? { ...Y, selections: b || [] } : w.type === "select" ? { ...Y, text: b } : { ...Y, text: b };
    }
    me(async () => {
      R.setTitle("Subscribe"), R.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        ...c.value ? [{ title: c.value, to: `/home/project/${c.value}` }, { title: "Subscribe" }] : [{ title: "Subscribe" }]
      ]), await a(), D.value && await k();
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
      setup(w, { emit: b }) {
        return () => be("div", { class: "pa-4" }, [
          be("h3", { class: "text-h6 mb-1" }, w.heading),
          w.sub && be("p", { class: "text-body-2 text-medium-emphasis mb-4" }, w.sub),
          w.loading ? be("div", { class: "text-body-2 text-medium-emphasis pa-4" }, "Loading…") : w.choices.length ? be(
            "div",
            { class: "choice-grid" },
            w.choices.map(
              (Y) => be(
                "button",
                {
                  key: Y.id,
                  type: "button",
                  class: [
                    "choice-card",
                    { "choice-card--active": Y.id === w.selectedId }
                  ],
                  onClick: () => b("select", Y),
                  title: Y.description || void 0
                },
                [
                  be("div", { class: "choice-icon" }, _e(Y)),
                  be("div", { class: "choice-name" }, Y.name || Y.id)
                ]
              )
            )
          ) : be("div", { class: "text-body-2 text-medium-emphasis" }, "No entries available.")
        ]);
      }
    };
    function _e(w) {
      var Y;
      const b = (w == null ? void 0 : w.uiClasses) || ((Y = w == null ? void 0 : w.refined) == null ? void 0 : Y.uiClasses);
      return b && b.startsWith("$") ? b.slice(1) : b ? be("i", { class: b }) : be("i", { class: "mdi mdi-puzzle" });
    }
    return (w, b) => {
      const Y = n("v-spacer"), F = n("v-btn"), ne = n("router-link"), ae = n("v-alert"), ye = n("v-radio"), Le = n("v-radio-group"), Ee = n("v-progress-linear"), Ce = n("v-text-field"), Be = n("v-checkbox"), Pe = n("v-select"), qe = n("v-form"), Me = n("v-stepper");
      return m(), J("div", null, [
        u("div", hl, [
          b[3] || (b[3] = u("h1", { class: "text-h4" }, "Subscribe", -1)),
          e(Y),
          e(F, {
            variant: "text",
            to: L.value
          }, {
            default: t(() => [...b[2] || (b[2] = [
              l("Cancel", -1)
            ])]),
            _: 1
          }, 8, ["to"])
        ]),
        c.value ? P.value ? (m(), q(ae, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...b[7] || (b[7] = [
            l(" Loading project… ", -1)
          ])]),
          _: 1
        })) : D.value ? (m(), q(ae, {
          key: 2,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            b[8] || (b[8] = l(" Adding a subscription to ", -1)),
            u("strong", null, h(D.value.name), 1),
            l(" (" + h(D.value.pkey) + "). ", 1),
            b[9] || (b[9] = u("br", null, null, -1)),
            b[10] || (b[10] = u("span", { class: "text-caption text-warning" }, "Subscribing is not an idempotent operation — removing a subscription later may not clean up remote data automatically.", -1))
          ]),
          _: 1
        })) : K("", !0) : (m(), q(ae, {
          key: 0,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            b[5] || (b[5] = l(" No project selected. The wizard needs a project — ", -1)),
            e(ne, { to: "/home/project" }, {
              default: t(() => [...b[4] || (b[4] = [
                l("pick one", -1)
              ])]),
              _: 1
            }),
            b[6] || (b[6] = l(`, then open this page from the project's "Add subscription" button. `, -1))
          ]),
          _: 1
        })),
        j.value ? (m(), q(ae, {
          key: 3,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(j.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        D.value ? (m(), q(Me, {
          key: 4,
          modelValue: C.value,
          "onUpdate:modelValue": b[1] || (b[1] = (ue) => C.value = ue),
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
                choices: $.value,
                loading: N.value,
                "selected-id": (ue = i.service) == null ? void 0 : ue.id,
                onSelect: W
              }, null, 8, ["choices", "loading", "selected-id"])
            ];
          }),
          "item.2": t(() => {
            var ue, Z;
            return [
              e(de, {
                heading: `Select a tool providing ${((ue = i.service) == null ? void 0 : ue.name) ?? "…"}`,
                sub: "A tool is one implementation of the service; several instances may be deployed.",
                choices: S.value,
                loading: G.value,
                "selected-id": (Z = i.tool) == null ? void 0 : Z.id,
                onSelect: oe
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.3": t(() => {
            var ue, Z;
            return [
              e(de, {
                heading: `Pick a node running ${((ue = i.tool) == null ? void 0 : ue.name) ?? "…"}`,
                sub: "A node is a running instance of the tool.",
                choices: M.value,
                loading: z.value,
                "selected-id": (Z = i.node) == null ? void 0 : Z.id,
                onSelect: re
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.4": t(() => [
            u("div", Ul, [
              b[11] || (b[11] = u("h3", { class: "text-h6 mb-2" }, "Subscription mode", -1)),
              b[12] || (b[12] = u("p", { class: "text-body-2 text-medium-emphasis mb-4" }, [
                u("strong", null, "Link"),
                l(" attaches this project to an existing instance in the tool. "),
                u("strong", null, "Create"),
                l(" additionally provisions a new instance inside the tool. ")
              ], -1)),
              e(Le, {
                modelValue: i.mode,
                "onUpdate:modelValue": b[0] || (b[0] = (ue) => i.mode = ue),
                inline: ""
              }, {
                default: t(() => [
                  (m(!0), J(ve, null, ke(o.value, (ue) => (m(), q(ye, {
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
              u("div", Pl, [
                b[16] || (b[16] = u("h3", { class: "text-h6 mb-1" }, "Parameters", -1)),
                u("p", Nl, [
                  b[13] || (b[13] = l(" Values required to link the project to ", -1)),
                  u("code", null, h((ue = i.node) == null ? void 0 : ue.id), 1),
                  b[14] || (b[14] = l(". ", -1))
                ]),
                A.value ? (m(), q(Ee, {
                  key: 0,
                  indeterminate: "",
                  color: "primary",
                  class: "mb-3"
                })) : K("", !0),
                !A.value && E.value.length === 0 ? (m(), q(ae, {
                  key: 1,
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: t(() => [...b[15] || (b[15] = [
                    l(" This subscription requires no additional parameters — just click Create. ", -1)
                  ])]),
                  _: 1
                })) : K("", !0),
                e(qe, {
                  ref_key: "paramFormRef",
                  ref: p
                }, {
                  default: t(() => [
                    (m(!0), J(ve, null, ke(E.value, (Z) => (m(), J("div", {
                      key: Z.id,
                      class: "mb-3"
                    }, [
                      x(Z) ? (m(), q(Ce, {
                        key: 0,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        type: Q(Z) ? "password" : "text",
                        label: te(Z),
                        rules: _(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "label", "rules", "hint"])) : Z.type === "integer" ? (m(), q(Ce, {
                        key: 1,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        modelModifiers: { number: !0 },
                        type: "number",
                        min: Z.min,
                        max: Z.max,
                        label: te(Z),
                        rules: _(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "max", "label", "rules", "hint"])) : Z.type === "bool" ? (m(), q(Be, {
                        key: 2,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        label: te(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "hint"])) : Z.type === "select" ? (m(), q(Pe, {
                        key: 3,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        items: Z.values || [],
                        label: te(Z),
                        rules: _(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : Z.type === "multiselect" || Z.type === "tags" ? (m(), q(Pe, {
                        key: 4,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        items: Z.values || [],
                        label: te(Z),
                        rules: _(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        chips: "",
                        multiple: "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : (m(), q(Ce, {
                        key: 5,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        label: te(Z),
                        rules: _(Z),
                        hint: `${Z.description || ""} [${Z.type}]`,
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
          actions: t(({ prev: ue, next: Z }) => [
            u("div", jl, [
              C.value > 1 ? (m(), q(F, {
                key: 0,
                variant: "text",
                "prepend-icon": "mdi-arrow-left",
                onClick: ue
              }, {
                default: t(() => [...b[17] || (b[17] = [
                  l("Previous", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : K("", !0),
              e(Y),
              C.value < r.value.length ? (m(), q(F, {
                key: 1,
                color: "primary",
                disabled: !y.value,
                "append-icon": "mdi-arrow-right",
                onClick: Z
              }, {
                default: t(() => [...b[18] || (b[18] = [
                  l("Next", -1)
                ])]),
                _: 1
              }, 8, ["disabled", "onClick"])) : (m(), q(F, {
                key: 2,
                color: "success",
                "prepend-icon": "mdi-check",
                loading: V.value,
                disabled: !i.node,
                onClick: O
              }, {
                default: t(() => [...b[19] || (b[19] = [
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
}, Ne = /* @__PURE__ */ we(Tl, [["__scopeId", "data-v-47b9f499"]]);
if (typeof document < "u") {
  const d = "ligoj-plugin-ui-css";
  if (!document.getElementById(d)) {
    const U = document.createElement("link");
    U.id = d, U.rel = "stylesheet", U.href = new URL("./index.css", import.meta.url).href, document.head.appendChild(U);
  }
}
const zl = {
  sample: De.sample
}, je = [
  { path: "/home", name: "ui-home", component: pt },
  { path: "/home/manual", name: "ui-manual", component: Mt },
  { path: "/home/project", name: "ui-project-list", component: Ct },
  { path: "/home/project/:id", name: "ui-project-detail", component: Lt },
  { path: "/system", name: "ui-system", component: Ot },
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
  { path: "/subscribe", name: "ui-subscribe", component: Ne },
  // Project-scoped entry used by ProjectDetailView's "Add subscription" button.
  { path: "/home/project/:id/subscription", name: "ui-subscribe-project", component: Ne }
], Hl = {
  id: "ui",
  label: "UI",
  component: Qe,
  routes: je,
  install({ router: d }) {
    for (const U of je)
      d.addRoute(U);
  },
  feature(d, ...U) {
    const T = zl[d];
    if (!T) throw new Error(`Plugin "ui" has no feature "${d}"`);
    return T(...U);
  },
  service: De,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  Gl as TARGET_TYPE_ICON,
  Hl as default,
  Re as getFullName,
  Ol as getHierarchyIds,
  ft as getService,
  ql as getServiceFromId,
  Ml as getServiceNameFromId,
  _t as getTool,
  Bl as getToolFromId,
  Fl as getToolNameFromId,
  Ll as htmlEscape,
  El as htmlUnescape,
  gt as normalize,
  De as service,
  vt as toUser2Letters,
  Rl as trimObject
};
