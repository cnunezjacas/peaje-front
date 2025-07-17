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
    ref="tableGeneric"
  >
  </BaseTable>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import notify_error from 'src/utils/notify/notify_error.js'
import imports from 'src/utils/imports.js'
import BaseTable from 'TableManage/tableGeneric.vue'

// ******* Variables *******
const title = ref(STRINGS.gestion + ' ' + STRINGS.name_comprobantes.toLowerCase())
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
