<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter" full-width>
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.add.toUpperCase() }} {{ STRINGS.estacionesLowercase.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre , provincia y municipio -->
          <div class="row flex justify-between q-mb-lg">
            <div class="col-12 col-sm-5 col-md-2 col-lg-2">
              <q-input v-model="TextCodigo_estacion" ref="textCodigo_estacion" color="green"
                :rules="validaciones_generales.rulesNumberAndHyphen" type="text" :label="STRINGS.codigo_estacion"
                @keyup="checkStatusInputs" />
            </div>

            <div class="col-12 col-sm-5 col-md-3 col-lg-3">
              <q-input v-model="TextNombre_estacion" ref="textNombre_estacion" color="green" type="text"
                :rules="validaciones_generales.rulesOnlyText" :label="STRINGS.nombre_estacion"
                @keyup="checkStatusInputs" />
            </div>

            <div class="col-12 col-md-3 col-lg-3">
              <q-select v-model="TextSelectNombre_prov" ref="textSelectNombre_prov" :options="optionsProvince"
                :label="STRINGS.province" :rules="validaciones_generales.rulesNoEmpty" />
            </div>

            <div class="col-12 col-md-3 col-lg-3">
              <q-select v-model="TextSelectNombre_mun" ref="textSelectNombre_mun" option-value="value"
                :options="optionsMunicipio" label="Municipio"
                :disable="optionsMunicipio.length === 0 ? true : disabledSelectMun" />
            </div>

          </div>


          <!-- direccion, telefono y NIT -->
          <div class="row flex justify-between q-mt-sm">
            <div class="col-12 col-md-2 col-lg-3">
              <Phone ref="phoneRef" @UpdatePhone="onPhoneUpdated" />
            </div>

            <div class="col-12 col-md-6 col-lg-6">
              <q-input v-model="TextDireccion_estacion" ref="textDireccion_estacion" color="green"
                :rules="validaciones_generales.rulesAddress" type="text" :label="STRINGS.direccion_estacion"
                @keyup="checkStatusInputs" />
            </div>

            <div class="col-12 col-md-2 col-lg-2">
              <q-input v-model="TextNit_estacion" ref="textNit_estacion" color="green" type="text"
                :rules="validaciones_generales.rulesOnlyNumbers" :label="STRINGS.NIT_estacion"
                @keyup="checkStatusInputs" />
            </div>
          </div>

          <!-- Banco CUC & Banco CUP-->
          <div class="row flex justify-between q-mt-md">
            <div class="col-12 col-md-5 col-lg-5">
              <div class="row flex justify-between">
                <div class="col-12 col-md-5 col-lg-5 q-mb-lg">
                  <p class="no-margin">{{ STRINGS.cuentaCUC.toUpperCase() }}:</p>
                  <q-input v-model="TextCuenta_CUC" ref="textCuenta_CUC" color="green" maxlength="19" type="text"
                    :rules="validaciones_generales.rulesCardOfBank" :label="STRINGS.cuenta"
                    @keyup="checkStatusInputs" />
                </div>

                <div class="col-12 col-md-5 col-lg-5 q-mb-lg">
                  <p class="no-margin">{{ STRINGS.cuentaCUP.toUpperCase() }}:</p>
                  <q-input ref="textCuenta_CUP" v-model="TextCuenta_CUP" color="green" type="text"
                    :rules="validaciones_generales.rulesCardOfBank" :label="STRINGS.cuenta"
                    @keyup="checkStatusInputs" />
                </div>
              </div>
            </div>


            <div class="col-12 col-md-6 col-lg-5">

              <p class="q-ml-md">{{ STRINGS.parametros.toUpperCase() }}</p>

              <div class="row disabled" style="border: 2px solid #ccc;">
                <div class="col-4">
                  <q-radio v-model="TextmBase_moneda" ref="textmBase_moneda" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="STRINGS.yes" :label="STRINGS.abonados_locales_estacion"
                    @change="checkStatusInputs" />
                </div>
                <div class="col-4">
                  <q-radio v-model="TextmBase_moneda" ref="textmBase_moneda" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="STRINGS.no" :label="STRINGS.comprobante_estacion"
                    @change="checkStatusInputs" />
                </div>

                <div class="col-4">
                  <q-radio v-model="TextmBase_moneda" ref="textmBase_moneda" checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye" :val="STRINGS.no" :label="STRINGS.tarjetas_estacion"
                    @change="checkStatusInputs" />
                </div>
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
import { useApi } from 'src/composables/useApi'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode'
import searchIdAccount from 'utils/utils_axios/entity/searchIdAccount.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import Phone from 'src/pages/utils/PhoneNumberInput.vue'
import { useNotify } from 'src/utils/notify/notify.js'


/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { notify_success, notify_warning, notify_error } = useNotify()


const { postData } = useApi()

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON

    // Verificar si el código ya existe
    const existeCodigo = await verificarExistente(STRINGS.urlApiEstacion, STRINGS.codigoBD, TextCodigo_estacion.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario

      notify_error(STRINGS.codigoRepetido)
      textCodigo_estacion.value.focus()
      return
    } else {


      const idAccountCuc = await searchIdAccount(
        TextCuenta_CUC.value,
        STRINGS.CUC,
      )

      const idAccountCup = await searchIdAccount(
        TextCuenta_CUP.value,
        STRINGS.CUP,
      )

      if (!CheckAccount(idAccountCuc, textCuenta_CUC) || !CheckAccount(idAccountCup, textCuenta_CUP))
        return

      /* Se crea el objeto con los datos del formulario */
      const newItem = {
        nombre: TextNombre_estacion.value,
        codigo: TextCodigo_estacion.value,
        direccion: TextDireccion_estacion.value,
        provincia: TextSelectNombre_prov.value['value'],
        municipio: TextSelectNombre_mun.value['value'],
        telefonos: phoneNumbers.value,
        nit: Number(TextNit_estacion.value),
        cuentaCuc: idAccountCuc.id,
        cuentaCup: idAccountCup.id,
      }

      try {
        const { data, error } = await postData(STRINGS.urlApiEstacion, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        if (data != null && !error) {
          emit('ActualizarTabla', true)
          notify_success(STRINGS.successAdd)
        } else
          notify_error(error)

      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.errorAdd)

        emit('ActualizarTabla', false)
      }
      dialog.value = false
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
  TextNit_estacion.value = ''
  TextCuenta_CUC.value = ''
  TextCuenta_CUP.value = ''
  disabledSelectMun.value = true
}

// 🔥 Función que se ejecuta cada vez que cambia un teléfono
const onPhoneUpdated = (phonesArray) => {
  console.log('Teléfonos actualizados:', phonesArray)
  phoneNumbers.value = phonesArray
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    TextNombre_estacion.value.trim() !== '' &&
    TextCodigo_estacion.value.trim() !== '' &&
    phoneNumbers.value.length > 0 &&
    TextNit_estacion.value !== '' &&
    TextCuenta_CUC.value.trim() !== '' &&
    TextCuenta_CUP.value.trim() !== '' &&
    TextDireccion_estacion.value.trim() !== ''
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {



  if (
    expRegulares.numberAndHyphen.test(TextCodigo_estacion.value.trim()) &&
    expRegulares.onlyText.test(TextNombre_estacion.value.trim()) &&
    expRegulares.onlyAddress.test(TextDireccion_estacion.value) &&
    expRegulares.onlyNumber.test(TextNit_estacion.value) &&
    expRegulares.cardOfBank.test(TextCuenta_CUC.value) &&
    expRegulares.cardOfBank.test(TextCuenta_CUP.value) &&
    CheckPhoneNumbers(phoneNumbers.value)
  )
    return true
  else return false
}

const CheckPhoneNumbers = (phones) => {
  phones.forEach(element => {
    const result = expRegulares.numberPhone.test(element) || element !== '' ? true : false
    if (!result) {
      phoneRef.value.Focus()
      return false
    }
  });
  return true
}

const CheckAccount = (objectAccount, refInput) => {

  if (objectAccount.id !== null && !objectAccount.isValidType) {
    notify_warning(objectAccount.message)
    refInput.value.focus()
    return false
  } else if (objectAccount.id === null && !objectAccount.isValidType) {
    notify_error(objectAccount.message)
    refInput.value.focus()
    return false
  } else if (objectAccount.id !== null && objectAccount.isValid && objectAccount.message !== '') {
    refInput.value.focus()
    return false
  }

  return true
}

//Función para comprobar los campos y habilitar botón GUARDAR
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

//Ref dialogo
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)

/* Emisor */
const emit = defineEmits(['ActualizarTabla'])

//Ref Variables
const TextNombre_estacion = ref('')
const TextCodigo_estacion = ref('')
const TextDireccion_estacion = ref('')
const TextSelectNombre_prov = ref('')
const TextSelectNombre_mun = ref('')
const TextNit_estacion = ref('')
const disabledSelectMun = ref(true)
const TextCuenta_CUC = ref('')
const TextCuenta_CUP = ref('')

const phoneRef = ref(null)
const phoneNumbers = ref([])  // Aquí guardaremos los teléfonos

//Ref Campos
const textNombre_estacion = ref(null)
const textCodigo_estacion = ref(null)
const textDireccion_estacion = ref(null)
const textSelectNombre_prov = ref(null)
const textSelectNombre_mun = ref(null)
const textNit_estacion = ref(null)
const textCuenta_CUC = ref(null)
const textCuenta_CUP = ref(null)


//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

// Constantes que precargan los datos de los selectores
const optionsProvince = ref([])
const optionsMunicipio = ref([])

const loadProvincias = async () => {
  return optionsProvince.value = await getNomenclator.loadProvincias()
}

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(TextSelectNombre_prov, async (newVal) => {
  if (newVal.label) {
    optionsMunicipio.value = await getNomenclator.loadMunicipiosByProvincia(newVal)
  }
  disabledSelectMun.value = false
  TextSelectNombre_mun.value = ''
  checkStatusInputs()
})

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch([TextSelectNombre_mun, phoneNumbers], () => {
  checkStatusInputs()
})

/*
Registra un funcionalidades que se llamarán justo antes de que se monte el componente.
*/
onBeforeMount(() => {
  loadProvincias()
})


/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogAdd,
})
</script>
