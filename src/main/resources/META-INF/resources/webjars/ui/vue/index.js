import { resolveComponent as n, openBlock as c, createElementBlock as Z, createVNode as e, withCtx as t, createTextVNode as l, ref as s, computed as ce, onMounted as me, createElementVNode as u, Fragment as ve, renderList as ke, createBlock as F, toDisplayString as h, createCommentVNode as K, normalizeClass as Me, mergeProps as je, unref as ie, withDirectives as Oe, withModifiers as xe, vShow as Ge, watch as ze, reactive as Ve, normalizeProps as He, guardReactiveProps as We, withKeys as Se, onBeforeUnmount as Je, h as be } from "vue";
import { useApi as fe, useAppStore as pe, useI18nStore as Ke, useDataTable as Ae, useErrorStore as Ze, useAuthStore as he, LigojDataTable as Xe, LigojDataTableServer as Ye } from "@ligoj/host";
import { useRouter as Ue, useRoute as Ie } from "vue-router";
const we = (d, U) => {
  const z = d.__vccOpts || d;
  for (const [D, L] of U)
    z[D] = L;
  return z;
}, Qe = { class: "plugin-ui-shell" }, et = {
  __name: "UiPlugin",
  setup(d) {
    return (U, z) => {
      const D = n("v-alert"), L = n("v-list-subheader"), m = n("v-list-item"), R = n("v-list");
      return c(), Z("div", Qe, [
        e(D, {
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
            e(m, {
              to: "/home",
              "prepend-icon": "mdi-view-dashboard",
              title: "Overview"
            }),
            e(m, {
              to: "/home/project",
              "prepend-icon": "mdi-folder-multiple",
              title: "Projects"
            }),
            e(m, {
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
            e(m, {
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
            e(m, {
              to: "/api",
              "prepend-icon": "mdi-api",
              title: "API reference"
            }),
            e(m, {
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
            e(m, {
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
}, tt = /* @__PURE__ */ we(et, [["__scopeId", "data-v-9cfeae95"]]), De = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, lt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, nt = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mb-4"
}, at = { class: "ml-1 text-caption" }, ot = { class: "d-flex align-start mb-2" }, it = { class: "flex-grow-1 truncate" }, st = { class: "text-subtitle-1 font-weight-medium truncate" }, rt = { class: "text-caption text-medium-emphasis" }, ut = {
  key: 0,
  class: "sub-strip"
}, dt = {
  key: 0,
  class: "text-caption text-medium-emphasis ml-1"
}, ct = { style: { width: "28px" } }, mt = { class: "truncate" }, pt = { class: "truncate text-medium-emphasis" }, vt = {
  __name: "HomeView",
  setup(d) {
    const U = fe(), z = pe(), D = s(!1), L = s(null), m = s([]), R = s(""), $ = s(null), B = s("md"), V = ce(() => {
      var P, G, A;
      const f = /* @__PURE__ */ new Map();
      for (const I of m.value) {
        const S = ((P = I.project) == null ? void 0 : P.id) ?? I.project;
        if (S == null) continue;
        let r = f.get(S);
        r || (r = {
          id: S,
          name: ((G = I.project) == null ? void 0 : G.name) || String(S),
          pkey: ((A = I.project) == null ? void 0 : A.pkey) || "",
          subscriptions: []
        }, f.set(S, r)), r.subscriptions.push(I);
      }
      return [...f.values()].sort((I, S) => I.name.localeCompare(S.name));
    }), o = ce(() => {
      var P, G, A;
      const f = /* @__PURE__ */ new Map();
      for (const I of m.value) {
        const S = ((A = (G = (P = I.node) == null ? void 0 : P.refined) == null ? void 0 : G.refined) == null ? void 0 : A.id) || "";
        S && f.set(S, (f.get(S) || 0) + 1);
      }
      return [...f.entries()].sort((I, S) => S[1] - I[1]).map(([I, S]) => ({
        id: I,
        count: S,
        icon: C(I),
        label: I.split(":").slice(-1)[0]
      }));
    }), x = ce(() => {
      var P;
      const f = (P = R.value) == null ? void 0 : P.trim().toLowerCase();
      return V.value.filter((G) => $.value && !G.subscriptions.some(
        (I) => {
          var S, r, p;
          return ((p = (r = (S = I.node) == null ? void 0 : S.refined) == null ? void 0 : r.refined) == null ? void 0 : p.id) === $.value;
        }
      ) ? !1 : !f || G.name.toLowerCase().includes(f) || G.pkey.toLowerCase().includes(f) ? !0 : G.subscriptions.some(
        (A) => {
          var I, S, r, p;
          return (((I = A.node) == null ? void 0 : I.name) || "").toLowerCase().includes(f) || (((S = A.node) == null ? void 0 : S.id) || "").toLowerCase().includes(f) || (((p = (r = A.node) == null ? void 0 : r.refined) == null ? void 0 : p.name) || "").toLowerCase().includes(f);
        }
      ));
    });
    function C(f) {
      return f.includes(":scm:") ? "mdi-source-branch" : f.includes(":build:") ? "mdi-hammer-wrench" : f.includes(":bt") ? "mdi-bug" : f.includes(":km:") ? "mdi-book-open-variant" : f.includes(":vm") ? "mdi-server" : f.includes(":prov") ? "mdi-cloud" : f.includes(":id") ? "mdi-account-group" : f.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    function M(f) {
      var P, G, A;
      return C(((A = (G = (P = f.node) == null ? void 0 : P.refined) == null ? void 0 : G.refined) == null ? void 0 : A.id) || "");
    }
    function E(f) {
      var I, S, r;
      const P = ((r = (S = (I = f.node) == null ? void 0 : I.refined) == null ? void 0 : S.refined) == null ? void 0 : r.id) || "", G = ["primary", "teal", "indigo", "purple", "orange", "blue-grey", "green"];
      let A = 0;
      for (const p of P) A += p.charCodeAt(0);
      return G[A % G.length];
    }
    async function v() {
      D.value = !0, L.value = null;
      const f = await U.get("rest/subscription");
      Array.isArray(f) ? m.value = f : Array.isArray(f == null ? void 0 : f.data) ? m.value = f.data : m.value = [], D.value = !1;
    }
    return me(() => {
      z.setTitle("Dashboard"), z.setBreadcrumbs([{ title: "Home" }]), v();
    }), (f, P) => {
      const G = n("v-spacer"), A = n("v-text-field"), I = n("v-icon"), S = n("v-btn"), r = n("v-btn-toggle"), p = n("v-chip"), _ = n("v-alert"), i = n("v-progress-linear"), Y = n("v-tooltip"), N = n("v-table"), T = n("v-card-text"), H = n("v-card");
      return c(), Z("div", null, [
        u("div", lt, [
          P[6] || (P[6] = u("h1", { class: "text-h4" }, "Dashboard", -1)),
          e(G),
          e(A, {
            modelValue: R.value,
            "onUpdate:modelValue": P[0] || (P[0] = (w) => R.value = w),
            "prepend-inner-icon": "mdi-magnify",
            label: "Filter projects or tools",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field",
            clearable: ""
          }, null, 8, ["modelValue"]),
          e(r, {
            modelValue: B.value,
            "onUpdate:modelValue": P[1] || (P[1] = (w) => B.value = w),
            mandatory: "",
            density: "compact",
            color: "primary"
          }, {
            default: t(() => [
              e(S, {
                value: "sm",
                title: "Small tiles"
              }, {
                default: t(() => [
                  e(I, null, {
                    default: t(() => [...P[2] || (P[2] = [
                      l("mdi-view-comfy", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(S, {
                value: "md",
                title: "Medium tiles"
              }, {
                default: t(() => [
                  e(I, null, {
                    default: t(() => [...P[3] || (P[3] = [
                      l("mdi-view-grid", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(S, {
                value: "lg",
                title: "List"
              }, {
                default: t(() => [
                  e(I, null, {
                    default: t(() => [...P[4] || (P[4] = [
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
          e(S, {
            variant: "outlined",
            "prepend-icon": "mdi-folder-multiple",
            to: "/home/project"
          }, {
            default: t(() => [...P[5] || (P[5] = [
              l(" All projects ", -1)
            ])]),
            _: 1
          })
        ]),
        o.value.length ? (c(), Z("div", nt, [
          (c(!0), Z(ve, null, ke(o.value, (w) => (c(), F(p, {
            key: w.id,
            color: $.value === w.id ? "primary" : void 0,
            variant: $.value === w.id ? "elevated" : "tonal",
            size: "small",
            onClick: (a) => $.value = $.value === w.id ? null : w.id
          }, {
            default: t(() => [
              e(I, {
                start: "",
                size: "small"
              }, {
                default: t(() => [
                  l(h(w.icon), 1)
                ]),
                _: 2
              }, 1024),
              l(" " + h(w.label) + " ", 1),
              u("span", at, h(w.count), 1)
            ]),
            _: 2
          }, 1032, ["color", "variant", "onClick"]))), 128))
        ])) : K("", !0),
        L.value ? (c(), F(_, {
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
        D.value ? (c(), F(i, {
          key: 2,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : K("", !0),
        !D.value && x.value.length === 0 && !L.value ? (c(), F(_, {
          key: 3,
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...P[7] || (P[7] = [
            l(" No projects match the current filter. ", -1)
          ])]),
          _: 1
        })) : K("", !0),
        u("div", {
          class: Me(["tile-grid", `size-${B.value}`])
        }, [
          (c(!0), Z(ve, null, ke(x.value, (w) => (c(), F(H, {
            key: w.id,
            class: "tile",
            hover: "",
            to: `/home/project/${w.id}`
          }, {
            default: t(() => [
              e(T, { class: "pa-3" }, {
                default: t(() => [
                  u("div", ot, [
                    u("div", it, [
                      u("div", st, h(w.name), 1),
                      u("div", rt, h(w.pkey), 1)
                    ]),
                    e(p, {
                      size: "x-small",
                      variant: "tonal"
                    }, {
                      default: t(() => [
                        l(h(w.subscriptions.length), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  B.value !== "lg" ? (c(), Z("div", ut, [
                    (c(!0), Z(ve, null, ke(w.subscriptions.slice(0, B.value === "sm" ? 4 : 8), (a) => {
                      var b, ee, Q, q;
                      return c(), F(Y, {
                        key: a.id,
                        text: `${((ee = (b = a.node) == null ? void 0 : b.refined) == null ? void 0 : ee.name) || "—"} → ${((Q = a.node) == null ? void 0 : Q.name) || ((q = a.node) == null ? void 0 : q.id)}`,
                        location: "top"
                      }, {
                        activator: t(({ props: y }) => [
                          e(I, je({ ref_for: !0 }, y, {
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
                    w.subscriptions.length > (B.value === "sm" ? 4 : 8) ? (c(), Z("span", dt, " +" + h(w.subscriptions.length - (B.value === "sm" ? 4 : 8)), 1)) : K("", !0)
                  ])) : (c(), F(N, {
                    key: 1,
                    density: "compact",
                    class: "mt-2",
                    style: { background: "transparent" }
                  }, {
                    default: t(() => [
                      u("tbody", null, [
                        (c(!0), Z(ve, null, ke(w.subscriptions, (a) => {
                          var b, ee, Q, q;
                          return c(), Z("tr", {
                            key: a.id
                          }, [
                            u("td", ct, [
                              e(I, {
                                size: "small",
                                color: E(a)
                              }, {
                                default: t(() => [
                                  l(h(M(a)), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            u("td", mt, h(((ee = (b = a.node) == null ? void 0 : b.refined) == null ? void 0 : ee.name) || "—"), 1),
                            u("td", pt, h(((Q = a.node) == null ? void 0 : Q.name) || ((q = a.node) == null ? void 0 : q.id)), 1)
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
}, ft = /* @__PURE__ */ we(vt, [["__scopeId", "data-v-3f6316a9"]]);
function El(d) {
  if (!d || typeof d != "object") return d;
  for (const U of Object.keys(d)) {
    const z = d[U];
    (z == null || z === "" || z === !1) && delete d[U];
  }
  return d;
}
function Bl(d) {
  return typeof d != "string" ? "" : d.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function ql(d) {
  return typeof d != "string" ? "" : d.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function yt(d) {
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
function Fl(d) {
  if (!d) return null;
  const U = d.split(":");
  return U.length > 2 ? U.slice(0, 3).join("-") : null;
}
function Ml(d) {
  if (!d) return null;
  const U = d.split(":");
  return U.length > 1 ? U.slice(0, 2).join("-") : null;
}
function Ol(d) {
  return (d || "").split(":")[1] || null;
}
function Gl(d) {
  return (d || "").split(":")[2] || null;
}
function Hl(d) {
  if (!d) return [];
  const U = d.split(":"), z = [];
  for (let D = 2; D <= U.length; D++)
    z.push(U.slice(0, D).join("-"));
  return z;
}
function _t(d) {
  return d ? (d.service || (d.service = d.refined && _t(d.refined) || d), d.service) : null;
}
function gt(d) {
  return d ? d.tool ? d.tool : d.refined ? (d.tool = d.refined.refined ? gt(d.refined) : d, d.tool) : null : null;
}
const bt = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function kt(d) {
  return d ? d.replace(/[-[()\]${},;_:]/g, " ").replace(bt, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const Wl = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, wt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, xt = { class: "text-caption" }, Vt = {
  key: 1,
  class: "text-disabled"
}, Ct = { class: "mb-4" }, $t = {
  __name: "ProjectListView",
  setup(d) {
    const U = Ue(), z = fe(), D = pe(), { t: L } = Ke(), m = Ae("project", { defaultSort: "name" }), R = s(25);
    let $ = null, B = {};
    const V = s(null), o = s(!1), x = s(null), C = s({ name: "", pkey: "", teamLeader: "", description: "" }), M = s(!1), E = s(!1), v = s(null), f = s(!1), P = s(!1);
    let G = "";
    const A = ce(() => [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Description", key: "description", sortable: !1 },
      { title: "Manager", key: "teamLeader", sortable: !1, width: "220px" },
      { title: "Created", key: "createdDate", sortable: !0, width: "140px" },
      { title: "Subs", key: "nbSubscriptions", sortable: !1, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ]), I = {
      required: (a) => !!a || "Required",
      pkey: (a) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(a || "") || "Use lowercase letters, digits, dash"
    };
    function S(a) {
      if (!a) return "";
      const b = typeof a == "number" ? new Date(a) : new Date(a);
      return isNaN(b.getTime()) ? "" : b.toISOString().slice(0, 10);
    }
    function r(a) {
      B = a, m.load(a);
    }
    function p() {
      clearTimeout($), $ = setTimeout(
        () => m.load({ page: 1, itemsPerPage: R.value, sortBy: B.sortBy }),
        300
      );
    }
    function _(a) {
      const b = kt(a || "").split(" ").filter(Boolean);
      return b.length ? b.join("-") : "";
    }
    function i() {
      var b;
      if (((b = x.value) == null ? void 0 : b.nbSubscriptions) > 0) return;
      const a = _(C.value.name);
      (!C.value.pkey || C.value.pkey === G) && (C.value.pkey = a, G = a);
    }
    function Y() {
      x.value = null, C.value = { name: "", pkey: "", teamLeader: "", description: "" }, G = "", o.value = !0;
    }
    function N(a) {
      var b;
      x.value = a, C.value = {
        name: a.name || "",
        pkey: a.pkey || "",
        teamLeader: ((b = a.teamLeader) == null ? void 0 : b.id) || "",
        description: a.description || ""
      }, G = a.pkey || "", o.value = !0;
    }
    function T(a) {
      v.value = a, P.value = !1, E.value = !0;
    }
    async function H() {
      var q, y, W;
      const { valid: a } = await V.value.validate();
      if (!a) return;
      if (m.demoMode.value) {
        o.value = !1;
        return;
      }
      M.value = !0;
      const b = {
        id: (q = x.value) == null ? void 0 : q.id,
        name: C.value.name,
        pkey: C.value.pkey,
        teamLeader: C.value.teamLeader,
        description: C.value.description
      }, ee = (y = x.value) != null && y.id ? "put" : "post", Q = await z[ee]("rest/project", b);
      M.value = !1, Q !== null && (o.value = !1, !((W = x.value) != null && W.id) && typeof Q != "object" ? U.push(`/home/project/${Q}`) : m.load(B));
    }
    async function w() {
      if (m.demoMode.value) {
        E.value = !1;
        return;
      }
      f.value = !0;
      const a = P.value ? "?deleteRemoteData=true" : "";
      await z.del(`rest/project/${v.value.id}${a}`), f.value = !1, E.value = !1, m.load(B);
    }
    return me(() => {
      D.setTitle("Projects"), D.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), (a, b) => {
      const ee = n("v-spacer"), Q = n("v-text-field"), q = n("v-btn"), y = n("v-alert"), W = n("v-skeleton-loader"), te = n("v-avatar"), J = n("v-chip"), ae = n("v-icon"), re = n("v-data-table-server"), O = n("v-card-title"), oe = n("v-textarea"), ue = n("v-form"), _e = n("v-card-text"), k = n("v-card-actions"), g = n("v-card"), j = n("v-dialog"), se = n("v-checkbox");
      return c(), Z("div", null, [
        u("div", wt, [
          b[13] || (b[13] = u("h1", { class: "text-h4" }, "Projects", -1)),
          e(ee),
          e(Q, {
            modelValue: ie(m).search.value,
            "onUpdate:modelValue": [
              b[0] || (b[0] = (ne) => ie(m).search.value = ne),
              p
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
            onClick: Y
          }, {
            default: t(() => [...b[12] || (b[12] = [
              l(" New ", -1)
            ])]),
            _: 1
          })
        ]),
        ie(m).error.value ? (c(), F(y, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(ie(m).error.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        ie(m).demoMode.value ? (c(), F(y, {
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
        ie(m).loading.value && ie(m).items.value.length === 0 ? (c(), F(W, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : K("", !0),
        ie(m).error.value ? K("", !0) : Oe((c(), F(re, {
          key: 3,
          "items-per-page": R.value,
          "onUpdate:itemsPerPage": b[1] || (b[1] = (ne) => R.value = ne),
          headers: A.value,
          items: ie(m).items.value,
          "items-length": ie(m).totalItems.value,
          loading: ie(m).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": r,
          "onClick:row": b[2] || (b[2] = (ne, { item: le }) => ie(U).push(`/home/project/${le.id}`))
        }, {
          "item.teamLeader": t(({ item: ne }) => {
            var le;
            return [
              (le = ne.teamLeader) != null && le.id ? (c(), Z(ve, { key: 0 }, [
                e(te, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: t(() => [
                    u("span", xt, h(ie(yt)(ne.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                l(" " + h(ie(Re)(ne.teamLeader)), 1)
              ], 64)) : (c(), Z("span", Vt, "—"))
            ];
          }),
          "item.createdDate": t(({ item: ne }) => [
            l(h(S(ne.createdDate)), 1)
          ]),
          "item.nbSubscriptions": t(({ item: ne }) => [
            e(J, {
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
              onClick: xe((le) => N(ne), ["stop"])
            }, {
              default: t(() => [
                e(ae, { size: "small" }, {
                  default: t(() => [...b[15] || (b[15] = [
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
              onClick: xe((le) => T(ne), ["stop"])
            }, {
              default: t(() => [
                e(ae, { size: "small" }, {
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
          [Ge, ie(m).items.value.length > 0 || !ie(m).loading.value]
        ]),
        e(j, {
          modelValue: o.value,
          "onUpdate:modelValue": b[8] || (b[8] = (ne) => o.value = ne),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(g, null, {
              default: t(() => [
                e(O, null, {
                  default: t(() => {
                    var ne;
                    return [
                      l(h((ne = x.value) != null && ne.id ? "Edit project" : "New project"), 1)
                    ];
                  }),
                  _: 1
                }),
                e(_e, null, {
                  default: t(() => [
                    e(ue, {
                      ref_key: "formRef",
                      ref: V,
                      onSubmit: xe(H, ["prevent"])
                    }, {
                      default: t(() => {
                        var ne, le;
                        return [
                          e(Q, {
                            modelValue: C.value.name,
                            "onUpdate:modelValue": [
                              b[3] || (b[3] = (ye) => C.value.name = ye),
                              i
                            ],
                            label: "Name",
                            rules: [I.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          e(Q, {
                            modelValue: C.value.pkey,
                            "onUpdate:modelValue": b[4] || (b[4] = (ye) => C.value.pkey = ye),
                            label: "Project key (pkey)",
                            rules: [I.required, I.pkey],
                            disabled: ((ne = x.value) == null ? void 0 : ne.nbSubscriptions) > 0,
                            hint: ((le = x.value) == null ? void 0 : le.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          e(Q, {
                            modelValue: C.value.teamLeader,
                            "onUpdate:modelValue": b[5] || (b[5] = (ye) => C.value.teamLeader = ye),
                            label: "Team leader (user id)",
                            rules: [I.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(oe, {
                            modelValue: C.value.description,
                            "onUpdate:modelValue": b[6] || (b[6] = (ye) => C.value.description = ye),
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
                e(k, null, {
                  default: t(() => [
                    e(ee),
                    e(q, {
                      variant: "text",
                      onClick: b[7] || (b[7] = (ne) => o.value = !1)
                    }, {
                      default: t(() => [...b[17] || (b[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(q, {
                      color: "primary",
                      variant: "elevated",
                      loading: M.value,
                      onClick: H
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
        e(j, {
          modelValue: E.value,
          "onUpdate:modelValue": b[11] || (b[11] = (ne) => E.value = ne),
          "max-width": "500"
        }, {
          default: t(() => [
            e(g, null, {
              default: t(() => [
                e(O, null, {
                  default: t(() => [...b[19] || (b[19] = [
                    l("Delete project", -1)
                  ])]),
                  _: 1
                }),
                e(_e, null, {
                  default: t(() => {
                    var ne;
                    return [
                      u("p", Ct, [
                        b[20] || (b[20] = l(" Are you sure you want to delete ", -1)),
                        u("strong", null, h((ne = v.value) == null ? void 0 : ne.name), 1),
                        b[21] || (b[21] = l("? ", -1))
                      ]),
                      e(se, {
                        modelValue: P.value,
                        "onUpdate:modelValue": b[9] || (b[9] = (le) => P.value = le),
                        label: "Also remove remote data associated with this project's subscriptions",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(k, null, {
                  default: t(() => [
                    e(ee),
                    e(q, {
                      variant: "text",
                      onClick: b[10] || (b[10] = (ne) => E.value = !1)
                    }, {
                      default: t(() => [...b[22] || (b[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(q, {
                      color: "error",
                      variant: "elevated",
                      loading: f.value,
                      onClick: w
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
}, St = /* @__PURE__ */ we($t, [["__scopeId", "data-v-6023d08b"]]), ht = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, Ut = { class: "text-h4" }, Pt = { class: "text-h6 text-medium-emphasis" }, Tt = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, Nt = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, jt = { key: 0 }, zt = {
  key: 0,
  class: "ml-1"
}, At = { key: 1 }, It = {
  key: 0,
  class: "ml-1"
}, Dt = { key: 2 }, Rt = {
  key: 0,
  class: "ml-1"
}, Lt = { class: "d-flex align-center mb-2" }, Et = { class: "mb-3" }, Bt = {
  __name: "ProjectDetailView",
  setup(d) {
    const U = Ie();
    Ue();
    const z = fe(), D = pe();
    Ze();
    const L = s(!1), m = s(null), R = ce(() => {
      var _;
      return ((_ = m.value) == null ? void 0 : _.subscriptions) || [];
    }), $ = s(null), B = s(!1), V = s({ name: "", pkey: "", teamLeader: "", description: "" }), o = s(!1), x = s(!1), C = s(null), M = s(!1), E = s(!1), v = {
      required: (_) => !!_ || "Required"
    }, f = [
      { title: "Service", key: "service", sortable: !1, width: "180px" },
      { title: "Tool", key: "tool", sortable: !1, width: "180px" },
      { title: "Node", key: "node", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function P(_) {
      if (!_) return "";
      const i = new Date(_);
      return isNaN(i.getTime()) ? "" : i.toISOString().slice(0, 16).replace("T", " ");
    }
    function G(_) {
      var T, H, w;
      const i = ((w = (H = (T = _.node) == null ? void 0 : T.refined) == null ? void 0 : H.refined) == null ? void 0 : w.id) || "", Y = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let N = 0;
      for (const a of i) N += a.charCodeAt(0);
      return Y[N % Y.length];
    }
    function A(_) {
      var Y, N, T;
      const i = ((T = (N = (Y = _.node) == null ? void 0 : Y.refined) == null ? void 0 : N.refined) == null ? void 0 : T.id) || "";
      return i.includes(":scm:") ? "mdi-source-branch" : i.includes(":build:") ? "mdi-hammer-wrench" : i.includes(":bt") ? "mdi-bug" : i.includes(":km:") ? "mdi-book-open-variant" : i.includes(":vm") ? "mdi-server" : i.includes(":prov") ? "mdi-cloud" : i.includes(":id") ? "mdi-account-group" : i.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function I() {
      var Y;
      L.value = !0;
      const _ = U.params.id, i = await z.get(`rest/project/${_}`);
      m.value = i || null, L.value = !1, i && (V.value = {
        name: i.name || "",
        pkey: i.pkey || "",
        teamLeader: ((Y = i.teamLeader) == null ? void 0 : Y.id) || "",
        description: i.description || ""
      }, D.setTitle(i.name), D.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        { title: i.name }
      ]));
    }
    async function S() {
      const { valid: _ } = await $.value.validate();
      if (!_) return;
      o.value = !0;
      const i = {
        id: m.value.id,
        name: V.value.name,
        pkey: V.value.pkey,
        teamLeader: V.value.teamLeader,
        description: V.value.description
      };
      await z.put("rest/project", i), o.value = !1, B.value = !1, await I();
    }
    function r(_) {
      C.value = _, M.value = !1, x.value = !0;
    }
    async function p() {
      E.value = !0, await z.del(`rest/subscription/${C.value.id}/${M.value ? "true" : "false"}`), E.value = !1, x.value = !1, await I();
    }
    return ze(() => U.params.id, (_) => {
      _ && I();
    }), me(I), (_, i) => {
      const Y = n("v-skeleton-loader"), N = n("v-spacer"), T = n("v-btn"), H = n("v-icon"), w = n("v-card-text"), a = n("v-card"), b = n("v-chip"), ee = n("v-alert"), Q = n("v-data-table"), q = n("v-card-title"), y = n("v-text-field"), W = n("v-textarea"), te = n("v-form"), J = n("v-card-actions"), ae = n("v-dialog"), re = n("v-checkbox");
      return c(), Z("div", null, [
        L.value && !m.value ? (c(), F(Y, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : K("", !0),
        m.value ? (c(), Z(ve, { key: 1 }, [
          u("div", ht, [
            u("div", null, [
              u("h1", Ut, [
                l(h(m.value.name) + " ", 1),
                u("span", Pt, "(" + h(m.value.pkey) + ")", 1)
              ]),
              m.value.description ? (c(), Z("p", Tt, h(m.value.description), 1)) : K("", !0)
            ]),
            e(N),
            m.value.manageSubscriptions ? (c(), F(T, {
              key: 0,
              color: "primary",
              "prepend-icon": "mdi-plus",
              to: `/home/project/${m.value.id}/subscription`
            }, {
              default: t(() => [...i[10] || (i[10] = [
                l(" Add subscription ", -1)
              ])]),
              _: 1
            }, 8, ["to"])) : K("", !0),
            e(T, {
              variant: "outlined",
              "prepend-icon": "mdi-pencil",
              onClick: i[0] || (i[0] = (O) => B.value = !0)
            }, {
              default: t(() => [...i[11] || (i[11] = [
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
              e(w, { class: "py-2" }, {
                default: t(() => [
                  u("div", Nt, [
                    m.value.teamLeader ? (c(), Z("span", jt, [
                      e(H, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...i[12] || (i[12] = [
                          l("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      i[13] || (i[13] = u("strong", null, "Manager:", -1)),
                      l(" " + h(ie(Re)(m.value.teamLeader)) + " ", 1),
                      m.value.teamLeader.id ? (c(), Z("span", zt, "(" + h(m.value.teamLeader.id) + ")", 1)) : K("", !0)
                    ])) : K("", !0),
                    m.value.createdDate ? (c(), Z("span", At, [
                      e(H, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...i[14] || (i[14] = [
                          l("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      i[15] || (i[15] = u("strong", null, "Created:", -1)),
                      l(" " + h(P(m.value.createdDate)) + " ", 1),
                      m.value.createdBy ? (c(), Z("span", It, " by " + h(m.value.createdBy.id || m.value.createdBy), 1)) : K("", !0)
                    ])) : K("", !0),
                    m.value.lastModifiedDate ? (c(), Z("span", Dt, [
                      e(H, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...i[16] || (i[16] = [
                          l("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      i[17] || (i[17] = u("strong", null, "Updated:", -1)),
                      l(" " + h(P(m.value.lastModifiedDate)) + " ", 1),
                      m.value.lastModifiedBy ? (c(), Z("span", Rt, " by " + h(m.value.lastModifiedBy.id || m.value.lastModifiedBy), 1)) : K("", !0)
                    ])) : K("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          u("div", Lt, [
            i[18] || (i[18] = u("h2", { class: "text-h6" }, "Subscriptions", -1)),
            e(b, {
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
          R.value.length === 0 ? (c(), F(ee, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: t(() => [...i[19] || (i[19] = [
              l(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (c(), F(Q, {
            key: 1,
            headers: f,
            items: R.value,
            "item-value": "id",
            "items-per-page": -1,
            "hide-default-footer": "",
            density: "compact"
          }, {
            "item.service": t(({ item: O }) => [
              e(b, {
                size: "small",
                variant: "tonal",
                color: G(O)
              }, {
                default: t(() => {
                  var oe, ue, _e;
                  return [
                    e(H, {
                      start: "",
                      size: "small"
                    }, {
                      default: t(() => [
                        l(h(A(O)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    l(" " + h(((_e = (ue = (oe = O.node) == null ? void 0 : oe.refined) == null ? void 0 : ue.refined) == null ? void 0 : _e.name) || "—"), 1)
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
              m.value.manageSubscriptions ? (c(), F(T, {
                key: 0,
                icon: "",
                size: "small",
                variant: "text",
                color: "error",
                onClick: (oe) => r(O),
                title: "Unsubscribe"
              }, {
                default: t(() => [
                  e(H, { size: "small" }, {
                    default: t(() => [...i[20] || (i[20] = [
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
          modelValue: B.value,
          "onUpdate:modelValue": i[6] || (i[6] = (O) => B.value = O),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...i[21] || (i[21] = [
                    l("Edit project", -1)
                  ])]),
                  _: 1
                }),
                e(w, null, {
                  default: t(() => [
                    e(te, {
                      ref_key: "formRef",
                      ref: $,
                      onSubmit: xe(S, ["prevent"])
                    }, {
                      default: t(() => {
                        var O;
                        return [
                          e(y, {
                            modelValue: V.value.name,
                            "onUpdate:modelValue": i[1] || (i[1] = (oe) => V.value.name = oe),
                            label: "Name",
                            rules: [v.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(y, {
                            modelValue: V.value.pkey,
                            "onUpdate:modelValue": i[2] || (i[2] = (oe) => V.value.pkey = oe),
                            label: "Project key (pkey)",
                            rules: [v.required],
                            disabled: (((O = m.value) == null ? void 0 : O.nbSubscriptions) || R.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          e(y, {
                            modelValue: V.value.teamLeader,
                            "onUpdate:modelValue": i[3] || (i[3] = (oe) => V.value.teamLeader = oe),
                            label: "Team leader (user id)",
                            rules: [v.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(W, {
                            modelValue: V.value.description,
                            "onUpdate:modelValue": i[4] || (i[4] = (oe) => V.value.description = oe),
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
                e(J, null, {
                  default: t(() => [
                    e(N),
                    e(T, {
                      variant: "text",
                      onClick: i[5] || (i[5] = (O) => B.value = !1)
                    }, {
                      default: t(() => [...i[22] || (i[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(T, {
                      color: "primary",
                      variant: "elevated",
                      loading: o.value,
                      onClick: S
                    }, {
                      default: t(() => [...i[23] || (i[23] = [
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
          modelValue: x.value,
          "onUpdate:modelValue": i[9] || (i[9] = (O) => x.value = O),
          "max-width": "480"
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...i[24] || (i[24] = [
                    l("Unsubscribe", -1)
                  ])]),
                  _: 1
                }),
                e(w, null, {
                  default: t(() => {
                    var O, oe;
                    return [
                      u("p", Et, [
                        i[25] || (i[25] = l(" Remove subscription to ", -1)),
                        u("strong", null, h((oe = (O = C.value) == null ? void 0 : O.node) == null ? void 0 : oe.name), 1),
                        i[26] || (i[26] = l("? ", -1))
                      ]),
                      e(re, {
                        modelValue: M.value,
                        "onUpdate:modelValue": i[7] || (i[7] = (ue) => M.value = ue),
                        label: "Also delete remote data on the target service",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(J, null, {
                  default: t(() => [
                    e(N),
                    e(T, {
                      variant: "text",
                      onClick: i[8] || (i[8] = (O) => x.value = !1)
                    }, {
                      default: t(() => [...i[27] || (i[27] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(T, {
                      color: "error",
                      variant: "elevated",
                      loading: E.value,
                      onClick: p
                    }, {
                      default: t(() => [...i[28] || (i[28] = [
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
}, qt = { class: "mb-3" }, Ft = { class: "code-sample" }, Mt = {
  __name: "ManualView",
  setup(d) {
    const U = pe(), z = he(), D = "/", L = typeof window < "u" ? window.location.origin : "", m = ce(() => z.userName || "<you>");
    return me(() => {
      U.setTitle("Manual"), U.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (R, $) => {
      const B = n("v-icon"), V = n("v-card-title"), o = n("v-card-text"), x = n("v-card"), C = n("v-list-item"), M = n("v-list"), E = n("v-col"), v = n("router-link");
      n("v-code-block");
      const f = n("v-row");
      return c(), Z("div", null, [
        $[12] || ($[12] = u("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        e(f, null, {
          default: t(() => [
            e(E, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(x, {
                  variant: "tonal",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(V, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(B, null, {
                          default: t(() => [...$[0] || ($[0] = [
                            l("mdi-book-open-page-variant", -1)
                          ])]),
                          _: 1
                        }),
                        $[1] || ($[1] = l(" Getting started ", -1))
                      ]),
                      _: 1
                    }),
                    e(o, null, {
                      default: t(() => [...$[2] || ($[2] = [
                        u("p", { class: "mb-2" }, " Ligoj aggregates the tools your projects rely on (source control, bug tracking, continuous integration, knowledge base, cloud provisioning) behind a single dashboard and API. ", -1),
                        u("p", { class: "mb-0" }, " Create a project, attach subscriptions, and hand your team a single entry point for everything. ", -1)
                      ])]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                e(x, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(M, {
                      lines: "two",
                      density: "compact"
                    }, {
                      default: t(() => [
                        e(C, {
                          "prepend-icon": "mdi-folder-plus",
                          title: "Create a project",
                          subtitle: "Name, project key, manager — add subscriptions afterwards.",
                          to: "/home/project"
                        }),
                        e(C, {
                          "prepend-icon": "mdi-playlist-plus",
                          title: "Subscribe to a tool",
                          subtitle: "Pick a service, a tool, and a node for an existing or new instance.",
                          to: "/subscribe"
                        }),
                        e(C, {
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
                e(x, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(V, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(B, null, {
                          default: t(() => [...$[3] || ($[3] = [
                            l("mdi-api", -1)
                          ])]),
                          _: 1
                        }),
                        $[4] || ($[4] = l(" Automation ", -1))
                      ]),
                      _: 1
                    }),
                    e(o, null, {
                      default: t(() => [
                        u("p", qt, [
                          $[7] || ($[7] = l(" Every screen is backed by a REST endpoint. Browse the full catalogue on the ", -1)),
                          e(v, { to: "/api" }, {
                            default: t(() => [...$[5] || ($[5] = [
                              l("API reference page", -1)
                            ])]),
                            _: 1
                          }),
                          $[8] || ($[8] = l(" (OpenAPI / Swagger UI), and generate an ", -1)),
                          e(v, { to: "/api/token" }, {
                            default: t(() => [...$[6] || ($[6] = [
                              l("API token", -1)
                            ])]),
                            _: 1
                          }),
                          $[9] || ($[9] = l(" to call it from scripts without exposing your password. ", -1))
                        ]),
                        K("", !0),
                        u("pre", Ft, 'curl "' + h(ie(L)) + h(ie(D)) + "rest/project?api-key=<token>&api-user=" + h(m.value) + '"', 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                e(x, { variant: "outlined" }, {
                  default: t(() => [
                    e(V, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(B, null, {
                          default: t(() => [...$[10] || ($[10] = [
                            l("mdi-help-circle", -1)
                          ])]),
                          _: 1
                        }),
                        $[11] || ($[11] = l(" More resources ", -1))
                      ]),
                      _: 1
                    }),
                    e(M, {
                      lines: "one",
                      density: "compact"
                    }, {
                      default: t(() => [
                        e(C, {
                          "prepend-icon": "mdi-github",
                          title: "GitHub repository",
                          subtitle: "Source, issues, release notes",
                          href: "https://github.com/ligoj/ligoj",
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }),
                        e(C, {
                          "prepend-icon": "mdi-bug",
                          title: "Report an issue",
                          href: "https://github.com/ligoj/ligoj/issues",
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }),
                        e(C, {
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
}, Ot = /* @__PURE__ */ we(Mt, [["__scopeId", "data-v-bfb1a017"]]), Gt = { class: "pa-4" }, Ht = {
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
    }), (D, L) => {
      const m = n("v-list-item"), R = n("v-list");
      return c(), Z("div", Gt, [
        L[0] || (L[0] = u("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        e(R, null, {
          default: t(() => [
            (c(), Z(ve, null, ke(z, ($) => e(m, {
              key: $.to,
              to: $.to,
              "prepend-icon": $.icon,
              title: $.title,
              subtitle: $.subtitle
            }, null, 8, ["to", "prepend-icon", "title", "subtitle"])), 64))
          ]),
          _: 1
        })
      ]);
    };
  }
}, Wt = { class: "d-flex align-center mb-4" }, Jt = { class: "mb-3" }, Kt = { class: "d-flex align-center mb-1" }, Zt = { class: "text-caption" }, Xt = { class: "d-flex mt-1 text-caption text-medium-emphasis ga-3" }, Yt = {
  __name: "SystemInfoView",
  setup(d) {
    const U = fe(), z = pe(), D = he(), L = s(!1), m = s(null), R = s(null), $ = s(""), B = s(""), V = s(""), o = Ve({
      used: 0,
      committedFree: 0,
      free: 0,
      max: 0,
      pctUsed: 0,
      pctCommittedFree: 0,
      pctFree: 0
    }), x = Ve({ application: "", default: "", original: "" }), C = ce(() => f("JSESSIONID") || ""), M = ce(() => {
      const S = D.appSettings || {}, r = parseInt(S.buildTimestamp, 10);
      return {
        number: S.buildNumber ?? "",
        timestamp: Number.isNaN(r) ? S.buildTimestamp ?? "" : r,
        date: Number.isNaN(r) ? "" : new Date(r).toISOString().slice(0, 19).replace("T", " "),
        version: S.buildVersion ?? ""
      };
    }), E = ce(
      () => `Used: ${v(o.used)} · Committed-free: ${v(o.committedFree)} · Free: ${v(o.free)} / ${v(o.max)}`
    );
    function v(S) {
      if (S == null || isNaN(S)) return "—";
      const r = ["B", "KB", "MB", "GB", "TB"];
      let p = S, _ = 0;
      for (; p >= 1024 && _ < r.length - 1; )
        p /= 1024, _++;
      return `${p.toFixed(p < 10 && _ > 0 ? 1 : 0)} ${r[_]}`;
    }
    function f(S) {
      const r = document.cookie.split(";");
      for (const p of r) {
        const [_, ...i] = p.trim().split("=");
        if (_ === S) return decodeURIComponent(i.join("="));
      }
      return null;
    }
    async function P() {
      var r, p, _, i, Y, N, T, H, w, a, b, ee;
      L.value = !0, m.value = null;
      const S = await U.get("rest/system");
      if (S) {
        $.value = ((r = S.cpu) == null ? void 0 : r.total) ?? "", B.value = (p = S.date) != null && p.date ? new Date(S.date.date).toISOString() : "", V.value = ((_ = S.date) == null ? void 0 : _.date) ?? "", x.application = ((i = S.date) == null ? void 0 : i.timeZone) ?? "", x.default = ((Y = S.date) == null ? void 0 : Y.defaultTimeZone) ?? "", x.original = ((N = S.date) == null ? void 0 : N.originalDefaultTimeZone) ?? "";
        const Q = ((T = S.memory) == null ? void 0 : T.maxMemory) || (((H = S.memory) == null ? void 0 : H.totalMemory) || 0) + 1e6, q = (((w = S.memory) == null ? void 0 : w.totalMemory) ?? 0) - (((a = S.memory) == null ? void 0 : a.freeMemory) ?? 0), y = ((b = S.memory) == null ? void 0 : b.freeMemory) ?? 0, W = Math.max(0, Q - (((ee = S.memory) == null ? void 0 : ee.totalMemory) ?? 0));
        o.used = q, o.committedFree = y, o.free = W, o.max = Q, o.pctUsed = G(q / Q * 100), o.pctCommittedFree = G(y / Q * 100), o.pctFree = G(100 - o.pctUsed - o.pctCommittedFree);
      }
      L.value = !1;
    }
    function G(S) {
      return Math.round(S * 10) / 10;
    }
    async function A(S, r) {
      if (r) {
        R.value = S;
        try {
          await fetch(`/rest/system/timezone/${S}`, {
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
    async function I(S) {
      try {
        await navigator.clipboard.writeText(S || "");
      } catch {
      }
    }
    return me(() => {
      z.setTitle("System information"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Information" }]), P();
    }), (S, r) => {
      const p = n("v-spacer"), _ = n("v-btn"), i = n("v-alert"), Y = n("v-icon"), N = n("v-card-title"), T = n("v-progress-linear"), H = n("v-tooltip"), w = n("v-text-field"), a = n("v-col"), b = n("v-row"), ee = n("v-card-text"), Q = n("v-card");
      return c(), Z("div", null, [
        u("div", Wt, [
          r[8] || (r[8] = u("h1", { class: "text-h4" }, "System information", -1)),
          e(p),
          e(_, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            loading: L.value,
            onClick: P
          }, {
            default: t(() => [...r[7] || (r[7] = [
              l(" Refresh ", -1)
            ])]),
            _: 1
          }, 8, ["loading"])
        ]),
        m.value ? (c(), F(i, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(m.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(b, null, {
          default: t(() => [
            e(a, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(Q, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(N, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(Y, null, {
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
                        u("div", Jt, [
                          u("div", Kt, [
                            r[11] || (r[11] = u("span", { class: "text-body-2 text-medium-emphasis flex-grow-1" }, "Memory", -1)),
                            u("span", Zt, h(v(o.used)) + " / " + h(v(o.max)), 1)
                          ]),
                          e(H, {
                            text: E.value,
                            location: "top"
                          }, {
                            activator: t(({ props: q }) => [
                              u("div", He(We(q)), [
                                e(T, {
                                  "model-value": o.pctUsed,
                                  "buffer-value": o.pctUsed + o.pctCommittedFree,
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
                          u("div", Xt, [
                            u("span", null, [
                              e(Y, {
                                size: "x-small",
                                color: "error"
                              }, {
                                default: t(() => [...r[12] || (r[12] = [
                                  l("mdi-circle", -1)
                                ])]),
                                _: 1
                              }),
                              l(" Used " + h(o.pctUsed) + "%", 1)
                            ]),
                            u("span", null, [
                              e(Y, {
                                size: "x-small",
                                color: "warning"
                              }, {
                                default: t(() => [...r[13] || (r[13] = [
                                  l("mdi-circle", -1)
                                ])]),
                                _: 1
                              }),
                              l(" Committed free " + h(o.pctCommittedFree) + "%", 1)
                            ]),
                            u("span", null, [
                              e(Y, {
                                size: "x-small",
                                color: "success"
                              }, {
                                default: t(() => [...r[14] || (r[14] = [
                                  l("mdi-circle", -1)
                                ])]),
                                _: 1
                              }),
                              l(" Free " + h(o.pctFree) + "%", 1)
                            ])
                          ])
                        ]),
                        e(w, {
                          "model-value": $.value,
                          label: "CPU load (total)",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2"
                        }, null, 8, ["model-value"]),
                        e(b, { dense: "" }, {
                          default: t(() => [
                            e(a, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(w, {
                                  "model-value": B.value,
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
                                e(w, {
                                  "model-value": V.value,
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
                e(Q, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(N, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(Y, null, {
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
                        e(w, {
                          modelValue: x.application,
                          "onUpdate:modelValue": r[0] || (r[0] = (q) => x.application = q),
                          label: "Application",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: R.value === "application",
                          onBlur: r[1] || (r[1] = (q) => A("application", x.application)),
                          onKeyup: r[2] || (r[2] = Se((q) => A("application", x.application), ["enter"]))
                        }, null, 8, ["modelValue", "loading"]),
                        e(w, {
                          modelValue: x.default,
                          "onUpdate:modelValue": r[3] || (r[3] = (q) => x.default = q),
                          label: "System",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: R.value === "default",
                          onBlur: r[4] || (r[4] = (q) => A("default", x.default)),
                          onKeyup: r[5] || (r[5] = Se((q) => A("default", x.default), ["enter"]))
                        }, null, 8, ["modelValue", "loading"]),
                        e(w, {
                          "model-value": x.original,
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
                e(Q, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(N, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(Y, null, {
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
                        e(w, {
                          "model-value": C.value,
                          label: "Identifier",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          "append-inner-icon": "mdi-content-copy",
                          "onClick:appendInner": r[6] || (r[6] = (q) => I(C.value))
                        }, null, 8, ["model-value"]),
                        e(w, {
                          "model-value": ie(D).userName,
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
                e(Q, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(N, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(Y, null, {
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
                        e(w, {
                          "model-value": M.value.number,
                          label: "Number",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2"
                        }, null, 8, ["model-value"]),
                        e(b, { dense: "" }, {
                          default: t(() => [
                            e(a, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: t(() => [
                                e(w, {
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
                                e(w, {
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
                        e(w, {
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
}, Qt = { class: "system-config-page" }, el = { class: "d-flex align-center mb-4" }, tl = {
  key: 0,
  class: "text-medium-emphasis"
}, ll = ["title"], nl = {
  __name: "SystemConfigurationView",
  setup(d) {
    const U = fe(), z = pe(), D = s([]), L = s(!1), m = s(null), R = s(""), $ = s(""), B = s(!1), V = s(null), o = s(!1), x = s(null), C = s({ name: "", value: "", system: !1, secured: !1 }), M = s(!1), E = s(!1), v = s(null), f = s(!1), P = { required: (w) => w !== "" && w != null || "Required" }, G = [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Value", key: "value", sortable: !1 },
      { title: "", key: "secured", sortable: !0, width: "32px", align: "center" },
      { title: "Source", key: "source", sortable: !0, width: "56px", align: "center" },
      { title: "Actions", key: "actions", sortable: !1, width: "128px", align: "end" }
    ], A = {
      systemEnvironment: "mdi-desktop-classic",
      systemProperties: "mdi-language-java",
      applicationConfig: "mdi-file-code",
      database: "mdi-database",
      classpath: "mdi-file-code-outline"
    };
    function I(w) {
      if (!w) return "mdi-help-circle-outline";
      const a = w.split(":")[0];
      return A[w.includes("classpath") ? "classpath" : a] || "mdi-help-circle-outline";
    }
    function S(w) {
      if (!w.source) return "";
      const a = `Source: ${w.source}`;
      return w.overridden ? `${a} — overridden` : a;
    }
    async function r() {
      L.value = !0, m.value = null;
      const w = await U.get("rest/system/configuration");
      D.value = Array.isArray(w) ? w : (w == null ? void 0 : w.data) || [], D.value.sort((a, b) => String(a.name).localeCompare(String(b.name))), L.value = !1;
    }
    async function p() {
      if (R.value) {
        B.value = !0;
        try {
          const w = await fetch("/rest/system/security/crypto", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "text/plain" },
            body: R.value
          });
          $.value = w.ok ? await w.text() : "";
        } catch {
          $.value = "";
        } finally {
          B.value = !1;
        }
      }
    }
    async function _(w) {
      try {
        await navigator.clipboard.writeText(w || "");
      } catch {
      }
    }
    function i() {
      x.value = null, C.value = { name: "", value: "", system: !1, secured: !1 }, o.value = !0;
    }
    function Y(w) {
      x.value = w, C.value = {
        name: w.name,
        value: w.secured ? "" : w.value ?? "",
        system: !1,
        secured: !!w.secured
      }, o.value = !0;
    }
    function N(w) {
      v.value = w, E.value = !0;
    }
    async function T() {
      var b;
      const { valid: w } = await V.value.validate();
      if (!w) return;
      M.value = !0;
      const a = {
        name: C.value.name,
        oldName: ((b = x.value) == null ? void 0 : b.name) || "",
        system: !!C.value.system,
        secured: !!C.value.secured,
        value: C.value.value
      };
      await U.post("rest/system/configuration", a), M.value = !1, o.value = !1, r();
    }
    async function H() {
      f.value = !0, await U.del(`rest/system/configuration/${encodeURIComponent(v.value.name)}/true`), f.value = !1, E.value = !1, r();
    }
    return me(() => {
      z.setTitle("System configuration"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Configuration" }]), r();
    }), (w, a) => {
      const b = n("v-spacer"), ee = n("v-btn"), Q = n("v-icon"), q = n("v-card-title"), y = n("v-text-field"), W = n("v-col"), te = n("v-row"), J = n("v-card-text"), ae = n("v-card"), re = n("v-alert"), O = n("v-tooltip"), oe = n("v-textarea"), ue = n("v-checkbox"), _e = n("v-form"), k = n("v-card-actions"), g = n("v-dialog");
      return c(), Z("div", Qt, [
        u("div", el, [
          a[12] || (a[12] = u("h1", { class: "text-h4" }, "System configuration", -1)),
          e(b),
          e(ee, {
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
          e(ee, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            class: "ml-2",
            onClick: i
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
                e(Q, null, {
                  default: t(() => [...a[13] || (a[13] = [
                    l("mdi-shield-key", -1)
                  ])]),
                  _: 1
                }),
                a[14] || (a[14] = l(" Encrypt helper ", -1))
              ]),
              _: 1
            }),
            e(J, null, {
              default: t(() => [
                e(te, { dense: "" }, {
                  default: t(() => [
                    e(W, {
                      cols: "12",
                      md: "5"
                    }, {
                      default: t(() => [
                        e(y, {
                          modelValue: R.value,
                          "onUpdate:modelValue": a[0] || (a[0] = (j) => R.value = j),
                          label: "Text to encrypt",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "",
                          onKeyup: Se(p, ["enter"])
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    e(W, { cols: "auto" }, {
                      default: t(() => [
                        e(ee, {
                          color: "primary",
                          "prepend-icon": "mdi-lock",
                          loading: B.value,
                          disabled: !R.value,
                          onClick: p
                        }, {
                          default: t(() => [...a[15] || (a[15] = [
                            l("Encrypt", -1)
                          ])]),
                          _: 1
                        }, 8, ["loading", "disabled"])
                      ]),
                      _: 1
                    }),
                    e(W, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: t(() => [
                        e(y, {
                          "model-value": $.value,
                          label: "Result",
                          variant: "outlined",
                          density: "compact",
                          readonly: "",
                          "hide-details": "",
                          "append-inner-icon": "mdi-content-copy",
                          "onClick:appendInner": a[1] || (a[1] = (j) => _($.value))
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
        m.value ? (c(), F(re, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(m.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(ie(Xe), {
          headers: G,
          items: D.value,
          loading: L.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact",
          filename: "configuration.csv",
          class: "configuration-table"
        }, {
          "item.value": t(({ item: j }) => [
            j.secured ? (c(), Z("span", tl, "•••••")) : (c(), Z("code", {
              key: 1,
              class: "config-value",
              title: j.value
            }, h(j.value), 9, ll))
          ]),
          "item.secured": t(({ item: j }) => [
            j.secured ? (c(), F(Q, {
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
          "item.source": t(({ item: j }) => [
            j.source ? (c(), F(O, {
              key: 0,
              text: S(j),
              location: "top"
            }, {
              activator: t(({ props: se }) => [
                e(Q, je(se, {
                  size: "small",
                  color: j.overridden ? "warning" : void 0
                }), {
                  default: t(() => [
                    l(h(I(j.source)), 1)
                  ]),
                  _: 2
                }, 1040, ["color"])
              ]),
              _: 2
            }, 1032, ["text"])) : K("", !0),
            j.overridden ? (c(), F(Q, {
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
          "item.actions": t(({ item: j }) => [
            e(ee, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (se) => Y(j),
              title: "Edit"
            }, {
              default: t(() => [
                e(Q, { size: "small" }, {
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
              onClick: (se) => N(j),
              title: "Delete"
            }, {
              default: t(() => [
                e(Q, { size: "small" }, {
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
        e(g, {
          modelValue: o.value,
          "onUpdate:modelValue": a[7] || (a[7] = (j) => o.value = j),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [
                    l(h(x.value ? "Edit configuration" : "New configuration"), 1)
                  ]),
                  _: 1
                }),
                e(J, null, {
                  default: t(() => [
                    e(_e, {
                      ref_key: "formRef",
                      ref: V,
                      onSubmit: xe(T, ["prevent"])
                    }, {
                      default: t(() => [
                        e(y, {
                          modelValue: C.value.name,
                          "onUpdate:modelValue": a[2] || (a[2] = (j) => C.value.name = j),
                          label: "Name",
                          rules: [P.required],
                          variant: "outlined",
                          density: "compact",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(oe, {
                          modelValue: C.value.value,
                          "onUpdate:modelValue": a[3] || (a[3] = (j) => C.value.value = j),
                          label: "Value",
                          rules: [P.required],
                          counter: 1023,
                          maxlength: "1023",
                          rows: "3",
                          variant: "outlined",
                          density: "compact",
                          class: "mb-2"
                        }, null, 8, ["modelValue", "rules"]),
                        e(ue, {
                          modelValue: C.value.system,
                          "onUpdate:modelValue": a[4] || (a[4] = (j) => C.value.system = j),
                          label: "Override system environment / properties",
                          density: "compact",
                          "hide-details": ""
                        }, null, 8, ["modelValue"]),
                        e(ue, {
                          modelValue: C.value.secured,
                          "onUpdate:modelValue": a[5] || (a[5] = (j) => C.value.secured = j),
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
                e(k, null, {
                  default: t(() => [
                    e(b),
                    e(ee, {
                      variant: "text",
                      onClick: a[6] || (a[6] = (j) => o.value = !1)
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
                      onClick: T
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
        e(g, {
          modelValue: E.value,
          "onUpdate:modelValue": a[9] || (a[9] = (j) => E.value = j),
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
                e(J, null, {
                  default: t(() => {
                    var j;
                    return [
                      a[23] || (a[23] = l(" Remove key ", -1)),
                      u("code", null, h((j = v.value) == null ? void 0 : j.name), 1),
                      a[24] || (a[24] = l("? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(k, null, {
                  default: t(() => [
                    e(b),
                    e(ee, {
                      variant: "text",
                      onClick: a[8] || (a[8] = (j) => E.value = !1)
                    }, {
                      default: t(() => [...a[25] || (a[25] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(ee, {
                      color: "error",
                      variant: "elevated",
                      loading: f.value,
                      onClick: H
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
}, al = /* @__PURE__ */ we(nl, [["__scopeId", "data-v-47a35e13"]]), ol = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, il = {
  __name: "SystemUserView",
  setup(d) {
    const U = fe(), z = pe(), D = Ae("system/user/roles", { defaultSort: "login" }), L = s(25);
    let m = null, R = {};
    const $ = s([]), B = s(null), V = s(!1), o = s(null), x = s({ login: "", roles: [] }), C = s(!1), M = s(!1), E = s(null), v = s(!1), f = {
      required: (N) => !!N || "Required",
      requiredArray: (N) => Array.isArray(N) && N.length > 0 || "Pick at least one role"
    }, P = [
      { title: "Login", key: "login", sortable: !0, width: "300px" },
      { title: "Roles", key: "roles", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "120px", align: "end" }
    ];
    function G(N) {
      R = N, D.load(N);
    }
    async function A() {
      const N = new URLSearchParams({
        rows: "999999",
        page: "1",
        sidx: "login",
        sord: "asc"
      });
      D.search.value && N.set("search[value]", D.search.value);
      const T = await fetch(`rest/system/user/roles?${N}`, { credentials: "include" });
      if (!T.ok) return [];
      const H = await T.json().catch(() => null);
      return Array.isArray(H == null ? void 0 : H.data) ? H.data : Array.isArray(H) ? H : [];
    }
    function I() {
      clearTimeout(m), m = setTimeout(
        () => D.load({ page: 1, itemsPerPage: L.value, sortBy: R.sortBy }),
        300
      );
    }
    async function S() {
      const N = await U.get("rest/system/security/role");
      Array.isArray(N) ? $.value = N : Array.isArray(N == null ? void 0 : N.data) && ($.value = N.data);
    }
    function r() {
      o.value = null, x.value = { login: "", roles: [] }, V.value = !0;
    }
    function p(N) {
      o.value = N, x.value = {
        login: N.login,
        roles: (N.roles || []).map((T) => T.id)
      }, V.value = !0;
    }
    function _(N) {
      E.value = N, M.value = !0;
    }
    async function i() {
      const { valid: N } = await B.value.validate();
      if (!N) return;
      C.value = !0;
      const T = { login: x.value.login, roles: x.value.roles }, H = o.value ? "put" : "post";
      await U[H]("rest/system/user", T), C.value = !1, V.value = !1, D.load(R);
    }
    async function Y() {
      v.value = !0, await U.del(`rest/system/user/${encodeURIComponent(E.value.login)}`), v.value = !1, M.value = !1, D.load(R);
    }
    return me(() => {
      z.setTitle("System users"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]), S();
    }), (N, T) => {
      const H = n("v-spacer"), w = n("v-text-field"), a = n("v-btn"), b = n("v-alert"), ee = n("v-chip"), Q = n("v-icon"), q = n("v-card-title"), y = n("v-autocomplete"), W = n("v-form"), te = n("v-card-text"), J = n("v-card-actions"), ae = n("v-card"), re = n("v-dialog");
      return c(), Z("div", null, [
        u("div", ol, [
          T[9] || (T[9] = u("h1", { class: "text-h4" }, "System users", -1)),
          e(H),
          e(w, {
            modelValue: ie(D).search.value,
            "onUpdate:modelValue": [
              T[0] || (T[0] = (O) => ie(D).search.value = O),
              I
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(a, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: r
          }, {
            default: t(() => [...T[8] || (T[8] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        ie(D).error.value ? (c(), F(b, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(ie(D).error.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(ie(Ye), {
          headers: P,
          items: ie(D).items.value,
          "items-length": ie(D).totalItems.value,
          loading: ie(D).loading.value,
          "items-per-page": L.value,
          "onUpdate:itemsPerPage": T[1] || (T[1] = (O) => L.value = O),
          "item-value": "login",
          hover: "",
          filename: "system-users.csv",
          "fetch-all": A,
          "onUpdate:options": G
        }, {
          "item.roles": t(({ item: O }) => [
            (c(!0), Z(ve, null, ke(O.roles || [], (oe) => (c(), F(ee, {
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
            e(a, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (oe) => p(O)
            }, {
              default: t(() => [
                e(Q, { size: "small" }, {
                  default: t(() => [...T[10] || (T[10] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(a, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (oe) => _(O)
            }, {
              default: t(() => [
                e(Q, { size: "small" }, {
                  default: t(() => [...T[11] || (T[11] = [
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
          modelValue: V.value,
          "onUpdate:modelValue": T[5] || (T[5] = (O) => V.value = O),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [
                    l(h(o.value ? "Edit system user" : "New system user"), 1)
                  ]),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => [
                    e(W, {
                      ref_key: "formRef",
                      ref: B,
                      onSubmit: xe(i, ["prevent"])
                    }, {
                      default: t(() => [
                        e(w, {
                          modelValue: x.value.login,
                          "onUpdate:modelValue": T[2] || (T[2] = (O) => x.value.login = O),
                          label: "Login",
                          rules: [f.required],
                          disabled: !!o.value,
                          variant: "outlined",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules", "disabled"]),
                        e(y, {
                          modelValue: x.value.roles,
                          "onUpdate:modelValue": T[3] || (T[3] = (O) => x.value.roles = O),
                          label: "Roles",
                          items: $.value,
                          "item-value": "id",
                          "item-title": "name",
                          multiple: "",
                          chips: "",
                          "closable-chips": "",
                          variant: "outlined",
                          rules: [f.requiredArray]
                        }, null, 8, ["modelValue", "items", "rules"])
                      ]),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(J, null, {
                  default: t(() => [
                    e(H),
                    e(a, {
                      variant: "text",
                      onClick: T[4] || (T[4] = (O) => V.value = !1)
                    }, {
                      default: t(() => [...T[12] || (T[12] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "primary",
                      variant: "elevated",
                      loading: C.value,
                      onClick: i
                    }, {
                      default: t(() => [...T[13] || (T[13] = [
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
          "onUpdate:modelValue": T[7] || (T[7] = (O) => M.value = O),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...T[14] || (T[14] = [
                    l("Delete system user", -1)
                  ])]),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => {
                    var O;
                    return [
                      T[15] || (T[15] = l("Remove ", -1)),
                      u("strong", null, h((O = E.value) == null ? void 0 : O.login), 1),
                      T[16] || (T[16] = l(" from system accounts?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(J, null, {
                  default: t(() => [
                    e(H),
                    e(a, {
                      variant: "text",
                      onClick: T[6] || (T[6] = (O) => M.value = !1)
                    }, {
                      default: t(() => [...T[17] || (T[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "error",
                      variant: "elevated",
                      loading: v.value,
                      onClick: Y
                    }, {
                      default: t(() => [...T[18] || (T[18] = [
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
}, sl = /* @__PURE__ */ we(il, [["__scopeId", "data-v-84bf966f"]]), rl = { class: "d-flex align-center mb-4" }, ul = {
  __name: "SystemRoleView",
  setup(d) {
    const U = fe(), z = pe(), D = s([]), L = s(!1), m = s(null), R = s(null), $ = s(!1), B = s(null), V = s({ name: "", apiPatterns: [], uiPatterns: [] }), o = s(!1), x = s(!1), C = s(null), M = s(!1), E = { required: (r) => !!r || "Required" }, v = [
      { title: "Name", key: "name", sortable: !0, width: "180px" },
      { title: "API patterns", key: "authApi", sortable: !1 },
      { title: "UI patterns", key: "authUi", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "120px", align: "end" }
    ];
    async function f() {
      L.value = !0, m.value = null;
      const r = await U.get("rest/system/security/role/withAuth"), p = (r == null ? void 0 : r.data) || r || [];
      for (const _ of p)
        _["authorizations-api"] = (_.authorizations || []).filter((i) => i.type === "api"), _["authorizations-ui"] = (_.authorizations || []).filter((i) => i.type === "ui");
      D.value = p, L.value = !1;
    }
    function P() {
      B.value = null, V.value = { name: "", apiPatterns: [], uiPatterns: [] }, $.value = !0;
    }
    function G(r) {
      B.value = r, V.value = {
        name: r.name,
        apiPatterns: (r["authorizations-api"] || []).map((p) => p.pattern),
        uiPatterns: (r["authorizations-ui"] || []).map((p) => p.pattern)
      }, $.value = !0;
    }
    function A(r) {
      C.value = r, x.value = !0;
    }
    async function I() {
      var i;
      const { valid: r } = await R.value.validate();
      if (!r) return;
      o.value = !0;
      const p = {
        id: (i = B.value) == null ? void 0 : i.id,
        name: V.value.name,
        authorizations: [
          ...V.value.apiPatterns.map((Y) => ({ pattern: Y, type: "api" })),
          ...V.value.uiPatterns.map((Y) => ({ pattern: Y, type: "ui" }))
        ]
      }, _ = B.value ? "put" : "post";
      await U[_]("rest/system/security/role", p), o.value = !1, $.value = !1, f();
    }
    async function S() {
      M.value = !0, await U.del(`rest/system/security/role/${C.value.id}`), M.value = !1, x.value = !1, f();
    }
    return me(() => {
      z.setTitle("Roles"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]), f();
    }), (r, p) => {
      const _ = n("v-spacer"), i = n("v-btn"), Y = n("v-alert"), N = n("v-icon"), T = n("v-data-table"), H = n("v-card-title"), w = n("v-text-field"), a = n("v-combobox"), b = n("v-form"), ee = n("v-card-text"), Q = n("v-card-actions"), q = n("v-card"), y = n("v-dialog");
      return c(), Z("div", null, [
        u("div", rl, [
          p[8] || (p[8] = u("h1", { class: "text-h4" }, "Roles", -1)),
          e(_),
          e(i, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: P
          }, {
            default: t(() => [...p[7] || (p[7] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        m.value ? (c(), F(Y, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(m.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(T, {
          headers: v,
          items: D.value,
          loading: L.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.authApi": t(({ item: W }) => [
            (c(!0), Z(ve, null, ke(W["authorizations-api"], (te) => (c(), Z("code", {
              key: te.id || te.pattern,
              class: "auth-token"
            }, h(te.pattern), 1))), 128))
          ]),
          "item.authUi": t(({ item: W }) => [
            (c(!0), Z(ve, null, ke(W["authorizations-ui"], (te) => (c(), Z("code", {
              key: te.id || te.pattern,
              class: "auth-token"
            }, h(te.pattern), 1))), 128))
          ]),
          "item.actions": t(({ item: W }) => [
            e(i, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (te) => G(W)
            }, {
              default: t(() => [
                e(N, { size: "small" }, {
                  default: t(() => [...p[9] || (p[9] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(i, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (te) => A(W)
            }, {
              default: t(() => [
                e(N, { size: "small" }, {
                  default: t(() => [...p[10] || (p[10] = [
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
          modelValue: $.value,
          "onUpdate:modelValue": p[4] || (p[4] = (W) => $.value = W),
          "max-width": "640",
          persistent: ""
        }, {
          default: t(() => [
            e(q, null, {
              default: t(() => [
                e(H, null, {
                  default: t(() => [
                    l(h(B.value ? "Edit role" : "New role"), 1)
                  ]),
                  _: 1
                }),
                e(ee, null, {
                  default: t(() => [
                    e(b, {
                      ref_key: "formRef",
                      ref: R,
                      onSubmit: xe(I, ["prevent"])
                    }, {
                      default: t(() => [
                        e(w, {
                          modelValue: V.value.name,
                          "onUpdate:modelValue": p[0] || (p[0] = (W) => V.value.name = W),
                          label: "Name",
                          rules: [E.required],
                          variant: "outlined",
                          class: "mb-4",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(a, {
                          modelValue: V.value.apiPatterns,
                          "onUpdate:modelValue": p[1] || (p[1] = (W) => V.value.apiPatterns = W),
                          label: "API authorization patterns (regex)",
                          items: V.value.apiPatterns,
                          chips: "",
                          "closable-chips": "",
                          multiple: "",
                          variant: "outlined",
                          hint: "Press Enter after each pattern",
                          "persistent-hint": "",
                          class: "mb-4"
                        }, null, 8, ["modelValue", "items"]),
                        e(a, {
                          modelValue: V.value.uiPatterns,
                          "onUpdate:modelValue": p[2] || (p[2] = (W) => V.value.uiPatterns = W),
                          label: "UI authorization patterns (regex)",
                          items: V.value.uiPatterns,
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
                e(Q, null, {
                  default: t(() => [
                    e(_),
                    e(i, {
                      variant: "text",
                      onClick: p[3] || (p[3] = (W) => $.value = !1)
                    }, {
                      default: t(() => [...p[11] || (p[11] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(i, {
                      color: "primary",
                      variant: "elevated",
                      loading: o.value,
                      onClick: I
                    }, {
                      default: t(() => [...p[12] || (p[12] = [
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
          modelValue: x.value,
          "onUpdate:modelValue": p[6] || (p[6] = (W) => x.value = W),
          "max-width": "420"
        }, {
          default: t(() => [
            e(q, null, {
              default: t(() => [
                e(H, null, {
                  default: t(() => [...p[13] || (p[13] = [
                    l("Delete role", -1)
                  ])]),
                  _: 1
                }),
                e(ee, null, {
                  default: t(() => {
                    var W;
                    return [
                      p[14] || (p[14] = l("Delete role ", -1)),
                      u("strong", null, h((W = C.value) == null ? void 0 : W.name), 1),
                      p[15] || (p[15] = l("?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(Q, null, {
                  default: t(() => [
                    e(_),
                    e(i, {
                      variant: "text",
                      onClick: p[5] || (p[5] = (W) => x.value = !1)
                    }, {
                      default: t(() => [...p[16] || (p[16] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(i, {
                      color: "error",
                      variant: "elevated",
                      loading: M.value,
                      onClick: S
                    }, {
                      default: t(() => [...p[17] || (p[17] = [
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
}, dl = /* @__PURE__ */ we(ul, [["__scopeId", "data-v-80a1b540"]]), cl = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, ml = { key: 0 }, pl = { key: 0 }, vl = {
  __name: "SystemPluginView",
  setup(d) {
    const U = fe(), z = pe(), D = [
      { id: "central", label: "Maven Central" },
      { id: "nexus", label: "OSSRH Nexus" }
    ], L = s("central"), m = s([]), R = s(!1), $ = s(null), B = s(!1), V = s(!1), o = s(!1), x = s(""), C = s(!1), M = s(!1), E = [
      { title: "", key: "type", sortable: !1, width: "40px" },
      { title: "Artifact", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0 },
      { title: "Vendor", key: "vendor", sortable: !0, width: "160px" },
      { title: "Version", key: "version", sortable: !1, width: "280px" },
      { title: "Nodes", key: "nodes", sortable: !0, width: "80px", align: "center" },
      { title: "Subs", key: "subscriptions", sortable: !0, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function v(p) {
      var i, Y;
      const _ = (Y = (i = p.plugin) == null ? void 0 : i.type) == null ? void 0 : Y.toLowerCase();
      return _ ? _ === "feature" ? "mdi-wrench" : _ === "service" ? "mdi-puzzle" : _ === "tool" ? "mdi-hammer-wrench" : "mdi-puzzle" : "mdi-link-off";
    }
    async function f() {
      R.value = !0, $.value = null;
      const p = await U.get(`rest/system/plugin?repository=${L.value}`);
      m.value = Array.isArray(p) ? p : (p == null ? void 0 : p.data) || [], R.value = !1;
    }
    async function P() {
      B.value = !0, await U.put(`rest/system/plugin/cache?repository=${L.value}`), B.value = !1, f();
    }
    async function G() {
      V.value = !0, await U.put("rest/system/plugin/restart"), V.value = !1;
    }
    async function A(p, _ = !1) {
      M.value = !0;
      const i = `repository=${L.value}&javadoc=${_ ? !1 : C.value}`;
      await U.post(`rest/system/plugin/${encodeURIComponent(p)}?${i}`), M.value = !1, o.value = !1, x.value = "", C.value = !1, f();
    }
    function I() {
      x.value && A(x.value.trim());
    }
    async function S(p) {
      await U.del(`rest/system/plugin/${p.plugin.artifact}/${p.latestLocalVersion}`), f();
    }
    async function r(p) {
      confirm(`Delete plug-in ${p}?`) && (await U.del(`rest/system/plugin/${p}`), f());
    }
    return me(() => {
      z.setTitle("Plug-ins"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plug-ins" }]), f();
    }), (p, _) => {
      const i = n("v-spacer"), Y = n("v-select"), N = n("v-btn"), T = n("v-alert"), H = n("v-icon"), w = n("v-chip"), a = n("v-data-table"), b = n("v-card-title"), ee = n("v-text-field"), Q = n("v-checkbox"), q = n("v-card-text"), y = n("v-card-actions"), W = n("v-card"), te = n("v-dialog");
      return c(), Z("div", null, [
        u("div", cl, [
          _[9] || (_[9] = u("h1", { class: "text-h4" }, "Plugins", -1)),
          e(i),
          e(Y, {
            modelValue: L.value,
            "onUpdate:modelValue": [
              _[0] || (_[0] = (J) => L.value = J),
              f
            ],
            items: D,
            "item-value": "id",
            "item-title": "label",
            label: "Repository",
            density: "compact",
            "hide-details": "",
            variant: "outlined",
            style: { "max-width": "200px" }
          }, null, 8, ["modelValue"]),
          e(N, {
            variant: "outlined",
            "prepend-icon": "mdi-magnify-plus",
            onClick: P,
            loading: B.value
          }, {
            default: t(() => [..._[6] || (_[6] = [
              l(" Check versions ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(N, {
            color: "error",
            variant: "outlined",
            "prepend-icon": "mdi-restart",
            onClick: G,
            loading: V.value
          }, {
            default: t(() => [..._[7] || (_[7] = [
              l(" Restart ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(N, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: _[1] || (_[1] = (J) => o.value = !0)
          }, {
            default: t(() => [..._[8] || (_[8] = [
              l("Install", -1)
            ])]),
            _: 1
          })
        ]),
        $.value ? (c(), F(T, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h($.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(a, {
          headers: E,
          items: m.value,
          loading: R.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.type": t(({ item: J }) => {
            var ae;
            return [
              e(H, {
                size: "small",
                title: (ae = J.plugin) == null ? void 0 : ae.type
              }, {
                default: t(() => [
                  l(h(v(J)), 1)
                ]),
                _: 2
              }, 1032, ["title"])
            ];
          }),
          "item.version": t(({ item: J }) => {
            var ae;
            return [
              u("span", null, h(((ae = J.plugin) == null ? void 0 : ae.version) || "—"), 1),
              J.latestLocalVersion ? (c(), F(w, {
                key: 0,
                size: "x-small",
                color: "primary",
                class: "ml-1",
                closable: "",
                "onClick:close": (re) => S(J),
                title: "Cancel local install"
              }, {
                default: t(() => [
                  l(h(J.latestLocalVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick:close"])) : K("", !0),
              J.newVersion && J.newVersion !== J.latestLocalVersion ? (c(), F(w, {
                key: 1,
                size: "x-small",
                color: "success",
                class: "ml-1",
                onClick: (re) => A(J.plugin.artifact, !0),
                title: "Upgrade available — click to install"
              }, {
                default: t(() => [
                  e(H, {
                    start: "",
                    size: "x-small"
                  }, {
                    default: t(() => [..._[10] || (_[10] = [
                      l("mdi-arrow-up", -1)
                    ])]),
                    _: 1
                  }),
                  l(h(J.newVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : K("", !0)
            ];
          }),
          "item.nodes": t(({ item: J }) => {
            var ae, re;
            return [
              ((re = (ae = J.plugin) == null ? void 0 : ae.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (c(), Z("span", ml, h(J.nodes ?? 0), 1)) : K("", !0)
            ];
          }),
          "item.subscriptions": t(({ item: J }) => {
            var ae, re;
            return [
              ((re = (ae = J.plugin) == null ? void 0 : ae.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (c(), Z("span", pl, h(J.subscriptions ?? 0), 1)) : K("", !0)
            ];
          }),
          "item.actions": t(({ item: J }) => [
            J.deleted ? (c(), F(H, {
              key: 0,
              size: "small",
              color: "warning",
              title: "Deletion scheduled"
            }, {
              default: t(() => [..._[11] || (_[11] = [
                l("mdi-cancel", -1)
              ])]),
              _: 1
            })) : (c(), F(N, {
              key: 1,
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (ae) => r(J.plugin.artifact),
              title: "Delete plug-in"
            }, {
              default: t(() => [
                e(H, { size: "small" }, {
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
        e(te, {
          modelValue: o.value,
          "onUpdate:modelValue": _[5] || (_[5] = (J) => o.value = J),
          "max-width": "520"
        }, {
          default: t(() => [
            e(W, null, {
              default: t(() => [
                e(b, null, {
                  default: t(() => [..._[13] || (_[13] = [
                    l("Install plug-in", -1)
                  ])]),
                  _: 1
                }),
                e(q, null, {
                  default: t(() => [
                    e(ee, {
                      modelValue: x.value,
                      "onUpdate:modelValue": _[2] || (_[2] = (J) => x.value = J),
                      label: "Artifact id (e.g. plugin-prov-aws)",
                      variant: "outlined",
                      hint: `Repository: ${L.value}`,
                      "persistent-hint": "",
                      class: "mb-2",
                      autofocus: ""
                    }, null, 8, ["modelValue", "hint"]),
                    e(Q, {
                      modelValue: C.value,
                      "onUpdate:modelValue": _[3] || (_[3] = (J) => C.value = J),
                      label: "Install Javadoc bundle",
                      density: "compact",
                      "hide-details": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                e(y, null, {
                  default: t(() => [
                    e(i),
                    e(N, {
                      variant: "text",
                      onClick: _[4] || (_[4] = (J) => o.value = !1)
                    }, {
                      default: t(() => [..._[14] || (_[14] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(N, {
                      color: "primary",
                      variant: "elevated",
                      loading: M.value,
                      disabled: !x.value,
                      onClick: I
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
}, fl = { class: "d-flex align-center mb-4" }, yl = {
  __name: "SystemNodeView",
  setup(d) {
    const U = fe(), z = pe(), D = s([]), L = s(!1), m = s(null), R = s(!1), $ = s(null), B = s(!1), V = [
      { title: "Identifier", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Status", key: "status", sortable: !0, width: "120px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function o(E) {
      var f;
      const v = (f = E == null ? void 0 : E.toLowerCase) == null ? void 0 : f.call(E);
      return v === "up" ? "success" : v === "down" ? "error" : v === "unknown" ? "warning" : "grey";
    }
    async function x() {
      L.value = !0, m.value = null;
      const E = await U.get("rest/node");
      D.value = Array.isArray(E) ? E : (E == null ? void 0 : E.data) || [], L.value = !1;
    }
    function C(E) {
      $.value = E, R.value = !0;
    }
    async function M() {
      B.value = !0, await U.del(`rest/node/${encodeURIComponent($.value.id)}`), B.value = !1, R.value = !1, x();
    }
    return me(() => {
      z.setTitle("Nodes"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]), x();
    }), (E, v) => {
      const f = n("v-spacer"), P = n("v-btn"), G = n("v-alert"), A = n("v-chip"), I = n("v-icon"), S = n("v-data-table"), r = n("v-card-title"), p = n("v-card-text"), _ = n("v-card-actions"), i = n("v-card"), Y = n("v-dialog");
      return c(), Z("div", null, [
        u("div", fl, [
          v[3] || (v[3] = u("h1", { class: "text-h4" }, "Nodes", -1)),
          e(f),
          e(P, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            to: "/subscribe"
          }, {
            default: t(() => [...v[2] || (v[2] = [
              l("New subscription", -1)
            ])]),
            _: 1
          })
        ]),
        m.value ? (c(), F(G, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(m.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(S, {
          headers: V,
          items: D.value,
          loading: L.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.id": t(({ item: N }) => [
            u("code", null, h(N.id), 1)
          ]),
          "item.status": t(({ item: N }) => [
            N.status ? (c(), F(A, {
              key: 0,
              size: "x-small",
              color: o(N.status),
              variant: "tonal"
            }, {
              default: t(() => [
                l(h(N.status), 1)
              ]),
              _: 2
            }, 1032, ["color"])) : K("", !0)
          ]),
          "item.actions": t(({ item: N }) => [
            e(P, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (T) => C(N)
            }, {
              default: t(() => [
                e(I, { size: "small" }, {
                  default: t(() => [...v[4] || (v[4] = [
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
          modelValue: R.value,
          "onUpdate:modelValue": v[1] || (v[1] = (N) => R.value = N),
          "max-width": "460"
        }, {
          default: t(() => [
            e(i, null, {
              default: t(() => [
                e(r, null, {
                  default: t(() => [...v[5] || (v[5] = [
                    l("Delete node", -1)
                  ])]),
                  _: 1
                }),
                e(p, null, {
                  default: t(() => {
                    var N, T;
                    return [
                      v[6] || (v[6] = l(" Delete ", -1)),
                      u("strong", null, h((N = $.value) == null ? void 0 : N.name), 1),
                      v[7] || (v[7] = l(" (", -1)),
                      u("code", null, h((T = $.value) == null ? void 0 : T.id), 1),
                      v[8] || (v[8] = l(")? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(_, null, {
                  default: t(() => [
                    e(f),
                    e(P, {
                      variant: "text",
                      onClick: v[0] || (v[0] = (N) => R.value = !1)
                    }, {
                      default: t(() => [...v[9] || (v[9] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(P, {
                      color: "error",
                      variant: "elevated",
                      loading: B.value,
                      onClick: M
                    }, {
                      default: t(() => [...v[10] || (v[10] = [
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
}, _l = { class: "d-flex align-center mb-4" }, gl = { class: "d-flex align-center ga-2" }, bl = { class: "d-flex align-center ga-2" }, kl = {
  __name: "SystemCacheView",
  setup(d) {
    const U = fe(), z = pe(), D = s([]), L = s(!1), m = s(null), R = s(null), $ = [
      { title: "Cache", key: "id", sortable: !0 },
      { title: "Size", key: "size", sortable: !0, width: "100px" },
      { title: "Hits", key: "hitCount", sortable: !0, width: "160px" },
      { title: "Misses", key: "missCount", sortable: !0, width: "160px" },
      { title: "Avg get (ms)", key: "averageGetTime", sortable: !0, width: "140px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function B(x, C, M) {
      return C && M === 1 || x >= 90 ? "success" : x >= 80 ? "primary" : x >= 50 ? "warning" : "error";
    }
    async function V() {
      L.value = !0, m.value = null;
      const x = await U.get("rest/system/cache");
      Array.isArray(x) ? D.value = x : x === null && (m.value = "Unable to load caches"), L.value = !1;
    }
    async function o(x) {
      R.value = x.id, await U.post(`rest/system/cache/${encodeURIComponent(x.id)}`), R.value = null, V();
    }
    return me(() => {
      z.setTitle("Caches"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Caches" }]), V();
    }), (x, C) => {
      const M = n("v-spacer"), E = n("v-btn"), v = n("v-alert"), f = n("v-chip"), P = n("v-icon"), G = n("v-data-table");
      return c(), Z("div", null, [
        u("div", _l, [
          C[1] || (C[1] = u("h1", { class: "text-h4" }, "Caches", -1)),
          e(M),
          e(E, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            onClick: V
          }, {
            default: t(() => [...C[0] || (C[0] = [
              l("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        m.value ? (c(), F(v, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(m.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(G, {
          headers: $,
          items: D.value,
          loading: L.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.hitCount": t(({ item: A }) => [
            u("div", gl, [
              u("span", null, h(A.hitCount ?? 0), 1),
              A.hitPercentage != null && (A.hitCount ?? 0) > 0 ? (c(), F(f, {
                key: 0,
                size: "x-small",
                color: B(A.hitPercentage, !0, A.hitCount)
              }, {
                default: t(() => [
                  l(h(Math.round(A.hitPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : K("", !0)
            ])
          ]),
          "item.missCount": t(({ item: A }) => [
            u("div", bl, [
              u("span", null, h(A.missCount ?? 0), 1),
              A.missPercentage != null && (A.missCount ?? 0) > 1 ? (c(), F(f, {
                key: 0,
                size: "x-small",
                color: B(100 - A.missPercentage, !1)
              }, {
                default: t(() => [
                  l(h(Math.round(A.missPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : K("", !0)
            ])
          ]),
          "item.averageGetTime": t(({ item: A }) => [
            l(h(A.averageGetTime ?? "—"), 1)
          ]),
          "item.actions": t(({ item: A }) => [
            e(E, {
              icon: "",
              size: "small",
              variant: "text",
              loading: R.value === A.id,
              onClick: (I) => o(A),
              title: "Invalidate cache"
            }, {
              default: t(() => [
                e(P, { size: "small" }, {
                  default: t(() => [...C[2] || (C[2] = [
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
}, wl = { key: 1 }, xl = {
  __name: "SystemBenchView",
  setup(d) {
    const U = fe(), z = pe(), D = [
      { key: "insert", step: "INSERT", form: !0, url: "rest/system/bench/prepare" },
      { key: "select", step: "SELECT", method: "get", url: "rest/system/bench/read" },
      { key: "select-all", step: "SELECT *", method: "get", url: "rest/system/bench/read/all" },
      { key: "update", step: "UPDATE", method: "put", url: "rest/system/bench/update" },
      { key: "delete", step: "DELETE", method: "del", url: "rest/system/bench/delete" }
    ];
    async function L(V) {
      if (V.form) {
        const o = await fetch(`/${V.url}`, {
          method: "POST",
          credentials: "include",
          body: new FormData()
        });
        if (!o.ok) throw new Error(`${V.step} HTTP ${o.status}`);
        const x = (await o.text()).trim();
        if (!x) return { duration: "" };
        try {
          return JSON.parse(x);
        } catch {
        }
        const C = Number(x);
        return { duration: Number.isFinite(C) ? C : x };
      }
      return U[V.method](V.url);
    }
    const m = s(!1), R = s(null), $ = s(D.map((V) => ({ step: V.step, duration: null, loading: !1 })));
    async function B() {
      m.value = !0, R.value = null, $.value = D.map((V) => ({ step: V.step, duration: null, loading: !1 }));
      for (let V = 0; V < D.length; V++) {
        $.value[V].loading = !0;
        try {
          const o = await L(D[V]);
          $.value[V].duration = (o == null ? void 0 : o.duration) ?? "—";
        } catch (o) {
          R.value = `${D[V].step} failed: ${o.message || o}`;
          break;
        } finally {
          $.value[V].loading = !1;
        }
      }
      m.value = !1;
    }
    return me(() => {
      z.setTitle("Bench"), z.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (V, o) => {
      const x = n("v-card-text"), C = n("v-card"), M = n("v-btn"), E = n("v-alert"), v = n("v-progress-circular"), f = n("v-table");
      return c(), Z("div", null, [
        o[3] || (o[3] = u("h1", { class: "text-h4 mb-4" }, "Database bench", -1)),
        e(C, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(x, null, {
              default: t(() => [...o[0] || (o[0] = [
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
        e(M, {
          color: "primary",
          "prepend-icon": "mdi-play",
          loading: m.value,
          onClick: B
        }, {
          default: t(() => [...o[1] || (o[1] = [
            l(" Run bench ", -1)
          ])]),
          _: 1
        }, 8, ["loading"]),
        R.value ? (c(), F(E, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mt-4"
        }, {
          default: t(() => [
            l(h(R.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        $.value.length ? (c(), F(f, {
          key: 1,
          density: "compact",
          class: "mt-4",
          style: { "max-width": "600px" }
        }, {
          default: t(() => [
            o[2] || (o[2] = u("thead", null, [
              u("tr", null, [
                u("th", null, "Step"),
                u("th", null, "Duration (ms)")
              ])
            ], -1)),
            u("tbody", null, [
              (c(!0), Z(ve, null, ke($.value, (P) => (c(), Z("tr", {
                key: P.step
              }, [
                u("td", null, h(P.step), 1),
                u("td", null, [
                  P.loading ? (c(), F(v, {
                    key: 0,
                    size: "16",
                    width: "2",
                    indeterminate: ""
                  })) : (c(), Z("span", wl, h(P.duration ?? "—"), 1))
                ])
              ]))), 128))
            ])
          ]),
          _: 1
        })) : K("", !0)
      ]);
    };
  }
}, Vl = { class: "d-flex align-center mb-4" }, Cl = {
  __name: "ApiHomeView",
  setup(d) {
    const U = pe(), z = s(!0), D = s(null), L = "/", m = `${L}rest/swagger-ui-bundle.js`, R = `${L}rest/swagger-ui-standalone-preset.js`, $ = `${L}rest/swagger-ui.css`, B = `${L}rest/index.css`, V = `${L}rest/openapi.json`;
    function o() {
      return () => ({
        fn: {
          opsFilter(v, f) {
            const P = f.toLowerCase();
            return v.map((A) => (A._root.entries[1][1] = A._root.entries[1][1].filter((I) => {
              const S = JSON.parse(JSON.stringify(I)), r = (S.operation.summary || "").toString().toLowerCase(), p = (S.operation.description || "").toString().toLowerCase();
              return S.path.toLowerCase().includes(P) || r.includes(P) || p.includes(P);
            }), A)).filter((A) => A._root.entries[1][1].size > 0);
          }
        }
      });
    }
    function x(v, f) {
      if (document.getElementById(f)) return;
      const P = document.createElement("link");
      P.id = f, P.rel = "stylesheet", P.href = v, document.head.appendChild(P);
    }
    function C(v) {
      var f;
      (f = document.getElementById(v)) == null || f.remove();
    }
    function M(v, f) {
      return new Promise((P, G) => {
        if (document.getElementById(f)) {
          P();
          return;
        }
        const I = document.createElement("script");
        I.id = f, I.src = v, I.async = !0, I.onload = P, I.onerror = () => G(new Error(`Failed to load ${v}`)), document.head.appendChild(I);
      });
    }
    function E() {
      const { SwaggerUIBundle: v, SwaggerUIStandalonePreset: f } = window;
      if (!v) {
        D.value = "Swagger UI bundle is unavailable.";
        return;
      }
      window.ui = v({
        url: V,
        dom_id: "#swagger-ui",
        displayRequestDuration: !0,
        deepLinking: !1,
        presets: [v.presets.apis, f],
        plugins: [v.plugins.FiltrePreset, o()].filter(Boolean),
        filter: !0,
        layout: "StandaloneLayout",
        validatorUrl: "https://validator.swagger.io/validator"
      });
    }
    return me(async () => {
      U.setTitle("API"), U.setBreadcrumbs([{ title: "API" }]), x($, "swagger-ui-css"), x(B, "swagger-ui-extra-css");
      try {
        await Promise.all([
          M(m, "swagger-ui-bundle"),
          M(R, "swagger-ui-preset")
        ]), E();
      } catch (v) {
        D.value = v.message || "Unable to load Swagger UI.";
      } finally {
        z.value = !1;
      }
    }), Je(() => {
      C("swagger-ui-css"), C("swagger-ui-extra-css"), delete window.ui;
    }), (v, f) => {
      const P = n("v-spacer"), G = n("v-btn"), A = n("v-alert"), I = n("v-progress-linear");
      return c(), Z("div", null, [
        u("div", Vl, [
          f[1] || (f[1] = u("h1", { class: "text-h4" }, "API reference", -1)),
          e(P),
          e(G, {
            variant: "outlined",
            "prepend-icon": "mdi-code-tags",
            href: `${ie(L)}rest/openapi.json`,
            target: "_blank"
          }, {
            default: t(() => [...f[0] || (f[0] = [
              l(" Download OpenAPI ", -1)
            ])]),
            _: 1
          }, 8, ["href"])
        ]),
        D.value ? (c(), F(A, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(D.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        z.value ? (c(), F(I, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : K("", !0),
        f[2] || (f[2] = u("div", {
          id: "swagger-ui",
          class: "swagger-container"
        }, null, -1))
      ]);
    };
  }
}, $l = /* @__PURE__ */ we(Cl, [["__scopeId", "data-v-f74586ba"]]), Sl = { class: "d-flex align-center mb-4" }, hl = { class: "mb-0 text-body-2" }, Ul = {
  __name: "ApiTokenView",
  setup(d) {
    const U = fe(), z = pe(), D = he(), L = "/", m = typeof window < "u" ? window.location.origin : "", R = ce(() => D.userName || "<you>"), $ = s([]), B = s(!1), V = s(null), o = s(!1), x = s(null), C = s(""), M = s(!1), E = s(!1), v = s(""), f = s(""), P = s(!1), G = s(""), A = s(""), I = s(!1), S = s(!1), r = s(!1), p = s(""), _ = s(!1), i = { required: (q) => !!q || "Required" }, Y = [
      { title: "Name", key: "name", sortable: !0 },
      { title: "", key: "actions", sortable: !1, width: "140px", align: "end" }
    ];
    async function N() {
      B.value = !0, V.value = null;
      const q = await U.get("rest/api/token");
      $.value = Array.isArray(q) ? q.map((y) => ({ name: y })) : [], B.value = !1;
    }
    function T() {
      C.value = "", o.value = !0;
    }
    async function H() {
      const { valid: q } = await x.value.validate();
      if (!q) return;
      M.value = !0;
      const y = await U.post(`rest/api/token/${encodeURIComponent(C.value)}`);
      M.value = !1, y !== null && (v.value = C.value, f.value = typeof y == "string" ? y : (y == null ? void 0 : y.id) || "", o.value = !1, E.value = !0, N());
    }
    async function w(q, y) {
      G.value = q, A.value = "", S.value = !1, P.value = !0, I.value = !0;
      const W = `rest/api/token/${encodeURIComponent(q)}`, te = y === "regen" ? await U.put(W) : await U.get(W);
      A.value = typeof te == "string" ? te : (te == null ? void 0 : te.id) || "", I.value = !1;
    }
    async function a() {
      try {
        await navigator.clipboard.writeText(A.value), S.value = !0, setTimeout(() => {
          S.value = !1;
        }, 2e3);
      } catch {
      }
    }
    async function b() {
      try {
        await navigator.clipboard.writeText(f.value);
      } catch {
      }
    }
    function ee(q) {
      p.value = q, r.value = !0;
    }
    async function Q() {
      _.value = !0, await U.del(`rest/api/token/${encodeURIComponent(p.value)}`), _.value = !1, r.value = !1, N();
    }
    return me(() => {
      z.setTitle("API tokens"), z.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]), N();
    }), (q, y) => {
      const W = n("v-spacer"), te = n("v-btn"), J = n("v-card-text"), ae = n("v-card"), re = n("v-alert"), O = n("v-icon"), oe = n("v-data-table"), ue = n("v-card-title"), _e = n("v-text-field"), k = n("v-form"), g = n("v-card-actions"), j = n("v-dialog"), se = n("v-progress-linear"), ne = n("v-textarea");
      return c(), Z("div", null, [
        u("div", Sl, [
          y[11] || (y[11] = u("h1", { class: "text-h4" }, "API tokens", -1)),
          e(W),
          e(te, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: T
          }, {
            default: t(() => [...y[10] || (y[10] = [
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
            e(J, null, {
              default: t(() => [
                y[13] || (y[13] = u("p", { class: "mb-2" }, [
                  l(" Tokens let you call the Ligoj API without a password. Pass the token in the "),
                  u("code", null, "api-key"),
                  l(" parameter along with your user id in "),
                  u("code", null, "api-user"),
                  l(". ")
                ], -1)),
                u("p", hl, [
                  y[12] || (y[12] = l(" Example: ", -1)),
                  u("code", null, " GET " + h(ie(m)) + h(ie(L)) + "rest/project?api-key=<token>&api-user=" + h(R.value), 1)
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        V.value ? (c(), F(re, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(V.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        e(oe, {
          headers: Y,
          items: $.value,
          loading: B.value,
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
              onClick: (ye) => w(le.name, "load")
            }, {
              default: t(() => [
                e(O, { size: "small" }, {
                  default: t(() => [...y[14] || (y[14] = [
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
              onClick: (ye) => w(le.name, "regen")
            }, {
              default: t(() => [
                e(O, { size: "small" }, {
                  default: t(() => [...y[15] || (y[15] = [
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
              onClick: (ye) => ee(le.name)
            }, {
              default: t(() => [
                e(O, { size: "small" }, {
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
        e(j, {
          modelValue: o.value,
          "onUpdate:modelValue": y[2] || (y[2] = (le) => o.value = le),
          "max-width": "480",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
                  default: t(() => [...y[17] || (y[17] = [
                    l("New API token", -1)
                  ])]),
                  _: 1
                }),
                e(J, null, {
                  default: t(() => [
                    e(k, {
                      ref_key: "createFormRef",
                      ref: x,
                      onSubmit: xe(H, ["prevent"])
                    }, {
                      default: t(() => [
                        e(_e, {
                          modelValue: C.value,
                          "onUpdate:modelValue": y[0] || (y[0] = (le) => C.value = le),
                          label: "Name",
                          rules: [i.required],
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
                    e(W),
                    e(te, {
                      variant: "text",
                      onClick: y[1] || (y[1] = (le) => o.value = !1)
                    }, {
                      default: t(() => [...y[18] || (y[18] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(te, {
                      color: "primary",
                      variant: "elevated",
                      loading: M.value,
                      onClick: H
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
        e(j, {
          modelValue: P.value,
          "onUpdate:modelValue": y[5] || (y[5] = (le) => P.value = le),
          "max-width": "520"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
                  default: t(() => [
                    y[20] || (y[20] = l(" Token: ", -1)),
                    u("code", null, h(G.value), 1)
                  ]),
                  _: 1
                }),
                e(J, null, {
                  default: t(() => [
                    I.value ? (c(), F(se, {
                      key: 0,
                      indeterminate: "",
                      color: "primary",
                      class: "mb-3"
                    })) : K("", !0),
                    e(ne, {
                      modelValue: A.value,
                      "onUpdate:modelValue": y[3] || (y[3] = (le) => A.value = le),
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": a
                    }, null, 8, ["modelValue"]),
                    S.value ? (c(), F(re, {
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
                    e(W),
                    e(te, {
                      variant: "text",
                      onClick: y[4] || (y[4] = (le) => P.value = !1)
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
        e(j, {
          modelValue: E.value,
          "onUpdate:modelValue": y[7] || (y[7] = (le) => E.value = le),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
                  default: t(() => [
                    y[23] || (y[23] = l(" New token: ", -1)),
                    u("code", null, h(v.value), 1)
                  ]),
                  _: 1
                }),
                e(J, null, {
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
                      "model-value": f.value,
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
                    e(W),
                    e(te, {
                      color: "primary",
                      onClick: y[6] || (y[6] = (le) => E.value = !1)
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
        e(j, {
          modelValue: r.value,
          "onUpdate:modelValue": y[9] || (y[9] = (le) => r.value = le),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
                  default: t(() => [...y[26] || (y[26] = [
                    l("Delete token", -1)
                  ])]),
                  _: 1
                }),
                e(J, null, {
                  default: t(() => [
                    y[27] || (y[27] = l("Revoke token ", -1)),
                    u("code", null, h(p.value), 1),
                    y[28] || (y[28] = l("?", -1))
                  ]),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(W),
                    e(te, {
                      variant: "text",
                      onClick: y[8] || (y[8] = (le) => r.value = !1)
                    }, {
                      default: t(() => [...y[29] || (y[29] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(te, {
                      color: "error",
                      variant: "elevated",
                      loading: _.value,
                      onClick: Q
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
}, Pl = { class: "d-flex align-center mb-4" }, Tl = { class: "pa-4" }, Nl = { class: "pa-4" }, jl = { class: "text-body-2 text-medium-emphasis mb-4" }, zl = { class: "d-flex align-center pa-2" }, Al = {
  __name: "SubscribeWizardView",
  setup(d) {
    const U = Ie(), z = Ue(), D = fe(), L = pe(), m = ce(() => U.query.project ?? U.params.id ?? null), R = s(null), $ = s(!1), B = s(null), V = s(1), o = Ve({
      service: null,
      tool: null,
      node: null,
      mode: null
    }), x = s([]), C = s([]), M = s([]), E = s([]), v = Ve({}), f = s(null), P = s(!1), G = s(!1), A = s(!1), I = s(!1), S = s(!1), r = ce(() => ["Service", "Tool", "Node", "Mode", "Parameters"]), p = ce(() => (k) => k === 1 ? !0 : k === 2 ? !!o.service : k === 3 ? !!o.tool : k === 4 ? !!o.node : k === 5 ? !!o.node && !!o.mode : !1), _ = ce(() => V.value === 1 ? !!o.service : V.value === 2 ? !!o.tool : V.value === 3 ? !!o.node : V.value === 4 ? !!o.mode : !1), i = ce(() => {
      var j;
      const k = (j = o.tool) == null ? void 0 : j.mode, g = [];
      return (k === "all" || k === "create") && g.push({ value: "create", label: "Create — provision a new instance inside the tool" }), (k === "all" || k === "link" || !k) && g.push({ value: "link", label: "Link — attach this project to an existing instance" }), g;
    }), Y = ce(
      () => R.value ? `/home/project/${R.value.id}` : "/home/project"
    );
    function N(k) {
      return !k.type || k.type === "text" || k.type === "password" || k.type === "node" || k.type === "project";
    }
    function T(k) {
      return k.type === "password" || (k.name || "").toLowerCase().includes("password");
    }
    function H(k) {
      const g = k.mandatory || k.required ? " *" : "";
      return `${k.name || k.id}${g}`;
    }
    function w(k) {
      const g = [];
      return (k.mandatory || k.required) && g.push((j) => j !== "" && j != null || "Required"), g;
    }
    async function a() {
      if (!m.value) return;
      $.value = !0;
      const k = await D.get(`rest/project/${m.value}`);
      R.value = k || null, $.value = !1;
    }
    async function b() {
      P.value = !0, x.value = await W("rest/node?refined=service&rows=1000"), P.value = !1;
    }
    async function ee(k) {
      G.value = !0, C.value = await W(`rest/node?refined=${encodeURIComponent(k)}&rows=1000`), G.value = !1;
    }
    async function Q(k) {
      A.value = !0, M.value = await W(`rest/node?refined=${encodeURIComponent(k)}&rows=1000`), A.value = !1;
    }
    async function q(k, g) {
      I.value = !0;
      const j = await D.get(`rest/node/${encodeURIComponent(k)}/parameter/${g.toUpperCase()}`);
      E.value = Array.isArray(j) ? j : (j == null ? void 0 : j.data) || [];
      for (const se of Object.keys(v)) delete v[se];
      for (const se of E.value)
        se.defaultValue != null ? v[se.id] = y(se) : se.type === "bool" ? v[se.id] = !1 : se.type === "multiselect" || se.type === "tags" ? v[se.id] = [] : v[se.id] = "";
      I.value = !1;
    }
    function y(k) {
      return k.type === "integer" ? Number(k.defaultValue) : k.type === "bool" ? k.defaultValue === !0 || k.defaultValue === "true" : k.defaultValue;
    }
    async function W(k) {
      const g = await D.get(k);
      return Array.isArray(g) ? te(g) : Array.isArray(g == null ? void 0 : g.data) ? te(g.data) : [];
    }
    function te(k) {
      return k.filter((g) => g.enabled !== !1);
    }
    function J(k) {
      var g;
      ((g = o.service) == null ? void 0 : g.id) !== k.id && (o.service = k, o.tool = null, o.node = null, o.mode = null, C.value = [], M.value = []);
    }
    function ae(k) {
      var g;
      ((g = o.tool) == null ? void 0 : g.id) !== k.id && (o.tool = k, o.node = null, o.mode = null, M.value = []);
    }
    function re(k) {
      var g;
      ((g = o.node) == null ? void 0 : g.id) !== k.id && (o.node = k, o.mode = null);
    }
    ze(V, async (k) => {
      k === 1 && x.value.length === 0 && await b(), k === 2 && o.service && C.value.length === 0 && await ee(o.service.id), k === 3 && o.tool && M.value.length === 0 && await Q(o.tool.id), k === 4 && !o.mode && i.value.length > 0 && (o.mode = i.value[0].value), k === 5 && o.node && o.mode && await q(o.node.id, o.mode);
    });
    async function O() {
      const { valid: k } = f.value ? await f.value.validate() : { valid: !0 };
      if (!k) return;
      S.value = !0, B.value = null;
      const g = {
        node: o.node.id,
        project: Number(m.value),
        mode: o.mode,
        parameters: E.value.map((se) => oe(se)).filter(Boolean)
      }, j = await D.post("rest/subscription", g);
      S.value = !1, j != null ? z.push(`/home/project/${m.value}`) : B.value = "Subscription creation failed — please review the highlighted parameters.";
    }
    function oe(k) {
      const g = v[k.id];
      if ((g === "" || g == null || Array.isArray(g) && g.length === 0) && !k.mandatory && !k.required)
        return null;
      const j = { parameter: k.id };
      return k.type === "integer" ? { ...j, integer: Number(g) } : k.type === "bool" ? { ...j, bool: !!g } : k.type === "multiselect" || k.type === "tags" ? { ...j, selections: g || [] } : k.type === "select" ? { ...j, text: g } : { ...j, text: g };
    }
    me(async () => {
      L.setTitle("Subscribe"), L.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        ...m.value ? [{ title: m.value, to: `/home/project/${m.value}` }, { title: "Subscribe" }] : [{ title: "Subscribe" }]
      ]), await a(), R.value && await b();
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
      setup(k, { emit: g }) {
        return () => be("div", { class: "pa-4" }, [
          be("h3", { class: "text-h6 mb-1" }, k.heading),
          k.sub && be("p", { class: "text-body-2 text-medium-emphasis mb-4" }, k.sub),
          k.loading ? be("div", { class: "text-body-2 text-medium-emphasis pa-4" }, "Loading…") : k.choices.length ? be(
            "div",
            { class: "choice-grid" },
            k.choices.map(
              (j) => be(
                "button",
                {
                  key: j.id,
                  type: "button",
                  class: [
                    "choice-card",
                    { "choice-card--active": j.id === k.selectedId }
                  ],
                  onClick: () => g("select", j),
                  title: j.description || void 0
                },
                [
                  be("div", { class: "choice-icon" }, _e(j)),
                  be("div", { class: "choice-name" }, j.name || j.id)
                ]
              )
            )
          ) : be("div", { class: "text-body-2 text-medium-emphasis" }, "No entries available.")
        ]);
      }
    };
    function _e(k) {
      var j;
      const g = (k == null ? void 0 : k.uiClasses) || ((j = k == null ? void 0 : k.refined) == null ? void 0 : j.uiClasses);
      return g && g.startsWith("$") ? g.slice(1) : g ? be("i", { class: g }) : be("i", { class: "mdi mdi-puzzle" });
    }
    return (k, g) => {
      const j = n("v-spacer"), se = n("v-btn"), ne = n("router-link"), le = n("v-alert"), ye = n("v-radio"), Le = n("v-radio-group"), Ee = n("v-progress-linear"), Ce = n("v-text-field"), Be = n("v-checkbox"), Pe = n("v-select"), qe = n("v-form"), Fe = n("v-stepper");
      return c(), Z("div", null, [
        u("div", Pl, [
          g[3] || (g[3] = u("h1", { class: "text-h4" }, "Subscribe", -1)),
          e(j),
          e(se, {
            variant: "text",
            to: Y.value
          }, {
            default: t(() => [...g[2] || (g[2] = [
              l("Cancel", -1)
            ])]),
            _: 1
          }, 8, ["to"])
        ]),
        m.value ? $.value ? (c(), F(le, {
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
        })) : R.value ? (c(), F(le, {
          key: 2,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            g[8] || (g[8] = l(" Adding a subscription to ", -1)),
            u("strong", null, h(R.value.name), 1),
            l(" (" + h(R.value.pkey) + "). ", 1),
            g[9] || (g[9] = u("br", null, null, -1)),
            g[10] || (g[10] = u("span", { class: "text-caption text-warning" }, "Subscribing is not an idempotent operation — removing a subscription later may not clean up remote data automatically.", -1))
          ]),
          _: 1
        })) : K("", !0) : (c(), F(le, {
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
        B.value ? (c(), F(le, {
          key: 3,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(h(B.value), 1)
          ]),
          _: 1
        })) : K("", !0),
        R.value ? (c(), F(Fe, {
          key: 4,
          modelValue: V.value,
          "onUpdate:modelValue": g[1] || (g[1] = (de) => V.value = de),
          items: r.value,
          "alt-labels": "",
          editable: p.value,
          class: "mb-4"
        }, {
          "item.1": t(() => {
            var de;
            return [
              e(ue, {
                heading: "Select a service",
                sub: "A service groups features implemented by one or more tools.",
                choices: x.value,
                loading: P.value,
                "selected-id": (de = o.service) == null ? void 0 : de.id,
                onSelect: J
              }, null, 8, ["choices", "loading", "selected-id"])
            ];
          }),
          "item.2": t(() => {
            var de, X;
            return [
              e(ue, {
                heading: `Select a tool providing ${((de = o.service) == null ? void 0 : de.name) ?? "…"}`,
                sub: "A tool is one implementation of the service; several instances may be deployed.",
                choices: C.value,
                loading: G.value,
                "selected-id": (X = o.tool) == null ? void 0 : X.id,
                onSelect: ae
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.3": t(() => {
            var de, X;
            return [
              e(ue, {
                heading: `Pick a node running ${((de = o.tool) == null ? void 0 : de.name) ?? "…"}`,
                sub: "A node is a running instance of the tool.",
                choices: M.value,
                loading: A.value,
                "selected-id": (X = o.node) == null ? void 0 : X.id,
                onSelect: re
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.4": t(() => [
            u("div", Tl, [
              g[11] || (g[11] = u("h3", { class: "text-h6 mb-2" }, "Subscription mode", -1)),
              g[12] || (g[12] = u("p", { class: "text-body-2 text-medium-emphasis mb-4" }, [
                u("strong", null, "Link"),
                l(" attaches this project to an existing instance in the tool. "),
                u("strong", null, "Create"),
                l(" additionally provisions a new instance inside the tool. ")
              ], -1)),
              e(Le, {
                modelValue: o.mode,
                "onUpdate:modelValue": g[0] || (g[0] = (de) => o.mode = de),
                inline: ""
              }, {
                default: t(() => [
                  (c(!0), Z(ve, null, ke(i.value, (de) => (c(), F(ye, {
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
              u("div", Nl, [
                g[16] || (g[16] = u("h3", { class: "text-h6 mb-1" }, "Parameters", -1)),
                u("p", jl, [
                  g[13] || (g[13] = l(" Values required to link the project to ", -1)),
                  u("code", null, h((de = o.node) == null ? void 0 : de.id), 1),
                  g[14] || (g[14] = l(". ", -1))
                ]),
                I.value ? (c(), F(Ee, {
                  key: 0,
                  indeterminate: "",
                  color: "primary",
                  class: "mb-3"
                })) : K("", !0),
                !I.value && E.value.length === 0 ? (c(), F(le, {
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
                e(qe, {
                  ref_key: "paramFormRef",
                  ref: f
                }, {
                  default: t(() => [
                    (c(!0), Z(ve, null, ke(E.value, (X) => (c(), Z("div", {
                      key: X.id,
                      class: "mb-3"
                    }, [
                      N(X) ? (c(), F(Ce, {
                        key: 0,
                        modelValue: v[X.id],
                        "onUpdate:modelValue": (ge) => v[X.id] = ge,
                        type: T(X) ? "password" : "text",
                        label: H(X),
                        rules: w(X),
                        hint: X.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "label", "rules", "hint"])) : X.type === "integer" ? (c(), F(Ce, {
                        key: 1,
                        modelValue: v[X.id],
                        "onUpdate:modelValue": (ge) => v[X.id] = ge,
                        modelModifiers: { number: !0 },
                        type: "number",
                        min: X.min,
                        max: X.max,
                        label: H(X),
                        rules: w(X),
                        hint: X.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "max", "label", "rules", "hint"])) : X.type === "bool" ? (c(), F(Be, {
                        key: 2,
                        modelValue: v[X.id],
                        "onUpdate:modelValue": (ge) => v[X.id] = ge,
                        label: H(X),
                        hint: X.description,
                        "persistent-hint": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "hint"])) : X.type === "select" ? (c(), F(Pe, {
                        key: 3,
                        modelValue: v[X.id],
                        "onUpdate:modelValue": (ge) => v[X.id] = ge,
                        items: X.values || [],
                        label: H(X),
                        rules: w(X),
                        hint: X.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : X.type === "multiselect" || X.type === "tags" ? (c(), F(Pe, {
                        key: 4,
                        modelValue: v[X.id],
                        "onUpdate:modelValue": (ge) => v[X.id] = ge,
                        items: X.values || [],
                        label: H(X),
                        rules: w(X),
                        hint: X.description,
                        "persistent-hint": "",
                        chips: "",
                        multiple: "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : (c(), F(Ce, {
                        key: 5,
                        modelValue: v[X.id],
                        "onUpdate:modelValue": (ge) => v[X.id] = ge,
                        label: H(X),
                        rules: w(X),
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
          actions: t(({ prev: de, next: X }) => [
            u("div", zl, [
              V.value > 1 ? (c(), F(se, {
                key: 0,
                variant: "text",
                "prepend-icon": "mdi-arrow-left",
                onClick: de
              }, {
                default: t(() => [...g[17] || (g[17] = [
                  l("Previous", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : K("", !0),
              e(j),
              V.value < r.value.length ? (c(), F(se, {
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
              }, 8, ["disabled", "onClick"])) : (c(), F(se, {
                key: 2,
                color: "success",
                "prepend-icon": "mdi-check",
                loading: S.value,
                disabled: !o.node,
                onClick: O
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
}, Te = /* @__PURE__ */ we(Al, [["__scopeId", "data-v-47b9f499"]]);
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
  { path: "/home", name: "ui-home", component: ft },
  { path: "/home/manual", name: "ui-manual", component: Ot },
  { path: "/home/project", name: "ui-project-list", component: St },
  { path: "/home/project/:id", name: "ui-project-detail", component: Bt },
  { path: "/system", name: "ui-system", component: Ht },
  { path: "/system/information", name: "ui-system-information", component: Yt },
  { path: "/system/configuration", name: "ui-system-configuration", component: al },
  { path: "/system/user", name: "ui-system-user", component: sl },
  { path: "/system/role", name: "ui-system-role", component: dl },
  { path: "/system/plugin", name: "ui-system-plugin", component: vl },
  { path: "/system/node", name: "ui-system-node", component: yl },
  { path: "/system/cache", name: "ui-system-cache", component: kl },
  { path: "/system/bench", name: "ui-system-bench", component: xl },
  { path: "/api", name: "ui-api", component: $l },
  { path: "/api/token", name: "ui-api-token", component: Ul },
  { path: "/subscribe", name: "ui-subscribe", component: Te },
  // Project-scoped entry used by ProjectDetailView's "Add subscription" button.
  { path: "/home/project/:id/subscription", name: "ui-subscribe-project", component: Te }
], Jl = {
  id: "ui",
  label: "UI",
  component: tt,
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
  Wl as TARGET_TYPE_ICON,
  Jl as default,
  Re as getFullName,
  Hl as getHierarchyIds,
  _t as getService,
  Ml as getServiceFromId,
  Ol as getServiceNameFromId,
  gt as getTool,
  Fl as getToolFromId,
  Gl as getToolNameFromId,
  Bl as htmlEscape,
  ql as htmlUnescape,
  kt as normalize,
  De as service,
  yt as toUser2Letters,
  El as trimObject
};
