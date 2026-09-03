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
    @onBlockTabs="BlockTabs"
    @seleccionado="DataSelected"
    ref="tableGeneric"
  >
  </BaseTable>
</template>

<script setup>
//******* Importaciones *******
import { ref, computed, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import imports from 'src/utils/imports.js'
import BaseTable from 'src/components/shared/table/TableGeneric.vue'
import { useApi } from 'composables/useApi.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { notify_error } = useNotify()
const { fetchData } = useApi()

// ******* Variables *******
const title = ref(STRINGS.name_municipio.toLowerCase())
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
    name: 'nombre',
    required: true,
    label: STRINGS.name,
    align: STRINGS.TableAlign,
    field: 'nombre',
    sortable: true,
  },

  {
    name: 'provincia',
    align: STRINGS.TableAlign,
    label: STRINGS.name_provincia,
    field: (row) => row.provincia?.nombre || '',
    sortable: true,
  },
  {
    name: 'codigo',
    align: STRINGS.TableAlign,
    label: STRINGS.code,
    field: 'codigo',
    sortable: true,
  },
]

//******* Funciones *******

/**
 * Función encargada de cargar los datos de la tabla
 */

const InitDataTable = async () => {
  isLoading.value = true

  const { data: municipio, error: error } = await fetchData(STRINGS.urlApiMunicipio)

  if (error) {
    console.error(STRINGS.errorFetch, { error })
    notify_error(STRINGS.loadingTablesError)
    return false
  } else {
    rows.value = municipio || []
  }

  isLoading.value = false
  return true
}

/**
 * Metodo encargado de lanzar operaciones previo de que el componente sea montado en el DOM
 */
onBeforeMount(async () => {
  InitDataTable()
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
      String(row.codigo).toLowerCase().includes(searchTerm) ||
      row.provincia?.nombre?.toLowerCase().includes(searchTerm)
    )
  })
})

const emit = defineEmits(['onBlockTabs'])

/* Función destinada a emit un evento que hablita/desabilita los tabs [Add,Editar,Delete ... ect] */
const BlockTabs = (value) => {
  if (value) {
    emit('onBlockTabs', true)
  } else {
    emit('onBlockTabs', false)
  }
}

/* Función destinada a recibir de template BaseTable los valores de la fila seleccionada en la tabla */
const DataSelected = (row) => {
  // Puede ser null si se deseleccionó
  if (row && row._id) {
    // Emitir el objeto completo hacia el padre
    emit('onSelected', row)
  } else {
    // Opcional: emitir null para que el padre sepa que no hay selección
    emit('onSelected', null)
  }
}

/**
 * Función encargada actualizar los datos de la tabla
 */
const UpdateTable = async () => {
  tableGeneric.value.selectedRows = []
  BlockTabs(true)
  return await InitDataTable()
}
/**
 * Función encargada de limpiar los datos capturados en la selección
 */
const EmptySelected = () => {
  tableGeneric.value.selectedRows = []
}

//******* Métodos *******
/**
 * Inicializa la carga de datos de la tabla
 * Debe ser llamado explícitamente por el componente padre
 * @returns {Promise<boolean>} true si la carga fue exitosa
 */
const init = async () => {
  return await InitDataTable()
}

//Exponer Funciones y Métodos a Template Padre
defineExpose({
  UpdateTable,
  EmptySelected,
  // DATOS PARA EXPORTACIÓN:
  rows, // Datos completos (sin filtrar)
  filteredRows, // Datos filtrados por búsqueda(computed)
  columns, // Configuración de columnas
  init, //Función para Inicializar la carga de datos de la tabla
})
</script>
