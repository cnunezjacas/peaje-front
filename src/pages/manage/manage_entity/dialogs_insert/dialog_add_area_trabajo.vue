<template>
  <div class="">
    <q-dialog
      v-model="dialog"
      persistent
      ref="refDialogoAdd"
      :backdrop-filter="backdropFilter"
      content-class="dialog-xl"
      :style="{ '--q-dialog-max-width': '800px' }"
    >
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.add.toUpperCase() }} {{ Titulo.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre -->
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_ADT"
                ref="textNombre_ADT"
                color="green"
                :rules="rulesAddNombre_ADT"
                type="text"
                :label="STRINGS.nombre_ADT"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                v-model="TextCodigo_ADT"
                ref="textCodigo_ADT"
                color="green"
                type="text"
                :rules="rulesAddCodigo_ADT"
                :label="STRINGS.codigo_ADT"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <!-- Detalles -->
          <div class="text-start q-mt-md">
            <p>{{ STRINGS.detalles_ADT.toUpperCase() }}</p>
          </div>
          <div class="row flex justify-between border-box-bank" disabled>
            <div class="col-3">
              <q-input
                v-model="TextOtherCodigo_ADT"
                ref="textOtherCodigo_ADT"
                color="green"
                type="text"
                disabled
                :rules="rulesAddNombre_estacion"
                :label="STRINGS.codigo_ADT"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="TextTarjetas_producidas_ADT"
                ref="textTarjetas_producidas_ADT"
                color="green"
                type="text"
                disabled
                :rules="rulesAddNombre_estacion"
                :label="STRINGS.tarjetas_producidas_ADT"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-4">
              <q-input
                v-model="TextBalance_ADT"
                ref="textBalance_ADT"
                color="green"
                type="text"
                disabled
                :rules="rulesAddNombre_estacion"
                :label="STRINGS.balance_ADT"
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
import { ref, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
//import api from 'src/axios.js'
//import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteProvincia.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
//import notify_error from 'src/utils/notify/notify_error.js'

import imports from 'src/utils/imports'
const list = STRINGS.OpacityDialog

const refDialogoAdd = ref(null)
const Titulo = ref('')

const CambiarTitulo = () => {
  Titulo.value = imports.JoinCamelCase(STRINGS.areasDeTrabajoLowercase)
}

onBeforeMount(() => {
  CambiarTitulo()
})

/*Validaciones*/
const rulesAddCodigo_ADT = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]

const rulesAddNombre_ADT = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.TextAndNumber.test(val) || STRINGS.TextAndNumber,
]

/*Validaciones*/

/*const emit = defineEmits(['ActualizarTabla'])*/

/*Funcion de procesado de Datos*/
const SendData = async () => {
  //TODO: Realizar Petición
  notify_success('Falta por implementar')
  Reset()
}

/*Función que levanta el dialogo*/
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextNombre_ADT.value = ''
  TextCodigo_ADT.value = ''
  TextOtherCodigo_ADT.value = ''
  TextTarjetas_producidas_ADT.value = ''
  TextBalance_ADT.value = ''
}

const InputEmpty = () => {
  if (TextNombre_ADT.value.trim() !== '' && TextCodigo_ADT.value.trim() !== '') return true
  else return false
}

const InputRegularExpressions = () => {
  if (
    expRegulares.onlyUppercase.test(TextCodigo_ADT.value.trim()) &&
    expRegulares.TextAndNumber.test(TextNombre_ADT.value.trim())
  )
    return true
  else return false
}

const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

const dialog = ref(false)

const TextNombre_ADT = ref('')
const TextCodigo_ADT = ref('')
const TextOtherCodigo_ADT = ref('')
const TextTarjetas_producidas_ADT = ref('')
const TextBalance_ADT = ref('')

const textNombre_ADT = ref(null)
const textCodigo_ADT = ref(null)
const textOtherCodigo_ADT = ref(null)
const textTarjetas_producidas_ADT = ref(null)
const textBalance_ADT = ref(null)

const disabledBtnSave = ref(STRINGS.desabilitar)
const backdropFilter = ref(null)

defineExpose({
  getUpDialogAdd,
})
</script>
