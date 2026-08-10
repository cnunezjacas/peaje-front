<template>
  <BaseTable :title="title" :Loading="isLoading" :filteredRows="filteredRows" :columns="columns" row-key="_id"
    :no-data-label="STRINGS.no_data_available" :separator="separator" :rows-per-page-options="numberForPage"
    :rows-per-page-label="STRINGS.number_of_page" searchTerm="props.TextSearch" @onBlockTabs="BlockTabs"
    @seleccionado="DataSelected" :fatherBreadcrumbs="imports.capitalizeWords(STRINGS.gestionNomencladores, true)"
    :SonBreadcrumbs="imports.capitalizeWords(STRINGS.cuentaLowercase)" ref="tableGeneric">
  </BaseTable>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'composables/useApi.js'
import imports from 'src/utils/imports.js'
import BaseTable from 'TableManage/tableGeneric.vue'
import { useNotify } from 'src/utils/notify/notify.js'


/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { /*notify_success, notify_warning,*/ notify_error } = useNotify()


// Datos
const numberForPage = imports.getNumberForPage()
const rows = ref([])
const tableGeneric = ref([])
const isLoading = ref(true)
const separator = ref('vertical')
const title = ref(STRINGS.gestion + ' ' + STRINGS.estacionesLowercase.toLowerCase())
const { fetchData/*, postdata_mun, putdata_mun, deletedata_mun */ } = useApi()

// Props
const props = defineProps({
  TextSearch: String,
})

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
    field: (row) => row.nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'provincia',
    align: STRINGS.TableAlign,
    label: STRINGS.name_provincia,
    field: 'provincia',
    sortable: true,
  },
  {
    name: 'municipio',
    align: STRINGS.TableAlign,
    label: STRINGS.name_municipio,
    field: 'municipio',
    sortable: true,
  },
  /* {
    name: 'direccion',
    align: STRINGS.TableAlign,
    label: STRINGS.direccion_estacion,
    field: 'direccion',
    sortable: true,
  }, */ /* {
    name: 'nit',
    align: STRINGS.TableAlign,
    label: 'Nit',
    field: 'nit',
    sortable: true,
  }, */
  {
    name: 'cuentaCup',
    align: STRINGS.TableAlign,
    label: imports.capitalizeWords(STRINGS.cuentaLowercase) + " " + STRINGS.CUP,
    field: 'cuentaCup',
    sortable: true,
  }, {
    name: 'cuentaCuc',
    align: STRINGS.TableAlign,
    label: imports.capitalizeWords(STRINGS.cuentaLowercase) + " " + STRINGS.CUC,
    field: 'cuentaCuc',
    sortable: true,
  }
]



const InitDataTable = async () => {
  isLoading.value = true


  const { data: estacion, error: error_estacion } = await fetchData(STRINGS.urlApiEstacion)

  const { data: provincia, error: error_prov } = await fetchData(STRINGS.urlApiProvincia);

  const { data: municipio, error: error_mun } = await fetchData(STRINGS.urlApiMunicipio);

  const { data: cuenta, error: error_cuenta } = await fetchData(STRINGS.urlApiCuenta);


  if (error_estacion || error_prov || error_mun || error_cuenta) {
    console.error('Error cargando datos:', error_estacion)
    notify_error(STRINGS.loadingTablesError)
    setTimeout(async () => {
      await InitDataTable()
    }, STRINGS.timeLoadTables);
  } else {

    estacion.forEach((element) => {
      provincia.forEach((item) => {
        if (item['_id'] === element['provincia']) {
          element['provincia'] = item['nombre']
          element['id_provincia'] = item['_id']
        }
      })
    })

    estacion.forEach((element) => {
      municipio.forEach((item) => {
        if (item['_id'] === element['municipio']) {
          element['municipio'] = item['nombre']
          element['id_municipio'] = item['_id']
        }
      })
    })

    estacion.forEach((element) => {
      cuenta.forEach((item) => {
        if (item['_id'] === element['cuentaCup']) {
          element['cuentaCup'] = item['numero']
        }
      })
    })

    estacion.forEach((element) => {
      cuenta.forEach((item) => {
        if (item['_id'] === element['cuentaCuc']) {
          element['cuentaCuc'] = item['numero']
        }
      })
    })


    rows.value = estacion || []
  }

  isLoading.value = false
  return true
}

onBeforeMount(() => {
  InitDataTable()
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
      ||
      String(row.provincia).toLowerCase().includes(searchTerm) ||
      String(row.municipio).toLowerCase().includes(searchTerm)
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

const UpdateTable = async () => {
  InitDataTable()
  tableGeneric.value.selectedRows.value = []
}

/**
 * Función encargada de limpiar los datos capturados en la selección
 */
const EmptySelected = () => {
  tableGeneric.value.selectedRows = []
}

// Exponemos `filteredRows` si el padre necesita acceder directamente
defineExpose({
  // filteredRows,
  UpdateTable, EmptySelected
})
</script>
