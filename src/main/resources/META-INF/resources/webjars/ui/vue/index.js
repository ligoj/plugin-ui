import { resolveComponent as d, openBlock as v, createElementBlock as _, createVNode as t, withCtx as n, createTextVNode as a, onMounted as D, createElementVNode as m, ref as h, computed as _e, unref as x, createBlock as H, toDisplayString as w, createCommentVNode as $, withDirectives as Se, withModifiers as ae, Fragment as me, vShow as Ve, watch as je, renderList as $e } from "vue";
import { useAppStore as T, useI18nStore as ye, useApi as be, useDataTable as De, useErrorStore as Te } from "@ligoj/host";
import { useRouter as ge, useRoute as Ne } from "vue-router";
const ke = (e, o) => {
  const u = e.__vccOpts || e;
  for (const [s, c] of o)
    u[s] = c;
  return u;
}, Le = { class: "plugin-ui-shell" }, Pe = {
  __name: "UiPlugin",
  setup(e) {
    return (o, u) => {
      const s = d("v-alert"), c = d("v-list-subheader"), r = d("v-list-item"), L = d("v-list");
      return v(), _("div", Le, [
        t(s, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: n(() => [...u[0] || (u[0] = [
            a(" plugin-ui is being migrated from the legacy Cascade.js implementation — most views below are placeholders and link back to their legacy sources. ", -1)
          ])]),
          _: 1
        }),
        t(L, {
          density: "compact",
          class: "mb-4"
        }, {
          default: n(() => [
            t(c, null, {
              default: n(() => [...u[1] || (u[1] = [
                a("Dashboard", -1)
              ])]),
              _: 1
            }),
            t(r, {
              to: "/home",
              "prepend-icon": "mdi-view-dashboard",
              title: "Overview"
            }),
            t(r, {
              to: "/home/project",
              "prepend-icon": "mdi-folder-multiple",
              title: "Projects"
            }),
            t(r, {
              to: "/home/manual",
              "prepend-icon": "mdi-book-open-page-variant",
              title: "Manual"
            }),
            t(c, null, {
              default: n(() => [...u[2] || (u[2] = [
                a("System", -1)
              ])]),
              _: 1
            }),
            t(r, {
              to: "/system",
              "prepend-icon": "mdi-cog",
              title: "System administration"
            }),
            t(c, null, {
              default: n(() => [...u[3] || (u[3] = [
                a("API", -1)
              ])]),
              _: 1
            }),
            t(r, {
              to: "/api",
              "prepend-icon": "mdi-api",
              title: "API reference"
            }),
            t(r, {
              to: "/api/token",
              "prepend-icon": "mdi-key-variant",
              title: "API tokens"
            }),
            t(c, null, {
              default: n(() => [...u[4] || (u[4] = [
                a("Onboarding", -1)
              ])]),
              _: 1
            }),
            t(r, {
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
}, Ce = /* @__PURE__ */ ke(Pe, [["__scopeId", "data-v-9cfeae95"]]), we = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, Ue = { class: "pa-4" }, Oe = {
  __name: "HomeView",
  setup(e) {
    const o = T(), { t: u } = ye();
    return D(() => {
      o.setTitle(u("nav.home") || "Home"), o.setBreadcrumbs([{ title: u("nav.home") || "Home" }]);
    }), (s, c) => {
      const r = d("v-alert");
      return v(), _("div", Ue, [
        c[1] || (c[1] = m("h1", { class: "text-h4 mb-4" }, "Dashboard", -1)),
        t(r, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...c[0] || (c[0] = [
            a(" Dashboard view — port from legacy ", -1),
            m("code", null, "webjars/home/home.js", -1),
            a(" (projects grid, quick actions). TODO. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
};
function Ct(e) {
  if (!e || typeof e != "object") return e;
  for (const o of Object.keys(e)) {
    const u = e[o];
    (u == null || u === "" || u === !1) && delete e[o];
  }
  return e;
}
function Ut(e) {
  return typeof e != "string" ? "" : e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Ot(e) {
  return typeof e != "string" ? "" : e.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Ae(e) {
  if (!e) return "??";
  if (e.firstName && e.lastName)
    return e.firstName.charAt(0) + e.lastName.charAt(0);
  if (e.fullName) {
    const u = e.fullName.split(" ");
    return u.length === 1 ? e.fullName.charAt(0) + (e.fullName.length >= 2 ? e.fullName.charAt(1) : "") : u[0].charAt(0) + u[u.length - 1].charAt(0);
  }
  const o = (e.id || e || "??").toString();
  return (o.length === 1 ? o + o : o).slice(0, 2);
}
function he(e) {
  if (!e) return "";
  if (e.fullName) return e.fullName;
  if (e.firstName && e.lastName) return `${e.firstName} ${e.lastName}`;
  if (e.firstName) return `${e.firstName} ${(e.id || "").substring(1)}`;
  if (e.lastName) return `${de((e.id || "").charAt(0))}. ${e.lastName}`;
  const o = (e.id || e || "??").toString();
  return `${de(o.charAt(0))}. ${de(o.substring(1))}`;
}
function de(e) {
  return e && e.charAt(0).toUpperCase() + e.slice(1);
}
function At(e) {
  if (!e) return null;
  const o = e.split(":");
  return o.length > 2 ? o.slice(0, 3).join("-") : null;
}
function Bt(e) {
  if (!e) return null;
  const o = e.split(":");
  return o.length > 1 ? o.slice(0, 2).join("-") : null;
}
function zt(e) {
  return (e || "").split(":")[1] || null;
}
function It(e) {
  return (e || "").split(":")[2] || null;
}
function Rt(e) {
  if (!e) return [];
  const o = e.split(":"), u = [];
  for (let s = 2; s <= o.length; s++)
    u.push(o.slice(0, s).join("-"));
  return u;
}
function Be(e) {
  return e ? (e.service || (e.service = e.refined && Be(e.refined) || e), e.service) : null;
}
function ze(e) {
  return e ? e.tool ? e.tool : e.refined ? (e.tool = e.refined.refined ? ze(e.refined) : e, e.tool) : null : null;
}
const Ie = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function Re(e) {
  return e ? e.replace(/[-[()\]${},;_:]/g, " ").replace(Ie, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const Mt = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, Me = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, qe = { class: "text-caption" }, Ee = {
  key: 1,
  class: "text-disabled"
}, He = { class: "mb-4" }, Fe = {
  __name: "ProjectListView",
  setup(e) {
    const o = ge(), u = be(), s = T(), { t: c } = ye(), r = De("project", { defaultSort: "name" }), L = h(25);
    let C = null, z = {};
    const S = h(null), U = h(!1), V = h(null), b = h({ name: "", pkey: "", teamLeader: "", description: "" }), F = h(!1), I = h(!1), G = h(null), Z = h(!1), Y = h(!1);
    let Q = "";
    const oe = _e(() => [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Description", key: "description", sortable: !1 },
      { title: "Manager", key: "teamLeader", sortable: !1, width: "220px" },
      { title: "Created", key: "createdDate", sortable: !0, width: "140px" },
      { title: "Subs", key: "nbSubscriptions", sortable: !1, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ]), M = {
      required: (p) => !!p || "Required",
      pkey: (p) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(p || "") || "Use lowercase letters, digits, dash"
    };
    function le(p) {
      if (!p) return "";
      const i = typeof p == "number" ? new Date(p) : new Date(p);
      return isNaN(i.getTime()) ? "" : i.toISOString().slice(0, 10);
    }
    function se(p) {
      z = p, r.load(p);
    }
    function ie() {
      clearTimeout(C), C = setTimeout(
        () => r.load({ page: 1, itemsPerPage: L.value, sortBy: z.sortBy }),
        300
      );
    }
    function g(p) {
      const i = Re(p || "").split(" ").filter(Boolean);
      return i.length ? i.join("-") : "";
    }
    function l() {
      var i;
      if (((i = V.value) == null ? void 0 : i.nbSubscriptions) > 0) return;
      const p = g(b.value.name);
      (!b.value.pkey || b.value.pkey === Q) && (b.value.pkey = p, Q = p);
    }
    function P() {
      V.value = null, b.value = { name: "", pkey: "", teamLeader: "", description: "" }, Q = "", U.value = !0;
    }
    function O(p) {
      var i;
      V.value = p, b.value = {
        name: p.name || "",
        pkey: p.pkey || "",
        teamLeader: ((i = p.teamLeader) == null ? void 0 : i.id) || "",
        description: p.description || ""
      }, Q = p.pkey || "", U.value = !0;
    }
    function j(p) {
      G.value = p, Y.value = !1, I.value = !0;
    }
    async function A() {
      var N, q, X;
      const { valid: p } = await S.value.validate();
      if (!p) return;
      if (r.demoMode.value) {
        U.value = !1;
        return;
      }
      F.value = !0;
      const i = {
        id: (N = V.value) == null ? void 0 : N.id,
        name: b.value.name,
        pkey: b.value.pkey,
        teamLeader: b.value.teamLeader,
        description: b.value.description
      }, J = (q = V.value) != null && q.id ? "put" : "post", R = await u[J]("rest/project", i);
      F.value = !1, R !== null && (U.value = !1, !((X = V.value) != null && X.id) && typeof R != "object" ? o.push(`/home/project/${R}`) : r.load(z));
    }
    async function W() {
      if (r.demoMode.value) {
        I.value = !1;
        return;
      }
      Z.value = !0;
      const p = Y.value ? "?deleteRemoteData=true" : "";
      await u.del(`rest/project/${G.value.id}${p}`), Z.value = !1, I.value = !1, r.load(z);
    }
    return D(() => {
      s.setTitle("Projects"), s.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), (p, i) => {
      const J = d("v-spacer"), R = d("v-text-field"), N = d("v-btn"), q = d("v-alert"), X = d("v-skeleton-loader"), re = d("v-avatar"), ne = d("v-chip"), ee = d("v-icon"), ue = d("v-data-table-server"), y = d("v-card-title"), k = d("v-textarea"), E = d("v-form"), te = d("v-card-text"), ce = d("v-card-actions"), pe = d("v-card"), ve = d("v-dialog"), xe = d("v-checkbox");
      return v(), _("div", null, [
        m("div", Me, [
          i[13] || (i[13] = m("h1", { class: "text-h4" }, "Projects", -1)),
          t(J),
          t(R, {
            modelValue: x(r).search.value,
            "onUpdate:modelValue": [
              i[0] || (i[0] = (f) => x(r).search.value = f),
              ie
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          t(N, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: P
          }, {
            default: n(() => [...i[12] || (i[12] = [
              a(" New ", -1)
            ])]),
            _: 1
          })
        ]),
        x(r).error.value ? (v(), H(q, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: n(() => [
            a(w(x(r).error.value), 1)
          ]),
          _: 1
        })) : $("", !0),
        x(r).demoMode.value ? (v(), H(q, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: n(() => [...i[14] || (i[14] = [
            a(" Running without a live backend — results below are sample data. ", -1)
          ])]),
          _: 1
        })) : $("", !0),
        x(r).loading.value && x(r).items.value.length === 0 ? (v(), H(X, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : $("", !0),
        x(r).error.value ? $("", !0) : Se((v(), H(ue, {
          key: 3,
          "items-per-page": L.value,
          "onUpdate:itemsPerPage": i[1] || (i[1] = (f) => L.value = f),
          headers: oe.value,
          items: x(r).items.value,
          "items-length": x(r).totalItems.value,
          loading: x(r).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": se,
          "onClick:row": i[2] || (i[2] = (f, { item: B }) => x(o).push(`/home/project/${B.id}`))
        }, {
          "item.teamLeader": n(({ item: f }) => {
            var B;
            return [
              (B = f.teamLeader) != null && B.id ? (v(), _(me, { key: 0 }, [
                t(re, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: n(() => [
                    m("span", qe, w(x(Ae)(f.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                a(" " + w(x(he)(f.teamLeader)), 1)
              ], 64)) : (v(), _("span", Ee, "—"))
            ];
          }),
          "item.createdDate": n(({ item: f }) => [
            a(w(le(f.createdDate)), 1)
          ]),
          "item.nbSubscriptions": n(({ item: f }) => [
            t(ne, {
              size: "small",
              variant: "tonal"
            }, {
              default: n(() => [
                a(w(f.nbSubscriptions || 0), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          "item.actions": n(({ item: f }) => [
            t(N, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: ae((B) => O(f), ["stop"])
            }, {
              default: n(() => [
                t(ee, { size: "small" }, {
                  default: n(() => [...i[15] || (i[15] = [
                    a("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            t(N, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: ae((B) => j(f), ["stop"])
            }, {
              default: n(() => [
                t(ee, { size: "small" }, {
                  default: n(() => [...i[16] || (i[16] = [
                    a("mdi-delete", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["items-per-page", "headers", "items", "items-length", "loading"])), [
          [Ve, x(r).items.value.length > 0 || !x(r).loading.value]
        ]),
        t(ve, {
          modelValue: U.value,
          "onUpdate:modelValue": i[8] || (i[8] = (f) => U.value = f),
          "max-width": "600",
          persistent: ""
        }, {
          default: n(() => [
            t(pe, null, {
              default: n(() => [
                t(y, null, {
                  default: n(() => {
                    var f;
                    return [
                      a(w((f = V.value) != null && f.id ? "Edit project" : "New project"), 1)
                    ];
                  }),
                  _: 1
                }),
                t(te, null, {
                  default: n(() => [
                    t(E, {
                      ref_key: "formRef",
                      ref: S,
                      onSubmit: ae(A, ["prevent"])
                    }, {
                      default: n(() => {
                        var f, B;
                        return [
                          t(R, {
                            modelValue: b.value.name,
                            "onUpdate:modelValue": [
                              i[3] || (i[3] = (K) => b.value.name = K),
                              l
                            ],
                            label: "Name",
                            rules: [M.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          t(R, {
                            modelValue: b.value.pkey,
                            "onUpdate:modelValue": i[4] || (i[4] = (K) => b.value.pkey = K),
                            label: "Project key (pkey)",
                            rules: [M.required, M.pkey],
                            disabled: ((f = V.value) == null ? void 0 : f.nbSubscriptions) > 0,
                            hint: ((B = V.value) == null ? void 0 : B.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          t(R, {
                            modelValue: b.value.teamLeader,
                            "onUpdate:modelValue": i[5] || (i[5] = (K) => b.value.teamLeader = K),
                            label: "Team leader (user id)",
                            rules: [M.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          t(k, {
                            modelValue: b.value.description,
                            "onUpdate:modelValue": i[6] || (i[6] = (K) => b.value.description = K),
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
                t(ce, null, {
                  default: n(() => [
                    t(J),
                    t(N, {
                      variant: "text",
                      onClick: i[7] || (i[7] = (f) => U.value = !1)
                    }, {
                      default: n(() => [...i[17] || (i[17] = [
                        a("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    t(N, {
                      color: "primary",
                      variant: "elevated",
                      loading: F.value,
                      onClick: A
                    }, {
                      default: n(() => [...i[18] || (i[18] = [
                        a("Save", -1)
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
        t(ve, {
          modelValue: I.value,
          "onUpdate:modelValue": i[11] || (i[11] = (f) => I.value = f),
          "max-width": "500"
        }, {
          default: n(() => [
            t(pe, null, {
              default: n(() => [
                t(y, null, {
                  default: n(() => [...i[19] || (i[19] = [
                    a("Delete project", -1)
                  ])]),
                  _: 1
                }),
                t(te, null, {
                  default: n(() => {
                    var f;
                    return [
                      m("p", He, [
                        i[20] || (i[20] = a(" Are you sure you want to delete ", -1)),
                        m("strong", null, w((f = G.value) == null ? void 0 : f.name), 1),
                        i[21] || (i[21] = a("? ", -1))
                      ]),
                      t(xe, {
                        modelValue: Y.value,
                        "onUpdate:modelValue": i[9] || (i[9] = (B) => Y.value = B),
                        label: "Also remove remote data associated with this project's subscriptions",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                t(ce, null, {
                  default: n(() => [
                    t(J),
                    t(N, {
                      variant: "text",
                      onClick: i[10] || (i[10] = (f) => I.value = !1)
                    }, {
                      default: n(() => [...i[22] || (i[22] = [
                        a("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    t(N, {
                      color: "error",
                      variant: "elevated",
                      loading: Z.value,
                      onClick: W
                    }, {
                      default: n(() => [...i[23] || (i[23] = [
                        a("Delete", -1)
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
}, We = /* @__PURE__ */ ke(Fe, [["__scopeId", "data-v-6023d08b"]]), Ge = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, Ye = { class: "text-h4" }, Je = { class: "text-h6 text-medium-emphasis" }, Ke = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, Qe = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, Xe = { key: 0 }, Ze = {
  key: 0,
  class: "ml-1"
}, et = { key: 1 }, tt = {
  key: 0,
  class: "ml-1"
}, lt = { key: 2 }, nt = {
  key: 0,
  class: "ml-1"
}, at = { class: "d-flex align-center mb-2" }, ot = { class: "mb-3" }, st = {
  __name: "ProjectDetailView",
  setup(e) {
    const o = Ne();
    ge();
    const u = be(), s = T();
    Te();
    const c = h(!1), r = h(null), L = _e(() => {
      var g;
      return ((g = r.value) == null ? void 0 : g.subscriptions) || [];
    }), C = h(null), z = h(!1), S = h({ name: "", pkey: "", teamLeader: "", description: "" }), U = h(!1), V = h(!1), b = h(null), F = h(!1), I = h(!1), G = {
      required: (g) => !!g || "Required"
    }, Z = [
      { title: "Service", key: "service", sortable: !1, width: "180px" },
      { title: "Tool", key: "tool", sortable: !1, width: "180px" },
      { title: "Node", key: "node", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function Y(g) {
      if (!g) return "";
      const l = new Date(g);
      return isNaN(l.getTime()) ? "" : l.toISOString().slice(0, 16).replace("T", " ");
    }
    function Q(g) {
      var j, A, W;
      const l = ((W = (A = (j = g.node) == null ? void 0 : j.refined) == null ? void 0 : A.refined) == null ? void 0 : W.id) || "", P = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let O = 0;
      for (const p of l) O += p.charCodeAt(0);
      return P[O % P.length];
    }
    function oe(g) {
      var P, O, j;
      const l = ((j = (O = (P = g.node) == null ? void 0 : P.refined) == null ? void 0 : O.refined) == null ? void 0 : j.id) || "";
      return l.includes(":scm:") ? "mdi-source-branch" : l.includes(":build:") ? "mdi-hammer-wrench" : l.includes(":bt") ? "mdi-bug" : l.includes(":km:") ? "mdi-book-open-variant" : l.includes(":vm") ? "mdi-server" : l.includes(":prov") ? "mdi-cloud" : l.includes(":id") ? "mdi-account-group" : l.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function M() {
      var P;
      c.value = !0;
      const g = o.params.id, l = await u.get(`rest/project/${g}`);
      r.value = l || null, c.value = !1, l && (S.value = {
        name: l.name || "",
        pkey: l.pkey || "",
        teamLeader: ((P = l.teamLeader) == null ? void 0 : P.id) || "",
        description: l.description || ""
      }, s.setTitle(l.name), s.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        { title: l.name }
      ]));
    }
    async function le() {
      const { valid: g } = await C.value.validate();
      if (!g) return;
      U.value = !0;
      const l = {
        id: r.value.id,
        name: S.value.name,
        pkey: S.value.pkey,
        teamLeader: S.value.teamLeader,
        description: S.value.description
      };
      await u.put("rest/project", l), U.value = !1, z.value = !1, await M();
    }
    function se(g) {
      b.value = g, F.value = !1, V.value = !0;
    }
    async function ie() {
      I.value = !0, await u.del(`rest/subscription/${b.value.id}/${F.value ? "true" : "false"}`), I.value = !1, V.value = !1, await M();
    }
    return je(() => o.params.id, (g) => {
      g && M();
    }), D(M), (g, l) => {
      const P = d("v-skeleton-loader"), O = d("v-spacer"), j = d("v-btn"), A = d("v-icon"), W = d("v-card-text"), p = d("v-card"), i = d("v-chip"), J = d("v-alert"), R = d("v-data-table"), N = d("v-card-title"), q = d("v-text-field"), X = d("v-textarea"), re = d("v-form"), ne = d("v-card-actions"), ee = d("v-dialog"), ue = d("v-checkbox");
      return v(), _("div", null, [
        c.value && !r.value ? (v(), H(P, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : $("", !0),
        r.value ? (v(), _(me, { key: 1 }, [
          m("div", Ge, [
            m("div", null, [
              m("h1", Ye, [
                a(w(r.value.name) + " ", 1),
                m("span", Je, "(" + w(r.value.pkey) + ")", 1)
              ]),
              r.value.description ? (v(), _("p", Ke, w(r.value.description), 1)) : $("", !0)
            ]),
            t(O),
            r.value.manageSubscriptions ? (v(), H(j, {
              key: 0,
              color: "primary",
              "prepend-icon": "mdi-plus",
              to: `/home/project/${r.value.id}/subscription`
            }, {
              default: n(() => [...l[10] || (l[10] = [
                a(" Add subscription ", -1)
              ])]),
              _: 1
            }, 8, ["to"])) : $("", !0),
            t(j, {
              variant: "outlined",
              "prepend-icon": "mdi-pencil",
              onClick: l[0] || (l[0] = (y) => z.value = !0)
            }, {
              default: n(() => [...l[11] || (l[11] = [
                a(" Edit ", -1)
              ])]),
              _: 1
            })
          ]),
          t(p, {
            variant: "tonal",
            class: "mb-4"
          }, {
            default: n(() => [
              t(W, { class: "py-2" }, {
                default: n(() => [
                  m("div", Qe, [
                    r.value.teamLeader ? (v(), _("span", Xe, [
                      t(A, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: n(() => [...l[12] || (l[12] = [
                          a("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      l[13] || (l[13] = m("strong", null, "Manager:", -1)),
                      a(" " + w(x(he)(r.value.teamLeader)) + " ", 1),
                      r.value.teamLeader.id ? (v(), _("span", Ze, "(" + w(r.value.teamLeader.id) + ")", 1)) : $("", !0)
                    ])) : $("", !0),
                    r.value.createdDate ? (v(), _("span", et, [
                      t(A, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: n(() => [...l[14] || (l[14] = [
                          a("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      l[15] || (l[15] = m("strong", null, "Created:", -1)),
                      a(" " + w(Y(r.value.createdDate)) + " ", 1),
                      r.value.createdBy ? (v(), _("span", tt, " by " + w(r.value.createdBy.id || r.value.createdBy), 1)) : $("", !0)
                    ])) : $("", !0),
                    r.value.lastModifiedDate ? (v(), _("span", lt, [
                      t(A, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: n(() => [...l[16] || (l[16] = [
                          a("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      l[17] || (l[17] = m("strong", null, "Updated:", -1)),
                      a(" " + w(Y(r.value.lastModifiedDate)) + " ", 1),
                      r.value.lastModifiedBy ? (v(), _("span", nt, " by " + w(r.value.lastModifiedBy.id || r.value.lastModifiedBy), 1)) : $("", !0)
                    ])) : $("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          m("div", at, [
            l[18] || (l[18] = m("h2", { class: "text-h6" }, "Subscriptions", -1)),
            t(i, {
              class: "ml-2",
              size: "small",
              variant: "tonal"
            }, {
              default: n(() => [
                a(w(L.value.length), 1)
              ]),
              _: 1
            })
          ]),
          L.value.length === 0 ? (v(), H(J, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: n(() => [...l[19] || (l[19] = [
              a(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (v(), H(R, {
            key: 1,
            headers: Z,
            items: L.value,
            "item-value": "id",
            "items-per-page": -1,
            "hide-default-footer": "",
            density: "compact"
          }, {
            "item.service": n(({ item: y }) => [
              t(i, {
                size: "small",
                variant: "tonal",
                color: Q(y)
              }, {
                default: n(() => {
                  var k, E, te;
                  return [
                    t(A, {
                      start: "",
                      size: "small"
                    }, {
                      default: n(() => [
                        a(w(oe(y)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    a(" " + w(((te = (E = (k = y.node) == null ? void 0 : k.refined) == null ? void 0 : E.refined) == null ? void 0 : te.name) || "—"), 1)
                  ];
                }),
                _: 2
              }, 1032, ["color"])
            ]),
            "item.tool": n(({ item: y }) => {
              var k, E;
              return [
                a(w(((E = (k = y.node) == null ? void 0 : k.refined) == null ? void 0 : E.name) || "—"), 1)
              ];
            }),
            "item.node": n(({ item: y }) => {
              var k;
              return [
                m("code", null, w((k = y.node) == null ? void 0 : k.id), 1)
              ];
            }),
            "item.actions": n(({ item: y }) => [
              r.value.manageSubscriptions ? (v(), H(j, {
                key: 0,
                icon: "",
                size: "small",
                variant: "text",
                color: "error",
                onClick: (k) => se(y),
                title: "Unsubscribe"
              }, {
                default: n(() => [
                  t(A, { size: "small" }, {
                    default: n(() => [...l[20] || (l[20] = [
                      a("mdi-close", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["onClick"])) : $("", !0)
            ]),
            _: 1
          }, 8, ["items"]))
        ], 64)) : $("", !0),
        t(ee, {
          modelValue: z.value,
          "onUpdate:modelValue": l[6] || (l[6] = (y) => z.value = y),
          "max-width": "600",
          persistent: ""
        }, {
          default: n(() => [
            t(p, null, {
              default: n(() => [
                t(N, null, {
                  default: n(() => [...l[21] || (l[21] = [
                    a("Edit project", -1)
                  ])]),
                  _: 1
                }),
                t(W, null, {
                  default: n(() => [
                    t(re, {
                      ref_key: "formRef",
                      ref: C,
                      onSubmit: ae(le, ["prevent"])
                    }, {
                      default: n(() => {
                        var y;
                        return [
                          t(q, {
                            modelValue: S.value.name,
                            "onUpdate:modelValue": l[1] || (l[1] = (k) => S.value.name = k),
                            label: "Name",
                            rules: [G.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          t(q, {
                            modelValue: S.value.pkey,
                            "onUpdate:modelValue": l[2] || (l[2] = (k) => S.value.pkey = k),
                            label: "Project key (pkey)",
                            rules: [G.required],
                            disabled: (((y = r.value) == null ? void 0 : y.nbSubscriptions) || L.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          t(q, {
                            modelValue: S.value.teamLeader,
                            "onUpdate:modelValue": l[3] || (l[3] = (k) => S.value.teamLeader = k),
                            label: "Team leader (user id)",
                            rules: [G.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          t(X, {
                            modelValue: S.value.description,
                            "onUpdate:modelValue": l[4] || (l[4] = (k) => S.value.description = k),
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
                t(ne, null, {
                  default: n(() => [
                    t(O),
                    t(j, {
                      variant: "text",
                      onClick: l[5] || (l[5] = (y) => z.value = !1)
                    }, {
                      default: n(() => [...l[22] || (l[22] = [
                        a("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    t(j, {
                      color: "primary",
                      variant: "elevated",
                      loading: U.value,
                      onClick: le
                    }, {
                      default: n(() => [...l[23] || (l[23] = [
                        a("Save", -1)
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
        t(ee, {
          modelValue: V.value,
          "onUpdate:modelValue": l[9] || (l[9] = (y) => V.value = y),
          "max-width": "480"
        }, {
          default: n(() => [
            t(p, null, {
              default: n(() => [
                t(N, null, {
                  default: n(() => [...l[24] || (l[24] = [
                    a("Unsubscribe", -1)
                  ])]),
                  _: 1
                }),
                t(W, null, {
                  default: n(() => {
                    var y, k;
                    return [
                      m("p", ot, [
                        l[25] || (l[25] = a(" Remove subscription to ", -1)),
                        m("strong", null, w((k = (y = b.value) == null ? void 0 : y.node) == null ? void 0 : k.name), 1),
                        l[26] || (l[26] = a("? ", -1))
                      ]),
                      t(ue, {
                        modelValue: F.value,
                        "onUpdate:modelValue": l[7] || (l[7] = (E) => F.value = E),
                        label: "Also delete remote data on the target service",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                t(ne, null, {
                  default: n(() => [
                    t(O),
                    t(j, {
                      variant: "text",
                      onClick: l[8] || (l[8] = (y) => V.value = !1)
                    }, {
                      default: n(() => [...l[27] || (l[27] = [
                        a("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    t(j, {
                      color: "error",
                      variant: "elevated",
                      loading: I.value,
                      onClick: ie
                    }, {
                      default: n(() => [...l[28] || (l[28] = [
                        a(" Remove ", -1)
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
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("Manual"), o.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", it, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Embedded user manual — legacy ", -1),
            m("code", null, "webjars/home/manual/", -1),
            a(". TODO. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, ut = { class: "pa-4" }, dt = {
  __name: "SystemView",
  setup(e) {
    const o = T(), u = [
      { to: "/system/user", icon: "mdi-account-multiple", title: "Users", subtitle: "Active sessions and accounts" },
      { to: "/system/role", icon: "mdi-shield-account", title: "Roles", subtitle: "Authorization rules" },
      { to: "/system/plugin", icon: "mdi-puzzle", title: "Plugins", subtitle: "Installed feature plugins" },
      { to: "/system/node", icon: "mdi-server", title: "Nodes", subtitle: "Service & tool registrations" },
      { to: "/system/cache", icon: "mdi-database-refresh", title: "Cache", subtitle: "Invalidate application caches" },
      { to: "/system/bench", icon: "mdi-speedometer", title: "Bench", subtitle: "Diagnostics" }
    ];
    return D(() => {
      o.setTitle("System"), o.setBreadcrumbs([{ title: "System" }]);
    }), (s, c) => {
      const r = d("v-list-item"), L = d("v-list");
      return v(), _("div", ut, [
        c[0] || (c[0] = m("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        t(L, null, {
          default: n(() => [
            (v(), _(me, null, $e(u, (C) => t(r, {
              key: C.to,
              to: C.to,
              "prepend-icon": C.icon,
              title: C.title,
              subtitle: C.subtitle
            }, null, 8, ["to", "prepend-icon", "title", "subtitle"])), 64))
          ]),
          _: 1
        })
      ]);
    };
  }
}, mt = { class: "pa-4" }, ct = {
  __name: "SystemUserView",
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("System users"), o.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", mt, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "System — Users", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Legacy ", -1),
            m("code", null, "webjars/system/user/", -1),
            a(". TODO: active sessions list from ", -1),
            m("code", null, "rest/system/user", -1),
            a(", kick session action. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, pt = { class: "pa-4" }, vt = {
  __name: "SystemRoleView",
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("Roles"), o.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", pt, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "System — Roles", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Legacy ", -1),
            m("code", null, "webjars/system/role/", -1),
            a(". TODO: CRUD over ", -1),
            m("code", null, "rest/system/security/role", -1),
            a(", authorization pattern editor. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, ft = { class: "pa-4" }, _t = {
  __name: "SystemPluginView",
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("Plugins"), o.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plugins" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", ft, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "System — Plugins", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Legacy ", -1),
            m("code", null, "webjars/system/plugin/", -1),
            a(". TODO: installed-plugin grid, install/uninstall/restart actions against ", -1),
            m("code", null, "rest/system/plugin", -1),
            a(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, yt = { class: "pa-4" }, bt = {
  __name: "SystemNodeView",
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("Nodes"), o.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", yt, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "System — Nodes", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Legacy ", -1),
            m("code", null, "webjars/system/node/", -1),
            a(". TODO: hierarchical node tree (service → tool → instance), parameter editor, tool-icon rendering via ", -1),
            m("code", null, "useUiHelpers", -1),
            a(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, gt = { class: "pa-4" }, kt = {
  __name: "SystemCacheView",
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("Cache"), o.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Cache" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", gt, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "System — Cache", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Legacy ", -1),
            m("code", null, "webjars/system/cache/", -1),
            a(". TODO: invalidate caches (global + per-name) via ", -1),
            m("code", null, "rest/system/cache", -1),
            a(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, wt = { class: "pa-4" }, ht = {
  __name: "SystemBenchView",
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("Bench"), o.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", wt, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "System — Bench", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Legacy ", -1),
            m("code", null, "webjars/system/bench/", -1),
            a(". TODO: diagnostics endpoint panel. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, xt = { class: "pa-4" }, St = {
  __name: "ApiHomeView",
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("API"), o.setBreadcrumbs([{ title: "API" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", xt, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "API", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Legacy ", -1),
            m("code", null, "webjars/api/", -1),
            a(". TODO: OpenAPI/Swagger rendering or static docs panel. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, Vt = { class: "pa-4" }, jt = {
  __name: "ApiTokenView",
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("API tokens"), o.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", Vt, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "API — Tokens", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Legacy ", -1),
            m("code", null, "webjars/api/token/", -1),
            a(". TODO: personal API token management (create / revoke) via ", -1),
            m("code", null, "rest/security/api-token", -1),
            a(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, $t = { class: "pa-4" }, Dt = {
  __name: "SubscribeWizardView",
  setup(e) {
    const o = T();
    return D(() => {
      o.setTitle("Subscribe"), o.setBreadcrumbs([{ title: "Subscribe" }]);
    }), (u, s) => {
      const c = d("v-alert");
      return v(), _("div", $t, [
        s[1] || (s[1] = m("h1", { class: "text-h4 mb-4" }, "Subscribe wizard", -1)),
        t(c, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: n(() => [...s[0] || (s[0] = [
            a(" Legacy ", -1),
            m("code", null, "webjars/subscribe-wizard/", -1),
            a(". TODO: multi-step flow (select project → pick service → pick tool → configure parameters) backing ", -1),
            m("code", null, "rest/subscription", -1),
            a(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, Tt = {
  sample: we.sample
}, fe = [
  { path: "/home", name: "ui-home", component: Oe },
  { path: "/home/manual", name: "ui-manual", component: rt },
  { path: "/home/project", name: "ui-project-list", component: We },
  { path: "/home/project/:id", name: "ui-project-detail", component: st },
  { path: "/system", name: "ui-system", component: dt },
  { path: "/system/user", name: "ui-system-user", component: ct },
  { path: "/system/role", name: "ui-system-role", component: vt },
  { path: "/system/plugin", name: "ui-system-plugin", component: _t },
  { path: "/system/node", name: "ui-system-node", component: bt },
  { path: "/system/cache", name: "ui-system-cache", component: kt },
  { path: "/system/bench", name: "ui-system-bench", component: ht },
  { path: "/api", name: "ui-api", component: St },
  { path: "/api/token", name: "ui-api-token", component: jt },
  { path: "/subscribe", name: "ui-subscribe", component: Dt }
], qt = {
  id: "ui",
  label: "UI",
  component: Ce,
  routes: fe,
  install({ router: e }) {
    for (const o of fe)
      e.addRoute(o);
  },
  feature(e, ...o) {
    const u = Tt[e];
    if (!u) throw new Error(`Plugin "ui" has no feature "${e}"`);
    return u(...o);
  },
  service: we,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  Mt as TARGET_TYPE_ICON,
  qt as default,
  he as getFullName,
  Rt as getHierarchyIds,
  Be as getService,
  Bt as getServiceFromId,
  zt as getServiceNameFromId,
  ze as getTool,
  At as getToolFromId,
  It as getToolNameFromId,
  Ut as htmlEscape,
  Ot as htmlUnescape,
  Re as normalize,
  we as service,
  Ae as toUser2Letters,
  Ct as trimObject
};
