<template>
  <div class="q-pb-sm">
    <q-toolbar class="bg-green-10 text-white shadow-2">
      <q-tabs v-model="tab" shrink bordered>
        <q-tab name="tab1" icon="note_add" class="small-font" @click="onItemClick(STRINGS.add)">{{
          STRINGS.add
        }}</q-tab>
        <q-tab name="tab2" icon="edit" :class="disabledEdit" @click="onItemClick(STRINGS.edit)">{{
          STRINGS.edit
        }}</q-tab>
        <q-tab
          name="tab3"
          icon="delete"
          :class="disabledDelete"
          @click="onItemClick(STRINGS.delete)"
          >{{ STRINGS.delete }}</q-tab
        >
        <q-tab
          name="tab6"
          icon="picture_as_pdf"
          class="small-font"
          @click="onItemClick(STRINGS.export)"
          >{{ STRINGS.export }}</q-tab
        >
        <q-tab
          name="tab7"
          icon="receipt_long"
          :class="disabledDetalle"
          @click="onItemClick(STRINGS.details)"
          >{{ STRINGS.details }}</q-tab
        >

        <q-tab
          name="tab8"
          icon="update"
          :class="disabledUpdate"
          @click="onItemClick(STRINGS.update)"
          >{{ STRINGS.update }}</q-tab
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
  <DialogoAddProvincia ref="dialogoAddProvincia" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Add Municipio-->
  <DialogoAddMunicipio ref="dialogoAddMunicipio" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Add Organismo-->
  <DialogoAddOrganismo ref="dialogoAddOrganismo" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Add Banco-->
  <DialogoAddBanco ref="dialogoAddBanco" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Add Moneda-->
  <DialogoAddMoneda ref="dialogoAddMoneda" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Add Vehiculo-->
  <DialogoAddVehiculo ref="dialogoAddVehiculo" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Add Exento-->
  <DialogoAddExento ref="dialogoAddExento" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Add Comprobante-->
  <DialogoAddComprobante ref="dialogoAddComprobante" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Add Forma de Pago-->
  <DialogoAddFormaDePago ref="dialogoAddFormaDePago" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Add Forma de Pago-->
  <DialogoAddTipoCuenta ref="dialogoAddTipoCuenta" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit Provincia -->
  <DialogEditProvincia ref="dialogoEditProvincia" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit Municipio -->
  <DialogEditMunicipio ref="dialogoEditMunicipio" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit Organismo -->
  <DialogEditOrganismo ref="dialogEditOrganismo" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit Banco -->
  <DialogEditBanco ref="dialogEditBanco" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit Moneda -->
  <DialogEditMoneda ref="dialogEditMoneda" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit Vehiculo -->
  <DialogEditVehiculo ref="dialogEditVehiculo" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit Exento -->
  <DialogEditExento ref="dialogEditExento" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit Comprobante -->
  <DialogEditComprobante ref="dialogEditComprobante" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit FDP -->
  <DialogEditFdp ref="dialogEditFdp" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Edit Tipo cuenta -->
  <DialogEditTipoCuenta ref="dialogEditTipoCuenta" @ActualizarTabla="tableUpdater" />

  <!-- Dialogo Delete Generico-->
  <DialogDeleteGeneric ref="dialogoDelete" @ActualizarTabla="tableUpdater" />

  <!-- Tabla de Provincias -->
  <table_Gest_provincia
    ref="tableProvincia"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusP"
    :TextSearch="TextSearch"
  ></table_Gest_provincia>

  <!-- Tabla de Municipio -->
  <table_Gest_municipio
    ref="tableMunicipio"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusM"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Organismo -->
  <table_Gest_organismo
    ref="tableOrganismo"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusO"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Banco -->
  <table_Gest_banco
    ref="tableBanco"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusB"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Monedas -->
  <table_Gest_monedas
    ref="tableMonedas"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusMO"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Vehiculos -->
  <table_Gest_vehiculos
    ref="tableVehiculo"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusV"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Exebto -->
  <table_Gest_exento
    ref="tableExento"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusE"
    :TextSearch="TextSearch"
  />

  <!-- Tabla de Comprobante -->
  <table_Gest_comprobante
    ref="tableComprobante"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusC"
    :TextSearch="TextSearch"
  />

  <table_Gest_fdp
    ref="tableFdp"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusFdp"
    :TextSearch="TextSearch"
  />

  <table_Gest_tipo_cuenta
    ref="tableTipoCuenta"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="StyleFocusTC"
    :TextSearch="TextSearch"
  />
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
  DialogoAddFormaDePago,
  DialogoAddTipoCuenta,
  DialogEditComprobante,
  DialogEditProvincia,
  DialogEditMunicipio,
  DialogEditOrganismo,
  DialogEditBanco,
  DialogEditMoneda,
  DialogEditVehiculo,
  DialogEditExento,
  DialogEditFdp,
  DialogEditTipoCuenta,
  DialogDeleteGeneric,
  table_Gest_provincia,
  table_Gest_municipio,
  table_Gest_organismo,
  table_Gest_banco,
  table_Gest_comprobante,
  table_Gest_monedas,
  table_Gest_vehiculos,
  table_Gest_exento,
  table_Gest_fdp,
  table_Gest_tipo_cuenta,
  notify_error,
} from 'src/utils/import_files_nomenclador.js'
import imports from 'utils/imports.js'
import notify_success from 'src/utils/notify/notify_success'

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
const StyleFocusFdp = ref('display: none')
const StyleFocusTC = ref('display: none')

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
    fdp: false,
    tipoCuenta: false,
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
    fdp: false,
    tipoCuenta: false,
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
    fdp: false,
    tipoCuenta: false,
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
    fdp: false,
    tipoCuenta: false,
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
    fdp: false,
    tipoCuenta: false,
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
    fdp: false,
    tipoCuenta: false,
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
    fdp: false,
    tipoCuenta: false,
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
    fdp: false,
    tipoCuenta: false,
  },
  [STRINGS.formaDePagoLowercaseURL]: {
    provincia: false,
    municipio: false,
    organismo: false,
    banco: false,
    comprobante: false,
    monedas: false,
    vehiculos: false,
    exento: false,
    fdp: true,
    tipoCuenta: false,
  },
  [STRINGS.tipoCuentaLowercaseURL]: {
    provincia: false,
    municipio: false,
    organismo: false,
    banco: false,
    comprobante: false,
    monedas: false,
    vehiculos: false,
    exento: false,
    fdp: false,
    tipoCuenta: true,
  },
}

//Constantes referencias de los dialogos Provincia
const dialogoAddProvincia = ref(null)
const dialogoEditProvincia = ref(null)

//Generico Delete
const dialogoDelete = ref(null)

//Constantes referencias de los dialogos Municipio
const dialogoAddMunicipio = ref(null)
const dialogoEditMunicipio = ref(null)

//Constantes referencias de los dialogos Organismo
const dialogoAddOrganismo = ref(null)
const dialogEditOrganismo = ref(null)

//Constantes referencias de los dialogos Banco
const dialogoAddBanco = ref(null)
const dialogEditBanco = ref(null)

//Constantes referencias de los dialogos Moneda
const dialogoAddMoneda = ref(null)
const dialogEditMoneda = ref(null)

//Constantes referencias de los dialogos Vehiculos
const dialogoAddVehiculo = ref(null)
const dialogEditVehiculo = ref(null)

//Constantes referencias de los dialogos Exento
const dialogoAddExento = ref(null)
const dialogEditExento = ref(null)

//Constantes referencias de los dialogos Comprobante
const dialogoAddComprobante = ref(null)
const dialogEditComprobante = ref(null)

//Constantes referencias de los dialogos Forma de Pago
const dialogoAddFormaDePago = ref(null)
const dialogEditFdp = ref(null)

//Constantes referencias de los dialogos Forma de Pago
const dialogoAddTipoCuenta = ref(null)
const dialogEditTipoCuenta = ref(null)

//Constantes referencias de las tablas de Nomencladores
const tableProvincia = ref(null)
const tableMunicipio = ref(null)
const tableOrganismo = ref(null)
const tableBanco = ref(null)
const tableMonedas = ref(null)
const tableComprobante = ref(null)
const tableVehiculo = ref(null)
const tableExento = ref(null)
const tableFdp = ref(null)
const tableTipoCuenta = ref(null)

//ARRAY GLOBAL QUE SELECCIONA TODO
var arraySelected = ref([])

//Variables a evaluar clases de tabsBotton
const disabledEdit = ref('small-font disabled')
const disabledDelete = ref('small-font disabled')
const disabledDetalle = ref('small-font disabled')
const disabledUpdate = ref('small-font')

const tableUpdater = (value) => {
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
  } else if (nuevaRuta.includes(STRINGS.comprobanteLowercase)) {
    if (value) tableComprobante.value.UpdateTable()
    else ErrorUpdateTable()
  } else if (nuevaRuta.includes(STRINGS.formaDePagoLowercaseURL)) {
    if (value) tableFdp.value.UpdateTable()
    else ErrorUpdateTable()
  } else if (nuevaRuta.includes(STRINGS.tipoCuentaLowercaseURL)) {
    if (value) tableTipoCuenta.value.UpdateTable()
    else ErrorUpdateTable()
  } else {
    ErrorUpdateTable()
  }
}

const ErrorUpdateTable = () => {
  notify_error(STRINGS.errorUpdate)
}

const EnableTabs = (variable) => {
  if (variable) {
    disabledEdit.value = 'small-font disabled'
    disabledDelete.value = 'small-font disabled'
    disabledDetalle.value = 'small-font disabled'
  } else {
    disabledEdit.value = 'small-font'
    disabledDelete.value = 'small-font'
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

const getPath = () => {
  const rutaActual = route.fullPath
  if (typeof rutaActual !== 'string') {
    console.warn('route.fullPath no es un string:', rutaActual)
    return []
  }
  return rutaActual.split('_')
}

//Función que permite hacer los cambios de rutas
const changeRoute = () => {
  const path = getPath()

  const keyEncontrada = Object.keys(routeStylesMap).find((k) => path.includes(k))
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
        fdp: false,
        tipoCuenta: false,
      }

  StyleFocusP.value = config.provincia ? '' : 'display: none'
  StyleFocusM.value = config.municipio ? '' : 'display: none'
  StyleFocusO.value = config.organismo ? '' : 'display: none'
  StyleFocusB.value = config.banco ? '' : 'display: none'
  StyleFocusC.value = config.comprobante ? '' : 'display: none'
  StyleFocusMO.value = config.monedas ? '' : 'display: none'
  StyleFocusV.value = config.vehiculos ? '' : 'display: none'
  StyleFocusE.value = config.exento ? '' : 'display: none'
  StyleFocusFdp.value = config.fdp ? '' : 'display: none'
  StyleFocusTC.value = config.tipoCuenta ? '' : 'display: none'
}

watchEffect(() => {
  changeRoute()
})

const onItemClick = (value) => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  switch (value) {
    case STRINGS.add:
      if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
        dialogoAddProvincia.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
        dialogoAddMunicipio.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
        dialogoAddOrganismo.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.bancoLowercase)) {
        dialogoAddBanco.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.monedasLowercase)) {
        dialogoAddMoneda.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.vehiculosLowercase)) {
        dialogoAddVehiculo.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.exentoLowercase)) {
        dialogoAddExento.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.comprobanteLowercase)) {
        dialogoAddComprobante.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.formaDePagoLowercaseURL)) {
        dialogoAddFormaDePago.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.tipoCuentaLowercaseURL)) {
        dialogoAddTipoCuenta.value.getUpDialogAdd()
      }

      break
    case STRINGS.edit:
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
              arraySelected.value['nombre'],
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
      } else if (nuevaRuta.includes(STRINGS.comprobanteLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogEditComprobante.value.LevantarDialogoEdit(
              arraySelected.value['nombre'],
              arraySelected.value['codigo'],
              arraySelected.value['moneda'],
              arraySelected.value['valor'],
              arraySelected.value['_id'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.formaDePagoLowercaseURL)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogEditFdp.value.LevantarDialogoEdit(
              arraySelected.value['nombre'],
              arraySelected.value['nomenclador'],
              arraySelected.value['detalles'],
              arraySelected.value['_id'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.tipoCuentaLowercaseURL)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arraySelected.value != null)
            dialogEditTipoCuenta.value.LevantarDialogoEdit(
              arraySelected.value['codigo'],
              arraySelected.value['nombre'],
              arraySelected.value['_id'],
            )
        }
      }

      break
    case STRINGS.delete:
      if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
        dialogoDelete.value.LevantarDialogoDelete(
          arraySelected.value['nombre'],
          arraySelected.value['_id'],
          getPath(),
        )
      }
      break
    case STRINGS.export:
      notify_error('TODO: Exportar')
      break
    case STRINGS.details:
      if (!disabledDetalle.value.includes(STRINGS.desabilitar)) {
        notify_error('TODO: Detalles')
      }
      break
    case STRINGS.update:
      tableUpdater(true)
      notify_success(STRINGS.updateTable)
      break

    default:
      break
  }
}

const resetSearch = () => {
  TextSearch.value = ''
}

const EmptySelectedTwo = () => {
  EnableTabs(true)
  tableProvincia.value.EmptySelected()
  tableMunicipio.value.EmptySelected()
  tableOrganismo.value.EmptySelected()
  tableBanco.value.EmptySelected()
  tableMonedas.value.EmptySelected()
  tableVehiculo.value.EmptySelected()
  tableExento.value.EmptySelected()
  tableComprobante.value.EmptySelected()
  tableFdp.value.EmptySelected()
  tableTipoCuenta.value.EmptySelected()
}

defineExpose({
  EmptySelectedTwo,
})
</script>
