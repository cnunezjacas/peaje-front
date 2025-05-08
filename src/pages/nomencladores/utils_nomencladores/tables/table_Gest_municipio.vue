<template>
  <div class="q-px-md">
    <q-table
      class="shadow-6"
      bordered
      table-header-class="bg-green-10 text-white"
      ref="tableAddMunicipio"
      :rows-per-page-label="STRINGS.record_page"
      :rows="filteredRows"
      :columns="columns"
      :rows-per-page-options="numberForPage"
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

var numberForPage = [5, 7, 10, 15, 20, 50, 0]

const columns = [
  { name: 'codigo', align: 'center', label: STRINGS.codigo_mun, field: 'codigo', sortable: true },
  {
    name: 'name',
    required: true,
    label: STRINGS.nombre_mun,
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

const rows = ref([
  {
    name: 'Bayamo',
    codigo: '45',
    provincia: 'Granma',
  },
  {
    name: 'Banes',
    codigo: '23',
    provincia: 'Holguín',
  },
  {
    name: 'Baracoa',
    codigo: '10',
    provincia: 'Guantánamo',
  },
  {
    name: 'Güaimaro',
    codigo: '21',
    provincia: 'Camagüey',
  },
  {
    name: 'Colón',
    codigo: '32',
    provincia: 'Matanzas',
  },
  {
    name: 'Santa Clara',
    codigo: '26',
    provincia: 'Villa Clara',
  },
])

const separator = ref('vertical')
// Para manejar la fila seleccionada

const selectedRows = ref([])

//Manejador de los botones de la navBottom
var BloquearEdit = ref(true)
var BloquearDelete = ref(true)
var BloquearDetalle = ref(true)
var BloquearGuardar = ref(true)

//Provincia a Eliminar
var ProvinciaDelete = ref('')
var ProvinciaCodigoDelete = ref('')

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
    emit('oNnameProvinciaDelete', (ProvinciaDelete.value = newSelected[0]['name']))
    emit('oNcodigoProvinciaDelete', (ProvinciaCodigoDelete.value = newSelected[0]['codigo']))
  } else {
    // console.log('Nada seleccionado')
    emit('onBloquearEdit', (BloquearEdit.value = true))
    emit('onBloquearDelete', (BloquearDelete.value = true))
    emit('onBloquearDetalle', (BloquearDetalle.value = true))
    emit('onBloquearGuardar', (BloquearGuardar.value = true))
  }
}

import { computed } from 'vue'

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
      row.name.toLowerCase().includes(searchTerm) ||
      row.codigo.toLowerCase().includes(searchTerm) ||
      row.provincia.toLowerCase().includes(searchTerm)
    )
  })
})

defineExpose({
  filteredRows,
})
</script>
