import imports from 'src/utils/imports'
import { STRINGS } from 'utils/string.js'

const routes = [
  {
    path: '/',
    meta: {
      breadcrumb: 'Inicio',
      icon: 'house',
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        meta: {
          breadcrumb: 'Inicio',
          icon: 'house',
        },
        component: () => import('pages/IndexPage.vue'),
      },
      //nomenclator
      {
        path: STRINGS.provinciaLowercase,
        meta: {
          breadcrumb: STRINGS.name_provincia,
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      {
        path: STRINGS.municipioLowercase,
        meta: {
          breadcrumb: STRINGS.name_municipio,
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      {
        path: STRINGS.organismoLowercase,
        meta: {
          breadcrumb: STRINGS.organismoLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      {
        path: STRINGS.bancoLowercase,
        meta: {
          breadcrumb: STRINGS.bancoLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      {
        path: STRINGS.monedasLowercase,
        meta: {
          breadcrumb: STRINGS.monedasLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      {
        path: STRINGS.vehiculosLowercase,
        meta: {
          breadcrumb: STRINGS.vehiculosLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      {
        path: STRINGS.exentoLowercase,
        meta: {
          breadcrumb: STRINGS.exentoLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      {
        path: STRINGS.comprobanteLowercase,
        meta: {
          breadcrumb: STRINGS.comprobanteLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      {
        path: STRINGS.formaDePagoLowercaseURL,
        meta: {
          breadcrumb: imports.JoinCamelCase(STRINGS.formaDePagoLowercaseURL),
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      {
        path: STRINGS.tipoCuentaLowercaseURL,
        meta: {
          breadcrumb: imports.JoinCamelCase(STRINGS.tipoCuentaLowercaseURL),
          icon: 'post_add',
        },
        component: () => import('viewsNomenclator/view/content_page.vue'),
      },
      //Entity
      {
        path: STRINGS.cuentaLowercase,
        meta: {
          breadcrumb: STRINGS.cuentaLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsEntity/view/content_page.vue'),
      },
      {
        path: STRINGS.estacionesLowercase,
        meta: {
          breadcrumb: STRINGS.estacionesLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsEntity/view/content_page.vue'),
      },
      {
        path: STRINGS.areasDeTrabajoLowercase,
        meta: {
          breadcrumb: imports.JoinCamelCase(STRINGS.areasDeTrabajoLowercase),
          icon: 'post_add',
        },
        component: () => import('viewsEntity/view/content_page.vue'),
      },
      {
        path: STRINGS.puntosDeVentasLowercase,
        meta: {
          breadcrumb: imports.JoinCamelCase(STRINGS.puntosDeVentasLowercase),
          icon: 'post_add',
        },
        component: () => import('viewsEntity/view/content_page.vue'),
      },
      {
        path: STRINGS.terminalLowercase,
        meta: {
          breadcrumb: STRINGS.terminalLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsEntity/view/content_page.vue'),
      },
      {
        path: STRINGS.operadoresLowercase,
        meta: {
          breadcrumb: STRINGS.operadoresLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsEntity/view/content_page.vue'),
      },
      {
        path: STRINGS.clientesLowercase,
        meta: {
          breadcrumb: STRINGS.clientesLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsEntity/view/content_page.vue'),
      },
      {
        path: STRINGS.tramitadorLowercase,
        meta: {
          breadcrumb: STRINGS.tramitadorLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsEntity/view/content_page.vue'),
      }, //Store
      {
        path: STRINGS.tarjeta_blancaLowercase,
        meta: {
          breadcrumb: STRINGS.tarjeta_blancaLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsStore/view/content_page.vue'),
      },
      {
        path: STRINGS.proveedorLowercase,
        meta: {
          breadcrumb: STRINGS.proveedorLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsStore/view/content_page.vue'),
      },
      {
        path: STRINGS.tarjeta_producidaLowercase,
        meta: {
          breadcrumb: STRINGS.tarjeta_producidaLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsStore/view/content_page.vue'),
      },
      {
        path: STRINGS.recepcion_de_tarjeta_blancaLowercase,
        meta: {
          breadcrumb: STRINGS.recepcion_de_tarjeta_blancaLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsStore/view/content_page.vue'),
      },
      {
        path: STRINGS.recepcion_de_tarjeta_producidaLowercase,
        meta: {
          breadcrumb: STRINGS.recepcion_de_tarjeta_producidaLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsStore/view/content_page.vue'),
      },
      {
        path: STRINGS.salida_de_tarjeta_producidaLowercase,
        meta: {
          breadcrumb: STRINGS.salida_de_tarjeta_producidaLowercase,
          icon: 'post_add',
        },
        component: () => import('viewsStore/view/content_page.vue'),
      },
      {
        path: '/help',
        component: () => import('src/pages/PageAyuda.vue'),
      },
      {
        path: '/config',
        component: () => import('src/pages/PageConfiguracion.vue'),
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
