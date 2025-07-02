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
          <span class="icon-text">{{ STRINGS.addMoneda.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-4">
              <div class="q-px-sm">
                <q-input
                  v-model="TextNombre_moneda"
                  ref="textNombre_moneda"
                  color="green"
                  :rules="rulesAddNombreMoneda"
                  type="text"
                  :label="STRINGS.nombre_moneda"
                  @keyup="checkStatusInputs"
                />
              </div>
            </div>
            <div class="col-4">
              <div class="q-px-sm">
                <q-input
                  ref="textSiglas_monedas"
                  v-model="TextSiglas_moneda"
                  color="green"
                  type="text"
                  :rules="rulesAddSiglasMoneda"
                  :label="STRINGS.siglas_moneda"
                  @keyup="checkStatusInputs"
                />
              </div>
            </div>

            <div class="col-4">
              <div class="q-px-sm">
                <q-input
                  v-model="TextTasaCambio_moneda"
                  ref="textTasaCambio_moneda"
                  color="green"
                  :rules="rulesAddTasaCambio_moneda"
                  type="text"
                  :label="STRINGS.tasaCambio_moneda"
                  @keyup="checkStatusInputs"
                />
              </div>
            </div>
          </div>

          <div class="row flex justify-between q-mt-lg">
            <div class="col-6">
              <div class="q-px-sm">
                <q-select
                  v-model="Textnomenclador_moneda"
                  :options="options"
                  :rules="rulesAddNomenclador_moneda"
                  color="green"
                  :label="STRINGS.nomenclador_moneda"
                  @onchange="checkStatusInputs"
                  outlined
                >
                  <!-- Slot para agregar un botón al final del select -->
                  <template v-slot:append>
                    <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                  </template>
                </q-select>
              </div>
            </div>

            <div class="col-5 flex justify-between">
              <div class="q-pt-sm">
                <p>{{ STRINGS.mBase_moneda }}:</p>
              </div>
              <div class="q-px-xs">
                <q-radio
                  v-model="TextmBase_moneda"
                  ref="textmBase_moneda"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  @onchange="checkStatusInputs"
                  :val="STRINGS.yes"
                  :label="STRINGS.yes"
                />
                <q-radio
                  v-model="TextmBase_moneda"
                  ref="textmBase_moneda"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  @onchange="checkStatusInputs"
                  :val="STRINGS.no"
                  :label="STRINGS.no"
                />
              </div>
            </div>
          </div>

          <div class="row flex justify-between q-mt-md">
            <div class="col-12">
              <div class="q-px-sm">
                <q-input
                  v-model="TextIdCondor_moneda"
                  ref="textIdCondor_moneda"
                  color="green"
                  :rules="rulesAddIdCondor_moneda"
                  type="text"
                  :label="STRINGS.idCondor_moneda"
                  @keyup="checkStatusInputs"
                />
              </div>
            </div>
          </div>

          <!-- <div class="row flex justify-center q-mt-md">
            <div class="col-12 q-mt-xs">
              <div class="q-px-sm">
                <p>{{ STRINGS.detalle_moneda }}:</p>
                <div class="bg-grey-4">
                  <q-input
                    ref="textDetalles_moneda"
                    v-model="TextDetalles_moneda"
                    class="q-pa-md"
                    color="green"
                    autogrow
                  />
                </div>
              </div>
            </div>
          </div> -->
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
import { ref, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteMoneda.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = 'blur(4px) saturate(150%)'

const refDialogoAdd = ref(null)

/*Validaciones*/
const rulesAddNombreMoneda = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyLetters,
]

const rulesAddSiglasMoneda = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]

const rulesAddTasaCambio_moneda = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => {
    // Reemplazar coma por punto para convertir a número
    const normalizedVal = val.replace(',', '.')
    // Validar que sea un número válido
    return (
      (!isNaN(parseFloat(normalizedVal)) && parseFloat(normalizedVal) >= 0) ||
      STRINGS.decimalPositive
    )
  },
]

const rulesAddNomenclador_moneda = [(val) => val != '' || STRINGS.inputEmpty]

const rulesAddIdCondor_moneda = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.condorTextID.test(val) || STRINGS.condorTextID,
]

/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON

    // Verificar si el código ya existe
    const existeCodigo = await verificarCodigoExistente(TextSiglas_moneda.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario

      notify_error(STRINGS.siglasRepetidas)

      textSiglas_monedas.value.focus()
      return
    } else {
      const newItem = {
        nombre: TextNombre_moneda.value,
        siglas: TextSiglas_moneda.value,
        nomenclador: Number(Textnomenclador_moneda.value),
        tasa: Number(TextTasaCambio_moneda.value),
        condor: TextIdCondor_moneda.value,
        moneda: TextmBase_moneda.value,
      }

      try {
        await api.post(STRINGS.urlApiMoneda, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.monedaAddSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.monedaAddError)

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
  TextSiglas_moneda.value = ''
  TextNombre_moneda.value = ''
  TextTasaCambio_moneda.value = ''
  Textnomenclador_moneda.value = ''
  TextmBase_moneda.value = ''
  TextIdCondor_moneda.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
  //TextDetalles_moneda.value = ''
}

const InputEmpty = () => {
  if (
    TextNombre_moneda.value.trim() === '' ||
    TextSiglas_moneda.value.trim() === '' ||
    TextTasaCambio_moneda.value === '' ||
    Textnomenclador_moneda.value === '' ||
    TextmBase_moneda.value === '' ||
    TextIdCondor_moneda.value.trim() === ''
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  let TazaCambio = EvaluarTazaCambio()

  let InputValidated =
    expRegulares.onlyText.test(TextNombre_moneda.value) &&
    expRegulares.onlyUppercase.test(TextSiglas_moneda.value) &&
    Textnomenclador_moneda.value !== null &&
    expRegulares.condorTextID.test(TextIdCondor_moneda.value) &&
    TazaCambio === true &&
    TextmBase_moneda.value !== null

  return InputValidated
}

const checkStatusInputs = () => {
  var isEmpty = InputEmpty()
  var InputValidated = InputRegularExpressions()

  if (isEmpty) {
    disabledBtnSave.value = STRINGS.desabilitar
  } else if (!InputValidated) {
    disabledBtnSave.value = STRINGS.desabilitar
  } else {
    disabledBtnSave.value = ''
  }

  return disabledBtnSave.value
}

const dialog = ref(false)

const TextSiglas_moneda = ref('')
const TextNombre_moneda = ref('')
const TextTasaCambio_moneda = ref('')
const Textnomenclador_moneda = ref('')
const TextmBase_moneda = ref('')
const TextIdCondor_moneda = ref('')
//const TextDetalles_moneda = ref('')

const options = [1, 2, 3, 4]

const backdropFilter = ref(null)

const textNombre_moneda = ref(null)
const textSiglas_monedas = ref(null)
const textTasaCambio_moneda = ref(null)
const textmBase_moneda = ref(null)
const textIdCondor_moneda = ref(null)
//const textDetalles_moneda = ref(null)

const disabledBtnSave = ref(STRINGS.desabilitar)

const EvaluarTazaCambio = () => {
  return !isNaN(parseFloat(TextTasaCambio_moneda.value)) &&
    parseFloat(TextTasaCambio_moneda.value) >= 0
    ? true
    : false
}

watch(TextmBase_moneda, () => {
  checkStatusInputs()
})

watch(Textnomenclador_moneda, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
