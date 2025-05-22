<template>
  <div class="q-px-md">
    <div class="flex justify-between padding_minimo">
      <div class="text-center bg-green-10 rounded-borders my-cell">
        <p class="text-tittle-table">{{ STRINGS.gestion }} {{ STRINGS.municipioLowercase }}</p>
      </div>

      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el class="text-green-10" label="Inicio" icon="home" />
          <q-breadcrumbs-el class="text-green-10" :label="STRINGS.gestion" icon="folder" />

          <q-breadcrumbs-el :label="STRINGS.municipioLowercase" icon="post_add" />
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
      ref="tableAddMunicipio"
      :rows-per-page-label="STRINGS.record_page"
      :rows="filteredRows"
      :columns="columns"
      :rows-per-page-options="numberForPage"
      :no-data-label="STRINGS.no_data_available"
      row-key="codigo"
      :separator="separator"
      selection="single"
      v-model:selected="selectedRows"
      @update:selected="onSelectedRowsChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'
import api from 'src/axios.js'

var numberForPage = [5, 7, 10, 15, 20, 50, 0]
const isLoading = ref(true)

const columns = [
  { name: 'codigo', align: 'center', label: STRINGS.codigo_mun, field: 'codigo', sortable: true },
  {
    name: 'nombre',
    required: true,
    label: STRINGS.nombre_mun,
    align: 'center',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'Texto_provincia',
    align: 'center',
    label: STRINGS.name_provincia,
    field: 'Texto_provincia',
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
    const responseMun = await api.get(STRINGS.urlApiMunicipio)
    const responseProv = await api.get(STRINGS.urlApiProvincia)

    responseMun.data.forEach((element) => {
      responseProv.data.forEach((item) => {
        if (item['_id'] === element['provincia']) {
          element['Texto_provincia'] = item['nombre']
        }
      })
    })

    rows.value = responseMun.data
  } catch (error) {
    console.error('Error cargando datos:', error)
    notify_error(STRINGS.loadingTablesError)
  } finally {
    isLoading.value = false
  }
}

onBeforeMount(() => {
  InicializarDatosTabla()
})

const rows = ref([])
const separator = ref('vertical')
// Para manejar la fila seleccionada

const selectedRows = ref([])

//Manejador de los botones de la navBottom
var BloquearEdit = ref(true)
var BloquearDelete = ref(true)
var BloquearDetalle = ref(true)

//Provincia a Eliminar
//var ProvinciaDelete = ref('')
//var ProvinciaCodigoDelete = ref('')

// Para emitir eventos
const emit = defineEmits(['seleccionado'])

const onSelectedRowsChange = (newSelected) => {
  if (newSelected.length > 0) {
    emit('seleccionado', newSelected.length > 0 ? newSelected[0] : null)
    emit('onBloquearEdit', (BloquearEdit.value = false))
    emit('onBloquearDelete', (BloquearDelete.value = false))
    emit('onBloquearDetalle', (BloquearDetalle.value = false))
  } else {
    emit('onBloquearEdit', (BloquearEdit.value = true))
    emit('onBloquearDelete', (BloquearDelete.value = true))
    emit('onBloquearDetalle', (BloquearDetalle.value = true))
  }
}

import { computed } from 'vue'
import notify_error from 'src/utils/notify/notify_error.js'

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
      String(row.codigo).toLowerCase().includes(searchTerm) ||
      row.Texto_provincia.toLowerCase().includes(searchTerm)
    )
  })
})

const UpdateTable = async () => {
  InicializarDatosTabla()
}

defineExpose({
  filteredRows,
  UpdateTable,
})
</script>
