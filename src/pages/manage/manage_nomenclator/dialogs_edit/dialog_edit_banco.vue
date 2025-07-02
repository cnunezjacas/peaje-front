<template>
  <div class="">
    <q-dialog
      v-model="dialogEditBanco"
      persistent
      ref="refDialogoEditProvincia"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.editBanco.toUpperCase() }}</span>
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
                :class="disabledBtnSaveEdit"
                @click="Procesar_EditBanco()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                @click="DevolverEstadoInputsEdit"
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

import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteBanco.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import imports from 'src/utils/imports.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = STRINGS.OpacityDialog

const refDialogoEditProvincia = ref(null)

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
const Procesar_EditBanco = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    var existeCodigo = false

    if (TextCodigo_banco.value !== TextCodigo_banco_copy.value)
      existeCodigo = await verificarCodigoExistente(TextCodigo_banco.value)

    if (existeCodigo ? true : false) {
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
        await api.patch(STRINGS.urlApiBanco + '/' + _id.value, newItem) // POST /items
        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.bancoEditSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.bancoEditError)

        emit('ActualizarTabla', false)
      }
      refDialogoEditProvincia.value.hide()
      Reset()
    }
  } else {
    refDialogoEditProvincia.value.show()
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (nombre, codigo, detalle, id) => {
  backdropFilter.value = list
  dialogEditBanco.value = true

  TextCodigo_banco.value = codigo
  TextNombre_banco.value = nombre
  TextDetalles_banco.value = detalle
  _id.value = id

  //Copias de Seguridad
  TextCodigo_banco_copy.value = codigo
  TextNombre_banco_copy.value = nombre
  TextDetalles_banco_copy.value = nombre
}

const checkStatusInputs = () => {
  // Si ambos campos son iguales a sus valores originales, deshabilitar
  const noHaCambiado =
    TextCodigo_banco.value === TextCodigo_banco_copy.value &&
    TextNombre_banco.value === TextNombre_banco_copy.value &&
    TextDetalles_banco.value === TextDetalles_banco_copy.value

  if (TextCodigo_banco.value.trim() === '' || TextNombre_banco.value.trim() === '') {
    // Si algún campo está vacío, deshabilitar
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (noHaCambiado) {
    // Si no ha cambiado nada, deshabilitar
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (
    !expRegulares.onlyText.test(TextNombre_banco.value) ||
    !expRegulares.onlyUppercase.test(TextCodigo_banco.value)
  ) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else {
    // Si hay cambios, habilitar
    disabledBtnSaveEdit.value = ''
  }

  return disabledBtnSaveEdit.value
}

const DevolverEstadoInputsEdit = () => {
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  TextCodigo_banco.value = ''
  TextNombre_banco.value = ''
  TextDetalles_banco.value = ''
}

const dialogEditBanco = ref(false)

const TextCodigo_banco_copy = ref('')
const TextNombre_banco_copy = ref('')
const TextDetalles_banco_copy = ref('')

const _id = ref('')
const backdropFilter = ref(null)

const TextNombre_banco = ref('')
const TextCodigo_banco = ref('')
const TextDetalles_banco = ref('')
const textCodigo_banco = ref(null)

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogEdit,
})
</script>
