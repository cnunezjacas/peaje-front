<template>
  <div class="q-px-md">
    <q-table
      class="shadow-6"
      bordered
      table-header-class="bg-green-10 text-white"
      ref="tableAddModelo"
      :rows-per-page-label="STRINGS.record_page"
      :rows="filteredRows"
      :columns="columns"
      :rows-per-page-options="nomberForPage"
      row-key="name"
      :separator="separator"
      selection="single"
      v-model:selected="selectedRows"
      @update:selected="onSelectedRowsChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'

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
    name: 'name',
    required: true,
    label: STRINGS.nombre_org,
    align: 'center',
    field: 'name',
    sortable: true,
  },
]

const rows = ref([
  {
    name: 'Unión de Jóvenes Comunistas',
    name_min: 'UJC',
  },
  {
    name: 'Partido Comunista de Cuba',
    name_min: 'PCC',
  },
])

const separator = ref('vertical')
const selectedRows = ref([])

//Manejador de los botones de la navBottom
var BloquearEdit = ref(true)
var BloquearDelete = ref(true)
var BloquearDetalle = ref(true)
var BloquearGuardar = ref(true)

// Para emitir eventos
const emit = defineEmits(['seleccionado'])
//const tabs_nomencaldores_provincia = ref(null)

const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    console.log('newSelected:' + newSelected.length)
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
    emit('onBloquearEdit', (BloquearEdit.value = false))
    emit('onBloquearDelete', (BloquearDelete.value = false))
    emit('onBloquearDetalle', (BloquearDetalle.value = false))
    emit('onBloquearGuardar', (BloquearGuardar.value = false))
  } else {
    // console.log('Nada seleccionado')
    emit('onBloquearEdit', (BloquearEdit.value = true))
    emit('onBloquearDelete', (BloquearDelete.value = true))
    emit('onBloquearDetalle', (BloquearDetalle.value = true))
    emit('onBloquearGuardar', (BloquearGuardar.value = true))
  }
}

import { watch, computed } from 'vue'

// Props
const props = defineProps({
  TextSearch: String,
})

// Reacción a cambios en TextSearch
const filteredRows = computed(() => {
  if (!props.TextSearch) {
    return rows.value
  }
  const searchTerm = props.TextSearch.toLowerCase()
  return rows.value.filter((row) => {
    return (
      row.name.toLowerCase().includes(searchTerm) || row.name_min.toLowerCase().includes(searchTerm)
    )
  })
})

watch(rows, (newVal) => {
  console.log('Rows ha cambiado:', newVal)
})

defineExpose({
  filteredRows,
})
</script>
