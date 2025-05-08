<template>
  <div class="q-px-md">
    <q-table
      class="shadow-6"
      bordered
      table-header-class="bg-green-10 text-white"
      ref="tableAddProvincia"
      :rows-per-page-label="STRINGS.record_page"
      :rows="filteredRows"
      :columns="columns"
      :rows-per-page-options="nomberForPage"
      row-key="name"
      :separator="separator"
      selection="single"
      v-model:selected="selectedRows"
      @update:selected="onSelectedRowsChange"
    >
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { STRINGS } from '../../../../utils/string.js'

// Datos
const nomberForPage = [5, 7, 10, 15, 20, 50, 0]

const columns = [
  {
    name: 'codigo',
    align: 'center',
    label: STRINGS.codigo_prov,
    field: 'codigo',
    sortable: true,
  },
  {
    name: 'name',
    required: true,
    label: STRINGS.nombre,
    align: 'center',
    field: (rows) => rows.name,
    format: (val) => `${val}`,
    sortable: true,
  },
]

const rows = ref([
  { name: 'Granma', codigo: '33' },
  { name: 'Las Tunas', codigo: '31' },
  { name: 'La Habana', codigo: '24' },
])

const separator = ref('vertical')
const selectedRows = ref([])

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
      row.name.toLowerCase().includes(searchTerm) || row.codigo.toLowerCase().includes(searchTerm)
    )
  })
})

// Emite eventos
const emit = defineEmits(['seleccionado'])
//Manejador de los botones de la navBottom
var BloquearEdit = ref(true)
var BloquearDelete = ref(true)
var BloquearDetalle = ref(true)
var BloquearGuardar = ref(true)

//Provincia a Eliminar
var ProvinciaDelete = ref('')
var ProvinciaCodigoDelete = ref('')

// Manejador de selección
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

// Funciones adicionales
// const EditarUnaFila = (nombre, codigo) => {

// }

// Exponemos `filteredRows` si el padre necesita acceder directamente
defineExpose({
  filteredRows,
})
</script>
