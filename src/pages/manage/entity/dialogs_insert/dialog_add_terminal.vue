<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter"
      content-class="dialog-xl" :style="{ '--q-dialog-max-width': '800px' }">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.add.toUpperCase() }} {{ STRINGS.terminalLowercase.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre -->
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input v-model="TextNumero_terminal" ref="textNumero_terminal" color="green" type="text"
                :rules="rulesOnlyNumbers" :label="STRINGS.numero_terminal" @keyup="checkStatusInputs" />
            </div>

            <div class="col-5">
              <q-input v-model="TextNumeroInventario_terminal" color="green" type="text" :rules="rulesOnlyNumbers"
                :label="STRINGS.numeroInventario_terminal" @keyup="checkStatusInputs" />
            </div>
          </div>

          <div class="text-start q-mt-md">
            <p>{{ STRINGS.estado_terminal.toUpperCase() }}</p>
          </div>
          <div class="row flex justify-between">
            <div class="col-6 row border-box-radio">
              <div class="col-4 text-center">
                <q-radio v-model="TextEstado_terminal" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                  :val="STRINGS.estadoActivo_terminal" :label="STRINGS.estadoActivo_terminal"
                  @change="checkStatusInputs" />
              </div>
              <div class="col-4 text-center">
                <q-radio v-model="TextEstado_terminal" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                  :val="STRINGS.estadoInactivo_terminal" :label="STRINGS.estadoInactivo_terminal"
                  @change="checkStatusInputs" />
              </div>

              <div class="col-4 text-center">
                <q-radio v-model="TextEstado_terminal" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                  :val="STRINGS.estadoRoto_terminal" :label="STRINGS.estadoRoto_terminal" @change="checkStatusInputs" />
              </div>
            </div>

            <div class="col-5">
              <q-select v-model="TextPuntoDeVenta_terminal" ref="textTipoCuenta" color="green" :options="optionsCuenta"
                type="text" :rules="rulesNoEmpty" :label="STRINGS.puntoDeVenta_terminal" @keyup="checkStatusInputs" />
            </div>
          </div>

          <div class="row flex justify-between q-mt-md">
            <div class="col-5">
              <q-input v-model="TextUltimaColecta_terminal" color="green" type="datetime-local" :rules="rulesNoEmpty"
                :label="STRINGS.ultimaColecta_terminal" @keyup="checkStatusInputs" />
            </div>

            <div class="col-3">
              <q-input v-model="TextUltimaDiasSinColectar_terminal" color="green" type="text" :rules="rulesOnlyNumbers"
                :label="STRINGS.diasSinColecta_terminal" @keyup="checkStatusInputs" />
            </div>

            <div class="col-3">
              <q-input v-model="TextCodigoAcceso_terminal" color="green" type="text" :rules="rulesOnlyNumbers"
                :label="STRINGS.codigoAcceso_terminal" @keyup="checkStatusInputs" />
            </div>
          </div>

          <div class="row">
            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.detalles_terminal }}:</p>
              <div class="bg-grey-4">
                <q-input v-model="TextDetalles_terminal" class="q-pa-md" color="green" autogrow />
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
import { ref, onBeforeMount, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
//import verificarCuentaDeBanco from 'utils/utils_axios/entity/verificarCuentaDeBanco.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useNotify } from 'src/utils/notify/notify.js'


/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { notify_success/*, notify_warning, notify_error*/ } = useNotify()

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
const rulesOnlyNumbers = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]

const rulesNoEmpty = [(val) => val != '' || STRINGS.inputEmpty]
/*Validaciones*/

//const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  //TODO: Send Add
  if (disabledBtnSave.value !== STRINGS.desabilitar) {
    notify_success('Correcto!')

    //TODO: Ojo con el DATATIME forma de output 21-02-2025T12:04

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
  TextNumero_terminal.value = ''
  TextNumeroInventario_terminal.value = ''
  TextEstado_terminal.value = ''
  TextPuntoDeVenta_terminal.value = ''
  TextUltimaColecta_terminal.value = ''
  TextUltimaDiasSinColectar_terminal.value = ''
  TextCodigoAcceso_terminal.value = ''
  TextDetalles_terminal.value = ''
}

const InputEmpty = () => {
  if (
    TextNumero_terminal.value.trim() !== '' &&
    TextNumeroInventario_terminal.value.trim() !== '' &&
    TextEstado_terminal.value !== '' &&
    TextPuntoDeVenta_terminal.value !== '' &&
    TextUltimaColecta_terminal.value !== '' &&
    TextUltimaDiasSinColectar_terminal.value !== '' &&
    TextCodigoAcceso_terminal.value !== '' &&
    TextDetalles_terminal.value.trim() !== ''
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  if (
    expRegulares.onlyNumber.test(TextNumero_terminal.value) &&
    expRegulares.onlyNumber.test(TextNumeroInventario_terminal.value) &&
    expRegulares.onlyNumber.test(TextUltimaDiasSinColectar_terminal.value) &&
    expRegulares.onlyNumber.test(TextCodigoAcceso_terminal.value)
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
const TextNumero_terminal = ref('')
const TextNumeroInventario_terminal = ref('')
const TextEstado_terminal = ref('')
const TextPuntoDeVenta_terminal = ref('')
const TextUltimaColecta_terminal = ref('')
const TextUltimaDiasSinColectar_terminal = ref('')
const TextCodigoAcceso_terminal = ref('')
const TextDetalles_terminal = ref('')

//REF Banco

const textNumero_terminal = ref(null)

const disabledBtnSave = ref(STRINGS.desabilitar)
const backdropFilter = ref(null)

//Casos Especiales
watch(TextEstado_terminal, () => {
  checkStatusInputs()
})

watch(TextPuntoDeVenta_terminal, () => {
  checkStatusInputs()
})

watch(TextDetalles_terminal, () => {
  checkStatusInputs()
})

watch(TextUltimaColecta_terminal, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
