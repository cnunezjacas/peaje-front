<template>
  <div class="q-px-md">
    <div class="flex justify-between padding_minimo">
      <div class="text-center bg-green-10 rounded-borders my-cell">
        <p class="text-tittle-table">{{ STRINGS.gestion }} {{ Titulo.toLowerCase() }}</p>
      </div>

      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el class="text-green-10" label="Inicio" icon="home" to="/" />
          <q-breadcrumbs-el class="text-green-10" :label="STRINGS.gestion" icon="folder" />

          <q-breadcrumbs-el :label="Titulo.toLowerCase()" icon="post_add" />
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
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import imports from 'src/utils/imports'
import { onBeforeMount } from 'vue'
import notify_error from 'src/utils/notify/notify_error.js'

const numberForPage = imports.getNumberForPage()
const isLoading = ref(true)

const columns = [
  {
    name: 'codigo',
    align: STRINGS.TableAlign,
    label: STRINGS.codigo_tipoCuenta,
    field: 'codigo',
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre_tipoCuenta,
    align: STRINGS.TableAlign,
    field: (rows) => rows.nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
]

const Titulo = ref('')

const InitDataTable = async () => {
  isLoading.value = true
  try {
    const response = await api.get(STRINGS.urlApiTipoCuenta)
    rows.value = response.data
  } catch (error) {
    console.error('Error cargando datos:', error)
    notify_error(STRINGS.loadingTablesError)
  } finally {
    isLoading.value = false
  }
}

const GetTitulo = () => {
  Titulo.value = imports.JoinCamelCase(STRINGS.tipoCuentaLowercaseURL)
}

onBeforeMount(() => {
  InitDataTable()
  GetTitulo()
})

const rows = ref([])
const separator = ref('vertical')
const selectedRows = ref([])

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
      row.nombre.toLowerCase().includes(searchTerm) || row.codigo.toLowerCase().includes(searchTerm)
    )
  })
})

// Emite eventos
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

const UpdateTable = async () => {
  InitDataTable()
  selectedRows.value = []
}

const EmptySelected = () => {
  selectedRows.value = []
}

// Exponemos `filteredRows` si el padre necesita acceder directamente
defineExpose({
  filteredRows,
  EmptySelected,
  UpdateTable,
})
</script>
