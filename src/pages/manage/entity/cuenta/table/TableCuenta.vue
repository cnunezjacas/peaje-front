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
    :fatherBreadcrumbs="imports.capitalizeWords(STRINGS.gestionNomencladores, true)"
    :SonBreadcrumbs="imports.capitalizeWords(STRINGS.cuentaLowercase)"
    ref="tableGeneric"
  >
  </BaseTable>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'composables/useApi.js'
import imports from 'src/utils/imports.js'
import BaseTable from 'TableManage/tableGeneric.vue'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { notify_error } = useNotify()

// Datos
const numberForPage = imports.getNumberForPage()
const rows = ref([])
const tableGeneric = ref([])
const isLoading = ref(true)
const separator = ref('vertical')
const title = ref(STRINGS.cuentaLowercase.toLowerCase())
const { fetchData /*, postdata_mun, putdata_mun, deletedata_mun */ } = useApi()

// Para manejar la fila seleccionada
// Props
const props = defineProps({
  TextSearch: String,
})

/**
 * Configuración de columnas de la tabla
 * Usa funciones para acceder a propiedades anidadas de forma segura
 */
const columns = [
  {
    name: 'titular',
    required: true,
    label: STRINGS.titular_de_la_cuenta,
    align: STRINGS.TableAlign,
    field: (row) => row.titular || '',
    sortable: true,
  },

  {
    name: 'numero',
    align: STRINGS.TableAlign,
    label: STRINGS.cuenta,
    field: (row) => row.numero || '',
    sortable: true,
  },
  {
    name: 'banco',
    align: STRINGS.TableAlign,
    label: STRINGS.bancoCuenta,
    field: (row) => row.banco?.codigo || '',
    sortable: true,
  },
  {
    name: 'tipo',
    align: STRINGS.TableAlign,
    label: STRINGS.tipoCuenta,
    field: (row) => row.tipo?.codigo || '',
    sortable: true,
  },
]

/**
 * Carga los datos de cuentas desde la API
 * La API ya retorna los datos con populate de banco y tipo
 * @returns {Promise<boolean>} true si la carga fue exitosa
 */
const InitDataTable = async () => {
  isLoading.value = true

  const { data: cuenta, error: error_cuenta } = await fetchData(STRINGS.urlApiCuenta)

  if (error_cuenta) {
    console.error(STRINGS.errorFetch, { error_cuenta })
    notify_error(STRINGS.loadingTablesError)
    return false
  }

  rows.value = cuenta || []
  isLoading.value = false
  return true
}

/**
 * Inicializa la carga de datos de la tabla
 * Debe ser llamado explícitamente por el componente padre para lazy loading
 * @returns {Promise<boolean>} true si la carga fue exitosa
 */
const init = async () => {
  return await InitDataTable()
}

/**
 * Filtra las filas según el término de búsqueda
 * Busca en: titular, número, código de banco y código de tipo de cuenta
 */
const filteredRows = computed(() => {
  if (!props.TextSearch) {
    return rows.value
  }
  const searchTerm = props.TextSearch.toLowerCase()
  return rows.value.filter((row) => {
    return (
      row.titular?.toLowerCase().includes(searchTerm) ||
      String(row.numero).includes(searchTerm) ||
      row.banco?.codigo?.toLowerCase().includes(searchTerm) ||
      row.tipo?.codigo?.toLowerCase().includes(searchTerm)
    )
  })
})

const emit = defineEmits(['onBlockTabs'])

/**
 * Emite evento para habilitar/deshabilitar tabs de acciones
 * @param {boolean} value - true para bloquear, false para desbloquear
 */
const BlockTabs = (value) => {
  emit('onBlockTabs', value)
}

/**
 * Emite la fila seleccionada al componente padre
 * @param {Object|null} row - Fila seleccionada o null si se deseleccionó
 */
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
 * Actualiza los datos de la tabla recargando desde la API
 * Limpia la selección actual antes de recargar
 * @returns {Promise<boolean>} true si la actualización fue exitosa
 */
const UpdateTable = async () => {
  tableGeneric.value.selectedRows = []
  BlockTabs(true)
  return await InitDataTable()
}

/**
 * Limpia la selección de filas en la tabla
 */
const EmptySelected = () => {
  tableGeneric.value.selectedRows = []
}

/**
 *  encargado de realizar operaciones, previo de que el componente sea montado en el DOM
 */
onBeforeMount(() => {
  InitDataTable()
})

//Exponer Funciones y Métodos a Template Padre
defineExpose({
  EmptySelected,
  UpdateTable,
  init,
})
</script>
