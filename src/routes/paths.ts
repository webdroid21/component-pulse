// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  ADMIN: '/admin',
  ACCOUNT: '/account',
};

// ----------------------------------------------------------------------

export const paths = {
  // Public pages
  home: '/',
  products: '/products',
  product: (slug: string) => `/products/${slug}`,
  categories: '/categories',
  category: (slug: string) => `/categories/${slug}`,
  deals: '/deals',
  cart: '/cart',
  checkout: '/checkout',
  about: '/about',
  contact: '/contact',
  support: '/support',
  faqs: '/faqs',
  trackOrder: '/track-order',

  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },

  // CUSTOMER ACCOUNT
  account: {
    root: ROOTS.ACCOUNT,
    profile: `${ROOTS.ACCOUNT}/profile`,
    orders: `${ROOTS.ACCOUNT}/orders`,
    order: (id: string) => `${ROOTS.ACCOUNT}/orders/${id}`,
    addresses: `${ROOTS.ACCOUNT}/addresses`,
    wishlist: `${ROOTS.ACCOUNT}/wishlist`,
  },

  // ADMIN DASHBOARD
  admin: {
    root: ROOTS.ADMIN,
    dashboard: `${ROOTS.ADMIN}/dashboard`,
    // Products
    products: {
      root: `${ROOTS.ADMIN}/products`,
      new: `${ROOTS.ADMIN}/products/new`,
      edit: (id: string) => `${ROOTS.ADMIN}/products/${id}/edit`,
    },
    // Categories
    categories: `${ROOTS.ADMIN}/categories`,
    // Orders
    orders: {
      root: `${ROOTS.ADMIN}/orders`,
      details: (id: string) => `${ROOTS.ADMIN}/orders/${id}`,
    },
    // Customers
    customers: {
      root: `${ROOTS.ADMIN}/customers`,
      details: (id: string) => `${ROOTS.ADMIN}/customers/${id}`,
    },
    // Delivery
    delivery: `${ROOTS.ADMIN}/delivery`,
    // Deals
    deals: `${ROOTS.ADMIN}/deals`,
    // Coupons
    coupons: `${ROOTS.ADMIN}/coupons`,
    // Returns
    returns: `${ROOTS.ADMIN}/returns`,
    // Reports
    reports: `${ROOTS.ADMIN}/reports`,
    // Settings
    settings: `${ROOTS.ADMIN}/settings`,
    // Admin Users (Super Admin only)
    users: {
      root: `${ROOTS.ADMIN}/users`,
      new: `${ROOTS.ADMIN}/users/new`,
      edit: (id: string) => `${ROOTS.ADMIN}/users/${id}/edit`,
    },
  },

  // Legacy dashboard paths (for compatibility)
  dashboard: {
    root: ROOTS.ADMIN,
  },
};
