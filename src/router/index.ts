import { createRouter, createWebHistory } from 'vue-router';
import { AuthService } from '@/services/AuthService';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    // ROTAS PÚBLICAS (PublicLayout)
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/pages/public/HomePage.vue'),
        },
        {
          path: 'condominios',
          name: 'Condominiums',
          component: () => import('@/pages/public/CondominiumsPage.vue'),
        },
        {
          path: 'condominios/:slug',
          name: 'CondominiumDetails',
          component: () => import('@/pages/public/CondominiumDetailsPage.vue'),
        },
        {
          path: 'condominios/:slug/terrenos',
          name: 'CondominiumTerrains',
          component: () => import('@/pages/public/CatalogPage.vue'),
        },
        {
          path: 'terrenos',
          name: 'Catalog',
          component: () => import('@/pages/public/CatalogPage.vue'),
        },
        {
          path: 'terrenos/:slug',
          name: 'TerrainDetails',
          component: () => import('@/pages/public/TerrainDetailsPage.vue'),
        },
        {
          path: 'oportunidades/:slug',
          name: 'Opportunities',
          component: () => import('@/pages/public/TerrainDetailsPage.vue'),
        },
      ]
    },

    // ROTA DE LOGIN DA GESTÃO
    {
      path: '/gestao/login',
      name: 'AdminLogin',
      component: () => import('@/pages/admin/AdminLoginPage.vue'),
    },

    // ROTAS ADMINISTRATIVAS (AdminLayout)
    {
      path: '/gestao',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'AdminDashboard',
          component: () => import('@/pages/admin/DashboardPage.vue'),
        },
        {
          path: 'condominios',
          name: 'AdminCondominiums',
          component: () => import('@/pages/admin/CondominiumListPage.vue'),
        },
        {
          path: 'condominios/novo',
          name: 'AdminCondominiumCreate',
          component: () => import('@/pages/admin/CondominiumFormPage.vue'),
        },
        {
          path: 'condominios/:id/editar',
          name: 'AdminCondominiumEdit',
          component: () => import('@/pages/admin/CondominiumFormPage.vue'),
        },
        {
          path: 'terrenos',
          name: 'AdminTerrains',
          component: () => import('@/pages/admin/TerrainListPage.vue'),
        },
        {
          path: 'terrenos/novo',
          name: 'AdminTerrainCreate',
          component: () => import('@/pages/admin/TerrainFormPage.vue'),
        },
        {
          path: 'terrenos/:id/editar',
          name: 'AdminTerrainEdit',
          component: () => import('@/pages/admin/TerrainFormPage.vue'),
        },
        {
          path: 'midia',
          name: 'AdminMedia',
          component: () => import('@/pages/admin/MediaLibraryPage.vue'),
        },
        {
          path: 'pagina-inicial',
          name: 'AdminHomePageSettings',
          component: () => import('@/pages/admin/HomeSettingsPage.vue'),
        },
        {
          path: 'identidade-visual',
          name: 'AdminBranding',
          component: () => import('@/pages/admin/BrandingPage.vue'),
        },
        {
          path: 'contatos',
          name: 'AdminContacts',
          component: () => import('@/pages/admin/ContactSettingsPage.vue'),
        },
        {
          path: 'seo',
          name: 'AdminSEO',
          component: () => import('@/pages/admin/SEOSettingsPage.vue'),
        },
        {
          path: 'marketing',
          name: 'AdminMarketing',
          component: () => import('@/pages/admin/MarketingSettingsPage.vue'),
        },
      ]
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/public/NotFoundPage.vue'),
    }
  ]
});

// Guard de Autenticação para a Gestão
router.beforeEach((to) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = AuthService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    return { path: '/gestao/login', query: { redirect: to.fullPath } };
  } else if (to.path === '/gestao/login' && isAuthenticated) {
    return '/gestao';
  }
});

export default router;
