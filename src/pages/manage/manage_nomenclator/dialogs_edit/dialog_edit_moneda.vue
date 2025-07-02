<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoEdit" :backdrop-filter="backdropFilter">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.editMoneda.toUpperCase() }}</span>
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
                  type="number"
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
                  ref="textnomenclador_moneda"
                  :options="options"
                  :rules="rulesAddNomenclador_moneda"
                  color="green"
                  :label="STRINGS.nomenclador_moneda"
                  outlined
                  @change="checkStatusInputs"
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
                  :val="STRINGS.yes"
                  :label="STRINGS.yes"
                  @change="checkStatusInputs"
                />
                <q-radio
                  v-model="TextmBase_moneda"
                  ref="textmBase_moneda"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  :val="STRINGS.no"
                  :label="STRINGS.no"
                  @change="checkStatusInputs"
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
                :class="disabledBtnSaveEdit"
                @click="Procesar_Edit()"
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

const list = STRINGS.OpacityDialog

const refDialogoEdit = ref(null)

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
const Procesar_Edit = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    var existeCodigo = false

    // Verificar si el código ya existe
    if (TextSiglas_moneda.value !== TextSiglas_moneda_copy.value)
      existeCodigo = await verificarCodigoExistente(TextSiglas_moneda.value)

    if (existeCodigo ? true : false) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
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

      console.log(newItem.val)

      try {
        await api.patch(STRINGS.urlApiMoneda + '/' + IdMoneda.value, newItem) // POST /items
        notify_success(STRINGS.monedaEditSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.municipioEditError)
        emit('ActualizarTabla', false)
      }
      refDialogoEdit.value.hide()
      Reset()
    }
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (siglas, nombre, tasaCambio, nomenclador, mBase, idCondor, id) => {
  backdropFilter.value = list
  dialog.value = true

  TextSiglas_moneda.value = siglas
  TextNombre_moneda.value = nombre
  TextTasaCambio_moneda.value = String(tasaCambio)
  Textnomenclador_moneda.value = nomenclador
  TextmBase_moneda.value = mBase
  TextIdCondor_moneda.value = idCondor

  TextSiglas_moneda_copy.value = siglas
  TextNombre_moneda_copy.value = nombre
  TextTasaCambio_moneda_copy.value = String(tasaCambio)
  Textnomenclador_moneda_copy.value = nomenclador
  TextmBase_moneda_copy.value = mBase
  TextIdCondor_moneda_copy.value = idCondor
  IdMoneda.value = id
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

const InputDifferent = () => {
  let HaCambiado =
    TextNombre_moneda.value !== TextNombre_moneda_copy.value ||
    TextSiglas_moneda.value !== TextSiglas_moneda_copy.value ||
    TextTasaCambio_moneda.value !== TextTasaCambio_moneda_copy.value ||
    Textnomenclador_moneda.value !== Textnomenclador_moneda_copy.value ||
    TextmBase_moneda.value !== TextmBase_moneda_copy.value ||
    TextIdCondor_moneda.value !== TextIdCondor_moneda_copy.value

  return HaCambiado
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
  var noChange = InputDifferent()
  var InputValidated = InputRegularExpressions()

  if (isEmpty) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (!noChange) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (!InputValidated) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else {
    disabledBtnSaveEdit.value = ''
  }

  return disabledBtnSaveEdit.value
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
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

const dialog = ref(false)

//Campos Originales
const TextSiglas_moneda = ref('')
const TextNombre_moneda = ref('')
const TextTasaCambio_moneda = ref('')
const Textnomenclador_moneda = ref('')
const TextmBase_moneda = ref('')
const TextIdCondor_moneda = ref('')
const IdMoneda = ref('')

//Campos Copias
const TextSiglas_moneda_copy = ref('')
const TextNombre_moneda_copy = ref('')
const TextTasaCambio_moneda_copy = ref('')
const Textnomenclador_moneda_copy = ref('')
const TextmBase_moneda_copy = ref('')
const TextIdCondor_moneda_copy = ref('')

const options = [1, 2, 3, 4]

const backdropFilter = ref(null)

const textNombre_moneda = ref(null)
const textSiglas_monedas = ref(null)
const textTasaCambio_moneda = ref(null)
const textmBase_moneda = ref(null)
const textIdCondor_moneda = ref(null)
const textnomenclador_moneda = ref(null)
//const textDetalles_moneda = ref(null)

const EvaluarTazaCambio = () => {
  return parseFloat(TextTasaCambio_moneda.value) >= 0 ? true : false
}

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

watch(TextmBase_moneda, () => {
  checkStatusInputs()
})

watch(Textnomenclador_moneda, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogEdit,
})
</script>
