<template>
  <div class="q-px-md">
    <div class="flex justify-between padding_minimo">
      <div class="text-center bg-green-10 rounded-borders my-cell">
        <p class="text-tittle-table">{{ props.title }}</p>
      </div>
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el class="text-green-10" label="Inicio" to="/" icon="home" />
          <q-breadcrumbs-el class="text-green-10" :label="props.fatherBreadcrumbs" icon="folder" />
          <q-breadcrumbs-el :label="props.SonBreadcrumbs" icon="post_add" />
        </q-breadcrumbs>
      </div>
    </div>

    <!-- Spinner de carga -->
    <div v-if="props.Loading" class="flex justify-center items-center" style="height: 300px">
      <q-spinner size="50px" color="green" />
    </div>

    <!-- Tabla -->
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
      v-model:selected="selectedRows"
      @update:selected="onSelectedRowsChange"
      class="shadow-2 custom-horizontal-lines"
      table-header-class="bg-green-10 text-white"
      ref="tableRef"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
  fatherBreadcrumbs: String,
  SonBreadcrumbs: String,
  filteredRows: {
    type: Array,
    default: () => [],
  },
})

const selectedRows = ref([])
const tableRef = ref(null)

const emit = defineEmits(['seleccionado', 'onEnable'])
const EnableItemsTabs = ref(true)
// Manejador de selección
const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
    emit('onEnable', (EnableItemsTabs.value = false))
  } else {
    emit('onEnable', (EnableItemsTabs.value = true))
  }
}

//Exponer Funciones y Métodos a Template Padre
defineExpose({
  selectedRows,
})
</script>
