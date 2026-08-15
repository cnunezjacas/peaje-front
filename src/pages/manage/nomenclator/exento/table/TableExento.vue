<template>
  <BaseTable :title="title" :Loading="isLoading" :filteredRows="filteredRows" :columns="columns" row-key="_id"
    :no-data-label="STRINGS.no_data_available" :separator="separator" :rows-per-page-options="numberForPage"
    :rows-per-page-label="STRINGS.number_of_page" searchTerm="props.TextSearch" @onBlockTabs="BlockTabs"
    @seleccionado="DataSelected" ref="tableGeneric">
  </BaseTable>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'src/composables/useApi'
import imports from 'src/utils/imports.js'
import BaseTable from 'TableManage/tableGeneric.vue'
import { useNotify } from 'src/utils/notify/notify.js'


/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { /*notify_success, notify_warning,*/ notify_error } = useNotify()


// ******* Variables *******
const title = ref(STRINGS.gestion + ' ' + STRINGS.name_exento.toLowerCase())
const { fetchData } = useApi()
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
    label: STRINGS.code,
    field: 'codigo',
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,
    label: STRINGS.name,
    align: STRINGS.TableAlign,
    field: (rows) => rows.nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'nomenclador',
    required: true,
    label: STRINGS.nomenclator,
    align: STRINGS.TableAlign,
    field: STRINGS.nomenclator.toLocaleLowerCase(),
    sortable: true,
  },
  {
    name: 'detalles',
    required: true,
    label: STRINGS.details,
    align: STRINGS.TableAlign,
    field: STRINGS.details.toLocaleLowerCase(),
    sortable: true,
  },
]

//******* Funciones *******

/**
 * Función encargada de cargar los datos de la tabla
 */
const InitDataTable = async () => {
  isLoading.value = true
  const { data, error } = await fetchData(STRINGS.urlApiExento)

  if (error) {
    console.error(STRINGS.errorFetch, error)
    notify_error(STRINGS.loadingTablesError)
    setTimeout(async () => {
      await InitDataTable()
    }, STRINGS.timeLoadTables);
  } else {
    rows.value = data || []
  }

  isLoading.value = false
  return true
}

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
    // ✅ Emitir el objeto completo hacia el padre
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
