import { resolveComponent as n, openBlock as y, createElementBlock as T, createVNode as e, withCtx as t, createTextVNode as l, onMounted as le, createElementVNode as p, ref as v, computed as be, unref as M, createBlock as q, toDisplayString as k, createCommentVNode as E, withDirectives as $e, withModifiers as de, Fragment as ue, vShow as Se, watch as Pe, renderList as ce } from "vue";
import { useAppStore as ae, useI18nStore as ke, useApi as ie, useDataTable as we, useErrorStore as De } from "@ligoj/host";
import { useRouter as xe, useRoute as ze } from "vue-router";
const pe = (o, u) => {
  const f = o.__vccOpts || o;
  for (const [c, g] of u)
    f[c] = g;
  return f;
}, Te = { class: "plugin-ui-shell" }, Ue = {
  __name: "UiPlugin",
  setup(o) {
    return (u, f) => {
      const c = n("v-alert"), g = n("v-list-subheader"), s = n("v-list-item"), S = n("v-list");
      return y(), T("div", Te, [
        e(c, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...f[0] || (f[0] = [
            l(" plugin-ui is being migrated from the legacy Cascade.js implementation — most views below are placeholders and link back to their legacy sources. ", -1)
          ])]),
          _: 1
        }),
        e(S, {
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            e(g, null, {
              default: t(() => [...f[1] || (f[1] = [
                l("Dashboard", -1)
              ])]),
              _: 1
            }),
            e(s, {
              to: "/home",
              "prepend-icon": "mdi-view-dashboard",
              title: "Overview"
            }),
            e(s, {
              to: "/home/project",
              "prepend-icon": "mdi-folder-multiple",
              title: "Projects"
            }),
            e(s, {
              to: "/home/manual",
              "prepend-icon": "mdi-book-open-page-variant",
              title: "Manual"
            }),
            e(g, null, {
              default: t(() => [...f[2] || (f[2] = [
                l("System", -1)
              ])]),
              _: 1
            }),
            e(s, {
              to: "/system",
              "prepend-icon": "mdi-cog",
              title: "System administration"
            }),
            e(g, null, {
              default: t(() => [...f[3] || (f[3] = [
                l("API", -1)
              ])]),
              _: 1
            }),
            e(s, {
              to: "/api",
              "prepend-icon": "mdi-api",
              title: "API reference"
            }),
            e(s, {
              to: "/api/token",
              "prepend-icon": "mdi-key-variant",
              title: "API tokens"
            }),
            e(g, null, {
              default: t(() => [...f[4] || (f[4] = [
                l("Onboarding", -1)
              ])]),
              _: 1
            }),
            e(s, {
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
}, Ne = /* @__PURE__ */ pe(Ue, [["__scopeId", "data-v-9cfeae95"]]), Ve = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, Ae = { class: "pa-4" }, je = {
  __name: "HomeView",
  setup(o) {
    const u = ae(), { t: f } = ke();
    return le(() => {
      u.setTitle(f("nav.home") || "Home"), u.setBreadcrumbs([{ title: f("nav.home") || "Home" }]);
    }), (c, g) => {
      const s = n("v-alert");
      return y(), T("div", Ae, [
        g[1] || (g[1] = p("h1", { class: "text-h4 mb-4" }, "Dashboard", -1)),
        e(s, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...g[0] || (g[0] = [
            l(" Dashboard view — port from legacy ", -1),
            p("code", null, "webjars/home/home.js", -1),
            l(" (projects grid, quick actions). TODO. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
};
function Et(o) {
  if (!o || typeof o != "object") return o;
  for (const u of Object.keys(o)) {
    const f = o[u];
    (f == null || f === "" || f === !1) && delete o[u];
  }
  return o;
}
function Bt(o) {
  return typeof o != "string" ? "" : o.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Ot(o) {
  return typeof o != "string" ? "" : o.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Ie(o) {
  if (!o) return "??";
  if (o.firstName && o.lastName)
    return o.firstName.charAt(0) + o.lastName.charAt(0);
  if (o.fullName) {
    const f = o.fullName.split(" ");
    return f.length === 1 ? o.fullName.charAt(0) + (o.fullName.length >= 2 ? o.fullName.charAt(1) : "") : f[0].charAt(0) + f[f.length - 1].charAt(0);
  }
  const u = (o.id || o || "??").toString();
  return (u.length === 1 ? u + u : u).slice(0, 2);
}
function he(o) {
  if (!o) return "";
  if (o.fullName) return o.fullName;
  if (o.firstName && o.lastName) return `${o.firstName} ${o.lastName}`;
  if (o.firstName) return `${o.firstName} ${(o.id || "").substring(1)}`;
  if (o.lastName) return `${ve((o.id || "").charAt(0))}. ${o.lastName}`;
  const u = (o.id || o || "??").toString();
  return `${ve(u.charAt(0))}. ${ve(u.substring(1))}`;
}
function ve(o) {
  return o && o.charAt(0).toUpperCase() + o.slice(1);
}
function qt(o) {
  if (!o) return null;
  const u = o.split(":");
  return u.length > 2 ? u.slice(0, 3).join("-") : null;
}
function Mt(o) {
  if (!o) return null;
  const u = o.split(":");
  return u.length > 1 ? u.slice(0, 2).join("-") : null;
}
function Ht(o) {
  return (o || "").split(":")[1] || null;
}
function Ft(o) {
  return (o || "").split(":")[2] || null;
}
function Gt(o) {
  if (!o) return [];
  const u = o.split(":"), f = [];
  for (let c = 2; c <= u.length; c++)
    f.push(u.slice(0, c).join("-"));
  return f;
}
function Le(o) {
  return o ? (o.service || (o.service = o.refined && Le(o.refined) || o), o.service) : null;
}
function Re(o) {
  return o ? o.tool ? o.tool : o.refined ? (o.tool = o.refined.refined ? Re(o.refined) : o, o.tool) : null : null;
}
const Ee = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function Be(o) {
  return o ? o.replace(/[-[()\]${},;_:]/g, " ").replace(Ee, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const Wt = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, Oe = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, qe = { class: "text-caption" }, Me = {
  key: 1,
  class: "text-disabled"
}, He = { class: "mb-4" }, Fe = {
  __name: "ProjectListView",
  setup(o) {
    const u = xe(), f = ie(), c = ae(), { t: g } = ke(), s = we("project", { defaultSort: "name" }), S = v(25);
    let U = null, x = {};
    const _ = v(null), z = v(!1), b = v(null), V = v({ name: "", pkey: "", teamLeader: "", description: "" }), j = v(!1), D = v(!1), C = v(null), N = v(!1), J = v(!1);
    let X = "";
    const I = be(() => [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Description", key: "description", sortable: !1 },
      { title: "Manager", key: "teamLeader", sortable: !1, width: "220px" },
      { title: "Created", key: "createdDate", sortable: !0, width: "140px" },
      { title: "Subs", key: "nbSubscriptions", sortable: !1, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ]), Y = {
      required: ($) => !!$ || "Required",
      pkey: ($) => /^[a-z0-9][-a-z0-9]{0,99}$/.test($ || "") || "Use lowercase letters, digits, dash"
    };
    function ne($) {
      if (!$) return "";
      const d = typeof $ == "number" ? new Date($) : new Date($);
      return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
    }
    function O($) {
      x = $, s.load($);
    }
    function m() {
      clearTimeout(U), U = setTimeout(
        () => s.load({ page: 1, itemsPerPage: S.value, sortBy: x.sortBy }),
        300
      );
    }
    function i($) {
      const d = Be($ || "").split(" ").filter(Boolean);
      return d.length ? d.join("-") : "";
    }
    function a() {
      var d;
      if (((d = b.value) == null ? void 0 : d.nbSubscriptions) > 0) return;
      const $ = i(V.value.name);
      (!V.value.pkey || V.value.pkey === X) && (V.value.pkey = $, X = $);
    }
    function w() {
      b.value = null, V.value = { name: "", pkey: "", teamLeader: "", description: "" }, X = "", z.value = !0;
    }
    function r($) {
      var d;
      b.value = $, V.value = {
        name: $.name || "",
        pkey: $.pkey || "",
        teamLeader: ((d = $.teamLeader) == null ? void 0 : d.id) || "",
        description: $.description || ""
      }, X = $.pkey || "", z.value = !0;
    }
    function R($) {
      C.value = $, J.value = !1, D.value = !0;
    }
    async function H() {
      var G, Z, A;
      const { valid: $ } = await _.value.validate();
      if (!$) return;
      if (s.demoMode.value) {
        z.value = !1;
        return;
      }
      j.value = !0;
      const d = {
        id: (G = b.value) == null ? void 0 : G.id,
        name: V.value.name,
        pkey: V.value.pkey,
        teamLeader: V.value.teamLeader,
        description: V.value.description
      }, ee = (Z = b.value) != null && Z.id ? "put" : "post", Q = await f[ee]("rest/project", d);
      j.value = !1, Q !== null && (z.value = !1, !((A = b.value) != null && A.id) && typeof Q != "object" ? u.push(`/home/project/${Q}`) : s.load(x));
    }
    async function F() {
      if (s.demoMode.value) {
        D.value = !1;
        return;
      }
      N.value = !0;
      const $ = J.value ? "?deleteRemoteData=true" : "";
      await f.del(`rest/project/${C.value.id}${$}`), N.value = !1, D.value = !1, s.load(x);
    }
    return le(() => {
      c.setTitle("Projects"), c.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), ($, d) => {
      const ee = n("v-spacer"), Q = n("v-text-field"), G = n("v-btn"), Z = n("v-alert"), A = n("v-skeleton-loader"), K = n("v-avatar"), P = n("v-chip"), W = n("v-icon"), te = n("v-data-table-server"), h = n("v-card-title"), B = n("v-textarea"), se = n("v-form"), me = n("v-card-text"), fe = n("v-card-actions"), _e = n("v-card"), ye = n("v-dialog"), Ce = n("v-checkbox");
      return y(), T("div", null, [
        p("div", Oe, [
          d[13] || (d[13] = p("h1", { class: "text-h4" }, "Projects", -1)),
          e(ee),
          e(Q, {
            modelValue: M(s).search.value,
            "onUpdate:modelValue": [
              d[0] || (d[0] = (L) => M(s).search.value = L),
              m
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(G, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: w
          }, {
            default: t(() => [...d[12] || (d[12] = [
              l(" New ", -1)
            ])]),
            _: 1
          })
        ]),
        M(s).error.value ? (y(), q(Z, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(k(M(s).error.value), 1)
          ]),
          _: 1
        })) : E("", !0),
        M(s).demoMode.value ? (y(), q(Z, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...d[14] || (d[14] = [
            l(" Running without a live backend — results below are sample data. ", -1)
          ])]),
          _: 1
        })) : E("", !0),
        M(s).loading.value && M(s).items.value.length === 0 ? (y(), q(A, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : E("", !0),
        M(s).error.value ? E("", !0) : $e((y(), q(te, {
          key: 3,
          "items-per-page": S.value,
          "onUpdate:itemsPerPage": d[1] || (d[1] = (L) => S.value = L),
          headers: I.value,
          items: M(s).items.value,
          "items-length": M(s).totalItems.value,
          loading: M(s).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": O,
          "onClick:row": d[2] || (d[2] = (L, { item: oe }) => M(u).push(`/home/project/${oe.id}`))
        }, {
          "item.teamLeader": t(({ item: L }) => {
            var oe;
            return [
              (oe = L.teamLeader) != null && oe.id ? (y(), T(ue, { key: 0 }, [
                e(K, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: t(() => [
                    p("span", qe, k(M(Ie)(L.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                l(" " + k(M(he)(L.teamLeader)), 1)
              ], 64)) : (y(), T("span", Me, "—"))
            ];
          }),
          "item.createdDate": t(({ item: L }) => [
            l(k(ne(L.createdDate)), 1)
          ]),
          "item.nbSubscriptions": t(({ item: L }) => [
            e(P, {
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(k(L.nbSubscriptions || 0), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          "item.actions": t(({ item: L }) => [
            e(G, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: de((oe) => r(L), ["stop"])
            }, {
              default: t(() => [
                e(W, { size: "small" }, {
                  default: t(() => [...d[15] || (d[15] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(G, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: de((oe) => R(L), ["stop"])
            }, {
              default: t(() => [
                e(W, { size: "small" }, {
                  default: t(() => [...d[16] || (d[16] = [
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
          [Se, M(s).items.value.length > 0 || !M(s).loading.value]
        ]),
        e(ye, {
          modelValue: z.value,
          "onUpdate:modelValue": d[8] || (d[8] = (L) => z.value = L),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(_e, null, {
              default: t(() => [
                e(h, null, {
                  default: t(() => {
                    var L;
                    return [
                      l(k((L = b.value) != null && L.id ? "Edit project" : "New project"), 1)
                    ];
                  }),
                  _: 1
                }),
                e(me, null, {
                  default: t(() => [
                    e(se, {
                      ref_key: "formRef",
                      ref: _,
                      onSubmit: de(H, ["prevent"])
                    }, {
                      default: t(() => {
                        var L, oe;
                        return [
                          e(Q, {
                            modelValue: V.value.name,
                            "onUpdate:modelValue": [
                              d[3] || (d[3] = (re) => V.value.name = re),
                              a
                            ],
                            label: "Name",
                            rules: [Y.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          e(Q, {
                            modelValue: V.value.pkey,
                            "onUpdate:modelValue": d[4] || (d[4] = (re) => V.value.pkey = re),
                            label: "Project key (pkey)",
                            rules: [Y.required, Y.pkey],
                            disabled: ((L = b.value) == null ? void 0 : L.nbSubscriptions) > 0,
                            hint: ((oe = b.value) == null ? void 0 : oe.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          e(Q, {
                            modelValue: V.value.teamLeader,
                            "onUpdate:modelValue": d[5] || (d[5] = (re) => V.value.teamLeader = re),
                            label: "Team leader (user id)",
                            rules: [Y.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(B, {
                            modelValue: V.value.description,
                            "onUpdate:modelValue": d[6] || (d[6] = (re) => V.value.description = re),
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
                e(fe, null, {
                  default: t(() => [
                    e(ee),
                    e(G, {
                      variant: "text",
                      onClick: d[7] || (d[7] = (L) => z.value = !1)
                    }, {
                      default: t(() => [...d[17] || (d[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(G, {
                      color: "primary",
                      variant: "elevated",
                      loading: j.value,
                      onClick: H
                    }, {
                      default: t(() => [...d[18] || (d[18] = [
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
        e(ye, {
          modelValue: D.value,
          "onUpdate:modelValue": d[11] || (d[11] = (L) => D.value = L),
          "max-width": "500"
        }, {
          default: t(() => [
            e(_e, null, {
              default: t(() => [
                e(h, null, {
                  default: t(() => [...d[19] || (d[19] = [
                    l("Delete project", -1)
                  ])]),
                  _: 1
                }),
                e(me, null, {
                  default: t(() => {
                    var L;
                    return [
                      p("p", He, [
                        d[20] || (d[20] = l(" Are you sure you want to delete ", -1)),
                        p("strong", null, k((L = C.value) == null ? void 0 : L.name), 1),
                        d[21] || (d[21] = l("? ", -1))
                      ]),
                      e(Ce, {
                        modelValue: J.value,
                        "onUpdate:modelValue": d[9] || (d[9] = (oe) => J.value = oe),
                        label: "Also remove remote data associated with this project's subscriptions",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(fe, null, {
                  default: t(() => [
                    e(ee),
                    e(G, {
                      variant: "text",
                      onClick: d[10] || (d[10] = (L) => D.value = !1)
                    }, {
                      default: t(() => [...d[22] || (d[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(G, {
                      color: "error",
                      variant: "elevated",
                      loading: N.value,
                      onClick: F
                    }, {
                      default: t(() => [...d[23] || (d[23] = [
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
}, Ge = /* @__PURE__ */ pe(Fe, [["__scopeId", "data-v-6023d08b"]]), We = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, Je = { class: "text-h4" }, Ye = { class: "text-h6 text-medium-emphasis" }, Ke = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, Qe = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, Xe = { key: 0 }, Ze = {
  key: 0,
  class: "ml-1"
}, et = { key: 1 }, tt = {
  key: 0,
  class: "ml-1"
}, lt = { key: 2 }, at = {
  key: 0,
  class: "ml-1"
}, nt = { class: "d-flex align-center mb-2" }, ot = { class: "mb-3" }, st = {
  __name: "ProjectDetailView",
  setup(o) {
    const u = ze();
    xe();
    const f = ie(), c = ae();
    De();
    const g = v(!1), s = v(null), S = be(() => {
      var i;
      return ((i = s.value) == null ? void 0 : i.subscriptions) || [];
    }), U = v(null), x = v(!1), _ = v({ name: "", pkey: "", teamLeader: "", description: "" }), z = v(!1), b = v(!1), V = v(null), j = v(!1), D = v(!1), C = {
      required: (i) => !!i || "Required"
    }, N = [
      { title: "Service", key: "service", sortable: !1, width: "180px" },
      { title: "Tool", key: "tool", sortable: !1, width: "180px" },
      { title: "Node", key: "node", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function J(i) {
      if (!i) return "";
      const a = new Date(i);
      return isNaN(a.getTime()) ? "" : a.toISOString().slice(0, 16).replace("T", " ");
    }
    function X(i) {
      var R, H, F;
      const a = ((F = (H = (R = i.node) == null ? void 0 : R.refined) == null ? void 0 : H.refined) == null ? void 0 : F.id) || "", w = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let r = 0;
      for (const $ of a) r += $.charCodeAt(0);
      return w[r % w.length];
    }
    function I(i) {
      var w, r, R;
      const a = ((R = (r = (w = i.node) == null ? void 0 : w.refined) == null ? void 0 : r.refined) == null ? void 0 : R.id) || "";
      return a.includes(":scm:") ? "mdi-source-branch" : a.includes(":build:") ? "mdi-hammer-wrench" : a.includes(":bt") ? "mdi-bug" : a.includes(":km:") ? "mdi-book-open-variant" : a.includes(":vm") ? "mdi-server" : a.includes(":prov") ? "mdi-cloud" : a.includes(":id") ? "mdi-account-group" : a.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function Y() {
      var w;
      g.value = !0;
      const i = u.params.id, a = await f.get(`rest/project/${i}`);
      s.value = a || null, g.value = !1, a && (_.value = {
        name: a.name || "",
        pkey: a.pkey || "",
        teamLeader: ((w = a.teamLeader) == null ? void 0 : w.id) || "",
        description: a.description || ""
      }, c.setTitle(a.name), c.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        { title: a.name }
      ]));
    }
    async function ne() {
      const { valid: i } = await U.value.validate();
      if (!i) return;
      z.value = !0;
      const a = {
        id: s.value.id,
        name: _.value.name,
        pkey: _.value.pkey,
        teamLeader: _.value.teamLeader,
        description: _.value.description
      };
      await f.put("rest/project", a), z.value = !1, x.value = !1, await Y();
    }
    function O(i) {
      V.value = i, j.value = !1, b.value = !0;
    }
    async function m() {
      D.value = !0, await f.del(`rest/subscription/${V.value.id}/${j.value ? "true" : "false"}`), D.value = !1, b.value = !1, await Y();
    }
    return Pe(() => u.params.id, (i) => {
      i && Y();
    }), le(Y), (i, a) => {
      const w = n("v-skeleton-loader"), r = n("v-spacer"), R = n("v-btn"), H = n("v-icon"), F = n("v-card-text"), $ = n("v-card"), d = n("v-chip"), ee = n("v-alert"), Q = n("v-data-table"), G = n("v-card-title"), Z = n("v-text-field"), A = n("v-textarea"), K = n("v-form"), P = n("v-card-actions"), W = n("v-dialog"), te = n("v-checkbox");
      return y(), T("div", null, [
        g.value && !s.value ? (y(), q(w, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : E("", !0),
        s.value ? (y(), T(ue, { key: 1 }, [
          p("div", We, [
            p("div", null, [
              p("h1", Je, [
                l(k(s.value.name) + " ", 1),
                p("span", Ye, "(" + k(s.value.pkey) + ")", 1)
              ]),
              s.value.description ? (y(), T("p", Ke, k(s.value.description), 1)) : E("", !0)
            ]),
            e(r),
            s.value.manageSubscriptions ? (y(), q(R, {
              key: 0,
              color: "primary",
              "prepend-icon": "mdi-plus",
              to: `/home/project/${s.value.id}/subscription`
            }, {
              default: t(() => [...a[10] || (a[10] = [
                l(" Add subscription ", -1)
              ])]),
              _: 1
            }, 8, ["to"])) : E("", !0),
            e(R, {
              variant: "outlined",
              "prepend-icon": "mdi-pencil",
              onClick: a[0] || (a[0] = (h) => x.value = !0)
            }, {
              default: t(() => [...a[11] || (a[11] = [
                l(" Edit ", -1)
              ])]),
              _: 1
            })
          ]),
          e($, {
            variant: "tonal",
            class: "mb-4"
          }, {
            default: t(() => [
              e(F, { class: "py-2" }, {
                default: t(() => [
                  p("div", Qe, [
                    s.value.teamLeader ? (y(), T("span", Xe, [
                      e(H, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[12] || (a[12] = [
                          l("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      a[13] || (a[13] = p("strong", null, "Manager:", -1)),
                      l(" " + k(M(he)(s.value.teamLeader)) + " ", 1),
                      s.value.teamLeader.id ? (y(), T("span", Ze, "(" + k(s.value.teamLeader.id) + ")", 1)) : E("", !0)
                    ])) : E("", !0),
                    s.value.createdDate ? (y(), T("span", et, [
                      e(H, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[14] || (a[14] = [
                          l("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      a[15] || (a[15] = p("strong", null, "Created:", -1)),
                      l(" " + k(J(s.value.createdDate)) + " ", 1),
                      s.value.createdBy ? (y(), T("span", tt, " by " + k(s.value.createdBy.id || s.value.createdBy), 1)) : E("", !0)
                    ])) : E("", !0),
                    s.value.lastModifiedDate ? (y(), T("span", lt, [
                      e(H, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[16] || (a[16] = [
                          l("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      a[17] || (a[17] = p("strong", null, "Updated:", -1)),
                      l(" " + k(J(s.value.lastModifiedDate)) + " ", 1),
                      s.value.lastModifiedBy ? (y(), T("span", at, " by " + k(s.value.lastModifiedBy.id || s.value.lastModifiedBy), 1)) : E("", !0)
                    ])) : E("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          p("div", nt, [
            a[18] || (a[18] = p("h2", { class: "text-h6" }, "Subscriptions", -1)),
            e(d, {
              class: "ml-2",
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(k(S.value.length), 1)
              ]),
              _: 1
            })
          ]),
          S.value.length === 0 ? (y(), q(ee, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: t(() => [...a[19] || (a[19] = [
              l(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (y(), q(Q, {
            key: 1,
            headers: N,
            items: S.value,
            "item-value": "id",
            "items-per-page": -1,
            "hide-default-footer": "",
            density: "compact"
          }, {
            "item.service": t(({ item: h }) => [
              e(d, {
                size: "small",
                variant: "tonal",
                color: X(h)
              }, {
                default: t(() => {
                  var B, se, me;
                  return [
                    e(H, {
                      start: "",
                      size: "small"
                    }, {
                      default: t(() => [
                        l(k(I(h)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    l(" " + k(((me = (se = (B = h.node) == null ? void 0 : B.refined) == null ? void 0 : se.refined) == null ? void 0 : me.name) || "—"), 1)
                  ];
                }),
                _: 2
              }, 1032, ["color"])
            ]),
            "item.tool": t(({ item: h }) => {
              var B, se;
              return [
                l(k(((se = (B = h.node) == null ? void 0 : B.refined) == null ? void 0 : se.name) || "—"), 1)
              ];
            }),
            "item.node": t(({ item: h }) => {
              var B;
              return [
                p("code", null, k((B = h.node) == null ? void 0 : B.id), 1)
              ];
            }),
            "item.actions": t(({ item: h }) => [
              s.value.manageSubscriptions ? (y(), q(R, {
                key: 0,
                icon: "",
                size: "small",
                variant: "text",
                color: "error",
                onClick: (B) => O(h),
                title: "Unsubscribe"
              }, {
                default: t(() => [
                  e(H, { size: "small" }, {
                    default: t(() => [...a[20] || (a[20] = [
                      l("mdi-close", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["onClick"])) : E("", !0)
            ]),
            _: 1
          }, 8, ["items"]))
        ], 64)) : E("", !0),
        e(W, {
          modelValue: x.value,
          "onUpdate:modelValue": a[6] || (a[6] = (h) => x.value = h),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e($, null, {
              default: t(() => [
                e(G, null, {
                  default: t(() => [...a[21] || (a[21] = [
                    l("Edit project", -1)
                  ])]),
                  _: 1
                }),
                e(F, null, {
                  default: t(() => [
                    e(K, {
                      ref_key: "formRef",
                      ref: U,
                      onSubmit: de(ne, ["prevent"])
                    }, {
                      default: t(() => {
                        var h;
                        return [
                          e(Z, {
                            modelValue: _.value.name,
                            "onUpdate:modelValue": a[1] || (a[1] = (B) => _.value.name = B),
                            label: "Name",
                            rules: [C.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(Z, {
                            modelValue: _.value.pkey,
                            "onUpdate:modelValue": a[2] || (a[2] = (B) => _.value.pkey = B),
                            label: "Project key (pkey)",
                            rules: [C.required],
                            disabled: (((h = s.value) == null ? void 0 : h.nbSubscriptions) || S.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          e(Z, {
                            modelValue: _.value.teamLeader,
                            "onUpdate:modelValue": a[3] || (a[3] = (B) => _.value.teamLeader = B),
                            label: "Team leader (user id)",
                            rules: [C.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(A, {
                            modelValue: _.value.description,
                            "onUpdate:modelValue": a[4] || (a[4] = (B) => _.value.description = B),
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
                e(P, null, {
                  default: t(() => [
                    e(r),
                    e(R, {
                      variant: "text",
                      onClick: a[5] || (a[5] = (h) => x.value = !1)
                    }, {
                      default: t(() => [...a[22] || (a[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(R, {
                      color: "primary",
                      variant: "elevated",
                      loading: z.value,
                      onClick: ne
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
        e(W, {
          modelValue: b.value,
          "onUpdate:modelValue": a[9] || (a[9] = (h) => b.value = h),
          "max-width": "480"
        }, {
          default: t(() => [
            e($, null, {
              default: t(() => [
                e(G, null, {
                  default: t(() => [...a[24] || (a[24] = [
                    l("Unsubscribe", -1)
                  ])]),
                  _: 1
                }),
                e(F, null, {
                  default: t(() => {
                    var h, B;
                    return [
                      p("p", ot, [
                        a[25] || (a[25] = l(" Remove subscription to ", -1)),
                        p("strong", null, k((B = (h = V.value) == null ? void 0 : h.node) == null ? void 0 : B.name), 1),
                        a[26] || (a[26] = l("? ", -1))
                      ]),
                      e(te, {
                        modelValue: j.value,
                        "onUpdate:modelValue": a[7] || (a[7] = (se) => j.value = se),
                        label: "Also delete remote data on the target service",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(P, null, {
                  default: t(() => [
                    e(r),
                    e(R, {
                      variant: "text",
                      onClick: a[8] || (a[8] = (h) => b.value = !1)
                    }, {
                      default: t(() => [...a[27] || (a[27] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(R, {
                      color: "error",
                      variant: "elevated",
                      loading: D.value,
                      onClick: m
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
}, it = { class: "pa-4" }, rt = {
  __name: "ManualView",
  setup(o) {
    const u = ae();
    return le(() => {
      u.setTitle("Manual"), u.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (f, c) => {
      const g = n("v-alert");
      return y(), T("div", it, [
        c[1] || (c[1] = p("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        e(g, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...c[0] || (c[0] = [
            l(" Embedded user manual — legacy ", -1),
            p("code", null, "webjars/home/manual/", -1),
            l(". TODO. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, ut = { class: "pa-4" }, dt = {
  __name: "SystemView",
  setup(o) {
    const u = ae(), f = [
      { to: "/system/user", icon: "mdi-account-multiple", title: "Users", subtitle: "Active sessions and accounts" },
      { to: "/system/role", icon: "mdi-shield-account", title: "Roles", subtitle: "Authorization rules" },
      { to: "/system/plugin", icon: "mdi-puzzle", title: "Plugins", subtitle: "Installed feature plugins" },
      { to: "/system/node", icon: "mdi-server", title: "Nodes", subtitle: "Service & tool registrations" },
      { to: "/system/cache", icon: "mdi-database-refresh", title: "Cache", subtitle: "Invalidate application caches" },
      { to: "/system/bench", icon: "mdi-speedometer", title: "Bench", subtitle: "Diagnostics" }
    ];
    return le(() => {
      u.setTitle("System"), u.setBreadcrumbs([{ title: "System" }]);
    }), (c, g) => {
      const s = n("v-list-item"), S = n("v-list");
      return y(), T("div", ut, [
        g[0] || (g[0] = p("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        e(S, null, {
          default: t(() => [
            (y(), T(ue, null, ce(f, (U) => e(s, {
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
}, mt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, ct = {
  __name: "SystemUserView",
  setup(o) {
    const u = ie(), f = ae(), c = we("system/user/roles", { defaultSort: "login" }), g = v(25);
    let s = null, S = {};
    const U = v([]), x = v(null), _ = v(!1), z = v(null), b = v({ login: "", roles: [] }), V = v(!1), j = v(!1), D = v(null), C = v(!1), N = {
      required: (w) => !!w || "Required",
      requiredArray: (w) => Array.isArray(w) && w.length > 0 || "Pick at least one role"
    }, J = [
      { title: "Login", key: "login", sortable: !0, width: "220px" },
      { title: "Roles", key: "roles", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    function X(w) {
      S = w, c.load(w);
    }
    function I() {
      clearTimeout(s), s = setTimeout(
        () => c.load({ page: 1, itemsPerPage: g.value, sortBy: S.sortBy }),
        300
      );
    }
    async function Y() {
      const w = await u.get("rest/system/security/role");
      Array.isArray(w) ? U.value = w : Array.isArray(w == null ? void 0 : w.data) && (U.value = w.data);
    }
    function ne() {
      z.value = null, b.value = { login: "", roles: [] }, _.value = !0;
    }
    function O(w) {
      z.value = w, b.value = {
        login: w.login,
        roles: (w.roles || []).map((r) => r.id)
      }, _.value = !0;
    }
    function m(w) {
      D.value = w, j.value = !0;
    }
    async function i() {
      const { valid: w } = await x.value.validate();
      if (!w) return;
      V.value = !0;
      const r = { login: b.value.login, roles: b.value.roles }, R = z.value ? "put" : "post";
      await u[R]("rest/system/user", r), V.value = !1, _.value = !1, c.load(S);
    }
    async function a() {
      C.value = !0, await u.del(`rest/system/user/${encodeURIComponent(D.value.login)}`), C.value = !1, j.value = !1, c.load(S);
    }
    return le(() => {
      f.setTitle("System users"), f.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]), Y();
    }), (w, r) => {
      const R = n("v-spacer"), H = n("v-text-field"), F = n("v-btn"), $ = n("v-alert"), d = n("v-chip"), ee = n("v-icon"), Q = n("v-data-table-server"), G = n("v-card-title"), Z = n("v-autocomplete"), A = n("v-form"), K = n("v-card-text"), P = n("v-card-actions"), W = n("v-card"), te = n("v-dialog");
      return y(), T("div", null, [
        p("div", mt, [
          r[9] || (r[9] = p("h1", { class: "text-h4" }, "System users", -1)),
          e(R),
          e(H, {
            modelValue: M(c).search.value,
            "onUpdate:modelValue": [
              r[0] || (r[0] = (h) => M(c).search.value = h),
              I
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
            onClick: ne
          }, {
            default: t(() => [...r[8] || (r[8] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        M(c).error.value ? (y(), q($, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(k(M(c).error.value), 1)
          ]),
          _: 1
        })) : E("", !0),
        e(Q, {
          headers: J,
          items: M(c).items.value,
          "items-length": M(c).totalItems.value,
          loading: M(c).loading.value,
          "items-per-page": g.value,
          "onUpdate:itemsPerPage": r[1] || (r[1] = (h) => g.value = h),
          "item-value": "login",
          hover: "",
          "onUpdate:options": X
        }, {
          "item.roles": t(({ item: h }) => [
            (y(!0), T(ue, null, ce(h.roles || [], (B) => (y(), q(d, {
              key: B.id,
              size: "x-small",
              variant: "tonal",
              class: "mr-1"
            }, {
              default: t(() => [
                l(k(B.name), 1)
              ]),
              _: 2
            }, 1024))), 128))
          ]),
          "item.actions": t(({ item: h }) => [
            e(F, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (B) => O(h)
            }, {
              default: t(() => [
                e(ee, { size: "small" }, {
                  default: t(() => [...r[10] || (r[10] = [
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
              onClick: (B) => m(h)
            }, {
              default: t(() => [
                e(ee, { size: "small" }, {
                  default: t(() => [...r[11] || (r[11] = [
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
        e(te, {
          modelValue: _.value,
          "onUpdate:modelValue": r[5] || (r[5] = (h) => _.value = h),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(W, null, {
              default: t(() => [
                e(G, null, {
                  default: t(() => [
                    l(k(z.value ? "Edit system user" : "New system user"), 1)
                  ]),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => [
                    e(A, {
                      ref_key: "formRef",
                      ref: x,
                      onSubmit: de(i, ["prevent"])
                    }, {
                      default: t(() => [
                        e(H, {
                          modelValue: b.value.login,
                          "onUpdate:modelValue": r[2] || (r[2] = (h) => b.value.login = h),
                          label: "Login",
                          rules: [N.required],
                          disabled: !!z.value,
                          variant: "outlined",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules", "disabled"]),
                        e(Z, {
                          modelValue: b.value.roles,
                          "onUpdate:modelValue": r[3] || (r[3] = (h) => b.value.roles = h),
                          label: "Roles",
                          items: U.value,
                          "item-value": "id",
                          "item-title": "name",
                          multiple: "",
                          chips: "",
                          "closable-chips": "",
                          variant: "outlined",
                          rules: [N.requiredArray]
                        }, null, 8, ["modelValue", "items", "rules"])
                      ]),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(P, null, {
                  default: t(() => [
                    e(R),
                    e(F, {
                      variant: "text",
                      onClick: r[4] || (r[4] = (h) => _.value = !1)
                    }, {
                      default: t(() => [...r[12] || (r[12] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(F, {
                      color: "primary",
                      variant: "elevated",
                      loading: V.value,
                      onClick: i
                    }, {
                      default: t(() => [...r[13] || (r[13] = [
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
        e(te, {
          modelValue: j.value,
          "onUpdate:modelValue": r[7] || (r[7] = (h) => j.value = h),
          "max-width": "420"
        }, {
          default: t(() => [
            e(W, null, {
              default: t(() => [
                e(G, null, {
                  default: t(() => [...r[14] || (r[14] = [
                    l("Delete system user", -1)
                  ])]),
                  _: 1
                }),
                e(K, null, {
                  default: t(() => {
                    var h;
                    return [
                      r[15] || (r[15] = l("Remove ", -1)),
                      p("strong", null, k((h = D.value) == null ? void 0 : h.login), 1),
                      r[16] || (r[16] = l(" from system accounts?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(P, null, {
                  default: t(() => [
                    e(R),
                    e(F, {
                      variant: "text",
                      onClick: r[6] || (r[6] = (h) => j.value = !1)
                    }, {
                      default: t(() => [...r[17] || (r[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(F, {
                      color: "error",
                      variant: "elevated",
                      loading: C.value,
                      onClick: a
                    }, {
                      default: t(() => [...r[18] || (r[18] = [
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
}, pt = /* @__PURE__ */ pe(ct, [["__scopeId", "data-v-3bd83da2"]]), vt = { class: "d-flex align-center mb-4" }, ft = {
  __name: "SystemRoleView",
  setup(o) {
    const u = ie(), f = ae(), c = v([]), g = v(!1), s = v(null), S = v(null), U = v(!1), x = v(null), _ = v({ name: "", apiPatterns: [], uiPatterns: [] }), z = v(!1), b = v(!1), V = v(null), j = v(!1), D = { required: (O) => !!O || "Required" }, C = [
      { title: "Name", key: "name", sortable: !0, width: "180px" },
      { title: "API patterns", key: "authApi", sortable: !1 },
      { title: "UI patterns", key: "authUi", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    async function N() {
      g.value = !0, s.value = null;
      const O = await u.get("rest/system/security/role/withAuth"), m = (O == null ? void 0 : O.data) || O || [];
      for (const i of m)
        i["authorizations-api"] = (i.authorizations || []).filter((a) => a.type === "api"), i["authorizations-ui"] = (i.authorizations || []).filter((a) => a.type === "ui");
      c.value = m, g.value = !1;
    }
    function J() {
      x.value = null, _.value = { name: "", apiPatterns: [], uiPatterns: [] }, U.value = !0;
    }
    function X(O) {
      x.value = O, _.value = {
        name: O.name,
        apiPatterns: (O["authorizations-api"] || []).map((m) => m.pattern),
        uiPatterns: (O["authorizations-ui"] || []).map((m) => m.pattern)
      }, U.value = !0;
    }
    function I(O) {
      V.value = O, b.value = !0;
    }
    async function Y() {
      var a;
      const { valid: O } = await S.value.validate();
      if (!O) return;
      z.value = !0;
      const m = {
        id: (a = x.value) == null ? void 0 : a.id,
        name: _.value.name,
        authorizations: [
          ..._.value.apiPatterns.map((w) => ({ pattern: w, type: "api" })),
          ..._.value.uiPatterns.map((w) => ({ pattern: w, type: "ui" }))
        ]
      }, i = x.value ? "put" : "post";
      await u[i]("rest/system/security/role", m), z.value = !1, U.value = !1, N();
    }
    async function ne() {
      j.value = !0, await u.del(`rest/system/security/role/${V.value.id}`), j.value = !1, b.value = !1, N();
    }
    return le(() => {
      f.setTitle("Roles"), f.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]), N();
    }), (O, m) => {
      const i = n("v-spacer"), a = n("v-btn"), w = n("v-alert"), r = n("v-icon"), R = n("v-data-table"), H = n("v-card-title"), F = n("v-text-field"), $ = n("v-combobox"), d = n("v-form"), ee = n("v-card-text"), Q = n("v-card-actions"), G = n("v-card"), Z = n("v-dialog");
      return y(), T("div", null, [
        p("div", vt, [
          m[8] || (m[8] = p("h1", { class: "text-h4" }, "Roles", -1)),
          e(i),
          e(a, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: J
          }, {
            default: t(() => [...m[7] || (m[7] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        s.value ? (y(), q(w, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(k(s.value), 1)
          ]),
          _: 1
        })) : E("", !0),
        e(R, {
          headers: C,
          items: c.value,
          loading: g.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.authApi": t(({ item: A }) => [
            (y(!0), T(ue, null, ce(A["authorizations-api"], (K) => (y(), T("code", {
              key: K.id || K.pattern,
              class: "auth-token"
            }, k(K.pattern), 1))), 128))
          ]),
          "item.authUi": t(({ item: A }) => [
            (y(!0), T(ue, null, ce(A["authorizations-ui"], (K) => (y(), T("code", {
              key: K.id || K.pattern,
              class: "auth-token"
            }, k(K.pattern), 1))), 128))
          ]),
          "item.actions": t(({ item: A }) => [
            e(a, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (K) => X(A)
            }, {
              default: t(() => [
                e(r, { size: "small" }, {
                  default: t(() => [...m[9] || (m[9] = [
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
              onClick: (K) => I(A)
            }, {
              default: t(() => [
                e(r, { size: "small" }, {
                  default: t(() => [...m[10] || (m[10] = [
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
        e(Z, {
          modelValue: U.value,
          "onUpdate:modelValue": m[4] || (m[4] = (A) => U.value = A),
          "max-width": "640",
          persistent: ""
        }, {
          default: t(() => [
            e(G, null, {
              default: t(() => [
                e(H, null, {
                  default: t(() => [
                    l(k(x.value ? "Edit role" : "New role"), 1)
                  ]),
                  _: 1
                }),
                e(ee, null, {
                  default: t(() => [
                    e(d, {
                      ref_key: "formRef",
                      ref: S,
                      onSubmit: de(Y, ["prevent"])
                    }, {
                      default: t(() => [
                        e(F, {
                          modelValue: _.value.name,
                          "onUpdate:modelValue": m[0] || (m[0] = (A) => _.value.name = A),
                          label: "Name",
                          rules: [D.required],
                          variant: "outlined",
                          class: "mb-4",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e($, {
                          modelValue: _.value.apiPatterns,
                          "onUpdate:modelValue": m[1] || (m[1] = (A) => _.value.apiPatterns = A),
                          label: "API authorization patterns (regex)",
                          items: _.value.apiPatterns,
                          chips: "",
                          "closable-chips": "",
                          multiple: "",
                          variant: "outlined",
                          hint: "Press Enter after each pattern",
                          "persistent-hint": "",
                          class: "mb-4"
                        }, null, 8, ["modelValue", "items"]),
                        e($, {
                          modelValue: _.value.uiPatterns,
                          "onUpdate:modelValue": m[2] || (m[2] = (A) => _.value.uiPatterns = A),
                          label: "UI authorization patterns (regex)",
                          items: _.value.uiPatterns,
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
                    e(i),
                    e(a, {
                      variant: "text",
                      onClick: m[3] || (m[3] = (A) => U.value = !1)
                    }, {
                      default: t(() => [...m[11] || (m[11] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "primary",
                      variant: "elevated",
                      loading: z.value,
                      onClick: Y
                    }, {
                      default: t(() => [...m[12] || (m[12] = [
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
        e(Z, {
          modelValue: b.value,
          "onUpdate:modelValue": m[6] || (m[6] = (A) => b.value = A),
          "max-width": "420"
        }, {
          default: t(() => [
            e(G, null, {
              default: t(() => [
                e(H, null, {
                  default: t(() => [...m[13] || (m[13] = [
                    l("Delete role", -1)
                  ])]),
                  _: 1
                }),
                e(ee, null, {
                  default: t(() => {
                    var A;
                    return [
                      m[14] || (m[14] = l("Delete role ", -1)),
                      p("strong", null, k((A = V.value) == null ? void 0 : A.name), 1),
                      m[15] || (m[15] = l("?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(Q, null, {
                  default: t(() => [
                    e(i),
                    e(a, {
                      variant: "text",
                      onClick: m[5] || (m[5] = (A) => b.value = !1)
                    }, {
                      default: t(() => [...m[16] || (m[16] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "error",
                      variant: "elevated",
                      loading: j.value,
                      onClick: ne
                    }, {
                      default: t(() => [...m[17] || (m[17] = [
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
}, _t = /* @__PURE__ */ pe(ft, [["__scopeId", "data-v-e3ba71a8"]]), yt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, gt = { key: 0 }, bt = { key: 0 }, kt = {
  __name: "SystemPluginView",
  setup(o) {
    const u = ie(), f = ae(), c = [
      { id: "central", label: "Maven Central" },
      { id: "nexus", label: "OSSRH Nexus" }
    ], g = v("central"), s = v([]), S = v(!1), U = v(null), x = v(!1), _ = v(!1), z = v(!1), b = v(""), V = v(!1), j = v(!1), D = [
      { title: "", key: "type", sortable: !1, width: "40px" },
      { title: "Artifact", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0 },
      { title: "Vendor", key: "vendor", sortable: !0, width: "160px" },
      { title: "Version", key: "version", sortable: !1, width: "280px" },
      { title: "Nodes", key: "nodes", sortable: !0, width: "80px", align: "center" },
      { title: "Subs", key: "subscriptions", sortable: !0, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function C(m) {
      var a, w;
      const i = (w = (a = m.plugin) == null ? void 0 : a.type) == null ? void 0 : w.toLowerCase();
      return i ? i === "feature" ? "mdi-wrench" : i === "service" ? "mdi-puzzle" : i === "tool" ? "mdi-hammer-wrench" : "mdi-puzzle" : "mdi-link-off";
    }
    async function N() {
      S.value = !0, U.value = null;
      const m = await u.get(`rest/system/plugin?repository=${g.value}`);
      s.value = Array.isArray(m) ? m : (m == null ? void 0 : m.data) || [], S.value = !1;
    }
    async function J() {
      x.value = !0, await u.put(`rest/system/plugin/cache?repository=${g.value}`), x.value = !1, N();
    }
    async function X() {
      _.value = !0, await u.put("rest/system/plugin/restart"), _.value = !1;
    }
    async function I(m, i = !1) {
      j.value = !0;
      const a = `repository=${g.value}&javadoc=${i ? !1 : V.value}`;
      await u.post(`rest/system/plugin/${encodeURIComponent(m)}?${a}`), j.value = !1, z.value = !1, b.value = "", V.value = !1, N();
    }
    function Y() {
      b.value && I(b.value.trim());
    }
    async function ne(m) {
      await u.del(`rest/system/plugin/${m.plugin.artifact}/${m.latestLocalVersion}`), N();
    }
    async function O(m) {
      confirm(`Delete plug-in ${m}?`) && (await u.del(`rest/system/plugin/${m}`), N());
    }
    return le(() => {
      f.setTitle("Plug-ins"), f.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plug-ins" }]), N();
    }), (m, i) => {
      const a = n("v-spacer"), w = n("v-select"), r = n("v-btn"), R = n("v-alert"), H = n("v-icon"), F = n("v-chip"), $ = n("v-data-table"), d = n("v-card-title"), ee = n("v-text-field"), Q = n("v-checkbox"), G = n("v-card-text"), Z = n("v-card-actions"), A = n("v-card"), K = n("v-dialog");
      return y(), T("div", null, [
        p("div", yt, [
          i[9] || (i[9] = p("h1", { class: "text-h4" }, "Plugins", -1)),
          e(a),
          e(w, {
            modelValue: g.value,
            "onUpdate:modelValue": [
              i[0] || (i[0] = (P) => g.value = P),
              N
            ],
            items: c,
            "item-value": "id",
            "item-title": "label",
            label: "Repository",
            density: "compact",
            "hide-details": "",
            variant: "outlined",
            style: { "max-width": "200px" }
          }, null, 8, ["modelValue"]),
          e(r, {
            variant: "outlined",
            "prepend-icon": "mdi-magnify-plus",
            onClick: J,
            loading: x.value
          }, {
            default: t(() => [...i[6] || (i[6] = [
              l(" Check versions ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(r, {
            color: "error",
            variant: "outlined",
            "prepend-icon": "mdi-restart",
            onClick: X,
            loading: _.value
          }, {
            default: t(() => [...i[7] || (i[7] = [
              l(" Restart ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(r, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: i[1] || (i[1] = (P) => z.value = !0)
          }, {
            default: t(() => [...i[8] || (i[8] = [
              l("Install", -1)
            ])]),
            _: 1
          })
        ]),
        U.value ? (y(), q(R, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(k(U.value), 1)
          ]),
          _: 1
        })) : E("", !0),
        e($, {
          headers: D,
          items: s.value,
          loading: S.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.type": t(({ item: P }) => {
            var W;
            return [
              e(H, {
                size: "small",
                title: (W = P.plugin) == null ? void 0 : W.type
              }, {
                default: t(() => [
                  l(k(C(P)), 1)
                ]),
                _: 2
              }, 1032, ["title"])
            ];
          }),
          "item.version": t(({ item: P }) => {
            var W;
            return [
              p("span", null, k(((W = P.plugin) == null ? void 0 : W.version) || "—"), 1),
              P.latestLocalVersion ? (y(), q(F, {
                key: 0,
                size: "x-small",
                color: "primary",
                class: "ml-1",
                closable: "",
                "onClick:close": (te) => ne(P),
                title: "Cancel local install"
              }, {
                default: t(() => [
                  l(k(P.latestLocalVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick:close"])) : E("", !0),
              P.newVersion && P.newVersion !== P.latestLocalVersion ? (y(), q(F, {
                key: 1,
                size: "x-small",
                color: "success",
                class: "ml-1",
                onClick: (te) => I(P.plugin.artifact, !0),
                title: "Upgrade available — click to install"
              }, {
                default: t(() => [
                  e(H, {
                    start: "",
                    size: "x-small"
                  }, {
                    default: t(() => [...i[10] || (i[10] = [
                      l("mdi-arrow-up", -1)
                    ])]),
                    _: 1
                  }),
                  l(k(P.newVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : E("", !0)
            ];
          }),
          "item.nodes": t(({ item: P }) => {
            var W, te;
            return [
              ((te = (W = P.plugin) == null ? void 0 : W.type) == null ? void 0 : te.toLowerCase()) !== "feature" ? (y(), T("span", gt, k(P.nodes ?? 0), 1)) : E("", !0)
            ];
          }),
          "item.subscriptions": t(({ item: P }) => {
            var W, te;
            return [
              ((te = (W = P.plugin) == null ? void 0 : W.type) == null ? void 0 : te.toLowerCase()) !== "feature" ? (y(), T("span", bt, k(P.subscriptions ?? 0), 1)) : E("", !0)
            ];
          }),
          "item.actions": t(({ item: P }) => [
            P.deleted ? (y(), q(H, {
              key: 0,
              size: "small",
              color: "warning",
              title: "Deletion scheduled"
            }, {
              default: t(() => [...i[11] || (i[11] = [
                l("mdi-cancel", -1)
              ])]),
              _: 1
            })) : (y(), q(r, {
              key: 1,
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (W) => O(P.plugin.artifact),
              title: "Delete plug-in"
            }, {
              default: t(() => [
                e(H, { size: "small" }, {
                  default: t(() => [...i[12] || (i[12] = [
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
          modelValue: z.value,
          "onUpdate:modelValue": i[5] || (i[5] = (P) => z.value = P),
          "max-width": "520"
        }, {
          default: t(() => [
            e(A, null, {
              default: t(() => [
                e(d, null, {
                  default: t(() => [...i[13] || (i[13] = [
                    l("Install plug-in", -1)
                  ])]),
                  _: 1
                }),
                e(G, null, {
                  default: t(() => [
                    e(ee, {
                      modelValue: b.value,
                      "onUpdate:modelValue": i[2] || (i[2] = (P) => b.value = P),
                      label: "Artifact id (e.g. plugin-prov-aws)",
                      variant: "outlined",
                      hint: `Repository: ${g.value}`,
                      "persistent-hint": "",
                      class: "mb-2",
                      autofocus: ""
                    }, null, 8, ["modelValue", "hint"]),
                    e(Q, {
                      modelValue: V.value,
                      "onUpdate:modelValue": i[3] || (i[3] = (P) => V.value = P),
                      label: "Install Javadoc bundle",
                      density: "compact",
                      "hide-details": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                e(Z, null, {
                  default: t(() => [
                    e(a),
                    e(r, {
                      variant: "text",
                      onClick: i[4] || (i[4] = (P) => z.value = !1)
                    }, {
                      default: t(() => [...i[14] || (i[14] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(r, {
                      color: "primary",
                      variant: "elevated",
                      loading: j.value,
                      disabled: !b.value,
                      onClick: Y
                    }, {
                      default: t(() => [...i[15] || (i[15] = [
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
}, wt = { class: "d-flex align-center mb-4" }, xt = {
  __name: "SystemNodeView",
  setup(o) {
    const u = ie(), f = ae(), c = v([]), g = v(!1), s = v(null), S = v(!1), U = v(null), x = v(!1), _ = [
      { title: "Identifier", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Status", key: "status", sortable: !0, width: "120px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function z(D) {
      var N;
      const C = (N = D == null ? void 0 : D.toLowerCase) == null ? void 0 : N.call(D);
      return C === "up" ? "success" : C === "down" ? "error" : C === "unknown" ? "warning" : "grey";
    }
    async function b() {
      g.value = !0, s.value = null;
      const D = await u.get("rest/node");
      c.value = Array.isArray(D) ? D : (D == null ? void 0 : D.data) || [], g.value = !1;
    }
    function V(D) {
      U.value = D, S.value = !0;
    }
    async function j() {
      x.value = !0, await u.del(`rest/node/${encodeURIComponent(U.value.id)}`), x.value = !1, S.value = !1, b();
    }
    return le(() => {
      f.setTitle("Nodes"), f.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]), b();
    }), (D, C) => {
      const N = n("v-spacer"), J = n("v-btn"), X = n("v-alert"), I = n("v-chip"), Y = n("v-icon"), ne = n("v-data-table"), O = n("v-card-title"), m = n("v-card-text"), i = n("v-card-actions"), a = n("v-card"), w = n("v-dialog");
      return y(), T("div", null, [
        p("div", wt, [
          C[3] || (C[3] = p("h1", { class: "text-h4" }, "Nodes", -1)),
          e(N),
          e(J, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            to: "/subscribe"
          }, {
            default: t(() => [...C[2] || (C[2] = [
              l("New subscription", -1)
            ])]),
            _: 1
          })
        ]),
        s.value ? (y(), q(X, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(k(s.value), 1)
          ]),
          _: 1
        })) : E("", !0),
        e(ne, {
          headers: _,
          items: c.value,
          loading: g.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.id": t(({ item: r }) => [
            p("code", null, k(r.id), 1)
          ]),
          "item.status": t(({ item: r }) => [
            r.status ? (y(), q(I, {
              key: 0,
              size: "x-small",
              color: z(r.status),
              variant: "tonal"
            }, {
              default: t(() => [
                l(k(r.status), 1)
              ]),
              _: 2
            }, 1032, ["color"])) : E("", !0)
          ]),
          "item.actions": t(({ item: r }) => [
            e(J, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (R) => V(r)
            }, {
              default: t(() => [
                e(Y, { size: "small" }, {
                  default: t(() => [...C[4] || (C[4] = [
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
        e(w, {
          modelValue: S.value,
          "onUpdate:modelValue": C[1] || (C[1] = (r) => S.value = r),
          "max-width": "460"
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(O, null, {
                  default: t(() => [...C[5] || (C[5] = [
                    l("Delete node", -1)
                  ])]),
                  _: 1
                }),
                e(m, null, {
                  default: t(() => {
                    var r, R;
                    return [
                      C[6] || (C[6] = l(" Delete ", -1)),
                      p("strong", null, k((r = U.value) == null ? void 0 : r.name), 1),
                      C[7] || (C[7] = l(" (", -1)),
                      p("code", null, k((R = U.value) == null ? void 0 : R.id), 1),
                      C[8] || (C[8] = l(")? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(i, null, {
                  default: t(() => [
                    e(N),
                    e(J, {
                      variant: "text",
                      onClick: C[0] || (C[0] = (r) => S.value = !1)
                    }, {
                      default: t(() => [...C[9] || (C[9] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(J, {
                      color: "error",
                      variant: "elevated",
                      loading: x.value,
                      onClick: j
                    }, {
                      default: t(() => [...C[10] || (C[10] = [
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
}, Vt = { class: "d-flex align-center mb-4" }, ht = { class: "d-flex align-center ga-2" }, Ct = { class: "d-flex align-center ga-2" }, $t = {
  __name: "SystemCacheView",
  setup(o) {
    const u = ie(), f = ae(), c = v([]), g = v(!1), s = v(null), S = v(null), U = [
      { title: "Cache", key: "id", sortable: !0 },
      { title: "Size", key: "size", sortable: !0, width: "100px" },
      { title: "Hits", key: "hitCount", sortable: !0, width: "160px" },
      { title: "Misses", key: "missCount", sortable: !0, width: "160px" },
      { title: "Avg get (ms)", key: "averageGetTime", sortable: !0, width: "140px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function x(b, V, j) {
      return V && j === 1 || b >= 90 ? "success" : b >= 80 ? "primary" : b >= 50 ? "warning" : "error";
    }
    async function _() {
      g.value = !0, s.value = null;
      const b = await u.get("rest/system/cache");
      Array.isArray(b) ? c.value = b : b === null && (s.value = "Unable to load caches"), g.value = !1;
    }
    async function z(b) {
      S.value = b.id, await u.post(`rest/system/cache/${encodeURIComponent(b.id)}`), S.value = null, _();
    }
    return le(() => {
      f.setTitle("Caches"), f.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Caches" }]), _();
    }), (b, V) => {
      const j = n("v-spacer"), D = n("v-btn"), C = n("v-alert"), N = n("v-chip"), J = n("v-icon"), X = n("v-data-table");
      return y(), T("div", null, [
        p("div", Vt, [
          V[1] || (V[1] = p("h1", { class: "text-h4" }, "Caches", -1)),
          e(j),
          e(D, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            onClick: _
          }, {
            default: t(() => [...V[0] || (V[0] = [
              l("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        s.value ? (y(), q(C, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(k(s.value), 1)
          ]),
          _: 1
        })) : E("", !0),
        e(X, {
          headers: U,
          items: c.value,
          loading: g.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.hitCount": t(({ item: I }) => [
            p("div", ht, [
              p("span", null, k(I.hitCount ?? 0), 1),
              I.hitPercentage != null && (I.hitCount ?? 0) > 0 ? (y(), q(N, {
                key: 0,
                size: "x-small",
                color: x(I.hitPercentage, !0, I.hitCount)
              }, {
                default: t(() => [
                  l(k(Math.round(I.hitPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : E("", !0)
            ])
          ]),
          "item.missCount": t(({ item: I }) => [
            p("div", Ct, [
              p("span", null, k(I.missCount ?? 0), 1),
              I.missPercentage != null && (I.missCount ?? 0) > 1 ? (y(), q(N, {
                key: 0,
                size: "x-small",
                color: x(100 - I.missPercentage, !1)
              }, {
                default: t(() => [
                  l(k(Math.round(I.missPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : E("", !0)
            ])
          ]),
          "item.averageGetTime": t(({ item: I }) => [
            l(k(I.averageGetTime ?? "—"), 1)
          ]),
          "item.actions": t(({ item: I }) => [
            e(D, {
              icon: "",
              size: "small",
              variant: "text",
              loading: S.value === I.id,
              onClick: (Y) => z(I),
              title: "Invalidate cache"
            }, {
              default: t(() => [
                e(J, { size: "small" }, {
                  default: t(() => [...V[2] || (V[2] = [
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
}, St = { key: 1 }, Pt = {
  __name: "SystemBenchView",
  setup(o) {
    const u = ie(), f = ae(), c = [
      { key: "insert", step: "INSERT", method: "post", url: "rest/system/bench/prepare" },
      { key: "select", step: "SELECT", method: "get", url: "rest/system/bench/read" },
      { key: "select-all", step: "SELECT *", method: "get", url: "rest/system/bench/read/all" },
      { key: "update", step: "UPDATE", method: "put", url: "rest/system/bench/update" },
      { key: "delete", step: "DELETE", method: "del", url: "rest/system/bench/delete" }
    ], g = v(!1), s = v(null), S = v(c.map((x) => ({ step: x.step, duration: null, loading: !1 })));
    async function U() {
      g.value = !0, s.value = null, S.value = c.map((x) => ({ step: x.step, duration: null, loading: !1 }));
      for (let x = 0; x < c.length; x++) {
        S.value[x].loading = !0;
        try {
          const _ = c[x].method === "post" || c[x].method === "put" ? void 0 : null, z = _ === null ? await u[c[x].method](c[x].url) : await u[c[x].method](c[x].url, _);
          S.value[x].duration = (z == null ? void 0 : z.duration) ?? "—";
        } catch (_) {
          s.value = `${c[x].step} failed: ${_.message || _}`;
          break;
        } finally {
          S.value[x].loading = !1;
        }
      }
      g.value = !1;
    }
    return le(() => {
      f.setTitle("Bench"), f.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (x, _) => {
      const z = n("v-card-text"), b = n("v-card"), V = n("v-btn"), j = n("v-alert"), D = n("v-progress-circular"), C = n("v-table");
      return y(), T("div", null, [
        _[3] || (_[3] = p("h1", { class: "text-h4 mb-4" }, "Database bench", -1)),
        e(b, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(z, null, {
              default: t(() => [..._[0] || (_[0] = [
                l(" Runs a sequence of ", -1),
                p("code", null, "INSERT", -1),
                l(" → ", -1),
                p("code", null, "SELECT", -1),
                l(" → ", -1),
                p("code", null, "SELECT *", -1),
                l(" → ", -1),
                p("code", null, "UPDATE", -1),
                l(" → ", -1),
                p("code", null, "DELETE", -1),
                l(" calls and reports each step's duration. Handy to validate that the backend's persistence layer is responsive. ", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }),
        e(V, {
          color: "primary",
          "prepend-icon": "mdi-play",
          loading: g.value,
          onClick: U
        }, {
          default: t(() => [..._[1] || (_[1] = [
            l(" Run bench ", -1)
          ])]),
          _: 1
        }, 8, ["loading"]),
        s.value ? (y(), q(j, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mt-4"
        }, {
          default: t(() => [
            l(k(s.value), 1)
          ]),
          _: 1
        })) : E("", !0),
        S.value.length ? (y(), q(C, {
          key: 1,
          density: "compact",
          class: "mt-4",
          style: { "max-width": "600px" }
        }, {
          default: t(() => [
            _[2] || (_[2] = p("thead", null, [
              p("tr", null, [
                p("th", null, "Step"),
                p("th", null, "Duration (ms)")
              ])
            ], -1)),
            p("tbody", null, [
              (y(!0), T(ue, null, ce(S.value, (N) => (y(), T("tr", {
                key: N.step
              }, [
                p("td", null, k(N.step), 1),
                p("td", null, [
                  N.loading ? (y(), q(D, {
                    key: 0,
                    size: "16",
                    width: "2",
                    indeterminate: ""
                  })) : (y(), T("span", St, k(N.duration ?? "—"), 1))
                ])
              ]))), 128))
            ])
          ]),
          _: 1
        })) : E("", !0)
      ]);
    };
  }
}, Dt = { class: "pa-4" }, zt = {
  __name: "ApiHomeView",
  setup(o) {
    const u = ae();
    return le(() => {
      u.setTitle("API"), u.setBreadcrumbs([{ title: "API" }]);
    }), (f, c) => {
      const g = n("v-alert");
      return y(), T("div", Dt, [
        c[1] || (c[1] = p("h1", { class: "text-h4 mb-4" }, "API", -1)),
        e(g, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...c[0] || (c[0] = [
            l(" Legacy ", -1),
            p("code", null, "webjars/api/", -1),
            l(". TODO: OpenAPI/Swagger rendering or static docs panel. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, Tt = { class: "pa-4" }, Ut = {
  __name: "ApiTokenView",
  setup(o) {
    const u = ae();
    return le(() => {
      u.setTitle("API tokens"), u.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]);
    }), (f, c) => {
      const g = n("v-alert");
      return y(), T("div", Tt, [
        c[1] || (c[1] = p("h1", { class: "text-h4 mb-4" }, "API — Tokens", -1)),
        e(g, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...c[0] || (c[0] = [
            l(" Legacy ", -1),
            p("code", null, "webjars/api/token/", -1),
            l(". TODO: personal API token management (create / revoke) via ", -1),
            p("code", null, "rest/security/api-token", -1),
            l(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, Nt = { class: "pa-4" }, At = {
  __name: "SubscribeWizardView",
  setup(o) {
    const u = ae();
    return le(() => {
      u.setTitle("Subscribe"), u.setBreadcrumbs([{ title: "Subscribe" }]);
    }), (f, c) => {
      const g = n("v-alert");
      return y(), T("div", Nt, [
        c[1] || (c[1] = p("h1", { class: "text-h4 mb-4" }, "Subscribe wizard", -1)),
        e(g, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...c[0] || (c[0] = [
            l(" Legacy ", -1),
            p("code", null, "webjars/subscribe-wizard/", -1),
            l(". TODO: multi-step flow (select project → pick service → pick tool → configure parameters) backing ", -1),
            p("code", null, "rest/subscription", -1),
            l(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, jt = {
  sample: Ve.sample
}, ge = [
  { path: "/home", name: "ui-home", component: je },
  { path: "/home/manual", name: "ui-manual", component: rt },
  { path: "/home/project", name: "ui-project-list", component: Ge },
  { path: "/home/project/:id", name: "ui-project-detail", component: st },
  { path: "/system", name: "ui-system", component: dt },
  { path: "/system/user", name: "ui-system-user", component: pt },
  { path: "/system/role", name: "ui-system-role", component: _t },
  { path: "/system/plugin", name: "ui-system-plugin", component: kt },
  { path: "/system/node", name: "ui-system-node", component: xt },
  { path: "/system/cache", name: "ui-system-cache", component: $t },
  { path: "/system/bench", name: "ui-system-bench", component: Pt },
  { path: "/api", name: "ui-api", component: zt },
  { path: "/api/token", name: "ui-api-token", component: Ut },
  { path: "/subscribe", name: "ui-subscribe", component: At }
], Jt = {
  id: "ui",
  label: "UI",
  component: Ne,
  routes: ge,
  install({ router: o }) {
    for (const u of ge)
      o.addRoute(u);
  },
  feature(o, ...u) {
    const f = jt[o];
    if (!f) throw new Error(`Plugin "ui" has no feature "${o}"`);
    return f(...u);
  },
  service: Ve,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  Wt as TARGET_TYPE_ICON,
  Jt as default,
  he as getFullName,
  Gt as getHierarchyIds,
  Le as getService,
  Mt as getServiceFromId,
  Ht as getServiceNameFromId,
  Re as getTool,
  qt as getToolFromId,
  Ft as getToolNameFromId,
  Bt as htmlEscape,
  Ot as htmlUnescape,
  Be as normalize,
  Ve as service,
  Ie as toUser2Letters,
  Et as trimObject
};
