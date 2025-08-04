<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ imports.JoinCamelCase(Titulo, true).toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between q-mb-lg">
            <div class="col-4">
              <q-select
                v-model="TextProveedor_RTB"
                @update:model-value="TextProveedor_RTB = $event"
                :options="options"
                disable
                :label="imports.JoinCamelCase(STRINGS.proveedorLowercase)"
                :rules="validaciones_generales.rulesNoEmpty"
              />
            </div>
            <div class="col-4">
              <q-select
                v-model="TextProducto_RTB"
                @update:model-value="TextProducto_RTB = $event"
                :options="options"
                disable
                :label="STRINGS.producto_RecTarjetaProducida"
                :rules="validaciones_generales.rulesNoEmpty"
              />
            </div>

            <div class="col-3">
              <q-input
                v-model="TextCantidad_RTB"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyNumbers"
                :label="STRINGS.cantidad_RecTarjetaProducida"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <!-- Costo- Factura- Cheque -->
          <div class="row flex justify-between q-mb-md">
            <div class="col-2">
              <q-input
                v-model="TextCosto_RTB"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyNumbers"
                :label="STRINGS.costo_RecTarjetaProducida"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="TextNumFactura_RTB"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyNumbers"
                :label="STRINGS.NumFactura_RecTarjetaProducida"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-4">
              <q-input
                v-model="TextCheque_RTB"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyNumbers"
                :label="STRINGS.cheque_RecTarjetaProducida"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn
                icon="check"
                :class="disabledBtnSave"
                @click="SendData()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                v-on:click="Reset"
                color="dark"
                v-close-popup
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref /* , watch */, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import imports from 'src/utils/imports'
validaciones_generales

const Titulo = ref('')

/* Caso especial por Título compuesto */
const loadTittle = () => {
  Titulo.value = STRINGS.recepcion + ' ' + STRINGS.tarjeta_blancaLowercase
}

onBeforeMount(() => {
  loadTittle()
})

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    notify_success('Add con Exito')
    dialog.value = false
    Reset()
  }
}

/*Función que levanta el dialogo*/
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextProveedor_RTB.value = ''
  TextProducto_RTB.value = ''
  TextCantidad_RTB.value = ''
  TextCosto_RTB.value = ''
  TextNumFactura_RTB.value = ''
  TextCheque_RTB.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    /*  TextProveedor_RTB.value !== '' &&
    TextProducto_RTB.value !== '' && */
    TextCantidad_RTB.value !== '' &&
    TextCosto_RTB.value !== '' &&
    TextNumFactura_RTB.value !== '' &&
    TextCheque_RTB.value !== ''
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyNumber.test(TextCantidad_RTB.value) &&
    expRegulares.onlyNumber.test(TextCosto_RTB.value) &&
    expRegulares.onlyNumber.test(TextNumFactura_RTB.value) &&
    expRegulares.onlyNumber.test(TextCheque_RTB.value)
  )
    return true
  else return false
}

//Función para comprobar los campos y habilitar botón GUARDAR
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

//Ref dialogo
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const refDialogoAdd = ref(null)

//Ref Variables
const TextProveedor_RTB = ref('')
const TextProducto_RTB = ref('')
const TextCantidad_RTB = ref('')
const TextCosto_RTB = ref('')
const TextNumFactura_RTB = ref('')
const TextCheque_RTB = ref('')

const backdropFilter = ref(null)

//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogAdd,
})
</script>
