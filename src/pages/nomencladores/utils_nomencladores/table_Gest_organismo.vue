<template>
  <div class="q-pa-md">
    <q-table
      class="shadow-6"
      bordered
      table-header-class="bg-green-10 text-white"
      ref="tableAddModelo"
      :rows-per-page-label="STRINGS.record_page"
      :rows="rows"
      :columns="columns"
      :rows-per-page-options="nomberForPage"
      row-key="name"
      :separator="separator"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../utils/string.js'

var nomberForPage = [5, 7, 10, 15, 20, 50, 0]

const columns = [
  {
    name: 'name_min',
    align: 'center',
    label: STRINGS.nombre_abreviado,
    field: 'name_min',
    sortable: true,
  },
  {
    name: 'name_min',
    required: true,
    label: STRINGS.nombre,
    align: 'center',
    field: 'name_min',
    sortable: true,
  },
]

const rows = [
  {
    name: 'Unión de Jóvenes Comunistas',
    name_min: 'UJC',
  },
  {
    name: 'Partido Comunista de Cuba',
    name_min: 'PCC',
  },
]

const separator = ref('vertical')
</script>
