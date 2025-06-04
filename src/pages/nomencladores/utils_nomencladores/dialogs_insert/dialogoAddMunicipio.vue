<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.addMunicipio.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_mun"
                ref="textNombre_Mun"
                color="green"
                :rules="rulesAddNombreMunicipio"
                type="text"
                :label="STRINGS.nombre_mun"
                @keyup="ComprobarEstadoInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_Mun"
                v-model="TextCodigo_mun"
                color="green"
                type="text"
                :rules="rulesAddCodigoMunicipio"
                :label="STRINGS.codigo_mun"
                @keyup="ComprobarEstadoInputs"
              />
            </div>

            <!-- TODO: Al realizar un cambio en los select disabled btnSend -->
            <div class="col-12 q-mt-md">
              <q-select
                v-model="SelectNombre_prov"
                ref="selectProv"
                @update:model-value="SelectNombre_prov = $event"
                :options="options"
                :label="STRINGS.nombre_prov"
                :rules="rulesAddNombreProvincia"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn
                icon="check"
                @click="Procesar_Add()"
                :label="STRINGS.save"
                :class="disabledBtnSave"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                icon="close"
                @click="Reset"
                flat
                :label="STRINGS.close"
                class="btn btn-white"
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
import { STRINGS } from '../../../../utils/string.js'
import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteMunicipio.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'

import { onBeforeMount } from 'vue'
import notify_error from 'src/utils/notify/notify_error.js'
const list = 'blur(4px) saturate(150%)'

const options = ref([])

const CargarProvincias = async () => {
  const response = await api.get(STRINGS.urlApiProvincia)
  options.value = response.data.map((element) => element['nombre'])
  return options
}

onBeforeMount(() => {
  CargarProvincias()
})

const refDialogoAdd = ref(null)

/*Validaciones*/
const rulesAddNombreMunicipio = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.FullText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCodigoMunicipio = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]

const rulesAddNombreProvincia = [(val) => val != '' || STRINGS.inputEmpty]
/*Validaciones*/

const emit = defineEmits(['ActualizarTablaMunicipio'])

/*Funcion de procesado de Datos*/
const Procesar_Add = async () => {
  if (ComprobarEstadoInputs() != STRINGS.desabilitar) {
    var aux = ''

    // Verificar si el código ya existe
    const existeCodigo = await verificarCodigoExistente(TextCodigo_mun.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario

      notify_error(STRINGS.codigoRepetido)

      textCodigo_Mun.value.focus()

      return
    } else {
      const response = await api.get(STRINGS.urlApiProvincia)
      response.data.forEach((element) => {
        if (element['nombre'] === SelectNombre_prov.value) {
          aux = element['_id']
        }
      })

      const newItem = {
        codigo: Number(TextCodigo_mun.value),
        nombre: TextNombre_mun.value,
        provincia: String(aux),
      }

      try {
        await api.post(STRINGS.urlApiMunicipio, newItem) // POST /items

        notify_success(STRINGS.municipioAddSuccess)

        emit('ActualizarTablaMunicipio', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.municipioAddError)
        emit('ActualizarTablaMunicipio', false)
      }
      refDialogoAdd.value.hide()
      Reset()
    }
  }
}

const InputEmpty = () => {
  if (
    TextNombre_mun.value.trim() === '' ||
    TextCodigo_mun.value.trim() === '' ||
    SelectNombre_prov.value === ''
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  let InputValidated =
    expRegulares.onlyNumber.test(TextCodigo_mun.value) &&
    expRegulares.FullText.test(TextNombre_mun.value) &&
    SelectNombre_prov.value !== null

  return InputValidated
}

const ComprobarEstadoInputs = () => {
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

/*Función que levanta el dialogo*/
const LevantarDialogoAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextCodigo_mun.value = ''
  TextNombre_mun.value = ''
  SelectNombre_prov.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

const dialog = ref(false)
const backdropFilter = ref(null)

const TextCodigo_mun = ref('')
const TextNombre_mun = ref('')
const SelectNombre_prov = ref('')
const selectProv = ref(null)

const textNombre_Mun = ref(null)
const textCodigo_Mun = ref(null)

const disabledBtnSave = ref(STRINGS.desabilitar)

watch(SelectNombre_prov, () => {
  ComprobarEstadoInputs()
})

defineExpose({
  LevantarDialogoAdd,
})
</script>
