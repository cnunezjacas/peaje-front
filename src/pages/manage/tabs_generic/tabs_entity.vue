<template>
  <div class="q-pb-sm">
    <q-toolbar class="bg-green-10 text-white shadow-2">
      <q-tabs v-model="tabEntity" shrink bordered>
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

  <!-- Add Estacion -->
  <DialogoAddEstacion ref="dialogoAddEstacion" @ActualizarTabla="tableUpdater" />

  <!-- Add Area de Trabajo -->
  <DialogoAddAreaTrabajo ref="dialogoAddAreaTrabajo" @ActualizarTabla="tableUpdater" />

  <!-- Add Cuenta -->
  <DialogoAddCuenta ref="dialogoAddCuenta" @ActualizarTabla="tableUpdater" />

  <!-- Add Terminal -->
  <DialogoAddTerminal ref="dialogoAddTerminal" @ActualizarTabla="tableUpdater" />

  <!-- Add Terminal -->
  <DialogoAddPuntoDeVenta ref="dialogoAddPuntoDeVenta" @ActualizarTabla="tableUpdater" />

  <!-- Add Operador -->
  <DialogoAddOperador ref="dialogoAddOperador" @ActualizarTabla="tableUpdater" />

  <!-- Add Operador -->
  <DialogoAddCliente ref="dialogoAddCliente" @ActualizarTabla="tableUpdater" />

  <!-- Edit Estacion -->
  <DialogoEditEstacion ref="dialogoEditEstacion" @ActualizarTabla="tableUpdater" />

  <!-- Table Estacion -->
  <TableEstacion
    ref="tableEstacion"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="estacion"
  />

  <!-- Table Estacion -->
  <TableADT ref="tableADT" @seleccionado="handleSelection" @onEnable="EnableTabs" :style="adt" />

  <!-- Table Cuenta -->
  <TableCuenta
    ref="tableCuenta"
    @seleccionado="handleSelection"
    @onEnable="EnableTabs"
    :style="cuenta"
  />
</template>

<script setup>
import { ref, watchEffect } from 'vue'
//import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import {
  STRINGS,
  DialogoAddEstacion,
  DialogoAddAreaTrabajo,
  DialogoAddCuenta,
  DialogoAddTerminal,
  DialogoAddPuntoDeVenta,
  DialogoAddOperador,
  DialogoAddCliente,
  DialogoEditEstacion,
  TableEstacion,
  TableADT,
  TableCuenta,
  notify_error,
} from 'src/utils/import_files_entity.js'
import imports from 'src/utils/imports'
import notify_success from 'src/utils/notify/notify_success'

const tabEntity = ref('')
const TextSearch = ref('')

//Const REF Tables
const tableEstacion = ref(null)
const tableADT = ref(null)
const tableCuenta = ref(null)

//FOCUS TABLES
const estacion = ref('display: none')
const adt = ref('display: none')
const cuenta = ref('display: none')

const routeStylesMap = {
  [STRINGS.estacionesLowercase]: {
    estacion: true,
    adt: false,
    cuenta: false,
  },
  [STRINGS.areasDeTrabajoLowercase]: {
    estacion: false,
    adt: true,
    cuenta: false,
  },
  [STRINGS.cuentaLowercase]: {
    estacion: false,
    adt: false,
    cuenta: true,
  },
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
        estacion: false,
        adt: false,
        cuenta: false,
      }

  estacion.value = config.estacion ? '' : 'display: none'
  adt.value = config.adt ? '' : 'display: none'
  cuenta.value = config.cuenta ? '' : 'display: none'
}

watchEffect(() => {
  changeRoute()
})

//ARRAY GLOBAL QUE SELECCIONA TODO
var arraySelected = ref([])

//Variables a evaluar clases de tabsBotton
const disabledEdit = ref('small-font disabled')
const disabledDelete = ref('small-font disabled')
const disabledDetalle = ref('small-font disabled')
const disabledUpdate = ref('small-font')

//Const Estacion
const dialogoAddEstacion = ref(null)
const dialogoEditEstacion = ref(null)

//Const Areas de Trabajo
const dialogoAddAreaTrabajo = ref(null)

//Const Cuenta
const dialogoAddCuenta = ref(null)

//Const Terminal
const dialogoAddTerminal = ref(null)

//Const Terminal
const dialogoAddPuntoDeVenta = ref(null)

//Const Operador
const dialogoAddOperador = ref(null)

//Const Cliente
const dialogoAddCliente = ref(null)

const tableUpdater = (value) => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  if (nuevaRuta.includes(STRINGS.estacionesLowercase)) {
    if (value) tableEstacion.value.UpdateTable()
    else ErrorUpdateTable()
  } else if (nuevaRuta.includes(STRINGS.cuentaLowercase)) {
    if (value) tableCuenta.value.UpdateTable()
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

  if (
    arraySelected.value == null ||
    arraySelected.value == undefined ||
    arraySelected.value.length == 0
  )
    notify_error(STRINGS.errorSelected)
}

/*const getPath = () => {
  //TODO: getPath
}*/

//Función que permite hacer los cambios de rutas
/*const changeRoute = () => {
  //TODO: changeRoute
}*/

/*watchEffect(() => {
  changeRoute()
})*/

const onItemClick = (value) => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  switch (value) {
    case STRINGS.add:
      if (nuevaRuta.includes(STRINGS.estacionesLowercase)) {
        dialogoAddEstacion.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.areasDeTrabajoLowercase)) {
        dialogoAddAreaTrabajo.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.cuentaLowercase)) {
        dialogoAddCuenta.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.terminalLowercase)) {
        dialogoAddTerminal.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.puntosDeVentasLowercase)) {
        dialogoAddPuntoDeVenta.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.operadoresLowercase)) {
        dialogoAddOperador.value.getUpDialogAdd()
      } else if (nuevaRuta.includes(STRINGS.clientesLowercase)) {
        dialogoAddCliente.value.getUpDialogAdd()
      }
      break
    case STRINGS.edit:
      if (nuevaRuta.includes(STRINGS.estacionesLowercase)) {
        dialogoEditEstacion.value.getUpDialogEdit(
          arraySelected.value['nombre'],
          arraySelected.value['codigo'],
          arraySelected.value['direccion'],
          arraySelected.value['provincia'],
          arraySelected.value['municipio'],
          arraySelected.value['_id'],
        )
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
</script>
