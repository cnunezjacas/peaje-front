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
            >{{ STRINGS.add.toUpperCase() }} {{ STRINGS.operadoresLowercase.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre -->
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombreApellido_operador"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesFullText"
                :label="STRINGS.nombreApellidos_operador"
                lazy-rules
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-5">
              <q-input
                v-model="TextAlias_operador"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesNickName"
                lazy-rules
                :label="STRINGS.alias_operador"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <div class="text-start q-mt-md">
            <p>{{ STRINGS.estado_operador.toUpperCase() }}</p>
          </div>
          <div class="row flex justify-between">
            <div class="col-6 row border-box-radio">
              <div class="col-4 text-center">
                <q-radio
                  v-model="TextEstado_operador"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  :val="STRINGS.active"
                  :label="STRINGS.active"
                  @change="checkStatusInputs"
                />
              </div>
              <div class="col-4 text-center">
                <q-radio
                  v-model="TextEstado_operador"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  :val="STRINGS.noActive"
                  :label="STRINGS.noActive"
                  @change="checkStatusInputs"
                />
              </div>
            </div>

            <div class="col-5">
              <q-input
                v-model="TextCodigo_operador"
                ref="textCodigo_operador"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesFullTextAndNumber"
                :label="STRINGS.codigoAcceso_terminal"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.detalles_operador }}:</p>
              <div class="bg-grey-4">
                <q-input
                  v-model="TextDetalles_operador"
                  class="q-pa-md"
                  disable
                  color="green"
                  autogrow
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
const list = 'blur(4px) saturate(150%)'

const refDialogoAdd = ref(null)

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
  TextNombreApellido_operador.value = ''
  TextAlias_operador.value = ''
  TextEstado_operador.value = ''
  TextCodigo_operador.value = ''
  TextDetalles_operador.value = ''
}

const InputEmpty = () => {
  if (
    TextNombreApellido_operador.value.trim() !== '' &&
    TextAlias_operador.value.trim() !== '' &&
    TextEstado_operador.value !== '' &&
    TextCodigo_operador.value !== ''
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  if (
    expRegulares.FullText.test(TextNombreApellido_operador.value) &&
    expRegulares.nickName.test(TextAlias_operador.value) &&
    expRegulares.FullTextAndNumber.test(TextCodigo_operador.value)
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

//Variables Banco
const TextNombreApellido_operador = ref('')
const TextAlias_operador = ref('')
const TextEstado_operador = ref('')
const TextCodigo_operador = ref('')
const TextDetalles_operador = ref('')

//REF Banco

const textCodigo_operador = ref(null)

const disabledBtnSave = ref(STRINGS.desabilitar)
const backdropFilter = ref(null)

//Casos Especiales
watch(TextEstado_operador, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
