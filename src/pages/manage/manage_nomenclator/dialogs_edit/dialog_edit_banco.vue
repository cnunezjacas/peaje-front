<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
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
                :rules="validaciones_generales.rulesOnlyText"
                type="text"
                :label="STRINGS.nombre_banco"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_banco"
                v-model="TextCodigo_banco"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyUppercase"
                :label="STRINGS.codigo_banco"
              />
            </div>

            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.detalles_banco }}:</p>
              <div class="bg-grey-4">
                <q-input v-model="TextDetalles_banco" class="q-pa-md" color="green" autogrow />
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
                @click="Reset()"
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

import api from 'src/axios.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import validaciones_generales from 'src/utils/validaciones_generales.js'

const list = STRINGS.OpacityDialog

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiBanco
  const existeCodigo = await verificarExistente(
    url,
    STRINGS.codigoBD,
    String(TextCodigo_banco.value),
  )
  return existeCodigo
}

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    if (InputDifferent() && TextCodigo_banco.value !== TextCodigo_banco_copy.value) {
      if (await CheckCode()) {
        // Verificar si el código ya existe
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.codigoRepetido)
        return textCodigo_banco.value.focus()
      }
    } else {
      const newItem = {
        nombre: TextNombre_banco.value.toUpperCase(),
        codigo: TextCodigo_banco.value,
        detalles: TextDetalles_banco.value.toUpperCase(),
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
      Reset()
    }
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (nombre, codigo, detalle, id) => {
  backdropFilter.value = list
  dialog.value = true

  TextCodigo_banco.value = codigo
  TextNombre_banco.value = nombre
  TextDetalles_banco.value = detalle
  _id.value = id

  //Copias de Seguridad
  TextCodigo_banco_copy.value = codigo
  TextNombre_banco_copy.value = nombre
  TextDetalles_banco_copy.value = detalle
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (TextCodigo_banco.value !== '' && TextNombre_banco.value !== '') return true
  else return false
}
/* Función para evaluar que los campos hallan sido modificados */
const InputDifferent = () => {
  return !(
    TextCodigo_banco.value === TextCodigo_banco_copy.value &&
    TextNombre_banco.value === TextNombre_banco_copy.value &&
    TextDetalles_banco.value === TextDetalles_banco_copy.value
  )
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyText.test(TextNombre_banco.value) &&
    expRegulares.onlyUppercase.test(TextCodigo_banco.value)
  )
    return true
  else return false
}

//Función para comprobar los campos y habilitar botón GUARDAR
const checkStatusInputs = () => {
  console.log('InputDifferent', InputDifferent())
  const isValid = InputEmpty() && InputRegularExpressions() && InputDifferent()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextCodigo_banco.value = ''
  TextNombre_banco.value = ''
  TextDetalles_banco.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/* Variables del dialogo */
const dialog = ref(false)
const backdropFilter = ref(null)

/* Referencias de variables de seguridad */
const TextCodigo_banco_copy = ref('')
const TextNombre_banco_copy = ref('')
const TextDetalles_banco_copy = ref('')
const _id = ref('')

/* Referencias de los modelos de los campos */
const TextNombre_banco = ref('')
const TextCodigo_banco = ref('')
const TextDetalles_banco = ref('')

/* Referencia del campo key */
const textCodigo_banco = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch([TextCodigo_banco, TextNombre_banco, TextDetalles_banco], () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
