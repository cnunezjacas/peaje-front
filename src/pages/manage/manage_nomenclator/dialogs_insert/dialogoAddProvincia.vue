<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.addProvincia.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_prov"
                color="green"
                :rules="validaciones_generales.rulesOnlyText"
                type="text"
                :label="STRINGS.nombre_prov"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_prov"
                v-model="TextCodigo_prov"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyNumbers"
                :label="STRINGS.codigo_prov"
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
import api from 'src/axios.js'
import verificarCodigoExistente from 'utils/utils_axios/nomencladores/verificarCodigoExistenteProvincia.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'
import validaciones_generales from 'src/utils/validaciones_generales'
validaciones_generales

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    const existeCodigo = await verificarCodigoExistente(TextCodigo_prov.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      textCodigo_prov.value.focus()
      return
    } else {
      const newItem = { nombre: TextNombre_prov.value, codigo: Number(TextCodigo_prov.value) }

      try {
        await api.post(STRINGS.urlApiProvincia, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.provinciaAddSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.provinciaAddError)

        emit('ActualizarTabla', false)
      }
      dialog.value = false
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
  TextCodigo_prov.value = ''
  TextNombre_prov.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (TextCodigo_prov.value.trim() !== '' && TextNombre_prov.value.trim() !== '') return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyNumber.test(TextCodigo_prov.value) &&
    expRegulares.onlyText.test(TextNombre_prov.value)
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
const list = 'blur(4px) saturate(150%)'
const refDialogoAdd = ref(null)

//Ref Variables
const TextCodigo_prov = ref('')
const TextNombre_prov = ref('')
const backdropFilter = ref(null)

//Ref key
const textCodigo_prov = ref(null)

//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogAdd,
})
</script>
