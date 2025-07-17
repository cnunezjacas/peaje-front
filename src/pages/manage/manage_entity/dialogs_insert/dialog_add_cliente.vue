<template>
  <div class="">
    <q-dialog
      v-model="dialog"
      persistent
      full-width
      ref="refDialogoAdd"
      :backdrop-filter="backdropFilter"
    >
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.add.toUpperCase() }} {{ STRINGS.clientesLowercase.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <!-- codigo,categoria y nombre -->
          <div class="row flex justify-between q-mb-md">
            <div class="col-3">
              <q-input
                v-model="TextNombre_cliente"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesOnlyText"
                lazy-rules
                :label="STRINGS.nombre_cliente"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-2">
              <q-input
                v-model="TextCodigo_cliente"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesNumberAndHyphen"
                :label="STRINGS.codigo_cliente"
                lazy-rules
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-2">
              <q-select
                v-model="TextCategoria_cliente"
                color="green"
                :options="options"
                :rules="validacionesGenerales.rulesNoEmpty"
                lazy-rules
                :label="STRINGS.categoria_cliente"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-1">
              <q-input
                v-model="TextSiglas_cliente"
                color="green"
                type="text"
                :rules="validacionesGenerales.rulesOnlyUppercase"
                lazy-rules
                :label="STRINGS.siglas_cliente"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-2">
              <q-select
                v-model="TextEstacion_cliente"
                color="green"
                :options="options"
                disable
                :rules="validacionesGenerales.rulesNoEmpty"
                lazy-rules
                :label="STRINGS.estacion_cliente"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <!-- siglas,estación y Organismo -->
          <div class="row flex justify-between">
            <div class="col-2">
              <Phone ref="refPhone" @UpdatePhone="UpdatePhone" />
            </div>

            <div class="col-9">
              <div class="row flex justify-between">
                <div class="col-2 q-mb-xl">
                  <q-select
                    v-model="TextOrganismo_cliente"
                    color="green"
                    :options="optionsOrganismo"
                    :rules="validacionesGenerales.rulesNoEmpty"
                    lazy-rules
                    :label="STRINGS.organismo_cliente"
                    @keyup="checkStatusInputs"
                  />
                </div>

                <div class="col-3 q-mb-xl">
                  <q-input
                    v-model="TextIdTributaria_cliente"
                    color="green"
                    type="text"
                    :rules="validacionesGenerales.rulesOnlyNumbers"
                    lazy-rules
                    :label="STRINGS.idTributaria_cliente"
                    @keyup="checkStatusInputs"
                  />
                </div>

                <div class="col-3 q-mb-xl">
                  <q-input
                    v-model="TextRegistroComercial_cliente"
                    color="green"
                    type="text"
                    :rules="validacionesGenerales.rulesFullTextAndNumber"
                    lazy-rules
                    :label="STRINGS.registroComercial_cliente"
                    @keyup="checkStatusInputs"
                  />
                </div>

                <div class="col-3 q-mb-xl">
                  <q-input
                    v-model="TextRegistroMercantil_cliente"
                    color="green"
                    type="text"
                    :rules="validacionesGenerales.rulesFullTextAndNumber"
                    lazy-rules
                    :label="STRINGS.registroMercantil_cliente"
                    @keyup="checkStatusInputs"
                  />
                </div>

                <!-- Continuidad de Items -->

                <div class="col-2 q-mb-xl">
                  <q-select
                    v-model="TextSelectNombre_prov"
                    color="green"
                    :options="optionsProvincia"
                    :rules="validacionesGenerales.rulesNoEmpty"
                    lazy-rules
                    :label="imports.capitalizeWords(STRINGS.provinciaLowercase)"
                    @keyup="checkStatusInputs"
                  />
                </div>

                <div class="col-2 q-mb-xl">
                  <q-select
                    v-model="TextSelectNombre_mun"
                    color="green"
                    :options="optionsMunicipio"
                    :disable="optionsMunicipio.length === 0 ? true : disabledSelectMun"
                    :rules="validacionesGenerales.rulesNoEmpty"
                    lazy-rules
                    :label="imports.capitalizeWords(STRINGS.municipioLowercase)"
                    @keyup="checkStatusInputs"
                  />
                </div>

                <div class="col-7 q-mb-xl">
                  <q-input
                    v-model="TextDireccion_cliente"
                    color="green"
                    type="text"
                    :rules="validacionesGenerales.rulesAddress"
                    lazy-rules
                    :label="STRINGS.direccion_cliente"
                    @keyup="checkStatusInputs"
                  />
                </div>

                <!-- Items 3era fila -->

                <div class="col-12">
                  <!-- Banco CUC & Banco CUP-->
                  <div class="row flex justify-between">
                    <div class="col-5">
                      <p>{{ STRINGS.bancoCUC.toUpperCase() }}</p>
                    </div>

                    <div class="col-5">
                      <p>{{ STRINGS.bancoCUP.toUpperCase() }}</p>
                    </div>
                  </div>
                  <div class="row flex justify-between border-box-bank-box-small">
                    <div class="col-5">
                      <q-input
                        v-model="TextCuenta_CUC"
                        ref="textCuenta_CUC"
                        color="green"
                        maxlength="19"
                        type="text"
                        :rules="validacionesGenerales.rulesCardOfBank"
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
                        :rules="validacionesGenerales.rulesCardOfBank"
                        :label="STRINGS.cuenta"
                        @keyup="checkStatusInputs"
                      />
                    </div>
                  </div>
                </div>
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
import { ref, watch, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
//import api from 'src/axios.js'
//import verificarCuentaDeBanco from 'utils/utils_axios/entity/verificarCuentaDeBanco.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import validacionesGenerales from 'utils/validaciones_generales.js'
import notify_success from 'src/utils/notify/notify_success.js'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator.js'
import imports from 'src/utils/imports'
import Phone from 'src/pages/manage/manage_entity/template/PhoneNumberInput.vue'
//import notify_error from 'src/utils/notify/notify_error.js'

const options = ref([])
const optionsOrganismo = ref([])
const optionsProvincia = ref([])
const optionsMunicipio = ref([])

const loadOrganismo = async () => {
  optionsOrganismo.value = await getNomenclator.loadOrganismo()
}

const loadProvincias = async () => {
  optionsProvincia.value = await getNomenclator.loadProvincias()
}

onBeforeMount(() => {
  loadOrganismo()
  loadProvincias()
})

options.value = ['Empresa', 'Persona']

//const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  //TODO: Send Add
  if (disabledBtnSave.value !== STRINGS.desabilitar) {
    notify_success('Correcto!')
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
  TextNombre_cliente.value = ''
  TextCodigo_cliente.value = ''
  TextCategoria_cliente.value = ''
  TextSiglas_cliente.value = ''
  TextEstacion_cliente.value = ''
  TextOrganismo_cliente.value = ''
  TextCuenta_CUC.value = ''
  TextCuenta_CUP.value = ''
  TextIdTributaria_cliente.value = ''
  TextRegistroComercial_cliente.value = ''
  TextRegistroMercantil_cliente.value = ''
  TextSelectNombre_prov.value = ''
  TextDireccion_cliente.value = ''
}

const InputEmpty = () => {
  if (
    TextCodigo_cliente.value.trim() !== '' &&
    TextNombre_cliente.value.trim() !== '' &&
    TextCategoria_cliente.value !== '' &&
    TextSiglas_cliente.value !== '' &&
    /*  TextEstacion_cliente.value !== '' && */
    TextNumerosTelefonicos_cliente.value !== '' &&
    TextOrganismo_cliente.value !== '' &&
    TextCuenta_CUC.value !== '' &&
    TextCuenta_CUP.value !== '' &&
    TextIdTributaria_cliente.value !== '' &&
    TextRegistroComercial_cliente.value !== '' &&
    TextRegistroMercantil_cliente.value !== '' &&
    TextSelectNombre_prov.value !== '' &&
    TextSelectNombre_mun.value !== '' &&
    TextDireccion_cliente.value !== ''
  )
    return true
  else return false
}

const InputRegularExpressions = () => {
  if (
    expRegulares.onlyText.test(TextNombre_cliente.value) &&
    expRegulares.numberAndHyphen.test(TextCodigo_cliente.value) &&
    expRegulares.onlyUppercase.test(TextSiglas_cliente.value) &&
    expRegulares.cardOfBank.test(TextCuenta_CUC.value) &&
    expRegulares.cardOfBank.test(TextCuenta_CUP.value) &&
    expRegulares.onlyNumber.test(TextIdTributaria_cliente.value) &&
    expRegulares.TextAndNumber.test(TextRegistroComercial_cliente.value) &&
    expRegulares.TextAndNumber.test(TextRegistroMercantil_cliente.value) &&
    expRegulares.numberPhoneSlash.test(TextNumerosTelefonicos_cliente.value)
  )
    return true
  else return false
}

const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

//Variables Cliente
const TextCodigo_cliente = ref('')
const TextNombre_cliente = ref('')
const TextCategoria_cliente = ref('')
const TextSiglas_cliente = ref('')
const TextEstacion_cliente = ref('')
const TextOrganismo_cliente = ref('')
const TextCuenta_CUC = ref('')
const TextCuenta_CUP = ref('')
const TextSelectNombre_prov = ref('')
const TextSelectNombre_mun = ref('')
const TextDireccion_cliente = ref('')
const TextIdTributaria_cliente = ref('')
const TextRegistroComercial_cliente = ref('')
const TextRegistroMercantil_cliente = ref('')
var TextNumerosTelefonicos_cliente = ref('')

const refPhone = ref(null)

const disabledSelectMun = ref(true)

//REF Banco

const disabledBtnSave = ref(STRINGS.desabilitar)

//Ref Dialog
const dialog = ref(false)
const refDialogoAdd = ref(null)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)

//Casos Especiales
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

watch(TextOrganismo_cliente, () => {
  checkStatusInputs()
})

watch(TextCategoria_cliente, () => {
  checkStatusInputs()
})

watch(TextNumerosTelefonicos_cliente, (newVal) => {
  console.log('newVal:' + newVal)
  checkStatusInputs()
})

const UpdatePhone = (value) => {
  if (value !== null) TextNumerosTelefonicos_cliente.value = refPhone.value.getPhone()
}

defineExpose({
  getUpDialogAdd,
})
</script>
