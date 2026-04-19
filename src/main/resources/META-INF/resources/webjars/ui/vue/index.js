import { resolveComponent as n, openBlock as b, createElementBlock as j, createVNode as e, withCtx as t, createTextVNode as l, onMounted as oe, createElementVNode as v, ref as r, computed as be, unref as Y, createBlock as W, toDisplayString as w, createCommentVNode as M, withDirectives as $e, withModifiers as ce, Fragment as pe, vShow as he, watch as Pe, renderList as ve, onBeforeUnmount as Ue } from "vue";
import { useAppStore as se, useI18nStore as we, useApi as re, useDataTable as xe, useErrorStore as De, useAuthStore as ze } from "@ligoj/host";
import { useRouter as Ce, useRoute as Ne } from "vue-router";
const fe = (o, m) => {
  const _ = o.__vccOpts || o;
  for (const [g, x] of m)
    _[g] = x;
  return _;
}, Te = { class: "plugin-ui-shell" }, Ae = {
  __name: "UiPlugin",
  setup(o) {
    return (m, _) => {
      const g = n("v-alert"), x = n("v-list-subheader"), i = n("v-list-item"), P = n("v-list");
      return b(), j("div", Te, [
        e(g, {
          type: "warning",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [..._[0] || (_[0] = [
            l(" plugin-ui is being migrated from the legacy Cascade.js implementation — most views below are placeholders and link back to their legacy sources. ", -1)
          ])]),
          _: 1
        }),
        e(P, {
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [
            e(x, null, {
              default: t(() => [..._[1] || (_[1] = [
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
            e(x, null, {
              default: t(() => [..._[2] || (_[2] = [
                l("System", -1)
              ])]),
              _: 1
            }),
            e(i, {
              to: "/system",
              "prepend-icon": "mdi-cog",
              title: "System administration"
            }),
            e(x, null, {
              default: t(() => [..._[3] || (_[3] = [
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
            e(x, null, {
              default: t(() => [..._[4] || (_[4] = [
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
}, Re = /* @__PURE__ */ fe(Ae, [["__scopeId", "data-v-9cfeae95"]]), Ve = {
  /** Placeholder — replaced once real utilities are ported. */
  sample() {
    return "plugin-ui: sample feature called";
  }
}, Ie = { class: "pa-4" }, Le = {
  __name: "HomeView",
  setup(o) {
    const m = se(), { t: _ } = we();
    return oe(() => {
      m.setTitle(_("nav.home") || "Home"), m.setBreadcrumbs([{ title: _("nav.home") || "Home" }]);
    }), (g, x) => {
      const i = n("v-alert");
      return b(), j("div", Ie, [
        x[1] || (x[1] = v("h1", { class: "text-h4 mb-4" }, "Dashboard", -1)),
        e(i, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...x[0] || (x[0] = [
            l(" Dashboard view — port from legacy ", -1),
            v("code", null, "webjars/home/home.js", -1),
            l(" (projects grid, quick actions). TODO. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
};
function Mt(o) {
  if (!o || typeof o != "object") return o;
  for (const m of Object.keys(o)) {
    const _ = o[m];
    (_ == null || _ === "" || _ === !1) && delete o[m];
  }
  return o;
}
function Ft(o) {
  return typeof o != "string" ? "" : o.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Gt(o) {
  return typeof o != "string" ? "" : o.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function je(o) {
  if (!o) return "??";
  if (o.firstName && o.lastName)
    return o.firstName.charAt(0) + o.lastName.charAt(0);
  if (o.fullName) {
    const _ = o.fullName.split(" ");
    return _.length === 1 ? o.fullName.charAt(0) + (o.fullName.length >= 2 ? o.fullName.charAt(1) : "") : _[0].charAt(0) + _[_.length - 1].charAt(0);
  }
  const m = (o.id || o || "??").toString();
  return (m.length === 1 ? m + m : m).slice(0, 2);
}
function Se(o) {
  if (!o) return "";
  if (o.fullName) return o.fullName;
  if (o.firstName && o.lastName) return `${o.firstName} ${o.lastName}`;
  if (o.firstName) return `${o.firstName} ${(o.id || "").substring(1)}`;
  if (o.lastName) return `${ye((o.id || "").charAt(0))}. ${o.lastName}`;
  const m = (o.id || o || "??").toString();
  return `${ye(m.charAt(0))}. ${ye(m.substring(1))}`;
}
function ye(o) {
  return o && o.charAt(0).toUpperCase() + o.slice(1);
}
function Ht(o) {
  if (!o) return null;
  const m = o.split(":");
  return m.length > 2 ? m.slice(0, 3).join("-") : null;
}
function Wt(o) {
  if (!o) return null;
  const m = o.split(":");
  return m.length > 1 ? m.slice(0, 2).join("-") : null;
}
function Jt(o) {
  return (o || "").split(":")[1] || null;
}
function Xt(o) {
  return (o || "").split(":")[2] || null;
}
function Yt(o) {
  if (!o) return [];
  const m = o.split(":"), _ = [];
  for (let g = 2; g <= m.length; g++)
    _.push(m.slice(0, g).join("-"));
  return _;
}
function Ee(o) {
  return o ? (o.service || (o.service = o.refined && Ee(o.refined) || o), o.service) : null;
}
function Be(o) {
  return o ? o.tool ? o.tool : o.refined ? (o.tool = o.refined.refined ? Be(o.refined) : o, o.tool) : null : null;
}
const qe = /( (de|du|des|l'|d'|le|la|les|au|aux))+ /gi;
function Oe(o) {
  return o ? o.replace(/[-[()\]${},;_:]/g, " ").replace(qe, " ").replace(/ {2,}/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}
const Kt = {
  company: "mdi-domain",
  group: "mdi-account-group",
  project: "mdi-folder",
  user: "mdi-account",
  tree: "mdi-source-branch",
  node: "mdi-wrench"
}, Me = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, Fe = { class: "text-caption" }, Ge = {
  key: 1,
  class: "text-disabled"
}, He = { class: "mb-4" }, We = {
  __name: "ProjectListView",
  setup(o) {
    const m = Ce(), _ = re(), g = se(), { t: x } = we(), i = xe("project", { defaultSort: "name" }), P = r(25);
    let R = null, S = {};
    const f = r(null), U = r(!1), k = r(null), C = r({ name: "", pkey: "", teamLeader: "", description: "" }), L = r(!1), D = r(!1), y = r(null), V = r(!1), I = r(!1);
    let Q = "";
    const z = be(() => [
      { title: "Name", key: "name", sortable: !0, width: "220px" },
      { title: "Description", key: "description", sortable: !1 },
      { title: "Manager", key: "teamLeader", sortable: !1, width: "220px" },
      { title: "Created", key: "createdDate", sortable: !0, width: "140px" },
      { title: "Subs", key: "nbSubscriptions", sortable: !1, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ]), B = {
      required: (N) => !!N || "Required",
      pkey: (N) => /^[a-z0-9][-a-z0-9]{0,99}$/.test(N || "") || "Use lowercase letters, digits, dash"
    };
    function ee(N) {
      if (!N) return "";
      const p = typeof N == "number" ? new Date(N) : new Date(N);
      return isNaN(p.getTime()) ? "" : p.toISOString().slice(0, 10);
    }
    function q(N) {
      S = N, i.load(N);
    }
    function c() {
      clearTimeout(R), R = setTimeout(
        () => i.load({ page: 1, itemsPerPage: P.value, sortBy: S.sortBy }),
        300
      );
    }
    function u(N) {
      const p = Oe(N || "").split(" ").filter(Boolean);
      return p.length ? p.join("-") : "";
    }
    function a() {
      var p;
      if (((p = k.value) == null ? void 0 : p.nbSubscriptions) > 0) return;
      const N = u(C.value.name);
      (!C.value.pkey || C.value.pkey === Q) && (C.value.pkey = N, Q = N);
    }
    function $() {
      k.value = null, C.value = { name: "", pkey: "", teamLeader: "", description: "" }, Q = "", U.value = !0;
    }
    function d(N) {
      var p;
      k.value = N, C.value = {
        name: N.name || "",
        pkey: N.pkey || "",
        teamLeader: ((p = N.teamLeader) == null ? void 0 : p.id) || "",
        description: N.description || ""
      }, Q = N.pkey || "", U.value = !0;
    }
    function G(N) {
      y.value = N, I.value = !1, D.value = !0;
    }
    async function K() {
      var O, s, A;
      const { valid: N } = await f.value.validate();
      if (!N) return;
      if (i.demoMode.value) {
        U.value = !1;
        return;
      }
      L.value = !0;
      const p = {
        id: (O = k.value) == null ? void 0 : O.id,
        name: C.value.name,
        pkey: C.value.pkey,
        teamLeader: C.value.teamLeader,
        description: C.value.description
      }, ne = (s = k.value) != null && s.id ? "put" : "post", te = await _[ne]("rest/project", p);
      L.value = !1, te !== null && (U.value = !1, !((A = k.value) != null && A.id) && typeof te != "object" ? m.push(`/home/project/${te}`) : i.load(S));
    }
    async function Z() {
      if (i.demoMode.value) {
        D.value = !1;
        return;
      }
      V.value = !0;
      const N = I.value ? "?deleteRemoteData=true" : "";
      await _.del(`rest/project/${y.value.id}${N}`), V.value = !1, D.value = !1, i.load(S);
    }
    return oe(() => {
      g.setTitle("Projects"), g.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Projects" }]);
    }), (N, p) => {
      const ne = n("v-spacer"), te = n("v-text-field"), O = n("v-btn"), s = n("v-alert"), A = n("v-skeleton-loader"), E = n("v-avatar"), T = n("v-chip"), X = n("v-icon"), le = n("v-data-table-server"), h = n("v-card-title"), J = n("v-textarea"), ae = n("v-form"), ue = n("v-card-text"), _e = n("v-card-actions"), de = n("v-card"), me = n("v-dialog"), ge = n("v-checkbox");
      return b(), j("div", null, [
        v("div", Me, [
          p[13] || (p[13] = v("h1", { class: "text-h4" }, "Projects", -1)),
          e(ne),
          e(te, {
            modelValue: Y(i).search.value,
            "onUpdate:modelValue": [
              p[0] || (p[0] = (F) => Y(i).search.value = F),
              c
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(O, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: $
          }, {
            default: t(() => [...p[12] || (p[12] = [
              l(" New ", -1)
            ])]),
            _: 1
          })
        ]),
        Y(i).error.value ? (b(), W(s, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(Y(i).error.value), 1)
          ]),
          _: 1
        })) : M("", !0),
        Y(i).demoMode.value ? (b(), W(s, {
          key: 1,
          type: "info",
          variant: "tonal",
          density: "compact",
          class: "mb-4"
        }, {
          default: t(() => [...p[14] || (p[14] = [
            l(" Running without a live backend — results below are sample data. ", -1)
          ])]),
          _: 1
        })) : M("", !0),
        Y(i).loading.value && Y(i).items.value.length === 0 ? (b(), W(A, {
          key: 2,
          type: "table-heading, table-row@5",
          class: "mb-4"
        })) : M("", !0),
        Y(i).error.value ? M("", !0) : $e((b(), W(le, {
          key: 3,
          "items-per-page": P.value,
          "onUpdate:itemsPerPage": p[1] || (p[1] = (F) => P.value = F),
          headers: z.value,
          items: Y(i).items.value,
          "items-length": Y(i).totalItems.value,
          loading: Y(i).loading.value,
          "item-value": "id",
          hover: "",
          "onUpdate:options": q,
          "onClick:row": p[2] || (p[2] = (F, { item: H }) => Y(m).push(`/home/project/${H.id}`))
        }, {
          "item.teamLeader": t(({ item: F }) => {
            var H;
            return [
              (H = F.teamLeader) != null && H.id ? (b(), j(pe, { key: 0 }, [
                e(E, {
                  size: "24",
                  color: "primary",
                  class: "mr-2"
                }, {
                  default: t(() => [
                    v("span", Fe, w(Y(je)(F.teamLeader)), 1)
                  ]),
                  _: 2
                }, 1024),
                l(" " + w(Y(Se)(F.teamLeader)), 1)
              ], 64)) : (b(), j("span", Ge, "—"))
            ];
          }),
          "item.createdDate": t(({ item: F }) => [
            l(w(ee(F.createdDate)), 1)
          ]),
          "item.nbSubscriptions": t(({ item: F }) => [
            e(T, {
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(w(F.nbSubscriptions || 0), 1)
              ]),
              _: 2
            }, 1024)
          ]),
          "item.actions": t(({ item: F }) => [
            e(O, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: ce((H) => d(F), ["stop"])
            }, {
              default: t(() => [
                e(X, { size: "small" }, {
                  default: t(() => [...p[15] || (p[15] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(O, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: ce((H) => G(F), ["stop"])
            }, {
              default: t(() => [
                e(X, { size: "small" }, {
                  default: t(() => [...p[16] || (p[16] = [
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
          [he, Y(i).items.value.length > 0 || !Y(i).loading.value]
        ]),
        e(me, {
          modelValue: U.value,
          "onUpdate:modelValue": p[8] || (p[8] = (F) => U.value = F),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(de, null, {
              default: t(() => [
                e(h, null, {
                  default: t(() => {
                    var F;
                    return [
                      l(w((F = k.value) != null && F.id ? "Edit project" : "New project"), 1)
                    ];
                  }),
                  _: 1
                }),
                e(ue, null, {
                  default: t(() => [
                    e(ae, {
                      ref_key: "formRef",
                      ref: f,
                      onSubmit: ce(K, ["prevent"])
                    }, {
                      default: t(() => {
                        var F, H;
                        return [
                          e(te, {
                            modelValue: C.value.name,
                            "onUpdate:modelValue": [
                              p[3] || (p[3] = (ie) => C.value.name = ie),
                              a
                            ],
                            label: "Name",
                            rules: [B.required],
                            variant: "outlined",
                            class: "mb-2",
                            autofocus: ""
                          }, null, 8, ["modelValue", "rules"]),
                          e(te, {
                            modelValue: C.value.pkey,
                            "onUpdate:modelValue": p[4] || (p[4] = (ie) => C.value.pkey = ie),
                            label: "Project key (pkey)",
                            rules: [B.required, B.pkey],
                            disabled: ((F = k.value) == null ? void 0 : F.nbSubscriptions) > 0,
                            hint: ((H = k.value) == null ? void 0 : H.nbSubscriptions) > 0 ? "Locked — project has subscriptions" : "lowercase, digits, dash",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled", "hint"]),
                          e(te, {
                            modelValue: C.value.teamLeader,
                            "onUpdate:modelValue": p[5] || (p[5] = (ie) => C.value.teamLeader = ie),
                            label: "Team leader (user id)",
                            rules: [B.required],
                            hint: "Identifier of the user managing this project",
                            "persistent-hint": "",
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(J, {
                            modelValue: C.value.description,
                            "onUpdate:modelValue": p[6] || (p[6] = (ie) => C.value.description = ie),
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
                e(_e, null, {
                  default: t(() => [
                    e(ne),
                    e(O, {
                      variant: "text",
                      onClick: p[7] || (p[7] = (F) => U.value = !1)
                    }, {
                      default: t(() => [...p[17] || (p[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(O, {
                      color: "primary",
                      variant: "elevated",
                      loading: L.value,
                      onClick: K
                    }, {
                      default: t(() => [...p[18] || (p[18] = [
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
        e(me, {
          modelValue: D.value,
          "onUpdate:modelValue": p[11] || (p[11] = (F) => D.value = F),
          "max-width": "500"
        }, {
          default: t(() => [
            e(de, null, {
              default: t(() => [
                e(h, null, {
                  default: t(() => [...p[19] || (p[19] = [
                    l("Delete project", -1)
                  ])]),
                  _: 1
                }),
                e(ue, null, {
                  default: t(() => {
                    var F;
                    return [
                      v("p", He, [
                        p[20] || (p[20] = l(" Are you sure you want to delete ", -1)),
                        v("strong", null, w((F = y.value) == null ? void 0 : F.name), 1),
                        p[21] || (p[21] = l("? ", -1))
                      ]),
                      e(ge, {
                        modelValue: I.value,
                        "onUpdate:modelValue": p[9] || (p[9] = (H) => I.value = H),
                        label: "Also remove remote data associated with this project's subscriptions",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(_e, null, {
                  default: t(() => [
                    e(ne),
                    e(O, {
                      variant: "text",
                      onClick: p[10] || (p[10] = (F) => D.value = !1)
                    }, {
                      default: t(() => [...p[22] || (p[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(O, {
                      color: "error",
                      variant: "elevated",
                      loading: V.value,
                      onClick: Z
                    }, {
                      default: t(() => [...p[23] || (p[23] = [
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
}, Je = /* @__PURE__ */ fe(We, [["__scopeId", "data-v-6023d08b"]]), Xe = { class: "d-flex align-start flex-wrap ga-2 mb-4" }, Ye = { class: "text-h4" }, Ke = { class: "text-h6 text-medium-emphasis" }, Qe = {
  key: 0,
  class: "text-body-2 text-medium-emphasis mt-1"
}, Ze = { class: "d-flex flex-wrap ga-4 text-body-2 text-medium-emphasis" }, et = { key: 0 }, tt = {
  key: 0,
  class: "ml-1"
}, lt = { key: 1 }, nt = {
  key: 0,
  class: "ml-1"
}, at = { key: 2 }, ot = {
  key: 0,
  class: "ml-1"
}, st = { class: "d-flex align-center mb-2" }, it = { class: "mb-3" }, rt = {
  __name: "ProjectDetailView",
  setup(o) {
    const m = Ne();
    Ce();
    const _ = re(), g = se();
    De();
    const x = r(!1), i = r(null), P = be(() => {
      var u;
      return ((u = i.value) == null ? void 0 : u.subscriptions) || [];
    }), R = r(null), S = r(!1), f = r({ name: "", pkey: "", teamLeader: "", description: "" }), U = r(!1), k = r(!1), C = r(null), L = r(!1), D = r(!1), y = {
      required: (u) => !!u || "Required"
    }, V = [
      { title: "Service", key: "service", sortable: !1, width: "180px" },
      { title: "Tool", key: "tool", sortable: !1, width: "180px" },
      { title: "Node", key: "node", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function I(u) {
      if (!u) return "";
      const a = new Date(u);
      return isNaN(a.getTime()) ? "" : a.toISOString().slice(0, 16).replace("T", " ");
    }
    function Q(u) {
      var G, K, Z;
      const a = ((Z = (K = (G = u.node) == null ? void 0 : G.refined) == null ? void 0 : K.refined) == null ? void 0 : Z.id) || "", $ = ["primary", "teal", "indigo", "purple", "orange", "blue-grey"];
      let d = 0;
      for (const N of a) d += N.charCodeAt(0);
      return $[d % $.length];
    }
    function z(u) {
      var $, d, G;
      const a = ((G = (d = ($ = u.node) == null ? void 0 : $.refined) == null ? void 0 : d.refined) == null ? void 0 : G.id) || "";
      return a.includes(":scm:") ? "mdi-source-branch" : a.includes(":build:") ? "mdi-hammer-wrench" : a.includes(":bt") ? "mdi-bug" : a.includes(":km:") ? "mdi-book-open-variant" : a.includes(":vm") ? "mdi-server" : a.includes(":prov") ? "mdi-cloud" : a.includes(":id") ? "mdi-account-group" : a.includes(":inbox:") ? "mdi-email" : "mdi-puzzle";
    }
    async function B() {
      var $;
      x.value = !0;
      const u = m.params.id, a = await _.get(`rest/project/${u}`);
      i.value = a || null, x.value = !1, a && (f.value = {
        name: a.name || "",
        pkey: a.pkey || "",
        teamLeader: (($ = a.teamLeader) == null ? void 0 : $.id) || "",
        description: a.description || ""
      }, g.setTitle(a.name), g.setBreadcrumbs([
        { title: "Home", to: "/" },
        { title: "Projects", to: "/home/project" },
        { title: a.name }
      ]));
    }
    async function ee() {
      const { valid: u } = await R.value.validate();
      if (!u) return;
      U.value = !0;
      const a = {
        id: i.value.id,
        name: f.value.name,
        pkey: f.value.pkey,
        teamLeader: f.value.teamLeader,
        description: f.value.description
      };
      await _.put("rest/project", a), U.value = !1, S.value = !1, await B();
    }
    function q(u) {
      C.value = u, L.value = !1, k.value = !0;
    }
    async function c() {
      D.value = !0, await _.del(`rest/subscription/${C.value.id}/${L.value ? "true" : "false"}`), D.value = !1, k.value = !1, await B();
    }
    return Pe(() => m.params.id, (u) => {
      u && B();
    }), oe(B), (u, a) => {
      const $ = n("v-skeleton-loader"), d = n("v-spacer"), G = n("v-btn"), K = n("v-icon"), Z = n("v-card-text"), N = n("v-card"), p = n("v-chip"), ne = n("v-alert"), te = n("v-data-table"), O = n("v-card-title"), s = n("v-text-field"), A = n("v-textarea"), E = n("v-form"), T = n("v-card-actions"), X = n("v-dialog"), le = n("v-checkbox");
      return b(), j("div", null, [
        x.value && !i.value ? (b(), W($, {
          key: 0,
          type: "card, list-item-two-line@3"
        })) : M("", !0),
        i.value ? (b(), j(pe, { key: 1 }, [
          v("div", Xe, [
            v("div", null, [
              v("h1", Ye, [
                l(w(i.value.name) + " ", 1),
                v("span", Ke, "(" + w(i.value.pkey) + ")", 1)
              ]),
              i.value.description ? (b(), j("p", Qe, w(i.value.description), 1)) : M("", !0)
            ]),
            e(d),
            i.value.manageSubscriptions ? (b(), W(G, {
              key: 0,
              color: "primary",
              "prepend-icon": "mdi-plus",
              to: `/home/project/${i.value.id}/subscription`
            }, {
              default: t(() => [...a[10] || (a[10] = [
                l(" Add subscription ", -1)
              ])]),
              _: 1
            }, 8, ["to"])) : M("", !0),
            e(G, {
              variant: "outlined",
              "prepend-icon": "mdi-pencil",
              onClick: a[0] || (a[0] = (h) => S.value = !0)
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
              e(Z, { class: "py-2" }, {
                default: t(() => [
                  v("div", Ze, [
                    i.value.teamLeader ? (b(), j("span", et, [
                      e(K, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[12] || (a[12] = [
                          l("mdi-account-star", -1)
                        ])]),
                        _: 1
                      }),
                      a[13] || (a[13] = v("strong", null, "Manager:", -1)),
                      l(" " + w(Y(Se)(i.value.teamLeader)) + " ", 1),
                      i.value.teamLeader.id ? (b(), j("span", tt, "(" + w(i.value.teamLeader.id) + ")", 1)) : M("", !0)
                    ])) : M("", !0),
                    i.value.createdDate ? (b(), j("span", lt, [
                      e(K, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[14] || (a[14] = [
                          l("mdi-calendar-plus", -1)
                        ])]),
                        _: 1
                      }),
                      a[15] || (a[15] = v("strong", null, "Created:", -1)),
                      l(" " + w(I(i.value.createdDate)) + " ", 1),
                      i.value.createdBy ? (b(), j("span", nt, " by " + w(i.value.createdBy.id || i.value.createdBy), 1)) : M("", !0)
                    ])) : M("", !0),
                    i.value.lastModifiedDate ? (b(), j("span", at, [
                      e(K, {
                        size: "small",
                        class: "mr-1"
                      }, {
                        default: t(() => [...a[16] || (a[16] = [
                          l("mdi-calendar-edit", -1)
                        ])]),
                        _: 1
                      }),
                      a[17] || (a[17] = v("strong", null, "Updated:", -1)),
                      l(" " + w(I(i.value.lastModifiedDate)) + " ", 1),
                      i.value.lastModifiedBy ? (b(), j("span", ot, " by " + w(i.value.lastModifiedBy.id || i.value.lastModifiedBy), 1)) : M("", !0)
                    ])) : M("", !0)
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          v("div", st, [
            a[18] || (a[18] = v("h2", { class: "text-h6" }, "Subscriptions", -1)),
            e(p, {
              class: "ml-2",
              size: "small",
              variant: "tonal"
            }, {
              default: t(() => [
                l(w(P.value.length), 1)
              ]),
              _: 1
            })
          ]),
          P.value.length === 0 ? (b(), W(ne, {
            key: 0,
            type: "info",
            variant: "tonal",
            density: "compact"
          }, {
            default: t(() => [...a[19] || (a[19] = [
              l(" No subscriptions attached to this project. ", -1)
            ])]),
            _: 1
          })) : (b(), W(te, {
            key: 1,
            headers: V,
            items: P.value,
            "item-value": "id",
            "items-per-page": -1,
            "hide-default-footer": "",
            density: "compact"
          }, {
            "item.service": t(({ item: h }) => [
              e(p, {
                size: "small",
                variant: "tonal",
                color: Q(h)
              }, {
                default: t(() => {
                  var J, ae, ue;
                  return [
                    e(K, {
                      start: "",
                      size: "small"
                    }, {
                      default: t(() => [
                        l(w(z(h)), 1)
                      ]),
                      _: 2
                    }, 1024),
                    l(" " + w(((ue = (ae = (J = h.node) == null ? void 0 : J.refined) == null ? void 0 : ae.refined) == null ? void 0 : ue.name) || "—"), 1)
                  ];
                }),
                _: 2
              }, 1032, ["color"])
            ]),
            "item.tool": t(({ item: h }) => {
              var J, ae;
              return [
                l(w(((ae = (J = h.node) == null ? void 0 : J.refined) == null ? void 0 : ae.name) || "—"), 1)
              ];
            }),
            "item.node": t(({ item: h }) => {
              var J;
              return [
                v("code", null, w((J = h.node) == null ? void 0 : J.id), 1)
              ];
            }),
            "item.actions": t(({ item: h }) => [
              i.value.manageSubscriptions ? (b(), W(G, {
                key: 0,
                icon: "",
                size: "small",
                variant: "text",
                color: "error",
                onClick: (J) => q(h),
                title: "Unsubscribe"
              }, {
                default: t(() => [
                  e(K, { size: "small" }, {
                    default: t(() => [...a[20] || (a[20] = [
                      l("mdi-close", -1)
                    ])]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["onClick"])) : M("", !0)
            ]),
            _: 1
          }, 8, ["items"]))
        ], 64)) : M("", !0),
        e(X, {
          modelValue: S.value,
          "onUpdate:modelValue": a[6] || (a[6] = (h) => S.value = h),
          "max-width": "600",
          persistent: ""
        }, {
          default: t(() => [
            e(N, null, {
              default: t(() => [
                e(O, null, {
                  default: t(() => [...a[21] || (a[21] = [
                    l("Edit project", -1)
                  ])]),
                  _: 1
                }),
                e(Z, null, {
                  default: t(() => [
                    e(E, {
                      ref_key: "formRef",
                      ref: R,
                      onSubmit: ce(ee, ["prevent"])
                    }, {
                      default: t(() => {
                        var h;
                        return [
                          e(s, {
                            modelValue: f.value.name,
                            "onUpdate:modelValue": a[1] || (a[1] = (J) => f.value.name = J),
                            label: "Name",
                            rules: [y.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(s, {
                            modelValue: f.value.pkey,
                            "onUpdate:modelValue": a[2] || (a[2] = (J) => f.value.pkey = J),
                            label: "Project key (pkey)",
                            rules: [y.required],
                            disabled: (((h = i.value) == null ? void 0 : h.nbSubscriptions) || P.value.length) > 0,
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules", "disabled"]),
                          e(s, {
                            modelValue: f.value.teamLeader,
                            "onUpdate:modelValue": a[3] || (a[3] = (J) => f.value.teamLeader = J),
                            label: "Team leader (user id)",
                            rules: [y.required],
                            variant: "outlined",
                            class: "mb-2"
                          }, null, 8, ["modelValue", "rules"]),
                          e(A, {
                            modelValue: f.value.description,
                            "onUpdate:modelValue": a[4] || (a[4] = (J) => f.value.description = J),
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
                e(T, null, {
                  default: t(() => [
                    e(d),
                    e(G, {
                      variant: "text",
                      onClick: a[5] || (a[5] = (h) => S.value = !1)
                    }, {
                      default: t(() => [...a[22] || (a[22] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(G, {
                      color: "primary",
                      variant: "elevated",
                      loading: U.value,
                      onClick: ee
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
        e(X, {
          modelValue: k.value,
          "onUpdate:modelValue": a[9] || (a[9] = (h) => k.value = h),
          "max-width": "480"
        }, {
          default: t(() => [
            e(N, null, {
              default: t(() => [
                e(O, null, {
                  default: t(() => [...a[24] || (a[24] = [
                    l("Unsubscribe", -1)
                  ])]),
                  _: 1
                }),
                e(Z, null, {
                  default: t(() => {
                    var h, J;
                    return [
                      v("p", it, [
                        a[25] || (a[25] = l(" Remove subscription to ", -1)),
                        v("strong", null, w((J = (h = C.value) == null ? void 0 : h.node) == null ? void 0 : J.name), 1),
                        a[26] || (a[26] = l("? ", -1))
                      ]),
                      e(le, {
                        modelValue: L.value,
                        "onUpdate:modelValue": a[7] || (a[7] = (ae) => L.value = ae),
                        label: "Also delete remote data on the target service",
                        density: "compact",
                        "hide-details": ""
                      }, null, 8, ["modelValue"])
                    ];
                  }),
                  _: 1
                }),
                e(T, null, {
                  default: t(() => [
                    e(d),
                    e(G, {
                      variant: "text",
                      onClick: a[8] || (a[8] = (h) => k.value = !1)
                    }, {
                      default: t(() => [...a[27] || (a[27] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(G, {
                      color: "error",
                      variant: "elevated",
                      loading: D.value,
                      onClick: c
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
}, ut = { class: "pa-4" }, dt = {
  __name: "ManualView",
  setup(o) {
    const m = se();
    return oe(() => {
      m.setTitle("Manual"), m.setBreadcrumbs([{ title: "Home", to: "/" }, { title: "Manual" }]);
    }), (_, g) => {
      const x = n("v-alert");
      return b(), j("div", ut, [
        g[1] || (g[1] = v("h1", { class: "text-h4 mb-4" }, "User manual", -1)),
        e(x, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...g[0] || (g[0] = [
            l(" Embedded user manual — legacy ", -1),
            v("code", null, "webjars/home/manual/", -1),
            l(". TODO. ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, mt = { class: "pa-4" }, ct = {
  __name: "SystemView",
  setup(o) {
    const m = se(), _ = [
      { to: "/system/user", icon: "mdi-account-multiple", title: "Users", subtitle: "Active sessions and accounts" },
      { to: "/system/role", icon: "mdi-shield-account", title: "Roles", subtitle: "Authorization rules" },
      { to: "/system/plugin", icon: "mdi-puzzle", title: "Plugins", subtitle: "Installed feature plugins" },
      { to: "/system/node", icon: "mdi-server", title: "Nodes", subtitle: "Service & tool registrations" },
      { to: "/system/cache", icon: "mdi-database-refresh", title: "Cache", subtitle: "Invalidate application caches" },
      { to: "/system/bench", icon: "mdi-speedometer", title: "Bench", subtitle: "Diagnostics" }
    ];
    return oe(() => {
      m.setTitle("System"), m.setBreadcrumbs([{ title: "System" }]);
    }), (g, x) => {
      const i = n("v-list-item"), P = n("v-list");
      return b(), j("div", mt, [
        x[0] || (x[0] = v("h1", { class: "text-h4 mb-4" }, "System administration", -1)),
        e(P, null, {
          default: t(() => [
            (b(), j(pe, null, ve(_, (R) => e(i, {
              key: R.to,
              to: R.to,
              "prepend-icon": R.icon,
              title: R.title,
              subtitle: R.subtitle
            }, null, 8, ["to", "prepend-icon", "title", "subtitle"])), 64))
          ]),
          _: 1
        })
      ]);
    };
  }
}, pt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, vt = {
  __name: "SystemUserView",
  setup(o) {
    const m = re(), _ = se(), g = xe("system/user/roles", { defaultSort: "login" }), x = r(25);
    let i = null, P = {};
    const R = r([]), S = r(null), f = r(!1), U = r(null), k = r({ login: "", roles: [] }), C = r(!1), L = r(!1), D = r(null), y = r(!1), V = {
      required: ($) => !!$ || "Required",
      requiredArray: ($) => Array.isArray($) && $.length > 0 || "Pick at least one role"
    }, I = [
      { title: "Login", key: "login", sortable: !0, width: "220px" },
      { title: "Roles", key: "roles", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    function Q($) {
      P = $, g.load($);
    }
    function z() {
      clearTimeout(i), i = setTimeout(
        () => g.load({ page: 1, itemsPerPage: x.value, sortBy: P.sortBy }),
        300
      );
    }
    async function B() {
      const $ = await m.get("rest/system/security/role");
      Array.isArray($) ? R.value = $ : Array.isArray($ == null ? void 0 : $.data) && (R.value = $.data);
    }
    function ee() {
      U.value = null, k.value = { login: "", roles: [] }, f.value = !0;
    }
    function q($) {
      U.value = $, k.value = {
        login: $.login,
        roles: ($.roles || []).map((d) => d.id)
      }, f.value = !0;
    }
    function c($) {
      D.value = $, L.value = !0;
    }
    async function u() {
      const { valid: $ } = await S.value.validate();
      if (!$) return;
      C.value = !0;
      const d = { login: k.value.login, roles: k.value.roles }, G = U.value ? "put" : "post";
      await m[G]("rest/system/user", d), C.value = !1, f.value = !1, g.load(P);
    }
    async function a() {
      y.value = !0, await m.del(`rest/system/user/${encodeURIComponent(D.value.login)}`), y.value = !1, L.value = !1, g.load(P);
    }
    return oe(() => {
      _.setTitle("System users"), _.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Users" }]), B();
    }), ($, d) => {
      const G = n("v-spacer"), K = n("v-text-field"), Z = n("v-btn"), N = n("v-alert"), p = n("v-chip"), ne = n("v-icon"), te = n("v-data-table-server"), O = n("v-card-title"), s = n("v-autocomplete"), A = n("v-form"), E = n("v-card-text"), T = n("v-card-actions"), X = n("v-card"), le = n("v-dialog");
      return b(), j("div", null, [
        v("div", pt, [
          d[9] || (d[9] = v("h1", { class: "text-h4" }, "System users", -1)),
          e(G),
          e(K, {
            modelValue: Y(g).search.value,
            "onUpdate:modelValue": [
              d[0] || (d[0] = (h) => Y(g).search.value = h),
              z
            ],
            "prepend-inner-icon": "mdi-magnify",
            label: "Search",
            variant: "outlined",
            density: "compact",
            "hide-details": "",
            class: "search-field"
          }, null, 8, ["modelValue"]),
          e(Z, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: ee
          }, {
            default: t(() => [...d[8] || (d[8] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        Y(g).error.value ? (b(), W(N, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(Y(g).error.value), 1)
          ]),
          _: 1
        })) : M("", !0),
        e(te, {
          headers: I,
          items: Y(g).items.value,
          "items-length": Y(g).totalItems.value,
          loading: Y(g).loading.value,
          "items-per-page": x.value,
          "onUpdate:itemsPerPage": d[1] || (d[1] = (h) => x.value = h),
          "item-value": "login",
          hover: "",
          "onUpdate:options": Q
        }, {
          "item.roles": t(({ item: h }) => [
            (b(!0), j(pe, null, ve(h.roles || [], (J) => (b(), W(p, {
              key: J.id,
              size: "x-small",
              variant: "tonal",
              class: "mr-1"
            }, {
              default: t(() => [
                l(w(J.name), 1)
              ]),
              _: 2
            }, 1024))), 128))
          ]),
          "item.actions": t(({ item: h }) => [
            e(Z, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (J) => q(h)
            }, {
              default: t(() => [
                e(ne, { size: "small" }, {
                  default: t(() => [...d[10] || (d[10] = [
                    l("mdi-pencil", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(Z, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (J) => c(h)
            }, {
              default: t(() => [
                e(ne, { size: "small" }, {
                  default: t(() => [...d[11] || (d[11] = [
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
        e(le, {
          modelValue: f.value,
          "onUpdate:modelValue": d[5] || (d[5] = (h) => f.value = h),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(X, null, {
              default: t(() => [
                e(O, null, {
                  default: t(() => [
                    l(w(U.value ? "Edit system user" : "New system user"), 1)
                  ]),
                  _: 1
                }),
                e(E, null, {
                  default: t(() => [
                    e(A, {
                      ref_key: "formRef",
                      ref: S,
                      onSubmit: ce(u, ["prevent"])
                    }, {
                      default: t(() => [
                        e(K, {
                          modelValue: k.value.login,
                          "onUpdate:modelValue": d[2] || (d[2] = (h) => k.value.login = h),
                          label: "Login",
                          rules: [V.required],
                          disabled: !!U.value,
                          variant: "outlined",
                          class: "mb-2",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules", "disabled"]),
                        e(s, {
                          modelValue: k.value.roles,
                          "onUpdate:modelValue": d[3] || (d[3] = (h) => k.value.roles = h),
                          label: "Roles",
                          items: R.value,
                          "item-value": "id",
                          "item-title": "name",
                          multiple: "",
                          chips: "",
                          "closable-chips": "",
                          variant: "outlined",
                          rules: [V.requiredArray]
                        }, null, 8, ["modelValue", "items", "rules"])
                      ]),
                      _: 1
                    }, 512)
                  ]),
                  _: 1
                }),
                e(T, null, {
                  default: t(() => [
                    e(G),
                    e(Z, {
                      variant: "text",
                      onClick: d[4] || (d[4] = (h) => f.value = !1)
                    }, {
                      default: t(() => [...d[12] || (d[12] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Z, {
                      color: "primary",
                      variant: "elevated",
                      loading: C.value,
                      onClick: u
                    }, {
                      default: t(() => [...d[13] || (d[13] = [
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
        e(le, {
          modelValue: L.value,
          "onUpdate:modelValue": d[7] || (d[7] = (h) => L.value = h),
          "max-width": "420"
        }, {
          default: t(() => [
            e(X, null, {
              default: t(() => [
                e(O, null, {
                  default: t(() => [...d[14] || (d[14] = [
                    l("Delete system user", -1)
                  ])]),
                  _: 1
                }),
                e(E, null, {
                  default: t(() => {
                    var h;
                    return [
                      d[15] || (d[15] = l("Remove ", -1)),
                      v("strong", null, w((h = D.value) == null ? void 0 : h.login), 1),
                      d[16] || (d[16] = l(" from system accounts?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(T, null, {
                  default: t(() => [
                    e(G),
                    e(Z, {
                      variant: "text",
                      onClick: d[6] || (d[6] = (h) => L.value = !1)
                    }, {
                      default: t(() => [...d[17] || (d[17] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(Z, {
                      color: "error",
                      variant: "elevated",
                      loading: y.value,
                      onClick: a
                    }, {
                      default: t(() => [...d[18] || (d[18] = [
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
}, ft = /* @__PURE__ */ fe(vt, [["__scopeId", "data-v-3bd83da2"]]), _t = { class: "d-flex align-center mb-4" }, gt = {
  __name: "SystemRoleView",
  setup(o) {
    const m = re(), _ = se(), g = r([]), x = r(!1), i = r(null), P = r(null), R = r(!1), S = r(null), f = r({ name: "", apiPatterns: [], uiPatterns: [] }), U = r(!1), k = r(!1), C = r(null), L = r(!1), D = { required: (q) => !!q || "Required" }, y = [
      { title: "Name", key: "name", sortable: !0, width: "180px" },
      { title: "API patterns", key: "authApi", sortable: !1 },
      { title: "UI patterns", key: "authUi", sortable: !1 },
      { title: "", key: "actions", sortable: !1, width: "100px", align: "end" }
    ];
    async function V() {
      x.value = !0, i.value = null;
      const q = await m.get("rest/system/security/role/withAuth"), c = (q == null ? void 0 : q.data) || q || [];
      for (const u of c)
        u["authorizations-api"] = (u.authorizations || []).filter((a) => a.type === "api"), u["authorizations-ui"] = (u.authorizations || []).filter((a) => a.type === "ui");
      g.value = c, x.value = !1;
    }
    function I() {
      S.value = null, f.value = { name: "", apiPatterns: [], uiPatterns: [] }, R.value = !0;
    }
    function Q(q) {
      S.value = q, f.value = {
        name: q.name,
        apiPatterns: (q["authorizations-api"] || []).map((c) => c.pattern),
        uiPatterns: (q["authorizations-ui"] || []).map((c) => c.pattern)
      }, R.value = !0;
    }
    function z(q) {
      C.value = q, k.value = !0;
    }
    async function B() {
      var a;
      const { valid: q } = await P.value.validate();
      if (!q) return;
      U.value = !0;
      const c = {
        id: (a = S.value) == null ? void 0 : a.id,
        name: f.value.name,
        authorizations: [
          ...f.value.apiPatterns.map(($) => ({ pattern: $, type: "api" })),
          ...f.value.uiPatterns.map(($) => ({ pattern: $, type: "ui" }))
        ]
      }, u = S.value ? "put" : "post";
      await m[u]("rest/system/security/role", c), U.value = !1, R.value = !1, V();
    }
    async function ee() {
      L.value = !0, await m.del(`rest/system/security/role/${C.value.id}`), L.value = !1, k.value = !1, V();
    }
    return oe(() => {
      _.setTitle("Roles"), _.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Roles" }]), V();
    }), (q, c) => {
      const u = n("v-spacer"), a = n("v-btn"), $ = n("v-alert"), d = n("v-icon"), G = n("v-data-table"), K = n("v-card-title"), Z = n("v-text-field"), N = n("v-combobox"), p = n("v-form"), ne = n("v-card-text"), te = n("v-card-actions"), O = n("v-card"), s = n("v-dialog");
      return b(), j("div", null, [
        v("div", _t, [
          c[8] || (c[8] = v("h1", { class: "text-h4" }, "Roles", -1)),
          e(u),
          e(a, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: I
          }, {
            default: t(() => [...c[7] || (c[7] = [
              l("New", -1)
            ])]),
            _: 1
          })
        ]),
        i.value ? (b(), W($, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(i.value), 1)
          ]),
          _: 1
        })) : M("", !0),
        e(G, {
          headers: y,
          items: g.value,
          loading: x.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.authApi": t(({ item: A }) => [
            (b(!0), j(pe, null, ve(A["authorizations-api"], (E) => (b(), j("code", {
              key: E.id || E.pattern,
              class: "auth-token"
            }, w(E.pattern), 1))), 128))
          ]),
          "item.authUi": t(({ item: A }) => [
            (b(!0), j(pe, null, ve(A["authorizations-ui"], (E) => (b(), j("code", {
              key: E.id || E.pattern,
              class: "auth-token"
            }, w(E.pattern), 1))), 128))
          ]),
          "item.actions": t(({ item: A }) => [
            e(a, {
              icon: "",
              size: "small",
              variant: "text",
              onClick: (E) => Q(A)
            }, {
              default: t(() => [
                e(d, { size: "small" }, {
                  default: t(() => [...c[9] || (c[9] = [
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
              onClick: (E) => z(A)
            }, {
              default: t(() => [
                e(d, { size: "small" }, {
                  default: t(() => [...c[10] || (c[10] = [
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
        e(s, {
          modelValue: R.value,
          "onUpdate:modelValue": c[4] || (c[4] = (A) => R.value = A),
          "max-width": "640",
          persistent: ""
        }, {
          default: t(() => [
            e(O, null, {
              default: t(() => [
                e(K, null, {
                  default: t(() => [
                    l(w(S.value ? "Edit role" : "New role"), 1)
                  ]),
                  _: 1
                }),
                e(ne, null, {
                  default: t(() => [
                    e(p, {
                      ref_key: "formRef",
                      ref: P,
                      onSubmit: ce(B, ["prevent"])
                    }, {
                      default: t(() => [
                        e(Z, {
                          modelValue: f.value.name,
                          "onUpdate:modelValue": c[0] || (c[0] = (A) => f.value.name = A),
                          label: "Name",
                          rules: [D.required],
                          variant: "outlined",
                          class: "mb-4",
                          autofocus: ""
                        }, null, 8, ["modelValue", "rules"]),
                        e(N, {
                          modelValue: f.value.apiPatterns,
                          "onUpdate:modelValue": c[1] || (c[1] = (A) => f.value.apiPatterns = A),
                          label: "API authorization patterns (regex)",
                          items: f.value.apiPatterns,
                          chips: "",
                          "closable-chips": "",
                          multiple: "",
                          variant: "outlined",
                          hint: "Press Enter after each pattern",
                          "persistent-hint": "",
                          class: "mb-4"
                        }, null, 8, ["modelValue", "items"]),
                        e(N, {
                          modelValue: f.value.uiPatterns,
                          "onUpdate:modelValue": c[2] || (c[2] = (A) => f.value.uiPatterns = A),
                          label: "UI authorization patterns (regex)",
                          items: f.value.uiPatterns,
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
                    e(u),
                    e(a, {
                      variant: "text",
                      onClick: c[3] || (c[3] = (A) => R.value = !1)
                    }, {
                      default: t(() => [...c[11] || (c[11] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "primary",
                      variant: "elevated",
                      loading: U.value,
                      onClick: B
                    }, {
                      default: t(() => [...c[12] || (c[12] = [
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
        e(s, {
          modelValue: k.value,
          "onUpdate:modelValue": c[6] || (c[6] = (A) => k.value = A),
          "max-width": "420"
        }, {
          default: t(() => [
            e(O, null, {
              default: t(() => [
                e(K, null, {
                  default: t(() => [...c[13] || (c[13] = [
                    l("Delete role", -1)
                  ])]),
                  _: 1
                }),
                e(ne, null, {
                  default: t(() => {
                    var A;
                    return [
                      c[14] || (c[14] = l("Delete role ", -1)),
                      v("strong", null, w((A = C.value) == null ? void 0 : A.name), 1),
                      c[15] || (c[15] = l("?", -1))
                    ];
                  }),
                  _: 1
                }),
                e(te, null, {
                  default: t(() => [
                    e(u),
                    e(a, {
                      variant: "text",
                      onClick: c[5] || (c[5] = (A) => k.value = !1)
                    }, {
                      default: t(() => [...c[16] || (c[16] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(a, {
                      color: "error",
                      variant: "elevated",
                      loading: L.value,
                      onClick: ee
                    }, {
                      default: t(() => [...c[17] || (c[17] = [
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
}, yt = /* @__PURE__ */ fe(gt, [["__scopeId", "data-v-e3ba71a8"]]), bt = { class: "d-flex flex-wrap align-center mb-4 ga-2" }, kt = { key: 0 }, wt = { key: 0 }, xt = {
  __name: "SystemPluginView",
  setup(o) {
    const m = re(), _ = se(), g = [
      { id: "central", label: "Maven Central" },
      { id: "nexus", label: "OSSRH Nexus" }
    ], x = r("central"), i = r([]), P = r(!1), R = r(null), S = r(!1), f = r(!1), U = r(!1), k = r(""), C = r(!1), L = r(!1), D = [
      { title: "", key: "type", sortable: !1, width: "40px" },
      { title: "Artifact", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0 },
      { title: "Vendor", key: "vendor", sortable: !0, width: "160px" },
      { title: "Version", key: "version", sortable: !1, width: "280px" },
      { title: "Nodes", key: "nodes", sortable: !0, width: "80px", align: "center" },
      { title: "Subs", key: "subscriptions", sortable: !0, width: "80px", align: "center" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function y(c) {
      var a, $;
      const u = ($ = (a = c.plugin) == null ? void 0 : a.type) == null ? void 0 : $.toLowerCase();
      return u ? u === "feature" ? "mdi-wrench" : u === "service" ? "mdi-puzzle" : u === "tool" ? "mdi-hammer-wrench" : "mdi-puzzle" : "mdi-link-off";
    }
    async function V() {
      P.value = !0, R.value = null;
      const c = await m.get(`rest/system/plugin?repository=${x.value}`);
      i.value = Array.isArray(c) ? c : (c == null ? void 0 : c.data) || [], P.value = !1;
    }
    async function I() {
      S.value = !0, await m.put(`rest/system/plugin/cache?repository=${x.value}`), S.value = !1, V();
    }
    async function Q() {
      f.value = !0, await m.put("rest/system/plugin/restart"), f.value = !1;
    }
    async function z(c, u = !1) {
      L.value = !0;
      const a = `repository=${x.value}&javadoc=${u ? !1 : C.value}`;
      await m.post(`rest/system/plugin/${encodeURIComponent(c)}?${a}`), L.value = !1, U.value = !1, k.value = "", C.value = !1, V();
    }
    function B() {
      k.value && z(k.value.trim());
    }
    async function ee(c) {
      await m.del(`rest/system/plugin/${c.plugin.artifact}/${c.latestLocalVersion}`), V();
    }
    async function q(c) {
      confirm(`Delete plug-in ${c}?`) && (await m.del(`rest/system/plugin/${c}`), V());
    }
    return oe(() => {
      _.setTitle("Plug-ins"), _.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Plug-ins" }]), V();
    }), (c, u) => {
      const a = n("v-spacer"), $ = n("v-select"), d = n("v-btn"), G = n("v-alert"), K = n("v-icon"), Z = n("v-chip"), N = n("v-data-table"), p = n("v-card-title"), ne = n("v-text-field"), te = n("v-checkbox"), O = n("v-card-text"), s = n("v-card-actions"), A = n("v-card"), E = n("v-dialog");
      return b(), j("div", null, [
        v("div", bt, [
          u[9] || (u[9] = v("h1", { class: "text-h4" }, "Plugins", -1)),
          e(a),
          e($, {
            modelValue: x.value,
            "onUpdate:modelValue": [
              u[0] || (u[0] = (T) => x.value = T),
              V
            ],
            items: g,
            "item-value": "id",
            "item-title": "label",
            label: "Repository",
            density: "compact",
            "hide-details": "",
            variant: "outlined",
            style: { "max-width": "200px" }
          }, null, 8, ["modelValue"]),
          e(d, {
            variant: "outlined",
            "prepend-icon": "mdi-magnify-plus",
            onClick: I,
            loading: S.value
          }, {
            default: t(() => [...u[6] || (u[6] = [
              l(" Check versions ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(d, {
            color: "error",
            variant: "outlined",
            "prepend-icon": "mdi-restart",
            onClick: Q,
            loading: f.value
          }, {
            default: t(() => [...u[7] || (u[7] = [
              l(" Restart ", -1)
            ])]),
            _: 1
          }, 8, ["loading"]),
          e(d, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: u[1] || (u[1] = (T) => U.value = !0)
          }, {
            default: t(() => [...u[8] || (u[8] = [
              l("Install", -1)
            ])]),
            _: 1
          })
        ]),
        R.value ? (b(), W(G, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(R.value), 1)
          ]),
          _: 1
        })) : M("", !0),
        e(N, {
          headers: D,
          items: i.value,
          loading: P.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.type": t(({ item: T }) => {
            var X;
            return [
              e(K, {
                size: "small",
                title: (X = T.plugin) == null ? void 0 : X.type
              }, {
                default: t(() => [
                  l(w(y(T)), 1)
                ]),
                _: 2
              }, 1032, ["title"])
            ];
          }),
          "item.version": t(({ item: T }) => {
            var X;
            return [
              v("span", null, w(((X = T.plugin) == null ? void 0 : X.version) || "—"), 1),
              T.latestLocalVersion ? (b(), W(Z, {
                key: 0,
                size: "x-small",
                color: "primary",
                class: "ml-1",
                closable: "",
                "onClick:close": (le) => ee(T),
                title: "Cancel local install"
              }, {
                default: t(() => [
                  l(w(T.latestLocalVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick:close"])) : M("", !0),
              T.newVersion && T.newVersion !== T.latestLocalVersion ? (b(), W(Z, {
                key: 1,
                size: "x-small",
                color: "success",
                class: "ml-1",
                onClick: (le) => z(T.plugin.artifact, !0),
                title: "Upgrade available — click to install"
              }, {
                default: t(() => [
                  e(K, {
                    start: "",
                    size: "x-small"
                  }, {
                    default: t(() => [...u[10] || (u[10] = [
                      l("mdi-arrow-up", -1)
                    ])]),
                    _: 1
                  }),
                  l(w(T.newVersion), 1)
                ]),
                _: 2
              }, 1032, ["onClick"])) : M("", !0)
            ];
          }),
          "item.nodes": t(({ item: T }) => {
            var X, le;
            return [
              ((le = (X = T.plugin) == null ? void 0 : X.type) == null ? void 0 : le.toLowerCase()) !== "feature" ? (b(), j("span", kt, w(T.nodes ?? 0), 1)) : M("", !0)
            ];
          }),
          "item.subscriptions": t(({ item: T }) => {
            var X, le;
            return [
              ((le = (X = T.plugin) == null ? void 0 : X.type) == null ? void 0 : le.toLowerCase()) !== "feature" ? (b(), j("span", wt, w(T.subscriptions ?? 0), 1)) : M("", !0)
            ];
          }),
          "item.actions": t(({ item: T }) => [
            T.deleted ? (b(), W(K, {
              key: 0,
              size: "small",
              color: "warning",
              title: "Deletion scheduled"
            }, {
              default: t(() => [...u[11] || (u[11] = [
                l("mdi-cancel", -1)
              ])]),
              _: 1
            })) : (b(), W(d, {
              key: 1,
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (X) => q(T.plugin.artifact),
              title: "Delete plug-in"
            }, {
              default: t(() => [
                e(K, { size: "small" }, {
                  default: t(() => [...u[12] || (u[12] = [
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
        e(E, {
          modelValue: U.value,
          "onUpdate:modelValue": u[5] || (u[5] = (T) => U.value = T),
          "max-width": "520"
        }, {
          default: t(() => [
            e(A, null, {
              default: t(() => [
                e(p, null, {
                  default: t(() => [...u[13] || (u[13] = [
                    l("Install plug-in", -1)
                  ])]),
                  _: 1
                }),
                e(O, null, {
                  default: t(() => [
                    e(ne, {
                      modelValue: k.value,
                      "onUpdate:modelValue": u[2] || (u[2] = (T) => k.value = T),
                      label: "Artifact id (e.g. plugin-prov-aws)",
                      variant: "outlined",
                      hint: `Repository: ${x.value}`,
                      "persistent-hint": "",
                      class: "mb-2",
                      autofocus: ""
                    }, null, 8, ["modelValue", "hint"]),
                    e(te, {
                      modelValue: C.value,
                      "onUpdate:modelValue": u[3] || (u[3] = (T) => C.value = T),
                      label: "Install Javadoc bundle",
                      density: "compact",
                      "hide-details": ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                e(s, null, {
                  default: t(() => [
                    e(a),
                    e(d, {
                      variant: "text",
                      onClick: u[4] || (u[4] = (T) => U.value = !1)
                    }, {
                      default: t(() => [...u[14] || (u[14] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(d, {
                      color: "primary",
                      variant: "elevated",
                      loading: L.value,
                      disabled: !k.value,
                      onClick: B
                    }, {
                      default: t(() => [...u[15] || (u[15] = [
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
}, Ct = { class: "d-flex align-center mb-4" }, Vt = {
  __name: "SystemNodeView",
  setup(o) {
    const m = re(), _ = se(), g = r([]), x = r(!1), i = r(null), P = r(!1), R = r(null), S = r(!1), f = [
      { title: "Identifier", key: "id", sortable: !0 },
      { title: "Name", key: "name", sortable: !0, width: "260px" },
      { title: "Status", key: "status", sortable: !0, width: "120px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function U(D) {
      var V;
      const y = (V = D == null ? void 0 : D.toLowerCase) == null ? void 0 : V.call(D);
      return y === "up" ? "success" : y === "down" ? "error" : y === "unknown" ? "warning" : "grey";
    }
    async function k() {
      x.value = !0, i.value = null;
      const D = await m.get("rest/node");
      g.value = Array.isArray(D) ? D : (D == null ? void 0 : D.data) || [], x.value = !1;
    }
    function C(D) {
      R.value = D, P.value = !0;
    }
    async function L() {
      S.value = !0, await m.del(`rest/node/${encodeURIComponent(R.value.id)}`), S.value = !1, P.value = !1, k();
    }
    return oe(() => {
      _.setTitle("Nodes"), _.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Nodes" }]), k();
    }), (D, y) => {
      const V = n("v-spacer"), I = n("v-btn"), Q = n("v-alert"), z = n("v-chip"), B = n("v-icon"), ee = n("v-data-table"), q = n("v-card-title"), c = n("v-card-text"), u = n("v-card-actions"), a = n("v-card"), $ = n("v-dialog");
      return b(), j("div", null, [
        v("div", Ct, [
          y[3] || (y[3] = v("h1", { class: "text-h4" }, "Nodes", -1)),
          e(V),
          e(I, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            to: "/subscribe"
          }, {
            default: t(() => [...y[2] || (y[2] = [
              l("New subscription", -1)
            ])]),
            _: 1
          })
        ]),
        i.value ? (b(), W(Q, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(i.value), 1)
          ]),
          _: 1
        })) : M("", !0),
        e(ee, {
          headers: f,
          items: g.value,
          loading: x.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.id": t(({ item: d }) => [
            v("code", null, w(d.id), 1)
          ]),
          "item.status": t(({ item: d }) => [
            d.status ? (b(), W(z, {
              key: 0,
              size: "x-small",
              color: U(d.status),
              variant: "tonal"
            }, {
              default: t(() => [
                l(w(d.status), 1)
              ]),
              _: 2
            }, 1032, ["color"])) : M("", !0)
          ]),
          "item.actions": t(({ item: d }) => [
            e(I, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              onClick: (G) => C(d)
            }, {
              default: t(() => [
                e(B, { size: "small" }, {
                  default: t(() => [...y[4] || (y[4] = [
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
        e($, {
          modelValue: P.value,
          "onUpdate:modelValue": y[1] || (y[1] = (d) => P.value = d),
          "max-width": "460"
        }, {
          default: t(() => [
            e(a, null, {
              default: t(() => [
                e(q, null, {
                  default: t(() => [...y[5] || (y[5] = [
                    l("Delete node", -1)
                  ])]),
                  _: 1
                }),
                e(c, null, {
                  default: t(() => {
                    var d, G;
                    return [
                      y[6] || (y[6] = l(" Delete ", -1)),
                      v("strong", null, w((d = R.value) == null ? void 0 : d.name), 1),
                      y[7] || (y[7] = l(" (", -1)),
                      v("code", null, w((G = R.value) == null ? void 0 : G.id), 1),
                      y[8] || (y[8] = l(")? ", -1))
                    ];
                  }),
                  _: 1
                }),
                e(u, null, {
                  default: t(() => [
                    e(V),
                    e(I, {
                      variant: "text",
                      onClick: y[0] || (y[0] = (d) => P.value = !1)
                    }, {
                      default: t(() => [...y[9] || (y[9] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(I, {
                      color: "error",
                      variant: "elevated",
                      loading: S.value,
                      onClick: L
                    }, {
                      default: t(() => [...y[10] || (y[10] = [
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
}, St = { class: "d-flex align-center mb-4" }, $t = { class: "d-flex align-center ga-2" }, ht = { class: "d-flex align-center ga-2" }, Pt = {
  __name: "SystemCacheView",
  setup(o) {
    const m = re(), _ = se(), g = r([]), x = r(!1), i = r(null), P = r(null), R = [
      { title: "Cache", key: "id", sortable: !0 },
      { title: "Size", key: "size", sortable: !0, width: "100px" },
      { title: "Hits", key: "hitCount", sortable: !0, width: "160px" },
      { title: "Misses", key: "missCount", sortable: !0, width: "160px" },
      { title: "Avg get (ms)", key: "averageGetTime", sortable: !0, width: "140px" },
      { title: "", key: "actions", sortable: !1, width: "60px", align: "end" }
    ];
    function S(k, C, L) {
      return C && L === 1 || k >= 90 ? "success" : k >= 80 ? "primary" : k >= 50 ? "warning" : "error";
    }
    async function f() {
      x.value = !0, i.value = null;
      const k = await m.get("rest/system/cache");
      Array.isArray(k) ? g.value = k : k === null && (i.value = "Unable to load caches"), x.value = !1;
    }
    async function U(k) {
      P.value = k.id, await m.post(`rest/system/cache/${encodeURIComponent(k.id)}`), P.value = null, f();
    }
    return oe(() => {
      _.setTitle("Caches"), _.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Caches" }]), f();
    }), (k, C) => {
      const L = n("v-spacer"), D = n("v-btn"), y = n("v-alert"), V = n("v-chip"), I = n("v-icon"), Q = n("v-data-table");
      return b(), j("div", null, [
        v("div", St, [
          C[1] || (C[1] = v("h1", { class: "text-h4" }, "Caches", -1)),
          e(L),
          e(D, {
            variant: "outlined",
            "prepend-icon": "mdi-refresh",
            onClick: f
          }, {
            default: t(() => [...C[0] || (C[0] = [
              l("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        i.value ? (b(), W(y, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(i.value), 1)
          ]),
          _: 1
        })) : M("", !0),
        e(Q, {
          headers: R,
          items: g.value,
          loading: x.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.hitCount": t(({ item: z }) => [
            v("div", $t, [
              v("span", null, w(z.hitCount ?? 0), 1),
              z.hitPercentage != null && (z.hitCount ?? 0) > 0 ? (b(), W(V, {
                key: 0,
                size: "x-small",
                color: S(z.hitPercentage, !0, z.hitCount)
              }, {
                default: t(() => [
                  l(w(Math.round(z.hitPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : M("", !0)
            ])
          ]),
          "item.missCount": t(({ item: z }) => [
            v("div", ht, [
              v("span", null, w(z.missCount ?? 0), 1),
              z.missPercentage != null && (z.missCount ?? 0) > 1 ? (b(), W(V, {
                key: 0,
                size: "x-small",
                color: S(100 - z.missPercentage, !1)
              }, {
                default: t(() => [
                  l(w(Math.round(z.missPercentage)) + "%", 1)
                ]),
                _: 2
              }, 1032, ["color"])) : M("", !0)
            ])
          ]),
          "item.averageGetTime": t(({ item: z }) => [
            l(w(z.averageGetTime ?? "—"), 1)
          ]),
          "item.actions": t(({ item: z }) => [
            e(D, {
              icon: "",
              size: "small",
              variant: "text",
              loading: P.value === z.id,
              onClick: (B) => U(z),
              title: "Invalidate cache"
            }, {
              default: t(() => [
                e(I, { size: "small" }, {
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
}, Ut = { key: 1 }, Dt = {
  __name: "SystemBenchView",
  setup(o) {
    const m = re(), _ = se(), g = [
      { key: "insert", step: "INSERT", method: "post", url: "rest/system/bench/prepare" },
      { key: "select", step: "SELECT", method: "get", url: "rest/system/bench/read" },
      { key: "select-all", step: "SELECT *", method: "get", url: "rest/system/bench/read/all" },
      { key: "update", step: "UPDATE", method: "put", url: "rest/system/bench/update" },
      { key: "delete", step: "DELETE", method: "del", url: "rest/system/bench/delete" }
    ], x = r(!1), i = r(null), P = r(g.map((S) => ({ step: S.step, duration: null, loading: !1 })));
    async function R() {
      x.value = !0, i.value = null, P.value = g.map((S) => ({ step: S.step, duration: null, loading: !1 }));
      for (let S = 0; S < g.length; S++) {
        P.value[S].loading = !0;
        try {
          const f = g[S].method === "post" || g[S].method === "put" ? void 0 : null, U = f === null ? await m[g[S].method](g[S].url) : await m[g[S].method](g[S].url, f);
          P.value[S].duration = (U == null ? void 0 : U.duration) ?? "—";
        } catch (f) {
          i.value = `${g[S].step} failed: ${f.message || f}`;
          break;
        } finally {
          P.value[S].loading = !1;
        }
      }
      x.value = !1;
    }
    return oe(() => {
      _.setTitle("Bench"), _.setBreadcrumbs([{ title: "System", to: "/system" }, { title: "Bench" }]);
    }), (S, f) => {
      const U = n("v-card-text"), k = n("v-card"), C = n("v-btn"), L = n("v-alert"), D = n("v-progress-circular"), y = n("v-table");
      return b(), j("div", null, [
        f[3] || (f[3] = v("h1", { class: "text-h4 mb-4" }, "Database bench", -1)),
        e(k, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(U, null, {
              default: t(() => [...f[0] || (f[0] = [
                l(" Runs a sequence of ", -1),
                v("code", null, "INSERT", -1),
                l(" → ", -1),
                v("code", null, "SELECT", -1),
                l(" → ", -1),
                v("code", null, "SELECT *", -1),
                l(" → ", -1),
                v("code", null, "UPDATE", -1),
                l(" → ", -1),
                v("code", null, "DELETE", -1),
                l(" calls and reports each step's duration. Handy to validate that the backend's persistence layer is responsive. ", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }),
        e(C, {
          color: "primary",
          "prepend-icon": "mdi-play",
          loading: x.value,
          onClick: R
        }, {
          default: t(() => [...f[1] || (f[1] = [
            l(" Run bench ", -1)
          ])]),
          _: 1
        }, 8, ["loading"]),
        i.value ? (b(), W(L, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mt-4"
        }, {
          default: t(() => [
            l(w(i.value), 1)
          ]),
          _: 1
        })) : M("", !0),
        P.value.length ? (b(), W(y, {
          key: 1,
          density: "compact",
          class: "mt-4",
          style: { "max-width": "600px" }
        }, {
          default: t(() => [
            f[2] || (f[2] = v("thead", null, [
              v("tr", null, [
                v("th", null, "Step"),
                v("th", null, "Duration (ms)")
              ])
            ], -1)),
            v("tbody", null, [
              (b(!0), j(pe, null, ve(P.value, (V) => (b(), j("tr", {
                key: V.step
              }, [
                v("td", null, w(V.step), 1),
                v("td", null, [
                  V.loading ? (b(), W(D, {
                    key: 0,
                    size: "16",
                    width: "2",
                    indeterminate: ""
                  })) : (b(), j("span", Ut, w(V.duration ?? "—"), 1))
                ])
              ]))), 128))
            ])
          ]),
          _: 1
        })) : M("", !0)
      ]);
    };
  }
}, zt = { class: "d-flex align-center mb-4" }, Nt = {
  __name: "ApiHomeView",
  setup(o) {
    const m = se(), _ = r(!0), g = r(null), x = "/", i = `${x}rest/swagger-ui-bundle.js`, P = `${x}rest/swagger-ui-standalone-preset.js`, R = `${x}rest/swagger-ui.css`, S = `${x}rest/index.css`, f = `${x}rest/openapi.json`;
    function U() {
      return () => ({
        fn: {
          opsFilter(y, V) {
            const I = V.toLowerCase();
            return y.map((z) => (z._root.entries[1][1] = z._root.entries[1][1].filter((B) => {
              const ee = JSON.parse(JSON.stringify(B)), q = (ee.operation.summary || "").toString().toLowerCase(), c = (ee.operation.description || "").toString().toLowerCase();
              return ee.path.toLowerCase().includes(I) || q.includes(I) || c.includes(I);
            }), z)).filter((z) => z._root.entries[1][1].size > 0);
          }
        }
      });
    }
    function k(y, V) {
      if (document.getElementById(V)) return;
      const I = document.createElement("link");
      I.id = V, I.rel = "stylesheet", I.href = y, document.head.appendChild(I);
    }
    function C(y) {
      var V;
      (V = document.getElementById(y)) == null || V.remove();
    }
    function L(y, V) {
      return new Promise((I, Q) => {
        if (document.getElementById(V)) {
          I();
          return;
        }
        const B = document.createElement("script");
        B.id = V, B.src = y, B.async = !0, B.onload = I, B.onerror = () => Q(new Error(`Failed to load ${y}`)), document.head.appendChild(B);
      });
    }
    function D() {
      const { SwaggerUIBundle: y, SwaggerUIStandalonePreset: V } = window;
      if (!y) {
        g.value = "Swagger UI bundle is unavailable.";
        return;
      }
      window.ui = y({
        url: f,
        dom_id: "#swagger-ui",
        displayRequestDuration: !0,
        deepLinking: !1,
        presets: [y.presets.apis, V],
        plugins: [y.plugins.FiltrePreset, U()].filter(Boolean),
        filter: !0,
        layout: "StandaloneLayout",
        validatorUrl: "https://validator.swagger.io/validator"
      });
    }
    return oe(async () => {
      m.setTitle("API"), m.setBreadcrumbs([{ title: "API" }]), k(R, "swagger-ui-css"), k(S, "swagger-ui-extra-css");
      try {
        await Promise.all([
          L(i, "swagger-ui-bundle"),
          L(P, "swagger-ui-preset")
        ]), D();
      } catch (y) {
        g.value = y.message || "Unable to load Swagger UI.";
      } finally {
        _.value = !1;
      }
    }), Ue(() => {
      C("swagger-ui-css"), C("swagger-ui-extra-css"), delete window.ui;
    }), (y, V) => {
      const I = n("v-spacer"), Q = n("v-btn"), z = n("v-alert"), B = n("v-progress-linear");
      return b(), j("div", null, [
        v("div", zt, [
          V[1] || (V[1] = v("h1", { class: "text-h4" }, "API reference", -1)),
          e(I),
          e(Q, {
            variant: "outlined",
            "prepend-icon": "mdi-code-tags",
            href: `${Y(x)}rest/openapi.json`,
            target: "_blank"
          }, {
            default: t(() => [...V[0] || (V[0] = [
              l(" Download OpenAPI ", -1)
            ])]),
            _: 1
          }, 8, ["href"])
        ]),
        g.value ? (b(), W(z, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(g.value), 1)
          ]),
          _: 1
        })) : M("", !0),
        _.value ? (b(), W(B, {
          key: 1,
          indeterminate: "",
          color: "primary",
          class: "mb-4"
        })) : M("", !0),
        V[2] || (V[2] = v("div", {
          id: "swagger-ui",
          class: "swagger-container"
        }, null, -1))
      ]);
    };
  }
}, Tt = /* @__PURE__ */ fe(Nt, [["__scopeId", "data-v-f74586ba"]]), At = { class: "d-flex align-center mb-4" }, Rt = { class: "mb-0 text-body-2" }, It = {
  __name: "ApiTokenView",
  setup(o) {
    const m = re(), _ = se(), g = ze(), x = "/", i = typeof window < "u" ? window.location.origin : "", P = be(() => g.userName || "<you>"), R = r([]), S = r(!1), f = r(null), U = r(!1), k = r(null), C = r(""), L = r(!1), D = r(!1), y = r(""), V = r(""), I = r(!1), Q = r(""), z = r(""), B = r(!1), ee = r(!1), q = r(!1), c = r(""), u = r(!1), a = { required: (O) => !!O || "Required" }, $ = [
      { title: "Name", key: "name", sortable: !0 },
      { title: "", key: "actions", sortable: !1, width: "140px", align: "end" }
    ];
    async function d() {
      S.value = !0, f.value = null;
      const O = await m.get("rest/api/token");
      R.value = Array.isArray(O) ? O.map((s) => ({ name: s })) : [], S.value = !1;
    }
    function G() {
      C.value = "", U.value = !0;
    }
    async function K() {
      const { valid: O } = await k.value.validate();
      if (!O) return;
      L.value = !0;
      const s = await m.post(`rest/api/token/${encodeURIComponent(C.value)}`);
      L.value = !1, s !== null && (y.value = C.value, V.value = typeof s == "string" ? s : (s == null ? void 0 : s.id) || "", U.value = !1, D.value = !0, d());
    }
    async function Z(O, s) {
      Q.value = O, z.value = "", ee.value = !1, I.value = !0, B.value = !0;
      const A = `rest/api/token/${encodeURIComponent(O)}`, E = s === "regen" ? await m.put(A) : await m.get(A);
      z.value = typeof E == "string" ? E : (E == null ? void 0 : E.id) || "", B.value = !1;
    }
    async function N() {
      try {
        await navigator.clipboard.writeText(z.value), ee.value = !0, setTimeout(() => {
          ee.value = !1;
        }, 2e3);
      } catch {
      }
    }
    async function p() {
      try {
        await navigator.clipboard.writeText(V.value);
      } catch {
      }
    }
    function ne(O) {
      c.value = O, q.value = !0;
    }
    async function te() {
      u.value = !0, await m.del(`rest/api/token/${encodeURIComponent(c.value)}`), u.value = !1, q.value = !1, d();
    }
    return oe(() => {
      _.setTitle("API tokens"), _.setBreadcrumbs([{ title: "API", to: "/api" }, { title: "Tokens" }]), d();
    }), (O, s) => {
      const A = n("v-spacer"), E = n("v-btn"), T = n("v-card-text"), X = n("v-card"), le = n("v-alert"), h = n("v-icon"), J = n("v-data-table"), ae = n("v-card-title"), ue = n("v-text-field"), _e = n("v-form"), de = n("v-card-actions"), me = n("v-dialog"), ge = n("v-progress-linear"), F = n("v-textarea");
      return b(), j("div", null, [
        v("div", At, [
          s[11] || (s[11] = v("h1", { class: "text-h4" }, "API tokens", -1)),
          e(A),
          e(E, {
            color: "primary",
            "prepend-icon": "mdi-plus",
            onClick: G
          }, {
            default: t(() => [...s[10] || (s[10] = [
              l("New token", -1)
            ])]),
            _: 1
          })
        ]),
        e(X, {
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            e(T, null, {
              default: t(() => [
                s[13] || (s[13] = v("p", { class: "mb-2" }, [
                  l(" Tokens let you call the Ligoj API without a password. Pass the token in the "),
                  v("code", null, "api-key"),
                  l(" parameter along with your user id in "),
                  v("code", null, "api-user"),
                  l(". ")
                ], -1)),
                v("p", Rt, [
                  s[12] || (s[12] = l(" Example: ", -1)),
                  v("code", null, " GET " + w(Y(i)) + w(Y(x)) + "rest/project?api-key=<token>&api-user=" + w(P.value), 1)
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        f.value ? (b(), W(le, {
          key: 0,
          type: "warning",
          variant: "tonal",
          class: "mb-4"
        }, {
          default: t(() => [
            l(w(f.value), 1)
          ]),
          _: 1
        })) : M("", !0),
        e(J, {
          headers: $,
          items: R.value,
          loading: S.value,
          "items-per-page": -1,
          "hide-default-footer": "",
          density: "compact"
        }, {
          "item.actions": t(({ item: H }) => [
            e(E, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Show token",
              onClick: (ie) => Z(H.name, "load")
            }, {
              default: t(() => [
                e(h, { size: "small" }, {
                  default: t(() => [...s[14] || (s[14] = [
                    l("mdi-eye", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(E, {
              icon: "",
              size: "small",
              variant: "text",
              title: "Regenerate",
              onClick: (ie) => Z(H.name, "regen")
            }, {
              default: t(() => [
                e(h, { size: "small" }, {
                  default: t(() => [...s[15] || (s[15] = [
                    l("mdi-refresh", -1)
                  ])]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["onClick"]),
            e(E, {
              icon: "",
              size: "small",
              variant: "text",
              color: "error",
              title: "Delete",
              onClick: (ie) => ne(H.name)
            }, {
              default: t(() => [
                e(h, { size: "small" }, {
                  default: t(() => [...s[16] || (s[16] = [
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
        e(me, {
          modelValue: U.value,
          "onUpdate:modelValue": s[2] || (s[2] = (H) => U.value = H),
          "max-width": "480",
          persistent: ""
        }, {
          default: t(() => [
            e(X, null, {
              default: t(() => [
                e(ae, null, {
                  default: t(() => [...s[17] || (s[17] = [
                    l("New API token", -1)
                  ])]),
                  _: 1
                }),
                e(T, null, {
                  default: t(() => [
                    e(_e, {
                      ref_key: "createFormRef",
                      ref: k,
                      onSubmit: ce(K, ["prevent"])
                    }, {
                      default: t(() => [
                        e(ue, {
                          modelValue: C.value,
                          "onUpdate:modelValue": s[0] || (s[0] = (H) => C.value = H),
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
                e(de, null, {
                  default: t(() => [
                    e(A),
                    e(E, {
                      variant: "text",
                      onClick: s[1] || (s[1] = (H) => U.value = !1)
                    }, {
                      default: t(() => [...s[18] || (s[18] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(E, {
                      color: "primary",
                      variant: "elevated",
                      loading: L.value,
                      onClick: K
                    }, {
                      default: t(() => [...s[19] || (s[19] = [
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
        e(me, {
          modelValue: I.value,
          "onUpdate:modelValue": s[5] || (s[5] = (H) => I.value = H),
          "max-width": "520"
        }, {
          default: t(() => [
            e(X, null, {
              default: t(() => [
                e(ae, null, {
                  default: t(() => [
                    s[20] || (s[20] = l(" Token: ", -1)),
                    v("code", null, w(Q.value), 1)
                  ]),
                  _: 1
                }),
                e(T, null, {
                  default: t(() => [
                    B.value ? (b(), W(ge, {
                      key: 0,
                      indeterminate: "",
                      color: "primary",
                      class: "mb-3"
                    })) : M("", !0),
                    e(F, {
                      modelValue: z.value,
                      "onUpdate:modelValue": s[3] || (s[3] = (H) => z.value = H),
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": N
                    }, null, 8, ["modelValue"]),
                    ee.value ? (b(), W(le, {
                      key: 1,
                      type: "success",
                      variant: "tonal",
                      density: "compact",
                      class: "mt-2"
                    }, {
                      default: t(() => [...s[21] || (s[21] = [
                        l(" Copied to clipboard. ", -1)
                      ])]),
                      _: 1
                    })) : M("", !0)
                  ]),
                  _: 1
                }),
                e(de, null, {
                  default: t(() => [
                    e(A),
                    e(E, {
                      variant: "text",
                      onClick: s[4] || (s[4] = (H) => I.value = !1)
                    }, {
                      default: t(() => [...s[22] || (s[22] = [
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
        e(me, {
          modelValue: D.value,
          "onUpdate:modelValue": s[7] || (s[7] = (H) => D.value = H),
          "max-width": "520",
          persistent: ""
        }, {
          default: t(() => [
            e(X, null, {
              default: t(() => [
                e(ae, null, {
                  default: t(() => [
                    s[23] || (s[23] = l(" New token: ", -1)),
                    v("code", null, w(y.value), 1)
                  ]),
                  _: 1
                }),
                e(T, null, {
                  default: t(() => [
                    e(le, {
                      type: "info",
                      variant: "tonal",
                      density: "compact",
                      class: "mb-3"
                    }, {
                      default: t(() => [...s[24] || (s[24] = [
                        l(" Save this value now — you can re-display it later through ", -1),
                        v("strong", null, "Show token", -1),
                        l(". ", -1)
                      ])]),
                      _: 1
                    }),
                    e(F, {
                      "model-value": V.value,
                      readonly: "",
                      rows: "3",
                      variant: "outlined",
                      "hide-details": "",
                      "append-inner-icon": "mdi-content-copy",
                      "onClick:appendInner": p
                    }, null, 8, ["model-value"])
                  ]),
                  _: 1
                }),
                e(de, null, {
                  default: t(() => [
                    e(A),
                    e(E, {
                      color: "primary",
                      onClick: s[6] || (s[6] = (H) => D.value = !1)
                    }, {
                      default: t(() => [...s[25] || (s[25] = [
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
        e(me, {
          modelValue: q.value,
          "onUpdate:modelValue": s[9] || (s[9] = (H) => q.value = H),
          "max-width": "420"
        }, {
          default: t(() => [
            e(X, null, {
              default: t(() => [
                e(ae, null, {
                  default: t(() => [...s[26] || (s[26] = [
                    l("Delete token", -1)
                  ])]),
                  _: 1
                }),
                e(T, null, {
                  default: t(() => [
                    s[27] || (s[27] = l("Revoke token ", -1)),
                    v("code", null, w(c.value), 1),
                    s[28] || (s[28] = l("?", -1))
                  ]),
                  _: 1
                }),
                e(de, null, {
                  default: t(() => [
                    e(A),
                    e(E, {
                      variant: "text",
                      onClick: s[8] || (s[8] = (H) => q.value = !1)
                    }, {
                      default: t(() => [...s[29] || (s[29] = [
                        l("Cancel", -1)
                      ])]),
                      _: 1
                    }),
                    e(E, {
                      color: "error",
                      variant: "elevated",
                      loading: u.value,
                      onClick: te
                    }, {
                      default: t(() => [...s[30] || (s[30] = [
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
}, Lt = { class: "pa-4" }, jt = {
  __name: "SubscribeWizardView",
  setup(o) {
    const m = se();
    return oe(() => {
      m.setTitle("Subscribe"), m.setBreadcrumbs([{ title: "Subscribe" }]);
    }), (_, g) => {
      const x = n("v-alert");
      return b(), j("div", Lt, [
        g[1] || (g[1] = v("h1", { class: "text-h4 mb-4" }, "Subscribe wizard", -1)),
        e(x, {
          type: "info",
          variant: "tonal",
          density: "compact"
        }, {
          default: t(() => [...g[0] || (g[0] = [
            l(" Legacy ", -1),
            v("code", null, "webjars/subscribe-wizard/", -1),
            l(". TODO: multi-step flow (select project → pick service → pick tool → configure parameters) backing ", -1),
            v("code", null, "rest/subscription", -1),
            l(". ", -1)
          ])]),
          _: 1
        })
      ]);
    };
  }
}, Et = {
  sample: Ve.sample
}, ke = [
  { path: "/home", name: "ui-home", component: Le },
  { path: "/home/manual", name: "ui-manual", component: dt },
  { path: "/home/project", name: "ui-project-list", component: Je },
  { path: "/home/project/:id", name: "ui-project-detail", component: rt },
  { path: "/system", name: "ui-system", component: ct },
  { path: "/system/user", name: "ui-system-user", component: ft },
  { path: "/system/role", name: "ui-system-role", component: yt },
  { path: "/system/plugin", name: "ui-system-plugin", component: xt },
  { path: "/system/node", name: "ui-system-node", component: Vt },
  { path: "/system/cache", name: "ui-system-cache", component: Pt },
  { path: "/system/bench", name: "ui-system-bench", component: Dt },
  { path: "/api", name: "ui-api", component: Tt },
  { path: "/api/token", name: "ui-api-token", component: It },
  { path: "/subscribe", name: "ui-subscribe", component: jt }
], Qt = {
  id: "ui",
  label: "UI",
  component: Re,
  routes: ke,
  install({ router: o }) {
    for (const m of ke)
      o.addRoute(m);
  },
  feature(o, ...m) {
    const _ = Et[o];
    if (!_) throw new Error(`Plugin "ui" has no feature "${o}"`);
    return _(...m);
  },
  service: Ve,
  meta: { icon: "mdi-view-dashboard", color: "indigo-darken-2" }
};
export {
  Kt as TARGET_TYPE_ICON,
  Qt as default,
  Se as getFullName,
  Yt as getHierarchyIds,
  Ee as getService,
  Wt as getServiceFromId,
  Jt as getServiceNameFromId,
  Be as getTool,
  Ht as getToolFromId,
  Xt as getToolNameFromId,
  Ft as htmlEscape,
  Gt as htmlUnescape,
  Oe as normalize,
  Ve as service,
  je as toUser2Letters,
  Mt as trimObject
};
