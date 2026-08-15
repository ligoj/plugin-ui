/*
 * Demonstration dataset of the admin-level demo mode (host `useDemoMode`).
 * Purely display-side: blended into the dashboard tool groups, the project
 * list and the project edit dialog — never persisted anywhere.
 */

/** Dashboard demo tool groups (raw rows; HomeView maps them to panel groups). */
export const DEMO_TOOLS = [
  { key: 'Jira', name: 'Jira', kind: 'Gestion de tickets', health: 0.82, rows: [{ n: 'Company1 — Keycopter', s: 'ok', p: ['38 ouv.', '73 clos'] }, { n: 'ANRU — Agora', s: 'ok', p: ['28 ouv.'] }, { n: 'Bank — KYC', s: 'warn', p: ['12 ouv.'] }, { n: 'EDF — Consoweb', s: 'ok', p: ['185 clos'] }] },
  { key: 'Jenkins', name: 'Jenkins', kind: 'Intégration continue', health: 0.61, rows: [{ n: 'Company1 — Keycopter', s: 'ok', p: ['#1842'] }, { n: 'Bank — KYC', s: 'err', p: ['échec'] }, { n: 'EDF — PPA Sonar', s: 'ok', p: ['#77'] }, { n: 'EPO — EPO', s: 'warn', p: ['instable'] }] },
  { key: 'SonarQube', name: 'SonarQube', kind: 'Qualité de code', health: 0.7, rows: [{ n: 'bank-pse-android', s: 'warn', p: ['B'] }, { n: 'Bank — Accueil iPad', s: 'ok', p: ['A'] }, { n: 'CA — Caroline', s: 'err', p: ['C'] }] },
  { key: 'Provisioning AWS', name: 'Provisioning AWS', kind: 'Coûts cloud', health: 0.76, rows: [{ n: 'Datasync Framework', s: 'ok', p: ['8 CPU', '303 $'], cost: true }, { n: 'Loader SAP GP074', s: 'warn', p: ['428 $'], cost: true }] },
]

/**
 * Demo projects, shaped like ProjectListView's mapped rows. Ids are negative
 * so they can never collide with a real project (the detail route of a demo
 * row simply falls back to the not-found view).
 */
export const DEMO_PROJECTS = [
  { id: -1, name: 'Company1 — Keycopter', pkey: 'demo-keycopter', description: 'Helicopter fleet maintenance portal', teamLeader: 'fdaugan', createdDate: '2024-03-12', subs: 4, tools: ['Jira', 'Jenkins'], health: 0.82 },
  { id: -2, name: 'Bank — KYC', pkey: 'demo-kyc', description: 'Know-your-customer onboarding flows', teamLeader: 'mtuyer', createdDate: '2024-09-30', subs: 3, tools: ['Jira', 'Jenkins', 'SonarQube'], health: 0.61 },
  { id: -3, name: 'EDF — Consoweb', pkey: 'demo-consoweb', description: 'Energy consumption dashboard', teamLeader: 'fdaugan', createdDate: '2025-01-18', subs: 2, tools: ['Jira'], health: 0.9 },
  { id: -4, name: 'Datasync Framework', pkey: 'demo-datasync', description: 'Cloud cost optimized data pipelines', teamLeader: 'jdupont', createdDate: '2025-06-02', subs: 1, tools: ['Provisioning AWS'], health: 0.76 },
]
