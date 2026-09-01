<template>
  <div class="">
    <q-dialog
      v-model="dialogEdit"
      persistent
      ref="refDialogoEdit"
      :backdrop-filter="backdropFilter"
      content-class="dialog-xl"
      :style="{ '--q-dialog-max-width': '800px' }"
    >
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.edit.toUpperCase() }} - {{ STRINGS.type_of_account.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_tipoCuenta"
                ref="textNombre_tipoCuenta"
                color="green"
                :rules="validaciones_generales.rulesOnlyText"
                type="text"
                :label="STRINGS.nombre_tipoCuenta"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                v-model="TextCodigo_tipoCuenta"
                ref="textCodigo_tipoCuenta"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyUppercase"
                :label="STRINGS.codigo_tipoCuenta"
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
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'src/composables/useApi'
import CheckField from 'utils/utils_axios/nomencladores/CheckField'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useNotify } from 'src/utils/notify/notify.js'
import validaciones_generales from 'src/utils/validaciones_generales'

/* =================================================== */
/*  ===== DECLARACIONES Y COMPOSABLES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
const { patchData, fetchData } = useApi()

const emit = defineEmits(['ActualizarTabla'])

/**
 * Verifica si el código del tipo de cuenta ya existe en la base de datos
 * @async
 * @returns {Promise<boolean>} true si el código existe, false si está disponible
 */
const CheckCode = async () => {
  const url = STRINGS.urlApiTipoCuenta
  const result = await CheckField(
    url,
    STRINGS.codigoBD,
    String(TextCodigo_tipoCuenta.value),
    fetchData,
  )
  return result
}

/**
 * Valida los datos antes de enviarlos al backend
 * Verifica si el código cambió y si es así, valida que no exista duplicado
 * Si el código no cambió, envía directamente sin validación
 */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Solo verificar código duplicado si el código cambió
    if (InputDifferent() && TextCodigo_tipoCuenta.value !== TextCodigo_tipoCuenta_copy.value) {
      if (await CheckCode()) {
        notify_error(STRINGS.codigoRepetido)
        return textCodigo_tipoCuenta.value.focus()
      } else SendData()
    } else {
      SendData()
    }
  }
}

/**
 * Envía los datos actualizados del tipo de cuenta al backend mediante PATCH
 * Emite evento 'ActualizarTabla' para refrescar la lista
 * Cierra el diálogo y resetea el formulario si la operación es exitosa
 */
const SendData = async () => {
  const newItem = {
    nombre: TextNombre_tipoCuenta.value,
    codigo: TextCodigo_tipoCuenta.value,
  }

  try {
    const { data, error } = await patchData(STRINGS.urlApiTipoCuenta + '/' + _id.value, newItem)

    if (!data && error) return notify_error(`${STRINGS.errorEdit} ${STRINGS.type_of_account}`)

    emit('ActualizarTabla', true)
    notify_success(`${STRINGS.type_of_account} ${STRINGS.successEdit}`)
    Reset()
  } catch (error) {
    console.error(`Error al actualizar item ${STRINGS.type_of_account}:`, error)
    notify_error(`${STRINGS.errorEdit} ${STRINGS.type_of_account}`)
  }
}

/**
 * Abre el diálogo de edición y carga los datos del tipo de cuenta seleccionado
 * Guarda copias de los valores originales para detectar cambios
 * @param {Object} row - Objeto con los datos del tipo de cuenta
 * @param {string} row.nombre - Nombre del tipo de cuenta
 * @param {string} row.codigo - Código del tipo de cuenta
 * @param {string} row._id - ID único del tipo de cuenta en la base de datos
 */
const getUpDialogEdit = (row) => {
  backdropFilter.value = list
  dialogEdit.value = true

  TextNombre_tipoCuenta.value = row.nombre
  TextCodigo_tipoCuenta.value = row.codigo
  _id.value = row._id

  // Guardar copias de seguridad para comparar cambios
  TextNombre_tipoCuenta_copy.value = row.nombre
  TextCodigo_tipoCuenta_copy.value = row.codigo
}

/**
 * Valida que todos los campos obligatorios no estén vacíos
 * @returns {boolean} true si ambos campos tienen contenido, false si alguno está vacío
 */
const InputEmpty = () => {
  return TextNombre_tipoCuenta.value.trim() !== '' && TextCodigo_tipoCuenta.value !== ''
}

/**
 * Compara los valores actuales con las copias originales para detectar cambios
 * @returns {boolean} true si al menos un campo fue modificado, false si son iguales
 */
const InputDifferent = () => {
  return !(
    TextNombre_tipoCuenta.value === TextNombre_tipoCuenta_copy.value &&
    TextCodigo_tipoCuenta.value === TextCodigo_tipoCuenta_copy.value
  )
}

/**
 * Valida que los campos cumplan con las expresiones regulares
 * Código: solo mayúsculas | Nombre: solo texto
 * @returns {boolean} true si ambos campos cumplen las regex, false en caso contrario
 */
const InputRegularExpressions = () => {
  return (
    expRegulares.onlyUppercase.test(TextCodigo_tipoCuenta.value) &&
    expRegulares.onlyText.test(TextNombre_tipoCuenta.value)
  )
}

/**
 * Verifica el estado completo del formulario y habilita/deshabilita el botón guardar
 * El botón se habilita solo cuando: campos no vacíos + regex válidas + hay cambios
 * @returns {string} cadena vacía si es válido, o STRINGS.desabilitar si no lo es
 */
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions() && InputDifferent()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/**
 * Limpia todos los campos del formulario y restablece el estado del botón
 * Cierra el diálogo después de un submit exitoso
 */
const Reset = () => {
  dialogEdit.value = false
  TextNombre_tipoCuenta.value = ''
  TextCodigo_tipoCuenta.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/* =================================================== */
/*  ===== VARIABLES REACTIVAS (REFS) ===== */
/* =================================================== */

// Configuración del diálogo
const dialogEdit = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog
const refDialogoEdit = ref(null)

// Campos del formulario (v-model)
const TextNombre_tipoCuenta = ref('')
const TextCodigo_tipoCuenta = ref('')
const _id = ref('')

// Referencias a los inputs para focus programático
const textNombre_tipoCuenta = ref(null)
const textCodigo_tipoCuenta = ref(null)

// Copias de seguridad de los valores originales (para detectar cambios)
const TextNombre_tipoCuenta_copy = ref('')
const TextCodigo_tipoCuenta_copy = ref('')

// Estado del botón guardar
const disabledBtnSave = ref(STRINGS.desabilitar)

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
