<template>
  <div class="q-pb-sm">
    <q-toolbar class="bg-green-10 text-white shadow-2">
      <q-tabs v-model="tab" shrink bordered>
        <q-tab
          name="tab1"
          icon="note_add"
          class="text-xs text-bold"
          @click="onItemClick(STRINGS.add)"
          >{{ STRINGS.add }}</q-tab
        >
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
          class="text-xs text-bold"
          @click="onItemClick(STRINGS.export)"
          >{{ STRINGS.export }}</q-tab
        >
        <q-tab
          name="tab7"
          icon="receipt_long"
          :class="disabledDetails"
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
          class="search-input-custom"
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

  <!-- =================================================== -->
  <!-- ** Conetenido TABS Nomenclator ** -->
  <!-- =================================================== -->

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Provincia ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Provincia-->
    <AddProvincia ref="dialogoAddProvincia" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Provincia -->
    <UpdateProvincia ref="dialogoEditProvincia" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Delete Generico-->
    <DialogDeleteGeneric ref="dialogoDelete" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Provincias -->
    <TableProvincia
      :style="focusProvincia"
      ref="tableProvincia"
      @onSelected="RowSelection"
      @onBlockTabs="BlockTabs"
      :TextSearch="TextSearch"
    >
    </TableProvincia>
  </div>

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Municipio ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Municipio-->
    <AddMunicipio ref="dialogoAddMunicipio" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Municipio -->
    <UpdateMunicipio ref="dialogoEditMunicipio" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Municipio -->
    <Table_Municipio
      ref="tableMunicipio"
      @onSelected="RowSelection"
      @onBlockTabs="BlockTabs"
      :style="focusMunicipio"
      :TextSearch="TextSearch"
    />
  </div>

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Organismo ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Organismo-->
    <AddOrganismo ref="dialogoAddOrganismo" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Organismo -->
    <UpdateOrganismo ref="dialogUpdateOrganismo" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Organismo -->
    <Table_Organismo
      ref="tableOrganismo"
      @seleccionado="RowSelection"
      @onBlockTabs="BlockTabs"
      :style="focusOrganismo"
      :TextSearch="TextSearch"
    />
  </div>

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Banco ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Banco-->
    <AddBanco ref="dialogoAddBanco" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Banco -->
    <UpdateBanco ref="dialogEditBanco" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Banco -->
    <TableBanco
      ref="tableBanco"
      @seleccionado="RowSelection"
      @onBlockTabs="BlockTabs"
      :style="focusBanco"
      :TextSearch="TextSearch"
    />
  </div>

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Tipo cuenta ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Tipo cuenta -->
    <AddTipoCuenta ref="dialogoAddTipoCuenta" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Tipo cuenta  -->
    <UpdateTipoCuenta ref="dialogoEditTipoCuenta" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Tipo cuenta  -->
    <TableTipoCuenta
      ref="tableTipoCuenta"
      @seleccionado="RowSelection"
      @onBlockTabs="BlockTabs"
      :style="focusTipoCuenta"
      :TextSearch="TextSearch"
    />
  </div>

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Moneda ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Moneda -->
    <AddMoneda ref="dialogoAddMoneda" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Moneda  -->
    <UpdateMoneda ref="dialogoEditMoneda" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Moneda  -->
    <TableMoneda
      ref="tableMoneda"
      @seleccionado="RowSelection"
      @onBlockTabs="BlockTabs"
      :style="focusMoneda"
      :TextSearch="TextSearch"
    />
  </div>

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Vehiculo ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Vehiculo-->
    <AddVehiculo ref="dialogoAddVehiculo" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Vehiculo  -->
    <UpdateVehiculo ref="dialogoEditVehiculo" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Vehiculo  -->
    <TableVehiculo
      ref="tableVehiculo"
      @seleccionado="RowSelection"
      @onBlockTabs="BlockTabs"
      :style="focusVehiculo"
      :TextSearch="TextSearch"
    />
  </div>

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Exento ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Exento-->
    <AddExento ref="dialogoAddExento" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Exento  -->
    <UpdateExento ref="dialogoEditExento" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Exento  -->
    <TableExento
      ref="tableExento"
      @seleccionado="RowSelection"
      @onBlockTabs="BlockTabs"
      :style="focusExento"
      :TextSearch="TextSearch"
    />
  </div>

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Comprobante ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Comprobante-->
    <AddComprobante ref="dialogoAddComprobante" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Comprobante  -->
    <UpdateComprobante ref="dialogoEditComprobante" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Comprobante  -->
    <TableComprobante
      ref="tableComprobante"
      @seleccionado="RowSelection"
      @onBlockTabs="BlockTabs"
      :style="focusComprobante"
      :TextSearch="TextSearch"
    />
  </div>

  <!-- =================================================== -->
  <!-- ** Conetenido Nomenclator - Forma de Pago ** -->
  <!-- =================================================== -->

  <div>
    <!-- Dialogo Add Forma de Pago-->
    <AddFormaDePago ref="dialogoAddFdp" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Forma de Pago  -->
    <UpdateFormaDePago ref="dialogoEditFdp" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Forma de Pago  -->
    <TableFormaDePago
      ref="tableFdp"
      @seleccionado="RowSelection"
      @onBlockTabs="BlockTabs"
      :style="focusFdp"
      :TextSearch="TextSearch"
    />
  </div>

  <!-- ============================================================ -->
  <!-- ==== COMPONENTE PARA DETALLES DE LA FILA SELECCIONADA ==== -->
  <!-- ============================================================ -->

  <!-- En el template, agregar el componente una sola vez -->
  <DialogDetails ref="detailsDialog" v-model="detailsDialogOpen" @close="onDetailsClose" />

  <!-- =================================================== -->
  <!-- ** Conetenido TABS Nomenclator ** -->
  <!-- =================================================== -->
</template>

<script setup>
/* =================================================== */
/*  ===== IMPORTACIONES ===== */
/* =================================================== */
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import {
  STRINGS,
  /* IMPORTACIONES Nomencladores */
  AddProvincia,
  AddMunicipio,
  AddOrganismo,
  AddBanco,
  AddTipoCuenta,
  AddMoneda,
  AddComprobante,
  AddVehiculo,
  AddExento,
  AddFormaDePago,
  UpdateProvincia,
  UpdateMunicipio,
  UpdateOrganismo,
  UpdateBanco,
  UpdateTipoCuenta,
  UpdateMoneda,
  UpdateVehiculo,
  UpdateExento,
  UpdateComprobante,
  UpdateFormaDePago,
  DialogDeleteGeneric,
  TableProvincia,
  Table_Municipio,
  Table_Organismo,
  TableBanco,
  TableTipoCuenta,
  TableMoneda,
  TableVehiculo,
  TableExento,
  TableComprobante,
  TableFormaDePago,
} from 'src/utils/import_files_nomenclador.js'
//Importar componente y config
import DialogDetails from 'src/components/shared/DialogDetails.vue'
import { getDetailsConfig } from 'src/config/detailsConfig.js'
import nomenclator from 'src/utils/data_selected/nomenclator/data_selection.js'
import { useNotify } from 'src/utils/notify/notify.js'
import { getPath } from 'utils/utils_routs/utils_routs'
import { useTableExport } from 'src/composables/useTableExport.js'

/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { notify_success, /* notify_warning,*/ notify_error } = useNotify()

const { exportToExcel } = useTableExport()

const tab = ref('')
const TextSearch = ref('')

/* =================================================== */
/*  ===== FOCUS OF ALL TABLES ===== */
/* =================================================== */
const focusProvincia = ref('display: none')
const focusMunicipio = ref('display: none')
const focusOrganismo = ref('display: none')
const focusBanco = ref('display: none')
const focusTipoCuenta = ref('display: none')
const focusMoneda = ref('display: none')
const focusVehiculo = ref('display: none')
const focusExento = ref('display: none')
const focusComprobante = ref('display: none')
const focusFdp = ref('display: none')

/* =================================================== */
/*  ===== Constantes referencias de los dialogos Provincia ===== */
/* =================================================== */
const dialogoAddProvincia = ref(null)
const dialogoEditProvincia = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de los dialogos Municipio ===== */
/* =================================================== */
const dialogoAddMunicipio = ref(null)
const dialogoEditMunicipio = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de los dialogos Organismo ===== */
/* =================================================== */
const dialogoAddOrganismo = ref(null)
const dialogUpdateOrganismo = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de los dialogos Banco ===== */
/* =================================================== */
const dialogoAddBanco = ref(null)
const dialogEditBanco = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de los dialogos Tipo de cuenta ===== */
/* =================================================== */
const dialogoAddTipoCuenta = ref(null)
const dialogoEditTipoCuenta = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de los dialogos Moneda ===== */
/* =================================================== */
const dialogoAddMoneda = ref(null)
const dialogoEditMoneda = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de los dialogos Vehiculo ===== */
/* =================================================== */
const dialogoAddVehiculo = ref(null)
const dialogoEditVehiculo = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de los dialogos Exento ===== */
/* =================================================== */
const dialogoAddExento = ref(null)
const dialogoEditExento = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de los dialogos Comprobante ===== */
/* =================================================== */
const dialogoAddComprobante = ref(null)
const dialogoEditComprobante = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de los dialogos FORMA DE PAGO ===== */
/* =================================================== */
const dialogoAddFdp = ref(null)
const dialogoEditFdp = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de Dialogo Generico Delete ===== */
/* =================================================== */
const dialogoDelete = ref(null)

/* =================================================== */
/*  ===== Constantes referencias de tablas de Nomencladores ===== */
/* =================================================== */
const tableProvincia = ref(null)
const tableMunicipio = ref(null)
const tableOrganismo = ref(null)
const tableBanco = ref(null)
const tableTipoCuenta = ref(null)
const tableMoneda = ref(null)
const tableVehiculo = ref(null)
const tableExento = ref(null)
const tableComprobante = ref(null)
const tableFdp = ref(null)

/* =================================================== */
/*  ===== OBJETO GLOBAL-CONTIENE LOS DATOS SELECIONADOS EN LA TABLA ===== */
/* =================================================== */
const objectSelected = ref({})

/* =================================================== */
//===== Referencia del Dialogo de detalles dinámico =====
/* =================================================== */
const detailsDialog = ref(null)
const detailsDialogOpen = ref(false)
const config = ref({})

/* =================================================== */
/*  ===== OBJETO CONFIG- PARA HACER SHOW SOLO A UNA TABLA SEGUN URL ===== */
/* =================================================== */
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

// Referencias a tus tablas (ajusta según tus refs)
const tableRefs = {
  [STRINGS.province.toLowerCase()]: tableProvincia,
  [STRINGS.municipality.toLowerCase()]: tableMunicipio,
  // ... agrega las demás
}

/* =================================================== */
/*  ===== FUNCION QUE PERMITE SABER SI LA RUTA FUE CAMBIADA
 Y MOSTRAR O OCULAR MEDIENTE EL OBJETO CONFIG LA TABLA EN CUESTION  ===== */
/* =================================================== */
const changeRoute = () => {
  const path = getPath(route)

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

  focusProvincia.value = config.provincia ? '' : 'display: none'
  focusMunicipio.value = config.municipio ? '' : 'display: none'
  focusOrganismo.value = config.organismo ? '' : 'display: none'
  focusBanco.value = config.banco ? '' : 'display: none'
  focusTipoCuenta.value = config.tipoCuenta ? '' : 'display: none'
  focusMoneda.value = config.monedas ? '' : 'display: none'
  focusVehiculo.value = config.vehiculos ? '' : 'display: none'
  focusExento.value = config.exento ? '' : 'display: none'
  focusComprobante.value = config.comprobante ? '' : 'display: none'
  focusFdp.value = config.fdp ? '' : 'display: none'
}

/* =================================================== */
/*  ===== Variables REF PARA evaluar LA CLASE DEL TAB  ===== */
/* =================================================== */
const disabledEdit = ref('text-xs text-bold disabled')
const disabledDelete = ref('text-xs text-bold disabled')
const disabledDetails = ref('text-xs text-bold disabled')
const disabledUpdate = ref('text-xs text-bold')

/* =================================================== */
/*  ===== Función que permite la actualización de la tabla
 en cuestion del COMPONENTE  ===== */
/* =================================================== */
const tableUpdater = (isConfirm) => {
  const current_rout = getPath(route)

  if (current_rout.includes(STRINGS.provinciaLowercase) && isConfirm) {
    const result = tableProvincia.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.municipioLowercase) && isConfirm) {
    const result = tableMunicipio.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.organismoLowercase) && isConfirm) {
    const result = tableOrganismo.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.bancoLowercase) && isConfirm) {
    const result = tableBanco.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.tipoCuentaLowercaseURL) && isConfirm) {
    const result = tableTipoCuenta.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.monedasLowercase) && isConfirm) {
    const result = tableMoneda.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.vehiculosLowercase) && isConfirm) {
    const result = tableVehiculo.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.exentoLowercase) && isConfirm) {
    const result = tableExento.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.comprobanteLowercase) && isConfirm) {
    const result = tableComprobante.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.formaDePagoLowercaseURL) && isConfirm) {
    const result = tableFdp.value.UpdateTable()
    return result
  }

  return false
}

/* =================================================== */
/*  ===== Función ENCARGADA DE MOSTRAR UN ERROR REFERENTE A LA TABLA  ===== */
/* =================================================== */
const ErrorUpdateTable = () => notify_error(STRINGS.errorUpdate)

/* =================================================== */
/*  ===== Función ENCARGADA DE BLOQUEAR O DESBLOQUEAR
LOS TABS DEPENDIENDO DE LA SELECCION O NO DE LAS FILAS DE LA TABLA  ===== */
/* =================================================== */
const BlockTabs = (value) => {
  const style = 'text-xs text-bold'
  const disabled = 'disabled'

  disabledEdit.value = value ? `${style} ${disabled}` : `${style}`
  disabledDelete.value = value ? `${style} ${disabled}` : `${style}`
  disabledDetails.value = value ? `${style} ${disabled}` : `${style}`
}

//Función que Captura los datos del elemento seleccionado en las tablas
const RowSelection = (row) => {
  if (!row) {
    objectSelected.value = {}
    BlockTabs(true)
    return
  }

  var ruta = route.fullPath
  let result = nomenclator.DataSelection(row, ruta, objectSelected)

  if (result) {
    // 🔥 Spread operator para forzar reactividad en Vue
    objectSelected.value = { ...result }
    BlockTabs(false)
  } else {
    objectSelected.value = {}
    BlockTabs(true)
    notify_error(STRINGS.errorSelected)
  }
}

const onItemClick = async (value) => {
  const current_rout = getPath(route)
  switch (value) {
    /* ********************************************** */
    /*  ADD */
    /* ********************************************** */
    case STRINGS.add: //Caso de Tabs "Add"
      if (current_rout.includes(STRINGS.province.toLowerCase())) {
        dialogoAddProvincia.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.municipality.toLowerCase())) {
        dialogoAddMunicipio.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.organismoLowercase)) {
        dialogoAddOrganismo.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.bancoLowercase)) {
        dialogoAddBanco.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.tipoCuentaLowercaseURL)) {
        dialogoAddTipoCuenta.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.monedasLowercase)) {
        dialogoAddMoneda.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.vehiculosLowercase)) {
        dialogoAddVehiculo.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.exentoLowercase)) {
        dialogoAddExento.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.comprobanteLowercase)) {
        dialogoAddComprobante.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.formaDePagoLowercaseURL)) {
        dialogoAddFdp.value.getUpDialogAdd()
      }
      break
    /* ********************************************** */
    /*  EDIT */
    /* ********************************************** */
    case STRINGS.edit: //Caso de Tabs "Edit"
      if (disabledEdit.value.includes(STRINGS.desabilitar)) return

      if (!objectSelected.value) {
        notify_error('Los datos seleccionados no han sido cargados')
        return
      }
      if (current_rout.includes(STRINGS.province.toLowerCase())) {
        /*Se levanta el modal de editar*/
        dialogoEditProvincia.value.getUpDialogEdit(
          objectSelected.value.nombre,
          objectSelected.value.codigo,
          objectSelected.value._id,
        )
      } else if (current_rout.includes(STRINGS.municipality.toLowerCase())) {
        /*Se levanta el modal de editar*/
        dialogoEditMunicipio.value.getUpDialogEdit(
          objectSelected.value.nombre,
          objectSelected.value.codigo,
          objectSelected.value.label_provincia,
          objectSelected.value._id,
        )
      } else if (current_rout.includes(STRINGS.organismoLowercase)) {
        /*Se levanta el modal de editar*/
        console.log(objectSelected.value)
        dialogUpdateOrganismo.value.getUpDialogEdit(
          objectSelected.value.siglas,
          objectSelected.value.nombre,
          objectSelected.value._id,
        )
      } else if (current_rout.includes(STRINGS.bancoLowercase)) {
        /*Se levanta el modal de editar*/
        console.log(objectSelected.value)
        dialogEditBanco.value.getUpDialogEdit(
          objectSelected.value.nombre,
          objectSelected.value.siglas,
          objectSelected.value.detalle,
          objectSelected.value._id,
        )
      } else if (current_rout.includes(STRINGS.tipoCuentaLowercaseURL)) {
        /*Se levanta el modal de editar*/
        dialogoEditTipoCuenta.value.getUpDialogEdit(
          objectSelected.value.siglas,
          objectSelected.value.nombre,
          objectSelected.value._id,
        )
      } else if (current_rout.includes(STRINGS.monedasLowercase)) {
        /*Se levanta el modal de editar*/
        dialogoEditMoneda.value.getUpDialogEdit(
          objectSelected.value.siglas,
          objectSelected.value.nombre,
          objectSelected.value.tasa,
          objectSelected.value.nomenclador,
          objectSelected.value.moneda,
          objectSelected.value.idCondor,
          objectSelected.value._id,
        )
      } else if (current_rout.includes(STRINGS.vehiculosLowercase)) {
        /*Se levanta el modal de editar*/
        dialogoEditVehiculo.value.getUpDialogEdit(
          objectSelected.value.nombre,
          objectSelected.value.codigo,
          objectSelected.value.tasa,
          objectSelected.value.nomenclador,
          objectSelected.value._id,
        )
      } else if (current_rout.includes(STRINGS.exentoLowercase)) {
        /*Se levanta el modal de editar*/
        dialogoEditExento.value.getUpDialogEdit(
          objectSelected.value.nombre,
          objectSelected.value.codigo,
          objectSelected.value.nomenclador,
          objectSelected.value.detalle,
          objectSelected.value._id,
        )
      } else if (current_rout.includes(STRINGS.comprobanteLowercase)) {
        /*Se levanta el modal de editar*/
        dialogoEditComprobante.value.getUpDialogEdit(
          objectSelected.value.nombre,
          objectSelected.value.codigo,
          objectSelected.value.moneda,
          objectSelected.value.valor,
          objectSelected.value._id,
        )
      } else if (current_rout.includes(STRINGS.formaDePagoLowercaseURL)) {
        /*Se levanta el modal de editar*/
        dialogoEditFdp.value.getUpDialogEdit(
          objectSelected.value.nombre,
          objectSelected.value.nomenclador,
          objectSelected.value.detalle,
          objectSelected.value._id,
        )
      }
      break
    /* ********************************************** */
    /*  DELETE */
    /* ********************************************** */
    case STRINGS.delete:
      if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
        dialogoDelete.value.getUpDialogDelete(
          objectSelected.value.nombre,
          objectSelected.value._id,
          objectSelected.value.siglas,
          getPath(route),
        )
      }
      break
    /* ********************************************** */
    /*  EXPORT */
    /* ********************************************** */
    case STRINGS.export:
      await handleExport()
      break
    /* =================================== */
    /*  DETAILS */
    /* =================================== */
    case STRINGS.details:
      if (disabledDetails.value.includes(STRINGS.desabilitar)) return

      config.value = getDetailsConfig(route.fullPath)
      if (!config.value || !objectSelected.value?.row) {
        notify_error(STRINGS.fila_no_selected)
        return
      }
      // Abrir diálogo genérico con configuración dinámica
      detailsDialog.value?.show(objectSelected.value.row, config.value)
      break

    /* =================================== */
    /*  UPDATE */
    /* =================================== */
    case STRINGS.update:
      if (tableUpdater(true)) notify_success(STRINGS.updateTable)
      else ErrorUpdateTable()
      break

    default:
      break
  }
}

const resetSearch = () => {
  TextSearch.value = ''
}

// Función genérica de exportación - VERSIÓN FINAL
const handleExport = async () => {
  console.log('🔍 [1] handleExport iniciado')

  // 1. Obtener módulo actual desde la ruta
  const currentRoute = route.fullPath.toLowerCase()
  console.log('🔍 [2] currentRoute:', currentRoute)

  // 2. Encontrar key del módulo en tableRefs
  const moduleKey = Object.keys(tableRefs).find((key) => currentRoute.includes(key))
  console.log('🔍 [3] moduleKey:', moduleKey)

  if (!moduleKey) {
    console.error('❌ Keys disponibles en tableRefs:', Object.keys(tableRefs))
    notify_error('Módulo no reconocido para exportar')
    return
  }

  // 3. Obtener referencia a la tabla
  const tableRef = tableRefs[moduleKey]?.value
  console.log('🔍 [4] tableRef:', tableRef ? 'OK' : 'NULL')

  if (!tableRef) {
    notify_error('Tabla no disponible')
    return
  }

  // 4. 🔥 Obtener datos y columnas (con fallback seguro)
  // Prioridad: filteredRows > rows > getRows() > []
  const data =
    tableRef.filteredRows ||
    tableRef.rows ||
    (typeof tableRef.getRows === 'function' ? tableRef.getRows() : []) ||
    []

  // Prioridad: columns > getColumns() > []
  const columns =
    tableRef.columns ||
    (typeof tableRef.getColumns === 'function' ? tableRef.getColumns() : []) ||
    []

  console.log('🔍 [5] Datos:', {
    count: data.length,
    columns: columns.length,
    firstRow: data[0],
    firstColumn: columns[0],
  })

  if (data.length === 0) {
    notify_error('No hay datos para exportar')
    return
  }

  let time = new Date()
  let key = time.getTime()

  // 5. Configurar nombre del archivo
  const moduleName = STRINGS[moduleKey] || moduleKey
  const filename = `${moduleName}_${new Date().toISOString().slice(0, 10)}_${key}`

  // 6. Exportar a Excel
  const result = await exportToExcel(data, columns, filename)

  if (result.success) {
    console.log(`Listo para descargar con éxito: ${filename}.xlsx`)
    notify_success(`Fichero listo para descargar`)
    /* notify_success(STRINGS.exportSuccess || 'Exportación exitosa') */
  } else {
    notify_error(result.error || 'Error al generar el archivo')
  }
}

const EmptySelected = () => {
  BlockTabs(true)
  tableProvincia.value.EmptySelected()
  tableMunicipio.value.EmptySelected()
  tableOrganismo.value.EmptySelected()
  tableBanco.value.EmptySelected()
  tableTipoCuenta.value.EmptySelected()
  tableMoneda.value.EmptySelected()
  tableVehiculo.value.EmptySelected()
  tableExento.value.EmptySelected()
  tableComprobante.value.EmptySelected()
  tableFdp.value.EmptySelected()
}

watchEffect(() => {
  changeRoute()
  RowSelection()
})

defineExpose({
  EmptySelected,
})
</script>

<style scoped>
/* 🔥 Usar :deep() para penetrar componentes de Quasar */
.search-input-custom :deep(.q-field__native)::placeholder {
  font-size: 12px !important;
  opacity: 0.6 !important;
}

.search-input-custom :deep(.q-field__label) {
  font-size: 12px !important;
}

.search-input-custom :deep(.q-field__native) {
  font-size: 13px !important;
}
</style>
