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
    :SonBreadcrumbs="imports.capitalizeWords(STRINGS.estacionesLowercase)"
    icon="location_city"
    ref="tableGeneric"
  >
  </BaseTable>
</template>

<script setup>
/**
 * @module TableEstacion
 * @description Componente de tabla para gestionar estaciones de peaje
 * Muestra listado con datos populados: provincia, municipio y cuentas bancarias (CUC/CUP)
 * Soporta búsqueda, selección de filas y lazy loading desde componente padre
 */
import { ref, onBeforeMount, computed } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'composables/useApi.js'
import imports from 'src/utils/imports.js'
import BaseTable from 'src/components/shared/table/TableGeneric.vue'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES Y COMPOSABLES ===== */
/* =================================================== */
const { notify_error } = useNotify()
const { fetchData } = useApi()

/* =================================================== */
/*  ===== CONFIGURACIÓN DE LA TABLA ===== */
/* =================================================== */
const numberForPage = imports.getNumberForPage()
const rows = ref([])
const tableGeneric = ref(null)
const isLoading = ref(true)
const separator = ref('vertical')
const title = ref(STRINGS.estacionesLowercase.toLowerCase())

// Props
const props = defineProps({
  TextSearch: String,
})

/**
 * Definición de columnas de la tabla
 * Usa funciones para acceder a propiedades anidadas de datos populados
 */
const columns = [
  {
    name: 'codigo',
    align: STRINGS.TableAlign,
    label: STRINGS.code,
    field: (row) => row.codigo,
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,
    label: STRINGS.name,
    align: STRINGS.TableAlign,
    field: (row) => row.nombre,
    format: (val) => `${val}`,
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
    name: 'municipio',
    align: STRINGS.TableAlign,
    label: STRINGS.name_municipio,
    field: (row) => row.municipio?.nombre || '',
    sortable: true,
  },
  /* {
    name: 'direccion',
    align: STRINGS.TableAlign,
    label: STRINGS.direccion_estacion,
    field: 'direccion',
    sortable: true,
  }, */ {
    name: 'nit',
    align: STRINGS.TableAlign,
    label: 'Nit',
    field: (row) => row?.nit || '',
    sortable: true,
  },
  {
    name: 'cuentaCup',
    align: STRINGS.TableAlign,
    label: imports.capitalizeWords(STRINGS.cuentaLowercase) + ' ' + STRINGS.CUP,
    field: (row) => row.cuentaCup?.numero || '',
    sortable: true,
  },
  {
    name: 'cuentaCuc',
    align: STRINGS.TableAlign,
    label: imports.capitalizeWords(STRINGS.cuentaLowercase) + ' ' + STRINGS.CUC,
    field: (row) => row.cuentaCuc?.numero || '',
    sortable: true,
  },
]

/* =================================================== */
/*  ===== FUNCIONES DE CARGA DE DATOS ===== */
/* =================================================== */

/**
 * Carga los datos de estaciones desde la API
 * El backend ya retorna los datos con populate de provincia, municipio y cuentas
 * Reintenta automáticamente en caso de error
 * @async
 * @returns {Promise<boolean>} true si la carga fue exitosa
 */

const InitDataTable = async () => {
  isLoading.value = true

  const { data: estacion, error: error_estacion } = await fetchData(STRINGS.urlApiEstacion)

  if (!estacion && error_estacion) {
    console.error('Error cargando datos:', error_estacion)
    notify_error(STRINGS.loadingTablesError)
    setTimeout(async () => {
      await InitDataTable()
    }, STRINGS.timeLoadTables)
  } else {
    rows.value = estacion || []
  }

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
 * Filtra las filas según el término de búsqueda
 * Busca en: nombre, código, provincia, municipio, NIT y números de cuenta
 * @returns {Array} filas filtradas
 */
const filteredRows = computed(() => {
  if (!props.TextSearch) {
    return rows.value
  }
  const searchTerm = props.TextSearch.toLowerCase()
  return rows.value.filter((row) => {
    return (
      row.nombre.toLowerCase().includes(searchTerm) ||
      String(row.codigo).includes(searchTerm) ||
      String(row.provincia?.nombre).toLowerCase().includes(searchTerm) ||
      String(row.municipio?.nombre).toLowerCase().includes(searchTerm) ||
      String(row.cuentaCuc?.numero).includes(searchTerm) ||
      String(row.cuentaCup?.numero).includes(searchTerm) ||
      String(row.nit).includes(searchTerm)
    )
  })
})

const emit = defineEmits(['onBlockTabs'])

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
 * Limpia la selección actual antes de recargar
 * @async
 * @returns {Promise<boolean>} resultado de InitDataTable
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

/* =================================================== */
/*  ===== CICLO DE VIDA ===== */
/* =================================================== */

onBeforeMount(() => {
  InitDataTable()
})

/* =================================================== */
/*  ===== EXPOSICIÓN DE MÉTODOS ===== */
/* =================================================== */

defineExpose({
  UpdateTable,
  EmptySelected,
  init,
})
</script>
