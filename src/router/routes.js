import { STRINGS } from '../utils/string.js'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/gest_' + STRINGS.provinciaLowercase,
        component: () => import('viewsNomencladores/gest_provincia.vue'),
      },
      {
        path: '/gest_' + STRINGS.municipioLowercase,
        component: () => import('viewsNomencladores/gest_municipio.vue'),
      },
      {
        path: '/gest_' + STRINGS.organismoLowercase,
        component: () => import('viewsNomencladores/gest_organismo.vue'),
      },
      {
        path: '/gest_' + STRINGS.bancoLowercase,
        component: () => import('viewsNomencladores/gest_banco.vue'),
      },
      {
        path: '/gest_' + STRINGS.monedasLowercase,
        component: () => import('viewsNomencladores/gest_moneda.vue'),
      },
      {
        path: '/gest_' + STRINGS.vehiculosLowercase,
        component: () => import('viewsNomencladores/gest_vehiculos.vue'),
      },
      {
        path: '/gest_' + STRINGS.exentoLowercase,
        component: () => import('viewsNomencladores/gest_exento.vue'),
      },
      {
        path: '/gest_' + STRINGS.comprobanteLowercase,
        component: () => import('viewsNomencladores/gest_comprobantes.vue'),
      },
      {
        path: '/gest_' + STRINGS.formaDePagoLowercaseURL,
        component: () => import('viewsNomencladores/gest_formaDePago.vue'),
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
