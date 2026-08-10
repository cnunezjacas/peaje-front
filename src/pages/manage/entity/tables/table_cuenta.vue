<template>
  <BaseTable :title="title" :Loading="isLoading" :filteredRows="filteredRows" :columns="columns" row-key="_id"
    :no-data-label="STRINGS.no_data_available" :separator="separator" :rows-per-page-options="numberForPage"
    :rows-per-page-label="STRINGS.number_of_page" searchTerm="props.TextSearch" @onBlockTabs="BlockTabs"
    @seleccionado="DataSelected" :fatherBreadcrumbs="imports.capitalizeWords(STRINGS.gestionNomencladores, true)"
    :SonBreadcrumbs="imports.capitalizeWords(STRINGS.cuentaLowercase)" ref="tableGeneric">
  </BaseTable>
</template>

<script setup>
import { ref, computed } from 'vue'
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
const title = ref(STRINGS.gestion + ' ' + STRINGS.cuentaLowercase.toLowerCase())
const { fetchData/*, postdata_mun, putdata_mun, deletedata_mun */ } = useApi()
// Para manejar la fila seleccionada
//const selectedRows = ref([])
// Props
const props = defineProps({
  TextSearch: String,
})

const columns = [
  {
    name: 'titular',
    required: true,
    label: STRINGS.titular_de_la_cuenta,
    align: STRINGS.TableAlign,
    field: 'titular',
    sortable: true,
  },

  {
    name: 'numero',
    align: STRINGS.TableAlign,
    label: STRINGS.cuenta,
    field: 'numero',
    sortable: true,
  },
  {
    name: 'banco',
    align: STRINGS.TableAlign,
    label: STRINGS.bancoCuenta,
    field: 'banco',
    sortable: true,
  },
  {
    name: 'tipo',
    align: STRINGS.TableAlign,
    label: STRINGS.tipoCuenta,
    field: 'tipo',
    sortable: true,
  },
]

import { onBeforeMount } from 'vue'

const InitDataTable = async () => {
  isLoading.value = true

  const { data: cuenta, error: error_cuenta } = await fetchData(STRINGS.urlApiCuenta);

  const result_bank = await imports.loadbank();
  const result_tipo_cuenta = await imports.loadAccountType();


  if (error_cuenta) {
    console.error(STRINGS.errorFetch, { error_cuenta })
    notify_error(STRINGS.loadingTablesError)
    return false;
  } else {


    cuenta.forEach((element) => {
      result_bank.forEach((item) => {
        if (item['id'] == element['banco']) {
          element['banco'] = item['codigo']
          element['idbanco'] = item['id']
        }
      })
    })

    cuenta.forEach((element) => {
      result_tipo_cuenta.forEach((item) => {
        if (item['id'] == element['tipo']) {
          element['tipo'] = item['codigo']
          element['idtipo'] = item['id']
        }
      })
    })

    rows.value = cuenta || []
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
      row.titular.toLowerCase().includes(searchTerm) ||
      String(row.numero).toLowerCase().includes(searchTerm) ||
      row.banco.toLowerCase().includes(searchTerm) || row.tipo.toLowerCase().includes(searchTerm)
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
  InitDataTable();
})

//Exponer Funciones y Métodos a Template Padre
defineExpose({
  EmptySelected,
  UpdateTable,
})
</script>
