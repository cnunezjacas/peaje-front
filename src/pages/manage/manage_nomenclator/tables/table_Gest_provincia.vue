<template>
  <div class="q-px-md">
    <div class="flex justify-between padding_minimo">
      <div class="text-center bg-green-10 rounded-borders my-cell">
        <p class="text-tittle-table">{{ STRINGS.gestion }} {{ STRINGS.provinciaLowercase }}</p>
      </div>

      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el class="text-green-10" label="Inicio" icon="home" to="/" />
          <q-breadcrumbs-el class="text-green-10" :label="STRINGS.gestion" icon="folder" />

          <q-breadcrumbs-el :label="STRINGS.provinciaLowercase" icon="post_add" />
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
      ref="tableAddProvincia"
      :rows-per-page-label="STRINGS.record_page"
      :rows="filteredRows"
      :columns="columns"
      :rows-per-page-options="numberForPage"
      :no-data-label="STRINGS.no_data_available"
      row-key="codigo"
      :separator="separator"
      selection="single"
      v-model:selected="selectedRows"
      @update:selected="onSelectedRowsChange"
    >
    </q-table>
  </div>
</template>

<script setup>
//******* Importaciones *******
import { ref, computed, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import imports from 'src/utils/imports.js'
import notify_error from 'src/utils/notify/notify_error.js'

// ******* Variables *******
const numberForPage = imports.getNumberForPage()
const isLoading = ref(true)
const rows = ref([])
const separator = ref('vertical')
const selectedRows = ref([])
var EnableItemsTabs = ref(true)
const columns = [
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre_prov,
    style: 'width: 150px;', // ajusta según sea necesario
    align: STRINGS.TableAlign,
    field: (rows) => rows.nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'codigo',
    label: STRINGS.codigo_prov,
    align: STRINGS.TableAlign,
    style: 'width: 10px;', // ajusta según sea necesario
    field: 'codigo',
    sortable: true,
  },
  {
    name: '_id',
    align: STRINGS.TableAlign,
    style: 'width: 10px;', // ajusta según sea necesario
    field: '_id',
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

// Emite eventos
const emit = defineEmits(['seleccionado'])
/**
 * Función encargada de capturar los datos del elemento capturado
 */
const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
    emit('onEnable', (EnableItemsTabs.value = false))
  } else {
    emit('onEnable', (EnableItemsTabs.value = true))
  }
}
/**
 * Función encargada actualizar los datos de la tabla
 */
const UpdateTable = async () => {
  InitDataTable()
  selectedRows.value = []
}
/**
 * Función encargada de limpiar los datos capturados en la selección
 */
const EmptySelected = () => {
  selectedRows.value = []
}

//******* Métodos *******
/**
 * Método encargado de realizar operaciones, previo de que el componente sea montado en el DOM
 */
onBeforeMount(() => {
  InitDataTable()
})

// Props
const props = defineProps({
  TextSearch: String,
})

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

//Exponer Funciones y Métodos a Template Padre
defineExpose({
  filteredRows,
  UpdateTable,
  EmptySelected,
})
</script>
