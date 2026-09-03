<template>
  <div class="q-px-md">
    <!-- Breadcrumbs automáticos basados en la ruta -->
    <div class="flex justify-end padding_minimo">
      <div>
        <autoBreadcrumbs :icon="props.icon" />
      </div>
    </div>

    <!-- Spinner de carga mientras se obtienen los datos -->
    <div v-if="props.Loading" class="flex justify-center items-center" style="height: 300px">
      <q-spinner size="50px" color="green" />
    </div>

    <!-- Tabla principal con scroll virtual y selección única -->
    <q-table
      v-else
      :rows="props.filteredRows ?? []"
      :columns="props.columns"
      :rows-per-page-label="props.rowsPerPageLabel"
      :rows-per-page-options="props.rowsPerPageOptions"
      :no-data-label="props.noDataLabel"
      :row-key="props.rowKey"
      :separator="props.separator"
      selection="single"
      :selected-rows-label="customSelectedLabel"
      v-model:selected="selectedRows"
      @update:selected="onSelectedRowsChange"
      class="shadow-2 custom-horizontal-lines my-sticky-virtscroll-table"
      virtual-scroll
      table-header-class="bg-green-10 text-white"
      ref="tableRef"
      flat
      bordered
      :title="props.title"
      dense
    />
  </div>
</template>

<script setup>
/**
 * @module TableGeneric
 * @description Componente genérico reutilizable para mostrar tablas de datos
 * basado en q-table de Quasar. Incluye:
 * - Breadcrumbs automáticos basados en la ruta
 * - Spinner de carga
 * - Selección única de filas con emisión de eventos
 * - Scroll virtual para grandes volúmenes de datos
 * - Encabezado sticky con diseño personalizado
 */

import { ref } from 'vue'
import autoBreadcrumbs from 'viewsManage/breadcrumbs/autoBreadcrumbs.vue'

/**
 * Props del componente
 * @property {string} title - Título mostrado en la parte superior de la tabla
 * @property {boolean} Loading - Indica si se muestra el spinner de carga
 * @property {Array} columns - Definición de columnas de la tabla (formato q-table)
 * @property {string} rowKey - Campo único identificador de cada fila (ej: '_id')
 * @property {string} noDataLabel - Mensaje a mostrar cuando no hay datos
 * @property {Array} rowsPerPageOptions - Opciones de filas por página (ej: [5, 10, 25])
 * @property {string} rowsPerPageLabel - Etiqueta del selector de filas por página
 * @property {string} separator - Tipo de separador de celdas ('horizontal', 'vertical', etc.)
 * @property {boolean} breadcrumbsSlot - Habilita slot personalizado para breadcrumbs
 * @property {string} searchTerm - Término de búsqueda para el filtrado externo
 * @property {string} icon - Icono personalizado para los breadcrumbs
 * @property {Array} filteredRows - Array de filas ya filtradas (responsabilidad del padre)
 */
const props = defineProps({
  title: String,
  Loading: Boolean,
  columns: Array,
  rowKey: String,
  noDataLabel: String,
  rowsPerPageOptions: Array,
  rowsPerPageLabel: String,
  separator: String,
  breadcrumbsSlot: Boolean,
  searchTerm: String,
  icon: String,
  filteredRows: {
    type: Array,
    default: () => [],
  },
})

/**
 * Eventos emitidos al componente padre
 * - seleccionado: envía la fila seleccionada o null
 * - onBlockTabs: indica si deben bloquearse/desbloquearse los tabs de acción
 */
const emit = defineEmits(['seleccionado', 'onBlockTabs'])

/**
 * Refs del componente
 */
const selectedRows = ref([])
const tableRef = ref(null)

/**
 * Estado local para rastrear si los tabs deben estar habilitados
 * true = tabs habilitados (no hay selección)
 * false = tabs bloqueados (hay fila seleccionada)
 */
const EnableItemsTabs = ref(true)

/**
 * Genera el texto personalizado del contador de filas seleccionadas
 * @param {number} count - Número de filas seleccionadas
 * @returns {string} Texto formateado con plurales correctos en español
 */
const customSelectedLabel = (count) => {
  return `${count} fila${count > 1 ? 's' : ''} seleccionada${count > 1 ? 's' : ''}`
}

/**
 * Manejador del evento de cambio de selección en la tabla
 * Emite la fila seleccionada al padre y actualiza el estado de los tabs
 * @param {Array} newSelected - Array con las filas actualmente seleccionadas
 */
const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected[0])
    EnableItemsTabs.value = false
    emit('onBlockTabs', EnableItemsTabs.value)
  } else {
    emit('seleccionado', null)
    EnableItemsTabs.value = true
    emit('onBlockTabs', EnableItemsTabs.value)
  }
}

/**
 * Expone refs y métodos al componente padre
 * - selectedRows: array reactivo de filas seleccionadas
 * - getRows(): función para obtener las filas filtradas actuales
 * - getColumns(): función para obtener la configuración de columnas
 */
defineExpose({
  selectedRows,
  getRows: () => props.filteredRows,
  getColumns: () => props.columns,
})
</script>

<style lang="sass">
/**
 * Estilos personalizados para la tabla con encabezado sticky
 * - Altura fija para habilitar scroll interno
 * - Encabezado con color verde y posición sticky
 * - Z-index adecuado para mantener el encabezado visible al hacer scroll
 */
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 395px

  .q-table__top,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #1b5e20

  thead tr th
    position: sticky
    z-index: 1

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
