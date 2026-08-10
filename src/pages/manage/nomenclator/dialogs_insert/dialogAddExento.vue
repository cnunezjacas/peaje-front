<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter"
      content-class="dialog-xl" :style="{ '--q-dialog-max-width': '800px' }">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.exempt.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input v-model="TextNombre_exento" ref="textNombre_exento" color="green" :rules="rulesNombre_exento"
                type="text" :label="STRINGS.name" @keyup="checkStatusInputs" />
            </div>
            <div class="col-5">
              <q-input ref="textCodigo_exento" v-model="TextCodigo_exento" color="green" type="text"
                :rules="rulesCodigo_exento" :label="STRINGS.code" @keyup="checkStatusInputs" />
            </div>
          </div>

          <div class="row flex justify-between q-mt-lg">
            <div class="col-12">
              <q-select v-model="TextNomenclador_exento" ref="textNomenclador_exento" :options="options"
                :rules="rulesNomenclador_exento" color="green" :label="STRINGS.nomenclator"
                @onchange="checkStatusInputs" outlined>
                <!-- Slot para agregar un botón al final del select -->
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>

            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.details }}:</p>
              <div class="bg-grey-4 q-pb-lg">
                <q-input ref="textDetalles_exento" v-model="TextDetalles_exento" :rules="rulesDetalles_exento"
                  class="q-pa-md" color="green" autogrow @keyup="checkStatusInputs" />
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
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteExento.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()

const list = STRINGS.OpacityDialog

const refDialogoAdd = ref(null)

/*Validaciones*/
const rulesNombre_exento = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.TextAndNumber.test(val) || STRINGS.TextAndNumber,
]

const rulesCodigo_exento = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]

const rulesNomenclador_exento = [(val) => val != '' || STRINGS.inputEmpty]

const rulesDetalles_exento = [(val) => val != '' || STRINGS.inputEmpty]
/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON

    // Verificar si el código ya existe
    const existeCodigo = await verificarCodigoExistente(TextCodigo_exento.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      textCodigo_exento.value.focus()
      return
    } else {
      const newItem = {
        nombre: TextNombre_exento.value,
        codigo: TextCodigo_exento.value.toUpperCase(),
        nomenclador: Number(TextNomenclador_exento.value),
        detalles: TextDetalles_exento.value,
      }

      try {
        await api.post(STRINGS.urlApiExento, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.exentoAddSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.exentoAddError)

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
  TextNombre_exento.value = ''
  TextCodigo_exento.value = ''

  TextNomenclador_exento.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

const InputEmpty = () => {
  if (
    TextCodigo_exento.value.trim() !== '' &&
    TextNombre_exento.value.trim() !== '' &&
    TextDetalles_exento.value.trim() !== '' &&
    TextNomenclador_exento.value !== null
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  if (
    expRegulares.onlyUppercase.test(TextCodigo_exento.value.trim()) &&
    expRegulares.TextAndNumber.test(TextNombre_exento.value.trim())
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
const backdropFilter = ref(null)

//V-model
const TextCodigo_exento = ref('')
const TextNombre_exento = ref('')
const TextNomenclador_exento = ref(null)
const TextDetalles_exento = ref('')

//ref
const textNombre_exento = ref(null)
const textCodigo_exento = ref(null)
const textDetalles_exento = ref(null)

const textNomenclador_exento = ref(null)
const options = [1, 2, 3, 4]
const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogAdd,
})
</script>
