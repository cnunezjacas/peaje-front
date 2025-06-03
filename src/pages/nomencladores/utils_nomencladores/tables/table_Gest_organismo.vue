<template>
  <div class="q-px-md">
    <div class="flex justify-between padding_minimo">
      <div class="text-center bg-green-10 rounded-borders my-cell">
        <p class="text-tittle-table">{{ STRINGS.gestion }} {{ STRINGS.organismoLowercase }}</p>
      </div>

      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el class="text-green-10" label="Inicio" icon="home" />
          <q-breadcrumbs-el class="text-green-10" :label="STRINGS.gestion" icon="folder" />

          <q-breadcrumbs-el :label="STRINGS.organismoLowercase" icon="post_add" />
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Mostrar spinner cuando está cargando -->
    <div v-if="isLoading" class="flex justify-center items-center" style="height: 300px">
      <q-spinner size="50px" color="green" />
    </div>
    <!-- Mostrar la tabla cuando no está cargando -->

    <q-table
      v-else
      class="shadow-2"
      bordered
      table-header-class="bg-green-10 text-white"
      ref="tableOrganismo"
      :rows-per-page-label="STRINGS.record_page"
      :rows="filteredRows"
      :columns="columns"
      :rows-per-page-options="numberForPage"
      :no-data-label="STRINGS.no_data_available"
      row-key="siglas"
      :separator="separator"
      selection="single"
      v-model:selected="selectedRows"
      @update:selected="onSelectedRowsChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { STRINGS } from '../../../../utils/string.js'
import api from 'src/axios.js'
import imports from 'src/utils/imports.js'

// Datos
const numberForPage = imports.getNumberForPage()
const isLoading = ref(true)

const columns = [
  {
    name: 'siglas',
    align: 'center',
    label: STRINGS.nombre_abreviado,
    field: 'siglas',
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre_org,
    align: 'center',
    field: 'nombre',
    sortable: true,
  },
  {
    name: '_id',
    field: '_id',
    label: '_id',
    visible: false, // Esta propiedad oculta la columna en la vista
    hidden: true,
  },
]

const rows = ref([])

import { onBeforeMount } from 'vue'

const InitDataTable = async () => {
  isLoading.value = true
  try {
    const response = await api.get(STRINGS.urlApiOrganismo)
    rows.value = response.data
  } catch (error) {
    console.error('Error cargando datos:', error)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(() => {
  InitDataTable()
})

const separator = ref('vertical')
const selectedRows = ref([])

//Manejador de los botones de la navBottom
var BloquearEdit = ref(true)
var BloquearDelete = ref(true)
var BloquearDetalle = ref(true)

// Para emitir eventos
const emit = defineEmits(['seleccionado'])
//const tabs_nomencaldores_provincia = ref(null)

const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
    emit('onBloquearEdit', (BloquearEdit.value = false))
    emit('onBloquearDelete', (BloquearDelete.value = false))
    emit('onBloquearDetalle', (BloquearDetalle.value = false))
  } else {
    emit('onBloquearEdit', (BloquearEdit.value = true))
    emit('onBloquearDelete', (BloquearDelete.value = true))
    emit('onBloquearDetalle', (BloquearDetalle.value = true))
  }
}

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
      row.nombre.toLowerCase().includes(searchTerm) || row.siglas.toLowerCase().includes(searchTerm)
    )
  })
})

const UpdateTable = async () => {
  const response = await api.get(STRINGS.urlApiOrganismo)
  rows.value = response.data
}

defineExpose({
  filteredRows,
  UpdateTable,
})
</script>
