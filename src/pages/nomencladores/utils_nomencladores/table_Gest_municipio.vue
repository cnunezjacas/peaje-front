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
      :rows-per-page-options="numberForPage"
      row-key="name"
      :separator="separator"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../utils/string.js'

var numberForPage = [5, 7, 10, 15, 20, 50, 0]

const columns = [
  { name: 'codigo', align: 'center', label: STRINGS.codigo_mun, field: 'codigo', sortable: true },
  {
    name: 'name',
    required: true,
    label: STRINGS.nombre,
    align: 'center',
    field: 'name',
    sortable: true,
  },
  {
    name: 'provincia',
    align: 'center',
    label: STRINGS.name_provincia,
    field: 'provincia',
    sortable: true,
  },
]

const rows = [
  {
    name: 'Bayamo',
    codigo: '145',
    provincia: 'Granma',
  },
  {
    name: 'Banes',
    codigo: '23',
    provincia: 'Holguín',
  },
  {
    name: 'La Lisa',
    codigo: '2',
    provincia: 'La Habana',
  },
]

const separator = ref('vertical')
</script>
