<template>
  <div class="q-px-md">
    <div class="flex justify-between padding_minimo">
      <div class="text-center bg-green-10 rounded-borders my-cell">
        <p class="text-tittle-table">{{ STRINGS.gestion }} {{ STRINGS.comprobanteLowercase }}</p>
      </div>

      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el class="text-green-10" label="Inicio" icon="home" />
          <q-breadcrumbs-el class="text-green-10" :label="STRINGS.gestion" icon="folder" />

          <q-breadcrumbs-el :label="STRINGS.comprobanteLowercase" icon="post_add" />
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
      ref="tableAddProvincia"
      :rows-per-page-label="STRINGS.record_page"
      :rows="filteredRows"
      :columns="columns"
      :rows-per-page-options="numberForPage"
      :no-data-label="STRINGS.no_data_available"
      row-key="codigo"
      :separator="separator"
      selection="single"
      :selected-rows-label="customSelectedLabel"
      v-model:selected="selectedRows"
      @update:selected="onSelectedRowsChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import { onBeforeMount } from 'vue'
import notify_error from 'src/utils/notify/notify_error.js'
import imports from 'src/utils/imports.js'

// Datos
const numberForPage = imports.getNumberForPage()
const isLoading = ref(true)

const columns = [
  {
    name: 'codigo',
    align: STRINGS.TableAlign,
    label: STRINGS.codigo_comprobante,
    field: 'codigo',
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre_comprobante,
    align: STRINGS.TableAlign,
    field: (rows) => rows.nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'valor',
    required: true,
    label: STRINGS.valor_comprobante,
    field: 'valor',
    align: STRINGS.TableAlign,
    format: (val) => `${val} $`,
    sortable: true,
  },
  {
    name: STRINGS.moneda_comprobante.toLowerCase(),
    required: true,
    label: STRINGS.moneda_comprobante,
    align: STRINGS.TableAlign,
    field: STRINGS.moneda_comprobante.toLowerCase(),
    sortable: true,
  },
]

// Función para personalizar la etiqueta del número de filas seleccionadas

const customSelectedLabel = (count) => {
  return `${count} fila${count > 1 ? 's' : ''} seleccionada${count > 1 ? 's' : ''}`
}

const InitDataTable = async () => {
  isLoading.value = true
  try {
    const response = await api.get(STRINGS.urlApiComprobante)

    const responseMoneda = await imports.getCoin()

    response.data.forEach((element) => {
      responseMoneda.data.forEach((item) => {
        if (item['_id'] === element['moneda']) {
          element['moneda'] = item['siglas']
        }
      })
    })

    rows.value = response.data
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
      row.nombre.toLowerCase().includes(searchTerm) ||
      row.codigo.toLowerCase().includes(searchTerm) ||
      row.moneda.toLowerCase().includes(searchTerm)
    )
  })
})

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
