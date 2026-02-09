export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/session',
      handler: 'auth.login',
    },
    {
      method: 'POST',
      path: '/auth/refresh',
      handler: 'auth.refresh',
    },
    {
      method: 'POST',
      path: '/auth/logout',
      handler: 'auth.logout',
    },
  ],
};