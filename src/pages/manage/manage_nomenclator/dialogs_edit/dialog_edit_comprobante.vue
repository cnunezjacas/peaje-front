<template>
  <div class="">
    <q-dialog
      v-model="dialogEdit"
      persistent
      ref="refDialogoEdit"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.editComprobante.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_Comprobante"
                ref="textNombre_Comprobante"
                color="green"
                :rules="rulesNombre_Comprobante"
                type="text"
                :label="STRINGS.nombre_comprobante"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_comprobante"
                v-model="TextCodigo_comprobante"
                color="green"
                type="text"
                :rules="rulesCodigo_comprobante"
                :label="STRINGS.codigo_comprobante"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <div class="row flex justify-between q-mt-lg">
            <div class="col-12">
              <q-select
                v-model="TextNomenclador_comprobante"
                ref="textNomenclador_exento"
                :options="options"
                :rules="rulesNomenclador_comprobante"
                disable
                color="green"
                :label="STRINGS.nomenclador_comprobante"
                @onchange="checkStatusInputs"
                outlined
              >
                <!-- Slot para agregar un botón al final del select -->
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>

            <div class="col-5">
              <q-input
                ref="textValor_comprobante"
                v-model="TextValor_comprobante"
                color="green"
                type="text"
                :rules="rulesValor_comprobante"
                :label="STRINGS.valor_comprobante"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-select
                v-model="TextMoneda_comprobante"
                ref="textMoneda_comprobante"
                :options="optionsMoneda"
                :rules="rulesNomenclador_comprobante"
                color="green"
                :label="STRINGS.moneda_comprobante"
                @onchange="checkStatusInputs"
                outlined
              >
              </q-select>
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
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteComprobante.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import imports from 'src/utils/imports.js'
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
const rulesNombre_Comprobante = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.TextAndNumber.test(val) || STRINGS.TextAndNumber,
]

const rulesCodigo_comprobante = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.uppercaseAndNumber.test(val) || STRINGS.uppercaseAndNumber,
]

const rulesNomenclador_comprobante = [(val) => val != '' || STRINGS.inputEmpty]

const rulesValor_comprobante = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]
/*const rulesDetalles_exento = [(val) => val != '' || STRINGS.inputEmpty]*/
/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const Procesar_Edit = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    var existeCodigo = false

    if (TextCodigo_comprobante.value !== TextCodigo_comprobante_copy.value)
      existeCodigo = await verificarCodigoExistente(TextCodigo_comprobante.value)

    if (existeCodigo ? true : false) {
      // Mostrar mensaje de error o alertar al usuario

      notify_error(STRINGS.codigoRepetido)

      textCodigo_comprobante.value.focus()

      return
    } else {
      let nameMoneda = TextValueMoneda_comprobante.value
      const coinId = await imports.getIdCoin(nameMoneda)

      const newItem = {
        nombre: TextNombre_Comprobante.value,
        codigo: TextCodigo_comprobante.value.toUpperCase(),
        valor: Number(TextValor_comprobante.value),
        //TODO: nomenclador: Number(TextNomenclador_comprobante.value),
        moneda: coinId,
        /*TODO: detalles: TextDetalles_exento.value,*/
      }

      try {
        await api.patch(STRINGS.urlApiComprobante + '/' + _id.value, newItem) // POST /items
        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.comprobanteEditSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.comprobanteEditError)

        emit('ActualizarTabla', false)
      }
      refDialogoEdit.value.hide()
      Reset()
    }
  } else {
    refDialogoEdit.value.show()
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (nombre, codigo, moneda, valor, id) => {
  backdropFilter.value = list
  dialogEdit.value = true

  TextNombre_Comprobante.value = nombre
  TextCodigo_comprobante.value = codigo
  TextMoneda_comprobante.value = moneda
  TextValor_comprobante.value = String(valor)
  // TextNomenclador_comprobante.value = nomenclador
  _id.value = id

  //Copias de Seguridad
  TextNombre_Comprobante_copy.value = nombre
  TextCodigo_comprobante_copy.value = codigo
  TextMoneda_comprobante_copy.value = moneda
  TextValor_comprobante_copy.value = String(valor)
  // TextNomenclador_comprobante_copy.value = nomenclador
}

const InputEmpty = () => {
  if (
    TextNombre_Comprobante.value.trim() === '' ||
    TextCodigo_comprobante.value.trim() === '' ||
    TextValor_comprobante.value.trim() === '' ||
    TextValueMoneda_comprobante.value === null /*||
    TextValueNomenclador_comprobante.value === ''*/
  )
    return true
  else return false
}

const InputDifferent = () => {
  const HaCambiado =
    TextNombre_Comprobante.value !== TextNombre_Comprobante_copy.value ||
    TextCodigo_comprobante.value !== TextCodigo_comprobante_copy.value ||
    TextValor_comprobante.value !== TextValor_comprobante_copy.value ||
    TextMoneda_comprobante.value !== TextMoneda_comprobante_copy.value

  return HaCambiado
}

const checkStatusInputs = () => {
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
  TextNombre_Comprobante.value = ''
  TextCodigo_comprobante.value = ''
  TextMoneda_comprobante.value = ''
  TextValor_comprobante.value = ''
  TextNomenclador_comprobante.value = ''
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

const dialogEdit = ref(false)
const backdropFilter = ref(null)
const _id = ref('')

//v-model
const TextCodigo_comprobante = ref('')
const TextNombre_Comprobante = ref('')
const TextNomenclador_comprobante = ref('')
//const TextValueNomenclador_comprobante = ref('')
//const TextDetalles_exento = ref('')
const TextValor_comprobante = ref('')
const TextMoneda_comprobante = ref('')
const TextValueMoneda_comprobante = ref('')

//v-model copy
const TextCodigo_comprobante_copy = ref('')
const TextNombre_Comprobante_copy = ref('')
//const TextNomenclador_comprobante_copy = ref('')

//const TextDetalles_exento = ref('')
const TextValor_comprobante_copy = ref('')
const TextMoneda_comprobante_copy = ref('')

//ref
const textNombre_Comprobante = ref(null)
const textCodigo_comprobante = ref(null)
const textValor_comprobante = ref(null)
const textMoneda_comprobante = ref(null)
//const textDetalles_exento = ref(null)

import { watch } from 'vue'

/*watch(TextNomenclador_comprobante, (newVal) => {
  TextValueNomenclador_comprobante.value = newVal
  checkStatusInputs()
})*/

watch(TextMoneda_comprobante, (newVal) => {
  TextValueMoneda_comprobante.value = newVal
  checkStatusInputs()
})

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogEdit,
})
</script>
