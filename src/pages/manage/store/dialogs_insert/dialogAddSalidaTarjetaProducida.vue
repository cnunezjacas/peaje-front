<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{
            imports.JoinCamelCase(STRINGS.salida_de_tarjeta_producidaLowercase).toUpperCase()
          }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between q-mb-lg">
            <div class="col-4">
              <q-input v-model="TextNumero_STP" color="green"
                :rules="validaciones_generales.rulesCodeThreeLettersHyphenNumbers" type="text"
                :label="STRINGS.numero_STP" @keyup="checkStatusInputs" />
            </div>

            <div class="col-4">
              <q-input v-model="TextTipoSalida_STP" color="green" :rules="validaciones_generales.rulesOnlyText"
                type="text" :label="STRINGS.tipoSalida_STP" @keyup="checkStatusInputs" />
            </div>

            <div class="col-3">
              <q-input v-model="TextFechaCreada_STP" color="green" type="date"
                :rules="validaciones_generales.rulesNoEmpty" :label="STRINGS.fechaCreada_STP"
                @keyup="checkStatusInputs" />
            </div>
          </div>

          <!-- Destinatario - Registado - Numero de Orden de Trabajo -->
          <div class="row flex justify-between">
            <div class="col-4">
              <q-input v-model="TextDestinatario_STP" color="green" :rules="validaciones_generales.rulesOnlyText"
                type="text" :label="STRINGS.destinatario_STP" @keyup="checkStatusInputs" />
            </div>

            <div class="col-4">
              <q-input v-model="TextRegistrado_STP" color="green" :rules="validaciones_generales.rulesOnlyText"
                type="text" :label="STRINGS.registrado_STP" @keyup="checkStatusInputs" />
            </div>

            <div class="col-3">
              <q-input v-model="TextNumOrdenTrabajo_STP" ref="textCodigo_proveedor" color="green" type="text"
                :rules="validaciones_generales.rulesCodeThreeLettersHyphenNumbers" :label="STRINGS.numOrdenTrabajo_STP"
                @keyup="checkStatusInputs" />
            </div>
          </div>

          <!-- TODO: Componente que muestre listado de tarjetas producidas -->
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
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success/*, notify_error*/ } = useNotify()

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
  TextNumero_STP.value = ''
  TextTipoSalida_STP.value = ''
  TextFechaCreada_STP.value = ''
  TextDestinatario_STP.value = ''
  TextRegistrado_STP.value = ''
  TextNumOrdenTrabajo_STP.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    TextNumero_STP.value !== '' &&
    TextTipoSalida_STP.value !== '' &&
    TextFechaCreada_STP.value !== '' &&
    TextDestinatario_STP.value !== '' &&
    TextRegistrado_STP.value != '' &&
    TextNumOrdenTrabajo_STP.value != ''
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.codeThreeLettersHyphenNumbers.test(TextNumero_STP.value) &&
    expRegulares.onlyText.test(TextTipoSalida_STP.value) &&
    expRegulares.onlyText.test(TextDestinatario_STP.value) &&
    expRegulares.onlyText.test(TextRegistrado_STP.value) &&
    expRegulares.codeThreeLettersHyphenNumbers.test(TextNumOrdenTrabajo_STP.value)
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
const TextNumero_STP = ref('')
const TextTipoSalida_STP = ref('')
const TextFechaCreada_STP = ref('')
const TextDestinatario_STP = ref('')
const TextRegistrado_STP = ref('')
const TextNumOrdenTrabajo_STP = ref('')
const backdropFilter = ref(null)

//Ref key
const textCodigo_proveedor = ref(null)

//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

watch(TextFechaCreada_STP, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
