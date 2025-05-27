<template>
  <div class="q-pb-sm">
    <q-toolbar class="bg-green-10 text-white shadow-2">
      <!-- <q-btn flat label="Homepage" /> -->

      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->

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
import { STRINGS } from '../../../../utils/string.js'

//Dialogs Add
import DialogoAddProvincia from '../dialogs_insert/dialogoAddProvincia.vue'
import DialogoAddMunicipio from '../dialogs_insert/dialogoAddMunicipio.vue'
import DialogoAddOrganismo from '../dialogs_insert/dialogoAddOrganismo.vue'
import DialogoAddBanco from '../dialogs_insert/dialogoAddBanco.vue'
import DialogoAddMoneda from '../dialogs_insert/dialogAddMoneda.vue'
import DialogoAddVehiculo from '../dialogs_insert/dialogAddVehiculo.vue'
import DialogoAddExento from '../dialogs_insert/dialogAddExento.vue'

//Dialogs Edit
import DialogEditProvincia from '../dialogs_edit/dialog_edit_provincia.vue'
import DialogEditMunicipio from '../dialogs_edit/dialog_edit_municipio.vue'
import DialogEditOrganismo from '../dialogs_edit/dialog_edit_organismo.vue'
import DialogEditBanco from '../dialogs_edit/dialog_edit_banco.vue'
import DialogEditMoneda from '../dialogs_edit/dialog_edit_moneda.vue'
import DialogEditVehiculo from '../dialogs_edit/dialog_edit_vehiculo.vue'
import DialogEditExento from '../dialogs_edit/dialog_edit_exento.vue'

//Dialogs Delete
import DialogDeleteProvincia from '../dialogs_delete/dialog_delete_provincia.vue'
import DialogDeleteMunicipio from '../dialogs_delete/dialog_delete_municipio.vue'
import DialogDeleteOrganismo from '../dialogs_delete/dialog_delete_organismo.vue'
import DialogDeleteBanco from '../dialogs_delete/dialog_delete_banco.vue'
import DialogDeleteMoneda from '../dialogs_delete/dialog_delete_moneda.vue'
import DialogDeleteVehiculo from '../dialogs_delete/dialog_delete_vehiculo.vue'
import DialogDeleteExento from '../dialogs_delete/dialog_delete_exento.vue'

//Tables
import table_Gest_provincia from '../tables/table_Gest_provincia.vue'
import table_Gest_municipio from '../tables/table_Gest_municipio.vue'
import table_Gest_organismo from '../tables/table_Gest_organismo.vue'
import table_Gest_banco from '../tables/table_Gest_banco.vue'
import table_Gest_comprobante from '../tables/table_Gest_comprobantes.vue'
import table_Gest_monedas from '../tables/table_Gest_moneda.vue'
import table_Gest_vehiculos from '../tables/table_Gest_vehiculos.vue'
import table_Gest_exento from '../tables/table_Gest_exento.vue'

import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import notify_error from 'src/utils/notify/notify_error.js'

const route = useRoute()

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

const handleSelection = (row) => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  if (nuevaRuta.includes(STRINGS.provinciaLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.municipioLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['provincia'] = row['Texto_provincia']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.organismoLowercase) && row) {
    arraySelected.value['name_min'] = row['siglas']
    arraySelected.value['name'] = row['nombre']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.bancoLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['detalle'] = row['detalle']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.monedasLowercase) && row) {
    arraySelected.value['siglas'] = row['siglas']
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['tasa'] = row['tasa']
    arraySelected.value['nomenclador'] = row['nomenclador']
    arraySelected.value['moneda'] = row['moneda']
    arraySelected.value['condor'] = row['condor']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.vehiculosLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['tasa'] = row['tasa']
    arraySelected.value['nomenclador'] = row['nomenclador']
    arraySelected.value['_id'] = row['_id']
  } else if (nuevaRuta.includes(STRINGS.exentoLowercase) && row) {
    arraySelected.value['nombre'] = row['nombre']
    arraySelected.value['codigo'] = row['codigo']
    arraySelected.value['nomenclador'] = row['nomenclador']
    arraySelected.value['detalles'] = row['detalles']
    arraySelected.value['_id'] = row['_id']
  } else {
    notify_error(STRINGS.fila_no_selected)
  }
}

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

const CambioRuta = () => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
    StyleFocusP.value = ''
    StyleFocusM.value = 'display: none'
    StyleFocusO.value = 'display: none'
    StyleFocusB.value = 'display: none'
    StyleFocusC.value = 'display: none'
    StyleFocusMO.value = 'display: none'
    StyleFocusV.value = 'display: none'
    StyleFocusE.value = 'display: none'
  } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
    StyleFocusP.value = 'display: none'
    StyleFocusM.value = ''
    StyleFocusO.value = 'display: none'
    StyleFocusB.value = 'display: none'
    StyleFocusC.value = 'display: none'
    StyleFocusMO.value = 'display: none'
    StyleFocusV.value = 'display: none'
    StyleFocusE.value = 'display: none'
  } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
    StyleFocusP.value = 'display: none'
    StyleFocusM.value = 'display: none'
    StyleFocusO.value = ''
    StyleFocusB.value = 'display: none'
    StyleFocusC.value = 'display: none'
    StyleFocusMO.value = 'display: none'
    StyleFocusV.value = 'display: none'
    StyleFocusE.value = 'display: none'
  } else if (nuevaRuta.includes(STRINGS.bancoLowercase)) {
    StyleFocusP.value = 'display: none'
    StyleFocusM.value = 'display: none'
    StyleFocusO.value = 'display: none'
    StyleFocusB.value = ''
    StyleFocusC.value = 'display: none'
    StyleFocusMO.value = 'display: none'
    StyleFocusV.value = 'display: none'
    StyleFocusE.value = 'display: none'
  } else if (nuevaRuta.includes(STRINGS.comprobanteLowercase)) {
    StyleFocusP.value = 'display: none'
    StyleFocusM.value = 'display: none'
    StyleFocusO.value = 'display: none'
    StyleFocusB.value = 'display: none'
    StyleFocusC.value = ''
    StyleFocusMO.value = 'display: none'
    StyleFocusV.value = 'display: none'
    StyleFocusE.value = 'display: none'
  } else if (nuevaRuta.includes(STRINGS.monedasLowercase)) {
    StyleFocusP.value = 'display: none'
    StyleFocusM.value = 'display: none'
    StyleFocusO.value = 'display: none'
    StyleFocusB.value = 'display: none'
    StyleFocusC.value = 'display: none'
    StyleFocusMO.value = ''
    StyleFocusV.value = 'display: none'
    StyleFocusE.value = 'display: none'
  } else if (nuevaRuta.includes(STRINGS.vehiculosLowercase)) {
    StyleFocusP.value = 'display: none'
    StyleFocusM.value = 'display: none'
    StyleFocusO.value = 'display: none'
    StyleFocusB.value = 'display: none'
    StyleFocusC.value = 'display: none'
    StyleFocusMO.value = 'display: none'
    StyleFocusV.value = ''
    StyleFocusE.value = 'display: none'
  } else if (nuevaRuta.includes(STRINGS.exentoLowercase)) {
    StyleFocusP.value = 'display: none'
    StyleFocusM.value = 'display: none'
    StyleFocusO.value = 'display: none'
    StyleFocusB.value = 'display: none'
    StyleFocusC.value = 'display: none'
    StyleFocusMO.value = 'display: none'
    StyleFocusV.value = 'display: none'
    StyleFocusE.value = ''
  }
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
