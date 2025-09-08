<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green-5">
      <q-toolbar class="bg-green-5 text-white">
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="toggleLeftDrawer" />
        <q-separator dark vertical inset />
        <q-btn stretch flat :to="'/'">{{ STRINGS.tittleSite }}</q-btn>

        <q-space />

        <q-btn-dropdown class="small-font-items-nav-left" stretch flat :label="STRINGS.gestion">
          <q-list>
            <template v-for="item in linksNavLeft" :key="item.id">
              <treeItems :item="item" @navigate="handleNavigation" />
            </template>
          </q-list>
        </q-btn-dropdown>

        <q-separator dark vertical />

        <q-btn-dropdown class="small-font" stretch flat :label="STRINGS.textConfig">
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
                <p><q-icon name="code" /> v0.01</p>
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
        <!--   <q-item-label header class="text-grey-5"> {{ STRINGS.gestionPeaje }} </q-item-label> -->

        <!-- <EssentialLink v-for="item in linksList" :key="item.title" v-bind="item" /> -->

        <PrincipalNavLeft :menuItems="linksNavLeft" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page>
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </q-page>
    </q-page-container>
    <!-- Footer con mismo color que la toolbar -->
    <q-footer class="bg-green-5 text-white">
      <div class="q-pa-md text-center">
        <!-- Aquí puedes poner lo que desees en el footer -->
        <div class="flex justify-center">
          <div>
            <p class="tittle-fotter">© 2025 {{ STRINGS.tittleSite }}.</p>
            <p class="SubTittle-fotter">Todos los derechos reservados.</p>
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

const linksNavLeft = [
  {
    id: STRINGS.gestionNomencladoresLowercase,
    label: STRINGS.gestionNomencladores,
    icon: 'folder',
    level: 1,
    children: [
      {
        id: 'gest_' + STRINGS.provinciaLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        label: STRINGS.provinciaLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.municipioLowercase,
        label: STRINGS.municipioLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.organismoLowercase,
        label: STRINGS.organismoLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: STRINGS.gestionBancoLowercase,
        label: STRINGS.gestionBanco,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 2,
        icon: 'folder',
        children: [
          {
            id: 'gest_' + STRINGS.tipoCuentaLowercaseURL,
            idPadre: STRINGS.gestionBancoLowercase,
            label: STRINGS.tipoCuentaLowercase,
            level: 3,
            icon: 'post_add',
          },
          {
            id: 'gest_' + STRINGS.bancoLowercase,
            label: STRINGS.bancoLowercase,
            idPadre: STRINGS.gestionBancoLowercase,
            level: 3,
            icon: 'post_add',
          },
        ],
      },
      {
        id: 'gest_' + STRINGS.monedasLowercase,
        label: STRINGS.monedasLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.vehiculosLowercase,
        label: STRINGS.vehiculosLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.exentoLowercase,
        label: STRINGS.exentoLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.comprobanteLowercase,
        label: STRINGS.comprobanteLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.formaDePagoLowercaseURL,
        label: STRINGS.formaDePagoLowercase,
        idPadre: STRINGS.gestionNomencladoresLowercase,
        level: 2,
        icon: 'post_add',
      },
    ],
  },

  {
    id: STRINGS.gestionEntidadLowercase,
    label: STRINGS.gestionEntidad,
    icon: 'folder',
    level: 1,
    children: [
      {
        id: 'gest_' + STRINGS.cuentaLowercase,
        label: STRINGS.cuentaLowercase,
        idPadre: STRINGS.gestionEntidadLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.estacionesLowercase,
        label: STRINGS.name_estaciones,
        idPadre: STRINGS.gestionEntidadLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.areasDeTrabajoLowercase,
        label: STRINGS.name_areas_trabajo,
        idPadre: STRINGS.gestionEntidadLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.puntosDeVentasLowercase,
        label: STRINGS.name_puntos_venta,
        idPadre: STRINGS.gestionEntidadLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.terminalLowercase,
        label: STRINGS.name_terminal,
        idPadre: STRINGS.gestionEntidadLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.operadoresLowercase,
        label: STRINGS.name_operadores,
        idPadre: STRINGS.gestionEntidadLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.clientesLowercase,
        label: STRINGS.name_clientes,
        idPadre: STRINGS.gestionEntidadLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.tramitadorLowercase,
        label: STRINGS.name_tramitador,
        idPadre: STRINGS.gestionEntidadLowercase,
        level: 2,
        icon: 'post_add',
      },
    ],
  },
  {
    id: STRINGS.gestionAlmacenLowercase,
    label: STRINGS.gestionAlmacen,
    icon: 'folder',
    level: 1,
    children: [
      {
        id: 'gest_' + STRINGS.tarjeta_blancaLowercase,
        label: STRINGS.name_tarjeta_blanca,
        idPadre: STRINGS.gestionAlmacenLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.tarjeta_producidaLowercase,
        label: STRINGS.name_tarjeta_producida,
        idPadre: STRINGS.gestionAlmacenLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.proveedorLowercase,
        label: STRINGS.name_proveedor,
        idPadre: STRINGS.gestionAlmacenLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.recepcion_de_tarjeta_blancaLowercase,
        label: STRINGS.name_recepcion_de_tarjeta_blanca,
        idPadre: STRINGS.gestionAlmacenLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.recepcion_de_tarjeta_producidaLowercase,
        label: STRINGS.name_recepcion_de_tarjeta_producida,
        idPadre: STRINGS.gestionAlmacenLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.salida_de_tarjeta_producidaLowercase,
        label: STRINGS.name_salida_de_tarjeta_producida,
        idPadre: STRINGS.gestionAlmacenLowercase,
        level: 2,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.visualizar_movimientos_internosLowercase,
        label: STRINGS.name_visualizar_movimientos_internos,
        idPadre: STRINGS.gestionAlmacenLowercase,
        level: 2,
        icon: 'post_add',
      },
    ],
  },

  {
    id: 'pageConfiguracion',
    label: 'Configuración',
    icon: 'settings',
    level: 1,
  },
  {
    id: 'pageAyuda',
    label: STRINGS.help,
    icon: 'help',
    level: 1,
  },
  {
    id: 'pageLogin',
    label: STRINGS.close_seccion,
    icon: 'door_back',
    level: 1,
  },
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
