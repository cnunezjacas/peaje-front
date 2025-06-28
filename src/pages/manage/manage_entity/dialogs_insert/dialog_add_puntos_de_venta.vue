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
          <span class="icon-text"
            >{{ STRINGS.add.toUpperCase() }} {{ STRINGS.name_puntos_venta.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre -->
          <div class="row flex justify-between q-mb-lg">
            <div class="col-5">
              <q-input
                v-model="TextCodigo_PDV"
                ref="textCodigo_PDV"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesOnlyNumbers"
                :label="STRINGS.codigo_PDV"
                lazy-rules
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-5">
              <q-input
                v-model="TextDescripcion_PDV"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesFullTextAndNumber"
                lazy-rules
                :label="STRINGS.descripcion_PDV"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <div class="row flex justify-between q-mb-lg">
            <div class="col-3 row border-box-radio">
              <div class="col-6 text-center q-mt-md">
                <p>{{ STRINGS.cabina_PDV }}:</p>
              </div>

              <div class="col-6 text-center">
                <q-checkbox
                  v-model="TextCabina_PDV"
                  keep-color
                  color="green-5"
                  @change="checkStatusInputs"
                />
              </div>
            </div>

            <div class="col-4">
              <q-input
                v-model="TextIPGaveta_PDV"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesIP"
                :label="STRINGS.ipGaveta_PDV"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-4">
              <q-input
                v-model="TextIPBarrera_PDV"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesIP"
                :label="STRINGS.ipBarrera_PDV"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <div class="row q-mb-md">
            <div class="col-12">
              <p>{{ STRINGS.parametros_PDV }}</p>
            </div>

            <div class="col-12 row flex justify-between">
              <div class="col-5">
                <q-input
                  v-model="TextMaxDiasSinColectar_PDV"
                  color="green"
                  type="text"
                  :rules="validacionesGenerales.rulesOnlyNumbers"
                  :label="STRINGS.maxDiasSinColectar_PDV"
                  @keyup="checkStatusInputs"
                />
              </div>

              <div class="col-5">
                <q-input
                  v-model="TextDuracionMaximaDelTurno_PDV"
                  color="green"
                  type="time"
                  :rules="validacionesGenerales.rulesNoEmpty"
                  :label="STRINGS.DuracionMaximaDelTurno_PDV"
                  @keyup="checkStatusInputs"
                />
              </div>
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
import { ref, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
//import api from 'src/axios.js'
//import verificarCuentaDeBanco from 'utils/utils_axios/entity/verificarCuentaDeBanco.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import validacionesGenerales from 'utils/validaciones_generales.js'
import notify_success from 'src/utils/notify/notify_success.js'
//import notify_error from 'src/utils/notify/notify_error.js'
//import imports from 'src/utils/imports'

//import imports from 'src/utils/imports'

//const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  //TODO: Send Add
  if (disabledBtnSave.value !== STRINGS.desabilitar) {
    notify_success('Correcto!')
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
  TextCodigo_PDV.value = ''
  TextDescripcion_PDV.value = ''
  TextCabina_PDV.value = ''
  TextIPGaveta_PDV.value = ''
  TextIPBarrera_PDV.value = ''
  TextMaxDiasSinColectar_PDV.value = ''
  TextDuracionMaximaDelTurno_PDV.value = ''
}

const InputEmpty = () => {
  if (
    TextCodigo_PDV.value.trim() !== '' &&
    TextDescripcion_PDV.value.trim() !== '' &&
    TextCabina_PDV.value !== false &&
    TextIPGaveta_PDV.value !== '' &&
    TextIPBarrera_PDV.value !== '' &&
    TextMaxDiasSinColectar_PDV.value !== '' &&
    TextDuracionMaximaDelTurno_PDV.value !== ''
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  if (
    expRegulares.onlyNumber.test(TextCodigo_PDV.value) &&
    expRegulares.FullTextAndNumber.test(TextDescripcion_PDV.value) &&
    expRegulares.ip.test(TextIPGaveta_PDV.value) &&
    expRegulares.ip.test(TextIPBarrera_PDV.value) &&
    expRegulares.onlyNumber.test(TextMaxDiasSinColectar_PDV.value)
  )
    return true
  else return false
}

const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

//Ref Dialog
const dialog = ref(false)
const backdropFilter = ref(null)
const list = 'blur(4px) saturate(150%)'
const refDialogoAdd = ref(null)

//Variables Banco
const TextCodigo_PDV = ref('')
const TextDescripcion_PDV = ref('')
const TextCabina_PDV = ref('')
const TextIPGaveta_PDV = ref('')
const TextIPBarrera_PDV = ref('')
const TextMaxDiasSinColectar_PDV = ref('')
const TextDuracionMaximaDelTurno_PDV = ref('')

//REF Codigo
const textCodigo_PDV = ref(null)

//REF Botón Send
const disabledBtnSave = ref(STRINGS.desabilitar)

//Cambios en Casos Especiales
watch(TextCabina_PDV, () => {
  checkStatusInputs()
})

//Expone funciones en componente padre
defineExpose({
  getUpDialogAdd,
})
</script>
