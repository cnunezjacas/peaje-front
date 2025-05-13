<template>
  <div class="">
    <q-toolbar class="bg-green-10 text-white shadow-2">
      <!-- <q-btn flat label="Homepage" /> -->

      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->

      <q-tabs v-model="tab" shrink bordered>
        <q-tab name="tab1" icon="add" class="small-font" @click="onItemClick('Add')"
          >Adicionar</q-tab
        >
        <q-tab name="tab2" icon="edit" class="small-font" @click="onItemClick('Edit')"
          >Modificar</q-tab
        >
        <q-tab name="tab3" icon="delete" class="small-font" @click="onItemClick('Delete')"
          >Eliminar</q-tab
        >
        <q-tab name="tab4" icon="save" class="small-font" @click="onItemClick('Save')"
          >Guardar</q-tab
        >
        <q-tab name="tab6" icon="picture_as_pdf" class="small-font" @click="onItemClick('Export')"
          >Exportar</q-tab
        >
        <q-tab name="tab7" icon="receipt_long" class="small-font" @click="onItemClick('Details')"
          >Detalle</q-tab
        >
      </q-tabs>

      <q-space></q-space>

      <!-- Input de busqueda -->
      <div class="q-mx-auto">
        <q-input
          color="white"
          class="text-white"
          v-model="TextSearch"
          @keyup="UpdateSearch()"
          label-color="white"
          :label="STRINGS.search"
          style="max-width: 200px"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="white" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="TextSearch"
              name="cleaning_services"
              class="cursor-pointer"
              @click="resetSearch"
              color="white"
            />
          </template>
        </q-input>
      </div>
      <!-- Input de busqueda -->
    </q-toolbar>
  </div>

  <!-- Dialogo Add -->
  <DialogoAddProvincia ref="dialogoAddProvincia" />

  <table_Gest_provincia ref="tableAddProvincia" style="display: none" />
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../utils/string.js'
import DialogoAddProvincia from './dialogoAddProvincia.vue'
import table_Gest_provincia from './table_Gest_provincia.vue'

const tab = ref('')
const TextSearch = ref('')
const dialogoAddProvincia = ref(null)
const tableAddProvincia = ref(null)

const onItemClick = (value) => {
  switch (value) {
    case 'Add':
      dialogoAddProvincia.value.LevantarDialogo()
      break
    case 'Edit':
      //tableAddProvincia.value.FilaSeleccionadaUpdate(tableAddProvincia.value.idProvince)
      if (tableAddProvincia.value.idProvince != null)
        console.log(tableAddProvincia.value.idProvince)
      break
    case 'Delete':
      break
    case 'Export':
      break
    case 'Details':
      break

    default:
      break
  }
}

const resetSearch = () => {
  TextSearch.value = ''
}
</script>
