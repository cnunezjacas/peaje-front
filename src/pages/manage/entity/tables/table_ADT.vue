<template>
  <div class="q-px-md">
    <div class="flex justify-between padding_minimo">
      <div class="text-center bg-green-10 rounded-borders my-cell">
        <p class="text-tittle-table">
          {{ STRINGS.gestion }} {{ STRINGS.name_areas_trabajo.toLowerCase() }}
        </p>
      </div>

      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el class="text-green-10" label="Inicio" icon="home" />
          <q-breadcrumbs-el class="text-green-10" :label="STRINGS.gestion" icon="folder" />

          <q-breadcrumbs-el :label="Titulo" icon="post_add" />
        </q-breadcrumbs>
      </div>
    </div>
    <!-- Mostrar spinner cuando está cargando -->
    <div v-if="isLoading" class="flex justify-center items-center" style="height: 300px">
      <q-spinner size="50px" color="green" />
    </div>
    <!-- Mostrar la tabla cuando no está cargando -->

    <q-table v-else class="shadow-2 custom-horizontal-lines" table-header-class="bg-green-10 text-white"
      ref="tableAddProvincia" :rows-per-page-label="STRINGS.record_page" :rows="row" :columns="columns"
      :rows-per-page-options="numberForPage" :no-data-label="STRINGS.no_data_available" row-key="_id"
      :separator="separator" selection="single" v-model:selected="selectedRows"
      @update:selected="onSelectedRowsChange" />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
//import api from 'src/axios.js'
import imports from 'src/utils/imports.js'

// Datos
const numberForPage = imports.getNumberForPage()
//Spinner Carga Datos
const isLoading = ref(true)
const Titulo = ref('')

const columns = [
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre_ADT,
    align: STRINGS.TableAlign,
    field: (row) => row.nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'codigo',
    align: STRINGS.TableAlign,
    label: STRINGS.codigo_ADT,
    field: 'codigo',
    sortable: true,
  },
]

const row = [
  {
    nombre: 'Area de Trabajo 1',
    codigo: 'DSGRTS',
    _id: '12345678',
  },
]


onBeforeMount(() => {
  //InitDataTable()
  isLoading.value = false
  Titulo.value = imports.JoinCamelCase(STRINGS.areasDeTrabajoLowercase)
})

//const rows = ref([])
const separator = ref('vertical')
const selectedRows = ref([])

// Props
/*const props = defineProps({
  TextSearch: String,
})*/

// Reacción a cambios en TextSearch
/*const filteredRows = computed(() => {
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
})*/

// Emite eventos
const emit = defineEmits(['seleccionado', 'onBlockTabs'])
//Manejador de los botones de la navBottom
var EnableItemsTabs = ref(true)

// Manejador de selección
const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
    emit('onBlockTabs', (EnableItemsTabs.value = false))
  } else {
    emit('onBlockTabs', (EnableItemsTabs.value = true))
  }
}

/*const UpdateTable = async () => {
  InitDataTable()
  selectedRows.value = []
}*/

// Exponemos `filteredRows` si el padre necesita acceder directamente
/*defineExpose({
  filteredRows,
  UpdateTable,
})*/
</script>
