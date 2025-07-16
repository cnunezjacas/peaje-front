<template>
  <BaseTable
    :title="title"
    :Loading="isLoading"
    :filteredRows="filteredRows"
    :columns="columns"
    row-key="codigo"
    :no-data-label="STRINGS.no_data_available"
    :separator="separator"
    :rows-per-page-options="numberForPage"
    :rows-per-page-label="STRINGS.number_of_page"
    searchTerm="props.TextSearch"
    @onEnable="EnableTabs"
    @seleccionado="DataSelected"
    :fatherBreadcrumbs="imports.capitalizeWords(STRINGS.gestionNomencladores, true)"
    :SonBreadcrumbs="imports.capitalizeWords(STRINGS.name_provincia)"
    ref="tableGeneric"
  >
  </BaseTable>
</template>

<script setup>
//******* Importaciones *******
import { ref, computed, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import imports from 'src/utils/imports.js'
import notify_error from 'src/utils/notify/notify_error.js'
import BaseTable from 'TableManage/tableGeneric.vue'

// ******* Variables *******
const numberForPage = imports.getNumberForPage()
const rows = ref([])
const tableGeneric = ref([])
const isLoading = ref(true)
const separator = ref('vertical')
const title = ref(STRINGS.gestion + ' ' + STRINGS.name_provincia.toLowerCase())

// Props
const props = defineProps({
  TextSearch: String,
})

/* Columnas de la tabla Provincia */
const columns = [
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre_prov,
    align: STRINGS.TableAlign,
    field: (rows) => rows.nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'codigo',
    label: STRINGS.codigo_prov,
    align: STRINGS.TableAlign,
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
  try {
    const response = await api.get(STRINGS.urlApiProvincia)
    rows.value = response.data
  } catch (error) {
    console.error('Error cargando datos:', error)
    notify_error(STRINGS.loadingTablesError)
  } finally {
    isLoading.value = false
  }
}

/**
 * Función encargado filtrar los datos de la tabla según el criterio de búsqueda descrito en "props.TextSearch"
 */
const filteredRows = computed(() => {
  if (!props.TextSearch) {
    return rows.value
  }
  const searchTerm = props.TextSearch.toLowerCase()
  return rows.value.filter((row) => {
    return (
      row.nombre.toLowerCase().includes(searchTerm) ||
      String(row.codigo).toLowerCase().includes(searchTerm)
    )
  })
})

const emit = defineEmits(['onEnable'])

const EnableTabs = (value) => {
  if (value) {
    emit('onEnable', true)
  } else {
    emit('onEnable', false)
  }
}

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
