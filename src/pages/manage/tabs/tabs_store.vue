<template>
  <div class="q-pb-sm">
    <q-toolbar class="bg-green-10 text-white shadow-2">
      <q-tabs v-model="tab" shrink bordered>
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

      <!-- =================================================== -->
      <!-- Input de busqueda -->
      <!-- =================================================== -->
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

  <!-- ===================================================== -->
  <!-- Contenido STORE -->
  <!-- ===================================================== -->

  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - TARJETA BLANCA ** -->
  <!-- ===================================================== -->
  <div>
    <!-- Dialogo Add Tarjeta Blanca -->
    <DialogoAddTarjetaBlanca ref="dialogoAddTarjetaBlanca" @ActualizarTabla="tableUpdater" />
  </div>
  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - TARJETA BLANCA ** -->
  <!-- ===================================================== -->


  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - TARJETA PRODUCIDA ** -->
  <!-- ===================================================== -->
  <div>
    <!-- Dialogo Add Tarjeta Producida -->
    <DialogoAddTarjetaProducida ref="dialogoAddTarjetaProducida" @ActualizarTabla="tableUpdater" />
  </div>
  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - TARJETA PRODUCIDA ** -->
  <!-- ===================================================== -->


  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - PROVEEDOR ** -->
  <!-- ===================================================== -->
  <div>
    <!-- Dialogo Add Proveedor -->
    <DialogoAddProveedor ref="dialogoAddProveedor" @ActualizarTabla="tableUpdater" />
  </div>
  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - PROVEEDOR ** -->
  <!-- ===================================================== -->



  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - RECEPCION TARJETA PRODUCIDA ** -->
  <!-- ===================================================== -->
  <div>
    <!-- Dialogo Add Recepción Tarjeta Producida -->
    <DialogAddRecepcionTarjetaBlanca ref="dialogAddRecepcionTarjetaBlanca" @ActualizarTabla="tableUpdater" />
  </div>
  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - RECEPCION TARJETA PRODUCIDA ** -->
  <!-- ===================================================== -->

  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - SALIDA TARJETA PRODUCIDA ** -->
  <!-- ===================================================== -->
  <div>
    <!-- Dialogo Add Salida Tarjeta Producida -->
    <DialogAddSalidaTarjetaProducida ref="dialogAddSalidaTarjetaProducida" @ActualizarTabla="tableUpdater" />
  </div>
  <!-- ===================================================== -->
  <!-- ** Conetenido STORE - SALIDA TARJETA PRODUCIDA ** -->
  <!-- ===================================================== -->


  <!-- Dialogo Delete Generico-->
  <DialogDeleteGeneric ref="dialogoDelete" @ActualizarTabla="tableUpdater" />

</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
import { getPath } from 'utils/utils_routs/utils_routs'
import { STRINGS } from 'src/utils/import_files_nomenclador.js'
import {
  DialogoAddTarjetaBlanca,
  DialogoAddProveedor,
  DialogoAddTarjetaProducida,
  DialogAddRecepcionTarjetaBlanca,
  DialogAddSalidaTarjetaProducida,
} from 'src/utils/import_files_store.js'
import { DialogDeleteGeneric } from 'utils/import_files_nomenclador.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* ============================================================ */
/*  ==== DECLARACIONES ==== */
/* ============================================================ */
const { notify_success, /*notify_warning,*/ notify_error } = useNotify()
const tab = ref('')
const TextSearch = ref('')

/* Focus Table Nomenclador */
const FocusTarjetaBlanca = ref('display: none')
const FocusRecepcionTarjetaBlanca = ref('display: none')
const FocusProveedor = ref('display: none')
const FocusTarjetaProducida = ref('display: none')
const FocusSalidaTarjetaProducida = ref('display: none')

const routeStylesMap = {
  [STRINGS.tarjeta_blancaLowercase]: {
    t_blanca: true,
    t_producida: false,
    salida_t_producida: false,
    recepcion_t_blanca: false,
    proveedor: false
  },
  [STRINGS.tarjeta_producidaLowercase]: {
    t_blanca: false,
    t_producida: true,
    salida_t_producida: false,
    recepcion_t_blanca: false,
    proveedor: false
  },
  [STRINGS.salida_de_tarjeta_producidaLowercase]: {
    t_blanca: false,
    t_producida: false,
    salida_t_producida: true,
    recepcion_t_blanca: false,
    proveedor: false
  }, [STRINGS.recepcion_de_tarjeta_blancaLowercase]: {
    t_blanca: false,
    t_producida: false,
    salida_t_producida: true,
    recepcion_t_blanca: false,
    proveedor: false
  }, [STRINGS.proveedorLowercase]: {
    t_blanca: false,
    t_producida: false,
    salida_t_producida: false,
    recepcion_t_blanca: false,
    proveedor: true
  }
}

//Función que permite hacer los cambios de rutas
const changeRoute = () => {
  const path = getPath(route)

  const keyEncontrada = Object.keys(routeStylesMap).find((k) => path.includes(k))
  const config = keyEncontrada
    ? routeStylesMap[keyEncontrada]
    : {
      t_blanca: false,
      t_producida: false,
      salida_t_producida: false,
      recepcion_t_blanca: false,
      proveedor: false
    }

  FocusTarjetaBlanca.value = config.t_blanca ? '' : 'display: none'
  FocusTarjetaProducida.value = config.t_producida ? '' : 'display: none'
  FocusSalidaTarjetaProducida.value = config.salida_t_producida ? '' : 'display: none'
  FocusRecepcionTarjetaBlanca.value = config.recepcion_t_blanca ? '' : 'display: none'
  FocusProveedor.value = config.proveedor ? '' : 'display: none'
}

//Generico Delete
const dialogoDelete = ref(null)

/* Declaración de constantes Store */
//Const Dialogo Tarjeta Blanca
const dialogoAddTarjetaBlanca = ref(null)

//Const Dialogo Add Proveedor
const dialogoAddProveedor = ref(null)

//Const Dialogo Add Tarjeta Producida
const dialogoAddTarjetaProducida = ref(null)

//Const Dialogo Add Recepción Tarjeta Blanca
const dialogAddRecepcionTarjetaBlanca = ref(null)

//Const Dialogo Add Salida Tarjeta Producida
const dialogAddSalidaTarjetaProducida = ref(null)

//ARRAY GLOBAL QUE SELECCIONA TODO
var objectSelected = ref({})

//Variables a evaluar clases de tabsBotton
const disabledEdit = ref('text-xs text-bold disabled')
const disabledDelete = ref('text-xs text-bold disabled')
const disabledDetails = ref('text-xs text-bold disabled')
const disabledUpdate = ref('text-xs text-bold')

const tableUpdater = (isConfirm) => {

  const current_rout = getPath(route)
  if (current_rout.includes(STRINGS.tarjeta_blancaLowercase) && isConfirm) {
    notify_success("TODO: POR CODIFICAR");
    return
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
/* const RowSelection = (row) => {

  if (!row) {
    objectSelected.value = {}
    BlockTabs(true)
    return
  }

  var ruta = route.fullPath
  let result = store.DataSelection(row, ruta, objectSelected)

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
 */
watchEffect(() => {
  changeRoute()
})

const onItemClick = (value) => {
  const current_rout = getPath(route)
  switch (value) {
    /* =================================== */
    /*  ADD */
    /* =================================== */
    case STRINGS.add:
      if (current_rout.includes(STRINGS.tarjeta_blancaLowercase)) {
        dialogoAddTarjetaBlanca.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.proveedorLowercase)) {
        dialogoAddProveedor.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.tarjeta_producidaLowercase)) {
        dialogoAddTarjetaProducida.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.recepcion_de_tarjeta_blancaLowercase)) {
        dialogAddRecepcionTarjetaBlanca.value.getUpDialogAdd()
      } else if (current_rout.includes(STRINGS.salida_de_tarjeta_producidaLowercase)) {
        dialogAddSalidaTarjetaProducida.value.getUpDialogAdd()
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
      break
    /* =================================== */
    /*  DELETE */
    /* =================================== */
    case STRINGS.delete:
      if (disabledDelete.value.includes(STRINGS.desabilitar))
        return

      if (!objectSelected.value) {
        notify_error("Los datos seleccionados no han sido cargados");
        return
      }

      /*  dialogoDelete.value.getUpDialogDelete(
         arraySelected.value['nombre'],
         arraySelected.value['_id'],
         getPath(),
       ) */
      notify_error("TODO: DELETE NO IMPLEMENTADO");

      break
    /* =================================== */
    /*  EXPORT */
    /* =================================== */
    case STRINGS.export:
      notify_error('TODO: Exportar')
      break
    case STRINGS.details:
      if (!disabledDetails.value.includes(STRINGS.desabilitar)) {
        notify_error('TODO: Detalles')
      }
      break
    /* =================================== */
    /*  UPDATE */
    /* =================================== */
    case STRINGS.update:
      if (tableUpdater(true))
        notify_success(STRINGS.updateTable)
      else
        ErrorUpdateTable()
      break

    default:
      break
  }
}

const resetSearch = () => {
  TextSearch.value = ''
}

const EmptySelected = () => {
  BlockTabs(true)
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
