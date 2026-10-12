// ✅ Cambio: process.env → import.meta.env
const BASE  = import.meta.env.VITE_API_URL || "http://localhost:8000";

const API_ROUTES = {
 
  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: {
    login : `${BASE}/auth/login`,
    me    : `${BASE}/auth/me`,
  },
 
  // ── Users ─────────────────────────────────────────────────────────────────
  users: {
    list        : `${BASE}/users`,
    create      : `${BASE}/users`,
    detail      : (id) => `${BASE}/users/${id}`,
    update      : (id) => `${BASE}/users/${id}`,
    deactivate  : (id) => `${BASE}/users/${id}`,
    assignRole  : (id) => `${BASE}/users/${id}/role`,
  },
 
  // ── Permissions ───────────────────────────────────────────────────────────
  permissions: {
    list            : `${BASE}/permissions`,
    byUser          : (id) => `${BASE}/permissions/users/${id}`,
    effective       : (id) => `${BASE}/permissions/users/${id}/effective`,
    assign          : (id) => `${BASE}/permissions/users/${id}/assign`,
    revoke          : (id) => `${BASE}/permissions/users/${id}/revoke`,
  },
 
  // ── Categories ────────────────────────────────────────────────────────────
  categories: {
    list   : `${BASE}/categories`,
    create : `${BASE}/categories`,
    update : (id) => `${BASE}/categories/${id}`,
    delete : (id) => `${BASE}/categories/${id}`,
  },
 
  // ── Product Types ─────────────────────────────────────────────────────────
  productTypes: {
    list : `${BASE}/product-types`,
  },
 
  // ── Products ──────────────────────────────────────────────────────────────
  products: {
    list          : `${BASE}/products`,
    detail        : (id) => `${BASE}/products/${id}`,
    create        : `${BASE}/products`,
    update        : (id) => `${BASE}/products/${id}`,
    deactivate    : (id) => `${BASE}/products/${id}`,
    addVariant    : (id) => `${BASE}/products/${id}/variants`,
    updateVariant : (id) => `${BASE}/products/variants/${id}`,
    deleteVariant : (id) => `${BASE}/products/variants/${id}`,
  },
 
  // ── Tables ────────────────────────────────────────────────────────────────
  tables: {
    list         : `${BASE}/tables`,
    create       : `${BASE}/tables`,
    update       : (id) => `${BASE}/tables/${id}`,
    updateStatus : (id) => `${BASE}/tables/${id}/status`,
    delete       : (id) => `${BASE}/tables/${id}`,
  },
 
  // ── Menu ──────────────────────────────────────────────────────────────────
  menu: {
    list        : `${BASE}/menu`,
    today       : `${BASE}/menu/today`,
    detail      : (id) => `${BASE}/menu/${id}`,
    create      : `${BASE}/menu`,
    update      : (id) => `${BASE}/menu/${id}`,
    delete      : (id) => `${BASE}/menu/${id}`,
    addSlot     : (id) => `${BASE}/menu/${id}/slots`,
    updateSlot  : (id) => `${BASE}/menu/slots/${id}`,
    deleteSlot  : (id) => `${BASE}/menu/slots/${id}`,
    addEntry    : (id) => `${BASE}/menu/${id}/entries`,
    updateEntry : (id) => `${BASE}/menu/entries/${id}`,
    deleteEntry : (id) => `${BASE}/menu/entries/${id}`,
  },
 
  // ── Orders ────────────────────────────────────────────────────────────────
  orders: {
    groups       : `${BASE}/orders/groups`,
    groupDetail  : (id) => `${BASE}/orders/groups/${id}`,
    createGroup  : `${BASE}/orders/groups`,
    closeGroup   : (id) => `${BASE}/orders/groups/${id}/close`,
    cancelGroup  : (id) => `${BASE}/orders/groups/${id}/cancel`,
    detail       : (id) => `${BASE}/orders/${id}`,
    createOrder  : (groupId) => `${BASE}/orders/groups/${groupId}/orders`,
    updateStatus : (id) => `${BASE}/orders/${id}/status`,
  },
 
  // ── Payments ──────────────────────────────────────────────────────────────
  payments: {
    byGroup     : (groupId) => `${BASE}/payments/groups/${groupId}`,
    process     : (groupId) => `${BASE}/payments/groups/${groupId}`,
    cancel      : (groupId) => `${BASE}/payments/groups/${groupId}/cancel`,
  },
 
  // ── Reports ───────────────────────────────────────────────────────────────
  reports: {
    daily       : `${BASE}/reports/daily`,
    topProducts : `${BASE}/reports/top-products`,
    menu        : `${BASE}/reports/menu`,
    payments    : `${BASE}/reports/payments`,
  },
 
  // ── Rutas protegidas (guard de React Router) ──────────────────────────────
  protected: [
    // Admin
    { path: "/admin/dashboard",   roles: ["admin"] },
    { path: "/admin/mesas",       roles: ["admin"] },
    { path: "/admin/productos",   roles: ["admin"] },
    { path: "/admin/categorias",  roles: ["admin"] },
    { path: "/admin/menus",       roles: ["admin"] },
    { path: "/admin/ordenes",     roles: ["admin"] },
    { path: "/admin/usuarios",    roles: ["admin"] },
    { path: "/admin/reportes",    roles: ["admin"] },
    // Mesero
    { path: "/mesero/mesas",      roles: ["admin", "mesero"] },
    { path: "/mesero/ordenes",    roles: ["admin", "mesero"] },
    { path: "/mesero/nueva-orden",roles: ["admin", "mesero"] },
    // Cajero
    { path: "/cajero/ordenes",    roles: ["admin", "cajero"] },
    { path: "/cajero/pagos",      roles: ["admin", "cajero"] },
    { path: "/cajero/reportes",   roles: ["admin", "cajero"] },
    // Cocina
    { path: "/cocina/ordenes",    roles: ["admin", "cocina"] },
    { path: "/cocina/menu",       roles: ["admin", "cocina"] },
    // Bar
    { path: "/bar/ordenes",       roles: ["admin", "bartender"] },
  ],
};
 
export default API_ROUTES;