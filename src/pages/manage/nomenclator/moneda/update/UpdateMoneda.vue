<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.edit.toUpperCase() }} - {{ STRINGS.currency.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-4">
              <div class="q-px-sm">
                <q-input
                  v-model="TextNombre_moneda"
                  color="green"
                  :rules="validaciones_generales.rulesOnlyText"
                  type="text"
                  :label="STRINGS.name"
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
                  :rules="validaciones_generales.rulesOnlyUppercase"
                  :label="STRINGS.acronym"
                  @keyup="checkStatusInputs"
                />
              </div>
            </div>

            <div class="col-4">
              <div class="q-px-sm">
                <q-input
                  v-model="TextTasaCambio_moneda"
                  color="green"
                  :rules="validaciones_generales.rulesExchangeRate"
                  type="text"
                  :label="STRINGS.tasa_de_Cambio"
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
                  :rules="validaciones_generales.rulesNoEmpty"
                  color="green"
                  :label="STRINGS.nomenclator"
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
                <p>{{ STRINGS.moneda_base }}:</p>
              </div>
              <div class="q-px-xs">
                <q-radio
                  v-model="TextmBase_moneda"
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
                  color="green"
                  :rules="validaciones_generales.rulesCondorTextID"
                  type="text"
                  :label="STRINGS.id_condor"
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
                :class="disabledBtnSave"
                @click="CheckData()"
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
import { useApi } from 'src/composables/useApi'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import CheckField from 'src/utils/utils_axios/nomencladores/CheckField.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
const { fetchData, patchData } = useApi()

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiMoneda
  const result = await CheckField(
    url,
    STRINGS.acronym.toLocaleLowerCase(),
    String(TextSiglas_moneda.value),
    fetchData,
  )
  return result
}

/* Comprueba que existan cambios y que el código key no sea repetido */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (InputDifferent() && TextSiglas_moneda.value !== TextSiglas_moneda_copy.value) {
      if (await CheckCode()) {
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.siglasRepetidas)
        return textSiglas_monedas.value.focus()
      } else {
        SendData()
      }
    } else {
      SendData()
    }
  }
}

/*Funcion de procesado de Datos*/
const SendData = async () => {
  const newItem = {
    nombre: TextNombre_moneda.value.toUpperCase(),
    siglas: TextSiglas_moneda.value,
    nomenclador: Number(Textnomenclador_moneda.value),
    tasa: Number(TextTasaCambio_moneda.value),
    condor: TextIdCondor_moneda.value,
    moneda: TextmBase_moneda.value,
  }

  try {
    const { data, error } = await patchData(STRINGS.urlApiMoneda + '/' + _id.value, newItem) // POST /items

    if (!data && error) return notify_error(`${STRINGS.errorEdit} ${STRINGS.currency}`)

    notify_success(`${STRINGS.currency} ${STRINGS.successEdit}`)
    emit('ActualizarTabla', true)
    Reset()
  } catch (error) {
    console.error(`Error al actualizar item ${STRINGS.currency}:`, error)
    notify_error(`${STRINGS.errorEdit} ${STRINGS.currency}`)
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (row) => {
  backdropFilter.value = list
  dialog.value = true

  TextSiglas_moneda.value = row.siglas
  TextNombre_moneda.value = row.nombre
  TextTasaCambio_moneda.value = String(row.tasa)
  Textnomenclador_moneda.value = row.nomenclador
  TextmBase_moneda.value = row.moneda
  TextIdCondor_moneda.value = row.condor

  TextSiglas_moneda_copy.value = row.siglas
  TextNombre_moneda_copy.value = row.nombre
  TextTasaCambio_moneda_copy.value = String(row.tasa)
  Textnomenclador_moneda_copy.value = row.nomenclador
  TextmBase_moneda_copy.value = row.moneda
  TextIdCondor_moneda_copy.value = row.condor
  _id.value = row._id
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    TextNombre_moneda.value.trim() !== '' &&
    TextSiglas_moneda.value.trim() !== '' &&
    TextTasaCambio_moneda.value !== '' &&
    Textnomenclador_moneda.value !== '' &&
    TextmBase_moneda.value !== '' &&
    TextIdCondor_moneda.value.trim() !== ''
  )
    return true
  else return false
}

/* Función para evaluar que los campos hallan sido modificados */
const InputDifferent = () => {
  return !(
    TextNombre_moneda.value === TextNombre_moneda_copy.value &&
    TextSiglas_moneda.value === TextSiglas_moneda_copy.value &&
    TextTasaCambio_moneda.value === TextTasaCambio_moneda_copy.value &&
    Textnomenclador_moneda.value === Textnomenclador_moneda_copy.value &&
    TextmBase_moneda.value === TextmBase_moneda_copy.value &&
    TextIdCondor_moneda.value === TextIdCondor_moneda_copy.value
  )
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyText.test(TextNombre_moneda.value) &&
    expRegulares.onlyUppercase.test(TextSiglas_moneda.value) &&
    expRegulares.condorTextID.test(TextIdCondor_moneda.value) &&
    expRegulares.exchangeRate.test(TextTasaCambio_moneda.value)
  )
    return true
  else return false
}

//Función para comprobar los campos y habilitar botón GUARDAR
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions() && InputDifferent()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
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
}

/* Variables del dialogo */
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog

//Campos Originales
const TextSiglas_moneda = ref('')
const TextNombre_moneda = ref('')
const TextTasaCambio_moneda = ref('')
const Textnomenclador_moneda = ref('')
const TextmBase_moneda = ref('')
const TextIdCondor_moneda = ref('')
const _id = ref('')
const options = [1, 2, 3, 4]

//Campos Copias
const TextSiglas_moneda_copy = ref('')
const TextNombre_moneda_copy = ref('')
const TextTasaCambio_moneda_copy = ref('')
const Textnomenclador_moneda_copy = ref('')
const TextmBase_moneda_copy = ref('')
const TextIdCondor_moneda_copy = ref('')

/* Referencia del campo key */
const textSiglas_monedas = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(TextmBase_moneda, () => {
  checkStatusInputs()
})

watch(Textnomenclador_moneda, () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
