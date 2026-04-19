import { resolveComponent as n, openBlock as m, createElementBlock as Z, createVNode as e, withCtx as t, createTextVNode as l, ref as i, computed as ce, onMounted as me, createElementVNode as u, Fragment as ve, renderList as ke, createBlock as M, toDisplayString as S, createCommentVNode as J, normalizeClass as Fe, mergeProps as Ne, unref as se, withDirectives as Oe, withModifiers as xe, vShow as Ge, watch as ze, reactive as Ve, normalizeProps as He, guardReactiveProps as We, withKeys as Se, onBeforeUnmount as Ke, h as be } from "vue";
import { useApi as fe, useAppStore as pe, useI18nStore as Je, useDataTable as Ae, useErrorStore as Ze, useAuthStore as he, LigojDataTable as Xe, LigojDataTableServer as Ye } from "@ligoj/host";
import { useRouter as Ue, useRoute as Ie } from "vue-router";
const we = (d, h) => {
  const I = d.__vccOpts || d;
  for (const [z, E] of h)
    I[z] = E;
  return I;
}, Qe = { class: "plugin-ui-shell" }, et = {
  __name: "UiPlugin",
  setup(d) {
    return (h, I) => {
      const z = n("v-alert"), E = n("v-list-subheader"), c = n("v-list-item"), L = n("v-list");
      return m(), Z("div", Qe, [
        e(z, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...I[0] || (I[0] = [
            l(" plugin-ui is being migrated from the legacy Cascade.js implementation — most views below are placeholders and link back to their legacy sources. ", -1)
          ])]),
          _: 1
        }),
        e(L, {
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            e(E, null, {
              default: t(() => [...I[1] || (I[1] = [
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
            e(E, null, {
              default: t(() => [...I[2] || (I[2] = [
                l("System", -1)
              ])]),
              _: 1
            }),
            e(c, {
              to: "/system",
              "prepend-icon": "mdi-cog",
              title: "System administration"
            }),
            e(E, null, {
              default: t(() => [...I[3] || (I[3] = [
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
            e(E, null, {
              default: t(() => [...I[4] || (I[4] = [
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
}, tt = /* @__PURE__ */ we(et, [["__scopeId", "data-v-9cfeae95"]]), De = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, lt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, nt = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mb-4"
}, at = { class: "ml-1 text-caption" }, ot = { class: "d-flex align-start mb-2" }, st = { class: "flex-grow-1 truncate" }, it = { class: "text-subtitle-1 font-weight-medium truncate" }, rt = { class: "text-caption text-medium-emphasis" }, ut = {
  key: 0,
  class: "sub-strip"
}, dt = {
  key: 0,
  class: "text-caption text-medium-emphasis ml-1"
}, ct = { style: { width: "28px" } }, mt = { class: "truncate" }, pt = { class: "truncate text-medium-emphasis" }, vt = {
  __name: "HomeView",
  setup(d) {
    const h = fe(), I = pe(), z = i(!1), E = i(null), c = i([]), L = i(""), U = i(null), N = i("md"), V = ce(() => {
      var j, G, D;
      const p = /* @__PURE__ */ new Map();
      for (const R of c.value) {
        const x = ((j = R.project) == null ? void 0 : j.id) ?? R.project;
        if (x == null) continue;
        let r = p.get(x);
        r || (r = {
          id: x,
          name: ((G = R.project) == null ? void 0 : G.name) || String(x),
          pkey: ((D = R.project) == null ? void 0 : D.pkey) || "",
          subscriptions: []
        }, p.set(x, r)), r.subscriptions.push(R);
      }
      return [...p.values()].sort((R, x) => R.name.localeCompare(x.name));
    }), s = ce(() => {
      var j, G, D;
      const p = /* @__PURE__ */ new Map();
      for (const R of c.value) {
        const x = ((D = (G = (j = R.node) == null ? void 0 : j.refined) == null ? void 0 : G.refined) == null ? void 0 : D.id) || "";
        x && p.set(x, (p.get(x) || 0) + 1);
      }
      return [...p.entries()].sort((R, x) => x[1] - R[1]).map(([R, x]) => ({
        id: R,
        count: x,
        icon: $(R),
        label: R.split(":").slice(-1)[0]
      }));
    }), C = ce(() => {
      var j;
      const p = (j = L.value) == null ? void 0 : j.trim().toLowerCase();
      return V.value.filter((G) => U.value && !G.subscriptions.some(
        (R) => {
          var x, r, v;
          return ((v = (r = (x = R.node) == null ? void 0 : x.refined) == null ? void 0 : r.refined) == null ? void 0 : v.id) === U.value;
        }
      ) ? !1 : !p || G.name.toLowerCase().includes(p) || G.pkey.toLowerCase().includes(p) ? !0 : G.subscriptions.some(
        (D) => {
          var R, x, r, v;
          return (((R = D.node) == null ? void 0 : R.name) || "").toLowerCase().includes(p) || (((x = D.node) == null ? void 0 : x.id) || "").toLowerCase().includes(p) || (((v = (r = D.node) == null ? void 0 : r.refined) == null ? void 0 : v.name) || "").toLowerCase().includes(p);
        }
      ));
    });
    function $(p) {
      return p.includes(":scm:") ? "mdi-source-branch" : p.includes(":build:") ? "mdi-hammer-wrench" : p.includes(":bt") ? "mdi-bug" : p.includes(":km:") ? "mdi-book-open-variant" : p.includes(":vm") ? "mdi-server" : p.includes(":prov") ? "mdi-cloud" : p.includes(":id") ? "mdi-account-group" : p.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    function F(p) {
      var j, G, D;
      return $(((D = (G = (j = p.node) == null ? void 0 : j.refined) == null ? void 0 : G.refined) == null ? void 0 : D.id) || "");
    }
    function B(p) {
      var R, x, r;
      const j = ((r = (x = (R = p.node) == null ? void 0 : R.refined) == null ? void 0 : x.refined) == null ? void 0 : r.id) || "", G = ["primary", "teal", "indigo", "purple", "orange", "blue-grey", "green"];
      let D = 0;
      for (const v of j) D += v.charCodeAt(0);
      return G[D % G.length];
    }
    async function f() {
      z.value = !0, E.value = null;
      const p = await h.get("rest/subscription");
      Array.isArray(p) ? c.value = p : Array.isArray(p == null ? void 0 : p.data) ? c.value = p.data : c.value = [], z.value = !1;
    }
    return me(() => {
      I.setTitle("Dashboard"), I.setBreadcrumbs([{ title: "Home" }]), f();
    }), (p, j) => {
      const G = n("v-spacer"), D = n("v-text-field"), R = n("v-icon"), x = n("v-btn"), r = n("v-btn-toggle"), v = n("v-chip"), y = n("v-alert"), o = n("v-progress-linear"), Y = n("v-tooltip"), T = n("v-table"), P = n("v-card-text"), H = n("v-card");
      return m(), Z("div", null, [
        u("div", lt, [
          j[6] || (j[6] = u("h1", { class: "text-h4" }, "Dashboard", -1)),
          e(G),
          e(D, {
            modelValue: L.value,
            "onUpdate:modelValue": j[0] || (j[0] = (w) => L.value = w),
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
            "onUpdate:modelValue": j[1] || (j[1] = (w) => N.value = w),
            mandatory: "",
            density: "compact",
            color: "primary"
          }, {
            default: t(() => [
              e(x, {
                value: "sm",
                title: "Small tiles"
              }, {
                default: t(() => [
                  e(R, null, {
                    default: t(() => [...j[2] || (j[2] = [
                      l("mdi-view-comfy", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(x, {
                value: "md",
                title: "Medium tiles"
              }, {
                default: t(() => [
                  e(R, null, {
                    default: t(() => [...j[3] || (j[3] = [
                      l("mdi-view-grid", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(x, {
                value: "lg",
                title: "List"
              }, {
                default: t(() => [
                  e(R, null, {
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
          e(x, {
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
        s.value.length ? (m(), Z("div", nt, [
          (m(!0), Z(ve, null, ke(s.value, (w) => (m(), M(v, {
            key: w.id,
            color: U.value === w.id ? "primary" : void 0,
            variant: U.value === w.id ? "elevated" : "tonal",
            size: "small",
            onClick: (a) => U.value = U.value === w.id ? null : w.id
          }, {
            default: t(() => [
              e(R, {
                start: "",
                size: "small"
              }, {
                default: t(() => [
                  l(S(w.icon), 1)
                ]),
                _: 2
              }, 1024),
              l(" " + S(w.label) + " ", 1),
              u("span", at, S(w.count), 1)
            ]),
            _: 2
          }, 1032, ["color", "variant", "onClick"]))), 128))
        ])) : J("", !0),
        E.value ? (m(), M(y, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(S(E.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        z.value ? (m(), M(o, {
          key: 2,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : J("", !0),
        !z.value && C.value.length === 0 && !E.value ? (m(), M(y, {
          key: 3,
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...j[7] || (j[7] = [
            l(" No projects match the current filter. ", -1)
          ])]),
          _: 1
        })) : J("", !0),
        u("div", {
          class: Fe(["tile-grid", `size-${N.value}`])
        }, [
          (m(!0), Z(ve, null, ke(C.value, (w) => (m(), M(H, {
            key: w.id,
            class: "tile",
            hover: "",
            to: `/home/project/${w.id}`
          }, {
            default: t(() => [
              e(P, { class: "pa-3" }, {
                default: t(() => [
                  u("div", ot, [
                    u("div", st, [
                      u("div", it, S(w.name), 1),
                      u("div", rt, S(w.pkey), 1)
                    ]),
                    e(v, {
                      size: "x-small",
                      variant: "tonal"
                    }, {
                      default: t(() => [
                        l(S(w.subscriptions.length), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  N.value !== "lg" ? (m(), Z("div", ut, [
                    (m(!0), Z(ve, null, ke(w.subscriptions.slice(0, N.value === "sm" ? 4 : 8), (a) => {
                      var b, ee, Q, q;
                      return m(), M(Y, {
                        key: a.id,
                        text: `${((ee = (b = a.node) == null ? void 0 : b.refined) == null ? void 0 : ee.name) || "—"} → ${((Q = a.node) == null ? void 0 : Q.name) || ((q = a.node) == null ? void 0 : q.id)}`,
                        location: "top"
                      }, {
                        activator: t(({ props: _ }) => [
                          e(R, Ne({ ref_for: !0 }, _, {
                            size: "small",
                            color: B(a),
                            class: "mr-1"
                          }), {
                            default: t(() => [
                              l(S(F(a)), 1)
                            ]),
                            _: 2
                          }, 1040, ["color"])
                        ]),
                        _: 2
                      }, 1032, ["text"]);
                    }), 128)),
                    w.subscriptions.length > (N.value === "sm" ? 4 : 8) ? (m(), Z("span", dt, " +" + S(w.subscriptions.length - (N.value === "sm" ? 4 : 8)), 1)) : J("", !0)
                  ])) : (m(), M(T, {
                    key: 1,
                    density: "compact",
                    class: "mt-2",
                    style: { background: "transparent" }
                  }, {
                    default: t(() => [
                      u("tbody", null, [
                        (m(!0), Z(ve, null, ke(w.subscriptions, (a) => {
                          var b, ee, Q, q;
                          return m(), Z("tr", {
                            key: a.id
                          }, [
                            u("td", ct, [
                              e(R, {
                                size: "small",
                                color: B(a)
                              }, {
                                default: t(() => [
                                  l(S(F(a)), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            u("td", mt, S(((ee = (b = a.node) == null ? void 0 : b.refined) == null ? void 0 : ee.name) || "—"), 1),
                            u("td", pt, S(((Q = a.node) == null ? void 0 : Q.name) || ((q = a.node) == null ? void 0 : q.id)), 1)
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
  for (const h of Object.keys(d)) {
    const I = d[h];
    (I == null || I === "" || I === !1) && delete d[h];
  }
  return d;
}
function Bl(d) {
  return typeof d != "string" ? "" : d.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function ql(d) {
  return typeof d != "string" ? "" : d.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function _t(d) {
  if (!d) return "??";
  if (d.firstName && d.lastName)
    return d.firstName.charAt(0) + d.lastName.charAt(0);
  if (d.fullName) {
    const I = d.fullName.split(" ");
    return I.length === 1 ? d.fullName.charAt(0) + (d.fullName.length >= 2 ? d.fullName.charAt(1) : "") : I[0].charAt(0) + I[I.length - 1].charAt(0);
  }
  const h = (d.id || d || "??").toString();
  return (h.length === 1 ? h + h : h).slice(0, 2);
}
function Re(d) {
  if (!d) return "";
  if (d.fullName) return d.fullName;
  if (d.firstName && d.lastName) return `${d.firstName} ${d.lastName}`;
  if (d.firstName) return `${d.firstName} ${(d.id || "").substring(1)}`;
  if (d.lastName) return `${$e((d.id || "").charAt(0))}. ${d.lastName}`;
  const h = (d.id || d || "??").toString();
  return `${$e(h.charAt(0))}. ${$e(h.substring(1))}`;
}
function $e(d) {
  return d && d.charAt(0).toUpperCase() + d.slice(1);
}
function Ml(d) {
  if (!d) return null;
  const h = d.split(":");
  return h.length > 2 ? h.slice(0, 3).join("-") : null;
}
function Fl(d) {
  if (!d) return null;
  const h = d.split(":");
  return h.length > 1 ? h.slice(0, 2).join("-") : null;
}
function Ol(d) {
  return (d || "").split(":")[1] || null;
}
function Gl(d) {
  return (d || "").split(":")[2] || null;
}
function Hl(d) {
  if (!d) return [];
  const h = d.split(":"), I = [];
  for (let z = 2; z <= h.length; z++)
    I.push(h.slice(0, z).join("-"));
  return I;
}
function yt(d) {
  return d ? (d.service || (d.service = d.refined && yt(d.refined) || d), d.service) : null;
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
    const h = Ue(), I = fe(), z = pe(), { t: E } = Je(), c = Ae("project", { defaultSort: "name" }), L = i(25);
    let U = null, N = {};
    const V = i(null), s = i(!1), C = i(null), $ = i({ name: "", pkey: "", teamLeader: "", description: "" }), F = i(!1), B = i(!1), f = i(null), p = i(!1), j = i(!1);
    let G = "";
    const D = ce(() => [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Description", key: "description", sortable: !1 },
      { title: "Manager", key: "teamLeader", sortable: !1, width: "220px" },
      { title: "Created", key: "createdDate", sortable: !0, width: "140px" },
      { title: "Subs", key: "nbSubscriptions", sortable: !1, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ]), R = {
      required: (a) => !!a || "Required",
      pkey: (a) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(a || "") || "Use lowercase letters, digits, dash"
    };
    function x(a) {
      if (!a) return "";
      const b = typeof a == "number" ? new Date(a) : new Date(a);
      return isNaN(b.getTime()) ? "" : b.toISOString().slice(0, 10);
    }
    function r(a) {
      N = a, c.load(a);
    }
    function v() {
      clearTimeout(U), U = setTimeout(
        () => c.load({ page: 1, itemsPerPage: L.value, sortBy: N.sortBy }),
        300
      );
    }
    function y(a) {
      const b = kt(a || "").split(" ").filter(Boolean);
      return b.length ? b.join("-") : "";
    }
    function o() {
      var b;
      if (((b = C.value) == null ? void 0 : b.nbSubscriptions) > 0) return;
      const a = y($.value.name);
      (!$.value.pkey || $.value.pkey === G) && ($.value.pkey = a, G = a);
    }
    function Y() {
      C.value = null, $.value = { name: "", pkey: "", teamLeader: "", description: "" }, G = "", s.value = !0;
    }
    function T(a) {
      var b;
      C.value = a, $.value = {
        name: a.name || "",
        pkey: a.pkey || "",
        teamLeader: ((b = a.teamLeader) == null ? void 0 : b.id) || "",
        description: a.description || ""
      }, G = a.pkey || "", s.value = !0;
    }
    function P(a) {
      f.value = a, j.value = !1, B.value = !0;
    }
    async function H() {
      var q, _, W;
      const { valid: a } = await V.value.validate();
      if (!a) return;
      if (c.demoMode.value) {
        s.value = !1;
        return;
      }
      F.value = !0;
      const b = {
        id: (q = C.value) == null ? void 0 : q.id,
        name: $.value.name,
        pkey: $.value.pkey,
        teamLeader: $.value.teamLeader,
        description: $.value.description
      }, ee = (_ = C.value) != null && _.id ? "put" : "post", Q = await I[ee]("rest/project", b);
      F.value = !1, Q !== null && (s.value = !1, !((W = C.value) != null && W.id) && typeof Q != "object" ? h.push(`/home/project/${Q}`) : c.load(N));
    }
    async function w() {
      if (c.demoMode.value) {
        B.value = !1;
        return;
      }
      p.value = !0;
      const a = j.value ? "?deleteRemoteData=true" : "";
      await I.del(`rest/project/${f.value.id}${a}`), p.value = !1, B.value = !1, c.load(N);
    }
    return me(() => {
      z.setTitle("Projects"), z.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), (a, b) => {
      const ee = n("v-spacer"), Q = n("v-text-field"), q = n("v-btn"), _ = n("v-alert"), W = n("v-skeleton-loader"), te = n("v-avatar"), K = n("v-chip"), ae = n("v-icon"), re = n("v-data-table-server"), O = n("v-card-title"), oe = n("v-textarea"), ue = n("v-form"), ye = n("v-card-text"), k = n("v-card-actions"), g = n("v-card"), A = n("v-dialog"), ie = n("v-checkbox");
      return m(), Z("div", null, [
        u("div", wt, [
          b[13] || (b[13] = u("h1", { class: "text-h4" }, "Projects", -1)),
          e(ee),
          e(Q, {
            modelValue: se(c).search.value,
            "onUpdate:modelValue": [
              b[0] || (b[0] = (ne) => se(c).search.value = ne),
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
            onClick: Y
          }, {
            default: t(() => [...b[12] || (b[12] = [
              l(" New ", -1)
            ])]),
            _: 1
          })
        ]),
        se(c).error.value ? (m(), M(_, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(S(se(c).error.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        se(c).demoMode.value ? (m(), M(_, {
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
        })) : J("", !0),
        se(c).loading.value && se(c).items.value.length === 0 ? (m(), M(W, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : J("", !0),
        se(c).error.value ? J("", !0) : Oe((m(), M(re, {
          key: 3,
          "items-per-page": L.value,
          "onUpdate:itemsPerPage": b[1] || (b[1] = (ne) => L.value = ne),
          headers: D.value,
          items: se(c).items.value,
          "items-length": se(c).totalItems.value,
          loading: se(c).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": r,
          "onClick:row": b[2] || (b[2] = (ne, { item: le }) => se(h).push(`/home/project/${le.id}`))
        }, {
          "item.teamLeader": t(({ item: ne }) => {
            var le;
            return [
              (le = ne.teamLeader) != null && le.id ? (m(), Z(ve, { key: 0 }, [
                e(te, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: t(() => [
                    u("span", xt, S(se(_t)(ne.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                l(" " + S(se(Re)(ne.teamLeader)), 1)
              ], 64)) : (m(), Z("span", Vt, "—"))
            ];
          }),
          "item.createdDate": t(({ item: ne }) => [
            l(S(x(ne.createdDate)), 1)
          ]),
          "item.nbSubscriptions": t(({ item: ne }) => [
            e(K, {
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(S(ne.nbSubscriptions || 0), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          "item.actions": t(({ item: ne }) => [
            e(q, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: xe((le) => T(ne), ["stop"])
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
              onClick: xe((le) => P(ne), ["stop"])
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
          [Ge, se(c).items.value.length > 0 || !se(c).loading.value]
        ]),
        e(A, {
          modelValue: s.value,
          "onUpdate:modelValue": b[8] || (b[8] = (ne) => s.value = ne),
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
                      l(S((ne = C.value) != null && ne.id ? "Edit project" : "New project"), 1)
                    ];
                  }),
                  _: 1
                }),
                e(ye, null, {
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
                            modelValue: $.value.name,
                            "onUpdate:modelValue": [
                              b[3] || (b[3] = (_e) => $.value.name = _e),
                              o
                            ],
                            label: "Name",
                            rules: [R.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          e(Q, {
                            modelValue: $.value.pkey,
                            "onUpdate:modelValue": b[4] || (b[4] = (_e) => $.value.pkey = _e),
                            label: "Project key (pkey)",
                            rules: [R.required, R.pkey],
                            disabled: ((ne = C.value) == null ? void 0 : ne.nbSubscriptions) > 0,
                            hint: ((le = C.value) == null ? void 0 : le.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          e(Q, {
                            modelValue: $.value.teamLeader,
                            "onUpdate:modelValue": b[5] || (b[5] = (_e) => $.value.teamLeader = _e),
                            label: "Team leader (user id)",
                            rules: [R.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(oe, {
                            modelValue: $.value.description,
                            "onUpdate:modelValue": b[6] || (b[6] = (_e) => $.value.description = _e),
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
                      onClick: b[7] || (b[7] = (ne) => s.value = !1)
                    }, {
                      default: t(() => [...b[17] || (b[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(q, {
                      color: "primary",
                      variant: "elevated",
                      loading: F.value,
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
        e(A, {
          modelValue: B.value,
          "onUpdate:modelValue": b[11] || (b[11] = (ne) => B.value = ne),
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
                e(ye, null, {
                  default: t(() => {
                    var ne;
                    return [
                      u("p", Ct, [
                        b[20] || (b[20] = l(" Are you sure you want to delete ", -1)),
                        u("strong", null, S((ne = f.value) == null ? void 0 : ne.name), 1),
                        b[21] || (b[21] = l("? ", -1))
                      ]),
                      e(ie, {
                        modelValue: j.value,
                        "onUpdate:modelValue": b[9] || (b[9] = (le) => j.value = le),
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
                      onClick: b[10] || (b[10] = (ne) => B.value = !1)
                    }, {
                      default: t(() => [...b[22] || (b[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(q, {
                      color: "error",
                      variant: "elevated",
                      loading: p.value,
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
}, St = /* @__PURE__ */ we($t, [["__scopeId", "data-v-6023d08b"]]), ht = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, Ut = { class: "text-h4" }, Pt = { class: "text-h6 text-medium-emphasis" }, jt = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, Tt = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, Nt = { key: 0 }, zt = {
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
    const h = Ie();
    Ue();
    const I = fe(), z = pe();
    Ze();
    const E = i(!1), c = i(null), L = ce(() => {
      var y;
      return ((y = c.value) == null ? void 0 : y.subscriptions) || [];
    }), U = i(null), N = i(!1), V = i({ name: "", pkey: "", teamLeader: "", description: "" }), s = i(!1), C = i(!1), $ = i(null), F = i(!1), B = i(!1), f = {
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
      var P, H, w;
      const o = ((w = (H = (P = y.node) == null ? void 0 : P.refined) == null ? void 0 : H.refined) == null ? void 0 : w.id) || "", Y = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let T = 0;
      for (const a of o) T += a.charCodeAt(0);
      return Y[T % Y.length];
    }
    function D(y) {
      var Y, T, P;
      const o = ((P = (T = (Y = y.node) == null ? void 0 : Y.refined) == null ? void 0 : T.refined) == null ? void 0 : P.id) || "";
      return o.includes(":scm:") ? "mdi-source-branch" : o.includes(":build:") ? "mdi-hammer-wrench" : o.includes(":bt") ? "mdi-bug" : o.includes(":km:") ? "mdi-book-open-variant" : o.includes(":vm") ? "mdi-server" : o.includes(":prov") ? "mdi-cloud" : o.includes(":id") ? "mdi-account-group" : o.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function R() {
      var Y;
      E.value = !0;
      const y = h.params.id, o = await I.get(`rest/project/${y}`);
      c.value = o || null, E.value = !1, o && (V.value = {
        name: o.name || "",
        pkey: o.pkey || "",
        teamLeader: ((Y = o.teamLeader) == null ? void 0 : Y.id) || "",
        description: o.description || ""
      }, z.setTitle(o.name), z.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        { title: o.name }
      ]));
    }
    async function x() {
      const { valid: y } = await U.value.validate();
      if (!y) return;
      s.value = !0;
      const o = {
        id: c.value.id,
        name: V.value.name,
        pkey: V.value.pkey,
        teamLeader: V.value.teamLeader,
        description: V.value.description
      };
      await I.put("rest/project", o), s.value = !1, N.value = !1, await R();
    }
    function r(y) {
      $.value = y, F.value = !1, C.value = !0;
    }
    async function v() {
      B.value = !0, await I.del(`rest/subscription/${$.value.id}/${F.value ? "true" : "false"}`), B.value = !1, C.value = !1, await R();
    }
    return ze(() => h.params.id, (y) => {
      y && R();
    }), me(R), (y, o) => {
      const Y = n("v-skeleton-loader"), T = n("v-spacer"), P = n("v-btn"), H = n("v-icon"), w = n("v-card-text"), a = n("v-card"), b = n("v-chip"), ee = n("v-alert"), Q = n("v-data-table"), q = n("v-card-title"), _ = n("v-text-field"), W = n("v-textarea"), te = n("v-form"), K = n("v-card-actions"), ae = n("v-dialog"), re = n("v-checkbox");
      return m(), Z("div", null, [
        E.value && !c.value ? (m(), M(Y, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : J("", !0),
        c.value ? (m(), Z(ve, { key: 1 }, [
          u("div", ht, [
            u("div", null, [
              u("h1", Ut, [
                l(S(c.value.name) + " ", 1),
                u("span", Pt, "(" + S(c.value.pkey) + ")", 1)
              ]),
              c.value.description ? (m(), Z("p", jt, S(c.value.description), 1)) : J("", !0)
            ]),
            e(T),
            c.value.manageSubscriptions ? (m(), M(P, {
              key: 0,
              color: "primary",
              "prepend-icon": "mdi-plus",
              to: `/home/project/${c.value.id}/subscription`
            }, {
              default: t(() => [...o[10] || (o[10] = [
                l(" Add subscription ", -1)
              ])]),
              _: 1
            }, 8, ["to"])) : J("", !0),
            e(P, {
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
              e(w, { class: "py-2" }, {
                default: t(() => [
                  u("div", Tt, [
                    c.value.teamLeader ? (m(), Z("span", Nt, [
                      e(H, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[12] || (o[12] = [
                          l("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      o[13] || (o[13] = u("strong", null, "Manager:", -1)),
                      l(" " + S(se(Re)(c.value.teamLeader)) + " ", 1),
                      c.value.teamLeader.id ? (m(), Z("span", zt, "(" + S(c.value.teamLeader.id) + ")", 1)) : J("", !0)
                    ])) : J("", !0),
                    c.value.createdDate ? (m(), Z("span", At, [
                      e(H, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[14] || (o[14] = [
                          l("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      o[15] || (o[15] = u("strong", null, "Created:", -1)),
                      l(" " + S(j(c.value.createdDate)) + " ", 1),
                      c.value.createdBy ? (m(), Z("span", It, " by " + S(c.value.createdBy.id || c.value.createdBy), 1)) : J("", !0)
                    ])) : J("", !0),
                    c.value.lastModifiedDate ? (m(), Z("span", Dt, [
                      e(H, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...o[16] || (o[16] = [
                          l("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      o[17] || (o[17] = u("strong", null, "Updated:", -1)),
                      l(" " + S(j(c.value.lastModifiedDate)) + " ", 1),
                      c.value.lastModifiedBy ? (m(), Z("span", Rt, " by " + S(c.value.lastModifiedBy.id || c.value.lastModifiedBy), 1)) : J("", !0)
                    ])) : J("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          u("div", Lt, [
            o[18] || (o[18] = u("h2", { class: "text-h6" }, "Subscriptions", -1)),
            e(b, {
              class: "ml-2",
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(S(L.value.length), 1)
              ]),
              _: 1
            })
          ]),
          L.value.length === 0 ? (m(), M(ee, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: t(() => [...o[19] || (o[19] = [
              l(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (m(), M(Q, {
            key: 1,
            headers: p,
            items: L.value,
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
                  var oe, ue, ye;
                  return [
                    e(H, {
                      start: "",
                      size: "small"
                    }, {
                      default: t(() => [
                        l(S(D(O)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    l(" " + S(((ye = (ue = (oe = O.node) == null ? void 0 : oe.refined) == null ? void 0 : ue.refined) == null ? void 0 : ye.name) || "—"), 1)
                  ];
                }),
                _: 2
              }, 1032, ["color"])
            ]),
            "item.tool": t(({ item: O }) => {
              var oe, ue;
              return [
                l(S(((ue = (oe = O.node) == null ? void 0 : oe.refined) == null ? void 0 : ue.name) || "—"), 1)
              ];
            }),
            "item.node": t(({ item: O }) => {
              var oe;
              return [
                u("code", null, S((oe = O.node) == null ? void 0 : oe.id), 1)
              ];
            }),
            "item.actions": t(({ item: O }) => [
              c.value.manageSubscriptions ? (m(), M(P, {
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
                    default: t(() => [...o[20] || (o[20] = [
                      l("mdi-close", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["onClick"])) : J("", !0)
            ]),
            _: 1
          }, 8, ["items"]))
        ], 64)) : J("", !0),
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
                e(w, null, {
                  default: t(() => [
                    e(te, {
                      ref_key: "formRef",
                      ref: U,
                      onSubmit: xe(x, ["prevent"])
                    }, {
                      default: t(() => {
                        var O;
                        return [
                          e(_, {
                            modelValue: V.value.name,
                            "onUpdate:modelValue": o[1] || (o[1] = (oe) => V.value.name = oe),
                            label: "Name",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(_, {
                            modelValue: V.value.pkey,
                            "onUpdate:modelValue": o[2] || (o[2] = (oe) => V.value.pkey = oe),
                            label: "Project key (pkey)",
                            rules: [f.required],
                            disabled: (((O = c.value) == null ? void 0 : O.nbSubscriptions) || L.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          e(_, {
                            modelValue: V.value.teamLeader,
                            "onUpdate:modelValue": o[3] || (o[3] = (oe) => V.value.teamLeader = oe),
                            label: "Team leader (user id)",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(W, {
                            modelValue: V.value.description,
                            "onUpdate:modelValue": o[4] || (o[4] = (oe) => V.value.description = oe),
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
                e(K, null, {
                  default: t(() => [
                    e(T),
                    e(P, {
                      variant: "text",
                      onClick: o[5] || (o[5] = (O) => N.value = !1)
                    }, {
                      default: t(() => [...o[22] || (o[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(P, {
                      color: "primary",
                      variant: "elevated",
                      loading: s.value,
                      onClick: x
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
          modelValue: C.value,
          "onUpdate:modelValue": o[9] || (o[9] = (O) => C.value = O),
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
                e(w, null, {
                  default: t(() => {
                    var O, oe;
                    return [
                      u("p", Et, [
                        o[25] || (o[25] = l(" Remove subscription to ", -1)),
                        u("strong", null, S((oe = (O = $.value) == null ? void 0 : O.node) == null ? void 0 : oe.name), 1),
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
                e(K, null, {
                  default: t(() => [
                    e(T),
                    e(P, {
                      variant: "text",
                      onClick: o[8] || (o[8] = (O) => C.value = !1)
                    }, {
                      default: t(() => [...o[27] || (o[27] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(P, {
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
}, qt = { class: "mb-3" }, Mt = { class: "code-sample" }, Ft = {
  __name: "ManualView",
  setup(d) {
    const h = pe(), I = he(), z = "/", E = typeof window < "u" ? window.location.origin : "", c = ce(() => I.userName || "<you>");
    return me(() => {
      h.setTitle("Manual"), h.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (L, U) => {
      const N = n("v-icon"), V = n("v-card-title"), s = n("v-card-text"), C = n("v-card"), $ = n("v-list-item"), F = n("v-list"), B = n("v-col"), f = n("router-link");
      n("v-code-block");
      const p = n("v-row");
      return m(), Z("div", null, [
        U[12] || (U[12] = u("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        e(p, null, {
          default: t(() => [
            e(B, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(C, {
                  variant: "tonal",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(V, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(N, null, {
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
                e(C, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(F, {
                      lines: "two",
                      density: "compact"
                    }, {
                      default: t(() => [
                        e($, {
                          "prepend-icon": "mdi-folder-plus",
                          title: "Create a project",
                          subtitle: "Name, project key, manager — add subscriptions afterwards.",
                          to: "/home/project"
                        }),
                        e($, {
                          "prepend-icon": "mdi-playlist-plus",
                          title: "Subscribe to a tool",
                          subtitle: "Pick a service, a tool, and a node for an existing or new instance.",
                          to: "/subscribe"
                        }),
                        e($, {
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
                e(C, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(V, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(N, null, {
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
                        u("p", qt, [
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
                        J("", !0),
                        u("pre", Mt, 'curl "' + S(se(E)) + S(se(z)) + "rest/project?api-key=<token>&api-user=" + S(c.value) + '"', 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                e(C, { variant: "outlined" }, {
                  default: t(() => [
                    e(V, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(N, null, {
                          default: t(() => [...U[10] || (U[10] = [
                            l("mdi-help-circle", -1)
                          ])]),
                          _: 1
                        }),
                        U[11] || (U[11] = l(" More resources ", -1))
                      ]),
                      _: 1
                    }),
                    e(F, {
                      lines: "one",
                      density: "compact"
                    }, {
                      default: t(() => [
                        e($, {
                          "prepend-icon": "mdi-github",
                          title: "GitHub repository",
                          subtitle: "Source, issues, release notes",
                          href: "https://github.com/ligoj/ligoj",
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }),
                        e($, {
                          "prepend-icon": "mdi-bug",
                          title: "Report an issue",
                          href: "https://github.com/ligoj/ligoj/issues",
                          target: "_blank",
                          rel: "noopener noreferrer"
                        }),
                        e($, {
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
}, Ot = /* @__PURE__ */ we(Ft, [["__scopeId", "data-v-bfb1a017"]]), Gt = { class: "pa-4" }, Ht = {
  __name: "SystemView",
  setup(d) {
    const h = pe(), I = [
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
      h.setTitle("System"), h.setBreadcrumbs([{ title: "System" }]);
    }), (z, E) => {
      const c = n("v-list-item"), L = n("v-list");
      return m(), Z("div", Gt, [
        E[0] || (E[0] = u("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        e(L, null, {
          default: t(() => [
            (m(), Z(ve, null, ke(I, (U) => e(c, {
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
}, Wt = { class: "d-flex align-center mb-4" }, Kt = { class: "mb-3" }, Jt = { class: "d-flex align-center mb-1" }, Zt = { class: "text-caption" }, Xt = { class: "d-flex mt-1 text-caption text-medium-emphasis ga-3" }, Yt = {
  __name: "SystemInfoView",
  setup(d) {
    const h = fe(), I = pe(), z = he(), E = i(!1), c = i(null), L = i(null), U = i(""), N = i(""), V = i(""), s = Ve({
      used: 0,
      committedFree: 0,
      free: 0,
      max: 0,
      pctUsed: 0,
      pctCommittedFree: 0,
      pctFree: 0
    }), C = Ve({ application: "", default: "", original: "" }), $ = ce(() => p("JSESSIONID") || ""), F = ce(() => {
      const x = z.appSettings || {}, r = parseInt(x.buildTimestamp, 10);
      return {
        number: x.buildNumber ?? "",
        timestamp: Number.isNaN(r) ? x.buildTimestamp ?? "" : r,
        date: Number.isNaN(r) ? "" : new Date(r).toISOString().slice(0, 19).replace("T", " "),
        version: x.buildVersion ?? ""
      };
    }), B = ce(
      () => `Used: ${f(s.used)} · Committed-free: ${f(s.committedFree)} · Free: ${f(s.free)} / ${f(s.max)}`
    );
    function f(x) {
      if (x == null || isNaN(x)) return "—";
      const r = ["B", "KB", "MB", "GB", "TB"];
      let v = x, y = 0;
      for (; v >= 1024 && y < r.length - 1; )
        v /= 1024, y++;
      return `${v.toFixed(v < 10 && y > 0 ? 1 : 0)} ${r[y]}`;
    }
    function p(x) {
      const r = document.cookie.split(";");
      for (const v of r) {
        const [y, ...o] = v.trim().split("=");
        if (y === x) return decodeURIComponent(o.join("="));
      }
      return null;
    }
    async function j() {
      var r, v, y, o, Y, T, P, H, w, a, b, ee;
      E.value = !0, c.value = null;
      const x = await h.get("rest/system");
      if (x) {
        U.value = ((r = x.cpu) == null ? void 0 : r.total) ?? "", N.value = (v = x.date) != null && v.date ? new Date(x.date.date).toISOString() : "", V.value = ((y = x.date) == null ? void 0 : y.date) ?? "", C.application = ((o = x.date) == null ? void 0 : o.timeZone) ?? "", C.default = ((Y = x.date) == null ? void 0 : Y.defaultTimeZone) ?? "", C.original = ((T = x.date) == null ? void 0 : T.originalDefaultTimeZone) ?? "";
        const Q = ((P = x.memory) == null ? void 0 : P.maxMemory) || (((H = x.memory) == null ? void 0 : H.totalMemory) || 0) + 1e6, q = (((w = x.memory) == null ? void 0 : w.totalMemory) ?? 0) - (((a = x.memory) == null ? void 0 : a.freeMemory) ?? 0), _ = ((b = x.memory) == null ? void 0 : b.freeMemory) ?? 0, W = Math.max(0, Q - (((ee = x.memory) == null ? void 0 : ee.totalMemory) ?? 0));
        s.used = q, s.committedFree = _, s.free = W, s.max = Q, s.pctUsed = G(q / Q * 100), s.pctCommittedFree = G(_ / Q * 100), s.pctFree = G(100 - s.pctUsed - s.pctCommittedFree);
      }
      E.value = !1;
    }
    function G(x) {
      return Math.round(x * 10) / 10;
    }
    async function D(x, r) {
      if (r) {
        L.value = x;
        try {
          await fetch(`/rest/system/timezone/${x}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "text/plain" },
            body: r
          });
        } catch {
        }
        L.value = null;
      }
    }
    async function R(x) {
      try {
        await navigator.clipboard.writeText(x || "");
      } catch {
      }
    }
    return me(() => {
      I.setTitle("System information"), I.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Information" }]), j();
    }), (x, r) => {
      const v = n("v-spacer"), y = n("v-btn"), o = n("v-alert"), Y = n("v-icon"), T = n("v-card-title"), P = n("v-progress-linear"), H = n("v-tooltip"), w = n("v-text-field"), a = n("v-col"), b = n("v-row"), ee = n("v-card-text"), Q = n("v-card");
      return m(), Z("div", null, [
        u("div", Wt, [
          r[8] || (r[8] = u("h1", { class: "text-h4" }, "System information", -1)),
          e(v),
          e(y, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            loading: E.value,
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
            l(S(c.value), 1)
          ]),
          _: 1
        })) : J("", !0),
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
                    e(T, { class: "d-flex align-center ga-2" }, {
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
                        u("div", Kt, [
                          u("div", Jt, [
                            r[11] || (r[11] = u("span", { class: "text-body-2 text-medium-emphasis flex-grow-1" }, "Memory", -1)),
                            u("span", Zt, S(f(s.used)) + " / " + S(f(s.max)), 1)
                          ]),
                          e(H, {
                            text: B.value,
                            location: "top"
                          }, {
                            activator: t(({ props: q }) => [
                              u("div", He(We(q)), [
                                e(P, {
                                  "model-value": s.pctUsed,
                                  "buffer-value": s.pctUsed + s.pctCommittedFree,
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
                              l(" Used " + S(s.pctUsed) + "%", 1)
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
                              l(" Committed free " + S(s.pctCommittedFree) + "%", 1)
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
                              l(" Free " + S(s.pctFree) + "%", 1)
                            ])
                          ])
                        ]),
                        e(w, {
                          "model-value": U.value,
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
                    e(T, { class: "d-flex align-center ga-2" }, {
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
                          modelValue: C.application,
                          "onUpdate:modelValue": r[0] || (r[0] = (q) => C.application = q),
                          label: "Application",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: L.value === "application",
                          onBlur: r[1] || (r[1] = (q) => D("application", C.application)),
                          onKeyup: r[2] || (r[2] = Se((q) => D("application", C.application), ["enter"]))
                        }, null, 8, ["modelValue", "loading"]),
                        e(w, {
                          modelValue: C.default,
                          "onUpdate:modelValue": r[3] || (r[3] = (q) => C.default = q),
                          label: "System",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          loading: L.value === "default",
                          onBlur: r[4] || (r[4] = (q) => D("default", C.default)),
                          onKeyup: r[5] || (r[5] = Se((q) => D("default", C.default), ["enter"]))
                        }, null, 8, ["modelValue", "loading"]),
                        e(w, {
                          "model-value": C.original,
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
                    e(T, { class: "d-flex align-center ga-2" }, {
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
                          "model-value": $.value,
                          label: "Identifier",
                          readonly: "",
                          density: "compact",
                          variant: "outlined",
                          class: "mb-2",
                          "append-inner-icon": "mdi-content-copy",
                          "onClick:appendInner": r[6] || (r[6] = (q) => R($.value))
                        }, null, 8, ["model-value"]),
                        e(w, {
                          "model-value": se(z).userName,
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
                    e(T, { class: "d-flex align-center ga-2" }, {
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
                          "model-value": F.value.number,
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
                                e(w, {
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
                        e(w, {
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
}, Qt = { class: "system-config-page" }, el = { class: "d-flex align-center mb-4" }, tl = {
  key: 0,
  class: "text-medium-emphasis"
}, ll = ["title"], nl = {
  __name: "SystemConfigurationView",
  setup(d) {
    const h = fe(), I = pe(), z = i([]), E = i(!1), c = i(null), L = i(""), U = i(""), N = i(!1), V = i(null), s = i(!1), C = i(null), $ = i({ name: "", value: "", system: !1, secured: !1 }), F = i(!1), B = i(!1), f = i(null), p = i(!1), j = { required: (w) => w !== "" && w != null || "Required" }, G = [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Value", key: "value", sortable: !1 },
      { title: "", key: "secured", sortable: !0, width: "32px", align: "center" },
      { title: "Source", key: "source", sortable: !0, width: "56px", align: "center" },
      { title: "Actions", key: "actions", sortable: !1, width: "128px", align: "end" }
    ], D = {
      systemEnvironment: "mdi-desktop-classic",
      systemProperties: "mdi-language-java",
      applicationConfig: "mdi-file-code",
      database: "mdi-database",
      classpath: "mdi-file-code-outline"
    };
    function R(w) {
      if (!w) return "mdi-help-circle-outline";
      const a = w.split(":")[0];
      return D[w.includes("classpath") ? "classpath" : a] || "mdi-help-circle-outline";
    }
    function x(w) {
      if (!w.source) return "";
      const a = `Source: ${w.source}`;
      return w.overridden ? `${a} — overridden` : a;
    }
    async function r() {
      E.value = !0, c.value = null;
      const w = await h.get("rest/system/configuration");
      z.value = Array.isArray(w) ? w : (w == null ? void 0 : w.data) || [], z.value.sort((a, b) => String(a.name).localeCompare(String(b.name))), E.value = !1;
    }
    async function v() {
      if (L.value) {
        N.value = !0;
        try {
          const w = await fetch("/rest/system/security/crypto", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "text/plain" },
            body: L.value
          });
          U.value = w.ok ? await w.text() : "";
        } catch {
          U.value = "";
        } finally {
          N.value = !1;
        }
      }
    }
    async function y(w) {
      try {
        await navigator.clipboard.writeText(w || "");
      } catch {
      }
    }
    function o() {
      C.value = null, $.value = { name: "", value: "", system: !1, secured: !1 }, s.value = !0;
    }
    function Y(w) {
      C.value = w, $.value = {
        name: w.name,
        value: w.secured ? "" : w.value ?? "",
        system: !1,
        secured: !!w.secured
      }, s.value = !0;
    }
    function T(w) {
      f.value = w, B.value = !0;
    }
    async function P() {
      var b;
      const { valid: w } = await V.value.validate();
      if (!w) return;
      F.value = !0;
      const a = {
        name: $.value.name,
        oldName: ((b = C.value) == null ? void 0 : b.name) || "",
        system: !!$.value.system,
        secured: !!$.value.secured,
        value: $.value.value
      };
      await h.post("rest/system/configuration", a), F.value = !1, s.value = !1, r();
    }
    async function H() {
      p.value = !0, await h.del(`rest/system/configuration/${encodeURIComponent(f.value.name)}/true`), p.value = !1, B.value = !1, r();
    }
    return me(() => {
      I.setTitle("System configuration"), I.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Configuration" }]), r();
    }), (w, a) => {
      const b = n("v-spacer"), ee = n("v-btn"), Q = n("v-icon"), q = n("v-card-title"), _ = n("v-text-field"), W = n("v-col"), te = n("v-row"), K = n("v-card-text"), ae = n("v-card"), re = n("v-alert"), O = n("v-tooltip"), oe = n("v-textarea"), ue = n("v-checkbox"), ye = n("v-form"), k = n("v-card-actions"), g = n("v-dialog");
      return m(), Z("div", Qt, [
        u("div", el, [
          a[12] || (a[12] = u("h1", { class: "text-h4" }, "System configuration", -1)),
          e(b),
          e(ee, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            loading: E.value,
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
            e(K, null, {
              default: t(() => [
                e(te, { dense: "" }, {
                  default: t(() => [
                    e(W, {
                      cols: "12",
                      md: "5"
                    }, {
                      default: t(() => [
                        e(_, {
                          modelValue: L.value,
                          "onUpdate:modelValue": a[0] || (a[0] = (A) => L.value = A),
                          label: "Text to encrypt",
                          variant: "outlined",
                          density: "compact",
                          "hide-details": "",
                          onKeyup: Se(v, ["enter"])
                        }, null, 8, ["modelValue"])
                      ]),
                      _: 1
                    }),
                    e(W, { cols: "auto" }, {
                      default: t(() => [
                        e(ee, {
                          color: "primary",
                          "prepend-icon": "mdi-lock",
                          loading: N.value,
                          disabled: !L.value,
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
                    e(W, {
                      cols: "12",
                      md: "6"
                    }, {
                      default: t(() => [
                        e(_, {
                          "model-value": U.value,
                          label: "Result",
                          variant: "outlined",
                          density: "compact",
                          readonly: "",
                          "hide-details": "",
                          "append-inner-icon": "mdi-content-copy",
                          "onClick:appendInner": a[1] || (a[1] = (A) => y(U.value))
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
            l(S(c.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        e(se(Xe), {
          headers: G,
          items: z.value,
          loading: E.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact",
          filename: "configuration.csv",
          class: "configuration-table"
        }, {
          "item.value": t(({ item: A }) => [
            A.secured ? (m(), Z("span", tl, "•••••")) : (m(), Z("code", {
              key: 1,
              class: "config-value",
              title: A.value
            }, S(A.value), 9, ll))
          ]),
          "item.secured": t(({ item: A }) => [
            A.secured ? (m(), M(Q, {
              key: 0,
              size: "small",
              color: "primary",
              title: "Secured"
            }, {
              default: t(() => [...a[16] || (a[16] = [
                l("mdi-lock", -1)
              ])]),
              _: 1
            })) : J("", !0)
          ]),
          "item.source": t(({ item: A }) => [
            A.source ? (m(), M(O, {
              key: 0,
              text: x(A),
              location: "top"
            }, {
              activator: t(({ props: ie }) => [
                e(Q, Ne(ie, {
                  size: "small",
                  color: A.overridden ? "warning" : void 0
                }), {
                  default: t(() => [
                    l(S(R(A.source)), 1)
                  ]),
                  _: 2
                }, 1040, ["color"])
              ]),
              _: 2
            }, 1032, ["text"])) : J("", !0),
            A.overridden ? (m(), M(Q, {
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
            })) : J("", !0)
          ]),
          "item.actions": t(({ item: A }) => [
            e(ee, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (ie) => Y(A),
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
              onClick: (ie) => T(A),
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
          modelValue: s.value,
          "onUpdate:modelValue": a[7] || (a[7] = (A) => s.value = A),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [
                    l(S(C.value ? "Edit configuration" : "New configuration"), 1)
                  ]),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => [
                    e(ye, {
                      ref_key: "formRef",
                      ref: V,
                      onSubmit: xe(P, ["prevent"])
                    }, {
                      default: t(() => [
                        e(_, {
                          modelValue: $.value.name,
                          "onUpdate:modelValue": a[2] || (a[2] = (A) => $.value.name = A),
                          label: "Name",
                          rules: [j.required],
                          variant: "outlined",
                          density: "compact",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(oe, {
                          modelValue: $.value.value,
                          "onUpdate:modelValue": a[3] || (a[3] = (A) => $.value.value = A),
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
                          modelValue: $.value.system,
                          "onUpdate:modelValue": a[4] || (a[4] = (A) => $.value.system = A),
                          label: "Override system environment / properties",
                          density: "compact",
                          "hide-details": ""
                        }, null, 8, ["modelValue"]),
                        e(ue, {
                          modelValue: $.value.secured,
                          "onUpdate:modelValue": a[5] || (a[5] = (A) => $.value.secured = A),
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
                      onClick: a[6] || (a[6] = (A) => s.value = !1)
                    }, {
                      default: t(() => [...a[20] || (a[20] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(ee, {
                      color: "primary",
                      variant: "elevated",
                      loading: F.value,
                      onClick: P
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
          modelValue: B.value,
          "onUpdate:modelValue": a[9] || (a[9] = (A) => B.value = A),
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
                e(K, null, {
                  default: t(() => {
                    var A;
                    return [
                      a[23] || (a[23] = l(" Remove key ", -1)),
                      u("code", null, S((A = f.value) == null ? void 0 : A.name), 1),
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
                      onClick: a[8] || (a[8] = (A) => B.value = !1)
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
}, al = /* @__PURE__ */ we(nl, [["__scopeId", "data-v-47a35e13"]]), ol = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, sl = {
  __name: "SystemUserView",
  setup(d) {
    const h = fe(), I = pe(), z = Ae("system/user/roles", { defaultSort: "login" }), E = i(25);
    let c = null, L = {};
    const U = i([]), N = i(null), V = i(!1), s = i(null), C = i({ login: "", roles: [] }), $ = i(!1), F = i(!1), B = i(null), f = i(!1), p = {
      required: (T) => !!T || "Required",
      requiredArray: (T) => Array.isArray(T) && T.length > 0 || "Pick at least one role"
    }, j = [
      { title: "Login", key: "login", sortable: !0, width: "220px" },
      { title: "Roles", key: "roles", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    function G(T) {
      L = T, z.load(T);
    }
    async function D() {
      const T = new URLSearchParams({
        rows: "999999",
        page: "1",
        sidx: "login",
        sord: "asc"
      });
      z.search.value && T.set("search[value]", z.search.value);
      const P = await fetch(`rest/system/user/roles?${T}`, { credentials: "include" });
      if (!P.ok) return [];
      const H = await P.json().catch(() => null);
      return Array.isArray(H == null ? void 0 : H.data) ? H.data : Array.isArray(H) ? H : [];
    }
    function R() {
      clearTimeout(c), c = setTimeout(
        () => z.load({ page: 1, itemsPerPage: E.value, sortBy: L.sortBy }),
        300
      );
    }
    async function x() {
      const T = await h.get("rest/system/security/role");
      Array.isArray(T) ? U.value = T : Array.isArray(T == null ? void 0 : T.data) && (U.value = T.data);
    }
    function r() {
      s.value = null, C.value = { login: "", roles: [] }, V.value = !0;
    }
    function v(T) {
      s.value = T, C.value = {
        login: T.login,
        roles: (T.roles || []).map((P) => P.id)
      }, V.value = !0;
    }
    function y(T) {
      B.value = T, F.value = !0;
    }
    async function o() {
      const { valid: T } = await N.value.validate();
      if (!T) return;
      $.value = !0;
      const P = { login: C.value.login, roles: C.value.roles }, H = s.value ? "put" : "post";
      await h[H]("rest/system/user", P), $.value = !1, V.value = !1, z.load(L);
    }
    async function Y() {
      f.value = !0, await h.del(`rest/system/user/${encodeURIComponent(B.value.login)}`), f.value = !1, F.value = !1, z.load(L);
    }
    return me(() => {
      I.setTitle("System users"), I.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]), x();
    }), (T, P) => {
      const H = n("v-spacer"), w = n("v-text-field"), a = n("v-btn"), b = n("v-alert"), ee = n("v-chip"), Q = n("v-icon"), q = n("v-card-title"), _ = n("v-autocomplete"), W = n("v-form"), te = n("v-card-text"), K = n("v-card-actions"), ae = n("v-card"), re = n("v-dialog");
      return m(), Z("div", null, [
        u("div", ol, [
          P[9] || (P[9] = u("h1", { class: "text-h4" }, "System users", -1)),
          e(H),
          e(w, {
            modelValue: se(z).search.value,
            "onUpdate:modelValue": [
              P[0] || (P[0] = (O) => se(z).search.value = O),
              R
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
            default: t(() => [...P[8] || (P[8] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        se(z).error.value ? (m(), M(b, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(S(se(z).error.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        e(se(Ye), {
          headers: j,
          items: se(z).items.value,
          "items-length": se(z).totalItems.value,
          loading: se(z).loading.value,
          "items-per-page": E.value,
          "onUpdate:itemsPerPage": P[1] || (P[1] = (O) => E.value = O),
          "item-value": "login",
          hover: "",
          filename: "system-users.csv",
          "fetch-all": D,
          "onUpdate:options": G
        }, {
          "item.roles": t(({ item: O }) => [
            (m(!0), Z(ve, null, ke(O.roles || [], (oe) => (m(), M(ee, {
              key: oe.id,
              size: "x-small",
              variant: "tonal",
              class: "mr-1"
            }, {
              default: t(() => [
                l(S(oe.name), 1)
              ]),
              _: 2
            }, 1024))), 128))
          ]),
          "item.actions": t(({ item: O }) => [
            e(a, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (oe) => v(O)
            }, {
              default: t(() => [
                e(Q, { size: "small" }, {
                  default: t(() => [...P[10] || (P[10] = [
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
              onClick: (oe) => y(O)
            }, {
              default: t(() => [
                e(Q, { size: "small" }, {
                  default: t(() => [...P[11] || (P[11] = [
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
          "onUpdate:modelValue": P[5] || (P[5] = (O) => V.value = O),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [
                    l(S(s.value ? "Edit system user" : "New system user"), 1)
                  ]),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => [
                    e(W, {
                      ref_key: "formRef",
                      ref: N,
                      onSubmit: xe(o, ["prevent"])
                    }, {
                      default: t(() => [
                        e(w, {
                          modelValue: C.value.login,
                          "onUpdate:modelValue": P[2] || (P[2] = (O) => C.value.login = O),
                          label: "Login",
                          rules: [p.required],
                          disabled: !!s.value,
                          variant: "outlined",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules", "disabled"]),
                        e(_, {
                          modelValue: C.value.roles,
                          "onUpdate:modelValue": P[3] || (P[3] = (O) => C.value.roles = O),
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
                e(K, null, {
                  default: t(() => [
                    e(H),
                    e(a, {
                      variant: "text",
                      onClick: P[4] || (P[4] = (O) => V.value = !1)
                    }, {
                      default: t(() => [...P[12] || (P[12] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "primary",
                      variant: "elevated",
                      loading: $.value,
                      onClick: o
                    }, {
                      default: t(() => [...P[13] || (P[13] = [
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
          "onUpdate:modelValue": P[7] || (P[7] = (O) => F.value = O),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...P[14] || (P[14] = [
                    l("Delete system user", -1)
                  ])]),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => {
                    var O;
                    return [
                      P[15] || (P[15] = l("Remove ", -1)),
                      u("strong", null, S((O = B.value) == null ? void 0 : O.login), 1),
                      P[16] || (P[16] = l(" from system accounts?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => [
                    e(H),
                    e(a, {
                      variant: "text",
                      onClick: P[6] || (P[6] = (O) => F.value = !1)
                    }, {
                      default: t(() => [...P[17] || (P[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "error",
                      variant: "elevated",
                      loading: f.value,
                      onClick: Y
                    }, {
                      default: t(() => [...P[18] || (P[18] = [
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
}, il = /* @__PURE__ */ we(sl, [["__scopeId", "data-v-6004cab7"]]), rl = { class: "d-flex align-center mb-4" }, ul = {
  __name: "SystemRoleView",
  setup(d) {
    const h = fe(), I = pe(), z = i([]), E = i(!1), c = i(null), L = i(null), U = i(!1), N = i(null), V = i({ name: "", apiPatterns: [], uiPatterns: [] }), s = i(!1), C = i(!1), $ = i(null), F = i(!1), B = { required: (r) => !!r || "Required" }, f = [
      { title: "Name", key: "name", sortable: !0, width: "180px" },
      { title: "API patterns", key: "authApi", sortable: !1 },
      { title: "UI patterns", key: "authUi", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    async function p() {
      E.value = !0, c.value = null;
      const r = await h.get("rest/system/security/role/withAuth"), v = (r == null ? void 0 : r.data) || r || [];
      for (const y of v)
        y["authorizations-api"] = (y.authorizations || []).filter((o) => o.type === "api"), y["authorizations-ui"] = (y.authorizations || []).filter((o) => o.type === "ui");
      z.value = v, E.value = !1;
    }
    function j() {
      N.value = null, V.value = { name: "", apiPatterns: [], uiPatterns: [] }, U.value = !0;
    }
    function G(r) {
      N.value = r, V.value = {
        name: r.name,
        apiPatterns: (r["authorizations-api"] || []).map((v) => v.pattern),
        uiPatterns: (r["authorizations-ui"] || []).map((v) => v.pattern)
      }, U.value = !0;
    }
    function D(r) {
      $.value = r, C.value = !0;
    }
    async function R() {
      var o;
      const { valid: r } = await L.value.validate();
      if (!r) return;
      s.value = !0;
      const v = {
        id: (o = N.value) == null ? void 0 : o.id,
        name: V.value.name,
        authorizations: [
          ...V.value.apiPatterns.map((Y) => ({ pattern: Y, type: "api" })),
          ...V.value.uiPatterns.map((Y) => ({ pattern: Y, type: "ui" }))
        ]
      }, y = N.value ? "put" : "post";
      await h[y]("rest/system/security/role", v), s.value = !1, U.value = !1, p();
    }
    async function x() {
      F.value = !0, await h.del(`rest/system/security/role/${$.value.id}`), F.value = !1, C.value = !1, p();
    }
    return me(() => {
      I.setTitle("Roles"), I.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]), p();
    }), (r, v) => {
      const y = n("v-spacer"), o = n("v-btn"), Y = n("v-alert"), T = n("v-icon"), P = n("v-data-table"), H = n("v-card-title"), w = n("v-text-field"), a = n("v-combobox"), b = n("v-form"), ee = n("v-card-text"), Q = n("v-card-actions"), q = n("v-card"), _ = n("v-dialog");
      return m(), Z("div", null, [
        u("div", rl, [
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
        c.value ? (m(), M(Y, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(S(c.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        e(P, {
          headers: f,
          items: z.value,
          loading: E.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.authApi": t(({ item: W }) => [
            (m(!0), Z(ve, null, ke(W["authorizations-api"], (te) => (m(), Z("code", {
              key: te.id || te.pattern,
              class: "auth-token"
            }, S(te.pattern), 1))), 128))
          ]),
          "item.authUi": t(({ item: W }) => [
            (m(!0), Z(ve, null, ke(W["authorizations-ui"], (te) => (m(), Z("code", {
              key: te.id || te.pattern,
              class: "auth-token"
            }, S(te.pattern), 1))), 128))
          ]),
          "item.actions": t(({ item: W }) => [
            e(o, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (te) => G(W)
            }, {
              default: t(() => [
                e(T, { size: "small" }, {
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
              onClick: (te) => D(W)
            }, {
              default: t(() => [
                e(T, { size: "small" }, {
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
        e(_, {
          modelValue: U.value,
          "onUpdate:modelValue": v[4] || (v[4] = (W) => U.value = W),
          "max-width": "640",
          persistent: ""
        }, {
          default: t(() => [
            e(q, null, {
              default: t(() => [
                e(H, null, {
                  default: t(() => [
                    l(S(N.value ? "Edit role" : "New role"), 1)
                  ]),
                  _: 1
                }),
                e(ee, null, {
                  default: t(() => [
                    e(b, {
                      ref_key: "formRef",
                      ref: L,
                      onSubmit: xe(R, ["prevent"])
                    }, {
                      default: t(() => [
                        e(w, {
                          modelValue: V.value.name,
                          "onUpdate:modelValue": v[0] || (v[0] = (W) => V.value.name = W),
                          label: "Name",
                          rules: [B.required],
                          variant: "outlined",
                          class: "mb-4",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(a, {
                          modelValue: V.value.apiPatterns,
                          "onUpdate:modelValue": v[1] || (v[1] = (W) => V.value.apiPatterns = W),
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
                          "onUpdate:modelValue": v[2] || (v[2] = (W) => V.value.uiPatterns = W),
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
                    e(y),
                    e(o, {
                      variant: "text",
                      onClick: v[3] || (v[3] = (W) => U.value = !1)
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
                      onClick: R
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
        e(_, {
          modelValue: C.value,
          "onUpdate:modelValue": v[6] || (v[6] = (W) => C.value = W),
          "max-width": "420"
        }, {
          default: t(() => [
            e(q, null, {
              default: t(() => [
                e(H, null, {
                  default: t(() => [...v[13] || (v[13] = [
                    l("Delete role", -1)
                  ])]),
                  _: 1
                }),
                e(ee, null, {
                  default: t(() => {
                    var W;
                    return [
                      v[14] || (v[14] = l("Delete role ", -1)),
                      u("strong", null, S((W = $.value) == null ? void 0 : W.name), 1),
                      v[15] || (v[15] = l("?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(Q, null, {
                  default: t(() => [
                    e(y),
                    e(o, {
                      variant: "text",
                      onClick: v[5] || (v[5] = (W) => C.value = !1)
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
                      onClick: x
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
}, dl = /* @__PURE__ */ we(ul, [["__scopeId", "data-v-e3ba71a8"]]), cl = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, ml = { key: 0 }, pl = { key: 0 }, vl = {
  __name: "SystemPluginView",
  setup(d) {
    const h = fe(), I = pe(), z = [
      { id: "central", label: "Maven Central" },
      { id: "nexus", label: "OSSRH Nexus" }
    ], E = i("central"), c = i([]), L = i(!1), U = i(null), N = i(!1), V = i(!1), s = i(!1), C = i(""), $ = i(!1), F = i(!1), B = [
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
      var o, Y;
      const y = (Y = (o = v.plugin) == null ? void 0 : o.type) == null ? void 0 : Y.toLowerCase();
      return y ? y === "feature" ? "mdi-wrench" : y === "service" ? "mdi-puzzle" : y === "tool" ? "mdi-hammer-wrench" : "mdi-puzzle" : "mdi-link-off";
    }
    async function p() {
      L.value = !0, U.value = null;
      const v = await h.get(`rest/system/plugin?repository=${E.value}`);
      c.value = Array.isArray(v) ? v : (v == null ? void 0 : v.data) || [], L.value = !1;
    }
    async function j() {
      N.value = !0, await h.put(`rest/system/plugin/cache?repository=${E.value}`), N.value = !1, p();
    }
    async function G() {
      V.value = !0, await h.put("rest/system/plugin/restart"), V.value = !1;
    }
    async function D(v, y = !1) {
      F.value = !0;
      const o = `repository=${E.value}&javadoc=${y ? !1 : $.value}`;
      await h.post(`rest/system/plugin/${encodeURIComponent(v)}?${o}`), F.value = !1, s.value = !1, C.value = "", $.value = !1, p();
    }
    function R() {
      C.value && D(C.value.trim());
    }
    async function x(v) {
      await h.del(`rest/system/plugin/${v.plugin.artifact}/${v.latestLocalVersion}`), p();
    }
    async function r(v) {
      confirm(`Delete plug-in ${v}?`) && (await h.del(`rest/system/plugin/${v}`), p());
    }
    return me(() => {
      I.setTitle("Plug-ins"), I.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plug-ins" }]), p();
    }), (v, y) => {
      const o = n("v-spacer"), Y = n("v-select"), T = n("v-btn"), P = n("v-alert"), H = n("v-icon"), w = n("v-chip"), a = n("v-data-table"), b = n("v-card-title"), ee = n("v-text-field"), Q = n("v-checkbox"), q = n("v-card-text"), _ = n("v-card-actions"), W = n("v-card"), te = n("v-dialog");
      return m(), Z("div", null, [
        u("div", cl, [
          y[9] || (y[9] = u("h1", { class: "text-h4" }, "Plugins", -1)),
          e(o),
          e(Y, {
            modelValue: E.value,
            "onUpdate:modelValue": [
              y[0] || (y[0] = (K) => E.value = K),
              p
            ],
            items: z,
            "item-value": "id",
            "item-title": "label",
            label: "Repository",
            density: "compact",
            "hide-details": "",
            variant: "outlined",
            style: { "max-width": "200px" }
          }, null, 8, ["modelValue"]),
          e(T, {
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
          e(T, {
            color: "error",
            variant: "outlined",
            "prepend-icon": "mdi-restart",
            onClick: G,
            loading: V.value
          }, {
            default: t(() => [...y[7] || (y[7] = [
              l(" Restart ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(T, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: y[1] || (y[1] = (K) => s.value = !0)
          }, {
            default: t(() => [...y[8] || (y[8] = [
              l("Install", -1)
            ])]),
            _: 1
          })
        ]),
        U.value ? (m(), M(P, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(S(U.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        e(a, {
          headers: B,
          items: c.value,
          loading: L.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.type": t(({ item: K }) => {
            var ae;
            return [
              e(H, {
                size: "small",
                title: (ae = K.plugin) == null ? void 0 : ae.type
              }, {
                default: t(() => [
                  l(S(f(K)), 1)
                ]),
                _: 2
              }, 1032, ["title"])
            ];
          }),
          "item.version": t(({ item: K }) => {
            var ae;
            return [
              u("span", null, S(((ae = K.plugin) == null ? void 0 : ae.version) || "—"), 1),
              K.latestLocalVersion ? (m(), M(w, {
                key: 0,
                size: "x-small",
                color: "primary",
                class: "ml-1",
                closable: "",
                "onClick:close": (re) => x(K),
                title: "Cancel local install"
              }, {
                default: t(() => [
                  l(S(K.latestLocalVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick:close"])) : J("", !0),
              K.newVersion && K.newVersion !== K.latestLocalVersion ? (m(), M(w, {
                key: 1,
                size: "x-small",
                color: "success",
                class: "ml-1",
                onClick: (re) => D(K.plugin.artifact, !0),
                title: "Upgrade available — click to install"
              }, {
                default: t(() => [
                  e(H, {
                    start: "",
                    size: "x-small"
                  }, {
                    default: t(() => [...y[10] || (y[10] = [
                      l("mdi-arrow-up", -1)
                    ])]),
                    _: 1
                  }),
                  l(S(K.newVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : J("", !0)
            ];
          }),
          "item.nodes": t(({ item: K }) => {
            var ae, re;
            return [
              ((re = (ae = K.plugin) == null ? void 0 : ae.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (m(), Z("span", ml, S(K.nodes ?? 0), 1)) : J("", !0)
            ];
          }),
          "item.subscriptions": t(({ item: K }) => {
            var ae, re;
            return [
              ((re = (ae = K.plugin) == null ? void 0 : ae.type) == null ? void 0 : re.toLowerCase()) !== "feature" ? (m(), Z("span", pl, S(K.subscriptions ?? 0), 1)) : J("", !0)
            ];
          }),
          "item.actions": t(({ item: K }) => [
            K.deleted ? (m(), M(H, {
              key: 0,
              size: "small",
              color: "warning",
              title: "Deletion scheduled"
            }, {
              default: t(() => [...y[11] || (y[11] = [
                l("mdi-cancel", -1)
              ])]),
              _: 1
            })) : (m(), M(T, {
              key: 1,
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (ae) => r(K.plugin.artifact),
              title: "Delete plug-in"
            }, {
              default: t(() => [
                e(H, { size: "small" }, {
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
          modelValue: s.value,
          "onUpdate:modelValue": y[5] || (y[5] = (K) => s.value = K),
          "max-width": "520"
        }, {
          default: t(() => [
            e(W, null, {
              default: t(() => [
                e(b, null, {
                  default: t(() => [...y[13] || (y[13] = [
                    l("Install plug-in", -1)
                  ])]),
                  _: 1
                }),
                e(q, null, {
                  default: t(() => [
                    e(ee, {
                      modelValue: C.value,
                      "onUpdate:modelValue": y[2] || (y[2] = (K) => C.value = K),
                      label: "Artifact id (e.g. plugin-prov-aws)",
                      variant: "outlined",
                      hint: `Repository: ${E.value}`,
                      "persistent-hint": "",
                      class: "mb-2",
                      autofocus: ""
                    }, null, 8, ["modelValue", "hint"]),
                    e(Q, {
                      modelValue: $.value,
                      "onUpdate:modelValue": y[3] || (y[3] = (K) => $.value = K),
                      label: "Install Javadoc bundle",
                      density: "compact",
                      "hide-details": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                e(_, null, {
                  default: t(() => [
                    e(o),
                    e(T, {
                      variant: "text",
                      onClick: y[4] || (y[4] = (K) => s.value = !1)
                    }, {
                      default: t(() => [...y[14] || (y[14] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(T, {
                      color: "primary",
                      variant: "elevated",
                      loading: F.value,
                      disabled: !C.value,
                      onClick: R
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
}, fl = { class: "d-flex align-center mb-4" }, _l = {
  __name: "SystemNodeView",
  setup(d) {
    const h = fe(), I = pe(), z = i([]), E = i(!1), c = i(null), L = i(!1), U = i(null), N = i(!1), V = [
      { title: "Identifier", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Status", key: "status", sortable: !0, width: "120px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function s(B) {
      var p;
      const f = (p = B == null ? void 0 : B.toLowerCase) == null ? void 0 : p.call(B);
      return f === "up" ? "success" : f === "down" ? "error" : f === "unknown" ? "warning" : "grey";
    }
    async function C() {
      E.value = !0, c.value = null;
      const B = await h.get("rest/node");
      z.value = Array.isArray(B) ? B : (B == null ? void 0 : B.data) || [], E.value = !1;
    }
    function $(B) {
      U.value = B, L.value = !0;
    }
    async function F() {
      N.value = !0, await h.del(`rest/node/${encodeURIComponent(U.value.id)}`), N.value = !1, L.value = !1, C();
    }
    return me(() => {
      I.setTitle("Nodes"), I.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]), C();
    }), (B, f) => {
      const p = n("v-spacer"), j = n("v-btn"), G = n("v-alert"), D = n("v-chip"), R = n("v-icon"), x = n("v-data-table"), r = n("v-card-title"), v = n("v-card-text"), y = n("v-card-actions"), o = n("v-card"), Y = n("v-dialog");
      return m(), Z("div", null, [
        u("div", fl, [
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
            l(S(c.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        e(x, {
          headers: V,
          items: z.value,
          loading: E.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.id": t(({ item: T }) => [
            u("code", null, S(T.id), 1)
          ]),
          "item.status": t(({ item: T }) => [
            T.status ? (m(), M(D, {
              key: 0,
              size: "x-small",
              color: s(T.status),
              variant: "tonal"
            }, {
              default: t(() => [
                l(S(T.status), 1)
              ]),
              _: 2
            }, 1032, ["color"])) : J("", !0)
          ]),
          "item.actions": t(({ item: T }) => [
            e(j, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (P) => $(T)
            }, {
              default: t(() => [
                e(R, { size: "small" }, {
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
        e(Y, {
          modelValue: L.value,
          "onUpdate:modelValue": f[1] || (f[1] = (T) => L.value = T),
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
                    var T, P;
                    return [
                      f[6] || (f[6] = l(" Delete ", -1)),
                      u("strong", null, S((T = U.value) == null ? void 0 : T.name), 1),
                      f[7] || (f[7] = l(" (", -1)),
                      u("code", null, S((P = U.value) == null ? void 0 : P.id), 1),
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
                      onClick: f[0] || (f[0] = (T) => L.value = !1)
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
}, yl = { class: "d-flex align-center mb-4" }, gl = { class: "d-flex align-center ga-2" }, bl = { class: "d-flex align-center ga-2" }, kl = {
  __name: "SystemCacheView",
  setup(d) {
    const h = fe(), I = pe(), z = i([]), E = i(!1), c = i(null), L = i(null), U = [
      { title: "Cache", key: "id", sortable: !0 },
      { title: "Size", key: "size", sortable: !0, width: "100px" },
      { title: "Hits", key: "hitCount", sortable: !0, width: "160px" },
      { title: "Misses", key: "missCount", sortable: !0, width: "160px" },
      { title: "Avg get (ms)", key: "averageGetTime", sortable: !0, width: "140px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function N(C, $, F) {
      return $ && F === 1 || C >= 90 ? "success" : C >= 80 ? "primary" : C >= 50 ? "warning" : "error";
    }
    async function V() {
      E.value = !0, c.value = null;
      const C = await h.get("rest/system/cache");
      Array.isArray(C) ? z.value = C : C === null && (c.value = "Unable to load caches"), E.value = !1;
    }
    async function s(C) {
      L.value = C.id, await h.post(`rest/system/cache/${encodeURIComponent(C.id)}`), L.value = null, V();
    }
    return me(() => {
      I.setTitle("Caches"), I.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Caches" }]), V();
    }), (C, $) => {
      const F = n("v-spacer"), B = n("v-btn"), f = n("v-alert"), p = n("v-chip"), j = n("v-icon"), G = n("v-data-table");
      return m(), Z("div", null, [
        u("div", yl, [
          $[1] || ($[1] = u("h1", { class: "text-h4" }, "Caches", -1)),
          e(F),
          e(B, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            onClick: V
          }, {
            default: t(() => [...$[0] || ($[0] = [
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
            l(S(c.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        e(G, {
          headers: U,
          items: z.value,
          loading: E.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.hitCount": t(({ item: D }) => [
            u("div", gl, [
              u("span", null, S(D.hitCount ?? 0), 1),
              D.hitPercentage != null && (D.hitCount ?? 0) > 0 ? (m(), M(p, {
                key: 0,
                size: "x-small",
                color: N(D.hitPercentage, !0, D.hitCount)
              }, {
                default: t(() => [
                  l(S(Math.round(D.hitPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : J("", !0)
            ])
          ]),
          "item.missCount": t(({ item: D }) => [
            u("div", bl, [
              u("span", null, S(D.missCount ?? 0), 1),
              D.missPercentage != null && (D.missCount ?? 0) > 1 ? (m(), M(p, {
                key: 0,
                size: "x-small",
                color: N(100 - D.missPercentage, !1)
              }, {
                default: t(() => [
                  l(S(Math.round(D.missPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : J("", !0)
            ])
          ]),
          "item.averageGetTime": t(({ item: D }) => [
            l(S(D.averageGetTime ?? "—"), 1)
          ]),
          "item.actions": t(({ item: D }) => [
            e(B, {
              icon: "",
              size: "small",
              variant: "text",
              loading: L.value === D.id,
              onClick: (R) => s(D),
              title: "Invalidate cache"
            }, {
              default: t(() => [
                e(j, { size: "small" }, {
                  default: t(() => [...$[2] || ($[2] = [
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
    const h = fe(), I = pe(), z = [
      { key: "insert", step: "INSERT", method: "post", url: "rest/system/bench/prepare" },
      { key: "select", step: "SELECT", method: "get", url: "rest/system/bench/read" },
      { key: "select-all", step: "SELECT *", method: "get", url: "rest/system/bench/read/all" },
      { key: "update", step: "UPDATE", method: "put", url: "rest/system/bench/update" },
      { key: "delete", step: "DELETE", method: "del", url: "rest/system/bench/delete" }
    ], E = i(!1), c = i(null), L = i(z.map((N) => ({ step: N.step, duration: null, loading: !1 })));
    async function U() {
      E.value = !0, c.value = null, L.value = z.map((N) => ({ step: N.step, duration: null, loading: !1 }));
      for (let N = 0; N < z.length; N++) {
        L.value[N].loading = !0;
        try {
          const V = z[N].method === "post" || z[N].method === "put" ? void 0 : null, s = V === null ? await h[z[N].method](z[N].url) : await h[z[N].method](z[N].url, V);
          L.value[N].duration = (s == null ? void 0 : s.duration) ?? "—";
        } catch (V) {
          c.value = `${z[N].step} failed: ${V.message || V}`;
          break;
        } finally {
          L.value[N].loading = !1;
        }
      }
      E.value = !1;
    }
    return me(() => {
      I.setTitle("Bench"), I.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (N, V) => {
      const s = n("v-card-text"), C = n("v-card"), $ = n("v-btn"), F = n("v-alert"), B = n("v-progress-circular"), f = n("v-table");
      return m(), Z("div", null, [
        V[3] || (V[3] = u("h1", { class: "text-h4 mb-4" }, "Database bench", -1)),
        e(C, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(s, null, {
              default: t(() => [...V[0] || (V[0] = [
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
        e($, {
          color: "primary",
          "prepend-icon": "mdi-play",
          loading: E.value,
          onClick: U
        }, {
          default: t(() => [...V[1] || (V[1] = [
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
            l(S(c.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        L.value.length ? (m(), M(f, {
          key: 1,
          density: "compact",
          class: "mt-4",
          style: { "max-width": "600px" }
        }, {
          default: t(() => [
            V[2] || (V[2] = u("thead", null, [
              u("tr", null, [
                u("th", null, "Step"),
                u("th", null, "Duration (ms)")
              ])
            ], -1)),
            u("tbody", null, [
              (m(!0), Z(ve, null, ke(L.value, (p) => (m(), Z("tr", {
                key: p.step
              }, [
                u("td", null, S(p.step), 1),
                u("td", null, [
                  p.loading ? (m(), M(B, {
                    key: 0,
                    size: "16",
                    width: "2",
                    indeterminate: ""
                  })) : (m(), Z("span", wl, S(p.duration ?? "—"), 1))
                ])
              ]))), 128))
            ])
          ]),
          _: 1
        })) : J("", !0)
      ]);
    };
  }
}, Vl = { class: "d-flex align-center mb-4" }, Cl = {
  __name: "ApiHomeView",
  setup(d) {
    const h = pe(), I = i(!0), z = i(null), E = "/", c = `${E}rest/swagger-ui-bundle.js`, L = `${E}rest/swagger-ui-standalone-preset.js`, U = `${E}rest/swagger-ui.css`, N = `${E}rest/index.css`, V = `${E}rest/openapi.json`;
    function s() {
      return () => ({
        fn: {
          opsFilter(f, p) {
            const j = p.toLowerCase();
            return f.map((D) => (D._root.entries[1][1] = D._root.entries[1][1].filter((R) => {
              const x = JSON.parse(JSON.stringify(R)), r = (x.operation.summary || "").toString().toLowerCase(), v = (x.operation.description || "").toString().toLowerCase();
              return x.path.toLowerCase().includes(j) || r.includes(j) || v.includes(j);
            }), D)).filter((D) => D._root.entries[1][1].size > 0);
          }
        }
      });
    }
    function C(f, p) {
      if (document.getElementById(p)) return;
      const j = document.createElement("link");
      j.id = p, j.rel = "stylesheet", j.href = f, document.head.appendChild(j);
    }
    function $(f) {
      var p;
      (p = document.getElementById(f)) == null || p.remove();
    }
    function F(f, p) {
      return new Promise((j, G) => {
        if (document.getElementById(p)) {
          j();
          return;
        }
        const R = document.createElement("script");
        R.id = p, R.src = f, R.async = !0, R.onload = j, R.onerror = () => G(new Error(`Failed to load ${f}`)), document.head.appendChild(R);
      });
    }
    function B() {
      const { SwaggerUIBundle: f, SwaggerUIStandalonePreset: p } = window;
      if (!f) {
        z.value = "Swagger UI bundle is unavailable.";
        return;
      }
      window.ui = f({
        url: V,
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
      h.setTitle("API"), h.setBreadcrumbs([{ title: "API" }]), C(U, "swagger-ui-css"), C(N, "swagger-ui-extra-css");
      try {
        await Promise.all([
          F(c, "swagger-ui-bundle"),
          F(L, "swagger-ui-preset")
        ]), B();
      } catch (f) {
        z.value = f.message || "Unable to load Swagger UI.";
      } finally {
        I.value = !1;
      }
    }), Ke(() => {
      $("swagger-ui-css"), $("swagger-ui-extra-css"), delete window.ui;
    }), (f, p) => {
      const j = n("v-spacer"), G = n("v-btn"), D = n("v-alert"), R = n("v-progress-linear");
      return m(), Z("div", null, [
        u("div", Vl, [
          p[1] || (p[1] = u("h1", { class: "text-h4" }, "API reference", -1)),
          e(j),
          e(G, {
            variant: "outlined",
            "prepend-icon": "mdi-code-tags",
            href: `${se(E)}rest/openapi.json`,
            target: "_blank"
          }, {
            default: t(() => [...p[0] || (p[0] = [
              l(" Download OpenAPI ", -1)
            ])]),
            _: 1
          }, 8, ["href"])
        ]),
        z.value ? (m(), M(D, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(S(z.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        I.value ? (m(), M(R, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : J("", !0),
        p[2] || (p[2] = u("div", {
          id: "swagger-ui",
          class: "swagger-container"
        }, null, -1))
      ]);
    };
  }
}, $l = /* @__PURE__ */ we(Cl, [["__scopeId", "data-v-f74586ba"]]), Sl = { class: "d-flex align-center mb-4" }, hl = { class: "mb-0 text-body-2" }, Ul = {
  __name: "ApiTokenView",
  setup(d) {
    const h = fe(), I = pe(), z = he(), E = "/", c = typeof window < "u" ? window.location.origin : "", L = ce(() => z.userName || "<you>"), U = i([]), N = i(!1), V = i(null), s = i(!1), C = i(null), $ = i(""), F = i(!1), B = i(!1), f = i(""), p = i(""), j = i(!1), G = i(""), D = i(""), R = i(!1), x = i(!1), r = i(!1), v = i(""), y = i(!1), o = { required: (q) => !!q || "Required" }, Y = [
      { title: "Name", key: "name", sortable: !0 },
      { title: "", key: "actions", sortable: !1, width: "140px", align: "end" }
    ];
    async function T() {
      N.value = !0, V.value = null;
      const q = await h.get("rest/api/token");
      U.value = Array.isArray(q) ? q.map((_) => ({ name: _ })) : [], N.value = !1;
    }
    function P() {
      $.value = "", s.value = !0;
    }
    async function H() {
      const { valid: q } = await C.value.validate();
      if (!q) return;
      F.value = !0;
      const _ = await h.post(`rest/api/token/${encodeURIComponent($.value)}`);
      F.value = !1, _ !== null && (f.value = $.value, p.value = typeof _ == "string" ? _ : (_ == null ? void 0 : _.id) || "", s.value = !1, B.value = !0, T());
    }
    async function w(q, _) {
      G.value = q, D.value = "", x.value = !1, j.value = !0, R.value = !0;
      const W = `rest/api/token/${encodeURIComponent(q)}`, te = _ === "regen" ? await h.put(W) : await h.get(W);
      D.value = typeof te == "string" ? te : (te == null ? void 0 : te.id) || "", R.value = !1;
    }
    async function a() {
      try {
        await navigator.clipboard.writeText(D.value), x.value = !0, setTimeout(() => {
          x.value = !1;
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
    function ee(q) {
      v.value = q, r.value = !0;
    }
    async function Q() {
      y.value = !0, await h.del(`rest/api/token/${encodeURIComponent(v.value)}`), y.value = !1, r.value = !1, T();
    }
    return me(() => {
      I.setTitle("API tokens"), I.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]), T();
    }), (q, _) => {
      const W = n("v-spacer"), te = n("v-btn"), K = n("v-card-text"), ae = n("v-card"), re = n("v-alert"), O = n("v-icon"), oe = n("v-data-table"), ue = n("v-card-title"), ye = n("v-text-field"), k = n("v-form"), g = n("v-card-actions"), A = n("v-dialog"), ie = n("v-progress-linear"), ne = n("v-textarea");
      return m(), Z("div", null, [
        u("div", Sl, [
          _[11] || (_[11] = u("h1", { class: "text-h4" }, "API tokens", -1)),
          e(W),
          e(te, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: P
          }, {
            default: t(() => [..._[10] || (_[10] = [
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
            e(K, null, {
              default: t(() => [
                _[13] || (_[13] = u("p", { class: "mb-2" }, [
                  l(" Tokens let you call the Ligoj API without a password. Pass the token in the "),
                  u("code", null, "api-key"),
                  l(" parameter along with your user id in "),
                  u("code", null, "api-user"),
                  l(". ")
                ], -1)),
                u("p", hl, [
                  _[12] || (_[12] = l(" Example: ", -1)),
                  u("code", null, " GET " + S(se(c)) + S(se(E)) + "rest/project?api-key=<token>&api-user=" + S(L.value), 1)
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        V.value ? (m(), M(re, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(S(V.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        e(oe, {
          headers: Y,
          items: U.value,
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
              onClick: (_e) => w(le.name, "load")
            }, {
              default: t(() => [
                e(O, { size: "small" }, {
                  default: t(() => [..._[14] || (_[14] = [
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
              onClick: (_e) => w(le.name, "regen")
            }, {
              default: t(() => [
                e(O, { size: "small" }, {
                  default: t(() => [..._[15] || (_[15] = [
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
              onClick: (_e) => ee(le.name)
            }, {
              default: t(() => [
                e(O, { size: "small" }, {
                  default: t(() => [..._[16] || (_[16] = [
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
        e(A, {
          modelValue: s.value,
          "onUpdate:modelValue": _[2] || (_[2] = (le) => s.value = le),
          "max-width": "480",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
                  default: t(() => [..._[17] || (_[17] = [
                    l("New API token", -1)
                  ])]),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => [
                    e(k, {
                      ref_key: "createFormRef",
                      ref: C,
                      onSubmit: xe(H, ["prevent"])
                    }, {
                      default: t(() => [
                        e(ye, {
                          modelValue: $.value,
                          "onUpdate:modelValue": _[0] || (_[0] = (le) => $.value = le),
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
                    e(W),
                    e(te, {
                      variant: "text",
                      onClick: _[1] || (_[1] = (le) => s.value = !1)
                    }, {
                      default: t(() => [..._[18] || (_[18] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(te, {
                      color: "primary",
                      variant: "elevated",
                      loading: F.value,
                      onClick: H
                    }, {
                      default: t(() => [..._[19] || (_[19] = [
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
        e(A, {
          modelValue: j.value,
          "onUpdate:modelValue": _[5] || (_[5] = (le) => j.value = le),
          "max-width": "520"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
                  default: t(() => [
                    _[20] || (_[20] = l(" Token: ", -1)),
                    u("code", null, S(G.value), 1)
                  ]),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => [
                    R.value ? (m(), M(ie, {
                      key: 0,
                      indeterminate: "",
                      color: "primary",
                      class: "mb-3"
                    })) : J("", !0),
                    e(ne, {
                      modelValue: D.value,
                      "onUpdate:modelValue": _[3] || (_[3] = (le) => D.value = le),
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": a
                    }, null, 8, ["modelValue"]),
                    x.value ? (m(), M(re, {
                      key: 1,
                      type: "success",
                      variant: "tonal",
                      density: "compact",
                      class: "mt-2"
                    }, {
                      default: t(() => [..._[21] || (_[21] = [
                        l(" Copied to clipboard. ", -1)
                      ])]),
                      _: 1
                    })) : J("", !0)
                  ]),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(W),
                    e(te, {
                      variant: "text",
                      onClick: _[4] || (_[4] = (le) => j.value = !1)
                    }, {
                      default: t(() => [..._[22] || (_[22] = [
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
        e(A, {
          modelValue: B.value,
          "onUpdate:modelValue": _[7] || (_[7] = (le) => B.value = le),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
                  default: t(() => [
                    _[23] || (_[23] = l(" New token: ", -1)),
                    u("code", null, S(f.value), 1)
                  ]),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => [
                    e(re, {
                      type: "info",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-3"
                    }, {
                      default: t(() => [..._[24] || (_[24] = [
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
                    e(W),
                    e(te, {
                      color: "primary",
                      onClick: _[6] || (_[6] = (le) => B.value = !1)
                    }, {
                      default: t(() => [..._[25] || (_[25] = [
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
        e(A, {
          modelValue: r.value,
          "onUpdate:modelValue": _[9] || (_[9] = (le) => r.value = le),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ae, null, {
              default: t(() => [
                e(ue, null, {
                  default: t(() => [..._[26] || (_[26] = [
                    l("Delete token", -1)
                  ])]),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => [
                    _[27] || (_[27] = l("Revoke token ", -1)),
                    u("code", null, S(v.value), 1),
                    _[28] || (_[28] = l("?", -1))
                  ]),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(W),
                    e(te, {
                      variant: "text",
                      onClick: _[8] || (_[8] = (le) => r.value = !1)
                    }, {
                      default: t(() => [..._[29] || (_[29] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(te, {
                      color: "error",
                      variant: "elevated",
                      loading: y.value,
                      onClick: Q
                    }, {
                      default: t(() => [..._[30] || (_[30] = [
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
}, Pl = { class: "d-flex align-center mb-4" }, jl = { class: "pa-4" }, Tl = { class: "pa-4" }, Nl = { class: "text-body-2 text-medium-emphasis mb-4" }, zl = { class: "d-flex align-center pa-2" }, Al = {
  __name: "SubscribeWizardView",
  setup(d) {
    const h = Ie(), I = Ue(), z = fe(), E = pe(), c = ce(() => h.query.project ?? h.params.id ?? null), L = i(null), U = i(!1), N = i(null), V = i(1), s = Ve({
      service: null,
      tool: null,
      node: null,
      mode: null
    }), C = i([]), $ = i([]), F = i([]), B = i([]), f = Ve({}), p = i(null), j = i(!1), G = i(!1), D = i(!1), R = i(!1), x = i(!1), r = ce(() => ["Service", "Tool", "Node", "Mode", "Parameters"]), v = ce(() => (k) => k === 1 ? !0 : k === 2 ? !!s.service : k === 3 ? !!s.tool : k === 4 ? !!s.node : k === 5 ? !!s.node && !!s.mode : !1), y = ce(() => V.value === 1 ? !!s.service : V.value === 2 ? !!s.tool : V.value === 3 ? !!s.node : V.value === 4 ? !!s.mode : !1), o = ce(() => {
      var A;
      const k = (A = s.tool) == null ? void 0 : A.mode, g = [];
      return (k === "all" || k === "create") && g.push({ value: "create", label: "Create — provision a new instance inside the tool" }), (k === "all" || k === "link" || !k) && g.push({ value: "link", label: "Link — attach this project to an existing instance" }), g;
    }), Y = ce(
      () => L.value ? `/home/project/${L.value.id}` : "/home/project"
    );
    function T(k) {
      return !k.type || k.type === "text" || k.type === "password" || k.type === "node" || k.type === "project";
    }
    function P(k) {
      return k.type === "password" || (k.name || "").toLowerCase().includes("password");
    }
    function H(k) {
      const g = k.mandatory || k.required ? " *" : "";
      return `${k.name || k.id}${g}`;
    }
    function w(k) {
      const g = [];
      return (k.mandatory || k.required) && g.push((A) => A !== "" && A != null || "Required"), g;
    }
    async function a() {
      if (!c.value) return;
      U.value = !0;
      const k = await z.get(`rest/project/${c.value}`);
      L.value = k || null, U.value = !1;
    }
    async function b() {
      j.value = !0, C.value = await W("rest/node?refined=service&rows=1000"), j.value = !1;
    }
    async function ee(k) {
      G.value = !0, $.value = await W(`rest/node?refined=${encodeURIComponent(k)}&rows=1000`), G.value = !1;
    }
    async function Q(k) {
      D.value = !0, F.value = await W(`rest/node?refined=${encodeURIComponent(k)}&rows=1000`), D.value = !1;
    }
    async function q(k, g) {
      R.value = !0;
      const A = await z.get(`rest/node/${encodeURIComponent(k)}/parameter/${g.toUpperCase()}`);
      B.value = Array.isArray(A) ? A : (A == null ? void 0 : A.data) || [];
      for (const ie of Object.keys(f)) delete f[ie];
      for (const ie of B.value)
        ie.defaultValue != null ? f[ie.id] = _(ie) : ie.type === "bool" ? f[ie.id] = !1 : ie.type === "multiselect" || ie.type === "tags" ? f[ie.id] = [] : f[ie.id] = "";
      R.value = !1;
    }
    function _(k) {
      return k.type === "integer" ? Number(k.defaultValue) : k.type === "bool" ? k.defaultValue === !0 || k.defaultValue === "true" : k.defaultValue;
    }
    async function W(k) {
      const g = await z.get(k);
      return Array.isArray(g) ? te(g) : Array.isArray(g == null ? void 0 : g.data) ? te(g.data) : [];
    }
    function te(k) {
      return k.filter((g) => g.enabled !== !1);
    }
    function K(k) {
      var g;
      ((g = s.service) == null ? void 0 : g.id) !== k.id && (s.service = k, s.tool = null, s.node = null, s.mode = null, $.value = [], F.value = []);
    }
    function ae(k) {
      var g;
      ((g = s.tool) == null ? void 0 : g.id) !== k.id && (s.tool = k, s.node = null, s.mode = null, F.value = []);
    }
    function re(k) {
      var g;
      ((g = s.node) == null ? void 0 : g.id) !== k.id && (s.node = k, s.mode = null);
    }
    ze(V, async (k) => {
      k === 1 && C.value.length === 0 && await b(), k === 2 && s.service && $.value.length === 0 && await ee(s.service.id), k === 3 && s.tool && F.value.length === 0 && await Q(s.tool.id), k === 4 && !s.mode && o.value.length > 0 && (s.mode = o.value[0].value), k === 5 && s.node && s.mode && await q(s.node.id, s.mode);
    });
    async function O() {
      const { valid: k } = p.value ? await p.value.validate() : { valid: !0 };
      if (!k) return;
      x.value = !0, N.value = null;
      const g = {
        node: s.node.id,
        project: Number(c.value),
        mode: s.mode,
        parameters: B.value.map((ie) => oe(ie)).filter(Boolean)
      }, A = await z.post("rest/subscription", g);
      x.value = !1, A != null ? I.push(`/home/project/${c.value}`) : N.value = "Subscription creation failed — please review the highlighted parameters.";
    }
    function oe(k) {
      const g = f[k.id];
      if ((g === "" || g == null || Array.isArray(g) && g.length === 0) && !k.mandatory && !k.required)
        return null;
      const A = { parameter: k.id };
      return k.type === "integer" ? { ...A, integer: Number(g) } : k.type === "bool" ? { ...A, bool: !!g } : k.type === "multiselect" || k.type === "tags" ? { ...A, selections: g || [] } : k.type === "select" ? { ...A, text: g } : { ...A, text: g };
    }
    me(async () => {
      E.setTitle("Subscribe"), E.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        ...c.value ? [{ title: c.value, to: `/home/project/${c.value}` }, { title: "Subscribe" }] : [{ title: "Subscribe" }]
      ]), await a(), L.value && await b();
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
              (A) => be(
                "button",
                {
                  key: A.id,
                  type: "button",
                  class: [
                    "choice-card",
                    { "choice-card--active": A.id === k.selectedId }
                  ],
                  onClick: () => g("select", A),
                  title: A.description || void 0
                },
                [
                  be("div", { class: "choice-icon" }, ye(A)),
                  be("div", { class: "choice-name" }, A.name || A.id)
                ]
              )
            )
          ) : be("div", { class: "text-body-2 text-medium-emphasis" }, "No entries available.")
        ]);
      }
    };
    function ye(k) {
      var A;
      const g = (k == null ? void 0 : k.uiClasses) || ((A = k == null ? void 0 : k.refined) == null ? void 0 : A.uiClasses);
      return g && g.startsWith("$") ? g.slice(1) : g ? be("i", { class: g }) : be("i", { class: "mdi mdi-puzzle" });
    }
    return (k, g) => {
      const A = n("v-spacer"), ie = n("v-btn"), ne = n("router-link"), le = n("v-alert"), _e = n("v-radio"), Le = n("v-radio-group"), Ee = n("v-progress-linear"), Ce = n("v-text-field"), Be = n("v-checkbox"), Pe = n("v-select"), qe = n("v-form"), Me = n("v-stepper");
      return m(), Z("div", null, [
        u("div", Pl, [
          g[3] || (g[3] = u("h1", { class: "text-h4" }, "Subscribe", -1)),
          e(A),
          e(ie, {
            variant: "text",
            to: Y.value
          }, {
            default: t(() => [...g[2] || (g[2] = [
              l("Cancel", -1)
            ])]),
            _: 1
          }, 8, ["to"])
        ]),
        c.value ? U.value ? (m(), M(le, {
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
        })) : L.value ? (m(), M(le, {
          key: 2,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            g[8] || (g[8] = l(" Adding a subscription to ", -1)),
            u("strong", null, S(L.value.name), 1),
            l(" (" + S(L.value.pkey) + "). ", 1),
            g[9] || (g[9] = u("br", null, null, -1)),
            g[10] || (g[10] = u("span", { class: "text-caption text-warning" }, "Subscribing is not an idempotent operation — removing a subscription later may not clean up remote data automatically.", -1))
          ]),
          _: 1
        })) : J("", !0) : (m(), M(le, {
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
        N.value ? (m(), M(le, {
          key: 3,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(S(N.value), 1)
          ]),
          _: 1
        })) : J("", !0),
        L.value ? (m(), M(Me, {
          key: 4,
          modelValue: V.value,
          "onUpdate:modelValue": g[1] || (g[1] = (de) => V.value = de),
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
                choices: C.value,
                loading: j.value,
                "selected-id": (de = s.service) == null ? void 0 : de.id,
                onSelect: K
              }, null, 8, ["choices", "loading", "selected-id"])
            ];
          }),
          "item.2": t(() => {
            var de, X;
            return [
              e(ue, {
                heading: `Select a tool providing ${((de = s.service) == null ? void 0 : de.name) ?? "…"}`,
                sub: "A tool is one implementation of the service; several instances may be deployed.",
                choices: $.value,
                loading: G.value,
                "selected-id": (X = s.tool) == null ? void 0 : X.id,
                onSelect: ae
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.3": t(() => {
            var de, X;
            return [
              e(ue, {
                heading: `Pick a node running ${((de = s.tool) == null ? void 0 : de.name) ?? "…"}`,
                sub: "A node is a running instance of the tool.",
                choices: F.value,
                loading: D.value,
                "selected-id": (X = s.node) == null ? void 0 : X.id,
                onSelect: re
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.4": t(() => [
            u("div", jl, [
              g[11] || (g[11] = u("h3", { class: "text-h6 mb-2" }, "Subscription mode", -1)),
              g[12] || (g[12] = u("p", { class: "text-body-2 text-medium-emphasis mb-4" }, [
                u("strong", null, "Link"),
                l(" attaches this project to an existing instance in the tool. "),
                u("strong", null, "Create"),
                l(" additionally provisions a new instance inside the tool. ")
              ], -1)),
              e(Le, {
                modelValue: s.mode,
                "onUpdate:modelValue": g[0] || (g[0] = (de) => s.mode = de),
                inline: ""
              }, {
                default: t(() => [
                  (m(!0), Z(ve, null, ke(o.value, (de) => (m(), M(_e, {
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
              u("div", Tl, [
                g[16] || (g[16] = u("h3", { class: "text-h6 mb-1" }, "Parameters", -1)),
                u("p", Nl, [
                  g[13] || (g[13] = l(" Values required to link the project to ", -1)),
                  u("code", null, S((de = s.node) == null ? void 0 : de.id), 1),
                  g[14] || (g[14] = l(". ", -1))
                ]),
                R.value ? (m(), M(Ee, {
                  key: 0,
                  indeterminate: "",
                  color: "primary",
                  class: "mb-3"
                })) : J("", !0),
                !R.value && B.value.length === 0 ? (m(), M(le, {
                  key: 1,
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: t(() => [...g[15] || (g[15] = [
                    l(" This subscription requires no additional parameters — just click Create. ", -1)
                  ])]),
                  _: 1
                })) : J("", !0),
                e(qe, {
                  ref_key: "paramFormRef",
                  ref: p
                }, {
                  default: t(() => [
                    (m(!0), Z(ve, null, ke(B.value, (X) => (m(), Z("div", {
                      key: X.id,
                      class: "mb-3"
                    }, [
                      T(X) ? (m(), M(Ce, {
                        key: 0,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        type: P(X) ? "password" : "text",
                        label: H(X),
                        rules: w(X),
                        hint: X.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "label", "rules", "hint"])) : X.type === "integer" ? (m(), M(Ce, {
                        key: 1,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
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
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "max", "label", "rules", "hint"])) : X.type === "bool" ? (m(), M(Be, {
                        key: 2,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        label: H(X),
                        hint: X.description,
                        "persistent-hint": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "hint"])) : X.type === "select" ? (m(), M(Pe, {
                        key: 3,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        items: X.values || [],
                        label: H(X),
                        rules: w(X),
                        hint: X.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : X.type === "multiselect" || X.type === "tags" ? (m(), M(Pe, {
                        key: 4,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
                        items: X.values || [],
                        label: H(X),
                        rules: w(X),
                        hint: X.description,
                        "persistent-hint": "",
                        chips: "",
                        multiple: "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : (m(), M(Ce, {
                        key: 5,
                        modelValue: f[X.id],
                        "onUpdate:modelValue": (ge) => f[X.id] = ge,
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
              V.value > 1 ? (m(), M(ie, {
                key: 0,
                variant: "text",
                "prepend-icon": "mdi-arrow-left",
                onClick: de
              }, {
                default: t(() => [...g[17] || (g[17] = [
                  l("Previous", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : J("", !0),
              e(A),
              V.value < r.value.length ? (m(), M(ie, {
                key: 1,
                color: "primary",
                disabled: !y.value,
                "append-icon": "mdi-arrow-right",
                onClick: X
              }, {
                default: t(() => [...g[18] || (g[18] = [
                  l("Next", -1)
                ])]),
                _: 1
              }, 8, ["disabled", "onClick"])) : (m(), M(ie, {
                key: 2,
                color: "success",
                "prepend-icon": "mdi-check",
                loading: x.value,
                disabled: !s.node,
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
        }, 8, ["modelValue", "items", "editable"])) : J("", !0)
      ]);
    };
  }
}, je = /* @__PURE__ */ we(Al, [["__scopeId", "data-v-47b9f499"]]);
if (typeof document < "u") {
  const d = "ligoj-plugin-ui-css";
  if (!document.getElementById(d)) {
    const h = document.createElement("link");
    h.id = d, h.rel = "stylesheet", h.href = new URL(
      /* @vite-ignore */
      "./index.css",
      import.meta.url
    ).href, document.head.appendChild(h);
  }
}
const Il = {
  sample: De.sample
}, Te = [
  { path: "/home", name: "ui-home", component: ft },
  { path: "/home/manual", name: "ui-manual", component: Ot },
  { path: "/home/project", name: "ui-project-list", component: St },
  { path: "/home/project/:id", name: "ui-project-detail", component: Bt },
  { path: "/system", name: "ui-system", component: Ht },
  { path: "/system/information", name: "ui-system-information", component: Yt },
  { path: "/system/configuration", name: "ui-system-configuration", component: al },
  { path: "/system/user", name: "ui-system-user", component: il },
  { path: "/system/role", name: "ui-system-role", component: dl },
  { path: "/system/plugin", name: "ui-system-plugin", component: vl },
  { path: "/system/node", name: "ui-system-node", component: _l },
  { path: "/system/cache", name: "ui-system-cache", component: kl },
  { path: "/system/bench", name: "ui-system-bench", component: xl },
  { path: "/api", name: "ui-api", component: $l },
  { path: "/api/token", name: "ui-api-token", component: Ul },
  { path: "/subscribe", name: "ui-subscribe", component: je },
  // Project-scoped entry used by ProjectDetailView's "Add subscription" button.
  { path: "/home/project/:id/subscription", name: "ui-subscribe-project", component: je }
], Kl = {
  id: "ui",
  label: "UI",
  component: tt,
  routes: Te,
  install({ router: d }) {
    for (const h of Te)
      d.addRoute(h);
  },
  feature(d, ...h) {
    const I = Il[d];
    if (!I) throw new Error(`Plugin "ui" has no feature "${d}"`);
    return I(...h);
  },
  service: De,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  Wl as TARGET_TYPE_ICON,
  Kl as default,
  Re as getFullName,
  Hl as getHierarchyIds,
  yt as getService,
  Fl as getServiceFromId,
  Ol as getServiceNameFromId,
  gt as getTool,
  Ml as getToolFromId,
  Gl as getToolNameFromId,
  Bl as htmlEscape,
  ql as htmlUnescape,
  kt as normalize,
  De as service,
  _t as toUser2Letters,
  El as trimObject
};
