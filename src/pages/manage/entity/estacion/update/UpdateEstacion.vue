<template>
  <div class="">
    <q-dialog
      v-model="dialog"
      persistent
      ref="refDialogoAdd"
      :backdrop-filter="backdropFilter"
      full-width
    >
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.update.toUpperCase() }} - {{ STRINGS.station.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre , provincia y municipio -->
          <div class="row flex justify-between q-mb-lg">
            <div class="col-12 col-sm-5 col-md-2 col-lg-2">
              <q-input
                v-model="TextCodigo_estacion"
                ref="textCodigo_estacion"
                color="green"
                :rules="validaciones_generales.rulesNumberAndHyphen"
                type="text"
                :label="STRINGS.codigo_estacion"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-12 col-sm-5 col-md-3 col-lg-3">
              <q-input
                v-model="TextNombre_estacion"
                ref="textNombre_estacion"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyText"
                :label="STRINGS.nombre_estacion"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-12 col-md-3 col-lg-3">
              <q-select
                v-model="Text_Provincia"
                ref="text_Provincia"
                :options="optionsProvince"
                :label="STRINGS.province"
                :rules="validaciones_generales.rulesNoEmpty"
              />
            </div>

            <div class="col-12 col-md-3 col-lg-3">
              <q-select
                v-model="Text_Municipio"
                ref="text_Municipio"
                option-value="value"
                :options="optionsMunicipio"
                label="Municipio"
                :disable="optionsMunicipio.length === 0 ? true : disabledSelectMun"
              />
            </div>
          </div>

          <!-- direccion, telefono y NIT -->
          <div class="row flex justify-between q-mt-sm">
            <div class="col-12 col-md-2 col-lg-3">
              <Phone
                ref="phoneRef"
                @UpdatePhone="onPhoneUpdated"
                :initialPhones="Text_phoneNumbers.value"
              />
            </div>

            <div class="col-12 col-md-6 col-lg-6">
              <q-input
                v-model="TextDireccion_estacion"
                ref="textDireccion_estacion"
                color="green"
                :rules="validaciones_generales.rulesAddress"
                type="text"
                :label="STRINGS.direccion_estacion"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-12 col-md-2 col-lg-2">
              <q-input
                v-model="TextNit_estacion"
                ref="textNit_estacion"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyNumbers"
                :label="STRINGS.NIT_estacion"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <!-- Banco CUC & Banco CUP-->
          <div class="row flex justify-between q-mt-md">
            <div class="col-12 col-md-5 col-lg-5">
              <div class="row flex justify-between">
                <div class="col-12 col-md-5 col-lg-5 q-mb-lg">
                  <p class="no-margin">{{ STRINGS.cuentaCUC.toUpperCase() }}:</p>
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

                <div class="col-12 col-md-5 col-lg-5 q-mb-lg">
                  <p class="no-margin">{{ STRINGS.cuentaCUP.toUpperCase() }}:</p>
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
            </div>

            <div class="col-12 col-md-6 col-lg-5">
              <p class="q-ml-md">{{ STRINGS.parametros.toUpperCase() }}</p>

              <div class="row disabled" style="border: 2px solid #ccc">
                <div class="col-4">
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
                <div class="col-4">
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

                <div class="col-4">
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
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn
                icon="check"
                :class="disabledBtnSave"
                @click="CheckData()"
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
/**
 * @module UpdateEstacion
 * @description Componente de diálogo para editar estaciones de peaje existentes
 * Gestiona datos completos: código, nombre, ubicación, teléfonos, NIT y cuentas bancarias
 * Incluye validación de duplicados, verificación de tipos de cuenta y detección de cambios
 */

import { ref, onBeforeMount, watch, nextTick } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'src/composables/useApi'
import CheckField from 'src/utils/utils_axios/nomencladores/CheckField'
import searchIdAccount from 'utils/utils_axios/entity/searchIdAccount.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import Phone from 'src/pages/utils/PhoneNumberInput.vue'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES Y COMPOSABLES ===== */
/* =================================================== */
const { notify_success, notify_warning, notify_error } = useNotify()
const { patchData, fetchData } = useApi()

/* Emisor */
const emit = defineEmits(['ActualizarTabla'])

/**
 * Verifica si el código de estación ya existe en la base de datos
 * @async
 * @returns {Promise<boolean>} true si el código existe, false si está disponible
 */
const CheckCode = async () => {
  const url = STRINGS.urlApiEstacion
  const result = await CheckField(url, STRINGS.codigoBD, TextCodigo_estacion.value, fetchData)
  return result
}

/**
 * Valida que la cuenta bancaria exista y sea del tipo correcto (CUC/CUP)
 * @param {Object} objectAccount - Resultado de searchIdAccount
 * @param {Ref} refInput - Referencia reactiva al input para hacer focus
 * @returns {boolean} true si la cuenta es válida
 */
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

/**
 * Valida que todos los números telefónicos cumplan con el formato esperado
 * Usa for...of en lugar de forEach para poder retornar false correctamente
 * @param {string[]} phones - Array de números telefónicos
 * @returns {boolean} true si todos son válidos
 */
const CheckPhoneNumbers = (phones) => {
  phones.forEach((element) => {
    const result = expRegulares.numberPhone.test(element) || element !== '' ? true : false
    if (!result) {
      phoneRef.value.Focus()
      return false
    }
  })
  return true
}

/**
 * Valida los datos antes de enviarlos al backend
 * Verifica si el código cambió y si es así, valida que no exista duplicado
 */
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

/**
 * Envía los datos actualizados de la estación al backend
 * Valida cuentas bancarias CUC y CUP antes de enviar
 */
const SendData = async () => {
  const idAccountCuc = await searchIdAccount(TextCuenta_CUC.value, STRINGS.CUC, fetchData)
  const idAccountCup = await searchIdAccount(TextCuenta_CUP.value, STRINGS.CUP, fetchData)

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

    if (!data && error) return notify_error(`${STRINGS.errorEdit} ${STRINGS.station}`)

    emit('ActualizarTabla', true)
    // Mostrar alerta positiva de éxito
    notify_success(`${STRINGS.station} ${STRINGS.successEdit}`)
    Reset()
  } catch (error) {
    console.error(`${STRINGS.errorEdit} ${STRINGS.station} :`, error)
    notify_error(`${STRINGS.errorEdit} ${STRINGS.station}`)
  }
}

/**
 * Abre el diálogo de edición y carga los datos de la estación seleccionada
 * Usa nextTick para asegurar que el componente Phone esté montado antes de cargar teléfonos
 * @param {Object} row - Objeto completo con los datos de la estación
 */
const getUpDialogEdit = async (row) => {
  // Filtrar teléfonos limpios
  const telefonosLimpios = Array.isArray(row.telefonos)
    ? row.telefonos.filter((t) => t && typeof t === 'string' && t.trim() !== '')
    : []

  // Abrir el diálogo PRIMERO (para que Phone se monte)
  backdropFilter.value = list
  dialog.value = true

  // Esperar a que el diálogo y sus hijos se rendericen
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 50)) // Pequeño delay extra para Quasar

  // Asignar teléfonos y forzar carga en Phone
  Text_phoneNumbers.value = telefonosLimpios

  // Llamar método manual en Phone si existe
  await nextTick()
  if (phoneRef.value?.loadPhonesManual && telefonosLimpios.length > 0) {
    phoneRef.value.loadPhonesManual(telefonosLimpios)
  }

  // Cargar datos del formulario
  TextCodigo_estacion.value = row.codigo
  TextNombre_estacion.value = row.nombre
  TextDireccion_estacion.value = row.direccion
  TextNit_estacion.value = row.nit
  TextCuenta_CUC.value = row.cuentaCuc?.numero
  TextCuenta_CUP.value = row.cuentaCup?.numero
  Text_id.value = row._id

  // Campos de selección
  Text_Provincia.value = { label: row.provincia?.nombre, value: row.provincia?._id }
  Text_Municipio.value = { label: row.municipio?.nombre, value: row.municipio?._id }

  //Copias de Seguridad
  TextCodigo_estacion_copy.value = row.codigo
  TextNombre_estacion_copy.value = row.nombre
  TextDireccion_estacion_copy.value = row.direccion
  TextNit_estacion_copy.value = row.nit
  TextCuenta_CUC_copy.value = row.cuentaCuc?.numero
  TextCuenta_CUP_copy.value = row.cuentaCup?.numero
  Text_phoneNumbers_copy.value = telefonosLimpios
  Text_Provincia_copy.value = { label: row.provincia?.nombre, value: row.provincia?._id }
  Text_Municipio_copy.value = { label: row.municipio?.nombre, value: row.municipio?._id }

  // Forzar re-validación después de un delay
  setTimeout(() => {
    checkStatusInputs()
  }, 150)
}

/**
 * Limpia todos los campos del formulario y resetea el componente Phone
 */
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

  // Limpiar teléfonos
  Text_phoneNumbers.value = []

  //  Resetear componente Phone si existe
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

/**
 * Handler del evento UpdatePhone del componente Phone
 * @param {string[]} phonesArray - Array actualizado de teléfonos
 */
const onPhoneUpdated = (phonesArray) => {
  Text_phoneNumbers.value = phonesArray
}

/**
 * Compara los teléfonos actuales con los originales para detectar cambios
 * @returns {boolean} true si no hay cambios, false si hay cambios
 */
const phoneDifferent = () => {
  const current = Text_phoneNumbers.value
    .filter((p) => p && typeof p === 'string' && p.trim() !== '')
    .map((p) => p.trim())

  const original = (Text_phoneNumbers_copy.value || [])
    .filter((p) => p && typeof p === 'string' && p.trim() !== '')
    .map((p) => p.trim())

  if (current.length !== original.length) return false

  for (let i = 0; i < current.length; i++) {
    if (current[i] !== original[i]) return false
  }

  return true
}

/**
 * Valida que todos los campos obligatorios no estén vacíos
 * @returns {boolean} true si todos los campos tienen contenido
 */
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

/**
 * Valida que los campos cumplan con las expresiones regulares
 * @returns {boolean} true si todos los campos son válidos
 */
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

/**
 * Evalúa si algún campo ha sido modificado comparando con las copias
 * @returns {boolean} true si hay al menos un cambio
 */
const InputDifferent = () => {
  return !(
    TextCodigo_estacion.value == TextCodigo_estacion_copy.value &&
    TextNombre_estacion.value == TextNombre_estacion_copy.value &&
    Text_Provincia.value['value'] == Text_Provincia_copy.value['value'] &&
    Text_Municipio.value['value'] == Text_Municipio_copy.value['value'] &&
    TextDireccion_estacion.value == TextDireccion_estacion_copy.value &&
    TextNit_estacion.value == TextNit_estacion_copy.value &&
    TextCuenta_CUC.value == TextCuenta_CUC_copy.value &&
    TextCuenta_CUP.value == TextCuenta_CUP_copy.value &&
    phoneDifferent()
  )
}

/**
 * Verifica el estado completo del formulario y habilita/deshabilita el botón guardar
 * @returns {string} cadena vacía si válido, STRINGS.desabilitar si no
 */
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions() && InputDifferent()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/**
 * Carga las provincias disponibles para el selector
 */
const loadProvincias = async () => {
  return (optionsProvince.value = await getNomenclator.loadProvincias())
}

/* =================================================== */
/*  ===== VARIABLES REACTIVAS (REFS) ===== */
/* =================================================== */

//Ref dialogo
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)
//const isEditMode = ref(true)

// Campos del formulario
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

// Copias de seguridad
const TextNombre_estacion_copy = ref('')
const TextCodigo_estacion_copy = ref('')
const TextDireccion_estacion_copy = ref('')
const Text_Provincia_copy = ref({})
const Text_Municipio_copy = ref({})
const TextNit_estacion_copy = ref('')
const TextCuenta_CUC_copy = ref('')
const TextCuenta_CUP_copy = ref('')
const Text_phoneNumbers_copy = ref([])

// Referencias a inputs
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

/* Constantes que precargan los datos de los selectores
 provincia y municipio */
const optionsProvince = ref([])
const optionsMunicipio = ref([])

/* =================================================== */
/*  ===== WATCHERS ===== */
/* =================================================== */

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(Text_Provincia, async (newVal, oldVal) => {
  if (newVal.label && oldVal.label !== undefined) {
    disabledSelectMun.value = false
    optionsMunicipio.value = await getNomenclator.loadMunicipiosByProvincia(newVal)
    Text_Municipio.value = { label: '', value: '' }
  } else if (newVal.label && oldVal.label == undefined) {
    disabledSelectMun.value = true
  }

  checkStatusInputs()
})

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(Text_Municipio, () => {
  checkStatusInputs()
})

watch(Text_phoneNumbers, () => {
  checkStatusInputs()
})

/* =================================================== */
/*  ===== CICLO DE VIDA ===== */
/* =================================================== */

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
