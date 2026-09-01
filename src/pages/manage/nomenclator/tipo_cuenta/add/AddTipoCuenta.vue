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
            >{{ STRINGS.add.toUpperCase() }} {{ STRINGS.tipoCuentaLowercase.toUpperCase() }}</span
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
const { postData, fetchData } = useApi()

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
 * Procesa y envía los datos del formulario al backend para crear un nuevo tipo de cuenta
 * Valida duplicados antes de enviar y notifica al usuario del resultado
 * Emite evento 'ActualizarTabla' para refrescar la lista tras operación exitosa
 */
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe antes de crear
    if (await CheckCode()) {
      notify_error(STRINGS.codigoRepetido)
      textCodigo_tipoCuenta.value.focus()
      return
    }

    const newItem = {
      nombre: TextNombre_tipoCuenta.value,
      codigo: TextCodigo_tipoCuenta.value,
    }

    try {
      const { data, error } = await postData(STRINGS.urlApiTipoCuenta, newItem)

      if (!data && error) return notify_error(`${STRINGS.errorAdd} ${STRINGS.type_of_account}`)

      notify_success(`${STRINGS.type_of_account} ${STRINGS.successAdd}`)
      emit('ActualizarTabla', true)
      Reset()
    } catch (error) {
      console.error(`Error al crear item ${STRINGS.type_of_account}:`, error)
      notify_error(`${STRINGS.errorAdd} ${STRINGS.type_of_account}`)
    }
  }
}

/**
 * Abre el diálogo de agregar tipo de cuenta
 * Configura el filtro de fondo y muestra el formulario
 */
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/**
 * Limpia todos los campos del formulario y cierra el diálogo
 * Restablece el estado del botón guardar a deshabilitado
 */
const Reset = () => {
  dialog.value = false
  TextNombre_tipoCuenta.value = ''
  TextCodigo_tipoCuenta.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/**
 * Valida que todos los campos obligatorios no estén vacíos
 * @returns {boolean} true si ambos campos tienen contenido, false si alguno está vacío
 */
const InputEmpty = () => {
  return TextNombre_tipoCuenta.value.trim() !== '' && TextCodigo_tipoCuenta.value.trim() !== ''
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
 * El botón se habilita solo cuando: campos no vacíos + regex válidas
 * @returns {string} cadena vacía si es válido, o STRINGS.desabilitar si no lo es
 */
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/* =================================================== */
/*  ===== VARIABLES REACTIVAS (REFS) ===== */
/* =================================================== */

// Configuración del diálogo
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog
const refDialogoAdd = ref(null)

// Campos del formulario (v-model)
const TextNombre_tipoCuenta = ref('')
const TextCodigo_tipoCuenta = ref('')

// Referencias a los inputs para focus programático
const textNombre_tipoCuenta = ref(null)
const textCodigo_tipoCuenta = ref(null)

// Estado del botón guardar
const disabledBtnSave = ref(STRINGS.desabilitar)

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogAdd,
})
</script>
