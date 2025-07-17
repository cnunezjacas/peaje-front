<template>
  <BaseTable
    :title="title"
    :Loading="isLoading"
    :filteredRows="filteredRows"
    :columns="columns"
    row-key="_id"
    :no-data-label="STRINGS.no_data_available"
    :separator="separator"
    :rows-per-page-options="numberForPage"
    :rows-per-page-label="STRINGS.number_of_page"
    searchTerm="props.TextSearch"
    @onEnable="EnableTabs"
    @seleccionado="DataSelected"
    :fatherBreadcrumbs="imports.capitalizeWords(STRINGS.gestionNomencladores, true)"
    :SonBreadcrumbs="imports.capitalizeWords(STRINGS.monedasLowercase)"
    ref="tableGeneric"
  >
  </BaseTable>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import notify_error from 'src/utils/notify/notify_error.js'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import imports from 'src/utils/imports.js'
import BaseTable from 'TableManage/tableGeneric.vue'

// ******* Variables *******
const title = ref(STRINGS.gestion + ' ' + STRINGS.monedasLowercase.toLowerCase())
const rows = ref([])
const separator = ref('vertical')
const numberForPage = imports.getNumberForPage()
const tableGeneric = ref([])
const isLoading = ref(true)
// Props
const props = defineProps({
  TextSearch: String,
})

/* Detalles de las columnas de la tabla, referencias de los nombres de las columnas de la tabla en BD */
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

//******* Funciones *******

/**
 * Función encargada de cargar los datos de la tabla
 */
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
const emit = defineEmits(['onEnable'])

/* Función destinada a emit un evento que hablita/desabilita los tabs [Add,Editar,Delete ... ect] */
const EnableTabs = (value) => {
  if (value) {
    emit('onEnable', true)
  } else {
    emit('onEnable', false)
  }
}

/* Función destinada a recibir de template BaseTable los valores de la fila seleccionada en la tabla */
const DataSelected = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
  }
}

/**
 * Función encargada actualizar los datos de la tabla
 */
const UpdateTable = async () => {
  InitDataTable()
  tableGeneric.value.selectedRows = []
}
/**
 * Función encargada de limpiar los datos capturados en la selección
 */
const EmptySelected = () => {
  tableGeneric.value.selectedRows = []
}

//******* Métodos *******
/**
 * Método encargado de realizar operaciones, previo de que el componente sea montado en el DOM
 */
onBeforeMount(() => {
  InitDataTable()
})

//Exponer Funciones y Métodos a Template Padre
defineExpose({
  UpdateTable,
  EmptySelected,
})
</script>
