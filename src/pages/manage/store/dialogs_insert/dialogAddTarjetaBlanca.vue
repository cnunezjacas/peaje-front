<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card style="width: 500px; max-width: 80vw">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{
            imports.JoinCamelCase(STRINGS.tarjeta_blancaLowercase, true).toUpperCase()
            }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-7">
              <q-input v-model="TextCodigoProducto_TB" color="green"
                :rules="validaciones_generales.rulesFullTextAndNumber" type="text" :label="STRINGS.codigo_tarjetaBanca"
                @keyup="checkStatusInputs" />
            </div>
            <div class="col-3">
              <div class="row border-box-radio">
                <div class="col-6 text-center q-mt-md">
                  <p>{{ STRINGS.sam }}:</p>
                </div>

                <div class="col-6 text-center">
                  <q-checkbox v-model="TextSam_TB" keep-color color="green-5" @change="checkStatusInputs" />
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.descripcion_tarjetaBanca }}:</p>
              <div class="bg-grey-4">
                <q-input v-model="TextDescripcion_TB" class="q-pa-md" color="green" autogrow />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn icon="check" :class="disabledBtnSave" @click="SendData()" :label="STRINGS.save" color="green" />
            </div>

            <div class="">
              <q-btn flat icon="close" :label="STRINGS.close" v-on:click="Reset" color="dark" v-close-popup />
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
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import imports from 'src/utils/imports'
validaciones_generales
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success/*, notify_error*/ } = useNotify()

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
  TextSam_TB.value = ''
  TextDescripcion_TB.value = ''
  TextCodigoProducto_TB.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    TextCodigoProducto_TB.value.trim() !== '' &&
    TextDescripcion_TB.value !== '' &&
    TextSam_TB.value !== false
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (expRegulares.TextAndNumber.test(TextCodigoProducto_TB.value)) return true
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
const TextCodigoProducto_TB = ref('')
const TextSam_TB = ref('')
const TextDescripcion_TB = ref('')
const backdropFilter = ref(null)

//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

watch(TextSam_TB, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
