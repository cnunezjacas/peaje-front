<template>
  <div class="q-pa-md">
    <q-table
      class="shadow-6"
      bordered
      table-header-class="bg-green-10 text-white"
      ref="tableAddProvincia"
      :rows-per-page-label="STRINGS.record_page"
      :rows="rows"
      :columns="columns"
      :rows-per-page-options="nomberForPage"
      row-key="name"
      :separator="separator"
      selection="single"
      v-model:selected="selectedRows"
    ></q-table>
    <q-btn
      label="Ver fila seleccionada"
      @click="FilaSeleccionadaUpdate"
      class="q-mt-md"
      color="primary"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../utils/string.js'

var nomberForPage = [5, 7, 10, 15, 20, 50, 0]

const columns = [
  { name: 'codigo', align: 'center', label: STRINGS.codigo_prov, field: 'codigo', sortable: true },
  {
    name: 'name',
    required: true,
    label: STRINGS.nombre,
    align: 'center',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
]

const rows = [
  { name: 'Granma', codigo: '33' },
  { name: 'Las Tunas', codigo: '31' },
  { name: 'La Habana', codigo: '24' },
]

const separator = ref('vertical')
// Para manejar la fila seleccionada
const selectedRows = ref([]) // Es un array, incluso si solo seleccionamos uno

var idProvince = ref(null)

// Función para obtener la fila seleccionada
const FilaSeleccionadaUpdate = () => {
  console.log(selectedRows.value[0]['name'])
  /*if (selectedRows.value.length > 0) {
    idProvince.value = selectedRows.value[0]['name']
  } else {
    idProvince.value = null
  }*/
}

import { watch } from 'vue'

watch(selectedRows, (newVal) => {
  if (newVal.length > 0) {
    idProvince.value = newVal[0]['name']
  } else {
    idProvince.value = null
  }
})

defineExpose({
  FilaSeleccionadaUpdate,
  idProvince,
  rows,
})
</script>
