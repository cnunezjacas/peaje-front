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
            >{{ STRINGS.add.toUpperCase() }} {{ STRINGS.tipoCuentaLowercase.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_tipoCuenta"
                ref="textNombre_tipoCuenta"
                color="green"
                :rules="rulesAddNombre_tipoCuenta"
                type="text"
                :label="STRINGS.nombre_tipoCuenta"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                v-model="TextCodigo_tipoCuenta"
                ref="textCodigo_tipoCuenta"
                color="green"
                type="text"
                :rules="rulesAddCodigo_tipoCuenta"
                :label="STRINGS.codigo_tipoCuenta"
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
import api from 'src/boot/api.js'
import verificarCodigoExistente from 'utils/utils_axios/nomencladores/verificarCodigoExistenteTipoCuenta.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()

const list = STRINGS.OpacityDialog
const refDialogoAdd = ref(null)

/*Validaciones*/
const rulesAddNombre_tipoCuenta = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyText,
]

const rulesAddCodigo_tipoCuenta = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]
/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON

    // Verificar si el código ya existe
    const existeCodigo = await verificarCodigoExistente(TextCodigo_tipoCuenta.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      textCodigo_tipoCuenta.value.focus()
      return
    } else {
      const newItem = {
        nombre: TextNombre_tipoCuenta.value,
        codigo: TextCodigo_tipoCuenta.value,
      }

      try {
        await api.post(STRINGS.urlApiTipoCuenta, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.tipoCuenta_AddSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.tipoCuenta_AddError)

        emit('ActualizarTabla', false)
      }
      refDialogoAdd.value.hide()
      Reset()
    }
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
  TextNombre_tipoCuenta.value = ''
  TextCodigo_tipoCuenta.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

const InputEmpty = () => {
  if (TextNombre_tipoCuenta.value.trim() !== '' && TextCodigo_tipoCuenta.value.trim() !== '')
    return true
  else return false
}

const InputRegularExpressions = () => {
  if (
    expRegulares.onlyUppercase.test(TextCodigo_tipoCuenta.value) &&
    expRegulares.onlyText.test(TextNombre_tipoCuenta.value)
  )
    return true
  else return false
}

const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  console.log('isValid:' + isValid)
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

const dialog = ref(false)
const backdropFilter = ref(null)

//V-model
const TextNombre_tipoCuenta = ref('')
const TextCodigo_tipoCuenta = ref('')

//Ref
const textNombre_tipoCuenta = ref(null)
const textCodigo_tipoCuenta = ref(null)

const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogAdd,
})
</script>
