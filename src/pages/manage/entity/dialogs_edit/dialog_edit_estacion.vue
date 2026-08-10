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
              <q-select v-model="Text_Provincia" ref="text_Provincia" :options="optionsProvince"
                :label="STRINGS.province" :rules="validaciones_generales.rulesNoEmpty" />
            </div>

            <div class="col-12 col-md-3 col-lg-3">
              <q-select v-model="Text_Municipio" ref="text_Municipio" option-value="value" :options="optionsMunicipio"
                label="Municipio" :disable="optionsMunicipio.length === 0 ? true : disabledSelectMun" />
            </div>

          </div>


          <!-- direccion, telefono y NIT -->
          <div class="row flex justify-between q-mt-sm">
            <div class="col-12 col-md-2 col-lg-3">
              <Phone ref="phoneRef" @UpdatePhone="onPhoneUpdated" :initialPhones="Text_phoneNumbers.value" />
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
              <q-btn icon="check" :class="disabledBtnSave" @click="CheckData()" :label="STRINGS.save" color="green" />
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
import { ref, onBeforeMount, watch, nextTick } from 'vue'
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
const { patchData } = useApi()

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiEstacion
  const result = await verificarExistente(url, STRINGS.codigoBD, TextCodigo_estacion.value)
  return result
}

/* Comprueba que existan cambios y que el código key no sea repetido */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (InputDifferent() && TextCodigo_estacion.value !== TextCodigo_estacion_copy.value) {
      if (await CheckCode()) {
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.codigoRepetido)
        return textCodigo_estacion.value.focus()
      } else {
        SendData()
      }
    } else {
      SendData()
    }
  }
}

/*Funcion de procesado de Datos*/
const SendData = async () => {

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
    provincia: Text_Provincia.value['value'],
    municipio: Text_Municipio.value['value'],
    telefonos: Text_phoneNumbers.value,
    nit: Number(TextNit_estacion.value),
    cuentaCuc: idAccountCuc.id,
    cuentaCup: idAccountCup.id,
  }

  try {
    const { data, error } = await patchData(STRINGS.urlApiEstacion + '/' + Text_id.value, newItem) // POST /items

    // Mostrar alerta positiva de éxito
    if (data != null && !error) {
      emit('ActualizarTabla', true)
      notify_success(STRINGS.successEdit)
      dialog.value = false
      Reset()
    } else
      notify_error(STRINGS.errorEdit)

  } catch (error) {
    console.error(STRINGS.errorEdit, error)
    notify_error(STRINGS.errorAdd)
    emit('ActualizarTabla', false)
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = async (codigo, nombre, id_provincia, provincia, id_municipio, municipio, direccion, nit, cuentaCuc, cuentaCup, telefonos, _id) => {

  // 🔍 Debug inicial
  console.log('📞 [1] Telefonos recibidos:', telefonos)

  // 1️⃣ Filtrar teléfonos limpios
  const telefonosLimpios = Array.isArray(telefonos)
    ? telefonos.filter(t => t && typeof t === 'string' && t.trim() !== '')
    : []

  console.log('📞 [2] Telefonos limpios:', telefonosLimpios)

  // 2️⃣ Abrir el diálogo PRIMERO (para que Phone se monte)
  backdropFilter.value = list
  dialog.value = true

  // 3️⃣ Esperar a que el diálogo y sus hijos se rendericen
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 50))  // Pequeño delay extra para Quasar

  // 4️⃣ AHORA asignar teléfonos y forzar carga en Phone
  Text_phoneNumbers.value = telefonosLimpios

  // 5️⃣ Llamar método manual en Phone si existe (fallback si el watch no disparó)
  await nextTick()
  if (phoneRef.value?.loadPhonesManual && telefonosLimpios.length > 0) {
    console.log('📱 [3] Llamando loadPhonesManual en Phone')
    phoneRef.value.loadPhonesManual(telefonosLimpios)
  }


  /* Se levanta el dialogo */
  backdropFilter.value = list
  dialog.value = true

  //Contenido de modelos de los capos en pantalla
  TextCodigo_estacion.value = codigo
  TextNombre_estacion.value = nombre
  TextDireccion_estacion.value = direccion
  TextNit_estacion.value = nit
  TextCuenta_CUC.value = cuentaCuc
  TextCuenta_CUP.value = cuentaCup


  Text_id.value = _id

  //Campos de selección
  Text_Provincia.value = { label: provincia, value: id_provincia }
  Text_Municipio.value = { label: municipio, value: id_municipio }

  //Copias de Seguridad
  TextCodigo_estacion_copy.value = codigo
  TextNombre_estacion_copy.value = nombre
  TextDireccion_estacion_copy.value = direccion
  TextNit_estacion_copy.value = nit
  TextCuenta_CUC_copy.value = cuentaCuc
  TextCuenta_CUP_copy.value = cuentaCup
  Text_phoneNumbers_copy.value = telefonosLimpios

  //Campos de selección Copias
  Text_Provincia_copy.value = { label: provincia, value: id_provincia }
  Text_Municipio_copy.value = { label: municipio, value: id_municipio }

  // 9️⃣ Debug final
  setTimeout(() => {
    console.log('📱 [4] Estado final Phone:', phoneRef.value?.getPhones?.())
    console.log('📱 [4] lastLoadedPhones:', phoneRef.value?.getLastLoaded?.())
  }, 100)

  // 🔟 Forzar re-validación
  setTimeout(() => {
    checkStatusInputs()
  }, 150)

}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false

  // Limpiar campos de texto
  TextNombre_estacion.value = ''
  TextCodigo_estacion.value = ''
  TextDireccion_estacion.value = ''
  TextNit_estacion.value = ''
  TextCuenta_CUC.value = ''
  TextCuenta_CUP.value = ''
  Text_id.value = ''

  // 🔥 Limpiar teléfonos
  Text_phoneNumbers.value = []

  // 🔥 Resetear componente Phone si existe
  phoneRef.value?.ResetPhones?.()

  // Resetear selects
  Text_Provincia.value = {}
  Text_Municipio.value = {}
  disabledSelectMun.value = true

  // Resetear copias
  TextNombre_estacion_copy.value = ''
  TextCodigo_estacion_copy.value = ''
  TextDireccion_estacion_copy.value = ''
  TextNit_estacion_copy.value = ''
  TextCuenta_CUC_copy.value = ''
  TextCuenta_CUP_copy.value = ''
  Text_Provincia_copy.value = {}
  Text_Municipio_copy.value = {}
}

// 🔥 Función que se ejecuta cada vez que cambia un teléfono
const onPhoneUpdated = (phonesArray) => {
  Text_phoneNumbers.value = phonesArray
}

/* Función para evaluar que los teléfonos NO hayan sido modificados */
const phoneDifferent = () => {
  // Filtrar valores válidos (no vacíos, strings)
  const current = Text_phoneNumbers.value
    .filter(p => p && typeof p === 'string' && p.trim() !== '')
    .map(p => p.trim())

  const original = (Text_phoneNumbers_copy.value || [])
    .filter(p => p && typeof p === 'string' && p.trim() !== '')
    .map(p => p.trim())

  // 🔍 Debug (opcional, quitar en producción)
  // console.log('📱 Comparando teléfonos:', { current, original })

  // 1️⃣ Si las longitudes difieren → hay cambios
  if (current.length !== original.length) {
    return false  // false = "sí hay cambios"
  }

  // 2️⃣ Comparar elemento por elemento (orden importa)
  for (let i = 0; i < current.length; i++) {
    if (current[i] !== original[i]) {
      return false  // false = "sí hay cambios"
    }
  }

  // 3️⃣ Si todo coincide → sin cambios
  return true  // true = "no hay cambios"
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    TextNombre_estacion.value.trim() !== '' &&
    TextCodigo_estacion.value.trim() !== '' &&
    Text_phoneNumbers.value.length > 0 &&
    TextNit_estacion.value !== '' &&
    TextCuenta_CUC.value.trim() !== '' &&
    TextCuenta_CUP.value.trim() !== '' &&
    TextDireccion_estacion.value.trim() !== '' &&
    Text_Provincia.value['label'] !== '' &&
    Text_Municipio.value['label'] !== ''
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
    CheckPhoneNumbers(Text_phoneNumbers.value)
  )
    return true
  else return false
}

/* Función para evaluar que los campos hallan sido modificados */
const InputDifferent = () => {
  return !(
    TextCodigo_estacion.value == TextCodigo_estacion_copy.value &&
    TextNombre_estacion.value == TextNombre_estacion_copy.value && Text_Provincia.value['label'] == Text_Provincia_copy.value['label'] && TextDireccion_estacion.value == TextDireccion_estacion_copy.value && TextNit_estacion.value == TextNit_estacion_copy.value && TextCuenta_CUC.value == TextCuenta_CUC_copy.value && TextCuenta_CUP.value == TextCuenta_CUP_copy.value && phoneDifferent())
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
  const isValid = InputEmpty() && InputRegularExpressions() && InputDifferent()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

//Ref dialogo
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)
//const isEditMode = ref(true)


/* Emisor */
const emit = defineEmits(['ActualizarTabla'])

//Ref Variables
const TextNombre_estacion = ref('')
const TextCodigo_estacion = ref('')
const TextDireccion_estacion = ref('')
const Text_Provincia = ref({})
const Text_Municipio = ref({})
const TextNit_estacion = ref('')
const disabledSelectMun = ref(true)
const TextCuenta_CUC = ref('')
const TextCuenta_CUP = ref('')
const Text_phoneNumbers = ref([])
const Text_id = ref('')


//Ref Variables
const TextNombre_estacion_copy = ref('')
const TextCodigo_estacion_copy = ref('')
const TextDireccion_estacion_copy = ref('')
const Text_Provincia_copy = ref({})
const Text_Municipio_copy = ref({})
const TextNit_estacion_copy = ref('')
const TextCuenta_CUC_copy = ref('')
const TextCuenta_CUP_copy = ref('')
const Text_phoneNumbers_copy = ref([])


//Ref Campos
const textNombre_estacion = ref(null)
const textCodigo_estacion = ref(null)
const textDireccion_estacion = ref(null)
const text_Provincia = ref(null)
const text_Municipio = ref(null)
const textNit_estacion = ref(null)
const textCuenta_CUC = ref(null)
const textCuenta_CUP = ref(null)
const phoneRef = ref(null)


//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

// Constantes que precargan los datos de los selectores
const optionsProvince = ref([])
const optionsMunicipio = ref([])

const loadProvincias = async () => {
  return optionsProvince.value = await getNomenclator.loadProvincias()
}

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(Text_Provincia, async (newVal, oldVal) => {

  if (newVal.label && oldVal.label !== undefined) {
    disabledSelectMun.value = false
    optionsMunicipio.value = await getNomenclator.loadMunicipiosByProvincia(newVal)
    Text_Municipio.value = { label: '', value: '' }
  } else if (newVal.label && oldVal.label == undefined) {
    disabledSelectMun.value = true
  }

  /* disabledSelectMun.value = false
   Text_Municipio.value = { label: '', value: '' }*/
  checkStatusInputs()
})

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(Text_Municipio, () => {
  checkStatusInputs()
})

watch(Text_phoneNumbers, () => {
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
  getUpDialogEdit,
})
</script>
