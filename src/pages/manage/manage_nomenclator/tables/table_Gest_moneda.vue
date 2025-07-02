<template>
  <div class="q-px-md">
    <div class="flex justify-between padding_minimo">
      <div class="text-center bg-green-10 rounded-borders my-cell">
        <p class="text-tittle-table">{{ STRINGS.gestion }} {{ STRINGS.monedasLowercase }}</p>
      </div>

      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el class="text-green-10" label="Inicio" to="/" icon="home" />
          <q-breadcrumbs-el class="text-green-10" :label="STRINGS.gestion" icon="folder" />

          <q-breadcrumbs-el :label="STRINGS.monedasLowercase" icon="post_add" />
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
      class="shadow-2 custom-horizontal-lines"
      table-header-class="bg-green-10 text-white"
      ref="tableMoneda"
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
import notify_error from 'src/utils/notify/notify_error.js'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'

import imports from 'src/utils/imports.js'

// Datos
const numberForPage = imports.getNumberForPage()
const isLoading = ref(true)

const columns = [
  {
    name: 'siglas',
    align: 'left',
    label: STRINGS.siglas_moneda,
    field: 'siglas',
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre_moneda,
    align: STRINGS.TableAlign,
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'nomenclador',
    align: STRINGS.TableAlign,
    label: STRINGS.nomenclador_moneda,
    field: 'nomenclador',
    sortable: true,
  },
  {
    name: 'tasa',
    align: STRINGS.TableAlign,
    label: STRINGS.tasaCambio_moneda,
    field: 'tasa',
    format: (val) => `${val} $`,
    sortable: true,
  },
  {
    name: 'condor',
    align: STRINGS.TableAlign,
    label: STRINGS.idCondor_moneda,
    field: 'condor',
    sortable: true,
  },
  {
    name: 'moneda',
    align: STRINGS.TableAlign,
    label: STRINGS.mBase_moneda,
    field: 'moneda',
    sortable: true,
  },
]

import { onBeforeMount } from 'vue'

const InitDataTable = async () => {
  isLoading.value = true
  try {
    const responseMoneda = await api.get(STRINGS.urlApiMoneda)
    rows.value = responseMoneda.data
  } catch (error) {
    console.error('Error cargando datos:', error)
    notify_error(STRINGS.loadingTablesError)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(() => {
  InitDataTable()
})

const rows = ref([])
const separator = ref('vertical')
// Para manejar la fila seleccionada

const selectedRows = ref([])

const emit = defineEmits(['seleccionado'])
//Manejador de los botones de la navBottom
var EnableItemsTabs = ref(true)

// Manejador de selección
const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
    emit('onEnable', (EnableItemsTabs.value = false))
  } else {
    emit('onEnable', (EnableItemsTabs.value = true))
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
      row.nombre.toLowerCase().includes(searchTerm) ||
      row.siglas.toLowerCase().includes(searchTerm) ||
      String(row.nomenclador).toLowerCase().includes(searchTerm) ||
      String(row.tasa).toLowerCase().includes(searchTerm) ||
      row.condor.toLowerCase().includes(searchTerm) ||
      row.moneda.toLowerCase().includes(searchTerm)
    )
  })
})

const UpdateTable = async () => {
  InitDataTable()
  selectedRows.value = []
}

const EmptySelected = () => {
  selectedRows.value = []
}

defineExpose({
  filteredRows,
  EmptySelected,
  UpdateTable,
})
</script>
