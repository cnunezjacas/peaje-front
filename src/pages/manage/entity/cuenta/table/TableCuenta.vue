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
    :fatherBreadcrumbs="imports.capitalizeWords(STRINGS.gestionEntidad, true)"
    :SonBreadcrumbs="imports.capitalizeWords(STRINGS.cuentaLowercase)"
    icon="bi-person-lines-fill"
    ref="tableGeneric"
  >
  </BaseTable>
</template>

<script setup>
/**
 * @module TableCuenta
 * @description Componente de tabla para gestionar cuentas bancarias
 * Muestra listado con datos populados: banco y tipo de cuenta
 * Soporta búsqueda, selección de filas y lazy loading desde componente padre
 */

import { ref, computed, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'composables/useApi.js'
import imports from 'src/utils/imports.js'
import BaseTable from 'TableManage/tableGeneric.vue'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES Y COMPOSABLES ===== */
/* =================================================== */
const { notify_error } = useNotify()
const { fetchData } = useApi()

/**
 * Props del componente
 * @property {string} TextSearch - Término de búsqueda para filtrar filas
 */
const props = defineProps({
  TextSearch: String,
})

/**
 * Eventos emitidos al componente padre
 * - onBlockTabs: habilita/deshabilita tabs de acciones
 * - onSelected: envía la fila seleccionada o null
 */
const emit = defineEmits(['onBlockTabs', 'onSelected'])

/* =================================================== */
/*  ===== VARIABLES REACTIVAS ===== */
/* =================================================== */
const numberForPage = imports.getNumberForPage()
const rows = ref([])
const tableGeneric = ref(null) // ✅ CORREGIDO: era ref([]), debe ser null
const isLoading = ref(true)
const separator = ref('vertical')
const title = ref(STRINGS.cuentaLowercase.toLowerCase())

/**
 * Configuración de columnas de la tabla
 * Usa funciones para acceder a propiedades anidadas de datos populados
 * Campos: titular, número, banco (código) y tipo de cuenta (código)
 */
const columns = [
  {
    name: 'titular',
    required: true,
    label: STRINGS.titular,
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

/* =================================================== */
/*  ===== FUNCIONES DE CARGA DE DATOS ===== */
/* =================================================== */

/**
 * Carga los datos de cuentas desde la API
 * El backend ya retorna los datos con populate de banco y tipo
 * En caso de error, notifica al usuario pero no reintenta automáticamente
 * @async
 * @returns {Promise<boolean>} true si la carga fue exitosa, false si hubo error
 */
const InitDataTable = async () => {
  isLoading.value = true

  const { data: cuenta, error: error_cuenta } = await fetchData(STRINGS.urlApiCuenta)

  if (error_cuenta) {
    console.error(STRINGS.errorFetch, { error_cuenta })
    notify_error(STRINGS.loadingTablesError)
    isLoading.value = false
    return false
  }

  rows.value = cuenta || []
  isLoading.value = false
  return true
}

/**
 * Método público para inicializar la carga de datos (lazy loading)
 * Debe ser llamado explícitamente por el componente padre cuando el tab esté activo
 * @async
 * @returns {Promise<boolean>} true si la carga fue exitosa
 */
const init = async () => {
  return await InitDataTable()
}

/* =================================================== */
/*  ===== BÚSQUEDA Y FILTRADO ===== */
/* =================================================== */

/**
 * Filtra las filas según el término de búsqueda (computed reactivo)
 * Busca en: titular, número, código de banco y código de tipo de cuenta
 * @returns {Array} filas filtradas que coinciden con el término de búsqueda
 */
const filteredRows = computed(() => {
  if (!props.TextSearch) {
    return rows.value
  }
  const searchTerm = props.TextSearch.toLowerCase()
  return rows.value.filter((row) => {
    return (
      row.titular?.toLowerCase().includes(searchTerm) ||
      String(row.numero).toLowerCase().includes(searchTerm) ||
      row.banco?.codigo?.toLowerCase().includes(searchTerm) ||
      row.tipo?.codigo?.toLowerCase().includes(searchTerm)
    )
  })
})

/* =================================================== */
/*  ===== EVENTOS Y SELECCIÓN ===== */
/* =================================================== */

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
  if (row && row._id) {
    emit('onSelected', row)
  } else {
    emit('onSelected', null)
  }
}

/**
 * Actualiza los datos de la tabla recargando desde la API
 * Limpia la selección actual y bloquea tabs antes de recargar
 * @async
 * @returns {Promise<boolean>} resultado de InitDataTable
 */
const UpdateTable = async () => {
  if (tableGeneric.value) {
    tableGeneric.value.selectedRows = []
  }
  BlockTabs(true)
  return await InitDataTable()
}

/**
 * Limpia la selección de filas en la tabla sin recargar datos
 */
const EmptySelected = () => {
  if (tableGeneric.value) {
    tableGeneric.value.selectedRows = []
  }
}

/* =================================================== */
/*  ===== CICLO DE VIDA ===== */
/* =================================================== */

/**
 * Hook del ciclo de vida: carga los datos al montar el componente
 * Nota: Considerar eliminar si se usa lazy loading desde el padre
 */
onBeforeMount(() => {
  InitDataTable()
})

/* =================================================== */
/*  ===== EXPOSICIÓN DE MÉTODOS ===== */
/* =================================================== */

/**
 * Expone métodos y datos al componente padre
 * - UpdateTable: recarga datos de la tabla
 * - EmptySelected: limpia la selección
 * - init: método para lazy loading
 */
defineExpose({
  EmptySelected,
  UpdateTable,
  init,
})
</script>
