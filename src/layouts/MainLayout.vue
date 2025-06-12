<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green-5">
      <q-toolbar class="bg-green-5 text-white q-my-md">
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="toggleLeftDrawer" />
        <q-separator dark vertical inset />
        <q-btn stretch flat :to="'/'">{{ STRINGS.tittleSite }}</q-btn>

        <q-space />

        <q-btn-dropdown stretch flat :label="STRINGS.gestionNomencladores">
          <q-list>
            <q-item-label header>Folders</q-item-label>
            <q-item v-for="n in 3" :key="`x.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="folder" color="secondary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Photos</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
            <q-separator inset spaced />
            <q-item-label header>Files</q-item-label>
            <q-item v-for="n in 4" :key="`y.${n}`" clickable v-close-popup tabindex="0">
              <q-item-section avatar>
                <q-avatar icon="assignment" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vacation</q-item-label>
                <q-item-label caption>February 22, 2016</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="info" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-separator dark vertical />
        <q-btn stretch flat>
          <q-icon name="settings" :left="true" /> {{ STRINGS.textConfig }}</q-btn
        >
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
        <q-item-label header class="text-grey-5"> {{ STRINGS.gestionPeaje }} </q-item-label>

        <!-- <EssentialLink v-for="item in linksList" :key="item.title" v-bind="item" /> -->

        <PrincipalNavLeft :menuItems="linksNavLeft" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
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
import { ref } from 'vue'
// import EssentialLink from 'components/EssentialLink.vue'
import PrincipalNavLeft from 'components/PrincipalNavLeft.vue'
import { STRINGS } from 'utils/string.js'

const linksNavLeft = [
  {
    id: STRINGS.gestionNomencladoresLowercase,
    label: STRINGS.gestionNomencladores,
    icon: 'folder',
    children: [
      {
        id: 'gest_' + STRINGS.provinciaLowercase,
        label: STRINGS.provinciaLowercase,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.municipioLowercase,
        label: STRINGS.municipioLowercase,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.organismoLowercase,
        label: STRINGS.organismoLowercase,
        icon: 'post_add',
      },
      { id: 'gest_' + STRINGS.bancoLowercase, label: STRINGS.bancoLowercase, icon: 'post_add' },
      { id: 'gest_' + STRINGS.monedasLowercase, label: STRINGS.monedasLowercase, icon: 'post_add' },
      {
        id: 'gest_' + STRINGS.vehiculosLowercase,
        label: STRINGS.vehiculosLowercase,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.exentoLowercase,
        label: STRINGS.exentoLowercase,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.comprobanteLowercase,
        label: STRINGS.comprobanteLowercase,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.formaDePagoLowercaseURL,
        label: STRINGS.formaDePagoLowercase,
        icon: 'post_add',
      },
    ],
  },

  {
    id: STRINGS.gestionEntidadLowercase,
    label: STRINGS.gestionEntidad,
    icon: 'folder',
    children: [
      {
        id: 'gest_' + STRINGS.estacionesLowercase,
        label: STRINGS.name_estaciones,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.areasDeTrabajoLowercase,
        label: STRINGS.name_areas_trabajo,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.puntosDeVentasLowercase,
        label: STRINGS.name_puntos_venta,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.terminalLowercase,
        label: STRINGS.name_terminal,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.operadoresLowercase,
        label: STRINGS.name_operadores,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.clientesLowercase,
        label: STRINGS.name_clientes,
        icon: 'post_add',
      },
      {
        id: 'gest_' + STRINGS.tramitadorLowercase,
        label: STRINGS.name_tramitador,
        icon: 'post_add',
      },
    ],
  },

  {
    id: 'pageConfiguracion',
    label: 'Configuración',
    icon: 'settings',
  },
  {
    id: 'pageAyuda',
    label: STRINGS.help,
    icon: 'help',
  },
  {
    id: 'pageAyuda',
    label: STRINGS.close_seccion,
    icon: 'door_back',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
