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
            >{{ STRINGS.add.toUpperCase() }} {{ STRINGS.cuentaLowercase.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre -->
          <div class="row flex justify-between">
            <!-- Banco CUC -->
            <div class="col-6">
              <q-input
                v-model="TextTitularCuenta"
                ref="textTitularCuenta"
                color="green"
                type="text"
                :rules="rulesAddTitularCuenta"
                :label="STRINGS.titular_de_la_cuenta"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-5">
              <q-select
                v-model="TextTipoCuenta"
                ref="textTipoCuenta"
                color="green"
                :options="optionsCuenta"
                type="text"
                :rules="rulesAddNombreProvinciaAndMunicipio"
                :label="STRINGS.tipoCuenta"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-5">
              <q-select
                v-model="TextBanco"
                ref="textBanco"
                color="green"
                :options="optionsBanco"
                type="text"
                :rules="rulesAddNombreProvinciaAndMunicipio"
                :label="STRINGS.banco_cuenta"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-5">
              <q-input
                v-model="TextCuenta"
                ref="textCuenta"
                color="green"
                maxlength="19"
                type="text"
                :rules="rulesAddCuenta"
                :label="STRINGS.cuenta"
                @keyup="checkStatusInputs"
              />
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
import { ref, onBeforeMount, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import verificarCuentaDeBanco from 'utils/utils_axios/entity/verificarCuentaDeBanco.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'
import imports from 'src/utils/imports'

//import imports from 'src/utils/imports'
const list = STRINGS.OpacityDialog

const refDialogoAdd = ref(null)

const optionsBanco = ref([])
const optionsCuenta = ref([])

const CargarBancos = async () => {
  const response = await api.get(STRINGS.urlApiBanco)
  // Suponiendo que response.data es un array de objetos como:
  // { nombre: 'Ciudad1', ... }
  optionsBanco.value = response.data.map((element) => ({
    label: element['codigo'],
    value: element['_id'],
  }))
  return optionsBanco
}

const CargarCuentas = async () => {
  const response = await api.get(STRINGS.urlApiTipoCuenta)
  // Suponiendo que response.data es un array de objetos como:
  // { nombre: 'Ciudad1', ... }
  optionsCuenta.value = response.data.map((element) => ({
    label: element['nombre'],
    value: element['_id'],
  }))
  return optionsCuenta
}

onBeforeMount(() => {
  CargarBancos()
  CargarCuentas()
})

/*Validaciones*/
const rulesAddTitularCuenta = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCuenta = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.cardOfBank.test(val) || STRINGS.cardOfBank,
]

const rulesAddNombreProvinciaAndMunicipio = [(val) => val != '' || STRINGS.inputEmpty]

/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON

    // Verificar si el código ya existe
    const existeCodigo = await verificarCuentaDeBanco(imports.cardOfBankToNumber(TextCuenta.value))
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario

      notify_error(STRINGS.codigoRepetido)
      textCuenta.value.focus()
      return
    } else {
      /*CapturarIDTipoCuenta()
      CapturarIDBanco()*/

      const newItem = {
        titular: TextTitularCuenta.value,
        numero: imports.cardOfBankToNumber(TextCuenta.value),
        banco: String(TextBanco.value['value']),
        tipo: String(TextTipoCuenta.value['value']),
      }
      console.log('newItem: =>')
      console.log(newItem)
      console.log(JSON.stringify(newItem))

      try {
        await api.post(STRINGS.urlApiCuenta, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.cuenta_AddSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.cuenta_AddError)

        emit('ActualizarTabla', false)
      }
      refDialogoAdd.value.hide()
      Reset()
    }
  }

  Reset()
}

/*Función que levanta el dialogo*/
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextTitularCuenta.value = ''
  TextBanco.value = ''
  TextCuenta.value = ''
  TextTipoCuenta.value = ''
}

const InputEmpty = () => {
  if (
    TextTitularCuenta.value.trim() !== '' &&
    TextCuenta.value.trim() !== '' &&
    TextBanco.value !== '' &&
    TextTipoCuenta.value !== ''
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  if (
    expRegulares.onlyText.test(TextTitularCuenta.value) &&
    expRegulares.cardOfBank.test(TextCuenta.value)
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

//Variables Banco
const TextBanco = ref('')
const TextTitularCuenta = ref('')
const TextCuenta = ref('')
const TextTipoCuenta = ref('')

//REF Banco
const textBanco = ref(null)
const textTitularCuenta = ref(null)
const textCuenta = ref(null)
const textTipoCuenta = ref(null)

const disabledBtnSave = ref(STRINGS.desabilitar)
const backdropFilter = ref(null)

watch(TextBanco, () => {
  checkStatusInputs()
})

watch(TextTipoCuenta, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
