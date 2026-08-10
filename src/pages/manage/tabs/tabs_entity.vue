<template>
  <div class="q-pb-sm">
    <q-toolbar class="bg-green-10 text-white shadow-2">
      <q-tabs v-model="tabEntity" shrink bordered>
        <q-tab name="tab1" icon="note_add" class="text-xs text-bold" @click="onItemClick(STRINGS.add)">{{ STRINGS.add
          }}</q-tab>
        <q-tab name="tab2" icon="edit" :class="disabledEdit" @click="onItemClick(STRINGS.edit)">{{
          STRINGS.edit
          }}</q-tab>
        <q-tab name="tab3" icon="delete" :class="disabledDelete" @click="onItemClick(STRINGS.delete)">{{ STRINGS.delete
          }}</q-tab>
        <q-tab name="tab6" icon="picture_as_pdf" class="text-xs text-bold" @click="onItemClick(STRINGS.export)">{{
          STRINGS.export }}</q-tab>
        <q-tab name="tab7" icon="receipt_long" :class="disabledDetails" @click="onItemClick(STRINGS.details)">{{
          STRINGS.details }}</q-tab>

        <q-tab name="tab8" icon="update" :class="disabledUpdate" @click="onItemClick(STRINGS.update)">{{ STRINGS.update
          }}</q-tab>
      </q-tabs>

      <q-space></q-space>

      <!-- Input de busqueda -->
      <div class="q-mx-auto">
        <q-input color="white" input-class="text-white" v-model="TextSearch" label-color="white"
          class="search-input-custom" :label="STRINGS.search" style="max-width: 200px">
          <template v-slot:prepend>
            <q-icon name="search" color="white" />
          </template>
          <template v-slot:append>
            <q-icon v-if="TextSearch" name="cleaning_services" class="cursor-pointer" @click="resetSearch"
              color="white" />
          </template>
        </q-input>
      </div>
      <!-- Input de busqueda -->
    </q-toolbar>
  </div>

  <!-- ************************************************************ -->
  <!-- ************************************************************ -->


  <!-- ** Conetenido Nomenclator - Cuenta ** -->
  <div>
    <!-- Dialogo Add Cuenta-->
    <DialogoAddCuenta ref="dialogoAddCuenta" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Cuenta -->
    <DialogoEditCuenta ref="dialogoEditCuenta" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Delete Generico-->
    <DialogDeleteGeneric ref="dialogoDelete" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Cuenta -->
    <Table_Cuenta ref="tableCuenta" @seleccionado="RowSelection" @onBlockTabs="BlockTabs" :style="focusCuenta"
      :TextSearch="TextSearch" />
  </div>
  <!-- ** Conetenido Nomenclator - Cuenta ** -->

  <!-- ************************************************************ -->
  <!-- ************************************************************ -->

  <!-- ** Conetenido Nomenclator - Estaciones ** -->
  <div>
    <!-- Dialogo Add Estaciones-->
    <DialogoAddEstacion ref="dialogoAddEstacion" @ActualizarTabla="tableUpdater" />

    <!-- Dialogo Edit Estaciones -->
    <DialogoEditEstacion ref="dialogoEditEstacion" @ActualizarTabla="tableUpdater" />

    <!-- Tabla de Estaciones -->
    <Table_Estacion ref="tableEstacion" @seleccionado="RowSelection" @onBlockTabs="BlockTabs" :style="focusEstacion" />
  </div>
  <!-- ** Conetenido Nomenclator - Estaciones ** -->

  <!-- ************************************************************ -->
  <!-- ************************************************************ -->

  <!-- ** Conetenido Nomenclator - Areas de Trabajo ** -->
  <div>
    <!-- Dialogo Add Areas de Trabajo-->
    <DialogoAddAreaTrabajo ref="dialogoAddAreaTrabajo" @ActualizarTabla="tableUpdater" />

  </div>
  <!-- ** Conetenido Nomenclator - Areas de Trabajo ** -->

  <!-- ************************************************************ -->
  <!-- ************************************************************ -->


  <!-- ** Conetenido Nomenclator - PUNTOS DE VENTA ** -->
  <div>
    <!-- Dialogo Add PUNTOS DE VENTA -->
    <DialogoAddPuntoDeVenta ref="dialogoAddPuntoDeVenta" @ActualizarTabla="tableUpdater" />

  </div>
  <!-- ** Conetenido Nomenclator - PUNTOS DE VENTA ** -->

  <!-- ************************************************************ -->
  <!-- ************************************************************ -->

  <!-- ** Conetenido Nomenclator - TERMINAL ** -->
  <div>
    <!-- Dialogo Add TERMINAL -->
    <DialogoAddTerminal ref="dialogoAddTerminal" @ActualizarTabla="tableUpdater" />

  </div>
  <!-- ** Conetenido Nomenclator - TERMINAL ** -->


  <!-- ************************************************************ -->
  <!-- ************************************************************ -->

  <!-- ** Conetenido Nomenclator - OPERADORES ** -->
  <div>
    <!-- Dialogo Add OPERADORES -->
    <DialogoAddOperador ref="dialogoAddOperador" @ActualizarTabla="tableUpdater" />

  </div>
  <!-- ** Conetenido Nomenclator - OPERADORES ** -->

  <!-- ************************************************************ -->
  <!-- ************************************************************ -->

  <!-- ** Conetenido Nomenclator - CLIENTES ** -->
  <div>
    <!-- Dialogo Add CLIENTES -->
    <DialogoAddCliente ref="dialogoAddCliente" @ActualizarTabla="tableUpdater" />

  </div>
  <!-- ** Conetenido Nomenclator - CLIENTES ** -->


  <!-- ************************************************************ -->
  <!-- ************************************************************ -->

  <!-- ** Conetenido Nomenclator - TRAMITADOR ** -->
  <div>
    <!-- Dialogo Add TRAMITADOR -->
    <DialogoAddTramitador ref="dialogoAddTramitador" @ActualizarTabla="tableUpdater" />

  </div>
  <!-- ** Conetenido Nomenclator - TRAMITADOR ** -->


  <!-- ============================================================ -->
  <!-- ==== COMPONENTE PARA DETALLES DE LA FILA SELECCIONADA ==== -->
  <!-- ============================================================ -->

  <!-- En el template, agregar el componente una sola vez -->
  <DialogDetails ref="detailsDialog" v-model="detailsDialogOpen" @close="onDetailsClose" />



</template>

<script setup>
/* ============================================================ */
/*  ==== IMPORTACIONES ==== */
/* ============================================================ */

import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { STRINGS } from 'src/utils/string.js'
const route = useRoute()
import {
  DialogoAddCuenta, DialogoAddEstacion, DialogoAddAreaTrabajo, DialogoAddPuntoDeVenta, DialogoAddTerminal, DialogoAddOperador, DialogoAddCliente, DialogoAddTramitador, DialogoEditCuenta, DialogoEditEstacion, Table_Cuenta, Table_Estacion
} from 'src/utils/import_files_entity.js'

import { DialogDeleteGeneric } from 'src/utils/import_files_nomenclador.js'
import entity from 'src/utils/data_selected/entity/data_selection.js'
import { getPath } from 'utils/utils_routs/utils_routs'
//Importar componente y config
import DialogDetails from 'src/components/shared/DialogDetails.vue'
import { getDetailsConfig } from 'src/config/detailsConfig.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* ============================================================ */
/*  ==== DECLARACIONES ==== */
/* ============================================================ */
const { notify_success, /*notify_warning,*/ notify_error } = useNotify()
const tabEntity = ref('')
const TextSearch = ref('')

//Const REF Tables
/*const tableADT = ref(null)*/
const tableCuenta = ref(null)
const tableEstacion = ref(null)

//FOCUS TABLES
const focusCuenta = ref('display: none')
const focusEstacion = ref('display: none')
const focusADT = ref('display: none')
const focusPuntoDeVenta = ref('display: none')
const focusTerminal = ref('display: none')
const focusOperador = ref('display: none')
const focusCliente = ref('display: none')
const focusTramitador = ref('display: none')

const routeStylesMap = {
  [STRINGS.estacionesLowercase]: {
    estacion: true,
    adt: false,
    cuenta: false,
    punto_de_venta: false,
    terminal: false,
    operador: false,
    cliente: false,
    tramitador: false
  },
  [STRINGS.areasDeTrabajoLowercase]: {
    estacion: false,
    adt: true,
    cuenta: false,
    punto_de_venta: false,
    terminal: false,
    operador: false,
    cliente: false,
    tramitador: false
  },
  [STRINGS.cuentaLowercase]: {
    estacion: false,
    adt: false,
    cuenta: true,
    punto_de_venta: false,
    terminal: false,
    operador: false,
    cliente: false,
    tramitador: false
  }, [STRINGS.puntosDeVentasLowercase]: {
    estacion: false,
    adt: false,
    cuenta: false,
    punto_de_venta: true,
    terminal: false,
    operador: false,
    cliente: false,
    tramitador: false
  }, [STRINGS.terminalLowercase]: {
    estacion: false,
    adt: false,
    cuenta: false,
    punto_de_venta: false,
    terminal: true,
    operador: false,
    cliente: false,
    tramitador: false
  }, [STRINGS.operadoresLowercase]: {
    estacion: false,
    adt: false,
    cuenta: false,
    punto_de_venta: false,
    terminal: false,
    operador: true,
    cliente: false,
    tramitador: false
  }, [STRINGS.clientesLowercase]: {
    estacion: false,
    adt: false,
    cuenta: false,
    punto_de_venta: false,
    terminal: false,
    operador: false,
    cliente: true,
    tramitador: false
  }, [STRINGS.tramitadorLowercase]: {
    estacion: false,
    adt: false,
    cuenta: false,
    punto_de_venta: false,
    terminal: false,
    operador: false,
    cliente: false,
    tramitador: true
  },
}

//Función que permite hacer los cambios de rutas
const changeRoute = () => {
  const path = getPath(route)

  const keyEncontrada = Object.keys(routeStylesMap).find((k) => path.includes(k))
  const config = keyEncontrada
    ? routeStylesMap[keyEncontrada]
    : {
      estacion: false,
      adt: false,
      cuenta: false,
      punto_de_venta: false,
      terminal: false,
      operador: false,
      cliente: false,
      tramitador: false
    }

  focusCuenta.value = config.cuenta ? '' : 'display: none'
  focusEstacion.value = config.estacion ? '' : 'display: none'
  focusADT.value = config.adt ? '' : 'display: none'
  focusPuntoDeVenta.value = config.punto_de_venta ? '' : 'display: none'
  focusTerminal.value = config.terminal ? '' : 'display: none'
  focusOperador.value = config.operador ? '' : 'display: none'
  focusCliente.value = config.cliente ? '' : 'display: none'
  focusTramitador.value = config.tramitador ? '' : 'display: none'
}

//ARRAY GLOBAL QUE SELECCIONA TODO
var objectSelected = ref({})

//Referencia del Dialogo de detalles dinámico
const detailsDialog = ref(null)
const detailsDialogOpen = ref(false)
const config = ref({})

//Variables a evaluar clases de tabsBotton
const disabledEdit = ref('text-xs text-bold disabled')
const disabledDelete = ref('stext-xs text-bolddisabled')
const disabledDetails = ref('text-xs text-bold disabled')
const disabledUpdate = ref('text-xs text-bold')

//Const Estacion
const dialogoAddEstacion = ref(null)
const dialogoEditEstacion = ref(null)
//const dialogoDetailsEstacion = ref(null)

//Const ref Areas de Trabajo
const dialogoAddAreaTrabajo = ref(null)

//Const ref Cuenta
const dialogoAddCuenta = ref(null)
const dialogoEditCuenta = ref(null)


//Const ref Terminal
const dialogoAddTerminal = ref(null)

//Const ref Punto de Venta
const dialogoAddPuntoDeVenta = ref(null)

//Const ref Operador
const dialogoAddOperador = ref(null)

//Const ref Cliente
const dialogoAddCliente = ref(null)

//Const ref Tramitador
const dialogoAddTramitador = ref(null)

//Const ref Dialogo generico delete
const dialogoDelete = ref(null)

const tableUpdater = (isConfirm) => {

  const current_rout = getPath(route)
  if (current_rout.includes(STRINGS.cuentaLowercase) && isConfirm) {
    const result = tableCuenta.value.UpdateTable()
    return result
  } else if (current_rout.includes(STRINGS.estacionesLowercase) && isConfirm) {
    const result = tableEstacion.value.UpdateTable()
    return result
  }

  return false;
}

const ErrorUpdateTable = () => {
  notify_error(STRINGS.errorUpdate)
}

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
  let result = entity.DataSelection(row, ruta, objectSelected)

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


const onItemClick = (value) => {
  const current_rout = getPath(route)
  switch (value) {
    /* =================================== */
    /*  ADD */
    /* =================================== */
    case STRINGS.add:
      if (current_rout.includes(STRINGS.cuentaLowercase)) {
        dialogoAddCuenta.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.estacionesLowercase)) {
        dialogoAddEstacion.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.areasDeTrabajoLowercase)) {
        dialogoAddAreaTrabajo.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.puntosDeVentasLowercase)) {
        dialogoAddPuntoDeVenta.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.terminalLowercase)) {
        dialogoAddTerminal.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.operadoresLowercase)) {
        dialogoAddOperador.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.clientesLowercase)) {
        dialogoAddCliente.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.tramitadorLowercase)) {
        dialogoAddTramitador.value.getUpDialogAdd()
      }
      break
    /* =================================== */
    /*  EDIT */
    /* =================================== */
    case STRINGS.edit:

      if (disabledEdit.value.includes(STRINGS.desabilitar))
        return

      if (!objectSelected.value) {
        notify_error("Los datos seleccionados no han sido cargados");
        return
      }

      if (current_rout.includes(STRINGS.cuentaLowercase)) {
        dialogoEditCuenta.value.getUpDialogEdit(
          objectSelected.value.titular,
          objectSelected.value.numero_tarjeta,
          objectSelected.value.idtipo_cuenta,
          objectSelected.value.tipo_cuenta,
          objectSelected.value.idBanco,
          objectSelected.value.banco,
          objectSelected.value._id,
        );
      }
      if (current_rout.includes(STRINGS.estacionesLowercase)) {
        dialogoEditEstacion.value.getUpDialogEdit(
          objectSelected.value.codigo,
          objectSelected.value.nombre,
          objectSelected.value.id_provincia,
          objectSelected.value.provincia,
          objectSelected.value.id_municipio,
          objectSelected.value.municipio,
          objectSelected.value.direccion,
          objectSelected.value.nit,
          objectSelected.value.cuentaCuc,
          objectSelected.value.cuentaCup,
          objectSelected.value.telefonos,
          objectSelected.value._id,
        );
      }
      break
    case STRINGS.update:
      if (tableUpdater(true))
        notify_success(STRINGS.updateTable)
      else
        ErrorUpdateTable()
      break

    /* =================================== */
    /*  DELETE */
    /* =================================== */
    case STRINGS.delete:
      if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
        dialogoDelete.value.getUpDialogDelete(
          objectSelected.value.nombre,
          objectSelected.value._id,
          objectSelected.value.siglas,
          getPath(route),
        )
      }
      break;
    /* =================================== */
    /*  DETAILS */
    /* =================================== */
    case STRINGS.details:

      if (disabledDetails.value.includes(STRINGS.desabilitar))
        return


      config.value = getDetailsConfig(route.fullPath)
      if (!config.value || !objectSelected.value?.row) {
        notify_error(STRINGS.fila_no_selected)
        return
      }
      // Abrir diálogo genérico con configuración dinámica
      detailsDialog.value?.show(objectSelected.value.row, config.value)
      break;

    default:
      break
  }
}

watchEffect(() => {
  changeRoute()
  RowSelection()
})

const resetSearch = () => {
  TextSearch.value = ''
}

const EmptySelected = () => {
  BlockTabs(true)
  tableCuenta.value.EmptySelected()
  tableEstacion.value.EmptySelected()
}

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
