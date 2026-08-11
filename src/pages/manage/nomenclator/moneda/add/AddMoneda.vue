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
            >{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.currency.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-4">
              <div class="q-px-sm">
                <q-input
                  v-model="TextNombre_moneda"
                  ref="textNombre_moneda"
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
                  ref="textTasaCambio_moneda"
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
                  :rules="validaciones_generales.rulesCondorTextID"
                  type="text"
                  :label="STRINGS.id_condor"
                  @keyup="checkStatusInputs"
                />
              </div>
            </div>
          </div>

          <!-- <div class="row flex justify-center q-mt-md">
            <div class="col-12 q-mt-xs">
              <div class="q-px-sm">
                <p>{{ STRINGS.details }}:</p>
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
import api from 'src/boot/api.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiMoneda
  const existeCodigo = await verificarExistente(
    url,
    STRINGS.acronym.toLocaleLowerCase(),
    String(TextSiglas_moneda.value),
  )
  return existeCodigo
}

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    if (await CheckCode()) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.siglasRepetidas)
      return textSiglas_monedas.value.focus()
    } else {
      const newItem = {
        nombre: TextNombre_moneda.value.toUpperCase(),
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
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/* Variables del dialogo */
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog

/* Referencias de los modelos de los campos */
const TextSiglas_moneda = ref('')
const TextNombre_moneda = ref('')
const TextTasaCambio_moneda = ref('')
const Textnomenclador_moneda = ref('')
const TextmBase_moneda = ref('')
const TextIdCondor_moneda = ref('')
//const TextDetalles_moneda = ref('')
const options = [1, 2, 3, 4]

/* Referencia del campo key */
const textSiglas_monedas = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* ("observadores") que permiten reaccionar a cambios en datos específicos del/los componente/s */
watch(TextmBase_moneda, () => {
  checkStatusInputs()
})

watch(Textnomenclador_moneda, () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogAdd,
})
</script>
