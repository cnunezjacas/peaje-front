<template>
  <div class="q-px-md">
    <div class="flex justify-end padding_minimo">
      <div>
        <autoBreadcrumbs />
      </div>
    </div>

    <!-- Spinner de carga -->
    <div v-if="props.Loading" class="flex justify-center items-center" style="height: 300px">
      <q-spinner size="50px" color="green" />
    </div>

    <!-- Tabla -->
    <q-table v-else :rows="props.filteredRows ?? []" :columns="props.columns"
      :rows-per-page-label="props.rowsPerPageLabel" :rows-per-page-options="props.rowsPerPageOptions"
      :no-data-label="props.noDataLabel" :row-key="props.rowKey" :separator="props.separator" selection="single"
      :selected-rows-label="customSelectedLabel" v-model:selected="selectedRows" @update:selected="onSelectedRowsChange"
      class="shadow-2 custom-horizontal-lines my-sticky-virtscroll-table" virtual-scroll
      table-header-class="bg-green-10 text-white" ref="tableRef" flat bordered :title="props.title" dense />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import autoBreadcrumbs from 'viewsManage/breadcrumbs/autoBreadcrumbs.vue'

// Props para personalizar
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
  filteredRows: {
    type: Array,
    default: () => [],
  },
})

const selectedRows = ref([])
const tableRef = ref(null)

const customSelectedLabel = (count) => {
  return `${count} fila${count > 1 ? 's' : ''} seleccionada${count > 1 ? 's' : ''}`
}

const emit = defineEmits(['seleccionado', 'onBlockTabs'])
const EnableItemsTabs = ref(true)
// Manejador de selección
const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
    emit('onBlockTabs', (EnableItemsTabs.value = false))
  } else {
    emit('onBlockTabs', (EnableItemsTabs.value = true))
  }
}

//Exponer Funciones y Métodos a Template Padre
defineExpose({
  selectedRows,
  // 🔥 AGREGA ESTO:
  getRows: () => props.filteredRows,  // Acceso a datos filtrados
  getColumns: () => props.columns,    // Acceso a columnas
})
</script>

<style lang="sass">
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
