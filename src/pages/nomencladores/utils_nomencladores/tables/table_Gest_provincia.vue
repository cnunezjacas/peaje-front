<template>
  <div class="q-px-md">
    <div class="flex justify-between padding_minimo">
      <div class="text-center bg-green-10 rounded-borders my-cell">
        <p class="text-tittle-table">{{ STRINGS.gestion }} {{ STRINGS.provinciaLowercase }}</p>
      </div>

      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el class="text-green-10" label="Inicio" icon="home" />
          <q-breadcrumbs-el class="text-green-10" :label="STRINGS.gestion" icon="folder" />

          <q-breadcrumbs-el :label="STRINGS.provinciaLowercase" icon="post_add" />
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
      class="shadow-6"
      bordered
      table-header-class="bg-green-10 text-white"
      ref="tableAddProvincia"
      :rows-per-page-label="STRINGS.record_page"
      :rows="filteredRows"
      :columns="columns"
      :rows-per-page-options="nomberForPage"
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
import { STRINGS } from '../../../../utils/string.js'
import api from 'src/axios.js'
import { Notify } from 'quasar'

// Datos
const nomberForPage = [5, 7, 10, 15, 20, 50, 0]
//Spinner Carga Datos
const isLoading = ref(true)

const columns = [
  {
    name: 'codigo',
    align: 'center',
    label: STRINGS.codigo_prov,
    field: 'codigo',
    sortable: true,
  },
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre,
    align: 'center',
    field: (rows) => rows.nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: '_id',
    field: '_id',
    label: '_id',
    visible: false, // Esta propiedad oculta la columna en la vista
    hidden: true,
  },
]

import { onBeforeMount } from 'vue'

const InicializarDatosTabla = async () => {
  isLoading.value = true
  try {
    const response = await api.get(STRINGS.urlApiProvincia)
    rows.value = response.data
  } catch (error) {
    console.error('Error cargando datos:', error)
    Notify.create({
      color: 'negative',
      icon: 'error',
      message: STRINGS.loadingTablesError,
      position: 'bottom',
      timeout: 3000,
    })
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(() => {
  InicializarDatosTabla()
})

const rows = ref([])
const separator = ref('vertical')
const selectedRows = ref([])

// Props
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
      String(row.codigo).toLowerCase().includes(searchTerm)
    )
  })
})

// Emite eventos
const emit = defineEmits(['seleccionado'])
//Manejador de los botones de la navBottom
var BloquearEdit = ref(true)
var BloquearDelete = ref(true)
var BloquearDetalle = ref(true)
var BloquearGuardar = ref(true)

//Provincia a Eliminar
var ProvinciaDelete = ref('')
var ProvinciaCodigoDelete = ref('')

// Manejador de selección
const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
    emit('onBloquearEdit', (BloquearEdit.value = false))
    emit('onBloquearDelete', (BloquearDelete.value = false))
    emit('onBloquearDetalle', (BloquearDetalle.value = false))
    emit('onBloquearGuardar', (BloquearGuardar.value = false))
    emit('oNnameProvinciaDelete', (ProvinciaDelete.value = newSelected[0]['nombre']))
    emit('oNcodigoProvinciaDelete', (ProvinciaCodigoDelete.value = newSelected[0]['codigo']))
  } else {
    emit('onBloquearEdit', (BloquearEdit.value = true))
    emit('onBloquearDelete', (BloquearDelete.value = true))
    emit('onBloquearDetalle', (BloquearDetalle.value = true))
    emit('onBloquearGuardar', (BloquearGuardar.value = true))
  }
}

const UpdateTable = async () => {
  const response = await api.get(STRINGS.urlApiProvincia)
  rows.value = response.data
}

// Exponemos `filteredRows` si el padre necesita acceder directamente
defineExpose({
  filteredRows,
  UpdateTable,
})
</script>
