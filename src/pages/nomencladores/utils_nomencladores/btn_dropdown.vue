<template>
  <q-btn-dropdown
    fab-mini
    :title="STRINGS.adicionarModelo"
    glossy
    padding="xs"
    size="sm"
    class="bg-white text-green-10"
    icon="add"
    @click="onMainClick"
  >
    <q-list bordered class="q-pa-sm text-sm">
      <q-item clickable v-close-popup @click="onItemClick('edit')">
        <q-item-section avatar>
          <q-avatar icon="edit" size="md" color="primary" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ STRINGS.renameCategoria }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="onItemClick('delete')">
        <q-item-section avatar>
          <q-avatar icon="delete" size="md" color="red" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ STRINGS.deleteCategoria }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced inset horizontal green />

      <q-item clickable v-close-popup @click="onItemClick('addCategory')">
        <q-item-section avatar>
          <q-avatar icon="add" size="md" color="secondary" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ STRINGS.addCategoria }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="onItemClick('addModelo')">
        <q-item-section avatar>
          <q-avatar icon="add" size="md" color="secondary" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ STRINGS.addModelo }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

  <!-- Dialogo -->
  <dialog_nomenclador ref="dialogoNomenclador" />
  <!-- Dialogo -->
</template>

<script setup>
import { ref } from 'vue'
import dialog_nomenclador from './dialogs_insert/dialogoAddProvincia.vue'
import { STRINGS } from '../../../utils/string.js'
//import gest_provincia from '../gest_provincia.vue'

const dialogoNomenclador = ref(null)

const onMainClick = () => {
  // Acción para el clic principal
}

const onItemClick = (action) => {
  // Acción según el item clickeado
  console.log('Acción:', action)

  switch (action) {
    case 'addCategory':
      dialogoNomenclador.value.LevantarDialogo()
      break
    case 'addModelo':
      dialogoNomenclador.value.LevantarDialogoAddModelo()
      break
    case 'delete':
      //gest_provincia.treeRef.value.eliminarSeleccionado()
      break

    default:
      break
  }
}
</script>
