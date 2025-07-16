import imports from 'src/utils/imports'
import { STRINGS } from 'utils/string.js'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      //nomenclator
      {
        path: '/gest_' + STRINGS.provinciaLowercase,
        meta: {
          breadcrumb: STRINGS.name_provincia,
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.municipioLowercase,
        meta: {
          breadcrumb: STRINGS.name_municipio,
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.organismoLowercase,
        meta: {
          breadcrumb: STRINGS.organismoLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.bancoLowercase,
        meta: {
          breadcrumb: STRINGS.bancoLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.monedasLowercase,
        meta: {
          breadcrumb: STRINGS.monedasLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.vehiculosLowercase,
        meta: {
          breadcrumb: STRINGS.vehiculosLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.exentoLowercase,
        meta: {
          breadcrumb: STRINGS.exentoLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.comprobanteLowercase,
        meta: {
          breadcrumb: STRINGS.comprobanteLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.formaDePagoLowercaseURL,
        meta: {
          breadcrumb: imports.JoinCamelCase(STRINGS.formaDePagoLowercaseURL),
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.tipoCuentaLowercaseURL,
        meta: {
          breadcrumb: imports.JoinCamelCase(STRINGS.tipoCuentaLowercaseURL),
          icon: 'post_add',
        },
        component: () => import('viewsManage/gest_global.vue'),
      },
      //Entity
      {
        path: '/gest_' + STRINGS.cuentaLowercase,
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.estacionesLowercase,
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.areasDeTrabajoLowercase,
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.puntosDeVentasLowercase,
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.terminalLowercase,
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.operadoresLowercase,
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.clientesLowercase,
        component: () => import('viewsManage/gest_global.vue'),
      },
      {
        path: '/gest_' + STRINGS.tramitadorLowercase,
        component: () => import('viewsManage/gest_global.vue'),
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
