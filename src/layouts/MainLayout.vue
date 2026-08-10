<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green-5">
      <q-toolbar class="bg-green-5 text-white">
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="toggleLeftDrawer" />
        <q-separator dark vertical inset />
        <q-btn stretch flat :to="'/'">{{ STRINGS.tittleSite }}</q-btn>

        <q-space />

        <q-btn-dropdown class="text-sm text-bold" stretch flat :label="STRINGS.gestion">
          <q-list>
            <template v-for="item in linksNavLeft" :key="item.id">
              <treeItems :item="item" @navigate="handleNavigation" />
            </template>
          </q-list>
        </q-btn-dropdown>

        <q-separator dark vertical />

        <q-btn-dropdown class="text-sm text-bold" icon="settings" stretch flat :label="STRINGS.textConfig">
          <div class="bg-green-10">
            <div class="row flex justify-start">
              <div class="q-pa-md">
                <q-avatar color="green-5" text-color="white" icon="person" />
              </div>

              <div class="q-pa-md text-white">
                <p class="noStyle small-font-user">Alex Jacas</p>
                <q-separator color="green-5" horizontal />
                <p class="noStyle textSubtittle">Administrador</p>
              </div>

            </div>
          </div>


          <div class="row">
            <div class="col-12">
              <div class="q-ma-sm">
                <q-list>
                  <PrincipalNavLeft :nav-link-on="false" class-color-text="dark" :menuItems="linksNavsConfig" />
                </q-list>

              </div>
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="shadow-10 bg-green-10">
      <div class="bg-grey-5 flex flex-center">
        <!-- logo -->
        <div class="col-12 q-pa-xl">
          <img src="../assets/img/logo.png" width="35" height="35" />
        </div>
      </div>

      <q-list>
        <PrincipalNavLeft :nav-link-on="true" class-color-text="white" :menuItems="linksNavLeft" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page>
        <!--   <transition name="fade" mode="out-in"> -->
        <router-view />
        <!--  </transition> -->
      </q-page>
    </q-page-container>
    <!-- Footer con mismo color que la toolbar -->
    <q-footer class="bg-green-5 text-white">
      <div class="q-pa-md text-center">
        <!-- Aquí puedes poner lo que desees en el footer -->
        <div class="flex justify-center">
          <div>
            <!-- class: tittle-fotter -->
            <!-- class: SubTittle-fotter -->
            <p class="text-sm no-margin">© {{ STRINGS.year_project }} {{ STRINGS.tittleSite }}</p>
            <p class="text-xs no-margin">Todos los derechos reservados.</p>
            <p class="text-xs no-margin"><q-icon name="code" /> {{ STRINGS.version }}</p>
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import treeItems from 'layouts/treeItems.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

function handleNavigation(id) {
  // Aquí puedes definir cómo navegar
  // Por ejemplo, si los IDs son URLs completas o rutas
  router.push({ path: id }) // ajusta esto según tu lógica
}

/*import { useQuasar } from 'quasar'

const $q = useQuasar()*/

// import EssentialLink from 'components/EssentialLink.vue'
import PrincipalNavLeft from 'components/PrincipalNavLeft.vue'

import { STRINGS } from 'utils/string.js'

const linksNavsConfig = [{
  id: 'config',
  label: 'Configuración',
  icon: 'settings',
  level: 1,
},
{
  id: 'help',
  label: STRINGS.help,
  icon: 'help',
  level: 1,
},
{
  id: 'pageLogin',
  label: STRINGS.close_seccion,
  icon: 'door_back',
  level: 1,
},]

const linksNavLeft = [
  {
    id: STRINGS.gestionNomencladoresLowercase,
    label: STRINGS.nomenclator,
    icon: 'bi-boxes',
    level: 1,
    children: [{
      idPadre: STRINGS.gestionNomencladoresLowercase,
      label: STRINGS.components,
      level: 2,
      icon: 'bi-box',
      children: [{
        id: STRINGS.province.toLowerCase(),
        idPadre: STRINGS.gestionNomencladoresLowercase,
        label: STRINGS.province,
        level: 3,
        icon: 'bi-geo-alt-fill',
      },
      {
        id: STRINGS.municipality.toLowerCase(),
        label: STRINGS.municipality,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 3,
        icon: 'bi-geo-alt',
      },
      {
        id: STRINGS.organismoLowercase,
        label: STRINGS.organismoLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 3,
        icon: 'bi-building',
      },
      {
        id: STRINGS.gestionBancoLowercase,
        label: STRINGS.gestionBanco,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 3,
        icon: 'folder',
        children: [
          {
            id: STRINGS.tipoCuentaLowercaseURL,
            idPadre: STRINGS.gestionBancoLowercase,
            label: STRINGS.tipoCuentaLowercaseURL,
            level: 4,
            icon: 'bi-credit-card',
          },
          {
            id: STRINGS.bancoLowercase,
            label: STRINGS.bancoLowercase,
            idPadre: STRINGS.gestionBancoLowercase,
            level: 4,
            icon: 'bi-bank',
          },
        ],
      },
      {
        id: STRINGS.currency.toLowerCase(),
        label: STRINGS.currency.toLowerCase(),
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 3,
        icon: 'bi-coin',
      },
      {
        id: STRINGS.vehiculosLowercase,
        label: STRINGS.vehiculosLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 3,
        icon: 'bi-car-front',
      },
      {
        id: STRINGS.exempt.toLowerCase(),
        label: STRINGS.exempt.toLowerCase(),
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 3,
        icon: 'bi-collection',
      },
      {
        id: STRINGS.voucher.toLowerCase(),
        label: STRINGS.voucher.toLowerCase(),
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 3,
        icon: 'bi-receipt-cutoff',
      },
      {
        id: STRINGS.formaDePagoLowercaseURL,
        label: STRINGS.formaDePagoLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 3,
        icon: 'bi-cash-coin',
      },]
    }, {
      idPadre: STRINGS.gestionNomencladoresLowercase,
      label: STRINGS.reports,
      level: 2,
      icon: 'bi-file-earmark-pdf',
    }
    ],
  },

  {
    id: STRINGS.gestionEntidadLowercase,
    label: STRINGS.entity,
    icon: 'bi-house-gear',
    level: 1,
    children: [
      {
        idPadre: STRINGS.gestionEntidadLowercase,
        label: STRINGS.components,
        level: 2,
        icon: 'bi-box',
        children: [{
          id: STRINGS.account.toLowerCase(),
          label: STRINGS.account.toLowerCase(),
          idPadre: STRINGS.gestionEntidadLowercase,
          level: 3,
          icon: 'bi-person-lines-fill',
        },
        {
          id: STRINGS.estacionesLowercase,
          label: STRINGS.name_estaciones,
          idPadre: STRINGS.gestionEntidadLowercase,
          level: 3,
          icon: 'bi-cloud-sun',
        },
        {
          id: STRINGS.areasDeTrabajoLowercase,
          label: STRINGS.name_areas_trabajo,
          idPadre: STRINGS.gestionEntidadLowercase,
          level: 3,
          icon: 'bi-cone-striped',
        },
        {
          id: STRINGS.puntosDeVentasLowercase,
          label: STRINGS.name_puntos_venta,
          idPadre: STRINGS.gestionEntidadLowercase,
          level: 3,
          icon: 'bi-shop-window',
        },
        {
          id: STRINGS.terminalLowercase,
          label: STRINGS.name_terminal,
          idPadre: STRINGS.gestionEntidadLowercase,
          level: 3,
          icon: 'bi-buildings',
        },
        {
          id: STRINGS.operadoresLowercase,
          label: STRINGS.name_operadores,
          idPadre: STRINGS.gestionEntidadLowercase,
          level: 3,
          icon: 'bi-person-video3',
        },
        {
          id: STRINGS.clientesLowercase,
          label: STRINGS.name_clientes,
          idPadre: STRINGS.gestionEntidadLowercase,
          level: 3,
          icon: 'bi-people-fill',
        },
        {
          id: STRINGS.tramitadorLowercase,
          label: STRINGS.name_tramitador,
          idPadre: STRINGS.gestionEntidadLowercase,
          level: 3,
          icon: 'bi-person-raised-hand',
        },]
      }, {
        idPadre: STRINGS.gestionEntidadLowercase,
        label: STRINGS.reports,
        level: 2,
        icon: 'bi-file-earmark-pdf',
      }
    ],
  },
  {
    id: STRINGS.gestionAlmacenLowercase,
    label: STRINGS.store,
    icon: 'bi-shop',
    level: 1,
    children: [
      {
        idPadre: STRINGS.gestionEntidadLowercase,
        label: STRINGS.components,
        level: 2,
        icon: 'bi-box',
        children: [
          {
            id: STRINGS.tarjeta_blancaLowercase,
            label: STRINGS.name_tarjeta_blanca,
            idPadre: STRINGS.gestionAlmacenLowercase,
            level: 3,
            icon: 'bi-credit-card-2-front',
          },
          {
            id: STRINGS.tarjeta_producidaLowercase,
            label: STRINGS.name_tarjeta_producida,
            idPadre: STRINGS.gestionAlmacenLowercase,
            level: 3,
            icon: 'bi-card-heading',
          },
          {
            id: STRINGS.proveedorLowercase,
            label: STRINGS.name_proveedor,
            idPadre: STRINGS.gestionAlmacenLowercase,
            level: 3,
            icon: 'bi-person-vcard',
          },
          {
            id: STRINGS.recepcion_de_tarjeta_blancaLowercase,
            label: STRINGS.name_recepcion_de_tarjeta_blanca,
            idPadre: STRINGS.gestionAlmacenLowercase,
            level: 3,
            icon: 'bi-postcard',
          },
          {
            id: STRINGS.recepcion_de_tarjeta_producidaLowercase,
            label: STRINGS.name_recepcion_de_tarjeta_producida,
            idPadre: STRINGS.gestionAlmacenLowercase,
            level: 3,
            icon: 'bi-postcard-fill',
          },
          {
            id: STRINGS.salida_de_tarjeta_producidaLowercase,
            label: STRINGS.name_salida_de_tarjeta_producida,
            idPadre: STRINGS.gestionAlmacenLowercase,
            level: 3,
            icon: 'bi-send-check',
          },
          {
            id: STRINGS.visualizar_movimientos_internosLowercase,
            label: STRINGS.name_visualizar_movimientos_internos,
            idPadre: STRINGS.gestionAlmacenLowercase,
            level: 3,
            icon: 'bi-arrow-down-up',
          },
        ],
      }, {
        idPadre: STRINGS.gestionEntidadLowercase,
        label: STRINGS.reports,
        level: 2,
        icon: 'bi-file-earmark-pdf',
      }, {
        id: 'visualizar_movimientos_internos',
        label: 'Visualizar Movimientos Internos',
        icon: 'bi-clipboard-pulse',
        level: 2,
      },
      {
        id: 'subMayor',
        label: 'Submayor',
        icon: 'bi-list-ol',
        level: 2,
      },
      {
        id: 'gestionar_ajuste',
        label: 'Gestionar ajuste',
        icon: 'bi-file-earmark-medical',
        level: 2,
      },
    ],
  },
  // 🔥 SEPARADOR (agrega esto)
  {
    type: 'separator',  // 👈 Tipo especial para separador
    id: 'separator-1',
  },

  {
    id: 'orden_de_trabajo',
    label: 'Orden de Trabajo',
    icon: 'bi-card-checklist',
    level: 1,
  },
  {
    id: 'tarjeta',
    label: 'Tarjeta',
    icon: 'bi-card-heading',
    level: 1,
  },
  {
    id: 'transaccion',
    label: 'Transacción',
    icon: 'bi-minecart-loaded',
    level: 1,
  },
  {
    id: 'facturación',
    label: 'Facturación',
    icon: 'bi-currency-exchange',
    level: 1,
  },
  {
    id: 'contabilizacion',
    label: 'Contabilización',
    icon: 'bi-ui-checks',
    level: 1,
  },
  {
    id: 'colecta',
    label: 'Colecta',
    icon: 'bi-safe',
    level: 1,
  }, {
    idPadre: STRINGS.gestionEntidadLowercase,
    label: STRINGS.report,
    level: 1,
    icon: 'bi-file-earmark-pdf',
  }



]

// Componente recursivo para renderizar items

const RenderItem = defineComponent({
  name: 'RenderItem',
  props: {
    item: Object,
  },
  setup(props) {
    const hasChildren = () => props.item.children && props.item.children.length > 0

    return () => {
      if (hasChildren()) {
        return h(
          'q-expansion-item',
          {
            icon: props.item.icon,
            label: props.item.label,
            'expand-separator': true,
            'default-expanded': false,
          },
          {
            default: () =>
              props.item.children.map((child) => h(RenderItem, { item: child, key: child.id })),
          },
        )
      } else {
        return h('q-item', { clickable: true }, [
          h('q-item-section', { avatar: true }, [h('q-icon', { name: props.item.icon })]),
          h('q-item-section', {}, props.item.label),
        ])
      }
    }
  },
})

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
