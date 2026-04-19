import { resolveComponent as n, openBlock as v, createElementBlock as B, createVNode as e, withCtx as t, createTextVNode as l, ref as u, computed as ve, onMounted as oe, createElementVNode as c, Fragment as ie, renderList as de, createBlock as H, toDisplayString as g, createCommentVNode as G, normalizeClass as he, mergeProps as Se, unref as Q, withDirectives as Pe, withModifiers as fe, vShow as Ue, watch as ze, onBeforeUnmount as je } from "vue";
import { useApi as ue, useAppStore as se, useI18nStore as Ae, useDataTable as we, useErrorStore as De, useAuthStore as xe } from "@ligoj/host";
import { useRouter as Ce, useRoute as Ne } from "vue-router";
const _e = (o, _) => {
  const x = o.__vccOpts || o;
  for (const [V, z] of _)
    x[V] = z;
  return x;
}, Ie = { class: "plugin-ui-shell" }, Te = {
  __name: "UiPlugin",
  setup(o) {
    return (_, x) => {
      const V = n("v-alert"), z = n("v-list-subheader"), i = n("v-list-item"), T = n("v-list");
      return v(), B("div", Ie, [
        e(V, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...x[0] || (x[0] = [
            l(" plugin-ui is being migrated from the legacy Cascade.js implementation — most views below are placeholders and link back to their legacy sources. ", -1)
          ])]),
          _: 1
        }),
        e(T, {
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            e(z, null, {
              default: t(() => [...x[1] || (x[1] = [
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
              default: t(() => [...x[2] || (x[2] = [
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
              default: t(() => [...x[3] || (x[3] = [
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
              default: t(() => [...x[4] || (x[4] = [
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
}, Le = /* @__PURE__ */ _e(Te, [["__scopeId", "data-v-9cfeae95"]]), Ve = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, Re = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, Ee = {
  key: 0,
  class: "d-flex flex-wrap ga-1 mb-4"
}, Be = { class: "ml-1 text-caption" }, qe = { class: "d-flex align-start mb-2" }, Me = { class: "flex-grow-1 truncate" }, Oe = { class: "text-subtitle-1 font-weight-medium truncate" }, Fe = { class: "text-caption text-medium-emphasis" }, Ge = {
  key: 0,
  class: "sub-strip"
}, He = {
  key: 0,
  class: "text-caption text-medium-emphasis ml-1"
}, We = { style: { width: "28px" } }, Je = { class: "truncate" }, Xe = { class: "truncate text-medium-emphasis" }, Ye = {
  __name: "HomeView",
  setup(o) {
    const _ = ue(), x = se(), V = u(!1), z = u(null), i = u([]), T = u(""), y = u(null), h = u("md"), b = ve(() => {
      var w, M, P;
      const s = /* @__PURE__ */ new Map();
      for (const S of i.value) {
        const N = ((w = S.project) == null ? void 0 : w.id) ?? S.project;
        if (N == null) continue;
        let L = s.get(N);
        L || (L = {
          id: N,
          name: ((M = S.project) == null ? void 0 : M.name) || String(N),
          pkey: ((P = S.project) == null ? void 0 : P.pkey) || "",
          subscriptions: []
        }, s.set(N, L)), L.subscriptions.push(S);
      }
      return [...s.values()].sort((S, N) => S.name.localeCompare(N.name));
    }), A = ve(() => {
      var w, M, P;
      const s = /* @__PURE__ */ new Map();
      for (const S of i.value) {
        const N = ((P = (M = (w = S.node) == null ? void 0 : w.refined) == null ? void 0 : M.refined) == null ? void 0 : P.id) || "";
        N && s.set(N, (s.get(N) || 0) + 1);
      }
      return [...s.entries()].sort((S, N) => N[1] - S[1]).map(([S, N]) => ({
        id: S,
        count: N,
        icon: $(S),
        label: S.split(":").slice(-1)[0]
      }));
    }), C = ve(() => {
      var w;
      const s = (w = T.value) == null ? void 0 : w.trim().toLowerCase();
      return b.value.filter((M) => y.value && !M.subscriptions.some(
        (S) => {
          var N, L, d;
          return ((d = (L = (N = S.node) == null ? void 0 : N.refined) == null ? void 0 : L.refined) == null ? void 0 : d.id) === y.value;
        }
      ) ? !1 : !s || M.name.toLowerCase().includes(s) || M.pkey.toLowerCase().includes(s) ? !0 : M.subscriptions.some(
        (P) => {
          var S, N, L, d;
          return (((S = P.node) == null ? void 0 : S.name) || "").toLowerCase().includes(s) || (((N = P.node) == null ? void 0 : N.id) || "").toLowerCase().includes(s) || (((d = (L = P.node) == null ? void 0 : L.refined) == null ? void 0 : d.name) || "").toLowerCase().includes(s);
        }
      ));
    });
    function $(s) {
      return s.includes(":scm:") ? "mdi-source-branch" : s.includes(":build:") ? "mdi-hammer-wrench" : s.includes(":bt") ? "mdi-bug" : s.includes(":km:") ? "mdi-book-open-variant" : s.includes(":vm") ? "mdi-server" : s.includes(":prov") ? "mdi-cloud" : s.includes(":id") ? "mdi-account-group" : s.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    function q(s) {
      var w, M, P;
      return $(((P = (M = (w = s.node) == null ? void 0 : w.refined) == null ? void 0 : M.refined) == null ? void 0 : P.id) || "");
    }
    function D(s) {
      var S, N, L;
      const w = ((L = (N = (S = s.node) == null ? void 0 : S.refined) == null ? void 0 : N.refined) == null ? void 0 : L.id) || "", M = ["primary", "teal", "indigo", "purple", "orange", "blue-grey", "green"];
      let P = 0;
      for (const d of w) P += d.charCodeAt(0);
      return M[P % M.length];
    }
    async function k() {
      V.value = !0, z.value = null;
      const s = await _.get("rest/subscription");
      Array.isArray(s) ? i.value = s : Array.isArray(s == null ? void 0 : s.data) ? i.value = s.data : i.value = [], V.value = !1;
    }
    return oe(() => {
      x.setTitle("Dashboard"), x.setBreadcrumbs([{ title: "Home" }]), k();
    }), (s, w) => {
      const M = n("v-spacer"), P = n("v-text-field"), S = n("v-icon"), N = n("v-btn"), L = n("v-btn-toggle"), d = n("v-chip"), m = n("v-alert"), a = n("v-progress-linear"), j = n("v-tooltip"), p = n("v-table"), J = n("v-card-text"), Z = n("v-card");
      return v(), B("div", null, [
        c("div", Re, [
          w[6] || (w[6] = c("h1", { class: "text-h4" }, "Dashboard", -1)),
          e(M),
          e(P, {
            modelValue: T.value,
            "onUpdate:modelValue": w[0] || (w[0] = (R) => T.value = R),
            "prepend-inner-icon": "mdi-magnify",
            label: "Filter projects or tools",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field",
            clearable: ""
          }, null, 8, ["modelValue"]),
          e(L, {
            modelValue: h.value,
            "onUpdate:modelValue": w[1] || (w[1] = (R) => h.value = R),
            mandatory: "",
            density: "compact",
            color: "primary"
          }, {
            default: t(() => [
              e(N, {
                value: "sm",
                title: "Small tiles"
              }, {
                default: t(() => [
                  e(S, null, {
                    default: t(() => [...w[2] || (w[2] = [
                      l("mdi-view-comfy", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(N, {
                value: "md",
                title: "Medium tiles"
              }, {
                default: t(() => [
                  e(S, null, {
                    default: t(() => [...w[3] || (w[3] = [
                      l("mdi-view-grid", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              e(N, {
                value: "lg",
                title: "List"
              }, {
                default: t(() => [
                  e(S, null, {
                    default: t(() => [...w[4] || (w[4] = [
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
          e(N, {
            variant: "outlined",
            "prepend-icon": "mdi-folder-multiple",
            to: "/home/project"
          }, {
            default: t(() => [...w[5] || (w[5] = [
              l(" All projects ", -1)
            ])]),
            _: 1
          })
        ]),
        A.value.length ? (v(), B("div", Ee, [
          (v(!0), B(ie, null, de(A.value, (R) => (v(), H(d, {
            key: R.id,
            color: y.value === R.id ? "primary" : void 0,
            variant: y.value === R.id ? "elevated" : "tonal",
            size: "small",
            onClick: (U) => y.value = y.value === R.id ? null : R.id
          }, {
            default: t(() => [
              e(S, {
                start: "",
                size: "small"
              }, {
                default: t(() => [
                  l(g(R.icon), 1)
                ]),
                _: 2
              }, 1024),
              l(" " + g(R.label) + " ", 1),
              c("span", Be, g(R.count), 1)
            ]),
            _: 2
          }, 1032, ["color", "variant", "onClick"]))), 128))
        ])) : G("", !0),
        z.value ? (v(), H(m, {
          key: 1,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(g(z.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        V.value ? (v(), H(a, {
          key: 2,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : G("", !0),
        !V.value && C.value.length === 0 && !z.value ? (v(), H(m, {
          key: 3,
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...w[7] || (w[7] = [
            l(" No projects match the current filter. ", -1)
          ])]),
          _: 1
        })) : G("", !0),
        c("div", {
          class: he(["tile-grid", `size-${h.value}`])
        }, [
          (v(!0), B(ie, null, de(C.value, (R) => (v(), H(Z, {
            key: R.id,
            class: "tile",
            hover: "",
            to: `/home/project/${R.id}`
          }, {
            default: t(() => [
              e(J, { class: "pa-3" }, {
                default: t(() => [
                  c("div", qe, [
                    c("div", Me, [
                      c("div", Oe, g(R.name), 1),
                      c("div", Fe, g(R.pkey), 1)
                    ]),
                    e(d, {
                      size: "x-small",
                      variant: "tonal"
                    }, {
                      default: t(() => [
                        l(g(R.subscriptions.length), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  h.value !== "lg" ? (v(), B("div", Ge, [
                    (v(!0), B(ie, null, de(R.subscriptions.slice(0, h.value === "sm" ? 4 : 8), (U) => {
                      var f, le, te, F;
                      return v(), H(j, {
                        key: U.id,
                        text: `${((le = (f = U.node) == null ? void 0 : f.refined) == null ? void 0 : le.name) || "—"} → ${((te = U.node) == null ? void 0 : te.name) || ((F = U.node) == null ? void 0 : F.id)}`,
                        location: "top"
                      }, {
                        activator: t(({ props: r }) => [
                          e(S, Se({ ref_for: !0 }, r, {
                            size: "small",
                            color: D(U),
                            class: "mr-1"
                          }), {
                            default: t(() => [
                              l(g(q(U)), 1)
                            ]),
                            _: 2
                          }, 1040, ["color"])
                        ]),
                        _: 2
                      }, 1032, ["text"]);
                    }), 128)),
                    R.subscriptions.length > (h.value === "sm" ? 4 : 8) ? (v(), B("span", He, " +" + g(R.subscriptions.length - (h.value === "sm" ? 4 : 8)), 1)) : G("", !0)
                  ])) : (v(), H(p, {
                    key: 1,
                    density: "compact",
                    class: "mt-2",
                    style: { background: "transparent" }
                  }, {
                    default: t(() => [
                      c("tbody", null, [
                        (v(!0), B(ie, null, de(R.subscriptions, (U) => {
                          var f, le, te, F;
                          return v(), B("tr", {
                            key: U.id
                          }, [
                            c("td", We, [
                              e(S, {
                                size: "small",
                                color: D(U)
                              }, {
                                default: t(() => [
                                  l(g(q(U)), 1)
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            c("td", Je, g(((le = (f = U.node) == null ? void 0 : f.refined) == null ? void 0 : le.name) || "—"), 1),
                            c("td", Xe, g(((te = U.node) == null ? void 0 : te.name) || ((F = U.node) == null ? void 0 : F.id)), 1)
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
}, Ke = /* @__PURE__ */ _e(Ye, [["__scopeId", "data-v-3f6316a9"]]);
function ol(o) {
  if (!o || typeof o != "object") return o;
  for (const _ of Object.keys(o)) {
    const x = o[_];
    (x == null || x === "" || x === !1) && delete o[_];
  }
  return o;
}
function sl(o) {
  return typeof o != "string" ? "" : o.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function il(o) {
  return typeof o != "string" ? "" : o.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Qe(o) {
  if (!o) return "??";
  if (o.firstName && o.lastName)
    return o.firstName.charAt(0) + o.lastName.charAt(0);
  if (o.fullName) {
    const x = o.fullName.split(" ");
    return x.length === 1 ? o.fullName.charAt(0) + (o.fullName.length >= 2 ? o.fullName.charAt(1) : "") : x[0].charAt(0) + x[x.length - 1].charAt(0);
  }
  const _ = (o.id || o || "??").toString();
  return (_.length === 1 ? _ + _ : _).slice(0, 2);
}
function $e(o) {
  if (!o) return "";
  if (o.fullName) return o.fullName;
  if (o.firstName && o.lastName) return `${o.firstName} ${o.lastName}`;
  if (o.firstName) return `${o.firstName} ${(o.id || "").substring(1)}`;
  if (o.lastName) return `${be((o.id || "").charAt(0))}. ${o.lastName}`;
  const _ = (o.id || o || "??").toString();
  return `${be(_.charAt(0))}. ${be(_.substring(1))}`;
}
function be(o) {
  return o && o.charAt(0).toUpperCase() + o.slice(1);
}
function rl(o) {
  if (!o) return null;
  const _ = o.split(":");
  return _.length > 2 ? _.slice(0, 3).join("-") : null;
}
function ul(o) {
  if (!o) return null;
  const _ = o.split(":");
  return _.length > 1 ? _.slice(0, 2).join("-") : null;
}
function dl(o) {
  return (o || "").split(":")[1] || null;
}
function cl(o) {
  return (o || "").split(":")[2] || null;
}
function ml(o) {
  if (!o) return [];
  const _ = o.split(":"), x = [];
  for (let V = 2; V <= _.length; V++)
    x.push(_.slice(0, V).join("-"));
  return x;
}
function Ze(o) {
  return o ? (o.service || (o.service = o.refined && Ze(o.refined) || o), o.service) : null;
}
function et(o) {
  return o ? o.tool ? o.tool : o.refined ? (o.tool = o.refined.refined ? et(o.refined) : o, o.tool) : null : null;
}
const tt = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function lt(o) {
  return o ? o.replace(/[-[()\]${},;_:]/g, " ").replace(tt, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const pl = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, nt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, at = { class: "text-caption" }, ot = {
  key: 1,
  class: "text-disabled"
}, st = { class: "mb-4" }, it = {
  __name: "ProjectListView",
  setup(o) {
    const _ = Ce(), x = ue(), V = se(), { t: z } = Ae(), i = we("project", { defaultSort: "name" }), T = u(25);
    let y = null, h = {};
    const b = u(null), A = u(!1), C = u(null), $ = u({ name: "", pkey: "", teamLeader: "", description: "" }), q = u(!1), D = u(!1), k = u(null), s = u(!1), w = u(!1);
    let M = "";
    const P = ve(() => [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Description", key: "description", sortable: !1 },
      { title: "Manager", key: "teamLeader", sortable: !1, width: "220px" },
      { title: "Created", key: "createdDate", sortable: !0, width: "140px" },
      { title: "Subs", key: "nbSubscriptions", sortable: !1, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ]), S = {
      required: (U) => !!U || "Required",
      pkey: (U) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(U || "") || "Use lowercase letters, digits, dash"
    };
    function N(U) {
      if (!U) return "";
      const f = typeof U == "number" ? new Date(U) : new Date(U);
      return isNaN(f.getTime()) ? "" : f.toISOString().slice(0, 10);
    }
    function L(U) {
      h = U, i.load(U);
    }
    function d() {
      clearTimeout(y), y = setTimeout(
        () => i.load({ page: 1, itemsPerPage: T.value, sortBy: h.sortBy }),
        300
      );
    }
    function m(U) {
      const f = lt(U || "").split(" ").filter(Boolean);
      return f.length ? f.join("-") : "";
    }
    function a() {
      var f;
      if (((f = C.value) == null ? void 0 : f.nbSubscriptions) > 0) return;
      const U = m($.value.name);
      (!$.value.pkey || $.value.pkey === M) && ($.value.pkey = U, M = U);
    }
    function j() {
      C.value = null, $.value = { name: "", pkey: "", teamLeader: "", description: "" }, M = "", A.value = !0;
    }
    function p(U) {
      var f;
      C.value = U, $.value = {
        name: U.name || "",
        pkey: U.pkey || "",
        teamLeader: ((f = U.teamLeader) == null ? void 0 : f.id) || "",
        description: U.description || ""
      }, M = U.pkey || "", A.value = !0;
    }
    function J(U) {
      k.value = U, w.value = !1, D.value = !0;
    }
    async function Z() {
      var F, r, O;
      const { valid: U } = await b.value.validate();
      if (!U) return;
      if (i.demoMode.value) {
        A.value = !1;
        return;
      }
      q.value = !0;
      const f = {
        id: (F = C.value) == null ? void 0 : F.id,
        name: $.value.name,
        pkey: $.value.pkey,
        teamLeader: $.value.teamLeader,
        description: $.value.description
      }, le = (r = C.value) != null && r.id ? "put" : "post", te = await x[le]("rest/project", f);
      q.value = !1, te !== null && (A.value = !1, !((O = C.value) != null && O.id) && typeof te != "object" ? _.push(`/home/project/${te}`) : i.load(h));
    }
    async function R() {
      if (i.demoMode.value) {
        D.value = !1;
        return;
      }
      s.value = !0;
      const U = w.value ? "?deleteRemoteData=true" : "";
      await x.del(`rest/project/${k.value.id}${U}`), s.value = !1, D.value = !1, i.load(h);
    }
    return oe(() => {
      V.setTitle("Projects"), V.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), (U, f) => {
      const le = n("v-spacer"), te = n("v-text-field"), F = n("v-btn"), r = n("v-alert"), O = n("v-skeleton-loader"), W = n("v-avatar"), E = n("v-chip"), ee = n("v-icon"), ne = n("v-data-table-server"), I = n("v-card-title"), K = n("v-textarea"), ae = n("v-form"), ce = n("v-card-text"), ge = n("v-card-actions"), me = n("v-card"), pe = n("v-dialog"), ye = n("v-checkbox");
      return v(), B("div", null, [
        c("div", nt, [
          f[13] || (f[13] = c("h1", { class: "text-h4" }, "Projects", -1)),
          e(le),
          e(te, {
            modelValue: Q(i).search.value,
            "onUpdate:modelValue": [
              f[0] || (f[0] = (X) => Q(i).search.value = X),
              d
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(F, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: j
          }, {
            default: t(() => [...f[12] || (f[12] = [
              l(" New ", -1)
            ])]),
            _: 1
          })
        ]),
        Q(i).error.value ? (v(), H(r, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(g(Q(i).error.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        Q(i).demoMode.value ? (v(), H(r, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...f[14] || (f[14] = [
            l(" Running without a live backend — results below are sample data. ", -1)
          ])]),
          _: 1
        })) : G("", !0),
        Q(i).loading.value && Q(i).items.value.length === 0 ? (v(), H(O, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : G("", !0),
        Q(i).error.value ? G("", !0) : Pe((v(), H(ne, {
          key: 3,
          "items-per-page": T.value,
          "onUpdate:itemsPerPage": f[1] || (f[1] = (X) => T.value = X),
          headers: P.value,
          items: Q(i).items.value,
          "items-length": Q(i).totalItems.value,
          loading: Q(i).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": L,
          "onClick:row": f[2] || (f[2] = (X, { item: Y }) => Q(_).push(`/home/project/${Y.id}`))
        }, {
          "item.teamLeader": t(({ item: X }) => {
            var Y;
            return [
              (Y = X.teamLeader) != null && Y.id ? (v(), B(ie, { key: 0 }, [
                e(W, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: t(() => [
                    c("span", at, g(Q(Qe)(X.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                l(" " + g(Q($e)(X.teamLeader)), 1)
              ], 64)) : (v(), B("span", ot, "—"))
            ];
          }),
          "item.createdDate": t(({ item: X }) => [
            l(g(N(X.createdDate)), 1)
          ]),
          "item.nbSubscriptions": t(({ item: X }) => [
            e(E, {
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(g(X.nbSubscriptions || 0), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          "item.actions": t(({ item: X }) => [
            e(F, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: fe((Y) => p(X), ["stop"])
            }, {
              default: t(() => [
                e(ee, { size: "small" }, {
                  default: t(() => [...f[15] || (f[15] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(F, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: fe((Y) => J(X), ["stop"])
            }, {
              default: t(() => [
                e(ee, { size: "small" }, {
                  default: t(() => [...f[16] || (f[16] = [
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
          [Ue, Q(i).items.value.length > 0 || !Q(i).loading.value]
        ]),
        e(pe, {
          modelValue: A.value,
          "onUpdate:modelValue": f[8] || (f[8] = (X) => A.value = X),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(me, null, {
              default: t(() => [
                e(I, null, {
                  default: t(() => {
                    var X;
                    return [
                      l(g((X = C.value) != null && X.id ? "Edit project" : "New project"), 1)
                    ];
                  }),
                  _: 1
                }),
                e(ce, null, {
                  default: t(() => [
                    e(ae, {
                      ref_key: "formRef",
                      ref: b,
                      onSubmit: fe(Z, ["prevent"])
                    }, {
                      default: t(() => {
                        var X, Y;
                        return [
                          e(te, {
                            modelValue: $.value.name,
                            "onUpdate:modelValue": [
                              f[3] || (f[3] = (re) => $.value.name = re),
                              a
                            ],
                            label: "Name",
                            rules: [S.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          e(te, {
                            modelValue: $.value.pkey,
                            "onUpdate:modelValue": f[4] || (f[4] = (re) => $.value.pkey = re),
                            label: "Project key (pkey)",
                            rules: [S.required, S.pkey],
                            disabled: ((X = C.value) == null ? void 0 : X.nbSubscriptions) > 0,
                            hint: ((Y = C.value) == null ? void 0 : Y.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          e(te, {
                            modelValue: $.value.teamLeader,
                            "onUpdate:modelValue": f[5] || (f[5] = (re) => $.value.teamLeader = re),
                            label: "Team leader (user id)",
                            rules: [S.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(K, {
                            modelValue: $.value.description,
                            "onUpdate:modelValue": f[6] || (f[6] = (re) => $.value.description = re),
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
                e(ge, null, {
                  default: t(() => [
                    e(le),
                    e(F, {
                      variant: "text",
                      onClick: f[7] || (f[7] = (X) => A.value = !1)
                    }, {
                      default: t(() => [...f[17] || (f[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(F, {
                      color: "primary",
                      variant: "elevated",
                      loading: q.value,
                      onClick: Z
                    }, {
                      default: t(() => [...f[18] || (f[18] = [
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
        e(pe, {
          modelValue: D.value,
          "onUpdate:modelValue": f[11] || (f[11] = (X) => D.value = X),
          "max-width": "500"
        }, {
          default: t(() => [
            e(me, null, {
              default: t(() => [
                e(I, null, {
                  default: t(() => [...f[19] || (f[19] = [
                    l("Delete project", -1)
                  ])]),
                  _: 1
                }),
                e(ce, null, {
                  default: t(() => {
                    var X;
                    return [
                      c("p", st, [
                        f[20] || (f[20] = l(" Are you sure you want to delete ", -1)),
                        c("strong", null, g((X = k.value) == null ? void 0 : X.name), 1),
                        f[21] || (f[21] = l("? ", -1))
                      ]),
                      e(ye, {
                        modelValue: w.value,
                        "onUpdate:modelValue": f[9] || (f[9] = (Y) => w.value = Y),
                        label: "Also remove remote data associated with this project's subscriptions",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(ge, null, {
                  default: t(() => [
                    e(le),
                    e(F, {
                      variant: "text",
                      onClick: f[10] || (f[10] = (X) => D.value = !1)
                    }, {
                      default: t(() => [...f[22] || (f[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(F, {
                      color: "error",
                      variant: "elevated",
                      loading: s.value,
                      onClick: R
                    }, {
                      default: t(() => [...f[23] || (f[23] = [
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
}, rt = /* @__PURE__ */ _e(it, [["__scopeId", "data-v-6023d08b"]]), ut = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, dt = { class: "text-h4" }, ct = { class: "text-h6 text-medium-emphasis" }, mt = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, pt = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, vt = { key: 0 }, ft = {
  key: 0,
  class: "ml-1"
}, _t = { key: 1 }, gt = {
  key: 0,
  class: "ml-1"
}, yt = { key: 2 }, bt = {
  key: 0,
  class: "ml-1"
}, kt = { class: "d-flex align-center mb-2" }, wt = { class: "mb-3" }, xt = {
  __name: "ProjectDetailView",
  setup(o) {
    const _ = Ne();
    Ce();
    const x = ue(), V = se();
    De();
    const z = u(!1), i = u(null), T = ve(() => {
      var m;
      return ((m = i.value) == null ? void 0 : m.subscriptions) || [];
    }), y = u(null), h = u(!1), b = u({ name: "", pkey: "", teamLeader: "", description: "" }), A = u(!1), C = u(!1), $ = u(null), q = u(!1), D = u(!1), k = {
      required: (m) => !!m || "Required"
    }, s = [
      { title: "Service", key: "service", sortable: !1, width: "180px" },
      { title: "Tool", key: "tool", sortable: !1, width: "180px" },
      { title: "Node", key: "node", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function w(m) {
      if (!m) return "";
      const a = new Date(m);
      return isNaN(a.getTime()) ? "" : a.toISOString().slice(0, 16).replace("T", " ");
    }
    function M(m) {
      var J, Z, R;
      const a = ((R = (Z = (J = m.node) == null ? void 0 : J.refined) == null ? void 0 : Z.refined) == null ? void 0 : R.id) || "", j = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let p = 0;
      for (const U of a) p += U.charCodeAt(0);
      return j[p % j.length];
    }
    function P(m) {
      var j, p, J;
      const a = ((J = (p = (j = m.node) == null ? void 0 : j.refined) == null ? void 0 : p.refined) == null ? void 0 : J.id) || "";
      return a.includes(":scm:") ? "mdi-source-branch" : a.includes(":build:") ? "mdi-hammer-wrench" : a.includes(":bt") ? "mdi-bug" : a.includes(":km:") ? "mdi-book-open-variant" : a.includes(":vm") ? "mdi-server" : a.includes(":prov") ? "mdi-cloud" : a.includes(":id") ? "mdi-account-group" : a.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function S() {
      var j;
      z.value = !0;
      const m = _.params.id, a = await x.get(`rest/project/${m}`);
      i.value = a || null, z.value = !1, a && (b.value = {
        name: a.name || "",
        pkey: a.pkey || "",
        teamLeader: ((j = a.teamLeader) == null ? void 0 : j.id) || "",
        description: a.description || ""
      }, V.setTitle(a.name), V.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        { title: a.name }
      ]));
    }
    async function N() {
      const { valid: m } = await y.value.validate();
      if (!m) return;
      A.value = !0;
      const a = {
        id: i.value.id,
        name: b.value.name,
        pkey: b.value.pkey,
        teamLeader: b.value.teamLeader,
        description: b.value.description
      };
      await x.put("rest/project", a), A.value = !1, h.value = !1, await S();
    }
    function L(m) {
      $.value = m, q.value = !1, C.value = !0;
    }
    async function d() {
      D.value = !0, await x.del(`rest/subscription/${$.value.id}/${q.value ? "true" : "false"}`), D.value = !1, C.value = !1, await S();
    }
    return ze(() => _.params.id, (m) => {
      m && S();
    }), oe(S), (m, a) => {
      const j = n("v-skeleton-loader"), p = n("v-spacer"), J = n("v-btn"), Z = n("v-icon"), R = n("v-card-text"), U = n("v-card"), f = n("v-chip"), le = n("v-alert"), te = n("v-data-table"), F = n("v-card-title"), r = n("v-text-field"), O = n("v-textarea"), W = n("v-form"), E = n("v-card-actions"), ee = n("v-dialog"), ne = n("v-checkbox");
      return v(), B("div", null, [
        z.value && !i.value ? (v(), H(j, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : G("", !0),
        i.value ? (v(), B(ie, { key: 1 }, [
          c("div", ut, [
            c("div", null, [
              c("h1", dt, [
                l(g(i.value.name) + " ", 1),
                c("span", ct, "(" + g(i.value.pkey) + ")", 1)
              ]),
              i.value.description ? (v(), B("p", mt, g(i.value.description), 1)) : G("", !0)
            ]),
            e(p),
            i.value.manageSubscriptions ? (v(), H(J, {
              key: 0,
              color: "primary",
              "prepend-icon": "mdi-plus",
              to: `/home/project/${i.value.id}/subscription`
            }, {
              default: t(() => [...a[10] || (a[10] = [
                l(" Add subscription ", -1)
              ])]),
              _: 1
            }, 8, ["to"])) : G("", !0),
            e(J, {
              variant: "outlined",
              "prepend-icon": "mdi-pencil",
              onClick: a[0] || (a[0] = (I) => h.value = !0)
            }, {
              default: t(() => [...a[11] || (a[11] = [
                l(" Edit ", -1)
              ])]),
              _: 1
            })
          ]),
          e(U, {
            variant: "tonal",
            class: "mb-4"
          }, {
            default: t(() => [
              e(R, { class: "py-2" }, {
                default: t(() => [
                  c("div", pt, [
                    i.value.teamLeader ? (v(), B("span", vt, [
                      e(Z, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[12] || (a[12] = [
                          l("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      a[13] || (a[13] = c("strong", null, "Manager:", -1)),
                      l(" " + g(Q($e)(i.value.teamLeader)) + " ", 1),
                      i.value.teamLeader.id ? (v(), B("span", ft, "(" + g(i.value.teamLeader.id) + ")", 1)) : G("", !0)
                    ])) : G("", !0),
                    i.value.createdDate ? (v(), B("span", _t, [
                      e(Z, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[14] || (a[14] = [
                          l("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      a[15] || (a[15] = c("strong", null, "Created:", -1)),
                      l(" " + g(w(i.value.createdDate)) + " ", 1),
                      i.value.createdBy ? (v(), B("span", gt, " by " + g(i.value.createdBy.id || i.value.createdBy), 1)) : G("", !0)
                    ])) : G("", !0),
                    i.value.lastModifiedDate ? (v(), B("span", yt, [
                      e(Z, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[16] || (a[16] = [
                          l("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      a[17] || (a[17] = c("strong", null, "Updated:", -1)),
                      l(" " + g(w(i.value.lastModifiedDate)) + " ", 1),
                      i.value.lastModifiedBy ? (v(), B("span", bt, " by " + g(i.value.lastModifiedBy.id || i.value.lastModifiedBy), 1)) : G("", !0)
                    ])) : G("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          c("div", kt, [
            a[18] || (a[18] = c("h2", { class: "text-h6" }, "Subscriptions", -1)),
            e(f, {
              class: "ml-2",
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(g(T.value.length), 1)
              ]),
              _: 1
            })
          ]),
          T.value.length === 0 ? (v(), H(le, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: t(() => [...a[19] || (a[19] = [
              l(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (v(), H(te, {
            key: 1,
            headers: s,
            items: T.value,
            "item-value": "id",
            "items-per-page": -1,
            "hide-default-footer": "",
            density: "compact"
          }, {
            "item.service": t(({ item: I }) => [
              e(f, {
                size: "small",
                variant: "tonal",
                color: M(I)
              }, {
                default: t(() => {
                  var K, ae, ce;
                  return [
                    e(Z, {
                      start: "",
                      size: "small"
                    }, {
                      default: t(() => [
                        l(g(P(I)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    l(" " + g(((ce = (ae = (K = I.node) == null ? void 0 : K.refined) == null ? void 0 : ae.refined) == null ? void 0 : ce.name) || "—"), 1)
                  ];
                }),
                _: 2
              }, 1032, ["color"])
            ]),
            "item.tool": t(({ item: I }) => {
              var K, ae;
              return [
                l(g(((ae = (K = I.node) == null ? void 0 : K.refined) == null ? void 0 : ae.name) || "—"), 1)
              ];
            }),
            "item.node": t(({ item: I }) => {
              var K;
              return [
                c("code", null, g((K = I.node) == null ? void 0 : K.id), 1)
              ];
            }),
            "item.actions": t(({ item: I }) => [
              i.value.manageSubscriptions ? (v(), H(J, {
                key: 0,
                icon: "",
                size: "small",
                variant: "text",
                color: "error",
                onClick: (K) => L(I),
                title: "Unsubscribe"
              }, {
                default: t(() => [
                  e(Z, { size: "small" }, {
                    default: t(() => [...a[20] || (a[20] = [
                      l("mdi-close", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["onClick"])) : G("", !0)
            ]),
            _: 1
          }, 8, ["items"]))
        ], 64)) : G("", !0),
        e(ee, {
          modelValue: h.value,
          "onUpdate:modelValue": a[6] || (a[6] = (I) => h.value = I),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(U, null, {
              default: t(() => [
                e(F, null, {
                  default: t(() => [...a[21] || (a[21] = [
                    l("Edit project", -1)
                  ])]),
                  _: 1
                }),
                e(R, null, {
                  default: t(() => [
                    e(W, {
                      ref_key: "formRef",
                      ref: y,
                      onSubmit: fe(N, ["prevent"])
                    }, {
                      default: t(() => {
                        var I;
                        return [
                          e(r, {
                            modelValue: b.value.name,
                            "onUpdate:modelValue": a[1] || (a[1] = (K) => b.value.name = K),
                            label: "Name",
                            rules: [k.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(r, {
                            modelValue: b.value.pkey,
                            "onUpdate:modelValue": a[2] || (a[2] = (K) => b.value.pkey = K),
                            label: "Project key (pkey)",
                            rules: [k.required],
                            disabled: (((I = i.value) == null ? void 0 : I.nbSubscriptions) || T.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          e(r, {
                            modelValue: b.value.teamLeader,
                            "onUpdate:modelValue": a[3] || (a[3] = (K) => b.value.teamLeader = K),
                            label: "Team leader (user id)",
                            rules: [k.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(O, {
                            modelValue: b.value.description,
                            "onUpdate:modelValue": a[4] || (a[4] = (K) => b.value.description = K),
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
                e(E, null, {
                  default: t(() => [
                    e(p),
                    e(J, {
                      variant: "text",
                      onClick: a[5] || (a[5] = (I) => h.value = !1)
                    }, {
                      default: t(() => [...a[22] || (a[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(J, {
                      color: "primary",
                      variant: "elevated",
                      loading: A.value,
                      onClick: N
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
        e(ee, {
          modelValue: C.value,
          "onUpdate:modelValue": a[9] || (a[9] = (I) => C.value = I),
          "max-width": "480"
        }, {
          default: t(() => [
            e(U, null, {
              default: t(() => [
                e(F, null, {
                  default: t(() => [...a[24] || (a[24] = [
                    l("Unsubscribe", -1)
                  ])]),
                  _: 1
                }),
                e(R, null, {
                  default: t(() => {
                    var I, K;
                    return [
                      c("p", wt, [
                        a[25] || (a[25] = l(" Remove subscription to ", -1)),
                        c("strong", null, g((K = (I = $.value) == null ? void 0 : I.node) == null ? void 0 : K.name), 1),
                        a[26] || (a[26] = l("? ", -1))
                      ]),
                      e(ne, {
                        modelValue: q.value,
                        "onUpdate:modelValue": a[7] || (a[7] = (ae) => q.value = ae),
                        label: "Also delete remote data on the target service",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(E, null, {
                  default: t(() => [
                    e(p),
                    e(J, {
                      variant: "text",
                      onClick: a[8] || (a[8] = (I) => C.value = !1)
                    }, {
                      default: t(() => [...a[27] || (a[27] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(J, {
                      color: "error",
                      variant: "elevated",
                      loading: D.value,
                      onClick: d
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
}, Ct = { class: "mb-3" }, Vt = { class: "code-sample" }, $t = {
  __name: "ManualView",
  setup(o) {
    const _ = se(), x = xe(), V = "/", z = typeof window < "u" ? window.location.origin : "", i = ve(() => x.userName || "<you>");
    return oe(() => {
      _.setTitle("Manual"), _.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (T, y) => {
      const h = n("v-icon"), b = n("v-card-title"), A = n("v-card-text"), C = n("v-card"), $ = n("v-list-item"), q = n("v-list"), D = n("v-col"), k = n("router-link");
      n("v-code-block");
      const s = n("v-row");
      return v(), B("div", null, [
        y[12] || (y[12] = c("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        e(s, null, {
          default: t(() => [
            e(D, {
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
                        e(h, null, {
                          default: t(() => [...y[0] || (y[0] = [
                            l("mdi-book-open-page-variant", -1)
                          ])]),
                          _: 1
                        }),
                        y[1] || (y[1] = l(" Getting started ", -1))
                      ]),
                      _: 1
                    }),
                    e(A, null, {
                      default: t(() => [...y[2] || (y[2] = [
                        c("p", { class: "mb-2" }, " Ligoj aggregates the tools your projects rely on (source control, bug tracking, continuous integration, knowledge base, cloud provisioning) behind a single dashboard and API. ", -1),
                        c("p", { class: "mb-0" }, " Create a project, attach subscriptions, and hand your team a single entry point for everything. ", -1)
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
                    e(q, {
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
            e(D, {
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
                        e(h, null, {
                          default: t(() => [...y[3] || (y[3] = [
                            l("mdi-api", -1)
                          ])]),
                          _: 1
                        }),
                        y[4] || (y[4] = l(" Automation ", -1))
                      ]),
                      _: 1
                    }),
                    e(A, null, {
                      default: t(() => [
                        c("p", Ct, [
                          y[7] || (y[7] = l(" Every screen is backed by a REST endpoint. Browse the full catalogue on the ", -1)),
                          e(k, { to: "/api" }, {
                            default: t(() => [...y[5] || (y[5] = [
                              l("API reference page", -1)
                            ])]),
                            _: 1
                          }),
                          y[8] || (y[8] = l(" (OpenAPI / Swagger UI), and generate an ", -1)),
                          e(k, { to: "/api/token" }, {
                            default: t(() => [...y[6] || (y[6] = [
                              l("API token", -1)
                            ])]),
                            _: 1
                          }),
                          y[9] || (y[9] = l(" to call it from scripts without exposing your password. ", -1))
                        ]),
                        G("", !0),
                        c("pre", Vt, 'curl "' + g(Q(z)) + g(Q(V)) + "rest/project?api-key=<token>&api-user=" + g(i.value) + '"', 1)
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
                        e(h, null, {
                          default: t(() => [...y[10] || (y[10] = [
                            l("mdi-help-circle", -1)
                          ])]),
                          _: 1
                        }),
                        y[11] || (y[11] = l(" More resources ", -1))
                      ]),
                      _: 1
                    }),
                    e(q, {
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
}, ht = /* @__PURE__ */ _e($t, [["__scopeId", "data-v-bfb1a017"]]), St = { class: "pa-4" }, Pt = {
  __name: "SystemView",
  setup(o) {
    const _ = se(), x = [
      { to: "/system/user", icon: "mdi-account-multiple", title: "Users", subtitle: "Active sessions and accounts" },
      { to: "/system/role", icon: "mdi-shield-account", title: "Roles", subtitle: "Authorization rules" },
      { to: "/system/plugin", icon: "mdi-puzzle", title: "Plugins", subtitle: "Installed feature plugins" },
      { to: "/system/node", icon: "mdi-server", title: "Nodes", subtitle: "Service & tool registrations" },
      { to: "/system/cache", icon: "mdi-database-refresh", title: "Cache", subtitle: "Invalidate application caches" },
      { to: "/system/bench", icon: "mdi-speedometer", title: "Bench", subtitle: "Diagnostics" }
    ];
    return oe(() => {
      _.setTitle("System"), _.setBreadcrumbs([{ title: "System" }]);
    }), (V, z) => {
      const i = n("v-list-item"), T = n("v-list");
      return v(), B("div", St, [
        z[0] || (z[0] = c("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        e(T, null, {
          default: t(() => [
            (v(), B(ie, null, de(x, (y) => e(i, {
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
}, Ut = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, zt = {
  __name: "SystemUserView",
  setup(o) {
    const _ = ue(), x = se(), V = we("system/user/roles", { defaultSort: "login" }), z = u(25);
    let i = null, T = {};
    const y = u([]), h = u(null), b = u(!1), A = u(null), C = u({ login: "", roles: [] }), $ = u(!1), q = u(!1), D = u(null), k = u(!1), s = {
      required: (j) => !!j || "Required",
      requiredArray: (j) => Array.isArray(j) && j.length > 0 || "Pick at least one role"
    }, w = [
      { title: "Login", key: "login", sortable: !0, width: "220px" },
      { title: "Roles", key: "roles", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    function M(j) {
      T = j, V.load(j);
    }
    function P() {
      clearTimeout(i), i = setTimeout(
        () => V.load({ page: 1, itemsPerPage: z.value, sortBy: T.sortBy }),
        300
      );
    }
    async function S() {
      const j = await _.get("rest/system/security/role");
      Array.isArray(j) ? y.value = j : Array.isArray(j == null ? void 0 : j.data) && (y.value = j.data);
    }
    function N() {
      A.value = null, C.value = { login: "", roles: [] }, b.value = !0;
    }
    function L(j) {
      A.value = j, C.value = {
        login: j.login,
        roles: (j.roles || []).map((p) => p.id)
      }, b.value = !0;
    }
    function d(j) {
      D.value = j, q.value = !0;
    }
    async function m() {
      const { valid: j } = await h.value.validate();
      if (!j) return;
      $.value = !0;
      const p = { login: C.value.login, roles: C.value.roles }, J = A.value ? "put" : "post";
      await _[J]("rest/system/user", p), $.value = !1, b.value = !1, V.load(T);
    }
    async function a() {
      k.value = !0, await _.del(`rest/system/user/${encodeURIComponent(D.value.login)}`), k.value = !1, q.value = !1, V.load(T);
    }
    return oe(() => {
      x.setTitle("System users"), x.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]), S();
    }), (j, p) => {
      const J = n("v-spacer"), Z = n("v-text-field"), R = n("v-btn"), U = n("v-alert"), f = n("v-chip"), le = n("v-icon"), te = n("v-data-table-server"), F = n("v-card-title"), r = n("v-autocomplete"), O = n("v-form"), W = n("v-card-text"), E = n("v-card-actions"), ee = n("v-card"), ne = n("v-dialog");
      return v(), B("div", null, [
        c("div", Ut, [
          p[9] || (p[9] = c("h1", { class: "text-h4" }, "System users", -1)),
          e(J),
          e(Z, {
            modelValue: Q(V).search.value,
            "onUpdate:modelValue": [
              p[0] || (p[0] = (I) => Q(V).search.value = I),
              P
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(R, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: N
          }, {
            default: t(() => [...p[8] || (p[8] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        Q(V).error.value ? (v(), H(U, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(g(Q(V).error.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        e(te, {
          headers: w,
          items: Q(V).items.value,
          "items-length": Q(V).totalItems.value,
          loading: Q(V).loading.value,
          "items-per-page": z.value,
          "onUpdate:itemsPerPage": p[1] || (p[1] = (I) => z.value = I),
          "item-value": "login",
          hover: "",
          "onUpdate:options": M
        }, {
          "item.roles": t(({ item: I }) => [
            (v(!0), B(ie, null, de(I.roles || [], (K) => (v(), H(f, {
              key: K.id,
              size: "x-small",
              variant: "tonal",
              class: "mr-1"
            }, {
              default: t(() => [
                l(g(K.name), 1)
              ]),
              _: 2
            }, 1024))), 128))
          ]),
          "item.actions": t(({ item: I }) => [
            e(R, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (K) => L(I)
            }, {
              default: t(() => [
                e(le, { size: "small" }, {
                  default: t(() => [...p[10] || (p[10] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(R, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (K) => d(I)
            }, {
              default: t(() => [
                e(le, { size: "small" }, {
                  default: t(() => [...p[11] || (p[11] = [
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
        e(ne, {
          modelValue: b.value,
          "onUpdate:modelValue": p[5] || (p[5] = (I) => b.value = I),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(ee, null, {
              default: t(() => [
                e(F, null, {
                  default: t(() => [
                    l(g(A.value ? "Edit system user" : "New system user"), 1)
                  ]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => [
                    e(O, {
                      ref_key: "formRef",
                      ref: h,
                      onSubmit: fe(m, ["prevent"])
                    }, {
                      default: t(() => [
                        e(Z, {
                          modelValue: C.value.login,
                          "onUpdate:modelValue": p[2] || (p[2] = (I) => C.value.login = I),
                          label: "Login",
                          rules: [s.required],
                          disabled: !!A.value,
                          variant: "outlined",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules", "disabled"]),
                        e(r, {
                          modelValue: C.value.roles,
                          "onUpdate:modelValue": p[3] || (p[3] = (I) => C.value.roles = I),
                          label: "Roles",
                          items: y.value,
                          "item-value": "id",
                          "item-title": "name",
                          multiple: "",
                          chips: "",
                          "closable-chips": "",
                          variant: "outlined",
                          rules: [s.requiredArray]
                        }, null, 8, ["modelValue", "items", "rules"])
                      ]),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(E, null, {
                  default: t(() => [
                    e(J),
                    e(R, {
                      variant: "text",
                      onClick: p[4] || (p[4] = (I) => b.value = !1)
                    }, {
                      default: t(() => [...p[12] || (p[12] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(R, {
                      color: "primary",
                      variant: "elevated",
                      loading: $.value,
                      onClick: m
                    }, {
                      default: t(() => [...p[13] || (p[13] = [
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
          modelValue: q.value,
          "onUpdate:modelValue": p[7] || (p[7] = (I) => q.value = I),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ee, null, {
              default: t(() => [
                e(F, null, {
                  default: t(() => [...p[14] || (p[14] = [
                    l("Delete system user", -1)
                  ])]),
                  _: 1
                }),
                e(W, null, {
                  default: t(() => {
                    var I;
                    return [
                      p[15] || (p[15] = l("Remove ", -1)),
                      c("strong", null, g((I = D.value) == null ? void 0 : I.login), 1),
                      p[16] || (p[16] = l(" from system accounts?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(E, null, {
                  default: t(() => [
                    e(J),
                    e(R, {
                      variant: "text",
                      onClick: p[6] || (p[6] = (I) => q.value = !1)
                    }, {
                      default: t(() => [...p[17] || (p[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(R, {
                      color: "error",
                      variant: "elevated",
                      loading: k.value,
                      onClick: a
                    }, {
                      default: t(() => [...p[18] || (p[18] = [
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
}, jt = /* @__PURE__ */ _e(zt, [["__scopeId", "data-v-3bd83da2"]]), At = { class: "d-flex align-center mb-4" }, Dt = {
  __name: "SystemRoleView",
  setup(o) {
    const _ = ue(), x = se(), V = u([]), z = u(!1), i = u(null), T = u(null), y = u(!1), h = u(null), b = u({ name: "", apiPatterns: [], uiPatterns: [] }), A = u(!1), C = u(!1), $ = u(null), q = u(!1), D = { required: (L) => !!L || "Required" }, k = [
      { title: "Name", key: "name", sortable: !0, width: "180px" },
      { title: "API patterns", key: "authApi", sortable: !1 },
      { title: "UI patterns", key: "authUi", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    async function s() {
      z.value = !0, i.value = null;
      const L = await _.get("rest/system/security/role/withAuth"), d = (L == null ? void 0 : L.data) || L || [];
      for (const m of d)
        m["authorizations-api"] = (m.authorizations || []).filter((a) => a.type === "api"), m["authorizations-ui"] = (m.authorizations || []).filter((a) => a.type === "ui");
      V.value = d, z.value = !1;
    }
    function w() {
      h.value = null, b.value = { name: "", apiPatterns: [], uiPatterns: [] }, y.value = !0;
    }
    function M(L) {
      h.value = L, b.value = {
        name: L.name,
        apiPatterns: (L["authorizations-api"] || []).map((d) => d.pattern),
        uiPatterns: (L["authorizations-ui"] || []).map((d) => d.pattern)
      }, y.value = !0;
    }
    function P(L) {
      $.value = L, C.value = !0;
    }
    async function S() {
      var a;
      const { valid: L } = await T.value.validate();
      if (!L) return;
      A.value = !0;
      const d = {
        id: (a = h.value) == null ? void 0 : a.id,
        name: b.value.name,
        authorizations: [
          ...b.value.apiPatterns.map((j) => ({ pattern: j, type: "api" })),
          ...b.value.uiPatterns.map((j) => ({ pattern: j, type: "ui" }))
        ]
      }, m = h.value ? "put" : "post";
      await _[m]("rest/system/security/role", d), A.value = !1, y.value = !1, s();
    }
    async function N() {
      q.value = !0, await _.del(`rest/system/security/role/${$.value.id}`), q.value = !1, C.value = !1, s();
    }
    return oe(() => {
      x.setTitle("Roles"), x.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]), s();
    }), (L, d) => {
      const m = n("v-spacer"), a = n("v-btn"), j = n("v-alert"), p = n("v-icon"), J = n("v-data-table"), Z = n("v-card-title"), R = n("v-text-field"), U = n("v-combobox"), f = n("v-form"), le = n("v-card-text"), te = n("v-card-actions"), F = n("v-card"), r = n("v-dialog");
      return v(), B("div", null, [
        c("div", At, [
          d[8] || (d[8] = c("h1", { class: "text-h4" }, "Roles", -1)),
          e(m),
          e(a, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: w
          }, {
            default: t(() => [...d[7] || (d[7] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        i.value ? (v(), H(j, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(g(i.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        e(J, {
          headers: k,
          items: V.value,
          loading: z.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.authApi": t(({ item: O }) => [
            (v(!0), B(ie, null, de(O["authorizations-api"], (W) => (v(), B("code", {
              key: W.id || W.pattern,
              class: "auth-token"
            }, g(W.pattern), 1))), 128))
          ]),
          "item.authUi": t(({ item: O }) => [
            (v(!0), B(ie, null, de(O["authorizations-ui"], (W) => (v(), B("code", {
              key: W.id || W.pattern,
              class: "auth-token"
            }, g(W.pattern), 1))), 128))
          ]),
          "item.actions": t(({ item: O }) => [
            e(a, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (W) => M(O)
            }, {
              default: t(() => [
                e(p, { size: "small" }, {
                  default: t(() => [...d[9] || (d[9] = [
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
              onClick: (W) => P(O)
            }, {
              default: t(() => [
                e(p, { size: "small" }, {
                  default: t(() => [...d[10] || (d[10] = [
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
        e(r, {
          modelValue: y.value,
          "onUpdate:modelValue": d[4] || (d[4] = (O) => y.value = O),
          "max-width": "640",
          persistent: ""
        }, {
          default: t(() => [
            e(F, null, {
              default: t(() => [
                e(Z, null, {
                  default: t(() => [
                    l(g(h.value ? "Edit role" : "New role"), 1)
                  ]),
                  _: 1
                }),
                e(le, null, {
                  default: t(() => [
                    e(f, {
                      ref_key: "formRef",
                      ref: T,
                      onSubmit: fe(S, ["prevent"])
                    }, {
                      default: t(() => [
                        e(R, {
                          modelValue: b.value.name,
                          "onUpdate:modelValue": d[0] || (d[0] = (O) => b.value.name = O),
                          label: "Name",
                          rules: [D.required],
                          variant: "outlined",
                          class: "mb-4",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(U, {
                          modelValue: b.value.apiPatterns,
                          "onUpdate:modelValue": d[1] || (d[1] = (O) => b.value.apiPatterns = O),
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
                        e(U, {
                          modelValue: b.value.uiPatterns,
                          "onUpdate:modelValue": d[2] || (d[2] = (O) => b.value.uiPatterns = O),
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
                e(te, null, {
                  default: t(() => [
                    e(m),
                    e(a, {
                      variant: "text",
                      onClick: d[3] || (d[3] = (O) => y.value = !1)
                    }, {
                      default: t(() => [...d[11] || (d[11] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "primary",
                      variant: "elevated",
                      loading: A.value,
                      onClick: S
                    }, {
                      default: t(() => [...d[12] || (d[12] = [
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
        e(r, {
          modelValue: C.value,
          "onUpdate:modelValue": d[6] || (d[6] = (O) => C.value = O),
          "max-width": "420"
        }, {
          default: t(() => [
            e(F, null, {
              default: t(() => [
                e(Z, null, {
                  default: t(() => [...d[13] || (d[13] = [
                    l("Delete role", -1)
                  ])]),
                  _: 1
                }),
                e(le, null, {
                  default: t(() => {
                    var O;
                    return [
                      d[14] || (d[14] = l("Delete role ", -1)),
                      c("strong", null, g((O = $.value) == null ? void 0 : O.name), 1),
                      d[15] || (d[15] = l("?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => [
                    e(m),
                    e(a, {
                      variant: "text",
                      onClick: d[5] || (d[5] = (O) => C.value = !1)
                    }, {
                      default: t(() => [...d[16] || (d[16] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "error",
                      variant: "elevated",
                      loading: q.value,
                      onClick: N
                    }, {
                      default: t(() => [...d[17] || (d[17] = [
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
}, Nt = /* @__PURE__ */ _e(Dt, [["__scopeId", "data-v-e3ba71a8"]]), It = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, Tt = { key: 0 }, Lt = { key: 0 }, Rt = {
  __name: "SystemPluginView",
  setup(o) {
    const _ = ue(), x = se(), V = [
      { id: "central", label: "Maven Central" },
      { id: "nexus", label: "OSSRH Nexus" }
    ], z = u("central"), i = u([]), T = u(!1), y = u(null), h = u(!1), b = u(!1), A = u(!1), C = u(""), $ = u(!1), q = u(!1), D = [
      { title: "", key: "type", sortable: !1, width: "40px" },
      { title: "Artifact", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0 },
      { title: "Vendor", key: "vendor", sortable: !0, width: "160px" },
      { title: "Version", key: "version", sortable: !1, width: "280px" },
      { title: "Nodes", key: "nodes", sortable: !0, width: "80px", align: "center" },
      { title: "Subs", key: "subscriptions", sortable: !0, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function k(d) {
      var a, j;
      const m = (j = (a = d.plugin) == null ? void 0 : a.type) == null ? void 0 : j.toLowerCase();
      return m ? m === "feature" ? "mdi-wrench" : m === "service" ? "mdi-puzzle" : m === "tool" ? "mdi-hammer-wrench" : "mdi-puzzle" : "mdi-link-off";
    }
    async function s() {
      T.value = !0, y.value = null;
      const d = await _.get(`rest/system/plugin?repository=${z.value}`);
      i.value = Array.isArray(d) ? d : (d == null ? void 0 : d.data) || [], T.value = !1;
    }
    async function w() {
      h.value = !0, await _.put(`rest/system/plugin/cache?repository=${z.value}`), h.value = !1, s();
    }
    async function M() {
      b.value = !0, await _.put("rest/system/plugin/restart"), b.value = !1;
    }
    async function P(d, m = !1) {
      q.value = !0;
      const a = `repository=${z.value}&javadoc=${m ? !1 : $.value}`;
      await _.post(`rest/system/plugin/${encodeURIComponent(d)}?${a}`), q.value = !1, A.value = !1, C.value = "", $.value = !1, s();
    }
    function S() {
      C.value && P(C.value.trim());
    }
    async function N(d) {
      await _.del(`rest/system/plugin/${d.plugin.artifact}/${d.latestLocalVersion}`), s();
    }
    async function L(d) {
      confirm(`Delete plug-in ${d}?`) && (await _.del(`rest/system/plugin/${d}`), s());
    }
    return oe(() => {
      x.setTitle("Plug-ins"), x.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plug-ins" }]), s();
    }), (d, m) => {
      const a = n("v-spacer"), j = n("v-select"), p = n("v-btn"), J = n("v-alert"), Z = n("v-icon"), R = n("v-chip"), U = n("v-data-table"), f = n("v-card-title"), le = n("v-text-field"), te = n("v-checkbox"), F = n("v-card-text"), r = n("v-card-actions"), O = n("v-card"), W = n("v-dialog");
      return v(), B("div", null, [
        c("div", It, [
          m[9] || (m[9] = c("h1", { class: "text-h4" }, "Plugins", -1)),
          e(a),
          e(j, {
            modelValue: z.value,
            "onUpdate:modelValue": [
              m[0] || (m[0] = (E) => z.value = E),
              s
            ],
            items: V,
            "item-value": "id",
            "item-title": "label",
            label: "Repository",
            density: "compact",
            "hide-details": "",
            variant: "outlined",
            style: { "max-width": "200px" }
          }, null, 8, ["modelValue"]),
          e(p, {
            variant: "outlined",
            "prepend-icon": "mdi-magnify-plus",
            onClick: w,
            loading: h.value
          }, {
            default: t(() => [...m[6] || (m[6] = [
              l(" Check versions ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(p, {
            color: "error",
            variant: "outlined",
            "prepend-icon": "mdi-restart",
            onClick: M,
            loading: b.value
          }, {
            default: t(() => [...m[7] || (m[7] = [
              l(" Restart ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(p, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: m[1] || (m[1] = (E) => A.value = !0)
          }, {
            default: t(() => [...m[8] || (m[8] = [
              l("Install", -1)
            ])]),
            _: 1
          })
        ]),
        y.value ? (v(), H(J, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(g(y.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        e(U, {
          headers: D,
          items: i.value,
          loading: T.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.type": t(({ item: E }) => {
            var ee;
            return [
              e(Z, {
                size: "small",
                title: (ee = E.plugin) == null ? void 0 : ee.type
              }, {
                default: t(() => [
                  l(g(k(E)), 1)
                ]),
                _: 2
              }, 1032, ["title"])
            ];
          }),
          "item.version": t(({ item: E }) => {
            var ee;
            return [
              c("span", null, g(((ee = E.plugin) == null ? void 0 : ee.version) || "—"), 1),
              E.latestLocalVersion ? (v(), H(R, {
                key: 0,
                size: "x-small",
                color: "primary",
                class: "ml-1",
                closable: "",
                "onClick:close": (ne) => N(E),
                title: "Cancel local install"
              }, {
                default: t(() => [
                  l(g(E.latestLocalVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick:close"])) : G("", !0),
              E.newVersion && E.newVersion !== E.latestLocalVersion ? (v(), H(R, {
                key: 1,
                size: "x-small",
                color: "success",
                class: "ml-1",
                onClick: (ne) => P(E.plugin.artifact, !0),
                title: "Upgrade available — click to install"
              }, {
                default: t(() => [
                  e(Z, {
                    start: "",
                    size: "x-small"
                  }, {
                    default: t(() => [...m[10] || (m[10] = [
                      l("mdi-arrow-up", -1)
                    ])]),
                    _: 1
                  }),
                  l(g(E.newVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : G("", !0)
            ];
          }),
          "item.nodes": t(({ item: E }) => {
            var ee, ne;
            return [
              ((ne = (ee = E.plugin) == null ? void 0 : ee.type) == null ? void 0 : ne.toLowerCase()) !== "feature" ? (v(), B("span", Tt, g(E.nodes ?? 0), 1)) : G("", !0)
            ];
          }),
          "item.subscriptions": t(({ item: E }) => {
            var ee, ne;
            return [
              ((ne = (ee = E.plugin) == null ? void 0 : ee.type) == null ? void 0 : ne.toLowerCase()) !== "feature" ? (v(), B("span", Lt, g(E.subscriptions ?? 0), 1)) : G("", !0)
            ];
          }),
          "item.actions": t(({ item: E }) => [
            E.deleted ? (v(), H(Z, {
              key: 0,
              size: "small",
              color: "warning",
              title: "Deletion scheduled"
            }, {
              default: t(() => [...m[11] || (m[11] = [
                l("mdi-cancel", -1)
              ])]),
              _: 1
            })) : (v(), H(p, {
              key: 1,
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (ee) => L(E.plugin.artifact),
              title: "Delete plug-in"
            }, {
              default: t(() => [
                e(Z, { size: "small" }, {
                  default: t(() => [...m[12] || (m[12] = [
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
        e(W, {
          modelValue: A.value,
          "onUpdate:modelValue": m[5] || (m[5] = (E) => A.value = E),
          "max-width": "520"
        }, {
          default: t(() => [
            e(O, null, {
              default: t(() => [
                e(f, null, {
                  default: t(() => [...m[13] || (m[13] = [
                    l("Install plug-in", -1)
                  ])]),
                  _: 1
                }),
                e(F, null, {
                  default: t(() => [
                    e(le, {
                      modelValue: C.value,
                      "onUpdate:modelValue": m[2] || (m[2] = (E) => C.value = E),
                      label: "Artifact id (e.g. plugin-prov-aws)",
                      variant: "outlined",
                      hint: `Repository: ${z.value}`,
                      "persistent-hint": "",
                      class: "mb-2",
                      autofocus: ""
                    }, null, 8, ["modelValue", "hint"]),
                    e(te, {
                      modelValue: $.value,
                      "onUpdate:modelValue": m[3] || (m[3] = (E) => $.value = E),
                      label: "Install Javadoc bundle",
                      density: "compact",
                      "hide-details": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                e(r, null, {
                  default: t(() => [
                    e(a),
                    e(p, {
                      variant: "text",
                      onClick: m[4] || (m[4] = (E) => A.value = !1)
                    }, {
                      default: t(() => [...m[14] || (m[14] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(p, {
                      color: "primary",
                      variant: "elevated",
                      loading: q.value,
                      disabled: !C.value,
                      onClick: S
                    }, {
                      default: t(() => [...m[15] || (m[15] = [
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
}, Et = { class: "d-flex align-center mb-4" }, Bt = {
  __name: "SystemNodeView",
  setup(o) {
    const _ = ue(), x = se(), V = u([]), z = u(!1), i = u(null), T = u(!1), y = u(null), h = u(!1), b = [
      { title: "Identifier", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Status", key: "status", sortable: !0, width: "120px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function A(D) {
      var s;
      const k = (s = D == null ? void 0 : D.toLowerCase) == null ? void 0 : s.call(D);
      return k === "up" ? "success" : k === "down" ? "error" : k === "unknown" ? "warning" : "grey";
    }
    async function C() {
      z.value = !0, i.value = null;
      const D = await _.get("rest/node");
      V.value = Array.isArray(D) ? D : (D == null ? void 0 : D.data) || [], z.value = !1;
    }
    function $(D) {
      y.value = D, T.value = !0;
    }
    async function q() {
      h.value = !0, await _.del(`rest/node/${encodeURIComponent(y.value.id)}`), h.value = !1, T.value = !1, C();
    }
    return oe(() => {
      x.setTitle("Nodes"), x.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]), C();
    }), (D, k) => {
      const s = n("v-spacer"), w = n("v-btn"), M = n("v-alert"), P = n("v-chip"), S = n("v-icon"), N = n("v-data-table"), L = n("v-card-title"), d = n("v-card-text"), m = n("v-card-actions"), a = n("v-card"), j = n("v-dialog");
      return v(), B("div", null, [
        c("div", Et, [
          k[3] || (k[3] = c("h1", { class: "text-h4" }, "Nodes", -1)),
          e(s),
          e(w, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            to: "/subscribe"
          }, {
            default: t(() => [...k[2] || (k[2] = [
              l("New subscription", -1)
            ])]),
            _: 1
          })
        ]),
        i.value ? (v(), H(M, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(g(i.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        e(N, {
          headers: b,
          items: V.value,
          loading: z.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.id": t(({ item: p }) => [
            c("code", null, g(p.id), 1)
          ]),
          "item.status": t(({ item: p }) => [
            p.status ? (v(), H(P, {
              key: 0,
              size: "x-small",
              color: A(p.status),
              variant: "tonal"
            }, {
              default: t(() => [
                l(g(p.status), 1)
              ]),
              _: 2
            }, 1032, ["color"])) : G("", !0)
          ]),
          "item.actions": t(({ item: p }) => [
            e(w, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (J) => $(p)
            }, {
              default: t(() => [
                e(S, { size: "small" }, {
                  default: t(() => [...k[4] || (k[4] = [
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
          modelValue: T.value,
          "onUpdate:modelValue": k[1] || (k[1] = (p) => T.value = p),
          "max-width": "460"
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(L, null, {
                  default: t(() => [...k[5] || (k[5] = [
                    l("Delete node", -1)
                  ])]),
                  _: 1
                }),
                e(d, null, {
                  default: t(() => {
                    var p, J;
                    return [
                      k[6] || (k[6] = l(" Delete ", -1)),
                      c("strong", null, g((p = y.value) == null ? void 0 : p.name), 1),
                      k[7] || (k[7] = l(" (", -1)),
                      c("code", null, g((J = y.value) == null ? void 0 : J.id), 1),
                      k[8] || (k[8] = l(")? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(m, null, {
                  default: t(() => [
                    e(s),
                    e(w, {
                      variant: "text",
                      onClick: k[0] || (k[0] = (p) => T.value = !1)
                    }, {
                      default: t(() => [...k[9] || (k[9] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(w, {
                      color: "error",
                      variant: "elevated",
                      loading: h.value,
                      onClick: q
                    }, {
                      default: t(() => [...k[10] || (k[10] = [
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
}, qt = { class: "d-flex align-center mb-4" }, Mt = { class: "d-flex align-center ga-2" }, Ot = { class: "d-flex align-center ga-2" }, Ft = {
  __name: "SystemCacheView",
  setup(o) {
    const _ = ue(), x = se(), V = u([]), z = u(!1), i = u(null), T = u(null), y = [
      { title: "Cache", key: "id", sortable: !0 },
      { title: "Size", key: "size", sortable: !0, width: "100px" },
      { title: "Hits", key: "hitCount", sortable: !0, width: "160px" },
      { title: "Misses", key: "missCount", sortable: !0, width: "160px" },
      { title: "Avg get (ms)", key: "averageGetTime", sortable: !0, width: "140px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function h(C, $, q) {
      return $ && q === 1 || C >= 90 ? "success" : C >= 80 ? "primary" : C >= 50 ? "warning" : "error";
    }
    async function b() {
      z.value = !0, i.value = null;
      const C = await _.get("rest/system/cache");
      Array.isArray(C) ? V.value = C : C === null && (i.value = "Unable to load caches"), z.value = !1;
    }
    async function A(C) {
      T.value = C.id, await _.post(`rest/system/cache/${encodeURIComponent(C.id)}`), T.value = null, b();
    }
    return oe(() => {
      x.setTitle("Caches"), x.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Caches" }]), b();
    }), (C, $) => {
      const q = n("v-spacer"), D = n("v-btn"), k = n("v-alert"), s = n("v-chip"), w = n("v-icon"), M = n("v-data-table");
      return v(), B("div", null, [
        c("div", qt, [
          $[1] || ($[1] = c("h1", { class: "text-h4" }, "Caches", -1)),
          e(q),
          e(D, {
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
        i.value ? (v(), H(k, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(g(i.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        e(M, {
          headers: y,
          items: V.value,
          loading: z.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.hitCount": t(({ item: P }) => [
            c("div", Mt, [
              c("span", null, g(P.hitCount ?? 0), 1),
              P.hitPercentage != null && (P.hitCount ?? 0) > 0 ? (v(), H(s, {
                key: 0,
                size: "x-small",
                color: h(P.hitPercentage, !0, P.hitCount)
              }, {
                default: t(() => [
                  l(g(Math.round(P.hitPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : G("", !0)
            ])
          ]),
          "item.missCount": t(({ item: P }) => [
            c("div", Ot, [
              c("span", null, g(P.missCount ?? 0), 1),
              P.missPercentage != null && (P.missCount ?? 0) > 1 ? (v(), H(s, {
                key: 0,
                size: "x-small",
                color: h(100 - P.missPercentage, !1)
              }, {
                default: t(() => [
                  l(g(Math.round(P.missPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : G("", !0)
            ])
          ]),
          "item.averageGetTime": t(({ item: P }) => [
            l(g(P.averageGetTime ?? "—"), 1)
          ]),
          "item.actions": t(({ item: P }) => [
            e(D, {
              icon: "",
              size: "small",
              variant: "text",
              loading: T.value === P.id,
              onClick: (S) => A(P),
              title: "Invalidate cache"
            }, {
              default: t(() => [
                e(w, { size: "small" }, {
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
}, Gt = { key: 1 }, Ht = {
  __name: "SystemBenchView",
  setup(o) {
    const _ = ue(), x = se(), V = [
      { key: "insert", step: "INSERT", method: "post", url: "rest/system/bench/prepare" },
      { key: "select", step: "SELECT", method: "get", url: "rest/system/bench/read" },
      { key: "select-all", step: "SELECT *", method: "get", url: "rest/system/bench/read/all" },
      { key: "update", step: "UPDATE", method: "put", url: "rest/system/bench/update" },
      { key: "delete", step: "DELETE", method: "del", url: "rest/system/bench/delete" }
    ], z = u(!1), i = u(null), T = u(V.map((h) => ({ step: h.step, duration: null, loading: !1 })));
    async function y() {
      z.value = !0, i.value = null, T.value = V.map((h) => ({ step: h.step, duration: null, loading: !1 }));
      for (let h = 0; h < V.length; h++) {
        T.value[h].loading = !0;
        try {
          const b = V[h].method === "post" || V[h].method === "put" ? void 0 : null, A = b === null ? await _[V[h].method](V[h].url) : await _[V[h].method](V[h].url, b);
          T.value[h].duration = (A == null ? void 0 : A.duration) ?? "—";
        } catch (b) {
          i.value = `${V[h].step} failed: ${b.message || b}`;
          break;
        } finally {
          T.value[h].loading = !1;
        }
      }
      z.value = !1;
    }
    return oe(() => {
      x.setTitle("Bench"), x.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (h, b) => {
      const A = n("v-card-text"), C = n("v-card"), $ = n("v-btn"), q = n("v-alert"), D = n("v-progress-circular"), k = n("v-table");
      return v(), B("div", null, [
        b[3] || (b[3] = c("h1", { class: "text-h4 mb-4" }, "Database bench", -1)),
        e(C, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(A, null, {
              default: t(() => [...b[0] || (b[0] = [
                l(" Runs a sequence of ", -1),
                c("code", null, "INSERT", -1),
                l(" → ", -1),
                c("code", null, "SELECT", -1),
                l(" → ", -1),
                c("code", null, "SELECT *", -1),
                l(" → ", -1),
                c("code", null, "UPDATE", -1),
                l(" → ", -1),
                c("code", null, "DELETE", -1),
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
          onClick: y
        }, {
          default: t(() => [...b[1] || (b[1] = [
            l(" Run bench ", -1)
          ])]),
          _: 1
        }, 8, ["loading"]),
        i.value ? (v(), H(q, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mt-4"
        }, {
          default: t(() => [
            l(g(i.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        T.value.length ? (v(), H(k, {
          key: 1,
          density: "compact",
          class: "mt-4",
          style: { "max-width": "600px" }
        }, {
          default: t(() => [
            b[2] || (b[2] = c("thead", null, [
              c("tr", null, [
                c("th", null, "Step"),
                c("th", null, "Duration (ms)")
              ])
            ], -1)),
            c("tbody", null, [
              (v(!0), B(ie, null, de(T.value, (s) => (v(), B("tr", {
                key: s.step
              }, [
                c("td", null, g(s.step), 1),
                c("td", null, [
                  s.loading ? (v(), H(D, {
                    key: 0,
                    size: "16",
                    width: "2",
                    indeterminate: ""
                  })) : (v(), B("span", Gt, g(s.duration ?? "—"), 1))
                ])
              ]))), 128))
            ])
          ]),
          _: 1
        })) : G("", !0)
      ]);
    };
  }
}, Wt = { class: "d-flex align-center mb-4" }, Jt = {
  __name: "ApiHomeView",
  setup(o) {
    const _ = se(), x = u(!0), V = u(null), z = "/", i = `${z}rest/swagger-ui-bundle.js`, T = `${z}rest/swagger-ui-standalone-preset.js`, y = `${z}rest/swagger-ui.css`, h = `${z}rest/index.css`, b = `${z}rest/openapi.json`;
    function A() {
      return () => ({
        fn: {
          opsFilter(k, s) {
            const w = s.toLowerCase();
            return k.map((P) => (P._root.entries[1][1] = P._root.entries[1][1].filter((S) => {
              const N = JSON.parse(JSON.stringify(S)), L = (N.operation.summary || "").toString().toLowerCase(), d = (N.operation.description || "").toString().toLowerCase();
              return N.path.toLowerCase().includes(w) || L.includes(w) || d.includes(w);
            }), P)).filter((P) => P._root.entries[1][1].size > 0);
          }
        }
      });
    }
    function C(k, s) {
      if (document.getElementById(s)) return;
      const w = document.createElement("link");
      w.id = s, w.rel = "stylesheet", w.href = k, document.head.appendChild(w);
    }
    function $(k) {
      var s;
      (s = document.getElementById(k)) == null || s.remove();
    }
    function q(k, s) {
      return new Promise((w, M) => {
        if (document.getElementById(s)) {
          w();
          return;
        }
        const S = document.createElement("script");
        S.id = s, S.src = k, S.async = !0, S.onload = w, S.onerror = () => M(new Error(`Failed to load ${k}`)), document.head.appendChild(S);
      });
    }
    function D() {
      const { SwaggerUIBundle: k, SwaggerUIStandalonePreset: s } = window;
      if (!k) {
        V.value = "Swagger UI bundle is unavailable.";
        return;
      }
      window.ui = k({
        url: b,
        dom_id: "#swagger-ui",
        displayRequestDuration: !0,
        deepLinking: !1,
        presets: [k.presets.apis, s],
        plugins: [k.plugins.FiltrePreset, A()].filter(Boolean),
        filter: !0,
        layout: "StandaloneLayout",
        validatorUrl: "https://validator.swagger.io/validator"
      });
    }
    return oe(async () => {
      _.setTitle("API"), _.setBreadcrumbs([{ title: "API" }]), C(y, "swagger-ui-css"), C(h, "swagger-ui-extra-css");
      try {
        await Promise.all([
          q(i, "swagger-ui-bundle"),
          q(T, "swagger-ui-preset")
        ]), D();
      } catch (k) {
        V.value = k.message || "Unable to load Swagger UI.";
      } finally {
        x.value = !1;
      }
    }), je(() => {
      $("swagger-ui-css"), $("swagger-ui-extra-css"), delete window.ui;
    }), (k, s) => {
      const w = n("v-spacer"), M = n("v-btn"), P = n("v-alert"), S = n("v-progress-linear");
      return v(), B("div", null, [
        c("div", Wt, [
          s[1] || (s[1] = c("h1", { class: "text-h4" }, "API reference", -1)),
          e(w),
          e(M, {
            variant: "outlined",
            "prepend-icon": "mdi-code-tags",
            href: `${Q(z)}rest/openapi.json`,
            target: "_blank"
          }, {
            default: t(() => [...s[0] || (s[0] = [
              l(" Download OpenAPI ", -1)
            ])]),
            _: 1
          }, 8, ["href"])
        ]),
        V.value ? (v(), H(P, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(g(V.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        x.value ? (v(), H(S, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : G("", !0),
        s[2] || (s[2] = c("div", {
          id: "swagger-ui",
          class: "swagger-container"
        }, null, -1))
      ]);
    };
  }
}, Xt = /* @__PURE__ */ _e(Jt, [["__scopeId", "data-v-f74586ba"]]), Yt = { class: "d-flex align-center mb-4" }, Kt = { class: "mb-0 text-body-2" }, Qt = {
  __name: "ApiTokenView",
  setup(o) {
    const _ = ue(), x = se(), V = xe(), z = "/", i = typeof window < "u" ? window.location.origin : "", T = ve(() => V.userName || "<you>"), y = u([]), h = u(!1), b = u(null), A = u(!1), C = u(null), $ = u(""), q = u(!1), D = u(!1), k = u(""), s = u(""), w = u(!1), M = u(""), P = u(""), S = u(!1), N = u(!1), L = u(!1), d = u(""), m = u(!1), a = { required: (F) => !!F || "Required" }, j = [
      { title: "Name", key: "name", sortable: !0 },
      { title: "", key: "actions", sortable: !1, width: "140px", align: "end" }
    ];
    async function p() {
      h.value = !0, b.value = null;
      const F = await _.get("rest/api/token");
      y.value = Array.isArray(F) ? F.map((r) => ({ name: r })) : [], h.value = !1;
    }
    function J() {
      $.value = "", A.value = !0;
    }
    async function Z() {
      const { valid: F } = await C.value.validate();
      if (!F) return;
      q.value = !0;
      const r = await _.post(`rest/api/token/${encodeURIComponent($.value)}`);
      q.value = !1, r !== null && (k.value = $.value, s.value = typeof r == "string" ? r : (r == null ? void 0 : r.id) || "", A.value = !1, D.value = !0, p());
    }
    async function R(F, r) {
      M.value = F, P.value = "", N.value = !1, w.value = !0, S.value = !0;
      const O = `rest/api/token/${encodeURIComponent(F)}`, W = r === "regen" ? await _.put(O) : await _.get(O);
      P.value = typeof W == "string" ? W : (W == null ? void 0 : W.id) || "", S.value = !1;
    }
    async function U() {
      try {
        await navigator.clipboard.writeText(P.value), N.value = !0, setTimeout(() => {
          N.value = !1;
        }, 2e3);
      } catch {
      }
    }
    async function f() {
      try {
        await navigator.clipboard.writeText(s.value);
      } catch {
      }
    }
    function le(F) {
      d.value = F, L.value = !0;
    }
    async function te() {
      m.value = !0, await _.del(`rest/api/token/${encodeURIComponent(d.value)}`), m.value = !1, L.value = !1, p();
    }
    return oe(() => {
      x.setTitle("API tokens"), x.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]), p();
    }), (F, r) => {
      const O = n("v-spacer"), W = n("v-btn"), E = n("v-card-text"), ee = n("v-card"), ne = n("v-alert"), I = n("v-icon"), K = n("v-data-table"), ae = n("v-card-title"), ce = n("v-text-field"), ge = n("v-form"), me = n("v-card-actions"), pe = n("v-dialog"), ye = n("v-progress-linear"), X = n("v-textarea");
      return v(), B("div", null, [
        c("div", Yt, [
          r[11] || (r[11] = c("h1", { class: "text-h4" }, "API tokens", -1)),
          e(O),
          e(W, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: J
          }, {
            default: t(() => [...r[10] || (r[10] = [
              l("New token", -1)
            ])]),
            _: 1
          })
        ]),
        e(ee, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(E, null, {
              default: t(() => [
                r[13] || (r[13] = c("p", { class: "mb-2" }, [
                  l(" Tokens let you call the Ligoj API without a password. Pass the token in the "),
                  c("code", null, "api-key"),
                  l(" parameter along with your user id in "),
                  c("code", null, "api-user"),
                  l(". ")
                ], -1)),
                c("p", Kt, [
                  r[12] || (r[12] = l(" Example: ", -1)),
                  c("code", null, " GET " + g(Q(i)) + g(Q(z)) + "rest/project?api-key=<token>&api-user=" + g(T.value), 1)
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        b.value ? (v(), H(ne, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(g(b.value), 1)
          ]),
          _: 1
        })) : G("", !0),
        e(K, {
          headers: j,
          items: y.value,
          loading: h.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.actions": t(({ item: Y }) => [
            e(W, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Show token",
              onClick: (re) => R(Y.name, "load")
            }, {
              default: t(() => [
                e(I, { size: "small" }, {
                  default: t(() => [...r[14] || (r[14] = [
                    l("mdi-eye", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(W, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Regenerate",
              onClick: (re) => R(Y.name, "regen")
            }, {
              default: t(() => [
                e(I, { size: "small" }, {
                  default: t(() => [...r[15] || (r[15] = [
                    l("mdi-refresh", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(W, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              title: "Delete",
              onClick: (re) => le(Y.name)
            }, {
              default: t(() => [
                e(I, { size: "small" }, {
                  default: t(() => [...r[16] || (r[16] = [
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
        e(pe, {
          modelValue: A.value,
          "onUpdate:modelValue": r[2] || (r[2] = (Y) => A.value = Y),
          "max-width": "480",
          persistent: ""
        }, {
          default: t(() => [
            e(ee, null, {
              default: t(() => [
                e(ae, null, {
                  default: t(() => [...r[17] || (r[17] = [
                    l("New API token", -1)
                  ])]),
                  _: 1
                }),
                e(E, null, {
                  default: t(() => [
                    e(ge, {
                      ref_key: "createFormRef",
                      ref: C,
                      onSubmit: fe(Z, ["prevent"])
                    }, {
                      default: t(() => [
                        e(ce, {
                          modelValue: $.value,
                          "onUpdate:modelValue": r[0] || (r[0] = (Y) => $.value = Y),
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
                e(me, null, {
                  default: t(() => [
                    e(O),
                    e(W, {
                      variant: "text",
                      onClick: r[1] || (r[1] = (Y) => A.value = !1)
                    }, {
                      default: t(() => [...r[18] || (r[18] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(W, {
                      color: "primary",
                      variant: "elevated",
                      loading: q.value,
                      onClick: Z
                    }, {
                      default: t(() => [...r[19] || (r[19] = [
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
        e(pe, {
          modelValue: w.value,
          "onUpdate:modelValue": r[5] || (r[5] = (Y) => w.value = Y),
          "max-width": "520"
        }, {
          default: t(() => [
            e(ee, null, {
              default: t(() => [
                e(ae, null, {
                  default: t(() => [
                    r[20] || (r[20] = l(" Token: ", -1)),
                    c("code", null, g(M.value), 1)
                  ]),
                  _: 1
                }),
                e(E, null, {
                  default: t(() => [
                    S.value ? (v(), H(ye, {
                      key: 0,
                      indeterminate: "",
                      color: "primary",
                      class: "mb-3"
                    })) : G("", !0),
                    e(X, {
                      modelValue: P.value,
                      "onUpdate:modelValue": r[3] || (r[3] = (Y) => P.value = Y),
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": U
                    }, null, 8, ["modelValue"]),
                    N.value ? (v(), H(ne, {
                      key: 1,
                      type: "success",
                      variant: "tonal",
                      density: "compact",
                      class: "mt-2"
                    }, {
                      default: t(() => [...r[21] || (r[21] = [
                        l(" Copied to clipboard. ", -1)
                      ])]),
                      _: 1
                    })) : G("", !0)
                  ]),
                  _: 1
                }),
                e(me, null, {
                  default: t(() => [
                    e(O),
                    e(W, {
                      variant: "text",
                      onClick: r[4] || (r[4] = (Y) => w.value = !1)
                    }, {
                      default: t(() => [...r[22] || (r[22] = [
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
        e(pe, {
          modelValue: D.value,
          "onUpdate:modelValue": r[7] || (r[7] = (Y) => D.value = Y),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(ee, null, {
              default: t(() => [
                e(ae, null, {
                  default: t(() => [
                    r[23] || (r[23] = l(" New token: ", -1)),
                    c("code", null, g(k.value), 1)
                  ]),
                  _: 1
                }),
                e(E, null, {
                  default: t(() => [
                    e(ne, {
                      type: "info",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-3"
                    }, {
                      default: t(() => [...r[24] || (r[24] = [
                        l(" Save this value now — you can re-display it later through ", -1),
                        c("strong", null, "Show token", -1),
                        l(". ", -1)
                      ])]),
                      _: 1
                    }),
                    e(X, {
                      "model-value": s.value,
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": f
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                }),
                e(me, null, {
                  default: t(() => [
                    e(O),
                    e(W, {
                      color: "primary",
                      onClick: r[6] || (r[6] = (Y) => D.value = !1)
                    }, {
                      default: t(() => [...r[25] || (r[25] = [
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
        e(pe, {
          modelValue: L.value,
          "onUpdate:modelValue": r[9] || (r[9] = (Y) => L.value = Y),
          "max-width": "420"
        }, {
          default: t(() => [
            e(ee, null, {
              default: t(() => [
                e(ae, null, {
                  default: t(() => [...r[26] || (r[26] = [
                    l("Delete token", -1)
                  ])]),
                  _: 1
                }),
                e(E, null, {
                  default: t(() => [
                    r[27] || (r[27] = l("Revoke token ", -1)),
                    c("code", null, g(d.value), 1),
                    r[28] || (r[28] = l("?", -1))
                  ]),
                  _: 1
                }),
                e(me, null, {
                  default: t(() => [
                    e(O),
                    e(W, {
                      variant: "text",
                      onClick: r[8] || (r[8] = (Y) => L.value = !1)
                    }, {
                      default: t(() => [...r[29] || (r[29] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(W, {
                      color: "error",
                      variant: "elevated",
                      loading: m.value,
                      onClick: te
                    }, {
                      default: t(() => [...r[30] || (r[30] = [
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
}, Zt = { class: "pa-4" }, el = {
  __name: "SubscribeWizardView",
  setup(o) {
    const _ = se();
    return oe(() => {
      _.setTitle("Subscribe"), _.setBreadcrumbs([{ title: "Subscribe" }]);
    }), (x, V) => {
      const z = n("v-alert");
      return v(), B("div", Zt, [
        V[1] || (V[1] = c("h1", { class: "text-h4 mb-4" }, "Subscribe wizard", -1)),
        e(z, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...V[0] || (V[0] = [
            l(" Legacy ", -1),
            c("code", null, "webjars/subscribe-wizard/", -1),
            l(". TODO: multi-step flow (select project → pick service → pick tool → configure parameters) backing ", -1),
            c("code", null, "rest/subscription", -1),
            l(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, tl = {
  sample: Ve.sample
}, ke = [
  { path: "/home", name: "ui-home", component: Ke },
  { path: "/home/manual", name: "ui-manual", component: ht },
  { path: "/home/project", name: "ui-project-list", component: rt },
  { path: "/home/project/:id", name: "ui-project-detail", component: xt },
  { path: "/system", name: "ui-system", component: Pt },
  { path: "/system/user", name: "ui-system-user", component: jt },
  { path: "/system/role", name: "ui-system-role", component: Nt },
  { path: "/system/plugin", name: "ui-system-plugin", component: Rt },
  { path: "/system/node", name: "ui-system-node", component: Bt },
  { path: "/system/cache", name: "ui-system-cache", component: Ft },
  { path: "/system/bench", name: "ui-system-bench", component: Ht },
  { path: "/api", name: "ui-api", component: Xt },
  { path: "/api/token", name: "ui-api-token", component: Qt },
  { path: "/subscribe", name: "ui-subscribe", component: el }
], vl = {
  id: "ui",
  label: "UI",
  component: Le,
  routes: ke,
  install({ router: o }) {
    for (const _ of ke)
      o.addRoute(_);
  },
  feature(o, ..._) {
    const x = tl[o];
    if (!x) throw new Error(`Plugin "ui" has no feature "${o}"`);
    return x(..._);
  },
  service: Ve,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  pl as TARGET_TYPE_ICON,
  vl as default,
  $e as getFullName,
  ml as getHierarchyIds,
  Ze as getService,
  ul as getServiceFromId,
  dl as getServiceNameFromId,
  et as getTool,
  rl as getToolFromId,
  cl as getToolNameFromId,
  sl as htmlEscape,
  il as htmlUnescape,
  lt as normalize,
  Ve as service,
  Qe as toUser2Letters,
  ol as trimObject
};
