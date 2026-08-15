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
            >{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.exempt.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_exento"
                ref="textNombre_exento"
                color="green"
                :rules="validaciones_generales.rulesFullTextAndNumber"
                type="text"
                :label="STRINGS.name"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_exento"
                v-model="TextCodigo_exento"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyUppercase"
                :label="STRINGS.code"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <div class="row flex justify-between q-mt-lg">
            <div class="col-12">
              <q-select
                v-model="TextNomenclador_exento"
                ref="textNomenclador_exento"
                :options="options"
                :rules="validaciones_generales.rulesNoEmpty"
                color="green"
                :label="STRINGS.nomenclator"
                @onchange="checkStatusInputs"
                outlined
              >
                <!-- Slot para agregar un botón al final del select -->
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>

            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.details }}:</p>
              <div class="bg-grey-4 q-pb-lg">
                <q-input
                  ref="textDetalles_exento"
                  v-model="TextDetalles_exento"
                  :rules="validaciones_generales.rulesNoEmpty"
                  class="q-pa-md"
                  color="green"
                  autogrow
                  @keyup="checkStatusInputs"
                />
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
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'src/composables/useApi'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useNotify } from 'src/utils/notify/notify.js'
import validaciones_generales from 'src/utils/validaciones_generales.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
const { postData } = useApi()

const emit = defineEmits(['ActualizarTabla'])

/**
 * Verifica si el código del exento ya existe en la base de datos
 * @returns {Promise<boolean>} true si el código existe, false si está disponible
 */
const CheckCode = async () => {
  const url = STRINGS.urlApiExento
  const result = await verificarExistente(url, STRINGS.codigoBD, TextCodigo_exento.value)
  return result
}

/**
 * Valida y envía los datos del formulario al backend para crear un nuevo exento
 * Realiza verificación de código duplicado antes de enviar
 * Emite evento 'ActualizarTabla' para refrescar la lista de exentos
 */
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (await CheckCode()) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      textCodigo_exento.value.focus()
      return
    } else {
      const newItem = {
        nombre: TextNombre_exento.value,
        codigo: TextCodigo_exento.value.toUpperCase(),
        nomenclador: Number(TextNomenclador_exento.value),
        detalles: TextDetalles_exento.value,
      }

      try {
        const { /*data,*/ error } = await postData(STRINGS.urlApiExento, newItem) // POST /items

        // Mostrar posible alerta de error
        if (error) return notify_error(STRINGS.errorAdd)

        // Mostrar alerta positiva de éxito
        emit('ActualizarTabla', true)
        notify_success(STRINGS.successAdd)
        dialog.value = false
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.errorAdd)
      }
    }
  }
}

/**
 * Abre el diálogo de agregar exento y configura el filtro de fondo
 */
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/**
 * Limpia todos los campos del formulario y restablece el estado del botón guardar
 * Se ejecuta después de un submit exitoso o al cerrar el diálogo
 */
const Reset = () => {
  TextNombre_exento.value = ''
  TextCodigo_exento.value = ''
  TextNomenclador_exento.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/**
 * Valida que todos los campos obligatorios del formulario no estén vacíos
 * @returns {boolean} true si todos los campos tienen contenido, false si alguno está vacío
 */
const InputEmpty = () => {
  if (
    TextCodigo_exento.value.trim() !== '' &&
    TextNombre_exento.value.trim() !== '' &&
    TextDetalles_exento.value.trim() !== '' &&
    TextNomenclador_exento.value !== null
  )
    return true
  else return false
}

/**
 * Valida que los campos cumplan con las expresiones regulares definidas
 * - Código: solo letras mayúsculas
 * - Nombre: texto y números permitidos
 * @returns {boolean} true si todos los campos cumplen las regex, false en caso contrario
 */
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyUppercase.test(TextCodigo_exento.value.trim()) &&
    expRegulares.TextAndNumber.test(TextNombre_exento.value.trim())
  )
    return true
  else return false
}

/**
 * Verifica el estado completo de los inputs y habilita/deshabilita el botón guardar
 * El botón se habilita solo cuando todos los campos son válidos
 * @returns {string} cadena vacía si es válido, o STRINGS.desabilitar si no lo es
 */
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/* Dialog */
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog
const refDialogoAdd = ref(null)

//V-model
const TextCodigo_exento = ref('')
const TextNombre_exento = ref('')
const TextNomenclador_exento = ref(null)
const TextDetalles_exento = ref('')

//ref
const textNombre_exento = ref(null)
const textCodigo_exento = ref(null)
const textDetalles_exento = ref(null)

const textNomenclador_exento = ref(null)
const options = [1, 2, 3, 4]
const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogAdd,
})
</script>
