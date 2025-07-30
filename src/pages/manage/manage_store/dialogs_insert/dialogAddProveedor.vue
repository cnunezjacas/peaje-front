<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card style="width: 500px; max-width: 80vw">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.proveedorLowercase.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_proveedor"
                color="green"
                :rules="validaciones_generales.rulesOnlyText"
                type="text"
                :label="STRINGS.nombre"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                v-model="TextCodigo_proveedor"
                ref="textCodigo_proveedor"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyNumbers"
                :label="STRINGS.codigo"
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
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
/* import api from 'src/axios.js' */
/* import verificarCodigoExistente from 'utils/utils_axios/nomencladores/verificarCodigoExistenteProvincia.js' */
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
/* import notify_error from 'src/utils/notify/notify_error.js' */
import validaciones_generales from 'src/utils/validaciones_generales'
validaciones_generales

/* const emit = defineEmits(['ActualizarTabla']) */

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    notify_success('Exito')
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
  TextCodigo_proveedor.value = ''
  TextNombre_proveedor.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (TextCodigo_proveedor.value.trim() !== '' && TextNombre_proveedor.value.trim() !== '')
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyNumber.test(TextCodigo_proveedor.value) &&
    expRegulares.onlyText.test(TextNombre_proveedor.value)
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
const TextCodigo_proveedor = ref('')
const TextNombre_proveedor = ref('')
const backdropFilter = ref(null)

//Ref key
const textCodigo_proveedor = ref(null)

//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogAdd,
})
</script>
