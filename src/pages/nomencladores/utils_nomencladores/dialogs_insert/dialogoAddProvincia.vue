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
                ref="textNombre_prov"
                color="green"
                :rules="rulesAddNombreProvincia"
                type="text"
                :label="STRINGS.nombre_prov"
                @keyup="ComprobarEstadoInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_prov"
                v-model="TextCodigo_prov"
                color="green"
                type="text"
                :rules="rulesAddCodigoProvincia"
                :label="STRINGS.codigo_prov"
                @keyup="ComprobarEstadoInputs"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn
                icon="check"
                :class="disabledBtnSaveEdit"
                @click="Procesar_Add()"
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
import { STRINGS } from '../../../../utils/string.js'
import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteProvincia.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = 'blur(4px) saturate(150%)'

const refDialogoAdd = ref(null)

/*Validaciones*/
const rulesAddNombreProvincia = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.FullText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCodigoProvincia = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]
/*Validaciones*/

const emit = defineEmits(['ActualizarTablaProvincia'])

/*Funcion de procesado de Datos*/
const Procesar_Add = async () => {
  if (ComprobarEstadoInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON

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

        emit('ActualizarTablaProvincia', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.provinciaAddError)

        emit('ActualizarTablaProvincia', false)
      }
      refDialogoAdd.value.hide()
      Reset()
    }
  }
}

/*Función que levanta el dialogo*/
const LevantarDialogoAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  TextCodigo_prov.value = ''
  TextNombre_prov.value = ''
}

const ComprobarEstadoInputs = () => {
  if (TextCodigo_prov.value != '' && expRegulares.onlyNumber.test(TextCodigo_prov.value))
    if (TextNombre_prov.value != '' && expRegulares.FullText.test(TextNombre_prov.value))
      disabledBtnSaveEdit.value = ''
    else disabledBtnSaveEdit.value = STRINGS.desabilitar
  else disabledBtnSaveEdit.value = STRINGS.desabilitar

  return disabledBtnSaveEdit.value
}

const dialog = ref(false)

const TextCodigo_prov = ref('')
const TextNombre_prov = ref('')
const backdropFilter = ref(null)

const textNombre_prov = ref(null)
const textCodigo_prov = ref(null)
const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  LevantarDialogoAdd,
})
</script>
