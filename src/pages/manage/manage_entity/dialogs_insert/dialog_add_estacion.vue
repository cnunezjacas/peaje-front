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
                :options="optionsMunicipio"
                label="Municipio"
                :disable="optionsMunicipio.length === 0 ? true : disabledSelectMun"
              />
            </div>
          </div>

          <!-- direccion, telefono y NIT -->
          <div class="row flex justify-between">
            <div class="col-3">
              <Phone />
            </div>

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

          <!-- Banco CUC & Banco CUP-->
          <div class="row flex justify-between q-mt-md">
            <div class="col-5">
              <p>{{ STRINGS.bancoCUC.toUpperCase() }}</p>
            </div>

            <div class="col-5">
              <p>{{ STRINGS.bancoCUP.toUpperCase() }}</p>
            </div>
          </div>
          <div class="row flex justify-between border-box-bank">
            <div class="col-5">
              <q-input
                v-model="TextCuenta_CUC"
                ref="textCuenta_CUC"
                color="green"
                maxlength="19"
                type="text"
                :rules="validaciones_generales.rulesCardOfBank"
                :label="STRINGS.cuenta"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-5">
              <q-input
                ref="textCuenta_CUP"
                v-model="TextCuenta_CUP"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesCardOfBank"
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
import verificarCodigoExistente from 'utils/utils_axios/entity/verificarCodigoExistenteEstacion.js'
import searchIdAccount from 'utils/utils_axios/entity/searchIdAccount.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'
import notify_warning from 'src/utils/notify/notify_warning.js'
import imports from 'src/utils/imports'
import validaciones_generales from 'src/utils/validaciones_generales'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import Phone from 'src/pages/utils/PhoneNumberInput.vue'

const list = STRINGS.OpacityDialog

const refDialogoAdd = ref(null)

const optionsProvince = ref([])

const CargarProvincias = async () => {
  const response = await api.get(STRINGS.urlApiProvincia)
  optionsProvince.value = response.data.map((element) => ({
    label: element['nombre'],
    value: element['_id'],
  }))
  return optionsProvince
}

// Datos originales
const optionsMunicipio = ref([])
// Opciones filtradas
//const optionsMunicipioFiltrado = ref([])

onBeforeMount(() => {
  CargarProvincias()
  /* CargarMunicipios() */
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

const rulesAddNit_estacion = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]
/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON

    // Verificar si el código ya existe
    const existeCodigo = await verificarCodigoExistente(TextCodigo_estacion.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario

      notify_error(STRINGS.codigoRepetido)
      textCodigo_estacion.value.focus()
      return
    } else {
      var idAccountCuc = await searchIdAccount(
        imports.cardOfBankToNumber(TextCuenta_CUC.value),
        STRINGS.CUC,
      )

      var idAccountCup = await searchIdAccount(
        imports.cardOfBankToNumber(TextCuenta_CUP.value),
        STRINGS.CUP,
      )

      //Evaluar CUC
      if (idAccountCuc.id === '' && !idAccountCuc.tipo) {
        notify_warning(idAccountCuc.msj)
        textCuenta_CUC.value.focus()
        return
      } else if (idAccountCuc.id === null) {
        notify_warning(idAccountCuc.msj)
        textCuenta_CUC.value.focus()
        return
      } else if (idAccountCuc.id !== '' && !idAccountCuc.tipo) {
        notify_warning(idAccountCuc.msj)
        textCuenta_CUC.value.focus()
        return
      }

      //Evaluar CUP
      if (idAccountCup.id === '' && !idAccountCup.tipo) {
        notify_warning(idAccountCup.msj)
        textCuenta_CUP.value.focus()
        return
      } else if (idAccountCup.id === null) {
        notify_warning(idAccountCup.msj)
        textCuenta_CUP.value.focus()
        return
      } else if (idAccountCup.id !== '' && !idAccountCup.tipo) {
        notify_warning(idAccountCup.msj)
        textCuenta_CUP.value.focus()
        return
      }

      const newItem = {
        nombre: TextNombre_estacion.value,
        codigo: TextCodigo_estacion.value,
        direccion: TextDireccion_estacion.value,
        provincia: TextSelectNombre_prov.value,
        municipio: TextSelectNombre_mun.value,
        telefonos: TextTelefono_estacion.value,
        nit: Number(TextNit_estacion.value),
        cuentaCuc: idAccountCuc.id,
        cuentaCup: idAccountCup.id,
      }

      try {
        await api.post(STRINGS.urlApiEstacion, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.estacion_AddSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.estacion_AddError)

        emit('ActualizarTabla', false)
      }
      refDialogoAdd.value.hide()
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
  TextNombre_estacion.value = ''
  TextCodigo_estacion.value = ''
  TextDireccion_estacion.value = ''
  TextSelectNombre_prov.value = ''
  TextSelectNombre_mun.value = ''
  TextTelefono_estacion.value = ''
  TextNit_estacion.value = ''
  TextCuenta_CUC.value = ''
  TextCuenta_CUP.value = ''
  disabledSelectMun.value = true
}

const InputEmpty = () => {
  if (
    TextNombre_estacion.value.trim() !== '' &&
    TextCodigo_estacion.value.trim() !== '' &&
    TextTelefono_estacion.value.trim() !== '' &&
    TextNit_estacion.value.trim() !== '' &&
    TextCuenta_CUC.value.trim() !== '' &&
    TextCuenta_CUP.value.trim() !== '' &&
    TextDireccion_estacion.value.trim() !== ''
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  if (
    expRegulares.numberAndHyphen.test(TextCodigo_estacion.value.trim()) &&
    expRegulares.onlyText.test(TextNombre_estacion.value.trim()) &&
    expRegulares.onlyAddress.test(TextDireccion_estacion.value) &&
    expRegulares.onlyNumber.test(TextNit_estacion.value) &&
    expRegulares.cardOfBank.test(TextCuenta_CUC.value) &&
    expRegulares.cardOfBank.test(TextCuenta_CUP.value) &&
    expRegulares.numberPhone.test(TextTelefono_estacion.value.trim())
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
const disabledSelectMun = ref(true)

const TextNombre_estacion = ref('')
const TextCodigo_estacion = ref('')
const TextDireccion_estacion = ref('')
const TextSelectNombre_prov = ref('')
const TextSelectNombre_mun = ref('')
const TextTelefono_estacion = ref('')
const TextNit_estacion = ref('')

//Variables Banco CUC
const TextCuenta_CUC = ref('')

//Variables Banco CUP
const TextCuenta_CUP = ref('')

const backdropFilter = ref(null)

const textNombre_estacion = ref(null)
const textCodigo_estacion = ref(null)
const textDireccion_estacion = ref(null)
const textSelectNombre_prov = ref(null)
const textSelectNombre_mun = ref(null)
/* const textTelefono_estacion = ref(null) */
const textNit_estacion = ref(null)

//Variables Banco CUC
const textCuenta_CUC = ref(null)

//Variables Banco CUP
const textCuenta_CUP = ref(null)

const disabledBtnSave = ref(STRINGS.desabilitar)

watch(TextSelectNombre_prov, async (newVal) => {
  if (newVal) {
    optionsMunicipio.value = await getNomenclator.loadMunicipiosByProvincia(newVal)
  }
  disabledSelectMun.value = false
  TextSelectNombre_mun.value = ''
  checkStatusInputs()
})

watch(TextSelectNombre_mun, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
