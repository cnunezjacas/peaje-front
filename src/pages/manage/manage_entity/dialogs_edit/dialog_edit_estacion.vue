<template>
  <div class="">
    <q-dialog
      v-model="dialogEdit"
      persistent
      ref="refDialogoEdit"
      :backdrop-filter="backdropFilter"
    >
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.add.toUpperCase() }} {{ STRINGS.estacionesLowercase.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre -->
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextCodigo_estacion"
                ref="textCodigo_estacion"
                color="green"
                :rules="rulesAddCodigo_estacion"
                type="text"
                :label="STRINGS.codigo_estacion"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                v-model="TextNombre_estacion"
                ref="textNombre_estacion"
                color="green"
                type="text"
                :rules="rulesAddNombre_estacion"
                :label="STRINGS.nombre_estacion"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <!-- provincia y municipio -->
          <div class="row flex justify-between">
            <div class="col-5">
              <q-select
                v-model="TextSelectNombre_prov"
                ref="textSelectNombre_prov"
                :options="optionsProvince"
                :label="STRINGS.nombre_prov"
                :rules="rulesAddNombreProvinciaAndMunicipio"
              />
            </div>
            <div class="col-5">
              <q-select
                v-model="TextSelectNombre_mun"
                ref="textSelectNombre_mun"
                option-value="value"
                :options="optionsMunicipioFiltrado"
                label="Municipio"
                use-input
                fill-input
                @filter="filterOptions"
                :loading="optionsMunicipio.length === 0"
                :disable="optionsMunicipio.length === 0"
              />
            </div>
          </div>

          <!-- direccion, telefono y NIT -->
          <div class="row flex justify-between">
            <div class="col-6">
              <q-input
                v-model="TextDireccion_estacion"
                ref="textDireccion_estacion"
                color="green"
                :rules="rulesAddDireccion_estacion"
                type="text"
                :label="STRINGS.direccion_estacion"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-3">
              <q-input
                v-model="TextTelefono_estacion"
                ref="textTelefono_estacion"
                color="green"
                type="text"
                :rules="rulesAddTelefono_estacion"
                :label="STRINGS.telefonos_estacion"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-2">
              <q-input
                v-model="TextNit_estacion"
                ref="textNit_estacion"
                color="green"
                type="text"
                :rules="rulesAddNit_estacion"
                :label="STRINGS.NIT_estacion"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <!-- Banco CUC -->
          <div class="text-start q-mt-md">
            <p>{{ STRINGS.bancoCUC.toUpperCase() }}</p>
          </div>
          <div class="row flex justify-between border-box-bank">
            <div class="col-4">
              <q-select
                v-model="TextBanco_CUC"
                ref="textBanco_CUC"
                color="green"
                :options="optionsBanco"
                type="text"
                :rules="rulesAddNombreProvinciaAndMunicipio"
                :label="STRINGS.banco_cuenta"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-3">
              <q-input
                v-model="TextTitularCuenta_CUC"
                ref="textTitularCuenta_CUC"
                color="green"
                type="text"
                :rules="rulesAddTitularCuenta"
                :label="STRINGS.titular_de_la_cuenta"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-4">
              <q-input
                v-model="TextCuenta_CUC"
                ref="textCuenta_CUC"
                color="green"
                maxlength="19"
                type="text"
                :rules="rulesAddCuenta"
                :label="STRINGS.cuenta"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <!-- Banco CUP -->
          <div class="text-start q-mt-md">
            <p>{{ STRINGS.bancoCUP.toUpperCase() }}</p>
          </div>
          <div class="row flex justify-between border-box-bank">
            <div class="col-4">
              <q-select
                v-model="TextBanco_CUP"
                ref="textBanco_CUP"
                color="green"
                :options="optionsBanco"
                :rules="rulesAddNombreProvinciaAndMunicipio"
                type="text"
                :label="STRINGS.banco_cuenta"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-3">
              <q-input
                v-model="TextTitularCuenta_CUP"
                ref="textTitularCuenta_CUP"
                color="green"
                type="text"
                :rules="rulesAddTitularCuenta"
                :label="STRINGS.titular_de_la_cuenta"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-4">
              <q-input
                ref="textCuenta_CUP"
                v-model="TextCuenta_CUP"
                color="green"
                type="text"
                :rules="rulesAddCuenta"
                :label="STRINGS.cuenta"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <div class="text-start q-mt-md">
            <p>{{ STRINGS.parametros.toUpperCase() }}</p>
          </div>
          <div class="row flex justify-between border-box-radio disabled">
            <div class="col-4 text-center">
              <q-radio
                v-model="TextmBase_moneda"
                ref="textmBase_moneda"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :val="STRINGS.yes"
                :label="STRINGS.abonados_locales_estacion"
                @change="checkStatusInputs"
              />
            </div>
            <div class="col-4 text-center">
              <q-radio
                v-model="TextmBase_moneda"
                ref="textmBase_moneda"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :val="STRINGS.no"
                :label="STRINGS.comprobante_estacion"
                @change="checkStatusInputs"
              />
            </div>

            <div class="col-4 text-center">
              <q-radio
                v-model="TextmBase_moneda"
                ref="textmBase_moneda"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                :val="STRINGS.no"
                :label="STRINGS.tarjetas_estacion"
                @change="checkStatusInputs"
              />
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
//import notify_success from 'src/utils/notify/notify_success.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
//import notify_error from 'src/utils/notify/notify_error.js'

const refDialogoEdit = ref(null)

//import notify_error from 'src/utils/notify/notify_error.js'
import { onBeforeMount } from 'vue'
const list = 'blur(4px) saturate(150%)'

const optionsProvince = ref([])
const optionsBanco = ref([])

const CargarProvincias = async () => {
  const response = await api.get(STRINGS.urlApiProvincia)
  optionsProvince.value = response.data.map((element) => element['nombre'])
  return optionsProvince
}

// Datos originales
const optionsMunicipio = ref([])
// Opciones filtradas
const optionsMunicipioFiltrado = ref([])

// Función para cargar todos los municipios
const CargarMunicipios = async () => {
  const response = await api.get(STRINGS.urlApiMunicipio)
  optionsMunicipio.value = response.data.map((element) => ({
    label: element['nombre'],
    value: element['nombre'],
  }))
  // Inicializamos las opciones filtradas con todas
  optionsMunicipioFiltrado.value = [...optionsMunicipio.value]
}

// La función de filtrado
function filterOptions(val, update) {
  if (val === '') {
    // Si no hay filtro, mostrar todos
    optionsMunicipioFiltrado.value = [...optionsMunicipio.value]
  } else {
    const searchLower = val.toLowerCase()
    optionsMunicipioFiltrado.value = optionsMunicipio.value.filter((option) =>
      option.label.toLowerCase().includes(searchLower),
    )
  }
  // Indicar que la actualización ha sido procesada
  update()
}

const CargarBancos = async () => {
  const response = await api.get(STRINGS.urlApiBanco)
  // Suponiendo que response.data es un array de objetos como:
  // { nombre: 'Ciudad1', ... }
  optionsBanco.value = response.data.map((element) => element['codigo'])
  return optionsBanco
}

onBeforeMount(() => {
  CargarProvincias()
  CargarMunicipios()
  CargarBancos()
})

/*Validaciones*/
const rulesAddNombre_estacion = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCodigo_estacion = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.numberAndHyphen.test(val) || STRINGS.numberAndHyphen,
]

const rulesAddNombreProvinciaAndMunicipio = [(val) => val != '' || STRINGS.inputEmpty]

const rulesAddDireccion_estacion = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyAddress.test(val) || STRINGS.onlyAddress,
]

const rulesAddTelefono_estacion = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.numberPhone.test(val) || STRINGS.numberPhone,
]

const rulesAddNit_estacion = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]

const rulesAddTitularCuenta = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCuenta = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.cardOfBank.test(val) || STRINGS.cardOfBank,
]
/*Validaciones*/

//const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const Procesar_Edit = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    Reset()
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (name, code, address, province, municipality, id) => {
  backdropFilter.value = list
  dialogEdit.value = true
  TextNombre_estacion.value = name
  TextCodigo_estacion.value = code
  TextDireccion_estacion.value = address
  TextSelectNombre_prov.value = province
  TextSelectNombre_mun.value = municipality
  IdItem.value = id
}

const InputEmpty = () => {
  if (
    TextNombre_estacion.value.trim() == '' &&
    TextCodigo_estacion.value.trim() == '' &&
    TextTelefono_estacion.value.trim() == '' &&
    TextNit_estacion.value.trim() == '' &&
    TextBanco_CUC.value == null &&
    TextTitularCuenta_CUC.value.trim() == '' &&
    TextCuenta_CUC.value.trim() == '' &&
    TextBanco_CUP.value == null &&
    TextSelectNombre_mun.value == null &&
    TextSelectNombre_prov.value == null &&
    TextTitularCuenta_CUP.value.trim() == '' &&
    TextCuenta_CUP.value.trim() == '' &&
    TextDireccion_estacion.value.trim() == ''
  )
    return true
  else return false
}

const InputDifferent = () => {
  let HaCambiado =
    TextNombre_estacion.value !== TextNombre_estacion_copy.value ||
    TextCodigo_estacion.value !== TextCodigo_estacion_copy.value ||
    TextTelefono_estacion.value !== TextTelefono_estacion_copy.value ||
    TextNit_estacion.value !== TextNit_estacion_copy.value ||
    TextBanco_CUC.value !== TextBanco_CUC_copy.value ||
    TextTitularCuenta_CUC.value !== TextTitularCuenta_CUC_copy.value ||
    TextCuenta_CUC.value !== TextCuenta_CUC_copy.value ||
    TextBanco_CUP.value !== TextBanco_CUP_copy.value ||
    TextTitularCuenta_CUP.value !== TextTitularCuenta_CUP_copy.value ||
    TextCuenta_CUP.value !== TextCuenta_CUP_copy.value ||
    TextDireccion_estacion.value !== TextDireccion_estacion_copy.value ||
    TextSelectNombre_mun.value !== TextSelectNombre_mun_copy.value ||
    TextSelectNombre_prov.value !== TextSelectNombre_prov_copy.value

  return HaCambiado
}

const InputRegularExpressions = () => {
  let InputValidated =
    expRegulares.numberAndHyphen.test(TextCodigo_estacion.value.trim()) &&
    expRegulares.onlyText.test(TextNombre_estacion.value.trim()) &&
    expRegulares.onlyAddress.test(TextDireccion_estacion.value) &&
    expRegulares.onlyNumber.test(TextNit_estacion.value) &&
    expRegulares.onlyText.test(TextTitularCuenta_CUC.value) &&
    expRegulares.onlyText.test(TextTitularCuenta_CUP.value) &&
    expRegulares.cardOfBank.test(TextCuenta_CUC.value) &&
    expRegulares.cardOfBank.test(TextCuenta_CUP.value) &&
    expRegulares.numberPhone.test(TextTelefono_estacion.value.trim())

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
  dialogEdit.value = false
  TextNombre_estacion.value = ''
  TextCodigo_estacion.value = ''
  TextDireccion_estacion.value = ''
  TextSelectNombre_prov.value = ''
  TextSelectNombre_mun.value = ''
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

const dialogEdit = ref(false)
const IdItem = ref('')

//Campos Originales
const TextNombre_estacion = ref('')
const TextCodigo_estacion = ref('')
const TextDireccion_estacion = ref('')
const TextSelectNombre_prov = ref('')
const TextSelectNombre_mun = ref('')
const TextTelefono_estacion = ref('')
const TextNit_estacion = ref('')

//Variables Banco CUC
const TextBanco_CUC = ref('')
const TextTitularCuenta_CUC = ref('')
const TextCuenta_CUC = ref('')

//Variables Banco CUP
const TextBanco_CUP = ref('')
const TextTitularCuenta_CUP = ref('')
const TextCuenta_CUP = ref('')

//Refes
const textNombre_estacion = ref(null)
const textCodigo_estacion = ref(null)
const textDireccion_estacion = ref(null)
const textSelectNombre_prov = ref(null)
const textSelectNombre_mun = ref(null)
const textTelefono_estacion = ref(null)
const textNit_estacion = ref(null)

//Campos Copias
const TextNombre_estacion_copy = ref('')
const TextCodigo_estacion_copy = ref('')
const TextDireccion_estacion_copy = ref('')
const TextSelectNombre_prov_copy = ref('')
const TextSelectNombre_mun_copy = ref('')
const TextTelefono_estacion_copy = ref('')
const TextNit_estacion_copy = ref('')

//Variables Banco CUC
const TextBanco_CUC_copy = ref('')
const TextTitularCuenta_CUC_copy = ref('')
const TextCuenta_CUC_copy = ref('')

//Variables Banco CUP
const TextBanco_CUP_copy = ref('')
const TextTitularCuenta_CUP_copy = ref('')
const TextCuenta_CUP_copy = ref('')

const backdropFilter = ref(null)
const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

watch(TextBanco_CUC, () => {
  checkStatusInputs()
})
watch(TextBanco_CUP, () => {
  checkStatusInputs()
})

watch(TextSelectNombre_mun, (newVal, oldVal) => {
  console.log('NewVal:', newVal)
  console.log('oldVal:', oldVal)
})

defineExpose({
  getUpDialogEdit,
})
</script>
