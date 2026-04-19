import { resolveComponent as n, openBlock as r, createElementBlock as H, createVNode as e, withCtx as t, createTextVNode as l, ref as s, computed as pe, onMounted as ce, createElementVNode as d, Fragment as ve, renderList as ye, createBlock as R, toDisplayString as w, createCommentVNode as W, normalizeClass as qe, mergeProps as Me, unref as ae, withDirectives as Oe, withModifiers as xe, vShow as Fe, watch as Pe, onBeforeUnmount as Ge, reactive as Se, h as ge } from "vue";
import { useApi as be, useAppStore as me, useI18nStore as He, useDataTable as Ae, useErrorStore as We, useAuthStore as Ne } from "@ligoj/host";
import { useRouter as Ce, useRoute as ze } from "vue-router";
const we = (o, h) => {
  const U = o.__vccOpts || o;
  for (const [A, z] of h)
    U[A] = z;
  return U;
}, Je = { class: "plugin-ui-shell" }, Xe = {
  __name: "UiPlugin",
  setup(o) {
    return (h, U) => {
      const A = n("v-alert"), z = n("v-list-subheader"), i = n("v-list-item"), I = n("v-list");
      return r(), H("div", Je, [
        e(A, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...U[0] || (U[0] = [
            l(" plugin-ui is being migrated from the legacy Cascade.js implementation — most views below are placeholders and link back to their legacy sources. ", -1)
          ])]),
          _: 1
        }),
        e(I, {
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            e(z, null, {
              default: t(() => [...U[1] || (U[1] = [
                l("Dashboard", -1)
              ])]),
              _: 1
            }),
            e(i, {
              to: "/home",
              "prepend-icon": "mdi-view-dashboard",
              title: "Overview"
            }),
            e(i, {
              to: "/home/project",
              "prepend-icon": "mdi-folder-multiple",
              title: "Projects"
            }),
            e(i, {
              to: "/home/manual",
              "prepend-icon": "mdi-book-open-page-variant",
              title: "Manual"
            }),
            e(z, null, {
              default: t(() => [...U[2] || (U[2] = [
                l("System", -1)
              ])]),
              _: 1
            }),
            e(i, {
              to: "/system",
              "prepend-icon": "mdi-cog",
              title: "System administration"
            }),
            e(z, null, {
              default: t(() => [...U[3] || (U[3] = [
                l("API", -1)
              ])]),
              _: 1
            }),
            e(i, {
              to: "/api",
              "prepend-icon": "mdi-api",
              title: "API reference"
            }),
            e(i, {
              to: "/api/token",
              "prepend-icon": "mdi-key-variant",
              title: "API tokens"
            }),
            e(z, null, {
              default: t(() => [...U[4] || (U[4] = [
                l("Onboarding", -1)
              ])]),
              _: 1
            }),
            e(i, {
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
}, Ye = /* @__PURE__ */ we(Xe, [["__scopeId", "data-v-9cfeae95"]]), Ie = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, Ke = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, Qe = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mb-4"
}, Ze = { class: "ml-1 text-caption" }, et = { class: "d-flex align-start mb-2" }, tt = { class: "flex-grow-1 truncate" }, lt = { class: "text-subtitle-1 font-weight-medium truncate" }, nt = { class: "text-caption text-medium-emphasis" }, at = {
  key: 0,
  class: "sub-strip"
}, ot = {
  key: 0,
  class: "text-caption text-medium-emphasis ml-1"
}, st = { style: { width: "28px" } }, it = { class: "truncate" }, rt = { class: "truncate text-medium-emphasis" }, ut = {
  __name: "HomeView",
  setup(o) {
    const h = be(), U = me(), A = s(!1), z = s(null), i = s([]), I = s(""), x = s(null), S = s("md"), b = pe(() => {
      var V, F, P;
      const u = /* @__PURE__ */ new Map();
      for (const j of i.value) {
        const D = ((V = j.project) == null ? void 0 : V.id) ?? j.project;
        if (D == null) continue;
        let E = u.get(D);
        E || (E = {
          id: D,
          name: ((F = j.project) == null ? void 0 : F.name) || String(D),
          pkey: ((P = j.project) == null ? void 0 : P.pkey) || "",
          subscriptions: []
        }, u.set(D, E)), E.subscriptions.push(j);
      }
      return [...u.values()].sort((j, D) => j.name.localeCompare(D.name));
    }), m = pe(() => {
      var V, F, P;
      const u = /* @__PURE__ */ new Map();
      for (const j of i.value) {
        const D = ((P = (F = (V = j.node) == null ? void 0 : V.refined) == null ? void 0 : F.refined) == null ? void 0 : P.id) || "";
        D && u.set(D, (u.get(D) || 0) + 1);
      }
      return [...u.entries()].sort((j, D) => D[1] - j[1]).map(([j, D]) => ({
        id: j,
        count: D,
        icon: $(j),
        label: j.split(":").slice(-1)[0]
      }));
    }), C = pe(() => {
      var V;
      const u = (V = I.value) == null ? void 0 : V.trim().toLowerCase();
      return b.value.filter((F) => x.value && !F.subscriptions.some(
        (j) => {
          var D, E, _;
          return ((_ = (E = (D = j.node) == null ? void 0 : D.refined) == null ? void 0 : E.refined) == null ? void 0 : _.id) === x.value;
        }
      ) ? !1 : !u || F.name.toLowerCase().includes(u) || F.pkey.toLowerCase().includes(u) ? !0 : F.subscriptions.some(
        (P) => {
          var j, D, E, _;
          return (((j = P.node) == null ? void 0 : j.name) || "").toLowerCase().includes(u) || (((D = P.node) == null ? void 0 : D.id) || "").toLowerCase().includes(u) || (((_ = (E = P.node) == null ? void 0 : E.refined) == null ? void 0 : _.name) || "").toLowerCase().includes(u);
        }
      ));
    });
    function $(u) {
      return u.includes(":scm:") ? "mdi-source-branch" : u.includes(":build:") ? "mdi-hammer-wrench" : u.includes(":bt") ? "mdi-bug" : u.includes(":km:") ? "mdi-book-open-variant" : u.includes(":vm") ? "mdi-server" : u.includes(":prov") ? "mdi-cloud" : u.includes(":id") ? "mdi-account-group" : u.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    function O(u) {
      var V, F, P;
      return $(((P = (F = (V = u.node) == null ? void 0 : V.refined) == null ? void 0 : F.refined) == null ? void 0 : P.id) || "");
    }
    function T(u) {
      var j, D, E;
      const V = ((E = (D = (j = u.node) == null ? void 0 : j.refined) == null ? void 0 : D.refined) == null ? void 0 : E.id) || "", F = ["primary", "teal", "indigo", "purple", "orange", "blue-grey", "green"];
      let P = 0;
      for (const _ of V) P += _.charCodeAt(0);
      return F[P % F.length];
    }
    async function f() {
      A.value = !0, z.value = null;
      const u = await h.get("rest/subscription");
      Array.isArray(u) ? i.value = u : Array.isArray(u == null ? void 0 : u.data) ? i.value = u.data : i.value = [], A.value = !1;
    }
    return ce(() => {
      U.setTitle("Dashboard"), U.setBreadcrumbs([{ title: "Home" }]), f();
    }), (u, V) => {
      const F = n("v-spacer"), P = n("v-text-field"), j = n("v-icon"), D = n("v-btn"), E = n("v-btn-toggle"), _ = n("v-chip"), g = n("v-alert"), a = n("v-progress-linear"), L = n("v-tooltip"), y = n("v-table"), Z = n("v-card-text"), te = n("v-card");
      return r(), H("div", null, [
        d("div", Ke, [
          V[6] || (V[6] = d("h1", { class: "text-h4" }, "Dashboard", -1)),
          e(F),
          e(P, {
            modelValue: I.value,
            "onUpdate:modelValue": V[0] || (V[0] = (B) => I.value = B),
            "prepend-inner-icon": "mdi-magnify",
            label: "Filter projects or tools",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field",
            clearable: ""
          }, null, 8, ["modelValue"]),
          e(E, {
            modelValue: S.value,
            "onUpdate:modelValue": V[1] || (V[1] = (B) => S.value = B),
            mandatory: "",
            density: "compact",
            color: "primary"
          }, {
            default: t(() => [
              e(D, {
                value: "sm",
                title: "Small tiles"
              }, {
                default: t(() => [
                  e(j, null, {
                    default: t(() => [...V[2] || (V[2] = [
                      l("mdi-view-comfy", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(D, {
                value: "md",
                title: "Medium tiles"
              }, {
                default: t(() => [
                  e(j, null, {
                    default: t(() => [...V[3] || (V[3] = [
                      l("mdi-view-grid", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(D, {
                value: "lg",
                title: "List"
              }, {
                default: t(() => [
                  e(j, null, {
                    default: t(() => [...V[4] || (V[4] = [
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
          e(D, {
            variant: "outlined",
            "prepend-icon": "mdi-folder-multiple",
            to: "/home/project"
          }, {
            default: t(() => [...V[5] || (V[5] = [
              l(" All projects ", -1)
            ])]),
            _: 1
          })
        ]),
        m.value.length ? (r(), H("div", Qe, [
          (r(!0), H(ve, null, ye(m.value, (B) => (r(), R(_, {
            key: B.id,
            color: x.value === B.id ? "primary" : void 0,
            variant: x.value === B.id ? "elevated" : "tonal",
            size: "small",
            onClick: (N) => x.value = x.value === B.id ? null : B.id
          }, {
            default: t(() => [
              e(j, {
                start: "",
                size: "small"
              }, {
                default: t(() => [
                  l(w(B.icon), 1)
                ]),
                _: 2
              }, 1024),
              l(" " + w(B.label) + " ", 1),
              d("span", Ze, w(B.count), 1)
            ]),
            _: 2
          }, 1032, ["color", "variant", "onClick"]))), 128))
        ])) : W("", !0),
        z.value ? (r(), R(g, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(z.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        A.value ? (r(), R(a, {
          key: 2,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : W("", !0),
        !A.value && C.value.length === 0 && !z.value ? (r(), R(g, {
          key: 3,
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...V[7] || (V[7] = [
            l(" No projects match the current filter. ", -1)
          ])]),
          _: 1
        })) : W("", !0),
        d("div", {
          class: qe(["tile-grid", `size-${S.value}`])
        }, [
          (r(!0), H(ve, null, ye(C.value, (B) => (r(), R(te, {
            key: B.id,
            class: "tile",
            hover: "",
            to: `/home/project/${B.id}`
          }, {
            default: t(() => [
              e(Z, { class: "pa-3" }, {
                default: t(() => [
                  d("div", et, [
                    d("div", tt, [
                      d("div", lt, w(B.name), 1),
                      d("div", nt, w(B.pkey), 1)
                    ]),
                    e(_, {
                      size: "x-small",
                      variant: "tonal"
                    }, {
                      default: t(() => [
                        l(w(B.subscriptions.length), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  S.value !== "lg" ? (r(), H("div", at, [
                    (r(!0), H(ve, null, ye(B.subscriptions.slice(0, S.value === "sm" ? 4 : 8), (N) => {
                      var k, se, oe, X;
                      return r(), R(L, {
                        key: N.id,
                        text: `${((se = (k = N.node) == null ? void 0 : k.refined) == null ? void 0 : se.name) || "—"} → ${((oe = N.node) == null ? void 0 : oe.name) || ((X = N.node) == null ? void 0 : X.id)}`,
                        location: "top"
                      }, {
                        activator: t(({ props: v }) => [
                          e(j, Me({ ref_for: !0 }, v, {
                            size: "small",
                            color: T(N),
                            class: "mr-1"
                          }), {
                            default: t(() => [
                              l(w(O(N)), 1)
                            ]),
                            _: 2
                          }, 1040, ["color"])
                        ]),
                        _: 2
                      }, 1032, ["text"]);
                    }), 128)),
                    B.subscriptions.length > (S.value === "sm" ? 4 : 8) ? (r(), H("span", ot, " +" + w(B.subscriptions.length - (S.value === "sm" ? 4 : 8)), 1)) : W("", !0)
                  ])) : (r(), R(y, {
                    key: 1,
                    density: "compact",
                    class: "mt-2",
                    style: { background: "transparent" }
                  }, {
                    default: t(() => [
                      d("tbody", null, [
                        (r(!0), H(ve, null, ye(B.subscriptions, (N) => {
                          var k, se, oe, X;
                          return r(), H("tr", {
                            key: N.id
                          }, [
                            d("td", st, [
                              e(j, {
                                size: "small",
                                color: T(N)
                              }, {
                                default: t(() => [
                                  l(w(O(N)), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            d("td", it, w(((se = (k = N.node) == null ? void 0 : k.refined) == null ? void 0 : se.name) || "—"), 1),
                            d("td", rt, w(((oe = N.node) == null ? void 0 : oe.name) || ((X = N.node) == null ? void 0 : X.id)), 1)
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
}, dt = /* @__PURE__ */ we(ut, [["__scopeId", "data-v-3f6316a9"]]);
function xl(o) {
  if (!o || typeof o != "object") return o;
  for (const h of Object.keys(o)) {
    const U = o[h];
    (U == null || U === "" || U === !1) && delete o[h];
  }
  return o;
}
function hl(o) {
  return typeof o != "string" ? "" : o.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Vl(o) {
  return typeof o != "string" ? "" : o.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function ct(o) {
  if (!o) return "??";
  if (o.firstName && o.lastName)
    return o.firstName.charAt(0) + o.lastName.charAt(0);
  if (o.fullName) {
    const U = o.fullName.split(" ");
    return U.length === 1 ? o.fullName.charAt(0) + (o.fullName.length >= 2 ? o.fullName.charAt(1) : "") : U[0].charAt(0) + U[U.length - 1].charAt(0);
  }
  const h = (o.id || o || "??").toString();
  return (h.length === 1 ? h + h : h).slice(0, 2);
}
function Te(o) {
  if (!o) return "";
  if (o.fullName) return o.fullName;
  if (o.firstName && o.lastName) return `${o.firstName} ${o.lastName}`;
  if (o.firstName) return `${o.firstName} ${(o.id || "").substring(1)}`;
  if (o.lastName) return `${Ve((o.id || "").charAt(0))}. ${o.lastName}`;
  const h = (o.id || o || "??").toString();
  return `${Ve(h.charAt(0))}. ${Ve(h.substring(1))}`;
}
function Ve(o) {
  return o && o.charAt(0).toUpperCase() + o.slice(1);
}
function Cl(o) {
  if (!o) return null;
  const h = o.split(":");
  return h.length > 2 ? h.slice(0, 3).join("-") : null;
}
function $l(o) {
  if (!o) return null;
  const h = o.split(":");
  return h.length > 1 ? h.slice(0, 2).join("-") : null;
}
function Sl(o) {
  return (o || "").split(":")[1] || null;
}
function jl(o) {
  return (o || "").split(":")[2] || null;
}
function Ul(o) {
  if (!o) return [];
  const h = o.split(":"), U = [];
  for (let A = 2; A <= h.length; A++)
    U.push(h.slice(0, A).join("-"));
  return U;
}
function mt(o) {
  return o ? (o.service || (o.service = o.refined && mt(o.refined) || o), o.service) : null;
}
function pt(o) {
  return o ? o.tool ? o.tool : o.refined ? (o.tool = o.refined.refined ? pt(o.refined) : o, o.tool) : null : null;
}
const vt = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function ft(o) {
  return o ? o.replace(/[-[()\]${},;_:]/g, " ").replace(vt, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const Pl = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, _t = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, gt = { class: "text-caption" }, yt = {
  key: 1,
  class: "text-disabled"
}, bt = { class: "mb-4" }, kt = {
  __name: "ProjectListView",
  setup(o) {
    const h = Ce(), U = be(), A = me(), { t: z } = He(), i = Ae("project", { defaultSort: "name" }), I = s(25);
    let x = null, S = {};
    const b = s(null), m = s(!1), C = s(null), $ = s({ name: "", pkey: "", teamLeader: "", description: "" }), O = s(!1), T = s(!1), f = s(null), u = s(!1), V = s(!1);
    let F = "";
    const P = pe(() => [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Description", key: "description", sortable: !1 },
      { title: "Manager", key: "teamLeader", sortable: !1, width: "220px" },
      { title: "Created", key: "createdDate", sortable: !0, width: "140px" },
      { title: "Subs", key: "nbSubscriptions", sortable: !1, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ]), j = {
      required: (N) => !!N || "Required",
      pkey: (N) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(N || "") || "Use lowercase letters, digits, dash"
    };
    function D(N) {
      if (!N) return "";
      const k = typeof N == "number" ? new Date(N) : new Date(N);
      return isNaN(k.getTime()) ? "" : k.toISOString().slice(0, 10);
    }
    function E(N) {
      S = N, i.load(N);
    }
    function _() {
      clearTimeout(x), x = setTimeout(
        () => i.load({ page: 1, itemsPerPage: I.value, sortBy: S.sortBy }),
        300
      );
    }
    function g(N) {
      const k = ft(N || "").split(" ").filter(Boolean);
      return k.length ? k.join("-") : "";
    }
    function a() {
      var k;
      if (((k = C.value) == null ? void 0 : k.nbSubscriptions) > 0) return;
      const N = g($.value.name);
      (!$.value.pkey || $.value.pkey === F) && ($.value.pkey = N, F = N);
    }
    function L() {
      C.value = null, $.value = { name: "", pkey: "", teamLeader: "", description: "" }, F = "", m.value = !0;
    }
    function y(N) {
      var k;
      C.value = N, $.value = {
        name: N.name || "",
        pkey: N.pkey || "",
        teamLeader: ((k = N.teamLeader) == null ? void 0 : k.id) || "",
        description: N.description || ""
      }, F = N.pkey || "", m.value = !0;
    }
    function Z(N) {
      f.value = N, V.value = !1, T.value = !0;
    }
    async function te() {
      var X, v, J;
      const { valid: N } = await b.value.validate();
      if (!N) return;
      if (i.demoMode.value) {
        m.value = !1;
        return;
      }
      O.value = !0;
      const k = {
        id: (X = C.value) == null ? void 0 : X.id,
        name: $.value.name,
        pkey: $.value.pkey,
        teamLeader: $.value.teamLeader,
        description: $.value.description
      }, se = (v = C.value) != null && v.id ? "put" : "post", oe = await U[se]("rest/project", k);
      O.value = !1, oe !== null && (m.value = !1, !((J = C.value) != null && J.id) && typeof oe != "object" ? h.push(`/home/project/${oe}`) : i.load(S));
    }
    async function B() {
      if (i.demoMode.value) {
        T.value = !1;
        return;
      }
      u.value = !0;
      const N = V.value ? "?deleteRemoteData=true" : "";
      await U.del(`rest/project/${f.value.id}${N}`), u.value = !1, T.value = !1, i.load(S);
    }
    return ce(() => {
      A.setTitle("Projects"), A.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), (N, k) => {
      const se = n("v-spacer"), oe = n("v-text-field"), X = n("v-btn"), v = n("v-alert"), J = n("v-skeleton-loader"), K = n("v-avatar"), G = n("v-chip"), ne = n("v-icon"), ue = n("v-data-table-server"), q = n("v-card-title"), le = n("v-textarea"), de = n("v-form"), ke = n("v-card-text"), p = n("v-card-actions"), c = n("v-card"), Y = n("v-dialog"), ie = n("v-checkbox");
      return r(), H("div", null, [
        d("div", _t, [
          k[13] || (k[13] = d("h1", { class: "text-h4" }, "Projects", -1)),
          e(se),
          e(oe, {
            modelValue: ae(i).search.value,
            "onUpdate:modelValue": [
              k[0] || (k[0] = (ee) => ae(i).search.value = ee),
              _
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(X, {
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
        ae(i).error.value ? (r(), R(v, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(ae(i).error.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        ae(i).demoMode.value ? (r(), R(v, {
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
        })) : W("", !0),
        ae(i).loading.value && ae(i).items.value.length === 0 ? (r(), R(J, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : W("", !0),
        ae(i).error.value ? W("", !0) : Oe((r(), R(ue, {
          key: 3,
          "items-per-page": I.value,
          "onUpdate:itemsPerPage": k[1] || (k[1] = (ee) => I.value = ee),
          headers: P.value,
          items: ae(i).items.value,
          "items-length": ae(i).totalItems.value,
          loading: ae(i).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": E,
          "onClick:row": k[2] || (k[2] = (ee, { item: Q }) => ae(h).push(`/home/project/${Q.id}`))
        }, {
          "item.teamLeader": t(({ item: ee }) => {
            var Q;
            return [
              (Q = ee.teamLeader) != null && Q.id ? (r(), H(ve, { key: 0 }, [
                e(K, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: t(() => [
                    d("span", gt, w(ae(ct)(ee.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                l(" " + w(ae(Te)(ee.teamLeader)), 1)
              ], 64)) : (r(), H("span", yt, "—"))
            ];
          }),
          "item.createdDate": t(({ item: ee }) => [
            l(w(D(ee.createdDate)), 1)
          ]),
          "item.nbSubscriptions": t(({ item: ee }) => [
            e(G, {
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(w(ee.nbSubscriptions || 0), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          "item.actions": t(({ item: ee }) => [
            e(X, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: xe((Q) => y(ee), ["stop"])
            }, {
              default: t(() => [
                e(ne, { size: "small" }, {
                  default: t(() => [...k[15] || (k[15] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(X, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: xe((Q) => Z(ee), ["stop"])
            }, {
              default: t(() => [
                e(ne, { size: "small" }, {
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
          [Fe, ae(i).items.value.length > 0 || !ae(i).loading.value]
        ]),
        e(Y, {
          modelValue: m.value,
          "onUpdate:modelValue": k[8] || (k[8] = (ee) => m.value = ee),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(c, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => {
                    var ee;
                    return [
                      l(w((ee = C.value) != null && ee.id ? "Edit project" : "New project"), 1)
                    ];
                  }),
                  _: 1
                }),
                e(ke, null, {
                  default: t(() => [
                    e(de, {
                      ref_key: "formRef",
                      ref: b,
                      onSubmit: xe(te, ["prevent"])
                    }, {
                      default: t(() => {
                        var ee, Q;
                        return [
                          e(oe, {
                            modelValue: $.value.name,
                            "onUpdate:modelValue": [
                              k[3] || (k[3] = (fe) => $.value.name = fe),
                              a
                            ],
                            label: "Name",
                            rules: [j.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          e(oe, {
                            modelValue: $.value.pkey,
                            "onUpdate:modelValue": k[4] || (k[4] = (fe) => $.value.pkey = fe),
                            label: "Project key (pkey)",
                            rules: [j.required, j.pkey],
                            disabled: ((ee = C.value) == null ? void 0 : ee.nbSubscriptions) > 0,
                            hint: ((Q = C.value) == null ? void 0 : Q.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          e(oe, {
                            modelValue: $.value.teamLeader,
                            "onUpdate:modelValue": k[5] || (k[5] = (fe) => $.value.teamLeader = fe),
                            label: "Team leader (user id)",
                            rules: [j.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(le, {
                            modelValue: $.value.description,
                            "onUpdate:modelValue": k[6] || (k[6] = (fe) => $.value.description = fe),
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
                e(p, null, {
                  default: t(() => [
                    e(se),
                    e(X, {
                      variant: "text",
                      onClick: k[7] || (k[7] = (ee) => m.value = !1)
                    }, {
                      default: t(() => [...k[17] || (k[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(X, {
                      color: "primary",
                      variant: "elevated",
                      loading: O.value,
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
          modelValue: T.value,
          "onUpdate:modelValue": k[11] || (k[11] = (ee) => T.value = ee),
          "max-width": "500"
        }, {
          default: t(() => [
            e(c, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...k[19] || (k[19] = [
                    l("Delete project", -1)
                  ])]),
                  _: 1
                }),
                e(ke, null, {
                  default: t(() => {
                    var ee;
                    return [
                      d("p", bt, [
                        k[20] || (k[20] = l(" Are you sure you want to delete ", -1)),
                        d("strong", null, w((ee = f.value) == null ? void 0 : ee.name), 1),
                        k[21] || (k[21] = l("? ", -1))
                      ]),
                      e(ie, {
                        modelValue: V.value,
                        "onUpdate:modelValue": k[9] || (k[9] = (Q) => V.value = Q),
                        label: "Also remove remote data associated with this project's subscriptions",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(p, null, {
                  default: t(() => [
                    e(se),
                    e(X, {
                      variant: "text",
                      onClick: k[10] || (k[10] = (ee) => T.value = !1)
                    }, {
                      default: t(() => [...k[22] || (k[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(X, {
                      color: "error",
                      variant: "elevated",
                      loading: u.value,
                      onClick: B
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
}, wt = /* @__PURE__ */ we(kt, [["__scopeId", "data-v-6023d08b"]]), xt = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, ht = { class: "text-h4" }, Vt = { class: "text-h6 text-medium-emphasis" }, Ct = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, $t = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, St = { key: 0 }, jt = {
  key: 0,
  class: "ml-1"
}, Ut = { key: 1 }, Pt = {
  key: 0,
  class: "ml-1"
}, At = { key: 2 }, Nt = {
  key: 0,
  class: "ml-1"
}, zt = { class: "d-flex align-center mb-2" }, It = { class: "mb-3" }, Tt = {
  __name: "ProjectDetailView",
  setup(o) {
    const h = ze();
    Ce();
    const U = be(), A = me();
    We();
    const z = s(!1), i = s(null), I = pe(() => {
      var g;
      return ((g = i.value) == null ? void 0 : g.subscriptions) || [];
    }), x = s(null), S = s(!1), b = s({ name: "", pkey: "", teamLeader: "", description: "" }), m = s(!1), C = s(!1), $ = s(null), O = s(!1), T = s(!1), f = {
      required: (g) => !!g || "Required"
    }, u = [
      { title: "Service", key: "service", sortable: !1, width: "180px" },
      { title: "Tool", key: "tool", sortable: !1, width: "180px" },
      { title: "Node", key: "node", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function V(g) {
      if (!g) return "";
      const a = new Date(g);
      return isNaN(a.getTime()) ? "" : a.toISOString().slice(0, 16).replace("T", " ");
    }
    function F(g) {
      var Z, te, B;
      const a = ((B = (te = (Z = g.node) == null ? void 0 : Z.refined) == null ? void 0 : te.refined) == null ? void 0 : B.id) || "", L = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let y = 0;
      for (const N of a) y += N.charCodeAt(0);
      return L[y % L.length];
    }
    function P(g) {
      var L, y, Z;
      const a = ((Z = (y = (L = g.node) == null ? void 0 : L.refined) == null ? void 0 : y.refined) == null ? void 0 : Z.id) || "";
      return a.includes(":scm:") ? "mdi-source-branch" : a.includes(":build:") ? "mdi-hammer-wrench" : a.includes(":bt") ? "mdi-bug" : a.includes(":km:") ? "mdi-book-open-variant" : a.includes(":vm") ? "mdi-server" : a.includes(":prov") ? "mdi-cloud" : a.includes(":id") ? "mdi-account-group" : a.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function j() {
      var L;
      z.value = !0;
      const g = h.params.id, a = await U.get(`rest/project/${g}`);
      i.value = a || null, z.value = !1, a && (b.value = {
        name: a.name || "",
        pkey: a.pkey || "",
        teamLeader: ((L = a.teamLeader) == null ? void 0 : L.id) || "",
        description: a.description || ""
      }, A.setTitle(a.name), A.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        { title: a.name }
      ]));
    }
    async function D() {
      const { valid: g } = await x.value.validate();
      if (!g) return;
      m.value = !0;
      const a = {
        id: i.value.id,
        name: b.value.name,
        pkey: b.value.pkey,
        teamLeader: b.value.teamLeader,
        description: b.value.description
      };
      await U.put("rest/project", a), m.value = !1, S.value = !1, await j();
    }
    function E(g) {
      $.value = g, O.value = !1, C.value = !0;
    }
    async function _() {
      T.value = !0, await U.del(`rest/subscription/${$.value.id}/${O.value ? "true" : "false"}`), T.value = !1, C.value = !1, await j();
    }
    return Pe(() => h.params.id, (g) => {
      g && j();
    }), ce(j), (g, a) => {
      const L = n("v-skeleton-loader"), y = n("v-spacer"), Z = n("v-btn"), te = n("v-icon"), B = n("v-card-text"), N = n("v-card"), k = n("v-chip"), se = n("v-alert"), oe = n("v-data-table"), X = n("v-card-title"), v = n("v-text-field"), J = n("v-textarea"), K = n("v-form"), G = n("v-card-actions"), ne = n("v-dialog"), ue = n("v-checkbox");
      return r(), H("div", null, [
        z.value && !i.value ? (r(), R(L, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : W("", !0),
        i.value ? (r(), H(ve, { key: 1 }, [
          d("div", xt, [
            d("div", null, [
              d("h1", ht, [
                l(w(i.value.name) + " ", 1),
                d("span", Vt, "(" + w(i.value.pkey) + ")", 1)
              ]),
              i.value.description ? (r(), H("p", Ct, w(i.value.description), 1)) : W("", !0)
            ]),
            e(y),
            i.value.manageSubscriptions ? (r(), R(Z, {
              key: 0,
              color: "primary",
              "prepend-icon": "mdi-plus",
              to: `/home/project/${i.value.id}/subscription`
            }, {
              default: t(() => [...a[10] || (a[10] = [
                l(" Add subscription ", -1)
              ])]),
              _: 1
            }, 8, ["to"])) : W("", !0),
            e(Z, {
              variant: "outlined",
              "prepend-icon": "mdi-pencil",
              onClick: a[0] || (a[0] = (q) => S.value = !0)
            }, {
              default: t(() => [...a[11] || (a[11] = [
                l(" Edit ", -1)
              ])]),
              _: 1
            })
          ]),
          e(N, {
            variant: "tonal",
            class: "mb-4"
          }, {
            default: t(() => [
              e(B, { class: "py-2" }, {
                default: t(() => [
                  d("div", $t, [
                    i.value.teamLeader ? (r(), H("span", St, [
                      e(te, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[12] || (a[12] = [
                          l("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      a[13] || (a[13] = d("strong", null, "Manager:", -1)),
                      l(" " + w(ae(Te)(i.value.teamLeader)) + " ", 1),
                      i.value.teamLeader.id ? (r(), H("span", jt, "(" + w(i.value.teamLeader.id) + ")", 1)) : W("", !0)
                    ])) : W("", !0),
                    i.value.createdDate ? (r(), H("span", Ut, [
                      e(te, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[14] || (a[14] = [
                          l("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      a[15] || (a[15] = d("strong", null, "Created:", -1)),
                      l(" " + w(V(i.value.createdDate)) + " ", 1),
                      i.value.createdBy ? (r(), H("span", Pt, " by " + w(i.value.createdBy.id || i.value.createdBy), 1)) : W("", !0)
                    ])) : W("", !0),
                    i.value.lastModifiedDate ? (r(), H("span", At, [
                      e(te, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[16] || (a[16] = [
                          l("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      a[17] || (a[17] = d("strong", null, "Updated:", -1)),
                      l(" " + w(V(i.value.lastModifiedDate)) + " ", 1),
                      i.value.lastModifiedBy ? (r(), H("span", Nt, " by " + w(i.value.lastModifiedBy.id || i.value.lastModifiedBy), 1)) : W("", !0)
                    ])) : W("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          d("div", zt, [
            a[18] || (a[18] = d("h2", { class: "text-h6" }, "Subscriptions", -1)),
            e(k, {
              class: "ml-2",
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(w(I.value.length), 1)
              ]),
              _: 1
            })
          ]),
          I.value.length === 0 ? (r(), R(se, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: t(() => [...a[19] || (a[19] = [
              l(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (r(), R(oe, {
            key: 1,
            headers: u,
            items: I.value,
            "item-value": "id",
            "items-per-page": -1,
            "hide-default-footer": "",
            density: "compact"
          }, {
            "item.service": t(({ item: q }) => [
              e(k, {
                size: "small",
                variant: "tonal",
                color: F(q)
              }, {
                default: t(() => {
                  var le, de, ke;
                  return [
                    e(te, {
                      start: "",
                      size: "small"
                    }, {
                      default: t(() => [
                        l(w(P(q)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    l(" " + w(((ke = (de = (le = q.node) == null ? void 0 : le.refined) == null ? void 0 : de.refined) == null ? void 0 : ke.name) || "—"), 1)
                  ];
                }),
                _: 2
              }, 1032, ["color"])
            ]),
            "item.tool": t(({ item: q }) => {
              var le, de;
              return [
                l(w(((de = (le = q.node) == null ? void 0 : le.refined) == null ? void 0 : de.name) || "—"), 1)
              ];
            }),
            "item.node": t(({ item: q }) => {
              var le;
              return [
                d("code", null, w((le = q.node) == null ? void 0 : le.id), 1)
              ];
            }),
            "item.actions": t(({ item: q }) => [
              i.value.manageSubscriptions ? (r(), R(Z, {
                key: 0,
                icon: "",
                size: "small",
                variant: "text",
                color: "error",
                onClick: (le) => E(q),
                title: "Unsubscribe"
              }, {
                default: t(() => [
                  e(te, { size: "small" }, {
                    default: t(() => [...a[20] || (a[20] = [
                      l("mdi-close", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["onClick"])) : W("", !0)
            ]),
            _: 1
          }, 8, ["items"]))
        ], 64)) : W("", !0),
        e(ne, {
          modelValue: S.value,
          "onUpdate:modelValue": a[6] || (a[6] = (q) => S.value = q),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(N, null, {
              default: t(() => [
                e(X, null, {
                  default: t(() => [...a[21] || (a[21] = [
                    l("Edit project", -1)
                  ])]),
                  _: 1
                }),
                e(B, null, {
                  default: t(() => [
                    e(K, {
                      ref_key: "formRef",
                      ref: x,
                      onSubmit: xe(D, ["prevent"])
                    }, {
                      default: t(() => {
                        var q;
                        return [
                          e(v, {
                            modelValue: b.value.name,
                            "onUpdate:modelValue": a[1] || (a[1] = (le) => b.value.name = le),
                            label: "Name",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(v, {
                            modelValue: b.value.pkey,
                            "onUpdate:modelValue": a[2] || (a[2] = (le) => b.value.pkey = le),
                            label: "Project key (pkey)",
                            rules: [f.required],
                            disabled: (((q = i.value) == null ? void 0 : q.nbSubscriptions) || I.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          e(v, {
                            modelValue: b.value.teamLeader,
                            "onUpdate:modelValue": a[3] || (a[3] = (le) => b.value.teamLeader = le),
                            label: "Team leader (user id)",
                            rules: [f.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(J, {
                            modelValue: b.value.description,
                            "onUpdate:modelValue": a[4] || (a[4] = (le) => b.value.description = le),
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
                e(G, null, {
                  default: t(() => [
                    e(y),
                    e(Z, {
                      variant: "text",
                      onClick: a[5] || (a[5] = (q) => S.value = !1)
                    }, {
                      default: t(() => [...a[22] || (a[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Z, {
                      color: "primary",
                      variant: "elevated",
                      loading: m.value,
                      onClick: D
                    }, {
                      default: t(() => [...a[23] || (a[23] = [
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
        e(ne, {
          modelValue: C.value,
          "onUpdate:modelValue": a[9] || (a[9] = (q) => C.value = q),
          "max-width": "480"
        }, {
          default: t(() => [
            e(N, null, {
              default: t(() => [
                e(X, null, {
                  default: t(() => [...a[24] || (a[24] = [
                    l("Unsubscribe", -1)
                  ])]),
                  _: 1
                }),
                e(B, null, {
                  default: t(() => {
                    var q, le;
                    return [
                      d("p", It, [
                        a[25] || (a[25] = l(" Remove subscription to ", -1)),
                        d("strong", null, w((le = (q = $.value) == null ? void 0 : q.node) == null ? void 0 : le.name), 1),
                        a[26] || (a[26] = l("? ", -1))
                      ]),
                      e(ue, {
                        modelValue: O.value,
                        "onUpdate:modelValue": a[7] || (a[7] = (de) => O.value = de),
                        label: "Also delete remote data on the target service",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(G, null, {
                  default: t(() => [
                    e(y),
                    e(Z, {
                      variant: "text",
                      onClick: a[8] || (a[8] = (q) => C.value = !1)
                    }, {
                      default: t(() => [...a[27] || (a[27] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Z, {
                      color: "error",
                      variant: "elevated",
                      loading: T.value,
                      onClick: _
                    }, {
                      default: t(() => [...a[28] || (a[28] = [
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
}, Dt = { class: "mb-3" }, Lt = { class: "code-sample" }, Rt = {
  __name: "ManualView",
  setup(o) {
    const h = me(), U = Ne(), A = "/", z = typeof window < "u" ? window.location.origin : "", i = pe(() => U.userName || "<you>");
    return ce(() => {
      h.setTitle("Manual"), h.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (I, x) => {
      const S = n("v-icon"), b = n("v-card-title"), m = n("v-card-text"), C = n("v-card"), $ = n("v-list-item"), O = n("v-list"), T = n("v-col"), f = n("router-link");
      n("v-code-block");
      const u = n("v-row");
      return r(), H("div", null, [
        x[12] || (x[12] = d("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        e(u, null, {
          default: t(() => [
            e(T, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(C, {
                  variant: "tonal",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(b, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(S, null, {
                          default: t(() => [...x[0] || (x[0] = [
                            l("mdi-book-open-page-variant", -1)
                          ])]),
                          _: 1
                        }),
                        x[1] || (x[1] = l(" Getting started ", -1))
                      ]),
                      _: 1
                    }),
                    e(m, null, {
                      default: t(() => [...x[2] || (x[2] = [
                        d("p", { class: "mb-2" }, " Ligoj aggregates the tools your projects rely on (source control, bug tracking, continuous integration, knowledge base, cloud provisioning) behind a single dashboard and API. ", -1),
                        d("p", { class: "mb-0" }, " Create a project, attach subscriptions, and hand your team a single entry point for everything. ", -1)
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
                    e(O, {
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
            e(T, {
              cols: "12",
              md: "6"
            }, {
              default: t(() => [
                e(C, {
                  variant: "outlined",
                  class: "mb-4"
                }, {
                  default: t(() => [
                    e(b, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(S, null, {
                          default: t(() => [...x[3] || (x[3] = [
                            l("mdi-api", -1)
                          ])]),
                          _: 1
                        }),
                        x[4] || (x[4] = l(" Automation ", -1))
                      ]),
                      _: 1
                    }),
                    e(m, null, {
                      default: t(() => [
                        d("p", Dt, [
                          x[7] || (x[7] = l(" Every screen is backed by a REST endpoint. Browse the full catalogue on the ", -1)),
                          e(f, { to: "/api" }, {
                            default: t(() => [...x[5] || (x[5] = [
                              l("API reference page", -1)
                            ])]),
                            _: 1
                          }),
                          x[8] || (x[8] = l(" (OpenAPI / Swagger UI), and generate an ", -1)),
                          e(f, { to: "/api/token" }, {
                            default: t(() => [...x[6] || (x[6] = [
                              l("API token", -1)
                            ])]),
                            _: 1
                          }),
                          x[9] || (x[9] = l(" to call it from scripts without exposing your password. ", -1))
                        ]),
                        W("", !0),
                        d("pre", Lt, 'curl "' + w(ae(z)) + w(ae(A)) + "rest/project?api-key=<token>&api-user=" + w(i.value) + '"', 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                e(C, { variant: "outlined" }, {
                  default: t(() => [
                    e(b, { class: "d-flex align-center ga-2" }, {
                      default: t(() => [
                        e(S, null, {
                          default: t(() => [...x[10] || (x[10] = [
                            l("mdi-help-circle", -1)
                          ])]),
                          _: 1
                        }),
                        x[11] || (x[11] = l(" More resources ", -1))
                      ]),
                      _: 1
                    }),
                    e(O, {
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
}, Et = /* @__PURE__ */ we(Rt, [["__scopeId", "data-v-bfb1a017"]]), Bt = { class: "pa-4" }, qt = {
  __name: "SystemView",
  setup(o) {
    const h = me(), U = [
      { to: "/system/user", icon: "mdi-account-multiple", title: "Users", subtitle: "Active sessions and accounts" },
      { to: "/system/role", icon: "mdi-shield-account", title: "Roles", subtitle: "Authorization rules" },
      { to: "/system/plugin", icon: "mdi-puzzle", title: "Plugins", subtitle: "Installed feature plugins" },
      { to: "/system/node", icon: "mdi-server", title: "Nodes", subtitle: "Service & tool registrations" },
      { to: "/system/cache", icon: "mdi-database-refresh", title: "Cache", subtitle: "Invalidate application caches" },
      { to: "/system/bench", icon: "mdi-speedometer", title: "Bench", subtitle: "Diagnostics" }
    ];
    return ce(() => {
      h.setTitle("System"), h.setBreadcrumbs([{ title: "System" }]);
    }), (A, z) => {
      const i = n("v-list-item"), I = n("v-list");
      return r(), H("div", Bt, [
        z[0] || (z[0] = d("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        e(I, null, {
          default: t(() => [
            (r(), H(ve, null, ye(U, (x) => e(i, {
              key: x.to,
              to: x.to,
              "prepend-icon": x.icon,
              title: x.title,
              subtitle: x.subtitle
            }, null, 8, ["to", "prepend-icon", "title", "subtitle"])), 64))
          ]),
          _: 1
        })
      ]);
    };
  }
}, Mt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, Ot = {
  __name: "SystemUserView",
  setup(o) {
    const h = be(), U = me(), A = Ae("system/user/roles", { defaultSort: "login" }), z = s(25);
    let i = null, I = {};
    const x = s([]), S = s(null), b = s(!1), m = s(null), C = s({ login: "", roles: [] }), $ = s(!1), O = s(!1), T = s(null), f = s(!1), u = {
      required: (L) => !!L || "Required",
      requiredArray: (L) => Array.isArray(L) && L.length > 0 || "Pick at least one role"
    }, V = [
      { title: "Login", key: "login", sortable: !0, width: "220px" },
      { title: "Roles", key: "roles", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    function F(L) {
      I = L, A.load(L);
    }
    function P() {
      clearTimeout(i), i = setTimeout(
        () => A.load({ page: 1, itemsPerPage: z.value, sortBy: I.sortBy }),
        300
      );
    }
    async function j() {
      const L = await h.get("rest/system/security/role");
      Array.isArray(L) ? x.value = L : Array.isArray(L == null ? void 0 : L.data) && (x.value = L.data);
    }
    function D() {
      m.value = null, C.value = { login: "", roles: [] }, b.value = !0;
    }
    function E(L) {
      m.value = L, C.value = {
        login: L.login,
        roles: (L.roles || []).map((y) => y.id)
      }, b.value = !0;
    }
    function _(L) {
      T.value = L, O.value = !0;
    }
    async function g() {
      const { valid: L } = await S.value.validate();
      if (!L) return;
      $.value = !0;
      const y = { login: C.value.login, roles: C.value.roles }, Z = m.value ? "put" : "post";
      await h[Z]("rest/system/user", y), $.value = !1, b.value = !1, A.load(I);
    }
    async function a() {
      f.value = !0, await h.del(`rest/system/user/${encodeURIComponent(T.value.login)}`), f.value = !1, O.value = !1, A.load(I);
    }
    return ce(() => {
      U.setTitle("System users"), U.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]), j();
    }), (L, y) => {
      const Z = n("v-spacer"), te = n("v-text-field"), B = n("v-btn"), N = n("v-alert"), k = n("v-chip"), se = n("v-icon"), oe = n("v-data-table-server"), X = n("v-card-title"), v = n("v-autocomplete"), J = n("v-form"), K = n("v-card-text"), G = n("v-card-actions"), ne = n("v-card"), ue = n("v-dialog");
      return r(), H("div", null, [
        d("div", Mt, [
          y[9] || (y[9] = d("h1", { class: "text-h4" }, "System users", -1)),
          e(Z),
          e(te, {
            modelValue: ae(A).search.value,
            "onUpdate:modelValue": [
              y[0] || (y[0] = (q) => ae(A).search.value = q),
              P
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
            onClick: D
          }, {
            default: t(() => [...y[8] || (y[8] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        ae(A).error.value ? (r(), R(N, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(ae(A).error.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        e(oe, {
          headers: V,
          items: ae(A).items.value,
          "items-length": ae(A).totalItems.value,
          loading: ae(A).loading.value,
          "items-per-page": z.value,
          "onUpdate:itemsPerPage": y[1] || (y[1] = (q) => z.value = q),
          "item-value": "login",
          hover: "",
          "onUpdate:options": F
        }, {
          "item.roles": t(({ item: q }) => [
            (r(!0), H(ve, null, ye(q.roles || [], (le) => (r(), R(k, {
              key: le.id,
              size: "x-small",
              variant: "tonal",
              class: "mr-1"
            }, {
              default: t(() => [
                l(w(le.name), 1)
              ]),
              _: 2
            }, 1024))), 128))
          ]),
          "item.actions": t(({ item: q }) => [
            e(B, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (le) => E(q)
            }, {
              default: t(() => [
                e(se, { size: "small" }, {
                  default: t(() => [...y[10] || (y[10] = [
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
              onClick: (le) => _(q)
            }, {
              default: t(() => [
                e(se, { size: "small" }, {
                  default: t(() => [...y[11] || (y[11] = [
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
        e(ue, {
          modelValue: b.value,
          "onUpdate:modelValue": y[5] || (y[5] = (q) => b.value = q),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(ne, null, {
              default: t(() => [
                e(X, null, {
                  default: t(() => [
                    l(w(m.value ? "Edit system user" : "New system user"), 1)
                  ]),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => [
                    e(J, {
                      ref_key: "formRef",
                      ref: S,
                      onSubmit: xe(g, ["prevent"])
                    }, {
                      default: t(() => [
                        e(te, {
                          modelValue: C.value.login,
                          "onUpdate:modelValue": y[2] || (y[2] = (q) => C.value.login = q),
                          label: "Login",
                          rules: [u.required],
                          disabled: !!m.value,
                          variant: "outlined",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules", "disabled"]),
                        e(v, {
                          modelValue: C.value.roles,
                          "onUpdate:modelValue": y[3] || (y[3] = (q) => C.value.roles = q),
                          label: "Roles",
                          items: x.value,
                          "item-value": "id",
                          "item-title": "name",
                          multiple: "",
                          chips: "",
                          "closable-chips": "",
                          variant: "outlined",
                          rules: [u.requiredArray]
                        }, null, 8, ["modelValue", "items", "rules"])
                      ]),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(G, null, {
                  default: t(() => [
                    e(Z),
                    e(B, {
                      variant: "text",
                      onClick: y[4] || (y[4] = (q) => b.value = !1)
                    }, {
                      default: t(() => [...y[12] || (y[12] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(B, {
                      color: "primary",
                      variant: "elevated",
                      loading: $.value,
                      onClick: g
                    }, {
                      default: t(() => [...y[13] || (y[13] = [
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
        e(ue, {
          modelValue: O.value,
          "onUpdate:modelValue": y[7] || (y[7] = (q) => O.value = q),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ne, null, {
              default: t(() => [
                e(X, null, {
                  default: t(() => [...y[14] || (y[14] = [
                    l("Delete system user", -1)
                  ])]),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => {
                    var q;
                    return [
                      y[15] || (y[15] = l("Remove ", -1)),
                      d("strong", null, w((q = T.value) == null ? void 0 : q.login), 1),
                      y[16] || (y[16] = l(" from system accounts?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(G, null, {
                  default: t(() => [
                    e(Z),
                    e(B, {
                      variant: "text",
                      onClick: y[6] || (y[6] = (q) => O.value = !1)
                    }, {
                      default: t(() => [...y[17] || (y[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(B, {
                      color: "error",
                      variant: "elevated",
                      loading: f.value,
                      onClick: a
                    }, {
                      default: t(() => [...y[18] || (y[18] = [
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
}, Ft = /* @__PURE__ */ we(Ot, [["__scopeId", "data-v-3bd83da2"]]), Gt = { class: "d-flex align-center mb-4" }, Ht = {
  __name: "SystemRoleView",
  setup(o) {
    const h = be(), U = me(), A = s([]), z = s(!1), i = s(null), I = s(null), x = s(!1), S = s(null), b = s({ name: "", apiPatterns: [], uiPatterns: [] }), m = s(!1), C = s(!1), $ = s(null), O = s(!1), T = { required: (E) => !!E || "Required" }, f = [
      { title: "Name", key: "name", sortable: !0, width: "180px" },
      { title: "API patterns", key: "authApi", sortable: !1 },
      { title: "UI patterns", key: "authUi", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    async function u() {
      z.value = !0, i.value = null;
      const E = await h.get("rest/system/security/role/withAuth"), _ = (E == null ? void 0 : E.data) || E || [];
      for (const g of _)
        g["authorizations-api"] = (g.authorizations || []).filter((a) => a.type === "api"), g["authorizations-ui"] = (g.authorizations || []).filter((a) => a.type === "ui");
      A.value = _, z.value = !1;
    }
    function V() {
      S.value = null, b.value = { name: "", apiPatterns: [], uiPatterns: [] }, x.value = !0;
    }
    function F(E) {
      S.value = E, b.value = {
        name: E.name,
        apiPatterns: (E["authorizations-api"] || []).map((_) => _.pattern),
        uiPatterns: (E["authorizations-ui"] || []).map((_) => _.pattern)
      }, x.value = !0;
    }
    function P(E) {
      $.value = E, C.value = !0;
    }
    async function j() {
      var a;
      const { valid: E } = await I.value.validate();
      if (!E) return;
      m.value = !0;
      const _ = {
        id: (a = S.value) == null ? void 0 : a.id,
        name: b.value.name,
        authorizations: [
          ...b.value.apiPatterns.map((L) => ({ pattern: L, type: "api" })),
          ...b.value.uiPatterns.map((L) => ({ pattern: L, type: "ui" }))
        ]
      }, g = S.value ? "put" : "post";
      await h[g]("rest/system/security/role", _), m.value = !1, x.value = !1, u();
    }
    async function D() {
      O.value = !0, await h.del(`rest/system/security/role/${$.value.id}`), O.value = !1, C.value = !1, u();
    }
    return ce(() => {
      U.setTitle("Roles"), U.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]), u();
    }), (E, _) => {
      const g = n("v-spacer"), a = n("v-btn"), L = n("v-alert"), y = n("v-icon"), Z = n("v-data-table"), te = n("v-card-title"), B = n("v-text-field"), N = n("v-combobox"), k = n("v-form"), se = n("v-card-text"), oe = n("v-card-actions"), X = n("v-card"), v = n("v-dialog");
      return r(), H("div", null, [
        d("div", Gt, [
          _[8] || (_[8] = d("h1", { class: "text-h4" }, "Roles", -1)),
          e(g),
          e(a, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: V
          }, {
            default: t(() => [..._[7] || (_[7] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        i.value ? (r(), R(L, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(i.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        e(Z, {
          headers: f,
          items: A.value,
          loading: z.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.authApi": t(({ item: J }) => [
            (r(!0), H(ve, null, ye(J["authorizations-api"], (K) => (r(), H("code", {
              key: K.id || K.pattern,
              class: "auth-token"
            }, w(K.pattern), 1))), 128))
          ]),
          "item.authUi": t(({ item: J }) => [
            (r(!0), H(ve, null, ye(J["authorizations-ui"], (K) => (r(), H("code", {
              key: K.id || K.pattern,
              class: "auth-token"
            }, w(K.pattern), 1))), 128))
          ]),
          "item.actions": t(({ item: J }) => [
            e(a, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (K) => F(J)
            }, {
              default: t(() => [
                e(y, { size: "small" }, {
                  default: t(() => [..._[9] || (_[9] = [
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
              onClick: (K) => P(J)
            }, {
              default: t(() => [
                e(y, { size: "small" }, {
                  default: t(() => [..._[10] || (_[10] = [
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
        e(v, {
          modelValue: x.value,
          "onUpdate:modelValue": _[4] || (_[4] = (J) => x.value = J),
          "max-width": "640",
          persistent: ""
        }, {
          default: t(() => [
            e(X, null, {
              default: t(() => [
                e(te, null, {
                  default: t(() => [
                    l(w(S.value ? "Edit role" : "New role"), 1)
                  ]),
                  _: 1
                }),
                e(se, null, {
                  default: t(() => [
                    e(k, {
                      ref_key: "formRef",
                      ref: I,
                      onSubmit: xe(j, ["prevent"])
                    }, {
                      default: t(() => [
                        e(B, {
                          modelValue: b.value.name,
                          "onUpdate:modelValue": _[0] || (_[0] = (J) => b.value.name = J),
                          label: "Name",
                          rules: [T.required],
                          variant: "outlined",
                          class: "mb-4",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(N, {
                          modelValue: b.value.apiPatterns,
                          "onUpdate:modelValue": _[1] || (_[1] = (J) => b.value.apiPatterns = J),
                          label: "API authorization patterns (regex)",
                          items: b.value.apiPatterns,
                          chips: "",
                          "closable-chips": "",
                          multiple: "",
                          variant: "outlined",
                          hint: "Press Enter after each pattern",
                          "persistent-hint": "",
                          class: "mb-4"
                        }, null, 8, ["modelValue", "items"]),
                        e(N, {
                          modelValue: b.value.uiPatterns,
                          "onUpdate:modelValue": _[2] || (_[2] = (J) => b.value.uiPatterns = J),
                          label: "UI authorization patterns (regex)",
                          items: b.value.uiPatterns,
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
                e(oe, null, {
                  default: t(() => [
                    e(g),
                    e(a, {
                      variant: "text",
                      onClick: _[3] || (_[3] = (J) => x.value = !1)
                    }, {
                      default: t(() => [..._[11] || (_[11] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "primary",
                      variant: "elevated",
                      loading: m.value,
                      onClick: j
                    }, {
                      default: t(() => [..._[12] || (_[12] = [
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
        e(v, {
          modelValue: C.value,
          "onUpdate:modelValue": _[6] || (_[6] = (J) => C.value = J),
          "max-width": "420"
        }, {
          default: t(() => [
            e(X, null, {
              default: t(() => [
                e(te, null, {
                  default: t(() => [..._[13] || (_[13] = [
                    l("Delete role", -1)
                  ])]),
                  _: 1
                }),
                e(se, null, {
                  default: t(() => {
                    var J;
                    return [
                      _[14] || (_[14] = l("Delete role ", -1)),
                      d("strong", null, w((J = $.value) == null ? void 0 : J.name), 1),
                      _[15] || (_[15] = l("?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(oe, null, {
                  default: t(() => [
                    e(g),
                    e(a, {
                      variant: "text",
                      onClick: _[5] || (_[5] = (J) => C.value = !1)
                    }, {
                      default: t(() => [..._[16] || (_[16] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "error",
                      variant: "elevated",
                      loading: O.value,
                      onClick: D
                    }, {
                      default: t(() => [..._[17] || (_[17] = [
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
}, Wt = /* @__PURE__ */ we(Ht, [["__scopeId", "data-v-e3ba71a8"]]), Jt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, Xt = { key: 0 }, Yt = { key: 0 }, Kt = {
  __name: "SystemPluginView",
  setup(o) {
    const h = be(), U = me(), A = [
      { id: "central", label: "Maven Central" },
      { id: "nexus", label: "OSSRH Nexus" }
    ], z = s("central"), i = s([]), I = s(!1), x = s(null), S = s(!1), b = s(!1), m = s(!1), C = s(""), $ = s(!1), O = s(!1), T = [
      { title: "", key: "type", sortable: !1, width: "40px" },
      { title: "Artifact", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0 },
      { title: "Vendor", key: "vendor", sortable: !0, width: "160px" },
      { title: "Version", key: "version", sortable: !1, width: "280px" },
      { title: "Nodes", key: "nodes", sortable: !0, width: "80px", align: "center" },
      { title: "Subs", key: "subscriptions", sortable: !0, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function f(_) {
      var a, L;
      const g = (L = (a = _.plugin) == null ? void 0 : a.type) == null ? void 0 : L.toLowerCase();
      return g ? g === "feature" ? "mdi-wrench" : g === "service" ? "mdi-puzzle" : g === "tool" ? "mdi-hammer-wrench" : "mdi-puzzle" : "mdi-link-off";
    }
    async function u() {
      I.value = !0, x.value = null;
      const _ = await h.get(`rest/system/plugin?repository=${z.value}`);
      i.value = Array.isArray(_) ? _ : (_ == null ? void 0 : _.data) || [], I.value = !1;
    }
    async function V() {
      S.value = !0, await h.put(`rest/system/plugin/cache?repository=${z.value}`), S.value = !1, u();
    }
    async function F() {
      b.value = !0, await h.put("rest/system/plugin/restart"), b.value = !1;
    }
    async function P(_, g = !1) {
      O.value = !0;
      const a = `repository=${z.value}&javadoc=${g ? !1 : $.value}`;
      await h.post(`rest/system/plugin/${encodeURIComponent(_)}?${a}`), O.value = !1, m.value = !1, C.value = "", $.value = !1, u();
    }
    function j() {
      C.value && P(C.value.trim());
    }
    async function D(_) {
      await h.del(`rest/system/plugin/${_.plugin.artifact}/${_.latestLocalVersion}`), u();
    }
    async function E(_) {
      confirm(`Delete plug-in ${_}?`) && (await h.del(`rest/system/plugin/${_}`), u());
    }
    return ce(() => {
      U.setTitle("Plug-ins"), U.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plug-ins" }]), u();
    }), (_, g) => {
      const a = n("v-spacer"), L = n("v-select"), y = n("v-btn"), Z = n("v-alert"), te = n("v-icon"), B = n("v-chip"), N = n("v-data-table"), k = n("v-card-title"), se = n("v-text-field"), oe = n("v-checkbox"), X = n("v-card-text"), v = n("v-card-actions"), J = n("v-card"), K = n("v-dialog");
      return r(), H("div", null, [
        d("div", Jt, [
          g[9] || (g[9] = d("h1", { class: "text-h4" }, "Plugins", -1)),
          e(a),
          e(L, {
            modelValue: z.value,
            "onUpdate:modelValue": [
              g[0] || (g[0] = (G) => z.value = G),
              u
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
          e(y, {
            variant: "outlined",
            "prepend-icon": "mdi-magnify-plus",
            onClick: V,
            loading: S.value
          }, {
            default: t(() => [...g[6] || (g[6] = [
              l(" Check versions ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(y, {
            color: "error",
            variant: "outlined",
            "prepend-icon": "mdi-restart",
            onClick: F,
            loading: b.value
          }, {
            default: t(() => [...g[7] || (g[7] = [
              l(" Restart ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(y, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: g[1] || (g[1] = (G) => m.value = !0)
          }, {
            default: t(() => [...g[8] || (g[8] = [
              l("Install", -1)
            ])]),
            _: 1
          })
        ]),
        x.value ? (r(), R(Z, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(x.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        e(N, {
          headers: T,
          items: i.value,
          loading: I.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.type": t(({ item: G }) => {
            var ne;
            return [
              e(te, {
                size: "small",
                title: (ne = G.plugin) == null ? void 0 : ne.type
              }, {
                default: t(() => [
                  l(w(f(G)), 1)
                ]),
                _: 2
              }, 1032, ["title"])
            ];
          }),
          "item.version": t(({ item: G }) => {
            var ne;
            return [
              d("span", null, w(((ne = G.plugin) == null ? void 0 : ne.version) || "—"), 1),
              G.latestLocalVersion ? (r(), R(B, {
                key: 0,
                size: "x-small",
                color: "primary",
                class: "ml-1",
                closable: "",
                "onClick:close": (ue) => D(G),
                title: "Cancel local install"
              }, {
                default: t(() => [
                  l(w(G.latestLocalVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick:close"])) : W("", !0),
              G.newVersion && G.newVersion !== G.latestLocalVersion ? (r(), R(B, {
                key: 1,
                size: "x-small",
                color: "success",
                class: "ml-1",
                onClick: (ue) => P(G.plugin.artifact, !0),
                title: "Upgrade available — click to install"
              }, {
                default: t(() => [
                  e(te, {
                    start: "",
                    size: "x-small"
                  }, {
                    default: t(() => [...g[10] || (g[10] = [
                      l("mdi-arrow-up", -1)
                    ])]),
                    _: 1
                  }),
                  l(w(G.newVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : W("", !0)
            ];
          }),
          "item.nodes": t(({ item: G }) => {
            var ne, ue;
            return [
              ((ue = (ne = G.plugin) == null ? void 0 : ne.type) == null ? void 0 : ue.toLowerCase()) !== "feature" ? (r(), H("span", Xt, w(G.nodes ?? 0), 1)) : W("", !0)
            ];
          }),
          "item.subscriptions": t(({ item: G }) => {
            var ne, ue;
            return [
              ((ue = (ne = G.plugin) == null ? void 0 : ne.type) == null ? void 0 : ue.toLowerCase()) !== "feature" ? (r(), H("span", Yt, w(G.subscriptions ?? 0), 1)) : W("", !0)
            ];
          }),
          "item.actions": t(({ item: G }) => [
            G.deleted ? (r(), R(te, {
              key: 0,
              size: "small",
              color: "warning",
              title: "Deletion scheduled"
            }, {
              default: t(() => [...g[11] || (g[11] = [
                l("mdi-cancel", -1)
              ])]),
              _: 1
            })) : (r(), R(y, {
              key: 1,
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (ne) => E(G.plugin.artifact),
              title: "Delete plug-in"
            }, {
              default: t(() => [
                e(te, { size: "small" }, {
                  default: t(() => [...g[12] || (g[12] = [
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
        e(K, {
          modelValue: m.value,
          "onUpdate:modelValue": g[5] || (g[5] = (G) => m.value = G),
          "max-width": "520"
        }, {
          default: t(() => [
            e(J, null, {
              default: t(() => [
                e(k, null, {
                  default: t(() => [...g[13] || (g[13] = [
                    l("Install plug-in", -1)
                  ])]),
                  _: 1
                }),
                e(X, null, {
                  default: t(() => [
                    e(se, {
                      modelValue: C.value,
                      "onUpdate:modelValue": g[2] || (g[2] = (G) => C.value = G),
                      label: "Artifact id (e.g. plugin-prov-aws)",
                      variant: "outlined",
                      hint: `Repository: ${z.value}`,
                      "persistent-hint": "",
                      class: "mb-2",
                      autofocus: ""
                    }, null, 8, ["modelValue", "hint"]),
                    e(oe, {
                      modelValue: $.value,
                      "onUpdate:modelValue": g[3] || (g[3] = (G) => $.value = G),
                      label: "Install Javadoc bundle",
                      density: "compact",
                      "hide-details": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                e(v, null, {
                  default: t(() => [
                    e(a),
                    e(y, {
                      variant: "text",
                      onClick: g[4] || (g[4] = (G) => m.value = !1)
                    }, {
                      default: t(() => [...g[14] || (g[14] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(y, {
                      color: "primary",
                      variant: "elevated",
                      loading: O.value,
                      disabled: !C.value,
                      onClick: j
                    }, {
                      default: t(() => [...g[15] || (g[15] = [
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
}, Qt = { class: "d-flex align-center mb-4" }, Zt = {
  __name: "SystemNodeView",
  setup(o) {
    const h = be(), U = me(), A = s([]), z = s(!1), i = s(null), I = s(!1), x = s(null), S = s(!1), b = [
      { title: "Identifier", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Status", key: "status", sortable: !0, width: "120px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function m(T) {
      var u;
      const f = (u = T == null ? void 0 : T.toLowerCase) == null ? void 0 : u.call(T);
      return f === "up" ? "success" : f === "down" ? "error" : f === "unknown" ? "warning" : "grey";
    }
    async function C() {
      z.value = !0, i.value = null;
      const T = await h.get("rest/node");
      A.value = Array.isArray(T) ? T : (T == null ? void 0 : T.data) || [], z.value = !1;
    }
    function $(T) {
      x.value = T, I.value = !0;
    }
    async function O() {
      S.value = !0, await h.del(`rest/node/${encodeURIComponent(x.value.id)}`), S.value = !1, I.value = !1, C();
    }
    return ce(() => {
      U.setTitle("Nodes"), U.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]), C();
    }), (T, f) => {
      const u = n("v-spacer"), V = n("v-btn"), F = n("v-alert"), P = n("v-chip"), j = n("v-icon"), D = n("v-data-table"), E = n("v-card-title"), _ = n("v-card-text"), g = n("v-card-actions"), a = n("v-card"), L = n("v-dialog");
      return r(), H("div", null, [
        d("div", Qt, [
          f[3] || (f[3] = d("h1", { class: "text-h4" }, "Nodes", -1)),
          e(u),
          e(V, {
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
        i.value ? (r(), R(F, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(i.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        e(D, {
          headers: b,
          items: A.value,
          loading: z.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.id": t(({ item: y }) => [
            d("code", null, w(y.id), 1)
          ]),
          "item.status": t(({ item: y }) => [
            y.status ? (r(), R(P, {
              key: 0,
              size: "x-small",
              color: m(y.status),
              variant: "tonal"
            }, {
              default: t(() => [
                l(w(y.status), 1)
              ]),
              _: 2
            }, 1032, ["color"])) : W("", !0)
          ]),
          "item.actions": t(({ item: y }) => [
            e(V, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (Z) => $(y)
            }, {
              default: t(() => [
                e(j, { size: "small" }, {
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
          modelValue: I.value,
          "onUpdate:modelValue": f[1] || (f[1] = (y) => I.value = y),
          "max-width": "460"
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(E, null, {
                  default: t(() => [...f[5] || (f[5] = [
                    l("Delete node", -1)
                  ])]),
                  _: 1
                }),
                e(_, null, {
                  default: t(() => {
                    var y, Z;
                    return [
                      f[6] || (f[6] = l(" Delete ", -1)),
                      d("strong", null, w((y = x.value) == null ? void 0 : y.name), 1),
                      f[7] || (f[7] = l(" (", -1)),
                      d("code", null, w((Z = x.value) == null ? void 0 : Z.id), 1),
                      f[8] || (f[8] = l(")? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(g, null, {
                  default: t(() => [
                    e(u),
                    e(V, {
                      variant: "text",
                      onClick: f[0] || (f[0] = (y) => I.value = !1)
                    }, {
                      default: t(() => [...f[9] || (f[9] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(V, {
                      color: "error",
                      variant: "elevated",
                      loading: S.value,
                      onClick: O
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
}, el = { class: "d-flex align-center mb-4" }, tl = { class: "d-flex align-center ga-2" }, ll = { class: "d-flex align-center ga-2" }, nl = {
  __name: "SystemCacheView",
  setup(o) {
    const h = be(), U = me(), A = s([]), z = s(!1), i = s(null), I = s(null), x = [
      { title: "Cache", key: "id", sortable: !0 },
      { title: "Size", key: "size", sortable: !0, width: "100px" },
      { title: "Hits", key: "hitCount", sortable: !0, width: "160px" },
      { title: "Misses", key: "missCount", sortable: !0, width: "160px" },
      { title: "Avg get (ms)", key: "averageGetTime", sortable: !0, width: "140px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function S(C, $, O) {
      return $ && O === 1 || C >= 90 ? "success" : C >= 80 ? "primary" : C >= 50 ? "warning" : "error";
    }
    async function b() {
      z.value = !0, i.value = null;
      const C = await h.get("rest/system/cache");
      Array.isArray(C) ? A.value = C : C === null && (i.value = "Unable to load caches"), z.value = !1;
    }
    async function m(C) {
      I.value = C.id, await h.post(`rest/system/cache/${encodeURIComponent(C.id)}`), I.value = null, b();
    }
    return ce(() => {
      U.setTitle("Caches"), U.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Caches" }]), b();
    }), (C, $) => {
      const O = n("v-spacer"), T = n("v-btn"), f = n("v-alert"), u = n("v-chip"), V = n("v-icon"), F = n("v-data-table");
      return r(), H("div", null, [
        d("div", el, [
          $[1] || ($[1] = d("h1", { class: "text-h4" }, "Caches", -1)),
          e(O),
          e(T, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            onClick: b
          }, {
            default: t(() => [...$[0] || ($[0] = [
              l("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        i.value ? (r(), R(f, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(i.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        e(F, {
          headers: x,
          items: A.value,
          loading: z.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.hitCount": t(({ item: P }) => [
            d("div", tl, [
              d("span", null, w(P.hitCount ?? 0), 1),
              P.hitPercentage != null && (P.hitCount ?? 0) > 0 ? (r(), R(u, {
                key: 0,
                size: "x-small",
                color: S(P.hitPercentage, !0, P.hitCount)
              }, {
                default: t(() => [
                  l(w(Math.round(P.hitPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : W("", !0)
            ])
          ]),
          "item.missCount": t(({ item: P }) => [
            d("div", ll, [
              d("span", null, w(P.missCount ?? 0), 1),
              P.missPercentage != null && (P.missCount ?? 0) > 1 ? (r(), R(u, {
                key: 0,
                size: "x-small",
                color: S(100 - P.missPercentage, !1)
              }, {
                default: t(() => [
                  l(w(Math.round(P.missPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : W("", !0)
            ])
          ]),
          "item.averageGetTime": t(({ item: P }) => [
            l(w(P.averageGetTime ?? "—"), 1)
          ]),
          "item.actions": t(({ item: P }) => [
            e(T, {
              icon: "",
              size: "small",
              variant: "text",
              loading: I.value === P.id,
              onClick: (j) => m(P),
              title: "Invalidate cache"
            }, {
              default: t(() => [
                e(V, { size: "small" }, {
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
}, al = { key: 1 }, ol = {
  __name: "SystemBenchView",
  setup(o) {
    const h = be(), U = me(), A = [
      { key: "insert", step: "INSERT", method: "post", url: "rest/system/bench/prepare" },
      { key: "select", step: "SELECT", method: "get", url: "rest/system/bench/read" },
      { key: "select-all", step: "SELECT *", method: "get", url: "rest/system/bench/read/all" },
      { key: "update", step: "UPDATE", method: "put", url: "rest/system/bench/update" },
      { key: "delete", step: "DELETE", method: "del", url: "rest/system/bench/delete" }
    ], z = s(!1), i = s(null), I = s(A.map((S) => ({ step: S.step, duration: null, loading: !1 })));
    async function x() {
      z.value = !0, i.value = null, I.value = A.map((S) => ({ step: S.step, duration: null, loading: !1 }));
      for (let S = 0; S < A.length; S++) {
        I.value[S].loading = !0;
        try {
          const b = A[S].method === "post" || A[S].method === "put" ? void 0 : null, m = b === null ? await h[A[S].method](A[S].url) : await h[A[S].method](A[S].url, b);
          I.value[S].duration = (m == null ? void 0 : m.duration) ?? "—";
        } catch (b) {
          i.value = `${A[S].step} failed: ${b.message || b}`;
          break;
        } finally {
          I.value[S].loading = !1;
        }
      }
      z.value = !1;
    }
    return ce(() => {
      U.setTitle("Bench"), U.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (S, b) => {
      const m = n("v-card-text"), C = n("v-card"), $ = n("v-btn"), O = n("v-alert"), T = n("v-progress-circular"), f = n("v-table");
      return r(), H("div", null, [
        b[3] || (b[3] = d("h1", { class: "text-h4 mb-4" }, "Database bench", -1)),
        e(C, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(m, null, {
              default: t(() => [...b[0] || (b[0] = [
                l(" Runs a sequence of ", -1),
                d("code", null, "INSERT", -1),
                l(" → ", -1),
                d("code", null, "SELECT", -1),
                l(" → ", -1),
                d("code", null, "SELECT *", -1),
                l(" → ", -1),
                d("code", null, "UPDATE", -1),
                l(" → ", -1),
                d("code", null, "DELETE", -1),
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
          loading: z.value,
          onClick: x
        }, {
          default: t(() => [...b[1] || (b[1] = [
            l(" Run bench ", -1)
          ])]),
          _: 1
        }, 8, ["loading"]),
        i.value ? (r(), R(O, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mt-4"
        }, {
          default: t(() => [
            l(w(i.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        I.value.length ? (r(), R(f, {
          key: 1,
          density: "compact",
          class: "mt-4",
          style: { "max-width": "600px" }
        }, {
          default: t(() => [
            b[2] || (b[2] = d("thead", null, [
              d("tr", null, [
                d("th", null, "Step"),
                d("th", null, "Duration (ms)")
              ])
            ], -1)),
            d("tbody", null, [
              (r(!0), H(ve, null, ye(I.value, (u) => (r(), H("tr", {
                key: u.step
              }, [
                d("td", null, w(u.step), 1),
                d("td", null, [
                  u.loading ? (r(), R(T, {
                    key: 0,
                    size: "16",
                    width: "2",
                    indeterminate: ""
                  })) : (r(), H("span", al, w(u.duration ?? "—"), 1))
                ])
              ]))), 128))
            ])
          ]),
          _: 1
        })) : W("", !0)
      ]);
    };
  }
}, sl = { class: "d-flex align-center mb-4" }, il = {
  __name: "ApiHomeView",
  setup(o) {
    const h = me(), U = s(!0), A = s(null), z = "/", i = `${z}rest/swagger-ui-bundle.js`, I = `${z}rest/swagger-ui-standalone-preset.js`, x = `${z}rest/swagger-ui.css`, S = `${z}rest/index.css`, b = `${z}rest/openapi.json`;
    function m() {
      return () => ({
        fn: {
          opsFilter(f, u) {
            const V = u.toLowerCase();
            return f.map((P) => (P._root.entries[1][1] = P._root.entries[1][1].filter((j) => {
              const D = JSON.parse(JSON.stringify(j)), E = (D.operation.summary || "").toString().toLowerCase(), _ = (D.operation.description || "").toString().toLowerCase();
              return D.path.toLowerCase().includes(V) || E.includes(V) || _.includes(V);
            }), P)).filter((P) => P._root.entries[1][1].size > 0);
          }
        }
      });
    }
    function C(f, u) {
      if (document.getElementById(u)) return;
      const V = document.createElement("link");
      V.id = u, V.rel = "stylesheet", V.href = f, document.head.appendChild(V);
    }
    function $(f) {
      var u;
      (u = document.getElementById(f)) == null || u.remove();
    }
    function O(f, u) {
      return new Promise((V, F) => {
        if (document.getElementById(u)) {
          V();
          return;
        }
        const j = document.createElement("script");
        j.id = u, j.src = f, j.async = !0, j.onload = V, j.onerror = () => F(new Error(`Failed to load ${f}`)), document.head.appendChild(j);
      });
    }
    function T() {
      const { SwaggerUIBundle: f, SwaggerUIStandalonePreset: u } = window;
      if (!f) {
        A.value = "Swagger UI bundle is unavailable.";
        return;
      }
      window.ui = f({
        url: b,
        dom_id: "#swagger-ui",
        displayRequestDuration: !0,
        deepLinking: !1,
        presets: [f.presets.apis, u],
        plugins: [f.plugins.FiltrePreset, m()].filter(Boolean),
        filter: !0,
        layout: "StandaloneLayout",
        validatorUrl: "https://validator.swagger.io/validator"
      });
    }
    return ce(async () => {
      h.setTitle("API"), h.setBreadcrumbs([{ title: "API" }]), C(x, "swagger-ui-css"), C(S, "swagger-ui-extra-css");
      try {
        await Promise.all([
          O(i, "swagger-ui-bundle"),
          O(I, "swagger-ui-preset")
        ]), T();
      } catch (f) {
        A.value = f.message || "Unable to load Swagger UI.";
      } finally {
        U.value = !1;
      }
    }), Ge(() => {
      $("swagger-ui-css"), $("swagger-ui-extra-css"), delete window.ui;
    }), (f, u) => {
      const V = n("v-spacer"), F = n("v-btn"), P = n("v-alert"), j = n("v-progress-linear");
      return r(), H("div", null, [
        d("div", sl, [
          u[1] || (u[1] = d("h1", { class: "text-h4" }, "API reference", -1)),
          e(V),
          e(F, {
            variant: "outlined",
            "prepend-icon": "mdi-code-tags",
            href: `${ae(z)}rest/openapi.json`,
            target: "_blank"
          }, {
            default: t(() => [...u[0] || (u[0] = [
              l(" Download OpenAPI ", -1)
            ])]),
            _: 1
          }, 8, ["href"])
        ]),
        A.value ? (r(), R(P, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(A.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        U.value ? (r(), R(j, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : W("", !0),
        u[2] || (u[2] = d("div", {
          id: "swagger-ui",
          class: "swagger-container"
        }, null, -1))
      ]);
    };
  }
}, rl = /* @__PURE__ */ we(il, [["__scopeId", "data-v-f74586ba"]]), ul = { class: "d-flex align-center mb-4" }, dl = { class: "mb-0 text-body-2" }, cl = {
  __name: "ApiTokenView",
  setup(o) {
    const h = be(), U = me(), A = Ne(), z = "/", i = typeof window < "u" ? window.location.origin : "", I = pe(() => A.userName || "<you>"), x = s([]), S = s(!1), b = s(null), m = s(!1), C = s(null), $ = s(""), O = s(!1), T = s(!1), f = s(""), u = s(""), V = s(!1), F = s(""), P = s(""), j = s(!1), D = s(!1), E = s(!1), _ = s(""), g = s(!1), a = { required: (X) => !!X || "Required" }, L = [
      { title: "Name", key: "name", sortable: !0 },
      { title: "", key: "actions", sortable: !1, width: "140px", align: "end" }
    ];
    async function y() {
      S.value = !0, b.value = null;
      const X = await h.get("rest/api/token");
      x.value = Array.isArray(X) ? X.map((v) => ({ name: v })) : [], S.value = !1;
    }
    function Z() {
      $.value = "", m.value = !0;
    }
    async function te() {
      const { valid: X } = await C.value.validate();
      if (!X) return;
      O.value = !0;
      const v = await h.post(`rest/api/token/${encodeURIComponent($.value)}`);
      O.value = !1, v !== null && (f.value = $.value, u.value = typeof v == "string" ? v : (v == null ? void 0 : v.id) || "", m.value = !1, T.value = !0, y());
    }
    async function B(X, v) {
      F.value = X, P.value = "", D.value = !1, V.value = !0, j.value = !0;
      const J = `rest/api/token/${encodeURIComponent(X)}`, K = v === "regen" ? await h.put(J) : await h.get(J);
      P.value = typeof K == "string" ? K : (K == null ? void 0 : K.id) || "", j.value = !1;
    }
    async function N() {
      try {
        await navigator.clipboard.writeText(P.value), D.value = !0, setTimeout(() => {
          D.value = !1;
        }, 2e3);
      } catch {
      }
    }
    async function k() {
      try {
        await navigator.clipboard.writeText(u.value);
      } catch {
      }
    }
    function se(X) {
      _.value = X, E.value = !0;
    }
    async function oe() {
      g.value = !0, await h.del(`rest/api/token/${encodeURIComponent(_.value)}`), g.value = !1, E.value = !1, y();
    }
    return ce(() => {
      U.setTitle("API tokens"), U.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]), y();
    }), (X, v) => {
      const J = n("v-spacer"), K = n("v-btn"), G = n("v-card-text"), ne = n("v-card"), ue = n("v-alert"), q = n("v-icon"), le = n("v-data-table"), de = n("v-card-title"), ke = n("v-text-field"), p = n("v-form"), c = n("v-card-actions"), Y = n("v-dialog"), ie = n("v-progress-linear"), ee = n("v-textarea");
      return r(), H("div", null, [
        d("div", ul, [
          v[11] || (v[11] = d("h1", { class: "text-h4" }, "API tokens", -1)),
          e(J),
          e(K, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: Z
          }, {
            default: t(() => [...v[10] || (v[10] = [
              l("New token", -1)
            ])]),
            _: 1
          })
        ]),
        e(ne, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(G, null, {
              default: t(() => [
                v[13] || (v[13] = d("p", { class: "mb-2" }, [
                  l(" Tokens let you call the Ligoj API without a password. Pass the token in the "),
                  d("code", null, "api-key"),
                  l(" parameter along with your user id in "),
                  d("code", null, "api-user"),
                  l(". ")
                ], -1)),
                d("p", dl, [
                  v[12] || (v[12] = l(" Example: ", -1)),
                  d("code", null, " GET " + w(ae(i)) + w(ae(z)) + "rest/project?api-key=<token>&api-user=" + w(I.value), 1)
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        b.value ? (r(), R(ue, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(b.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        e(le, {
          headers: L,
          items: x.value,
          loading: S.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.actions": t(({ item: Q }) => [
            e(K, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Show token",
              onClick: (fe) => B(Q.name, "load")
            }, {
              default: t(() => [
                e(q, { size: "small" }, {
                  default: t(() => [...v[14] || (v[14] = [
                    l("mdi-eye", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(K, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Regenerate",
              onClick: (fe) => B(Q.name, "regen")
            }, {
              default: t(() => [
                e(q, { size: "small" }, {
                  default: t(() => [...v[15] || (v[15] = [
                    l("mdi-refresh", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(K, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              title: "Delete",
              onClick: (fe) => se(Q.name)
            }, {
              default: t(() => [
                e(q, { size: "small" }, {
                  default: t(() => [...v[16] || (v[16] = [
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
          modelValue: m.value,
          "onUpdate:modelValue": v[2] || (v[2] = (Q) => m.value = Q),
          "max-width": "480",
          persistent: ""
        }, {
          default: t(() => [
            e(ne, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [...v[17] || (v[17] = [
                    l("New API token", -1)
                  ])]),
                  _: 1
                }),
                e(G, null, {
                  default: t(() => [
                    e(p, {
                      ref_key: "createFormRef",
                      ref: C,
                      onSubmit: xe(te, ["prevent"])
                    }, {
                      default: t(() => [
                        e(ke, {
                          modelValue: $.value,
                          "onUpdate:modelValue": v[0] || (v[0] = (Q) => $.value = Q),
                          label: "Name",
                          rules: [a.required],
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
                e(c, null, {
                  default: t(() => [
                    e(J),
                    e(K, {
                      variant: "text",
                      onClick: v[1] || (v[1] = (Q) => m.value = !1)
                    }, {
                      default: t(() => [...v[18] || (v[18] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(K, {
                      color: "primary",
                      variant: "elevated",
                      loading: O.value,
                      onClick: te
                    }, {
                      default: t(() => [...v[19] || (v[19] = [
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
          modelValue: V.value,
          "onUpdate:modelValue": v[5] || (v[5] = (Q) => V.value = Q),
          "max-width": "520"
        }, {
          default: t(() => [
            e(ne, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [
                    v[20] || (v[20] = l(" Token: ", -1)),
                    d("code", null, w(F.value), 1)
                  ]),
                  _: 1
                }),
                e(G, null, {
                  default: t(() => [
                    j.value ? (r(), R(ie, {
                      key: 0,
                      indeterminate: "",
                      color: "primary",
                      class: "mb-3"
                    })) : W("", !0),
                    e(ee, {
                      modelValue: P.value,
                      "onUpdate:modelValue": v[3] || (v[3] = (Q) => P.value = Q),
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": N
                    }, null, 8, ["modelValue"]),
                    D.value ? (r(), R(ue, {
                      key: 1,
                      type: "success",
                      variant: "tonal",
                      density: "compact",
                      class: "mt-2"
                    }, {
                      default: t(() => [...v[21] || (v[21] = [
                        l(" Copied to clipboard. ", -1)
                      ])]),
                      _: 1
                    })) : W("", !0)
                  ]),
                  _: 1
                }),
                e(c, null, {
                  default: t(() => [
                    e(J),
                    e(K, {
                      variant: "text",
                      onClick: v[4] || (v[4] = (Q) => V.value = !1)
                    }, {
                      default: t(() => [...v[22] || (v[22] = [
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
          modelValue: T.value,
          "onUpdate:modelValue": v[7] || (v[7] = (Q) => T.value = Q),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(ne, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [
                    v[23] || (v[23] = l(" New token: ", -1)),
                    d("code", null, w(f.value), 1)
                  ]),
                  _: 1
                }),
                e(G, null, {
                  default: t(() => [
                    e(ue, {
                      type: "info",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-3"
                    }, {
                      default: t(() => [...v[24] || (v[24] = [
                        l(" Save this value now — you can re-display it later through ", -1),
                        d("strong", null, "Show token", -1),
                        l(". ", -1)
                      ])]),
                      _: 1
                    }),
                    e(ee, {
                      "model-value": u.value,
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
                e(c, null, {
                  default: t(() => [
                    e(J),
                    e(K, {
                      color: "primary",
                      onClick: v[6] || (v[6] = (Q) => T.value = !1)
                    }, {
                      default: t(() => [...v[25] || (v[25] = [
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
          modelValue: E.value,
          "onUpdate:modelValue": v[9] || (v[9] = (Q) => E.value = Q),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ne, null, {
              default: t(() => [
                e(de, null, {
                  default: t(() => [...v[26] || (v[26] = [
                    l("Delete token", -1)
                  ])]),
                  _: 1
                }),
                e(G, null, {
                  default: t(() => [
                    v[27] || (v[27] = l("Revoke token ", -1)),
                    d("code", null, w(_.value), 1),
                    v[28] || (v[28] = l("?", -1))
                  ]),
                  _: 1
                }),
                e(c, null, {
                  default: t(() => [
                    e(J),
                    e(K, {
                      variant: "text",
                      onClick: v[8] || (v[8] = (Q) => E.value = !1)
                    }, {
                      default: t(() => [...v[29] || (v[29] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(K, {
                      color: "error",
                      variant: "elevated",
                      loading: g.value,
                      onClick: oe
                    }, {
                      default: t(() => [...v[30] || (v[30] = [
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
}, ml = { class: "d-flex align-center mb-4" }, pl = { class: "pa-4" }, vl = { class: "pa-4" }, fl = { class: "text-body-2 text-medium-emphasis mb-4" }, _l = { class: "d-flex align-center pa-2" }, gl = {
  __name: "SubscribeWizardView",
  setup(o) {
    const h = ze(), U = Ce(), A = be(), z = me(), i = pe(() => h.query.project ?? h.params.id ?? null), I = s(null), x = s(!1), S = s(null), b = s(1), m = Se({
      service: null,
      tool: null,
      node: null,
      mode: null
    }), C = s([]), $ = s([]), O = s([]), T = s([]), f = Se({}), u = s(null), V = s(!1), F = s(!1), P = s(!1), j = s(!1), D = s(!1), E = pe(() => ["Service", "Tool", "Node", "Mode", "Parameters"]), _ = pe(() => (p) => p === 1 ? !0 : p === 2 ? !!m.service : p === 3 ? !!m.tool : p === 4 ? !!m.node : p === 5 ? !!m.node && !!m.mode : !1), g = pe(() => b.value === 1 ? !!m.service : b.value === 2 ? !!m.tool : b.value === 3 ? !!m.node : b.value === 4 ? !!m.mode : !1), a = pe(() => {
      var Y;
      const p = (Y = m.tool) == null ? void 0 : Y.mode, c = [];
      return (p === "all" || p === "create") && c.push({ value: "create", label: "Create — provision a new instance inside the tool" }), (p === "all" || p === "link" || !p) && c.push({ value: "link", label: "Link — attach this project to an existing instance" }), c;
    }), L = pe(
      () => I.value ? `/home/project/${I.value.id}` : "/home/project"
    );
    function y(p) {
      return !p.type || p.type === "text" || p.type === "password" || p.type === "node" || p.type === "project";
    }
    function Z(p) {
      return p.type === "password" || (p.name || "").toLowerCase().includes("password");
    }
    function te(p) {
      const c = p.mandatory || p.required ? " *" : "";
      return `${p.name || p.id}${c}`;
    }
    function B(p) {
      const c = [];
      return (p.mandatory || p.required) && c.push((Y) => Y !== "" && Y != null || "Required"), c;
    }
    async function N() {
      if (!i.value) return;
      x.value = !0;
      const p = await A.get(`rest/project/${i.value}`);
      I.value = p || null, x.value = !1;
    }
    async function k() {
      V.value = !0, C.value = await J("rest/node?refined=service&rows=1000"), V.value = !1;
    }
    async function se(p) {
      F.value = !0, $.value = await J(`rest/node?refined=${encodeURIComponent(p)}&rows=1000`), F.value = !1;
    }
    async function oe(p) {
      P.value = !0, O.value = await J(`rest/node?refined=${encodeURIComponent(p)}&rows=1000`), P.value = !1;
    }
    async function X(p, c) {
      j.value = !0;
      const Y = await A.get(`rest/node/${encodeURIComponent(p)}/parameter/${c.toUpperCase()}`);
      T.value = Array.isArray(Y) ? Y : (Y == null ? void 0 : Y.data) || [];
      for (const ie of Object.keys(f)) delete f[ie];
      for (const ie of T.value)
        ie.defaultValue != null ? f[ie.id] = v(ie) : ie.type === "bool" ? f[ie.id] = !1 : ie.type === "multiselect" || ie.type === "tags" ? f[ie.id] = [] : f[ie.id] = "";
      j.value = !1;
    }
    function v(p) {
      return p.type === "integer" ? Number(p.defaultValue) : p.type === "bool" ? p.defaultValue === !0 || p.defaultValue === "true" : p.defaultValue;
    }
    async function J(p) {
      const c = await A.get(p);
      return Array.isArray(c) ? K(c) : Array.isArray(c == null ? void 0 : c.data) ? K(c.data) : [];
    }
    function K(p) {
      return p.filter((c) => c.enabled !== !1);
    }
    function G(p) {
      var c;
      ((c = m.service) == null ? void 0 : c.id) !== p.id && (m.service = p, m.tool = null, m.node = null, m.mode = null, $.value = [], O.value = []);
    }
    function ne(p) {
      var c;
      ((c = m.tool) == null ? void 0 : c.id) !== p.id && (m.tool = p, m.node = null, m.mode = null, O.value = []);
    }
    function ue(p) {
      var c;
      ((c = m.node) == null ? void 0 : c.id) !== p.id && (m.node = p, m.mode = null);
    }
    Pe(b, async (p) => {
      p === 1 && C.value.length === 0 && await k(), p === 2 && m.service && $.value.length === 0 && await se(m.service.id), p === 3 && m.tool && O.value.length === 0 && await oe(m.tool.id), p === 4 && !m.mode && a.value.length > 0 && (m.mode = a.value[0].value), p === 5 && m.node && m.mode && await X(m.node.id, m.mode);
    });
    async function q() {
      const { valid: p } = u.value ? await u.value.validate() : { valid: !0 };
      if (!p) return;
      D.value = !0, S.value = null;
      const c = {
        node: m.node.id,
        project: Number(i.value),
        mode: m.mode,
        parameters: T.value.map((ie) => le(ie)).filter(Boolean)
      }, Y = await A.post("rest/subscription", c);
      D.value = !1, Y != null ? U.push(`/home/project/${i.value}`) : S.value = "Subscription creation failed — please review the highlighted parameters.";
    }
    function le(p) {
      const c = f[p.id];
      if ((c === "" || c == null || Array.isArray(c) && c.length === 0) && !p.mandatory && !p.required)
        return null;
      const Y = { parameter: p.id };
      return p.type === "integer" ? { ...Y, integer: Number(c) } : p.type === "bool" ? { ...Y, bool: !!c } : p.type === "multiselect" || p.type === "tags" ? { ...Y, selections: c || [] } : p.type === "select" ? { ...Y, text: c } : { ...Y, text: c };
    }
    ce(async () => {
      z.setTitle("Subscribe"), z.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        ...i.value ? [{ title: i.value, to: `/home/project/${i.value}` }, { title: "Subscribe" }] : [{ title: "Subscribe" }]
      ]), await N(), I.value && await k();
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
      setup(p, { emit: c }) {
        return () => ge("div", { class: "pa-4" }, [
          ge("h3", { class: "text-h6 mb-1" }, p.heading),
          p.sub && ge("p", { class: "text-body-2 text-medium-emphasis mb-4" }, p.sub),
          p.loading ? ge("div", { class: "text-body-2 text-medium-emphasis pa-4" }, "Loading…") : p.choices.length ? ge(
            "div",
            { class: "choice-grid" },
            p.choices.map(
              (Y) => ge(
                "button",
                {
                  key: Y.id,
                  type: "button",
                  class: [
                    "choice-card",
                    { "choice-card--active": Y.id === p.selectedId }
                  ],
                  onClick: () => c("select", Y),
                  title: Y.description || void 0
                },
                [
                  ge("div", { class: "choice-icon" }, ke(Y)),
                  ge("div", { class: "choice-name" }, Y.name || Y.id)
                ]
              )
            )
          ) : ge("div", { class: "text-body-2 text-medium-emphasis" }, "No entries available.")
        ]);
      }
    };
    function ke(p) {
      var Y;
      const c = (p == null ? void 0 : p.uiClasses) || ((Y = p == null ? void 0 : p.refined) == null ? void 0 : Y.uiClasses);
      return c && c.startsWith("$") ? c.slice(1) : c ? ge("i", { class: c }) : ge("i", { class: "mdi mdi-puzzle" });
    }
    return (p, c) => {
      const Y = n("v-spacer"), ie = n("v-btn"), ee = n("router-link"), Q = n("v-alert"), fe = n("v-radio"), De = n("v-radio-group"), Le = n("v-progress-linear"), he = n("v-text-field"), Re = n("v-checkbox"), $e = n("v-select"), Ee = n("v-form"), Be = n("v-stepper");
      return r(), H("div", null, [
        d("div", ml, [
          c[3] || (c[3] = d("h1", { class: "text-h4" }, "Subscribe", -1)),
          e(Y),
          e(ie, {
            variant: "text",
            to: L.value
          }, {
            default: t(() => [...c[2] || (c[2] = [
              l("Cancel", -1)
            ])]),
            _: 1
          }, 8, ["to"])
        ]),
        i.value ? x.value ? (r(), R(Q, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...c[7] || (c[7] = [
            l(" Loading project… ", -1)
          ])]),
          _: 1
        })) : I.value ? (r(), R(Q, {
          key: 2,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            c[8] || (c[8] = l(" Adding a subscription to ", -1)),
            d("strong", null, w(I.value.name), 1),
            l(" (" + w(I.value.pkey) + "). ", 1),
            c[9] || (c[9] = d("br", null, null, -1)),
            c[10] || (c[10] = d("span", { class: "text-caption text-warning" }, "Subscribing is not an idempotent operation — removing a subscription later may not clean up remote data automatically.", -1))
          ]),
          _: 1
        })) : W("", !0) : (r(), R(Q, {
          key: 0,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            c[5] || (c[5] = l(" No project selected. The wizard needs a project — ", -1)),
            e(ee, { to: "/home/project" }, {
              default: t(() => [...c[4] || (c[4] = [
                l("pick one", -1)
              ])]),
              _: 1
            }),
            c[6] || (c[6] = l(`, then open this page from the project's "Add subscription" button. `, -1))
          ]),
          _: 1
        })),
        S.value ? (r(), R(Q, {
          key: 3,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(S.value), 1)
          ]),
          _: 1
        })) : W("", !0),
        I.value ? (r(), R(Be, {
          key: 4,
          modelValue: b.value,
          "onUpdate:modelValue": c[1] || (c[1] = (re) => b.value = re),
          items: E.value,
          "alt-labels": "",
          editable: _.value,
          class: "mb-4"
        }, {
          "item.1": t(() => {
            var re;
            return [
              e(de, {
                heading: "Select a service",
                sub: "A service groups features implemented by one or more tools.",
                choices: C.value,
                loading: V.value,
                "selected-id": (re = m.service) == null ? void 0 : re.id,
                onSelect: G
              }, null, 8, ["choices", "loading", "selected-id"])
            ];
          }),
          "item.2": t(() => {
            var re, M;
            return [
              e(de, {
                heading: `Select a tool providing ${((re = m.service) == null ? void 0 : re.name) ?? "…"}`,
                sub: "A tool is one implementation of the service; several instances may be deployed.",
                choices: $.value,
                loading: F.value,
                "selected-id": (M = m.tool) == null ? void 0 : M.id,
                onSelect: ne
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.3": t(() => {
            var re, M;
            return [
              e(de, {
                heading: `Pick a node running ${((re = m.tool) == null ? void 0 : re.name) ?? "…"}`,
                sub: "A node is a running instance of the tool.",
                choices: O.value,
                loading: P.value,
                "selected-id": (M = m.node) == null ? void 0 : M.id,
                onSelect: ue
              }, null, 8, ["heading", "choices", "loading", "selected-id"])
            ];
          }),
          "item.4": t(() => [
            d("div", pl, [
              c[11] || (c[11] = d("h3", { class: "text-h6 mb-2" }, "Subscription mode", -1)),
              c[12] || (c[12] = d("p", { class: "text-body-2 text-medium-emphasis mb-4" }, [
                d("strong", null, "Link"),
                l(" attaches this project to an existing instance in the tool. "),
                d("strong", null, "Create"),
                l(" additionally provisions a new instance inside the tool. ")
              ], -1)),
              e(De, {
                modelValue: m.mode,
                "onUpdate:modelValue": c[0] || (c[0] = (re) => m.mode = re),
                inline: ""
              }, {
                default: t(() => [
                  (r(!0), H(ve, null, ye(a.value, (re) => (r(), R(fe, {
                    key: re.value,
                    value: re.value,
                    label: re.label
                  }, null, 8, ["value", "label"]))), 128))
                ]),
                _: 1
              }, 8, ["modelValue"])
            ])
          ]),
          "item.5": t(() => {
            var re;
            return [
              d("div", vl, [
                c[16] || (c[16] = d("h3", { class: "text-h6 mb-1" }, "Parameters", -1)),
                d("p", fl, [
                  c[13] || (c[13] = l(" Values required to link the project to ", -1)),
                  d("code", null, w((re = m.node) == null ? void 0 : re.id), 1),
                  c[14] || (c[14] = l(". ", -1))
                ]),
                j.value ? (r(), R(Le, {
                  key: 0,
                  indeterminate: "",
                  color: "primary",
                  class: "mb-3"
                })) : W("", !0),
                !j.value && T.value.length === 0 ? (r(), R(Q, {
                  key: 1,
                  type: "info",
                  variant: "tonal",
                  density: "compact"
                }, {
                  default: t(() => [...c[15] || (c[15] = [
                    l(" This subscription requires no additional parameters — just click Create. ", -1)
                  ])]),
                  _: 1
                })) : W("", !0),
                e(Ee, {
                  ref_key: "paramFormRef",
                  ref: u
                }, {
                  default: t(() => [
                    (r(!0), H(ve, null, ye(T.value, (M) => (r(), H("div", {
                      key: M.id,
                      class: "mb-3"
                    }, [
                      y(M) ? (r(), R(he, {
                        key: 0,
                        modelValue: f[M.id],
                        "onUpdate:modelValue": (_e) => f[M.id] = _e,
                        type: Z(M) ? "password" : "text",
                        label: te(M),
                        rules: B(M),
                        hint: M.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "type", "label", "rules", "hint"])) : M.type === "integer" ? (r(), R(he, {
                        key: 1,
                        modelValue: f[M.id],
                        "onUpdate:modelValue": (_e) => f[M.id] = _e,
                        modelModifiers: { number: !0 },
                        type: "number",
                        min: M.min,
                        max: M.max,
                        label: te(M),
                        rules: B(M),
                        hint: M.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "max", "label", "rules", "hint"])) : M.type === "bool" ? (r(), R(Re, {
                        key: 2,
                        modelValue: f[M.id],
                        "onUpdate:modelValue": (_e) => f[M.id] = _e,
                        label: te(M),
                        hint: M.description,
                        "persistent-hint": "",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "hint"])) : M.type === "select" ? (r(), R($e, {
                        key: 3,
                        modelValue: f[M.id],
                        "onUpdate:modelValue": (_e) => f[M.id] = _e,
                        items: M.values || [],
                        label: te(M),
                        rules: B(M),
                        hint: M.description,
                        "persistent-hint": "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : M.type === "multiselect" || M.type === "tags" ? (r(), R($e, {
                        key: 4,
                        modelValue: f[M.id],
                        "onUpdate:modelValue": (_e) => f[M.id] = _e,
                        items: M.values || [],
                        label: te(M),
                        rules: B(M),
                        hint: M.description,
                        "persistent-hint": "",
                        chips: "",
                        multiple: "",
                        variant: "outlined",
                        density: "compact"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items", "label", "rules", "hint"])) : (r(), R(he, {
                        key: 5,
                        modelValue: f[M.id],
                        "onUpdate:modelValue": (_e) => f[M.id] = _e,
                        label: te(M),
                        rules: B(M),
                        hint: `${M.description || ""} [${M.type}]`,
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
          actions: t(({ prev: re, next: M }) => [
            d("div", _l, [
              b.value > 1 ? (r(), R(ie, {
                key: 0,
                variant: "text",
                "prepend-icon": "mdi-arrow-left",
                onClick: re
              }, {
                default: t(() => [...c[17] || (c[17] = [
                  l("Previous", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : W("", !0),
              e(Y),
              b.value < E.value.length ? (r(), R(ie, {
                key: 1,
                color: "primary",
                disabled: !g.value,
                "append-icon": "mdi-arrow-right",
                onClick: M
              }, {
                default: t(() => [...c[18] || (c[18] = [
                  l("Next", -1)
                ])]),
                _: 1
              }, 8, ["disabled", "onClick"])) : (r(), R(ie, {
                key: 2,
                color: "success",
                "prepend-icon": "mdi-check",
                loading: D.value,
                disabled: !m.node,
                onClick: q
              }, {
                default: t(() => [...c[19] || (c[19] = [
                  l("Create subscription", -1)
                ])]),
                _: 1
              }, 8, ["loading", "disabled"]))
            ])
          ]),
          _: 1
        }, 8, ["modelValue", "items", "editable"])) : W("", !0)
      ]);
    };
  }
}, je = /* @__PURE__ */ we(gl, [["__scopeId", "data-v-47b9f499"]]), yl = {
  sample: Ie.sample
}, Ue = [
  { path: "/home", name: "ui-home", component: dt },
  { path: "/home/manual", name: "ui-manual", component: Et },
  { path: "/home/project", name: "ui-project-list", component: wt },
  { path: "/home/project/:id", name: "ui-project-detail", component: Tt },
  { path: "/system", name: "ui-system", component: qt },
  { path: "/system/user", name: "ui-system-user", component: Ft },
  { path: "/system/role", name: "ui-system-role", component: Wt },
  { path: "/system/plugin", name: "ui-system-plugin", component: Kt },
  { path: "/system/node", name: "ui-system-node", component: Zt },
  { path: "/system/cache", name: "ui-system-cache", component: nl },
  { path: "/system/bench", name: "ui-system-bench", component: ol },
  { path: "/api", name: "ui-api", component: rl },
  { path: "/api/token", name: "ui-api-token", component: cl },
  { path: "/subscribe", name: "ui-subscribe", component: je },
  // Project-scoped entry used by ProjectDetailView's "Add subscription" button.
  { path: "/home/project/:id/subscription", name: "ui-subscribe-project", component: je }
], Al = {
  id: "ui",
  label: "UI",
  component: Ye,
  routes: Ue,
  install({ router: o }) {
    for (const h of Ue)
      o.addRoute(h);
  },
  feature(o, ...h) {
    const U = yl[o];
    if (!U) throw new Error(`Plugin "ui" has no feature "${o}"`);
    return U(...h);
  },
  service: Ie,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  Pl as TARGET_TYPE_ICON,
  Al as default,
  Te as getFullName,
  Ul as getHierarchyIds,
  mt as getService,
  $l as getServiceFromId,
  Sl as getServiceNameFromId,
  pt as getTool,
  Cl as getToolFromId,
  jl as getToolNameFromId,
  hl as htmlEscape,
  Vl as htmlUnescape,
  ft as normalize,
  Ie as service,
  ct as toUser2Letters,
  xl as trimObject
};
