<template>
  <div class="">
    <q-dialog
      v-model="dialogEdit"
      persistent
      ref="refDialogoEdit"
      :backdrop-filter="backdropFilter"
      content-class="dialog-xl"
      :style="{ '--q-dialog-max-width': '800px' }"
    >
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.editFormaDePago.toUpperCase() }}</span>
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
                @keyup="ComprobarEstadoInputs"
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
                @onchange="ComprobarEstadoInputs"
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
                  @keyup="ComprobarEstadoInputs"
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
import { ref, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'

import api from 'src/axios.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = 'blur(4px) saturate(150%)'
const refDialogoEdit = ref(null)
const optionsMoneda = ref([])

const loadCoins = async () => {
  const response = await api.get(STRINGS.urlApiMoneda)
  optionsMoneda.value = response.data.map((element) => element['siglas'])

  if (optionsMoneda.value === null) {
    notify_error('Problemas de carga de datos..')
  }
  return optionsMoneda.value !== null ? optionsMoneda : (optionsMoneda.value = ['Empty'])
}

onBeforeMount(() => {
  loadCoins()
})

/*Validaciones*/
const rulesDescripcion_fdp = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.FullTextAndNumber.test(val) || STRINGS.FullTextAndNumber,
]

const rulesNomenclador_fdp = [(val) => val != '' || STRINGS.inputEmpty]

const rulesDetalles_fdp = [(val) => val != '' || STRINGS.inputEmpty]
/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const Procesar_Edit = async () => {
  if (ComprobarEstadoInputs() != STRINGS.desabilitar) {
    const newItem = {
      descripcion: TextDescripcion_fdp.value,
      nomenclador: Number(TextNomenclador_fdp.value),
      detalles: TextDetalles_fdp.value,
    }

    try {
      await api.patch(STRINGS.urlApiFormaDePago + '/' + _id.value, newItem) // POST /items
      // Mostrar alerta positiva de éxito
      notify_success(STRINGS.fdp_EditSuccess)

      emit('ActualizarTabla', true)
    } catch (error) {
      console.error('Error al crear item:', error)
      notify_error(STRINGS.fdp_EditError)

      emit('ActualizarTabla', false)
    }
    Reset()
  } else {
    refDialogoEdit.value.show()
  }
}

/*Función que levanta el dialogo*/
const LevantarDialogoEdit = (nombre, nomenclador, detalles, id) => {
  backdropFilter.value = list
  dialogEdit.value = true

  TextDescripcion_fdp.value = nombre
  TextNomenclador_fdp.value = nomenclador
  TextDetalles_fdp.value = detalles
  _id.value = id

  //Copias de Seguridad
  TextDescripcion_fdp_copy.value = nombre
  TextNomenclador_fdp_copy.value = nomenclador
  TextDetalles_fdp_copy.value = detalles
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

const InputDifferent = () => {
  const HaCambiado =
    TextDescripcion_fdp.value !== TextDescripcion_fdp_copy.value ||
    TextNomenclador_fdp.value !== TextNomenclador_fdp_copy.value ||
    TextDetalles_fdp.value !== TextDetalles_fdp_copy.value

  return HaCambiado
}

const ComprobarEstadoInputs = () => {
  // Verifica si algún campo está vacío
  const isEmpty = InputEmpty()
  // Verifica si hay cambios respecto a las copias
  const hasChanged = InputDifferent()

  if (isEmpty || !hasChanged) {
    // Si algún campo está vacío o no hay cambios, deshabilitar
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else {
    // Si hay cambios y todos los campos llenos, habilitar
    disabledBtnSaveEdit.value = ''
  }
  return disabledBtnSaveEdit.value
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialogEdit.value = false
  TextDescripcion_fdp.value = ''
  TextNomenclador_fdp.value = ''
  TextDetalles_fdp.value = ''
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

const dialogEdit = ref(false)
const backdropFilter = ref(null)
const _id = ref('')

//V-model
const TextDescripcion_fdp = ref('')
const TextNomenclador_fdp = ref('')
const TextDetalles_fdp = ref('')

//V-model Copy
const TextDescripcion_fdp_copy = ref('')
const TextNomenclador_fdp_copy = ref('')
const TextDetalles_fdp_copy = ref('')

//ref
const textDescripcion_fdp = ref(null)
const textNomenclador_fdp = ref(null)
const textDetalles_fdp = ref(null)

const options = [1, 2, 3, 4]

import { watch } from 'vue'

/*watch(TextNomenclador_comprobante, (newVal) => {
  TextValueNomenclador_comprobante.value = newVal
  ComprobarEstadoInputs()
})*/

watch(TextNomenclador_fdp, () => {
  ComprobarEstadoInputs()
})

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  LevantarDialogoEdit,
})
</script>
