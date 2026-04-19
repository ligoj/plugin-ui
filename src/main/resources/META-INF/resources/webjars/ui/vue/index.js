import { resolveComponent as n, openBlock as m, createElementBlock as J, createVNode as e, withCtx as t, createTextVNode as l, ref as s, computed as ce, onMounted as me, createElementVNode as u, Fragment as ve, renderList as ke, createBlock as M, toDisplayString as h, createCommentVNode as K, normalizeClass as Fe, mergeProps as Te, unref as ie, withDirectives as Oe, withModifiers as xe, vShow as Ge, watch as ze, reactive as Ve, normalizeProps as He, guardReactiveProps as We, withKeys as Se, onBeforeUnmount as Ke, h as be } from "vue";
import { useApi as fe, useAppStore as pe, useI18nStore as Je, useDataTable as Ie, useErrorStore as Ze, useAuthStore as he, LigojDataTable as Xe } from "@ligoj/host";
import { useRouter as Ue, useRoute as Ae } from "vue-router";
const we = (d, U) => {
  const z = d.__vccOpts || d;
  for (const [A, L] of U)
    z[A] = L;
  return z;
}, Ye = { class: "plugin-ui-shell" }, Qe = {
  __name: "UiPlugin",
  setup(d) {
    return (U, z) => {
      const A = n("v-alert"), L = n("v-list-subheader"), c = n("v-list-item"), R = n("v-list");
      return m(), J("div", Ye, [
        e(A, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...z[0] || (z[0] = [
            l(" plugin-ui is being migrated from the legacy Cascade.js implementation — most views below are placeholders and link back to their legacy sources. ", -1)
          ])]),
          _: 1
        }),
        e(R, {
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            e(L, null, {
              default: t(() => [...z[1] || (z[1] = [
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
            e(L, null, {
              default: t(() => [...z[2] || (z[2] = [
                l("System", -1)
              ])]),
              _: 1
            }),
            e(c, {
              to: "/system",
              "prepend-icon": "mdi-cog",
              title: "System administration"
            }),
            e(L, null, {
              default: t(() => [...z[3] || (z[3] = [
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
            e(L, null, {
              default: t(() => [...z[4] || (z[4] = [
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
}, et = /* @__PURE__ */ we(Qe, [["__scopeId", "data-v-9cfeae95"]]), De = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, tt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, lt = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mb-4"
}, nt = { class: "ml-1 text-caption" }, at = { class: "d-flex align-start mb-2" }, ot = { class: "flex-grow-1 truncate" }, it = { class: "text-subtitle-1 font-weight-medium truncate" }, st = { class: "text-caption text-medium-emphasis" }, rt = {
  key: 0,
  class: "sub-strip"
}, ut = {
  key: 0,
  class: "text-caption text-medium-emphasis ml-1"
}, dt = { style: { width: "28px" } }, ct = { class: "truncate" }, mt = { class: "truncate text-medium-emphasis" }, pt = {
  __name: "HomeView",
  setup(d) {
    const U = fe(), z = pe(), A = s(!1), L = s(null), c = s([]), R = s(""), P = s(null), N = s("md"), C = ce(() => {
      var j, G, I;
      const p = /* @__PURE__ */ new Map();
      for (const D of c.value) {
        const V = ((j = D.project) == null ? void 0 : j.id) ?? D.project;
        if (V == null) continue;
        let r = p.get(V);
        r || (r = {
          id: V,
          name: ((G = D.project) == null ? void 0 : G.name) || String(V),
          pkey: ((I = D.project) == null ? void 0 : I.pkey) || "",
          subscriptions: []
        }, p.set(V, r)), r.subscriptions.push(D);
      }
      return [...p.values()].sort((D, V) => D.name.localeCompare(V.name));
    }), i = ce(() => {
      var j, G, I;
      const p = /* @__PURE__ */ new Map();
      for (const D of c.value) {
        const V = ((I = (G = (j = D.node) == null ? void 0 : j.refined) == null ? void 0 : G.refined) == null ? void 0 : I.id) || "";
        V && p.set(V, (p.get(V) || 0) + 1);
      }
      return [...p.entries()].sort((D, V) => V[1] - D[1]).map(([D, V]) => ({
        id: D,
        count: V,
        icon: S(D),
        label: D.split(":").slice(-1)[0]
      }));
    }), $ = ce(() => {
      var j;
      const p = (j = R.value) == null ? void 0 : j.trim().toLowerCase();
      return C.value.filter((G) => P.value && !G.subscriptions.some(
        (D) => {
          var V, r, v;
          return ((v = (r = (V = D.node) == null ? void 0 : V.refined) == null ? void 0 : r.refined) == null ? void 0 : v.id) === P.value;
        }
      ) ? !1 : !p || G.name.toLowerCase().includes(p) || G.pkey.toLowerCase().includes(p) ? !0 : G.subscriptions.some(
        (I) => {
          var D, V, r, v;
          return (((D = I.node) == null ? void 0 : D.name) || "").toLowerCase().includes(p) || (((V = I.node) == null ? void 0 : V.id) || "").toLowerCase().includes(p) || (((v = (r = I.node) == null ? void 0 : r.refined) == null ? void 0 : v.name) || "").toLowerCase().includes(p);
        }
      ));
    });
    function S(p) {
      return p.includes(":scm:") ? "mdi-source-branch" : p.includes(":build:") ? "mdi-hammer-wrench" : p.includes(":bt") ? "mdi-bug" : p.includes(":km:") ? "mdi-book-open-variant" : p.includes(":vm") ? "mdi-server" : p.includes(":prov") ? "mdi-cloud" : p.includes(":id") ? "mdi-account-group" : p.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    function F(p) {
      var j, G, I;
      return S(((I = (G = (j = p.node) == null ? void 0 : j.refined) == null ? void 0 : G.refined) == null ? void 0 : I.id) || "");
    }
    function B(p) {
      var D, V, r;
      const j = ((r = (V = (D = p.node) == null ? void 0 : D.refined) == null ? void 0 : V.refined) == null ? void 0 : r.id) || "", G = ["primary", "teal", "indigo", "purple", "orange", "blue-grey", "green"];
      let I = 0;
      for (const v of j) I += v.charCodeAt(0);
      return G[I % G.length];
    }
    async function f() {
      A.value = !0, L.value = null;
      const p = await U.get("rest/subscription");
      Array.isArray(p) ? c.value = p : Array.isArray(p == null ? void 0 : p.data) ? c.value = p.data : c.value = [], A.value = !1;
    }
    return me(() => {
      z.setTitle("Dashboard"), z.setBreadcrumbs([{ title: "Home" }]), f();
    }), (p, j) => {
      const G = n("v-spacer"), I = n("v-text-field"), D = n("v-icon"), V = n("v-btn"), r = n("v-btn-toggle"), v = n("v-chip"), y = n("v-alert"), o = n("v-progress-linear"), E = n("v-tooltip"), x = n("v-table"), Y = n("v-card-text"), ee = n("v-card");
      return m(), J("div", null, [
        u("div", tt, [
          j[6] || (j[6] = u("h1", { class: "text-h4" }, "Dashboard", -1)),
          e(G),
          e(I, {
            modelValue: R.value,
            "onUpdate:modelValue": j[0] || (j[0] = (_) => R.value = _),
            "prepend-inner-icon": "mdi-magnify",
            label: "Filter projects or tools",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field",
            clearable: ""
          }, null, 8, ["modelValue"]),
          e(r, {
            modelValue: N.value,
            "onUpdate:modelValue": j[1] || (j[1] = (_) => N.value = _),
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
                  e(D, null, {
                    default: t(() => [...j[2] || (j[2] = [
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
                  e(D, null, {
                    default: t(() => [...j[3] || (j[3] = [
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
                  e(D, null, {
                    default: t(() => [...j[4] || (j[4] = [
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
            default: t(() => [...j[5] || (j[5] = [
              l(" All projects ", -1)
            ])]),
            _: 1
          })
        ]),
        i.value.length ? (m(), J("div", lt, [
          (m(!0), J(ve, null, ke(i.value, (_) => (m(), M(v, {
            key: _.id,
            color: P.value === _.id ? "primary" : void 0,
            variant: P.value === _.id ? "elevated" : "tonal",
            size: "small",
            onClick: (a) => P.value = P.value === _.id ? null : _.id
          }, {
            default: t(() => [
              e(D, {
                start: "",
                size: "small"
              }, {
                default: t(() => [
                  l(h(_.icon), 1)
                ]),
                _: 2
              }, 1024),
              l(" " + h(_.label) + " ", 1),
              u("span", nt, h(_.count), 1)
            ]),
            _: 2
          }, 1032, ["color", "variant", "onClick"]))), 128))
        ])) : K("", !0),
        L.value ? (m(), M(y, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(L.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        A.value ? (m(), M(o, {
          key: 2,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : K("", !0),
        !A.value && $.value.length === 0 && !L.value ? (m(), M(y, {
          key: 3,
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...j[7] || (j[7] = [
            l(" No projects match the current filter. ", -1)
          ])]),
          _: 1
        })) : K("", !0),
        u("div", {
          class: Fe(["tile-grid", `size-${N.value}`])
        }, [
          (m(!0), J(ve, null, ke($.value, (_) => (m(), M(ee, {
            key: _.id,
            class: "tile",
            hover: "",
            to: `/home/project/${_.id}`
          }, {
            default: t(() => [
              e(Y, { class: "pa-3" }, {
                default: t(() => [
                  u("div", at, [
                    u("div", ot, [
                      u("div", it, h(_.name), 1),
                      u("div", st, h(_.pkey), 1)
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
                  N.value !== "lg" ? (m(), J("div", rt, [
                    (m(!0), J(ve, null, ke(_.subscriptions.slice(0, N.value === "sm" ? 4 : 8), (a) => {
                      var k, Q, X, q;
                      return m(), M(E, {
                        key: a.id,
                        text: `${((Q = (k = a.node) == null ? void 0 : k.refined) == null ? void 0 : Q.name) || "—"} → ${((X = a.node) == null ? void 0 : X.name) || ((q = a.node) == null ? void 0 : q.id)}`,
                        location: "top"
                      }, {
                        activator: t(({ props: g }) => [
                          e(D, Te({ ref_for: !0 }, g, {
                            size: "small",
                            color: B(a),
                            class: "mr-1"
                          }), {
                            default: t(() => [
                              l(h(F(a)), 1)
                            ]),
                            _: 2
                          }, 1040, ["color"])
                        ]),
                        _: 2
                      }, 1032, ["text"]);
                    }), 128)),
                    _.subscriptions.length > (N.value === "sm" ? 4 : 8) ? (m(), J("span", ut, " +" + h(_.subscriptions.length - (N.value === "sm" ? 4 : 8)), 1)) : K("", !0)
                  ])) : (m(), M(x, {
                    key: 1,
                    density: "compact",
                    class: "mt-2",
                    style: { background: "transparent" }
                  }, {
                    default: t(() => [
                      u("tbody", null, [
                        (m(!0), J(ve, null, ke(_.subscriptions, (a) => {
                          var k, Q, X, q;
                          return m(), J("tr", {
                            key: a.id
                          }, [
                            u("td", dt, [
                              e(D, {
                                size: "small",
                                color: B(a)
                              }, {
                                default: t(() => [
                                  l(h(F(a)), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            u("td", ct, h(((Q = (k = a.node) == null ? void 0 : k.refined) == null ? void 0 : Q.name) || "—"), 1),
                            u("td", mt, h(((X = a.node) == null ? void 0 : X.name) || ((q = a.node) == null ? void 0 : q.id)), 1)
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
}, vt = /* @__PURE__ */ we(pt, [["__scopeId", "data-v-3f6316a9"]]);
function Ll(d) {
  if (!d || typeof d != "object") return d;
  for (const U of Object.keys(d)) {
    const z = d[U];
    (z == null || z === "" || z === !1) && delete d[U];
  }
  return d;
}
function El(d) {
  return typeof d != "string" ? "" : d.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Bl(d) {
  return typeof d != "string" ? "" : d.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function ft(d) {
  if (!d) return "??";
  if (d.firstName && d.lastName)
    return d.firstName.charAt(0) + d.lastName.charAt(0);
  if (d.fullName) {
    const z = d.fullName.split(" ");
    return z.length === 1 ? d.fullName.charAt(0) + (d.fullName.length >= 2 ? d.fullName.charAt(1) : "") : z[0].charAt(0) + z[z.length - 1].charAt(0);
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
function ql(d) {
  if (!d) return null;
  const U = d.split(":");
  return U.length > 2 ? U.slice(0, 3).join("-") : null;
}
function Ml(d) {
  if (!d) return null;
  const U = d.split(":");
  return U.length > 1 ? U.slice(0, 2).join("-") : null;
}
function Fl(d) {
  return (d || "").split(":")[1] || null;
}
function Ol(d) {
  return (d || "").split(":")[2] || null;
}
function Gl(d) {
  if (!d) return [];
  const U = d.split(":"), z = [];
  for (let A = 2; A <= U.length; A++)
    z.push(U.slice(0, A).join("-"));
  return z;
}
function _t(d) {
  return d ? (d.service || (d.service = d.refined && _t(d.refined) || d), d.service) : null;
}
function yt(d) {
  return d ? d.tool ? d.tool : d.refined ? (d.tool = d.refined.refined ? yt(d.refined) : d, d.tool) : null : null;
}
const gt = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function bt(d) {
  return d ? d.replace(/[-[()\]${},;_:]/g, " ").replace(gt, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const Hl = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, kt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, wt = { class: "text-caption" }, xt = {
  key: 1,
  class: "text-disabled"
}, Vt = { class: "mb-4" }, Ct = {
  __name: "ProjectListView",
  setup(d) {
    const U = Ue(), z = fe(), A = pe(), { t: L } = Je(), c = Ie("project", { defaultSort: "name" }), R = s(25);
    let P = null, N = {};
    const C = s(null), i = s(!1), $ = s(null), S = s({ name: "", pkey: "", teamLeader: "", description: "" }), F = s(!1), B = s(!1), f = s(null), p = s(!1), j = s(!1);
    let G = "";
    const I = ce(() => [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Description", key: "description", sortable: !1 },
      { title: "Manager", key: "teamLeader", sortable: !1, width: "220px" },
      { title: "Created", key: "createdDate", sortable: !0, width: "140px" },
      { title: "Subs", key: "nbSubscriptions", sortable: !1, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ]), D = {
      required: (a) => !!a || "Required",
      pkey: (a) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(a || "") || "Use lowercase letters, digits, dash"
    };
    function V(a) {
      if (!a) return "";
      const k = typeof a == "number" ? new Date(a) : new Date(a);
      return isNaN(k.getTime()) ? "" : k.toISOString().slice(0, 10);
    }
    function r(a) {
      N = a, c.load(a);
    }
    function v() {
      clearTimeout(P), P = setTimeout(
        () => c.load({ page: 1, itemsPerPage: R.value, sortBy: N.sortBy }),
        300
      );
    }
    function y(a) {
      const k = bt(a || "").split(" ").filter(Boolean);
      return k.length ? k.join("-") : "";
    }
    function o() {
      var k;
      if (((k = $.value) == null ? void 0 : k.nbSubscriptions) > 0) return;
      const a = y(S.value.name);
      (!S.value.pkey || S.value.pkey === G) && (S.value.pkey = a, G = a);
    }
    function E() {
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
    function Y(a) {
      f.value = a, j.value = !1, B.value = !0;
    }
    async function ee() {
      var q, g, H;
      const { valid: a } = await C.value.validate();
      if (!a) return;
      if (c.demoMode.value) {
        i.value = !1;
        return;
      }
      F.value = !0;
      const k = {
        id: (q = $.value) == null ? void 0 : q.id,
        name: S.value.name,
        pkey: S.value.pkey,
        teamLeader: S.value.teamLeader,
        description: S.value.description
      }, Q = (g = $.value) != null && g.id ? "put" : "post", X = await z[Q]("rest/project", k);
      F.value = !1, X !== null && (i.value = !1, !((H = $.value) != null && H.id) && typeof X != "object" ? U.push(`/home/project/${X}`) : c.load(N));
    }
    async function _() {
      if (c.demoMode.value) {
        B.value = !1;
        return;
      }
      p.value = !0;
      const a = j.value ? "?deleteRemoteData=true" : "";
      await z.del(`rest/project/${f.value.id}${a}`), p.value = !1, B.value = !1, c.load(N);
    }
    return me(() => {
      A.setTitle("Projects"), A.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), (a, k) => {
      const Q = n("v-spacer"), X = n("v-text-field"), q = n("v-btn"), g = n("v-alert"), H = n("v-skeleton-loader"), te = n("v-avatar"), W = n("v-chip"), ae = n("v-icon"), re = n("v-data-table-server"), O = n("v-card-title"), oe = n("v-textarea"), ue = n("v-form"), ye = n("v-card-text"), w = n("v-card-actions"), b = n("v-card"), T = n("v-dialog"), se = n("v-checkbox");
      return m(), J("div", null, [
        u("div", kt, [
          k[13] || (k[13] = u("h1", { class: "text-h4" }, "Projects", -1)),
          e(Q),
          e(X, {
            modelValue: ie(c).search.value,
            "onUpdate:modelValue": [
              k[0] || (k[0] = (ne) => ie(c).search.value = ne),
              v
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(q, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: E
          }, {
            default: t(() => [...k[12] || (k[12] = [
              l(" New ", -1)
            ])]),
            _: 1
          })
        ]),
        ie(c).error.value ? (m(), M(g, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(ie(c).error.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        ie(c).demoMode.value ? (m(), M(g, {
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
        ie(c).loading.value && ie(c).items.value.length === 0 ? (m(), M(H, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : K("", !0),
        ie(c).error.value ? K("", !0) : Oe((m(), M(re, {
          key: 3,
          "items-per-page": R.value,
          "onUpdate:itemsPerPage": k[1] || (k[1] = (ne) => R.value = ne),
          headers: I.value,
          items: ie(c).items.value,
          "items-length": ie(c).totalItems.value,
          loading: ie(c).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": r,
          "onClick:row": k[2] || (k[2] = (ne, { item: le }) => ie(U).push(`/home/project/${le.id}`))
        }, {
          "item.teamLeader": t(({ item: ne }) => {
            var le;
            return [
              (le = ne.teamLeader) != null && le.id ? (m(), J(ve, { key: 0 }, [
                e(te, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: t(() => [
                    u("span", wt, h(ie(ft)(ne.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                l(" " + h(ie(Re)(ne.teamLeader)), 1)
              ], 64)) : (m(), J("span", xt, "—"))
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
            e(q, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: xe((le) => x(ne), ["stop"])
            }, {
              default: t(() => [
                e(ae, { size: "small" }, {
                  default: t(() => [...k[15] || (k[15] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(q, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: xe((le) => Y(ne), ["stop"])
            }, {
              default: t(() => [
                e(ae, { size: "small" }, {
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
          [Ge, ie(c).items.value.length > 0 || !ie(c).loading.value]
        ]),
        e(T, {
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
                e(ye, null, {
                  default: t(() => [
                    e(ue, {
                      ref_key: "formRef",
                      ref: C,
                      onSubmit: xe(ee, ["prevent"])
                    }, {
                      default: t(() => {
                        var ne, le;
                        return [
                          e(X, {
                            modelValue: S.value.name,
                            "onUpdate:modelValue": [
                              k[3] || (k[3] = (_e) => S.value.name = _e),
                              o
                            ],
                            label: "Name",
                            rules: [D.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          e(X, {
                            modelValue: S.value.pkey,
                            "onUpdate:modelValue": k[4] || (k[4] = (_e) => S.value.pkey = _e),
                            label: "Project key (pkey)",
                            rules: [D.required, D.pkey],
                            disabled: ((ne = $.value) == null ? void 0 : ne.nbSubscriptions) > 0,
                            hint: ((le = $.value) == null ? void 0 : le.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          e(X, {
                            modelValue: S.value.teamLeader,
                            "onUpdate:modelValue": k[5] || (k[5] = (_e) => S.value.teamLeader = _e),
                            label: "Team leader (user id)",
                            rules: [D.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(oe, {
                            modelValue: S.value.description,
                            "onUpdate:modelValue": k[6] || (k[6] = (_e) => S.value.description = _e),
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
                    e(Q),
                    e(q, {
                      variant: "text",
                      onClick: k[7] || (k[7] = (ne) => i.value = !1)
                    }, {
                      default: t(() => [...k[17] || (k[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(q, {
                      color: "primary",
                      variant: "elevated",
                      loading: F.value,
                      onClick: ee
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
        e(T, {
          modelValue: B.value,
          "onUpdate:modelValue": k[11] || (k[11] = (ne) => B.value = ne),
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
                e(ye, null, {
                  default: t(() => {
                    var ne;
                    return [
                      u("p", Vt, [
                        k[20] || (k[20] = l(" Are you sure you want to delete ", -1)),
                        u("strong", null, h((ne = f.value) == null ? void 0 : ne.name), 1),
                        k[21] || (k[21] = l("? ", -1))
                      ]),
                      e(se, {
                        modelValue: j.value,
                        "onUpdate:modelValue": k[9] || (k[9] = (le) => j.value = le),
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
                    e(Q),
                    e(q, {
                      variant: "text",
                      onClick: k[10] || (k[10] = (ne) => B.value = !1)
                    }, {
                      default: t(() => [...k[22] || (k[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(q, {
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
}, $t = /* @__PURE__ */ we(Ct, [["__scopeId", "data-v-6023d08b"]]), St = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, ht = { class: "text-h4" }, Ut = { class: "text-h6 text-medium-emphasis" }, Pt = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, jt = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, Nt = { key: 0 }, Tt = {
  key: 0,
  class: "ml-1"
}, zt = { key: 1 }, It = {
  key: 0,
  class: "ml-1"
}, At = { key: 2 }, Dt = {
  key: 0,
  class: "ml-1"
}, Rt = { class: "d-flex align-center mb-2" }, Lt = { class: "mb-3" }, Et = {
  __name: "ProjectDetailView",
  setup(d) {
    const U = Ae();
    Ue();
    const z = fe(), A = pe();
    Ze();
    const L = s(!1), c = s(null), R = ce(() => {
      var y;
      return ((y = c.value) == null ? void 0 : y.subscriptions) || [];
    }), P = s(null), N = s(!1), C = s({ name: "", pkey: "", teamLeader: "", description: "" }), i = s(!1), $ = s(!1), S = s(null), F = s(!1), B = s(!1), f = {
      required: (y) => !!y || "Required"
    }, p = [
      { title: "Service", key: "service", sortable: !1, width: "180px" },
      { title: "Tool", key: "tool", sortable: !1, width: "180px" },
      { title: "Node", key: "node", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function j(y) {
      if (!y) return "";
      const o = new Date(y);
      return isNaN(o.getTime()) ? "" : o.toISOString().slice(0, 16).replace("T", " ");
    }
    function G(y) {
      var Y, ee, _;
      const o = ((_ = (ee = (Y = y.node) == null ? void 0 : Y.refined) == null ? void 0 : ee.refined) == null ? void 0 : _.id) || "", E = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let x = 0;
      for (const a of o) x += a.charCodeAt(0);
      return E[x % E.length];
    }
    function I(y) {
      var E, x, Y;
      const o = ((Y = (x = (E = y.node) == null ? void 0 : E.refined) == null ? void 0 : x.refined) == null ? void 0 : Y.id) || "";
      return o.includes(":scm:") ? "mdi-source-branch" : o.includes(":build:") ? "mdi-hammer-wrench" : o.includes(":bt") ? "mdi-bug" : o.includes(":km:") ? "mdi-book-open-variant" : o.includes(":vm") ? "mdi-server" : o.includes(":prov") ? "mdi-cloud" : o.includes(":id") ? "mdi-account-group" : o.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function D() {
      var E;
      L.value = !0;
      const y = U.params.id, o = await z.get(`rest/project/${y}`);
      c.value = o || null, L.value = !1, o && (C.value = {
        name: o.name || "",
        pkey: o.pkey || "",
        teamLeader: ((E = o.teamLeader) == null ? void 0 : E.id) || "",
        description: o.description || ""
      }, A.setTitle(o.name), A.setBreadcrumbs([
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
      await z.put("rest/project", o), i.value = !1, N.value = !1, await D();
    }
    function r(y) {
      S.value = y, F.value = !1, $.value = !0;
    }
    async function v() {
      B.value = !0, await z.del(`rest/subscription/${S.value.id}/${F.value ? "true" : "false"}`), B.value = !1, $.value = !1, await D();
    }
    return ze(() => U.params.id, (y) => {
      y && D();
    }), me(D), (y, o) => {
      const E = n("v-skeleton-loader"), x = n("v-spacer"), Y = n("v-btn"), ee = n("v-icon"), _ = n("v-card-text"), a = n("v-card"), k = n("v-chip"), Q = n("v-alert"), X = n("v-data-table"), q = n("v-card-title"), g = n("v-text-field"), H = n("v-textarea"), te = n("v-form"), W = n("v-card-actions"), ae = n("v-dialog"), re = n("v-checkbox");
      return m(), J("div", null, [
        L.value && !c.value ? (m(), M(E, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : K("", !0),
        c.value ? (m(), J(ve, { key: 1 }, [
          u("div", St, [
            u("div", null, [
              u("h1", ht, [
                l(h(c.value.name) + " ", 1),
                u("span", Ut, "(" + h(c.value.pkey) + ")", 1)
              ]),
              c.value.description ? (m(), J("p", Pt, h(c.value.description), 1)) : K("", !0)
            ]),
            e(x),
            c.value.manageSubscriptions ? (m(), M(Y, {
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
            e(Y, {
              variant: "outlined",
              "prepend-icon": "mdi-pencil",
              onClick: o[0] || (o[0] = (O) => N.value = !0)
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
                  u("div", jt, [
                    c.value.teamLeader ? (m(), J("span", Nt, [
                      e(ee, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[12] || (o[12] = [
                          l("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      o[13] || (o[13] = u("strong", null, "Manager:", -1)),
                      l(" " + h(ie(Re)(c.value.teamLeader)) + " ", 1),
                      c.value.teamLeader.id ? (m(), J("span", Tt, "(" + h(c.value.teamLeader.id) + ")", 1)) : K("", !0)
                    ])) : K("", !0),
                    c.value.createdDate ? (m(), J("span", zt, [
                      e(ee, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[14] || (o[14] = [
                          l("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      o[15] || (o[15] = u("strong", null, "Created:", -1)),
                      l(" " + h(j(c.value.createdDate)) + " ", 1),
                      c.value.createdBy ? (m(), J("span", It, " by " + h(c.value.createdBy.id || c.value.createdBy), 1)) : K("", !0)
                    ])) : K("", !0),
                    c.value.lastModifiedDate ? (m(), J("span", At, [
                      e(ee, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[16] || (o[16] = [
                          l("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      o[17] || (o[17] = u("strong", null, "Updated:", -1)),
                      l(" " + h(j(c.value.lastModifiedDate)) + " ", 1),
                      c.value.lastModifiedBy ? (m(), J("span", Dt, " by " + h(c.value.lastModifiedBy.id || c.value.lastModifiedBy), 1)) : K("", !0)
                    ])) : K("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          u("div", Rt, [
            o[18] || (o[18] = u("h2", { class: "text-h6" }, "Subscriptions", -1)),
            e(k, {
              class: "ml-2",
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(h(R.value.length), 1)
              ]),
              _: 1
            })
          ]),
          R.value.length === 0 ? (m(), M(Q, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: t(() => [...o[19] || (o[19] = [
              l(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (m(), M(X, {
            key: 1,
            headers: p,
            items: R.value,
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
                  var oe, ue, ye;
                  return [
                    e(ee, {
                      start: "",
                      size: "small"
                    }, {
                      default: t(() => [
                        l(h(I(O)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    l(" " + h(((ye = (ue = (oe = O.node) == null ? void 0 : oe.refined) == null ? void 0 : ue.refined) == null ? void 0 : ye.name) || "—"), 1)
                  ];
                }),
                _: 2
              }, 1032, ["color"])
            ]),
            "item.tool": t(({ item: O }) => {
              var oe, ue;
              return [
                l(h(((ue = (oe = O.node) == null ? void 0 : oe.refined) == null ? void 0 : ue.name) || "—"), 1)
              ];
            }),
            "item.node": t(({ item: O }) => {
              var oe;
              return [
                u("code", null, h((oe = O.node) == null ? void 0 : oe.id), 1)
              ];
            }),
            "item.actions": t(({ item: O }) => [
              c.value.manageSubscriptions ? (m(), M(Y, {
                key: 0,
                icon: "",
                size: "small",
                variant: "text",
                color: "error",
                onClick: (oe) => r(O),
                title: "Unsubscribe"
              }, {
                default: t(() => [
                  e(ee, { size: "small" }, {
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
        e(ae, {
          modelValue: N.value,
          "onUpdate:modelValue": o[6] || (o[6] = (O) => N.value = O),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...o[21] || (o[21] = [
                    l("Edit project", -1)
                  ])]),
                  _: 1
                }),
                e(_, null, {
                  default: t(() => [
                    e(te, {
                      ref_key: "formRef",
                      ref: P,
                      onSubmit: xe(V, ["prevent"])
                    }, {
                      default: t(() => {
                        var O;
                        return [
                          e(g, {
                            modelValue: C.value.name,
                            "onUpdate:modelValue": o[1] || (o[1] = (oe) => C.value.name = oe),
                            label: "Name",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(g, {
                            modelValue: C.value.pkey,
                            "onUpdate:modelValue": o[2] || (o[2] = (oe) => C.value.pkey = oe),
                            label: "Project key (pkey)",
                            rules: [f.required],
                            disabled: (((O = c.value) == null ? void 0 : O.nbSubscriptions) || R.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          e(g, {
                            modelValue: C.value.teamLeader,
                            "onUpdate:modelValue": o[3] || (o[3] = (oe) => C.value.teamLeader = oe),
                            label: "Team leader (user id)",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(H, {
                            modelValue: C.value.description,
                            "onUpdate:modelValue": o[4] || (o[4] = (oe) => C.value.description = oe),
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
                    e(Y, {
                      variant: "text",
                      onClick: o[5] || (o[5] = (O) => N.value = !1)
                    }, {
                      default: t(() => [...o[22] || (o[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Y, {
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
        e(ae, {
          modelValue: $.value,
          "onUpdate:modelValue": o[9] || (o[9] = (O) => $.value = O),
          "max-width": "480"
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...o[24] || (o[24] = [
                    l("Unsubscribe", -1)
                  ])]),
                  _: 1
                }),
                e(_, null, {
                  default: t(() => {
                    var O, oe;
                    return [
                      u("p", Lt, [
                        o[25] || (o[25] = l(" Remove subscription to ", -1)),
                        u("strong", null, h((oe = (O = S.value) == null ? void 0 : O.node) == null ? void 0 : oe.name), 1),
                        o[26] || (o[26] = l("? ", -1))
                      ]),
                      e(re, {
                        modelValue: F.value,
                        "onUpdate:modelValue": o[7] || (o[7] = (ue) => F.value = ue),
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
                    e(Y, {
                      variant: "text",
                      onClick: o[8] || (o[8] = (O) => $.value = !1)
                    }, {
                      default: t(() => [...o[27] || (o[27] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Y, {
                      color: "error",
                      variant: "elevated",
                      loading: B.value,
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
}, Bt = { class: "mb-3" }, qt = { class: "code-sample" }, Mt = {
  __name: "ManualView",
  setup(d) {
    const U = pe(), z = he(), A = "/", L = typeof window < "u" ? window.location.origin : "", c = ce(() => z.userName || "<you>");
    return me(() => {
      U.setTitle("Manual"), U.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (R, P) => {
      const N = n("v-icon"), C = n("v-card-title"), i = n("v-card-text"), $ = n("v-card"), S = n("v-list-item"), F = n("v-list"), B = n("v-col"), f = n("router-link");
      n("v-code-block");
      const p = n("v-row");
      return m(), J("div", null, [
        P[12] || (P[12] = u("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        e(p, null, {
          default: t(() => [
            e(B, {
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
                        e(N, null, {
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
                    e(F, {
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
            e(B, {
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
                        e(N, null, {
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
                        u("p", Bt, [
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
                        u("pre", qt, 'curl "' + h(ie(L)) + h(ie(A)) + "rest/project?api-key=<token>&api-user=" + h(c.value) + '"', 1)
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
                        e(N, null, {
                          default: t(() => [...P[10] || (P[10] = [
                            l("mdi-help-circle", -1)
                          ])]),
                          _: 1
                        }),
                        P[11] || (P[11] = l(" More resources ", -1))
                      ]),
                      _: 1
                    }),
                    e(F, {
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
}, Ft = /* @__PURE__ */ we(Mt, [["__scopeId", "data-v-bfb1a017"]]), Ot = { class: "pa-4" }, Gt = {
  __name: "SystemView",
  setup(d) {
    const U = pe(), z = [
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
    }), (A, L) => {
      const c = n("v-list-item"), R = n("v-list");
      return m(), J("div", Ot, [
        L[0] || (L[0] = u("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        e(R, null, {
          default: t(() => [
            (m(), J(ve, null, ke(z, (P) => e(c, {
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
}, Ht = { class: "d-flex align-center mb-4" }, Wt = { class: "mb-3" }, Kt = { class: "d-flex align-center mb-1" }, Jt = { class: "text-caption" }, Zt = { class: "d-flex mt-1 text-caption text-medium-emphasis ga-3" }, Xt = {
  __name: "SystemInfoView",
  setup(d) {
    const U = fe(), z = pe(), A = he(), L = s(!1), c = s(null), R = s(null), P = s(""), N = s(""), C = s(""), i = Ve({
      used: 0,
      committedFree: 0,
      free: 0,
      max: 0,
      pctUsed: 0,
      pctCommittedFree: 0,
      pctFree: 0
    }), $ = Ve({ application: "", default: "", original: "" }), S = ce(() => p("JSESSIONID") || ""), F = ce(() => {
      const V = A.appSettings || {}, r = parseInt(V.buildTimestamp, 10);
      return {
        number: V.buildNumber ?? "",
        timestamp: Number.isNaN(r) ? V.buildTimestamp ?? "" : r,
        date: Number.isNaN(r) ? "" : new Date(r).toISOString().slice(0, 19).replace("T", " "),
        version: V.buildVersion ?? ""
      };
    }), B = ce(
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
    async function j() {
      var r, v, y, o, E, x, Y, ee, _, a, k, Q;
      L.value = !0, c.value = null;
      const V = await U.get("rest/system");
      if (V) {
        P.value = ((r = V.cpu) == null ? void 0 : r.total) ?? "", N.value = (v = V.date) != null && v.date ? new Date(V.date.date).toISOString() : "", C.value = ((y = V.date) == null ? void 0 : y.date) ?? "", $.application = ((o = V.date) == null ? void 0 : o.timeZone) ?? "", $.default = ((E = V.date) == null ? void 0 : E.defaultTimeZone) ?? "", $.original = ((x = V.date) == null ? void 0 : x.originalDefaultTimeZone) ?? "";
        const X = ((Y = V.memory) == null ? void 0 : Y.maxMemory) || (((ee = V.memory) == null ? void 0 : ee.totalMemory) || 0) + 1e6, q = (((_ = V.memory) == null ? void 0 : _.totalMemory) ?? 0) - (((a = V.memory) == null ? void 0 : a.freeMemory) ?? 0), g = ((k = V.memory) == null ? void 0 : k.freeMemory) ?? 0, H = Math.max(0, X - (((Q = V.memory) == null ? void 0 : Q.totalMemory) ?? 0));
        i.used = q, i.committedFree = g, i.free = H, i.max = X, i.pctUsed = G(q / X * 100), i.pctCommittedFree = G(g / X * 100), i.pctFree = G(100 - i.pctUsed - i.pctCommittedFree);
      }
      L.value = !1;
    }
    function G(V) {
      return Math.round(V * 10) / 10;
    }
    async function I(V, r) {
      if (r) {
        R.value = V;
        try {
          await fetch(`/rest/system/timezone/${V}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "text/plain" },
            body: r
          });
        } catch {
        }
        R.value = null;
      }
    }
    async function D(V) {
      try {
        await navigator.clipboard.writeText(V || "");
      } catch {
      }
    }
    return me(() => {
      z.setTitle("System information"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Information" }]), j();
    }), (V, r) => {
      const v = n("v-spacer"), y = n("v-btn"), o = n("v-alert"), E = n("v-icon"), x = n("v-card-title"), Y = n("v-progress-linear"), ee = n("v-tooltip"), _ = n("v-text-field"), a = n("v-col"), k = n("v-row"), Q = n("v-card-text"), X = n("v-card");
      return m(), J("div", null, [
        u("div", Ht, [
          r[8] || (r[8] = u("h1", { class: "text-h4" }, "System information", -1)),
          e(v),
          e(y, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            loading: L.value,
            onClick: j
          }, {
            default: t(() => [...r[7] || (r[7] = [
              l(" Refresh ", -1)
            ])]),
            _: 1
          }, 8, ["loading"])
        ]),
        c.value ? (m(), M(o, {
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
                        e(E, null, {
                          default: t(() => [...r[9] || (r[9] = [
                            l("mdi-server-outline", -1)
                          ])]),
                          _: 1
                        }),
                        r[10] || (r[10] = l(" System ", -1))
                      ]),
                      _: 1
                    }),
                    e(Q, null, {
                      default: t(() => [
                        u("div", Wt, [
                          u("div", Kt, [
                            r[11] || (r[11] = u("span", { class: "text-body-2 text-medium-emphasis flex-grow-1" }, "Memory", -1)),
                            u("span", Jt, h(f(i.used)) + " / " + h(f(i.max)), 1)
                          ]),
                          e(ee, {
                            text: B.value,
                            location: "top"
                          }, {
                            activator: t(({ props: q }) => [
                              u("div", He(We(q)), [
                                e(Y, {
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
                          u("div", Zt, [
                            u("span", null, [
                              e(E, {
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
                              e(E, {
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
                              e(E, {
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
                                  "model-value": N.value,
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
                        e(E, null, {
                          default: t(() => [...r[15] || (r[15] = [
                            l("mdi-map-clock", -1)
                          ])]),
                          _: 1
                        }),
                        r[16] || (r[16] = l(" Time zone ", -1))
                      ]),
                      _: 1
                    }),
                    e(Q, null, {
                      default: t(() => [
                        e(_, {
                          modelValue: $.application,
                          "onUpdate:modelValue": r[0] || (r[0] = (q) => $.application = q),
                          label: "Application",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: R.value === "application",
                          onBlur: r[1] || (r[1] = (q) => I("application", $.application)),
                          onKeyup: r[2] || (r[2] = Se((q) => I("application", $.application), ["enter"]))
                        }, null, 8, ["modelValue", "loading"]),
                        e(_, {
                          modelValue: $.default,
                          "onUpdate:modelValue": r[3] || (r[3] = (q) => $.default = q),
                          label: "System",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: R.value === "default",
                          onBlur: r[4] || (r[4] = (q) => I("default", $.default)),
                          onKeyup: r[5] || (r[5] = Se((q) => I("default", $.default), ["enter"]))
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
                        e(E, null, {
                          default: t(() => [...r[17] || (r[17] = [
                            l("mdi-account-key", -1)
                          ])]),
                          _: 1
                        }),
                        r[18] || (r[18] = l(" Session ", -1))
                      ]),
                      _: 1
                    }),
                    e(Q, null, {
                      default: t(() => [
                        e(_, {
                          "model-value": S.value,
                          label: "Identifier",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          "append-inner-icon": "mdi-content-copy",
                          "onClick:appendInner": r[6] || (r[6] = (q) => D(S.value))
                        }, null, 8, ["model-value"]),
                        e(_, {
                          "model-value": ie(A).userName,
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
                        e(E, null, {
                          default: t(() => [...r[19] || (r[19] = [
                            l("mdi-source-commit", -1)
                          ])]),
                          _: 1
                        }),
                        r[20] || (r[20] = l(" Build ", -1))
                      ]),
                      _: 1
                    }),
                    e(Q, null, {
                      default: t(() => [
                        e(_, {
                          "model-value": F.value.number,
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
                                  "model-value": F.value.timestamp,
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
                                  "model-value": F.value.date,
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
                          "model-value": F.value.version,
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
}, Yt = { class: "system-config-page" }, Qt = { class: "d-flex align-center mb-4" }, el = {
  key: 0,
  class: "text-medium-emphasis"
}, tl = ["title"], ll = {
  __name: "SystemConfigurationView",
  setup(d) {
    const U = fe(), z = pe(), A = s([]), L = s(!1), c = s(null), R = s(""), P = s(""), N = s(!1), C = s(null), i = s(!1), $ = s(null), S = s({ name: "", value: "", system: !1, secured: !1 }), F = s(!1), B = s(!1), f = s(null), p = s(!1), j = { required: (_) => _ !== "" && _ != null || "Required" }, G = [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Value", key: "value", sortable: !1 },
      { title: "", key: "secured", sortable: !0, width: "32px", align: "center" },
      { title: "Source", key: "source", sortable: !0, width: "56px", align: "center" },
      { title: "Actions", key: "actions", sortable: !1, width: "128px", align: "end" }
    ], I = {
      systemEnvironment: "mdi-desktop-classic",
      systemProperties: "mdi-language-java",
      applicationConfig: "mdi-file-code",
      database: "mdi-database",
      classpath: "mdi-file-code-outline"
    };
    function D(_) {
      if (!_) return "mdi-help-circle-outline";
      const a = _.split(":")[0];
      return I[_.includes("classpath") ? "classpath" : a] || "mdi-help-circle-outline";
    }
    function V(_) {
      if (!_.source) return "";
      const a = `Source: ${_.source}`;
      return _.overridden ? `${a} — overridden` : a;
    }
    async function r() {
      L.value = !0, c.value = null;
      const _ = await U.get("rest/system/configuration");
      A.value = Array.isArray(_) ? _ : (_ == null ? void 0 : _.data) || [], A.value.sort((a, k) => String(a.name).localeCompare(String(k.name))), L.value = !1;
    }
    async function v() {
      if (R.value) {
        N.value = !0;
        try {
          const _ = await fetch("/rest/system/security/crypto", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "text/plain" },
            body: R.value
          });
          P.value = _.ok ? await _.text() : "";
        } catch {
          P.value = "";
        } finally {
          N.value = !1;
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
    function E(_) {
      $.value = _, S.value = {
        name: _.name,
        value: _.secured ? "" : _.value ?? "",
        system: !1,
        secured: !!_.secured
      }, i.value = !0;
    }
    function x(_) {
      f.value = _, B.value = !0;
    }
    async function Y() {
      var k;
      const { valid: _ } = await C.value.validate();
      if (!_) return;
      F.value = !0;
      const a = {
        name: S.value.name,
        oldName: ((k = $.value) == null ? void 0 : k.name) || "",
        system: !!S.value.system,
        secured: !!S.value.secured,
        value: S.value.value
      };
      await U.post("rest/system/configuration", a), F.value = !1, i.value = !1, r();
    }
    async function ee() {
      p.value = !0, await U.del(`rest/system/configuration/${encodeURIComponent(f.value.name)}/true`), p.value = !1, B.value = !1, r();
    }
    return me(() => {
      z.setTitle("System configuration"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Configuration" }]), r();
    }), (_, a) => {
      const k = n("v-spacer"), Q = n("v-btn"), X = n("v-icon"), q = n("v-card-title"), g = n("v-text-field"), H = n("v-col"), te = n("v-row"), W = n("v-card-text"), ae = n("v-card"), re = n("v-alert"), O = n("v-tooltip"), oe = n("v-textarea"), ue = n("v-checkbox"), ye = n("v-form"), w = n("v-card-actions"), b = n("v-dialog");
      return m(), J("div", Yt, [
        u("div", Qt, [
          a[12] || (a[12] = u("h1", { class: "text-h4" }, "System configuration", -1)),
          e(k),
          e(Q, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            loading: L.value,
            onClick: r
          }, {
            default: t(() => [...a[10] || (a[10] = [
              l(" Refresh ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(Q, {
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
        e(ae, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(q, { class: "text-subtitle-1 d-flex align-center ga-2" }, {
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
                e(te, { dense: "" }, {
                  default: t(() => [
                    e(H, {
                      cols: "12",
                      md: "5"
                    }, {
                      default: t(() => [
                        e(g, {
                          modelValue: R.value,
                          "onUpdate:modelValue": a[0] || (a[0] = (T) => R.value = T),
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
                        e(Q, {
                          color: "primary",
                          "prepend-icon": "mdi-lock",
                          loading: N.value,
                          disabled: !R.value,
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
                          "onClick:appendInner": a[1] || (a[1] = (T) => y(P.value))
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
        c.value ? (m(), M(re, {
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
        e(ie(Xe), {
          headers: G,
          items: A.value,
          loading: L.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact",
          filename: "configuration.csv",
          class: "configuration-table"
        }, {
          "item.value": t(({ item: T }) => [
            T.secured ? (m(), J("span", el, "•••••")) : (m(), J("code", {
              key: 1,
              class: "config-value",
              title: T.value
            }, h(T.value), 9, tl))
          ]),
          "item.secured": t(({ item: T }) => [
            T.secured ? (m(), M(X, {
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
          "item.source": t(({ item: T }) => [
            T.source ? (m(), M(O, {
              key: 0,
              text: V(T),
              location: "top"
            }, {
              activator: t(({ props: se }) => [
                e(X, Te(se, {
                  size: "small",
                  color: T.overridden ? "warning" : void 0
                }), {
                  default: t(() => [
                    l(h(D(T.source)), 1)
                  ]),
                  _: 2
                }, 1040, ["color"])
              ]),
              _: 2
            }, 1032, ["text"])) : K("", !0),
            T.overridden ? (m(), M(X, {
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
          "item.actions": t(({ item: T }) => [
            e(Q, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (se) => E(T),
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
            e(Q, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (se) => x(T),
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
        e(b, {
          modelValue: i.value,
          "onUpdate:modelValue": a[7] || (a[7] = (T) => i.value = T),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [
                    l(h($.value ? "Edit configuration" : "New configuration"), 1)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(ye, {
                      ref_key: "formRef",
                      ref: C,
                      onSubmit: xe(Y, ["prevent"])
                    }, {
                      default: t(() => [
                        e(g, {
                          modelValue: S.value.name,
                          "onUpdate:modelValue": a[2] || (a[2] = (T) => S.value.name = T),
                          label: "Name",
                          rules: [j.required],
                          variant: "outlined",
                          density: "compact",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(oe, {
                          modelValue: S.value.value,
                          "onUpdate:modelValue": a[3] || (a[3] = (T) => S.value.value = T),
                          label: "Value",
                          rules: [j.required],
                          counter: 1023,
                          maxlength: "1023",
                          rows: "3",
                          variant: "outlined",
                          density: "compact",
                          class: "mb-2"
                        }, null, 8, ["modelValue", "rules"]),
                        e(ue, {
                          modelValue: S.value.system,
                          "onUpdate:modelValue": a[4] || (a[4] = (T) => S.value.system = T),
                          label: "Override system environment / properties",
                          density: "compact",
                          "hide-details": ""
                        }, null, 8, ["modelValue"]),
                        e(ue, {
                          modelValue: S.value.secured,
                          "onUpdate:modelValue": a[5] || (a[5] = (T) => S.value.secured = T),
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
                e(w, null, {
                  default: t(() => [
                    e(k),
                    e(Q, {
                      variant: "text",
                      onClick: a[6] || (a[6] = (T) => i.value = !1)
                    }, {
                      default: t(() => [...a[20] || (a[20] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Q, {
                      color: "primary",
                      variant: "elevated",
                      loading: F.value,
                      onClick: Y
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
        e(b, {
          modelValue: B.value,
          "onUpdate:modelValue": a[9] || (a[9] = (T) => B.value = T),
          "max-width": "440"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...a[22] || (a[22] = [
                    l("Delete configuration", -1)
                  ])]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => {
                    var T;
                    return [
                      a[23] || (a[23] = l(" Remove key ", -1)),
                      u("code", null, h((T = f.value) == null ? void 0 : T.name), 1),
                      a[24] || (a[24] = l("? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(w, null, {
                  default: t(() => [
                    e(k),
                    e(Q, {
                      variant: "text",
                      onClick: a[8] || (a[8] = (T) => B.value = !1)
                    }, {
                      default: t(() => [...a[25] || (a[25] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Q, {
                      color: "error",
                      variant: "elevated",
                      loading: p.value,
                      onClick: ee
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
}, nl = /* @__PURE__ */ we(ll, [["__scopeId", "data-v-47a35e13"]]), al = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, ol = {
  __name: "SystemUserView",
  setup(d) {
    const U = fe(), z = pe(), A = Ie("system/user/roles", { defaultSort: "login" }), L = s(25);
    let c = null, R = {};
    const P = s([]), N = s(null), C = s(!1), i = s(null), $ = s({ login: "", roles: [] }), S = s(!1), F = s(!1), B = s(null), f = s(!1), p = {
      required: (E) => !!E || "Required",
      requiredArray: (E) => Array.isArray(E) && E.length > 0 || "Pick at least one role"
    }, j = [
      { title: "Login", key: "login", sortable: !0, width: "220px" },
      { title: "Roles", key: "roles", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    function G(E) {
      R = E, A.load(E);
    }
    function I() {
      clearTimeout(c), c = setTimeout(
        () => A.load({ page: 1, itemsPerPage: L.value, sortBy: R.sortBy }),
        300
      );
    }
    async function D() {
      const E = await U.get("rest/system/security/role");
      Array.isArray(E) ? P.value = E : Array.isArray(E == null ? void 0 : E.data) && (P.value = E.data);
    }
    function V() {
      i.value = null, $.value = { login: "", roles: [] }, C.value = !0;
    }
    function r(E) {
      i.value = E, $.value = {
        login: E.login,
        roles: (E.roles || []).map((x) => x.id)
      }, C.value = !0;
    }
    function v(E) {
      B.value = E, F.value = !0;
    }
    async function y() {
      const { valid: E } = await N.value.validate();
      if (!E) return;
      S.value = !0;
      const x = { login: $.value.login, roles: $.value.roles }, Y = i.value ? "put" : "post";
      await U[Y]("rest/system/user", x), S.value = !1, C.value = !1, A.load(R);
    }
    async function o() {
      f.value = !0, await U.del(`rest/system/user/${encodeURIComponent(B.value.login)}`), f.value = !1, F.value = !1, A.load(R);
    }
    return me(() => {
      z.setTitle("System users"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]), D();
    }), (E, x) => {
      const Y = n("v-spacer"), ee = n("v-text-field"), _ = n("v-btn"), a = n("v-alert"), k = n("v-chip"), Q = n("v-icon"), X = n("v-data-table-server"), q = n("v-card-title"), g = n("v-autocomplete"), H = n("v-form"), te = n("v-card-text"), W = n("v-card-actions"), ae = n("v-card"), re = n("v-dialog");
      return m(), J("div", null, [
        u("div", al, [
          x[9] || (x[9] = u("h1", { class: "text-h4" }, "System users", -1)),
          e(Y),
          e(ee, {
            modelValue: ie(A).search.value,
            "onUpdate:modelValue": [
              x[0] || (x[0] = (O) => ie(A).search.value = O),
              I
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
        ie(A).error.value ? (m(), M(a, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(ie(A).error.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(X, {
          headers: j,
          items: ie(A).items.value,
          "items-length": ie(A).totalItems.value,
          loading: ie(A).loading.value,
          "items-per-page": L.value,
          "onUpdate:itemsPerPage": x[1] || (x[1] = (O) => L.value = O),
          "item-value": "login",
          hover: "",
          "onUpdate:options": G
        }, {
          "item.roles": t(({ item: O }) => [
            (m(!0), J(ve, null, ke(O.roles || [], (oe) => (m(), M(k, {
              key: oe.id,
              size: "x-small",
              variant: "tonal",
              class: "mr-1"
            }, {
              default: t(() => [
                l(h(oe.name), 1)
              ]),
              _: 2
            }, 1024))), 128))
          ]),
          "item.actions": t(({ item: O }) => [
            e(_, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (oe) => r(O)
            }, {
              default: t(() => [
                e(Q, { size: "small" }, {
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
              onClick: (oe) => v(O)
            }, {
              default: t(() => [
                e(Q, { size: "small" }, {
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
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [
                    l(h(i.value ? "Edit system user" : "New system user"), 1)
                  ]),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => [
                    e(H, {
                      ref_key: "formRef",
                      ref: N,
                      onSubmit: xe(y, ["prevent"])
                    }, {
                      default: t(() => [
                        e(ee, {
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
                    e(Y),
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
          modelValue: F.value,
          "onUpdate:modelValue": x[7] || (x[7] = (O) => F.value = O),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...x[14] || (x[14] = [
                    l("Delete system user", -1)
                  ])]),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => {
                    var O;
                    return [
                      x[15] || (x[15] = l("Remove ", -1)),
                      u("strong", null, h((O = B.value) == null ? void 0 : O.login), 1),
                      x[16] || (x[16] = l(" from system accounts?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(Y),
                    e(_, {
                      variant: "text",
                      onClick: x[6] || (x[6] = (O) => F.value = !1)
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
}, il = /* @__PURE__ */ we(ol, [["__scopeId", "data-v-3bd83da2"]]), sl = { class: "d-flex align-center mb-4" }, rl = {
  __name: "SystemRoleView",
  setup(d) {
    const U = fe(), z = pe(), A = s([]), L = s(!1), c = s(null), R = s(null), P = s(!1), N = s(null), C = s({ name: "", apiPatterns: [], uiPatterns: [] }), i = s(!1), $ = s(!1), S = s(null), F = s(!1), B = { required: (r) => !!r || "Required" }, f = [
      { title: "Name", key: "name", sortable: !0, width: "180px" },
      { title: "API patterns", key: "authApi", sortable: !1 },
      { title: "UI patterns", key: "authUi", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    async function p() {
      L.value = !0, c.value = null;
      const r = await U.get("rest/system/security/role/withAuth"), v = (r == null ? void 0 : r.data) || r || [];
      for (const y of v)
        y["authorizations-api"] = (y.authorizations || []).filter((o) => o.type === "api"), y["authorizations-ui"] = (y.authorizations || []).filter((o) => o.type === "ui");
      A.value = v, L.value = !1;
    }
    function j() {
      N.value = null, C.value = { name: "", apiPatterns: [], uiPatterns: [] }, P.value = !0;
    }
    function G(r) {
      N.value = r, C.value = {
        name: r.name,
        apiPatterns: (r["authorizations-api"] || []).map((v) => v.pattern),
        uiPatterns: (r["authorizations-ui"] || []).map((v) => v.pattern)
      }, P.value = !0;
    }
    function I(r) {
      S.value = r, $.value = !0;
    }
    async function D() {
      var o;
      const { valid: r } = await R.value.validate();
      if (!r) return;
      i.value = !0;
      const v = {
        id: (o = N.value) == null ? void 0 : o.id,
        name: C.value.name,
        authorizations: [
          ...C.value.apiPatterns.map((E) => ({ pattern: E, type: "api" })),
          ...C.value.uiPatterns.map((E) => ({ pattern: E, type: "ui" }))
        ]
      }, y = N.value ? "put" : "post";
      await U[y]("rest/system/security/role", v), i.value = !1, P.value = !1, p();
    }
    async function V() {
      F.value = !0, await U.del(`rest/system/security/role/${S.value.id}`), F.value = !1, $.value = !1, p();
    }
    return me(() => {
      z.setTitle("Roles"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]), p();
    }), (r, v) => {
      const y = n("v-spacer"), o = n("v-btn"), E = n("v-alert"), x = n("v-icon"), Y = n("v-data-table"), ee = n("v-card-title"), _ = n("v-text-field"), a = n("v-combobox"), k = n("v-form"), Q = n("v-card-text"), X = n("v-card-actions"), q = n("v-card"), g = n("v-dialog");
      return m(), J("div", null, [
        u("div", sl, [
          v[8] || (v[8] = u("h1", { class: "text-h4" }, "Roles", -1)),
          e(y),
          e(o, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: j
          }, {
            default: t(() => [...v[7] || (v[7] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        c.value ? (m(), M(E, {
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
        e(Y, {
          headers: f,
          items: A.value,
          loading: L.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.authApi": t(({ item: H }) => [
            (m(!0), J(ve, null, ke(H["authorizations-api"], (te) => (m(), J("code", {
              key: te.id || te.pattern,
              class: "auth-token"
            }, h(te.pattern), 1))), 128))
          ]),
          "item.authUi": t(({ item: H }) => [
            (m(!0), J(ve, null, ke(H["authorizations-ui"], (te) => (m(), J("code", {
              key: te.id || te.pattern,
              class: "auth-token"
            }, h(te.pattern), 1))), 128))
          ]),
          "item.actions": t(({ item: H }) => [
            e(o, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (te) => G(H)
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
              onClick: (te) => I(H)
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
            e(q, null, {
              default: t(() => [
                e(ee, null, {
                  default: t(() => [
                    l(h(N.value ? "Edit role" : "New role"), 1)
                  ]),
                  _: 1
                }),
                e(Q, null, {
                  default: t(() => [
                    e(k, {
                      ref_key: "formRef",
                      ref: R,
                      onSubmit: xe(D, ["prevent"])
                    }, {
                      default: t(() => [
                        e(_, {
                          modelValue: C.value.name,
                          "onUpdate:modelValue": v[0] || (v[0] = (H) => C.value.name = H),
                          label: "Name",
                          rules: [B.required],
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
                      onClick: D
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
            e(q, null, {
              default: t(() => [
                e(ee, null, {
                  default: t(() => [...v[13] || (v[13] = [
                    l("Delete role", -1)
                  ])]),
                  _: 1
                }),
                e(Q, null, {
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
                      loading: F.value,
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
}, ul = /* @__PURE__ */ we(rl, [["__scopeId", "data-v-e3ba71a8"]]), dl = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, cl = { key: 0 }, ml = { key: 0 }, pl = {
  __name: "SystemPluginView",
  setup(d) {
    const U = fe(), z = pe(), A = [
      { id: "central", label: "Maven Central" },
      { id: "nexus", label: "OSSRH Nexus" }
    ], L = s("central"), c = s([]), R = s(!1), P = s(null), N = s(!1), C = s(!1), i = s(!1), $ = s(""), S = s(!1), F = s(!1), B = [
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
      var o, E;
      const y = (E = (o = v.plugin) == null ? void 0 : o.type) == null ? void 0 : E.toLowerCase();
      return y ? y === "feature" ? "mdi-wrench" : y === "service" ? "mdi-puzzle" : y === "tool" ? "mdi-hammer-wrench" : "mdi-puzzle" : "mdi-link-off";
    }
    async function p() {
      R.value = !0, P.value = null;
      const v = await U.get(`rest/system/plugin?repository=${L.value}`);
      c.value = Array.isArray(v) ? v : (v == null ? void 0 : v.data) || [], R.value = !1;
    }
    async function j() {
      N.value = !0, await U.put(`rest/system/plugin/cache?repository=${L.value}`), N.value = !1, p();
    }
    async function G() {
      C.value = !0, await U.put("rest/system/plugin/restart"), C.value = !1;
    }
    async function I(v, y = !1) {
      F.value = !0;
      const o = `repository=${L.value}&javadoc=${y ? !1 : S.value}`;
      await U.post(`rest/system/plugin/${encodeURIComponent(v)}?${o}`), F.value = !1, i.value = !1, $.value = "", S.value = !1, p();
    }
    function D() {
      $.value && I($.value.trim());
    }
    async function V(v) {
      await U.del(`rest/system/plugin/${v.plugin.artifact}/${v.latestLocalVersion}`), p();
    }
    async function r(v) {
      confirm(`Delete plug-in ${v}?`) && (await U.del(`rest/system/plugin/${v}`), p());
    }
    return me(() => {
      z.setTitle("Plug-ins"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plug-ins" }]), p();
    }), (v, y) => {
      const o = n("v-spacer"), E = n("v-select"), x = n("v-btn"), Y = n("v-alert"), ee = n("v-icon"), _ = n("v-chip"), a = n("v-data-table"), k = n("v-card-title"), Q = n("v-text-field"), X = n("v-checkbox"), q = n("v-card-text"), g = n("v-card-actions"), H = n("v-card"), te = n("v-dialog");
      return m(), J("div", null, [
        u("div", dl, [
          y[9] || (y[9] = u("h1", { class: "text-h4" }, "Plugins", -1)),
          e(o),
          e(E, {
            modelValue: L.value,
            "onUpdate:modelValue": [
              y[0] || (y[0] = (W) => L.value = W),
              p
            ],
            items: A,
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
            onClick: j,
            loading: N.value
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
        P.value ? (m(), M(Y, {
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
          headers: B,
          items: c.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.type": t(({ item: W }) => {
            var ae;
            return [
              e(ee, {
                size: "small",
                title: (ae = W.plugin) == null ? void 0 : ae.type
              }, {
                default: t(() => [
                  l(h(f(W)), 1)
                ]),
                _: 2
              }, 1032, ["title"])
            ];
          }),
          "item.version": t(({ item: W }) => {
            var ae;
            return [
              u("span", null, h(((ae = W.plugin) == null ? void 0 : ae.version) || "—"), 1),
              W.latestLocalVersion ? (m(), M(_, {
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
              W.newVersion && W.newVersion !== W.latestLocalVersion ? (m(), M(_, {
                key: 1,
                size: "x-small",
                color: "success",
                class: "ml-1",
                onClick: (re) => I(W.plugin.artifact, !0),
                title: "Upgrade available — click to install"
              }, {
                default: t(() => [
                  e(ee, {
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
            var ae, re;
            return [
              ((re = (ae = W.plugin) == null ? void 0 : ae.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (m(), J("span", cl, h(W.nodes ?? 0), 1)) : K("", !0)
            ];
          }),
          "item.subscriptions": t(({ item: W }) => {
            var ae, re;
            return [
              ((re = (ae = W.plugin) == null ? void 0 : ae.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (m(), J("span", ml, h(W.subscriptions ?? 0), 1)) : K("", !0)
            ];
          }),
          "item.actions": t(({ item: W }) => [
            W.deleted ? (m(), M(ee, {
              key: 0,
              size: "small",
              color: "warning",
              title: "Deletion scheduled"
            }, {
              default: t(() => [...y[11] || (y[11] = [
                l("mdi-cancel", -1)
              ])]),
              _: 1
            })) : (m(), M(x, {
              key: 1,
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (ae) => r(W.plugin.artifact),
              title: "Delete plug-in"
            }, {
              default: t(() => [
                e(ee, { size: "small" }, {
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
        e(te, {
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
                e(q, null, {
                  default: t(() => [
                    e(Q, {
                      modelValue: $.value,
                      "onUpdate:modelValue": y[2] || (y[2] = (W) => $.value = W),
                      label: "Artifact id (e.g. plugin-prov-aws)",
                      variant: "outlined",
                      hint: `Repository: ${L.value}`,
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
                      loading: F.value,
                      disabled: !$.value,
                      onClick: D
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
}, vl = { class: "d-flex align-center mb-4" }, fl = {
  __name: "SystemNodeView",
  setup(d) {
    const U = fe(), z = pe(), A = s([]), L = s(!1), c = s(null), R = s(!1), P = s(null), N = s(!1), C = [
      { title: "Identifier", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Status", key: "status", sortable: !0, width: "120px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function i(B) {
      var p;
      const f = (p = B == null ? void 0 : B.toLowerCase) == null ? void 0 : p.call(B);
      return f === "up" ? "success" : f === "down" ? "error" : f === "unknown" ? "warning" : "grey";
    }
    async function $() {
      L.value = !0, c.value = null;
      const B = await U.get("rest/node");
      A.value = Array.isArray(B) ? B : (B == null ? void 0 : B.data) || [], L.value = !1;
    }
    function S(B) {
      P.value = B, R.value = !0;
    }
    async function F() {
      N.value = !0, await U.del(`rest/node/${encodeURIComponent(P.value.id)}`), N.value = !1, R.value = !1, $();
    }
    return me(() => {
      z.setTitle("Nodes"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]), $();
    }), (B, f) => {
      const p = n("v-spacer"), j = n("v-btn"), G = n("v-alert"), I = n("v-chip"), D = n("v-icon"), V = n("v-data-table"), r = n("v-card-title"), v = n("v-card-text"), y = n("v-card-actions"), o = n("v-card"), E = n("v-dialog");
      return m(), J("div", null, [
        u("div", vl, [
          f[3] || (f[3] = u("h1", { class: "text-h4" }, "Nodes", -1)),
          e(p),
          e(j, {
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
        c.value ? (m(), M(G, {
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
          items: A.value,
          loading: L.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.id": t(({ item: x }) => [
            u("code", null, h(x.id), 1)
          ]),
          "item.status": t(({ item: x }) => [
            x.status ? (m(), M(I, {
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
            e(j, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (Y) => S(x)
            }, {
              default: t(() => [
                e(D, { size: "small" }, {
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
        e(E, {
          modelValue: R.value,
          "onUpdate:modelValue": f[1] || (f[1] = (x) => R.value = x),
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
                    var x, Y;
                    return [
                      f[6] || (f[6] = l(" Delete ", -1)),
                      u("strong", null, h((x = P.value) == null ? void 0 : x.name), 1),
                      f[7] || (f[7] = l(" (", -1)),
                      u("code", null, h((Y = P.value) == null ? void 0 : Y.id), 1),
                      f[8] || (f[8] = l(")? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(y, null, {
                  default: t(() => [
                    e(p),
                    e(j, {
                      variant: "text",
                      onClick: f[0] || (f[0] = (x) => R.value = !1)
                    }, {
                      default: t(() => [...f[9] || (f[9] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(j, {
                      color: "error",
                      variant: "elevated",
                      loading: N.value,
                      onClick: F
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
}, _l = { class: "d-flex align-center mb-4" }, yl = { class: "d-flex align-center ga-2" }, gl = { class: "d-flex align-center ga-2" }, bl = {
  __name: "SystemCacheView",
  setup(d) {
    const U = fe(), z = pe(), A = s([]), L = s(!1), c = s(null), R = s(null), P = [
      { title: "Cache", key: "id", sortable: !0 },
      { title: "Size", key: "size", sortable: !0, width: "100px" },
      { title: "Hits", key: "hitCount", sortable: !0, width: "160px" },
      { title: "Misses", key: "missCount", sortable: !0, width: "160px" },
      { title: "Avg get (ms)", key: "averageGetTime", sortable: !0, width: "140px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function N($, S, F) {
      return S && F === 1 || $ >= 90 ? "success" : $ >= 80 ? "primary" : $ >= 50 ? "warning" : "error";
    }
    async function C() {
      L.value = !0, c.value = null;
      const $ = await U.get("rest/system/cache");
      Array.isArray($) ? A.value = $ : $ === null && (c.value = "Unable to load caches"), L.value = !1;
    }
    async function i($) {
      R.value = $.id, await U.post(`rest/system/cache/${encodeURIComponent($.id)}`), R.value = null, C();
    }
    return me(() => {
      z.setTitle("Caches"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Caches" }]), C();
    }), ($, S) => {
      const F = n("v-spacer"), B = n("v-btn"), f = n("v-alert"), p = n("v-chip"), j = n("v-icon"), G = n("v-data-table");
      return m(), J("div", null, [
        u("div", _l, [
          S[1] || (S[1] = u("h1", { class: "text-h4" }, "Caches", -1)),
          e(F),
          e(B, {
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
        c.value ? (m(), M(f, {
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
          items: A.value,
          loading: L.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.hitCount": t(({ item: I }) => [
            u("div", yl, [
              u("span", null, h(I.hitCount ?? 0), 1),
              I.hitPercentage != null && (I.hitCount ?? 0) > 0 ? (m(), M(p, {
                key: 0,
                size: "x-small",
                color: N(I.hitPercentage, !0, I.hitCount)
              }, {
                default: t(() => [
                  l(h(Math.round(I.hitPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : K("", !0)
            ])
          ]),
          "item.missCount": t(({ item: I }) => [
            u("div", gl, [
              u("span", null, h(I.missCount ?? 0), 1),
              I.missPercentage != null && (I.missCount ?? 0) > 1 ? (m(), M(p, {
                key: 0,
                size: "x-small",
                color: N(100 - I.missPercentage, !1)
              }, {
                default: t(() => [
                  l(h(Math.round(I.missPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : K("", !0)
            ])
          ]),
          "item.averageGetTime": t(({ item: I }) => [
            l(h(I.averageGetTime ?? "—"), 1)
          ]),
          "item.actions": t(({ item: I }) => [
            e(B, {
              icon: "",
              size: "small",
              variant: "text",
              loading: R.value === I.id,
              onClick: (D) => i(I),
              title: "Invalidate cache"
            }, {
              default: t(() => [
                e(j, { size: "small" }, {
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
}, kl = { key: 1 }, wl = {
  __name: "SystemBenchView",
  setup(d) {
    const U = fe(), z = pe(), A = [
      { key: "insert", step: "INSERT", method: "post", url: "rest/system/bench/prepare" },
      { key: "select", step: "SELECT", method: "get", url: "rest/system/bench/read" },
      { key: "select-all", step: "SELECT *", method: "get", url: "rest/system/bench/read/all" },
      { key: "update", step: "UPDATE", method: "put", url: "rest/system/bench/update" },
      { key: "delete", step: "DELETE", method: "del", url: "rest/system/bench/delete" }
    ], L = s(!1), c = s(null), R = s(A.map((N) => ({ step: N.step, duration: null, loading: !1 })));
    async function P() {
      L.value = !0, c.value = null, R.value = A.map((N) => ({ step: N.step, duration: null, loading: !1 }));
      for (let N = 0; N < A.length; N++) {
        R.value[N].loading = !0;
        try {
          const C = A[N].method === "post" || A[N].method === "put" ? void 0 : null, i = C === null ? await U[A[N].method](A[N].url) : await U[A[N].method](A[N].url, C);
          R.value[N].duration = (i == null ? void 0 : i.duration) ?? "—";
        } catch (C) {
          c.value = `${A[N].step} failed: ${C.message || C}`;
          break;
        } finally {
          R.value[N].loading = !1;
        }
      }
      L.value = !1;
    }
    return me(() => {
      z.setTitle("Bench"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (N, C) => {
      const i = n("v-card-text"), $ = n("v-card"), S = n("v-btn"), F = n("v-alert"), B = n("v-progress-circular"), f = n("v-table");
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
          loading: L.value,
          onClick: P
        }, {
          default: t(() => [...C[1] || (C[1] = [
            l(" Run bench ", -1)
          ])]),
          _: 1
        }, 8, ["loading"]),
        c.value ? (m(), M(F, {
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
        R.value.length ? (m(), M(f, {
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
              (m(!0), J(ve, null, ke(R.value, (p) => (m(), J("tr", {
                key: p.step
              }, [
                u("td", null, h(p.step), 1),
                u("td", null, [
                  p.loading ? (m(), M(B, {
                    key: 0,
                    size: "16",
                    width: "2",
                    indeterminate: ""
                  })) : (m(), J("span", kl, h(p.duration ?? "—"), 1))
                ])
              ]))), 128))
            ])
          ]),
          _: 1
        })) : K("", !0)
      ]);
    };
  }
}, xl = { class: "d-flex align-center mb-4" }, Vl = {
  __name: "ApiHomeView",
  setup(d) {
    const U = pe(), z = s(!0), A = s(null), L = "/", c = `${L}rest/swagger-ui-bundle.js`, R = `${L}rest/swagger-ui-standalone-preset.js`, P = `${L}rest/swagger-ui.css`, N = `${L}rest/index.css`, C = `${L}rest/openapi.json`;
    function i() {
      return () => ({
        fn: {
          opsFilter(f, p) {
            const j = p.toLowerCase();
            return f.map((I) => (I._root.entries[1][1] = I._root.entries[1][1].filter((D) => {
              const V = JSON.parse(JSON.stringify(D)), r = (V.operation.summary || "").toString().toLowerCase(), v = (V.operation.description || "").toString().toLowerCase();
              return V.path.toLowerCase().includes(j) || r.includes(j) || v.includes(j);
            }), I)).filter((I) => I._root.entries[1][1].size > 0);
          }
        }
      });
    }
    function $(f, p) {
      if (document.getElementById(p)) return;
      const j = document.createElement("link");
      j.id = p, j.rel = "stylesheet", j.href = f, document.head.appendChild(j);
    }
    function S(f) {
      var p;
      (p = document.getElementById(f)) == null || p.remove();
    }
    function F(f, p) {
      return new Promise((j, G) => {
        if (document.getElementById(p)) {
          j();
          return;
        }
        const D = document.createElement("script");
        D.id = p, D.src = f, D.async = !0, D.onload = j, D.onerror = () => G(new Error(`Failed to load ${f}`)), document.head.appendChild(D);
      });
    }
    function B() {
      const { SwaggerUIBundle: f, SwaggerUIStandalonePreset: p } = window;
      if (!f) {
        A.value = "Swagger UI bundle is unavailable.";
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
      U.setTitle("API"), U.setBreadcrumbs([{ title: "API" }]), $(P, "swagger-ui-css"), $(N, "swagger-ui-extra-css");
      try {
        await Promise.all([
          F(c, "swagger-ui-bundle"),
          F(R, "swagger-ui-preset")
        ]), B();
      } catch (f) {
        A.value = f.message || "Unable to load Swagger UI.";
      } finally {
        z.value = !1;
      }
    }), Ke(() => {
      S("swagger-ui-css"), S("swagger-ui-extra-css"), delete window.ui;
    }), (f, p) => {
      const j = n("v-spacer"), G = n("v-btn"), I = n("v-alert"), D = n("v-progress-linear");
      return m(), J("div", null, [
        u("div", xl, [
          p[1] || (p[1] = u("h1", { class: "text-h4" }, "API reference", -1)),
          e(j),
          e(G, {
            variant: "outlined",
            "prepend-icon": "mdi-code-tags",
            href: `${ie(L)}rest/openapi.json`,
            target: "_blank"
          }, {
            default: t(() => [...p[0] || (p[0] = [
              l(" Download OpenAPI ", -1)
            ])]),
            _: 1
          }, 8, ["href"])
        ]),
        A.value ? (m(), M(I, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(A.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        z.value ? (m(), M(D, {
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
}, Cl = /* @__PURE__ */ we(Vl, [["__scopeId", "data-v-f74586ba"]]), $l = { class: "d-flex align-center mb-4" }, Sl = { class: "mb-0 text-body-2" }, hl = {
  __name: "ApiTokenView",
  setup(d) {
    const U = fe(), z = pe(), A = he(), L = "/", c = typeof window < "u" ? window.location.origin : "", R = ce(() => A.userName || "<you>"), P = s([]), N = s(!1), C = s(null), i = s(!1), $ = s(null), S = s(""), F = s(!1), B = s(!1), f = s(""), p = s(""), j = s(!1), G = s(""), I = s(""), D = s(!1), V = s(!1), r = s(!1), v = s(""), y = s(!1), o = { required: (q) => !!q || "Required" }, E = [
      { title: "Name", key: "name", sortable: !0 },
      { title: "", key: "actions", sortable: !1, width: "140px", align: "end" }
    ];
    async function x() {
      N.value = !0, C.value = null;
      const q = await U.get("rest/api/token");
      P.value = Array.isArray(q) ? q.map((g) => ({ name: g })) : [], N.value = !1;
    }
    function Y() {
      S.value = "", i.value = !0;
    }
    async function ee() {
      const { valid: q } = await $.value.validate();
      if (!q) return;
      F.value = !0;
      const g = await U.post(`rest/api/token/${encodeURIComponent(S.value)}`);
      F.value = !1, g !== null && (f.value = S.value, p.value = typeof g == "string" ? g : (g == null ? void 0 : g.id) || "", i.value = !1, B.value = !0, x());
    }
    async function _(q, g) {
      G.value = q, I.value = "", V.value = !1, j.value = !0, D.value = !0;
      const H = `rest/api/token/${encodeURIComponent(q)}`, te = g === "regen" ? await U.put(H) : await U.get(H);
      I.value = typeof te == "string" ? te : (te == null ? void 0 : te.id) || "", D.value = !1;
    }
    async function a() {
      try {
        await navigator.clipboard.writeText(I.value), V.value = !0, setTimeout(() => {
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
    function Q(q) {
      v.value = q, r.value = !0;
    }
    async function X() {
      y.value = !0, await U.del(`rest/api/token/${encodeURIComponent(v.value)}`), y.value = !1, r.value = !1, x();
    }
    return me(() => {
      z.setTitle("API tokens"), z.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]), x();
    }), (q, g) => {
      const H = n("v-spacer"), te = n("v-btn"), W = n("v-card-text"), ae = n("v-card"), re = n("v-alert"), O = n("v-icon"), oe = n("v-data-table"), ue = n("v-card-title"), ye = n("v-text-field"), w = n("v-form"), b = n("v-card-actions"), T = n("v-dialog"), se = n("v-progress-linear"), ne = n("v-textarea");
      return m(), J("div", null, [
        u("div", $l, [
          g[11] || (g[11] = u("h1", { class: "text-h4" }, "API tokens", -1)),
          e(H),
          e(te, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: Y
          }, {
            default: t(() => [...g[10] || (g[10] = [
              l("New token", -1)
            ])]),
            _: 1
          })
        ]),
        e(ae, {
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
                u("p", Sl, [
                  g[12] || (g[12] = l(" Example: ", -1)),
                  u("code", null, " GET " + h(ie(c)) + h(ie(L)) + "rest/project?api-key=<token>&api-user=" + h(R.value), 1)
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        C.value ? (m(), M(re, {
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
        e(oe, {
          headers: E,
          items: P.value,
          loading: N.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.actions": t(({ item: le }) => [
            e(te, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Show token",
              onClick: (_e) => _(le.name, "load")
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
            e(te, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Regenerate",
              onClick: (_e) => _(le.name, "regen")
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
            e(te, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              title: "Delete",
              onClick: (_e) => Q(le.name)
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
        e(T, {
          modelValue: i.value,
          "onUpdate:modelValue": g[2] || (g[2] = (le) => i.value = le),
          "max-width": "480",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
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
                      onSubmit: xe(ee, ["prevent"])
                    }, {
                      default: t(() => [
                        e(ye, {
                          modelValue: S.value,
                          "onUpdate:modelValue": g[0] || (g[0] = (le) => S.value = le),
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
                    e(te, {
                      variant: "text",
                      onClick: g[1] || (g[1] = (le) => i.value = !1)
                    }, {
                      default: t(() => [...g[18] || (g[18] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(te, {
                      color: "primary",
                      variant: "elevated",
                      loading: F.value,
                      onClick: ee
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
        e(T, {
          modelValue: j.value,
          "onUpdate:modelValue": g[5] || (g[5] = (le) => j.value = le),
          "max-width": "520"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
                  default: t(() => [
                    g[20] || (g[20] = l(" Token: ", -1)),
                    u("code", null, h(G.value), 1)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    D.value ? (m(), M(se, {
                      key: 0,
                      indeterminate: "",
                      color: "primary",
                      class: "mb-3"
                    })) : K("", !0),
                    e(ne, {
                      modelValue: I.value,
                      "onUpdate:modelValue": g[3] || (g[3] = (le) => I.value = le),
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": a
                    }, null, 8, ["modelValue"]),
                    V.value ? (m(), M(re, {
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
                    e(te, {
                      variant: "text",
                      onClick: g[4] || (g[4] = (le) => j.value = !1)
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
        e(T, {
          modelValue: B.value,
          "onUpdate:modelValue": g[7] || (g[7] = (le) => B.value = le),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
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
                    e(te, {
                      color: "primary",
                      onClick: g[6] || (g[6] = (le) => B.value = !1)
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
        e(T, {
          modelValue: r.value,
          "onUpdate:modelValue": g[9] || (g[9] = (le) => r.value = le),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
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
                    e(te, {
                      variant: "text",
                      onClick: g[8] || (g[8] = (le) => r.value = !1)
                    }, {
                      default: t(() => [...g[29] || (g[29] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(te, {
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
}, Ul = { class: "d-flex align-center mb-4" }, Pl = { class: "pa-4" }, jl = { class: "pa-4" }, Nl = { class: "text-body-2 text-medium-emphasis mb-4" }, Tl = { class: "d-flex align-center pa-2" }, zl = {
  __name: "SubscribeWizardView",
  setup(d) {
    const U = Ae(), z = Ue(), A = fe(), L = pe(), c = ce(() => U.query.project ?? U.params.id ?? null), R = s(null), P = s(!1), N = s(null), C = s(1), i = Ve({
      service: null,
      tool: null,
      node: null,
      mode: null
    }), $ = s([]), S = s([]), F = s([]), B = s([]), f = Ve({}), p = s(null), j = s(!1), G = s(!1), I = s(!1), D = s(!1), V = s(!1), r = ce(() => ["Service", "Tool", "Node", "Mode", "Parameters"]), v = ce(() => (w) => w === 1 ? !0 : w === 2 ? !!i.service : w === 3 ? !!i.tool : w === 4 ? !!i.node : w === 5 ? !!i.node && !!i.mode : !1), y = ce(() => C.value === 1 ? !!i.service : C.value === 2 ? !!i.tool : C.value === 3 ? !!i.node : C.value === 4 ? !!i.mode : !1), o = ce(() => {
      var T;
      const w = (T = i.tool) == null ? void 0 : T.mode, b = [];
      return (w === "all" || w === "create") && b.push({ value: "create", label: "Create — provision a new instance inside the tool" }), (w === "all" || w === "link" || !w) && b.push({ value: "link", label: "Link — attach this project to an existing instance" }), b;
    }), E = ce(
      () => R.value ? `/home/project/${R.value.id}` : "/home/project"
    );
    function x(w) {
      return !w.type || w.type === "text" || w.type === "password" || w.type === "node" || w.type === "project";
    }
    function Y(w) {
      return w.type === "password" || (w.name || "").toLowerCase().includes("password");
    }
    function ee(w) {
      const b = w.mandatory || w.required ? " *" : "";
      return `${w.name || w.id}${b}`;
    }
    function _(w) {
      const b = [];
      return (w.mandatory || w.required) && b.push((T) => T !== "" && T != null || "Required"), b;
    }
    async function a() {
      if (!c.value) return;
      P.value = !0;
      const w = await A.get(`rest/project/${c.value}`);
      R.value = w || null, P.value = !1;
    }
    async function k() {
      j.value = !0, $.value = await H("rest/node?refined=service&rows=1000"), j.value = !1;
    }
    async function Q(w) {
      G.value = !0, S.value = await H(`rest/node?refined=${encodeURIComponent(w)}&rows=1000`), G.value = !1;
    }
    async function X(w) {
      I.value = !0, F.value = await H(`rest/node?refined=${encodeURIComponent(w)}&rows=1000`), I.value = !1;
    }
    async function q(w, b) {
      D.value = !0;
      const T = await A.get(`rest/node/${encodeURIComponent(w)}/parameter/${b.toUpperCase()}`);
      B.value = Array.isArray(T) ? T : (T == null ? void 0 : T.data) || [];
      for (const se of Object.keys(f)) delete f[se];
      for (const se of B.value)
        se.defaultValue != null ? f[se.id] = g(se) : se.type === "bool" ? f[se.id] = !1 : se.type === "multiselect" || se.type === "tags" ? f[se.id] = [] : f[se.id] = "";
      D.value = !1;
    }
    function g(w) {
      return w.type === "integer" ? Number(w.defaultValue) : w.type === "bool" ? w.defaultValue === !0 || w.defaultValue === "true" : w.defaultValue;
    }
    async function H(w) {
      const b = await A.get(w);
      return Array.isArray(b) ? te(b) : Array.isArray(b == null ? void 0 : b.data) ? te(b.data) : [];
    }
    function te(w) {
      return w.filter((b) => b.enabled !== !1);
    }
    function W(w) {
      var b;
      ((b = i.service) == null ? void 0 : b.id) !== w.id && (i.service = w, i.tool = null, i.node = null, i.mode = null, S.value = [], F.value = []);
    }
    function ae(w) {
      var b;
      ((b = i.tool) == null ? void 0 : b.id) !== w.id && (i.tool = w, i.node = null, i.mode = null, F.value = []);
    }
    function re(w) {
      var b;
      ((b = i.node) == null ? void 0 : b.id) !== w.id && (i.node = w, i.mode = null);
    }
    ze(C, async (w) => {
      w === 1 && $.value.length === 0 && await k(), w === 2 && i.service && S.value.length === 0 && await Q(i.service.id), w === 3 && i.tool && F.value.length === 0 && await X(i.tool.id), w === 4 && !i.mode && o.value.length > 0 && (i.mode = o.value[0].value), w === 5 && i.node && i.mode && await q(i.node.id, i.mode);
    });
    async function O() {
      const { valid: w } = p.value ? await p.value.validate() : { valid: !0 };
      if (!w) return;
      V.value = !0, N.value = null;
      const b = {
        node: i.node.id,
        project: Number(c.value),
        mode: i.mode,
        parameters: B.value.map((se) => oe(se)).filter(Boolean)
      }, T = await A.post("rest/subscription", b);
      V.value = !1, T != null ? z.push(`/home/project/${c.value}`) : N.value = "Subscription creation failed — please review the highlighted parameters.";
    }
    function oe(w) {
      const b = f[w.id];
      if ((b === "" || b == null || Array.isArray(b) && b.length === 0) && !w.mandatory && !w.required)
        return null;
      const T = { parameter: w.id };
      return w.type === "integer" ? { ...T, integer: Number(b) } : w.type === "bool" ? { ...T, bool: !!b } : w.type === "multiselect" || w.type === "tags" ? { ...T, selections: b || [] } : w.type === "select" ? { ...T, text: b } : { ...T, text: b };
    }
    me(async () => {
      L.setTitle("Subscribe"), L.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        ...c.value ? [{ title: c.value, to: `/home/project/${c.value}` }, { title: "Subscribe" }] : [{ title: "Subscribe" }]
      ]), await a(), R.value && await k();
    });
    const ue = {
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
              (T) => be(
                "button",
                {
                  key: T.id,
                  type: "button",
                  class: [
                    "choice-card",
                    { "choice-card--active": T.id === w.selectedId }
                  ],
                  onClick: () => b("select", T),
                  title: T.description || void 0
                },
                [
                  be("div", { class: "choice-icon" }, ye(T)),
                  be("div", { class: "choice-name" }, T.name || T.id)
                ]
              )
            )
          ) : be("div", { class: "text-body-2 text-medium-emphasis" }, "No entries available.")
        ]);
      }
    };
    function ye(w) {
      var T;
      const b = (w == null ? void 0 : w.uiClasses) || ((T = w == null ? void 0 : w.refined) == null ? void 0 : T.uiClasses);
      return b && b.startsWith("$") ? b.slice(1) : b ? be("i", { class: b }) : be("i", { class: "mdi mdi-puzzle" });
    }
    return (w, b) => {
      const T = n("v-spacer"), se = n("v-btn"), ne = n("router-link"), le = n("v-alert"), _e = n("v-radio"), Le = n("v-radio-group"), Ee = n("v-progress-linear"), Ce = n("v-text-field"), Be = n("v-checkbox"), Pe = n("v-select"), qe = n("v-form"), Me = n("v-stepper");
      return m(), J("div", null, [
        u("div", Ul, [
          b[3] || (b[3] = u("h1", { class: "text-h4" }, "Subscribe", -1)),
          e(T),
          e(se, {
            variant: "text",
            to: E.value
          }, {
            default: t(() => [...b[2] || (b[2] = [
              l("Cancel", -1)
            ])]),
            _: 1
          }, 8, ["to"])
        ]),
        c.value ? P.value ? (m(), M(le, {
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
        })) : R.value ? (m(), M(le, {
          key: 2,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            b[8] || (b[8] = l(" Adding a subscription to ", -1)),
            u("strong", null, h(R.value.name), 1),
            l(" (" + h(R.value.pkey) + "). ", 1),
            b[9] || (b[9] = u("br", null, null, -1)),
            b[10] || (b[10] = u("span", { class: "text-caption text-warning" }, "Subscribing is not an idempotent operation — removing a subscription later may not clean up remote data automatically.", -1))
          ]),
          _: 1
        })) : K("", !0) : (m(), M(le, {
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
        N.value ? (m(), M(le, {
          key: 3,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(N.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        R.value ? (m(), M(Me, {
          key: 4,
          modelValue: C.value,
          "onUpdate:modelValue": b[1] || (b[1] = (de) => C.value = de),
          items: r.value,
          "alt-labels": "",
          editable: v.value,
          class: "mb-4"
        }, {
          "item.1": t(() => {
            var de;
            return [
              e(ue, {
                heading: "Select a service",
                sub: "A service groups features implemented by one or more tools.",
                choices: $.value,
                loading: j.value,
                "selected-id": (de = i.service) == null ? void 0 : de.id,
                onSelect: W
              }, null, 8, ["choices", "loading", "selected-id"])
            ];
          }),
          "item.2": t(() => {
            var de, Z;
            return [
              e(ue, {
                heading: `Select a tool providing ${((de = i.service) == null ? void 0 : de.name) ?? "…"}`,
                sub: "A tool is one implementation of the service; several instances may be deployed.",
                choices: S.value,
                loading: G.value,
                "selected-id": (Z = i.tool) == null ? void 0 : Z.id,
                onSelect: ae
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.3": t(() => {
            var de, Z;
            return [
              e(ue, {
                heading: `Pick a node running ${((de = i.tool) == null ? void 0 : de.name) ?? "…"}`,
                sub: "A node is a running instance of the tool.",
                choices: F.value,
                loading: I.value,
                "selected-id": (Z = i.node) == null ? void 0 : Z.id,
                onSelect: re
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.4": t(() => [
            u("div", Pl, [
              b[11] || (b[11] = u("h3", { class: "text-h6 mb-2" }, "Subscription mode", -1)),
              b[12] || (b[12] = u("p", { class: "text-body-2 text-medium-emphasis mb-4" }, [
                u("strong", null, "Link"),
                l(" attaches this project to an existing instance in the tool. "),
                u("strong", null, "Create"),
                l(" additionally provisions a new instance inside the tool. ")
              ], -1)),
              e(Le, {
                modelValue: i.mode,
                "onUpdate:modelValue": b[0] || (b[0] = (de) => i.mode = de),
                inline: ""
              }, {
                default: t(() => [
                  (m(!0), J(ve, null, ke(o.value, (de) => (m(), M(_e, {
                    key: de.value,
                    value: de.value,
                    label: de.label
                  }, null, 8, ["value", "label"]))), 128))
                ]),
                _: 1
              }, 8, ["modelValue"])
            ])
          ]),
          "item.5": t(() => {
            var de;
            return [
              u("div", jl, [
                b[16] || (b[16] = u("h3", { class: "text-h6 mb-1" }, "Parameters", -1)),
                u("p", Nl, [
                  b[13] || (b[13] = l(" Values required to link the project to ", -1)),
                  u("code", null, h((de = i.node) == null ? void 0 : de.id), 1),
                  b[14] || (b[14] = l(". ", -1))
                ]),
                D.value ? (m(), M(Ee, {
                  key: 0,
                  indeterminate: "",
                  color: "primary",
                  class: "mb-3"
                })) : K("", !0),
                !D.value && B.value.length === 0 ? (m(), M(le, {
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
                    (m(!0), J(ve, null, ke(B.value, (Z) => (m(), J("div", {
                      key: Z.id,
                      class: "mb-3"
                    }, [
                      x(Z) ? (m(), M(Ce, {
                        key: 0,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        type: Y(Z) ? "password" : "text",
                        label: ee(Z),
                        rules: _(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "label", "rules", "hint"])) : Z.type === "integer" ? (m(), M(Ce, {
                        key: 1,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        modelModifiers: { number: !0 },
                        type: "number",
                        min: Z.min,
                        max: Z.max,
                        label: ee(Z),
                        rules: _(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "max", "label", "rules", "hint"])) : Z.type === "bool" ? (m(), M(Be, {
                        key: 2,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        label: ee(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "hint"])) : Z.type === "select" ? (m(), M(Pe, {
                        key: 3,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        items: Z.values || [],
                        label: ee(Z),
                        rules: _(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : Z.type === "multiselect" || Z.type === "tags" ? (m(), M(Pe, {
                        key: 4,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        items: Z.values || [],
                        label: ee(Z),
                        rules: _(Z),
                        hint: Z.description,
                        "persistent-hint": "",
                        chips: "",
                        multiple: "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : (m(), M(Ce, {
                        key: 5,
                        modelValue: f[Z.id],
                        "onUpdate:modelValue": (ge) => f[Z.id] = ge,
                        label: ee(Z),
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
          actions: t(({ prev: de, next: Z }) => [
            u("div", Tl, [
              C.value > 1 ? (m(), M(se, {
                key: 0,
                variant: "text",
                "prepend-icon": "mdi-arrow-left",
                onClick: de
              }, {
                default: t(() => [...b[17] || (b[17] = [
                  l("Previous", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : K("", !0),
              e(T),
              C.value < r.value.length ? (m(), M(se, {
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
              }, 8, ["disabled", "onClick"])) : (m(), M(se, {
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
}, je = /* @__PURE__ */ we(zl, [["__scopeId", "data-v-47b9f499"]]);
if (typeof document < "u") {
  const d = "ligoj-plugin-ui-css";
  if (!document.getElementById(d)) {
    const U = document.createElement("link");
    U.id = d, U.rel = "stylesheet", U.href = new URL(
      /* @vite-ignore */
      "./index.css",
      import.meta.url
    ).href, document.head.appendChild(U);
  }
}
const Il = {
  sample: De.sample
}, Ne = [
  { path: "/home", name: "ui-home", component: vt },
  { path: "/home/manual", name: "ui-manual", component: Ft },
  { path: "/home/project", name: "ui-project-list", component: $t },
  { path: "/home/project/:id", name: "ui-project-detail", component: Et },
  { path: "/system", name: "ui-system", component: Gt },
  { path: "/system/information", name: "ui-system-information", component: Xt },
  { path: "/system/configuration", name: "ui-system-configuration", component: nl },
  { path: "/system/user", name: "ui-system-user", component: il },
  { path: "/system/role", name: "ui-system-role", component: ul },
  { path: "/system/plugin", name: "ui-system-plugin", component: pl },
  { path: "/system/node", name: "ui-system-node", component: fl },
  { path: "/system/cache", name: "ui-system-cache", component: bl },
  { path: "/system/bench", name: "ui-system-bench", component: wl },
  { path: "/api", name: "ui-api", component: Cl },
  { path: "/api/token", name: "ui-api-token", component: hl },
  { path: "/subscribe", name: "ui-subscribe", component: je },
  // Project-scoped entry used by ProjectDetailView's "Add subscription" button.
  { path: "/home/project/:id/subscription", name: "ui-subscribe-project", component: je }
], Wl = {
  id: "ui",
  label: "UI",
  component: et,
  routes: Ne,
  install({ router: d }) {
    for (const U of Ne)
      d.addRoute(U);
  },
  feature(d, ...U) {
    const z = Il[d];
    if (!z) throw new Error(`Plugin "ui" has no feature "${d}"`);
    return z(...U);
  },
  service: De,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  Hl as TARGET_TYPE_ICON,
  Wl as default,
  Re as getFullName,
  Gl as getHierarchyIds,
  _t as getService,
  Ml as getServiceFromId,
  Fl as getServiceNameFromId,
  yt as getTool,
  ql as getToolFromId,
  Ol as getToolNameFromId,
  El as htmlEscape,
  Bl as htmlUnescape,
  bt as normalize,
  De as service,
  ft as toUser2Letters,
  Ll as trimObject
};
