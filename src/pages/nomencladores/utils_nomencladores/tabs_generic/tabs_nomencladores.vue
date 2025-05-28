<template>
  <div class="q-pb-sm">
    <q-toolbar class="bg-green-10 text-white shadow-2">
      <q-tabs v-model="tab" shrink bordered>
        <q-tab name="tab1" icon="note_add" class="small-font" @click="onItemClick('Add')"
          >Adicionar</q-tab
        >
        <q-tab name="tab2" icon="edit" :class="disabledEdit" @click="onItemClick('Edit')"
          >Modificar</q-tab
        >
        <q-tab name="tab3" icon="delete" :class="disabledDelete" @click="onItemClick('Delete')"
          >Eliminar</q-tab
        >
        <q-tab name="tab6" icon="picture_as_pdf" class="small-font" @click="onItemClick('Export')"
          >Exportar</q-tab
        >
        <q-tab
          name="tab7"
          icon="receipt_long"
          :class="disabledDetalle"
          @click="onItemClick('Details')"
          >Detalle</q-tab
        >
      </q-tabs>

      <q-space></q-space>

      <!-- Input de busqueda -->
      <div class="q-mx-auto">
        <q-input
          color="white"
          input-class="text-white"
          v-model="TextSearch"
          label-color="white"
          :label="STRINGS.search"
          style="max-width: 200px"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="white" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="TextSearch"
              name="cleaning_services"
              class="cursor-pointer"
              @click="resetSearch"
              color="white"
            />
          </template>
        </q-input>
      </div>
      <!-- Input de busqueda -->
    </q-toolbar>
  </div>

  <!-- Dialogo Add Provincia-->
  <DialogoAddProvincia ref="dialogoAddProvincia" @ActualizarTablaProvincia="ActualizadorTabla" />

  <!-- Dialogo Add Municipio-->
  <DialogoAddMunicipio ref="dialogoAddMunicipio" @ActualizarTablaMunicipio="ActualizadorTabla" />

  <!-- Dialogo Add Organismo-->
  <DialogoAddOrganismo ref="dialogoAddOrganismo" @ActualizarTablaOrganismo="ActualizadorTabla" />

  <!-- Dialogo Add Organismo-->
  <DialogoAddBanco ref="dialogoAddBanco" @ActualizarTablaBanco="ActualizadorTabla" />

  <!-- Dialogo Add Organismo-->
  <DialogoAddMoneda ref="dialogoAddMoneda" @ActualizarTablaMoneda="ActualizadorTabla" />

  <!-- Dialogo Add Organismo-->
  <DialogoAddVehiculo ref="dialogoAddVehiculo" @ActualizarTablaVehiculo="ActualizadorTabla" />

  <!-- Dialogo Add Organismo-->
  <DialogoAddExento ref="dialogoAddExento" @ActualizarTablaExento="ActualizadorTabla" />

  <!-- Dialogo Add Organismo-->
  <DialogoAddComprobante
    ref="dialogoAddComprobante"
    @ActualizarTablaComprobante="ActualizadorTabla"
  />

  <!-- Dialogo Edit Provincia -->
  <DialogEditProvincia ref="dialogoEditProvincia" @ActualizarTablaProvincia="ActualizadorTabla" />

  <!-- Dialogo Edit Municipio -->
  <DialogEditMunicipio ref="dialogoEditMunicipio" @ActualizarTablaMunicipio="ActualizadorTabla" />

  <!-- Dialogo Edit Municipio -->
  <DialogEditOrganismo ref="dialogEditOrganismo" @ActualizarTablaOrganismo="ActualizadorTabla" />

  <!-- Dialogo Edit Municipio -->
  <DialogEditBanco ref="dialogEditBanco" @ActualizarTablaBanco="ActualizadorTabla" />

  <!-- Dialogo Edit Municipio -->
  <DialogEditMoneda ref="dialogEditMoneda" @ActualizarTablaMoneda="ActualizadorTabla" />

  <!-- Dialogo Edit Municipio -->
  <DialogEditVehiculo ref="dialogEditVehiculo" @ActualizarTablaVehiculo="ActualizadorTabla" />

  <!-- Dialogo Edit Municipio -->
  <DialogEditExento ref="dialogEditExento" @ActualizarTablaExento="ActualizadorTabla" />

  <!-- Dialogo Delete Provincia-->
  <DialogDeleteProvincia
    ref="dialogoDeleteProvincia"
    @ActualizarTablaProvincia="ActualizadorTabla"
  />

  <!-- Dialogo Delete Municipio-->
  <DialogDeleteMunicipio
    ref="dialogoDeleteMunicipio"
    @ActualizarTablaMunicipio="ActualizadorTabla"
  />

  <!-- Dialogo Delete Municipio-->
  <DialogDeleteOrganismo
    ref="dialogDeleteOrganismo"
    @ActualizarTablaOrganismo="ActualizadorTabla"
  />

  <!-- Dialogo Delete Municipio-->
  <DialogDeleteBanco ref="dialogDeleteBanco" @ActualizarTablaBanco="ActualizadorTabla" />

  <!-- Dialogo Delete Municipio-->
  <DialogDeleteMoneda ref="dialogDeleteMoneda" @ActualizarTablaMoneda="ActualizadorTabla" />

  <!-- Dialogo Delete Municipio-->
  <DialogDeleteVehiculo ref="dialogDeleteVehiculo" @ActualizarTablaVehiculo="ActualizadorTabla" />

  <!-- Dialogo Delete Municipio-->
  <DialogDeleteExento ref="dialogDeleteExento" @ActualizarTablaExento="ActualizadorTabla" />

  <!-- Tabla de Provincias -->
  <table_Gest_provincia
    ref="tableProvincia"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    :style="StyleFocusP"
    :TextSearch="TextSearch"
    :rows="rows"
  ></table_Gest_provincia>

  <!-- Tabla de Municipio -->
  <table_Gest_municipio
    ref="tableMunicipio"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    @oNMunicipioDeleteGestMunicipio="ProcesoDeleteMunicipio"
    :style="StyleFocusM"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Organismo -->
  <table_Gest_organismo
    ref="tableOrganismo"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    :style="StyleFocusO"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Banco -->
  <table_Gest_banco
    ref="tableBanco"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    :style="StyleFocusB"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Monedas -->
  <table_Gest_monedas
    ref="tableMonedas"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    :style="StyleFocusMO"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Vehiculos -->
  <table_Gest_vehiculos
    ref="tableVehiculo"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    :style="StyleFocusV"
    :TextSearch="TextSearch"
  />

  <table_Gest_exento
    ref="tableExento"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    :style="StyleFocusE"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Comprobante -->
  <table_Gest_comprobante ref="tableComprobante" :style="StyleFocusC" />
</template>

<script setup>
import { ref } from 'vue'
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import {
  STRINGS,
  DialogoAddProvincia,
  DialogoAddMunicipio,
  DialogoAddOrganismo,
  DialogoAddBanco,
  DialogoAddMoneda,
  DialogoAddVehiculo,
  DialogoAddExento,
  DialogoAddComprobante,
  DialogEditProvincia,
  DialogEditMunicipio,
  DialogEditOrganismo,
  DialogEditBanco,
  DialogEditMoneda,
  DialogEditVehiculo,
  DialogEditExento,
  DialogDeleteProvincia,
  DialogDeleteMunicipio,
  DialogDeleteOrganismo,
  DialogDeleteBanco,
  DialogDeleteMoneda,
  DialogDeleteVehiculo,
  DialogDeleteExento,
  table_Gest_provincia,
  table_Gest_municipio,
  table_Gest_organismo,
  table_Gest_banco,
  table_Gest_comprobante,
  table_Gest_monedas,
  table_Gest_vehiculos,
  table_Gest_exento,
  notify_error,
} from 'utils/import_files.js'
import imports from 'utils/imports.js'

const tab = ref('')
const TextSearch = ref('')

const StyleFocusP = ref('display: none')
const StyleFocusM = ref('display: none')
const StyleFocusO = ref('display: none')
const StyleFocusB = ref('display: none')
const StyleFocusMO = ref('display: none')
const StyleFocusC = ref('display: none')
const StyleFocusV = ref('display: none')
const StyleFocusE = ref('display: none')

const routeStylesMap = {
  [STRINGS.provinciaLowercase]: {
    provincia: true,
    municipio: false,
    organismo: false,
    banco: false,
    comprobante: false,
    monedas: false,
    vehiculos: false,
    exento: false,
  },
  [STRINGS.municipioLowercase]: {
    provincia: false,
    municipio: true,
    organismo: false,
    banco: false,
    comprobante: false,
    monedas: false,
    vehiculos: false,
    exento: false,
  },
  [STRINGS.organismoLowercase]: {
    provincia: false,
    municipio: false,
    organismo: true,
    banco: false,
    comprobante: false,
    monedas: false,
    vehiculos: false,
    exento: false,
  },
  [STRINGS.bancoLowercase]: {
    provincia: false,
    municipio: false,
    organismo: false,
    banco: true,
    comprobante: false,
    monedas: false,
    vehiculos: false,
    exento: false,
  },
  [STRINGS.comprobanteLowercase]: {
    provincia: false,
    municipio: false,
    organismo: false,
    banco: false,
    comprobante: true,
    monedas: false,
    vehiculos: false,
    exento: false,
  },
  [STRINGS.monedasLowercase]: {
    provincia: false,
    municipio: false,
    organismo: false,
    banco: false,
    comprobante: false,
    monedas: true,
    vehiculos: false,
    exento: false,
  },
  [STRINGS.vehiculosLowercase]: {
    provincia: false,
    municipio: false,
    organismo: false,
    banco: false,
    comprobante: false,
    monedas: false,
    vehiculos: true,
    exento: false,
  },
  [STRINGS.exentoLowercase]: {
    provincia: false,
    municipio: false,
    organismo: false,
    banco: false,
    comprobante: false,
    monedas: false,
    vehiculos: false,
    exento: true,
  },
}

//Constantes referencias de los dialogos Provincia
const dialogoAddProvincia = ref(null)
const dialogoEditProvincia = ref(null)
const dialogoDeleteProvincia = ref(null)

//Constantes referencias de los dialogos Municipio
const dialogoAddMunicipio = ref(null)
const dialogoEditMunicipio = ref(null)
const dialogoDeleteMunicipio = ref(null)

//Constantes referencias de los dialogos Organismo
const dialogoAddOrganismo = ref(null)
const dialogEditOrganismo = ref(null)
const dialogDeleteOrganismo = ref(null)

//Constantes referencias de los dialogos Banco
const dialogoAddBanco = ref(null)
const dialogEditBanco = ref(null)
const dialogDeleteBanco = ref(null)

//Constantes referencias de los dialogos Moneda
const dialogoAddMoneda = ref(null)
const dialogEditMoneda = ref(null)
const dialogDeleteMoneda = ref(null)

//Constantes referencias de los dialogos Vehiculos
const dialogoAddVehiculo = ref(null)
const dialogEditVehiculo = ref(null)
const dialogDeleteVehiculo = ref(null)

//Constantes referencias de los dialogos Exento
const dialogoAddExento = ref(null)
const dialogEditExento = ref(null)
const dialogDeleteExento = ref(null)

//Constantes referencias de las tablas de Nomencladores
const tableProvincia = ref(null)
const tableMunicipio = ref(null)
const tableOrganismo = ref(null)
const tableBanco = ref(null)
const tableMonedas = ref(null)
const tableComprobante = ref(null)
const tableVehiculo = ref(null)
const tableExento = ref(null)

//ARRAY GLOBAL QUE SELECCIONA TODO
var arraySelected = ref([])

//Variables a evaluar clases de tabsBotton
const disabledEdit = ref('small-font disabled')
const disabledDelete = ref('small-font disabled')
const disabledDetalle = ref('small-font disabled')

const ActualizadorTabla = (value) => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
    if (value) tableProvincia.value.UpdateTable()
    else ErrorUpdateTable()
  } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
    if (value) tableMunicipio.value.UpdateTable()
    else ErrorUpdateTable()
  } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
    if (value) tableOrganismo.value.UpdateTable()
    else ErrorUpdateTable()
  } else if (nuevaRuta.includes(STRINGS.bancoLowercase)) {
    if (value) tableBanco.value.UpdateTable()
    else ErrorUpdateTable()
  } else if (nuevaRuta.includes(STRINGS.monedasLowercase)) {
    if (value) tableMonedas.value.UpdateTable()
    else ErrorUpdateTable()
  } else if (nuevaRuta.includes(STRINGS.vehiculosLowercase)) {
    if (value) tableVehiculo.value.UpdateTable()
    else ErrorUpdateTable()
  } else if (nuevaRuta.includes(STRINGS.exentoLowercase)) {
    if (value) tableExento.value.UpdateTable()
    else ErrorUpdateTable()
  } else {
    ErrorUpdateTable()
  }
}

const ErrorUpdateTable = () => {
  notify_error(STRINGS.errorUpdate)
}

const BloquearEdit = (variable) => {
  if (variable) {
    disabledEdit.value = 'small-font disabled'
  } else {
    disabledEdit.value = 'small-font'
  }
}

const BloquearDelete = (variable) => {
  if (variable) {
    disabledDelete.value = 'small-font disabled'
  } else {
    disabledDelete.value = 'small-font'
  }
}

const BloquearDetalle = (variable) => {
  if (variable) {
    disabledDetalle.value = 'small-font disabled'
  } else {
    disabledDetalle.value = 'small-font'
  }
}

//Función que Captura los datos del elemento seleccionado en las tablas
const handleSelection = (row) => {
  var ruta = route.fullPath
  arraySelected.value =
    imports.DataSelection(row, ruta, arraySelected) !== false
      ? imports.DataSelection(row, ruta, arraySelected)
      : null

  if (arraySelected.value == null || arraySelected.value == undefined)
    notify_error(STRINGS.errorSelected)
}

//Función que permite hacer los cambios de rutas
const CambioRuta = () => {
  const rutaActual = route.fullPath
  const rutaParts = rutaActual.split('_')

  const keyEncontrada = Object.keys(routeStylesMap).find((k) => rutaParts.includes(k))
  const config = keyEncontrada
    ? routeStylesMap[keyEncontrada]
    : {
        provincia: false,
        municipio: false,
        organismo: false,
        banco: false,
        comprobante: false,
        monedas: false,
        vehiculos: false,
        exento: false,
      }

  StyleFocusP.value = config.provincia ? '' : 'display: none'
  StyleFocusM.value = config.municipio ? '' : 'display: none'
  StyleFocusO.value = config.organismo ? '' : 'display: none'
  StyleFocusB.value = config.banco ? '' : 'display: none'
  StyleFocusC.value = config.comprobante ? '' : 'display: none'
  StyleFocusMO.value = config.monedas ? '' : 'display: none'
  StyleFocusV.value = config.vehiculos ? '' : 'display: none'
  StyleFocusE.value = config.exento ? '' : 'display: none'
}

watchEffect(() => {
  CambioRuta()
})

const onItemClick = (value) => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  switch (value) {
    case 'Add':
      if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
        dialogoAddProvincia.value.LevantarDialogoAdd()
      } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
        dialogoAddMunicipio.value.LevantarDialogoAdd()
      } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
        dialogoAddOrganismo.value.LevantarDialogoAdd()
      } else if (nuevaRuta.includes(STRINGS.bancoLowercase)) {
        dialogoAddBanco.value.LevantarDialogoAdd()
      } else if (nuevaRuta.includes(STRINGS.monedasLowercase)) {
        dialogoAddMoneda.value.LevantarDialogoAdd()
      } else if (nuevaRuta.includes(STRINGS.vehiculosLowercase)) {
        dialogoAddVehiculo.value.LevantarDialogoAdd()
      } else if (nuevaRuta.includes(STRINGS.exentoLowercase)) {
        dialogoAddExento.value.LevantarDialogoAdd()
      }

      break
    case 'Edit':
      if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogoEditProvincia.value.LevantarDialogoEdit(
              arraySelected.value['nombre'],
              arraySelected.value['codigo'],
              arraySelected.value['_id'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogoEditMunicipio.value.LevantarDialogoEdit(
              arraySelected.value['nombre'],
              arraySelected.value['codigo'],
              arraySelected.value['provincia'],
              arraySelected.value['_id'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogEditOrganismo.value.LevantarDialogoEdit(
              arraySelected.value['name_min'],
              arraySelected.value['name'],
              arraySelected.value['_id'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.bancoLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogEditBanco.value.LevantarDialogoEdit(
              arraySelected.value['nombre'],
              arraySelected.value['codigo'],
              arraySelected.value['detalle'],
              arraySelected.value['_id'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.monedasLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogEditMoneda.value.LevantarDialogoEdit(
              arraySelected.value['siglas'],
              arraySelected.value['nombre'],
              arraySelected.value['tasa'],
              arraySelected.value['nomenclador'],
              arraySelected.value['moneda'],
              arraySelected.value['condor'],
              arraySelected.value['_id'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.vehiculosLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogEditVehiculo.value.LevantarDialogoEdit(
              arraySelected.value['nombre'],
              arraySelected.value['codigo'],
              arraySelected.value['tasa'],
              arraySelected.value['nomenclador'],
              arraySelected.value['_id'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.exentoLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogEditExento.value.LevantarDialogoEdit(
              arraySelected.value['nombre'],
              arraySelected.value['codigo'],
              arraySelected.value['nomenclador'],
              arraySelected.value['detalles'],
              arraySelected.value['_id'],
            )
        }
      }

      break
    case 'Delete':
      if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogoDeleteProvincia.value.LevantarDialogoDelete(
            arraySelected.value['nombre'],
            arraySelected.value['codigo'],
            arraySelected.value['_id'],
          )
        }
      } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogoDeleteMunicipio.value.LevantarDialogoDelete(
            arraySelected.value['nombre'],
            arraySelected.value['codigo'],
            arraySelected.value['provincia'],
            arraySelected.value['_id'],
          )
        }
      } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogDeleteOrganismo.value.LevantarDialogoDelete(
            arraySelected.value['name_min'],
            arraySelected.value['_id'],
          )
        }
      } else if (nuevaRuta.includes(STRINGS.bancoLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogDeleteBanco.value.LevantarDialogoDelete(
            arraySelected.value['codigo'],
            arraySelected.value['_id'],
          )
        }
      } else if (nuevaRuta.includes(STRINGS.monedasLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogDeleteMoneda.value.LevantarDialogoDelete(
            arraySelected.value['siglas'],
            arraySelected.value['_id'],
          )
        }
      } else if (nuevaRuta.includes(STRINGS.vehiculosLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogDeleteVehiculo.value.LevantarDialogoDelete(
            arraySelected.value['codigo'],
            arraySelected.value['_id'],
          )
        }
      } else if (nuevaRuta.includes(STRINGS.exentoLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogDeleteExento.value.LevantarDialogoDelete(
            arraySelected.value['codigo'],
            arraySelected.value['_id'],
          )
        }
      }

      break
    case 'Export':
      notify_error('TODO: Exportar')
      break
    case 'Details':
      if (!disabledDetalle.value.includes(STRINGS.desabilitar)) {
        notify_error('TODO: Detalles')
      }
      break

    default:
      break
  }
}

const resetSearch = () => {
  TextSearch.value = ''
}
</script>
