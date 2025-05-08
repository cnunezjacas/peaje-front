//import { STRINGS } from '../utils/string'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/gest_provincia',
        component: () => import('src/pages/nomencladores/gest_provincia.vue'),
      },
      {
        path: '/gest_municipio',
        component: () => import('src/pages/nomencladores/gest_municipio.vue'),
      },
      {
        path: '/gest_organismo',
        component: () => import('src/pages/nomencladores/gest_organismo.vue'),
      },
      {
        path: '/pageAyuda',
        component: () => import('pages/pageAyuda.vue'),
      },
      {
        path: '/pageConfiguracion',
        component: () => import('pages/pageConfiguracion.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
