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
          <span class="icon-text">{{ STRINGS.addFormaDePago.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextDescripcion_fdp"
                ref="textDescripcion_fdp"
                color="green"
                :rules="rulesDescripcion_fdp"
                type="text"
                :label="STRINGS.descripcion_formas_pago"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-select
                v-model="TextNomenclador_fdp"
                ref="textNomenclador_fdp"
                :options="options"
                :rules="rulesNomenclador_fdp"
                color="green"
                :label="STRINGS.nomenclador_formas_pago"
                @onchange="checkStatusInputs"
                outlined
              >
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="row flex justify-between q-mt-md">
            <div class="col-12">
              <p>{{ STRINGS.detalles_formas_pago }}:</p>
              <div class="bg-grey-4">
                <q-input
                  ref="textDetalles_fdp"
                  v-model="TextDetalles_fdp"
                  :rules="rulesDetalles_fdp"
                  class="q-pa-md q-pb-lg"
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
                v-on:click="Reset()"
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
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'
//import imports from 'src/utils/imports.js'

const list = 'blur(4px) saturate(150%)'
const refDialogoAdd = ref(null)

const openModal = () => {
  console.log('Hi')
}

/*Validaciones*/
const rulesDescripcion_fdp = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.TextAndNumber.test(val) || STRINGS.TextAndNumber,
]

const rulesNomenclador_fdp = [(val) => val != '' || STRINGS.inputEmpty]

const rulesDetalles_fdp = [(val) => val != '' || STRINGS.inputEmpty]
/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON
    const newItem = {
      descripcion: TextDescripcion_fdp.value,
      nomenclador: Number(TextNomenclador_fdp.value),
      detalles: TextDetalles_fdp.value,
    }

    try {
      await api.post(STRINGS.urlApiFormaDePago, newItem) // POST /items

      // Mostrar alerta positiva de éxito
      notify_success(STRINGS.fdp_AddSuccess)

      emit('ActualizarTabla', true)
    } catch (error) {
      console.error('Error al crear item:', error)
      notify_error(STRINGS.fdp_AddError)

      emit('ActualizarTabla', false)
    }
    Reset()
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
  TextDescripcion_fdp.value = ''
  TextNomenclador_fdp.value = ''
  TextDetalles_fdp.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

const InputEmpty = () => {
  if (
    TextDescripcion_fdp.value.trim() === '' ||
    TextNomenclador_fdp.value === '' ||
    TextDetalles_fdp.value.trim() === ''
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  let InputValidated =
    expRegulares.onlyText.test(TextDescripcion_fdp.value) &&
    TextDetalles_fdp.value !== '' &&
    TextNomenclador_fdp.value !== null

  console.log('TextDetalles_fdp.value:', TextDetalles_fdp.value)

  console.log('InputValidated.value:', InputValidated)

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
const backdropFilter = ref(null)

//V-model
const TextDescripcion_fdp = ref('')
const TextNomenclador_fdp = ref('')
const TextDetalles_fdp = ref('')

//ref
const textDescripcion_fdp = ref(null)
const textNomenclador_fdp = ref(null)
const textDetalles_fdp = ref(null)

const options = [1, 2, 3, 4]
const disabledBtnSave = ref(STRINGS.desabilitar)

import { watch } from 'vue'

watch(TextNomenclador_fdp, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
