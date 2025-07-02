<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.addBanco.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_banco"
                ref="textNombre_banco"
                color="green"
                :rules="rulesAddNombreBanco"
                type="text"
                :label="STRINGS.nombre_banco"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_banco"
                v-model="TextCodigo_banco"
                color="green"
                type="text"
                :rules="rulesAddCodigoBanco"
                :label="STRINGS.codigo_banco"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.detalles_banco }}:</p>
              <div class="bg-grey-4">
                <q-input
                  ref="textDetalles_banco"
                  v-model="TextDetalles_banco"
                  class="q-pa-md"
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
                :class="disabledBtnSaveEdit"
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
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteBanco.js'
import imports from 'src/utils/imports.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = 'blur(4px) saturate(150%)'

const refDialogoAdd = ref(null)

/*Validaciones*/
const rulesAddNombreBanco = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCodigoBanco = [
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
    const existeCodigo = await verificarCodigoExistente(TextCodigo_banco.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)

      textCodigo_banco.value.focus()
      return
    } else {
      const newItem = {
        nombre: imports.capitalizeWords(TextNombre_banco.value),
        codigo: TextCodigo_banco.value,
        detalles: TextDetalles_banco.value,
      }

      try {
        await api.post(STRINGS.urlApiBanco, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.bancoAddSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)

        notify_error(STRINGS.bancoAddError)

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
  TextCodigo_banco.value = ''
  TextNombre_banco.value = ''
  TextDetalles_banco.value = ''
}

const checkStatusInputs = () => {
  if (TextCodigo_banco.value != '' && expRegulares.onlyUppercase.test(TextCodigo_banco.value))
    if (TextNombre_banco.value != '' && expRegulares.onlyText.test(TextNombre_banco.value))
      disabledBtnSaveEdit.value = ''
    else disabledBtnSaveEdit.value = STRINGS.desabilitar
  else disabledBtnSaveEdit.value = STRINGS.desabilitar

  return disabledBtnSaveEdit.value
}

const dialog = ref(false)
const backdropFilter = ref(null)

const TextNombre_banco = ref('')
const TextCodigo_banco = ref('')
const TextDetalles_banco = ref('')
const textCodigo_banco = ref(null)

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({ getUpDialogAdd })
</script>
