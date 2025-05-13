<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-green-5">
      <!-- <q-toolbar class="bg-green-6">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>{{ STRINGS.tittleSite }} </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar> -->

      <q-toolbar class="bg-green-5 text-white q-my-md">
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="toggleLeftDrawer" />
        <q-separator dark vertical inset />
        <q-btn stretch flat :to="'/'">{{ STRINGS.tittleSite }}</q-btn>

        <q-space />

        <q-btn-dropdown stretch flat :label="STRINGS.gestion">
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
      <router-view />
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
import { STRINGS } from '../utils/string.js'

const linksNavLeft = [
  {
    id: 'gestion',
    label: 'Gestión',
    icon: 'folder',
    children: [
      { id: 'gest_provincia', label: STRINGS.name_provincia, icon: 'post_add' },
      { id: 'gest_municipio', label: STRINGS.name_municipio, icon: 'post_add' },
      { id: 'gest_organismo', label: STRINGS.name_organismo, icon: 'post_add' },
      { id: 'gest_organismox', label: STRINGS.name_bancos, icon: 'post_add' },
      { id: 'gest_organismox', label: STRINGS.name_monedas, icon: 'post_add' },
      { id: 'gest_organismox', label: STRINGS.name_vehiculos, icon: 'post_add' },
      { id: 'gest_organismox', label: STRINGS.name_exento, icon: 'post_add' },
      { id: 'gest_organismox', label: STRINGS.name_comprobantes, icon: 'post_add' },
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
