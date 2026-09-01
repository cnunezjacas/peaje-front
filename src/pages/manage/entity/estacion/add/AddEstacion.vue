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
            <q-icon name="note_add" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.name_estaciones.toUpperCase() }}</span
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
                v-model="TextSelectNombre_prov"
                ref="textSelectNombre_prov"
                :options="optionsProvince"
                :label="STRINGS.province"
                :rules="validaciones_generales.rulesNoEmpty"
              />
            </div>

            <div class="col-12 col-md-3 col-lg-3">
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
          <div class="row flex justify-between q-mt-sm">
            <div class="col-12 col-md-2 col-lg-3">
              <Phone ref="phoneRef" @UpdatePhone="onPhoneUpdated" />
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
/**
 * @module AddEstacion
 * @description Componente de diálogo para crear nuevas estaciones de peaje
 * Gestiona datos completos: código, nombre, ubicación (provincia/municipio),
 * dirección, teléfonos, NIT, cuentas bancarias CUC/CUP y parámetros operativos
 */

import { ref, onBeforeMount, watch } from 'vue'
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
const { postData, fetchData } = useApi()

/* Emisor */
const emit = defineEmits(['ActualizarTabla'])

/**
 * Verifica si el código de estación ya existe en la base de datos
 * @async
 * @returns {Promise<boolean>} true si el código existe, false si está disponible
 */
const CheckCode = async () => {
  // Verificar si el código ya existe
  const result = await CheckField(
    STRINGS.urlApiEstacion,
    STRINGS.codigoBD,
    TextCodigo_estacion.value,
    fetchData,
  )

  return result
}

/**
 * Valida que la cuenta bancaria exista y sea del tipo correcto (CUC/CUP)
 * @param {Object} objectAccount - Resultado de searchIdAccount
 * @param {string|null} objectAccount.id - ID de la cuenta si existe
 * @param {boolean} objectAccount.isValidType - true si el tipo coincide
 * @param {string} objectAccount.message - Mensaje descriptivo del resultado
 * @param {Ref} refInput - Referencia reactiva al input para hacer focus en caso de error
 * @returns {boolean} true si la cuenta es válida, false si hay algún error
 */
const CheckAccount = (objectAccount, refInput) => {
  // Caso 1: La cuenta existe pero es de tipo incorrecto (warning)
  if (objectAccount.id !== null && !objectAccount.isValidType) {
    notify_warning(objectAccount.message)
    refInput.value.focus()
    return false
    // Caso 2: La cuenta no existe en el sistema (error)
  } else if (objectAccount.id === null && !objectAccount.isValidType) {
    notify_error(objectAccount.message)
    refInput.value.focus()
    return false
    // Caso 3: La cuenta existe y es del tipo correcto pero hay mensaje adicional
  } else if (
    objectAccount.id !== null &&
    objectAccount.isValidType &&
    objectAccount.message !== ''
  ) {
    refInput.value.focus()
    return false
  }

  return true
}

/**
 * Valida que todos los números telefónicos cumplan con el formato esperado
 * Usa for...of en lugar de forEach para poder salir con break al primer error
 * @param {string[]} phones - Array de números telefónicos a validar
 * @returns {boolean} true si todos los teléfonos son válidos (o están vacíos), false si alguno es inválido
 */
const CheckPhoneNumbers = (phones) => {
  // Si no hay teléfonos, es inválido (debe haber al menos uno)
  if (!phones || phones.length === 0) return false

  // Usamos for...of para poder hacer break y retornar false al primer error
  for (const element of phones) {
    // Si el campo está vacío, lo consideramos inválido (requerido)
    if (!element || element.trim() === '') {
      phoneRef.value?.Focus()
      return false
    }

    // Validar formato de teléfono con la regex
    if (!expRegulares.numberPhone.test(element)) {
      phoneRef.value?.Focus()
      return false
    }
  }

  return true
}

/**
 * Procesa y envía los datos de la nueva estación al backend
 * Flujo de validación:
 * 1. Verifica que el código no esté duplicado
 * 2. Valida que las cuentas CUC y CUP existan y sean del tipo correcto
 * 3. Envía los datos al backend mediante POST
 * 4. Emite evento de actualización y resetea el formulario si es exitoso
 */

const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    if (await CheckCode()) {
      // 1. Verificar código duplicado
      notify_error(STRINGS.codigoRepetido)
      textCodigo_estacion.value.focus()
      return
    } else {
      // 2. Validar cuentas bancarias CUC y CUP
      const idAccountCuc = await searchIdAccount(TextCuenta_CUC.value, STRINGS.CUC, fetchData)
      const idAccountCup = await searchIdAccount(TextCuenta_CUP.value, STRINGS.CUP, fetchData)

      if (
        !CheckAccount(idAccountCuc, textCuenta_CUC) ||
        !CheckAccount(idAccountCup, textCuenta_CUP)
      )
        return // Detener si alguna cuenta es inválida

      // 4. Enviar al backend
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
        const { data, error } = await postData(STRINGS.urlApiEstacion, newItem)

        if (!data && error) return notify_error(`${STRINGS.errorAdd} ${STRINGS.station}`)

        emit('ActualizarTabla', true)
        notify_success(`${STRINGS.station} ${STRINGS.successAdd}`)
        Reset()
      } catch (error) {
        console.error(`Error al crear item ${STRINGS.station}:`, error)
        notify_error(`${STRINGS.errorAdd} ${STRINGS.station}`)
      }
    }
  }
}

/**
 * Abre el diálogo de agregar estación
 * Configura el filtro de fondo y muestra el formulario
 */
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/**
 * Limpia todos los campos del formulario y cierra el diálogo
 * Restablece el estado del botón guardar y bloquea el select de municipios
 */
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

/**
 * Handler del evento UpdatePhone del componente Phone
 * Actualiza el array reactivo de teléfonos cuando el usuario modifica alguno
 * @param {string[]} phonesArray - Array actualizado de números telefónicos
 */
const onPhoneUpdated = (phonesArray) => {
  phoneNumbers.value = phonesArray
}

/**
 * Valida que todos los campos obligatorios no estén vacíos
 * @returns {boolean} true si todos los campos requeridos tienen contenido
 */
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

/**
 * Valida que los campos cumplan con las expresiones regulares correspondientes
 * @returns {boolean} true si todos los campos cumplen las regex definidas
 */
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

/**
 * Verifica el estado completo del formulario y habilita/deshabilita el botón guardar
 * El botón se habilita solo cuando: campos no vacíos + regex válidas
 * @returns {string} cadena vacía si es válido, o STRINGS.desabilitar si no lo es
 */
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/**
 * Carga la lista de provincias desde la API para el selector
 * @async
 */
const loadProvincias = async () => {
  return (optionsProvince.value = await getNomenclator.loadProvincias())
}

/* =================================================== */
/*  ===== VARIABLES REACTIVAS (REFS) ===== */
/* =================================================== */

// Configuración del diálogo
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)

// Campos del formulario (v-model)
const TextNombre_estacion = ref('')
const TextCodigo_estacion = ref('')
const TextDireccion_estacion = ref('')
const TextSelectNombre_prov = ref('')
const TextSelectNombre_mun = ref('')
const TextNit_estacion = ref('')
const disabledSelectMun = ref(true)
const TextCuenta_CUC = ref('')
const TextCuenta_CUP = ref('')

// Teléfono: componente y array de números
const phoneRef = ref(null)
const phoneNumbers = ref([]) // Aquí guardaremos los teléfonos

// Referencias a los inputs para focus programático
const textNombre_estacion = ref(null)
const textCodigo_estacion = ref(null)
const textDireccion_estacion = ref(null)
const textSelectNombre_prov = ref(null)
const textSelectNombre_mun = ref(null)
const textNit_estacion = ref(null)
const textCuenta_CUC = ref(null)
const textCuenta_CUP = ref(null)

// Estado del botón guardar
const disabledBtnSave = ref(STRINGS.desabilitar)

// Opciones de los selectores (provincias y municipios)
const optionsProvince = ref([])
const optionsMunicipio = ref([])

/* =================================================== */
/*  ===== WATCHERS ===== */
/* =================================================== */

/**
 * Watch que reacciona a cambios en la provincia seleccionada
 * Carga los municipios correspondientes y limpia el municipio seleccionado
 * Si la provincia no tiene municipios, deshabilita el select de municipios
 */
watch(TextSelectNombre_prov, async (newVal) => {
  if (newVal.label) {
    const result = await getNomenclator.loadMunicipiosByProvincia(newVal, true)

    if (result === false) {
      disabledSelectMun.value = true
      TextSelectNombre_mun.value = ''
    } else {
      optionsMunicipio.value = result
      disabledSelectMun.value = false
    }
  }
  checkStatusInputs()
})

/**
 * Watch que re-evalúa el estado del botón cuando cambian
 * el municipio seleccionado o los números de teléfono
 */
watch([TextSelectNombre_mun, phoneNumbers], () => {
  checkStatusInputs()
})

/* =================================================== */
/*  ===== CICLO DE VIDA ===== */
/* =================================================== */

/**
 * Hook que se ejecuta antes de montar el componente
 * Carga las provincias disponibles para el selector
 */
onBeforeMount(() => {
  loadProvincias()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogAdd,
})
</script>
