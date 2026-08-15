<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoEdit" :backdrop-filter="backdropFilter">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.edit.toUpperCase() }} - {{ STRINGS.exempt.toUpperCase() }}</span
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
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
import { useApi } from 'src/composables/useApi'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useNotify } from 'src/utils/notify/notify.js'
import validaciones_generales from 'src/utils/validaciones_generales'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
const { patchData } = useApi()

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
 * Valida los datos antes de enviarlos al backend
 * Verifica si hay cambios y si el código modificado no está duplicado
 * Si el código cambió, valida que no exista en BD antes de enviar
 */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Solo verificar código duplicado si el código cambió
    if (InputDifferent() && TextCodigo_exento.value !== TextCodigo_exento_copy.value) {
      if (await CheckCode()) {
        notify_error(STRINGS.codigoRepetido)
        return textCodigo_exento.value.focus()
      } else {
        SendData()
      }
    } else {
      SendData()
    }
  }
}

/**
 * Envía los datos actualizados del exento al backend mediante PATCH
 * Emite evento 'ActualizarTabla' para refrescar la lista
 * Cierra el diálogo y resetea el formulario si la operación es exitosa
 */
const SendData = async () => {
  const newItem = {
    nombre: TextNombre_exento.value,
    codigo: TextCodigo_exento.value.toUpperCase(),
    nomenclador: Number(TextNomenclador_exento.value),
    detalles: TextDetalles_exento.value,
  }

  try {
    const { data, error } = await patchData(STRINGS.urlApiExento + '/' + Text_Id.value, newItem)

    if (data != null && !error) {
      emit('ActualizarTabla', true)
      notify_success(STRINGS.successEdit)
      dialog.value = false
      Reset()
    } else notify_error(STRINGS.errorEdit)
  } catch (error) {
    console.error(STRINGS.errorEdit, error)
    notify_error(STRINGS.errorAdd)
    emit('ActualizarTabla', false)
  }
}

/**
 * Abre el diálogo de edición y carga los datos del exento seleccionado
 * Guarda copias de los valores originales para detectar cambios
 * @param {string} nombre - Nombre del exento
 * @param {string} codigo - Código del exento
 * @param {number} nomenclador - ID del nomenclador asociado
 * @param {string} detalles - Detalles adicionales del exento
 * @param {string} id - ID único del exento en la base de datos
 */
const getUpDialogEdit = (nombre, codigo, nomenclador, detalles, id) => {
  backdropFilter.value = list
  dialog.value = true

  TextCodigo_exento.value = codigo
  TextNombre_exento.value = nombre
  TextNomenclador_exento.value = nomenclador
  TextDetalles_exento.value = detalles
  Text_Id.value = id

  // Guardar copias para comparar cambios
  TextCodigo_exento_copy.value = codigo
  TextNombre_exento_copy.value = nombre
  TextNomenclador_exento_copy.value = nomenclador
  TextDetalles_exento_copy.value = detalles
}

/**
 * Valida que todos los campos obligatorios no estén vacíos
 * @returns {boolean} true si todos los campos tienen contenido
 */
const InputEmpty = () => {
  if (
    TextCodigo_exento.value !== '' &&
    TextNombre_exento.value !== '' &&
    String(TextNomenclador_exento.value).trim() !== '' &&
    TextDetalles_exento.value.trim() !== ''
  )
    return true
  else return false
}

/**
 * Compara los valores actuales con las copias originales para detectar cambios
 * @returns {boolean} true si al menos un campo fue modificado
 */
const InputDifferent = () => {
  return !(
    TextCodigo_exento.value === TextCodigo_exento_copy.value &&
    TextNombre_exento.value === TextNombre_exento_copy.value &&
    String(TextNomenclador_exento.value).trim() ===
      String(TextNomenclador_exento_copy.value).trim() &&
    TextDetalles_exento.value.trim() === TextDetalles_exento_copy.value.trim()
  )
}

/**
 * Valida que los campos cumplan con las expresiones regulares
 * Código: solo mayúsculas | Nombre: texto y números
 * @returns {boolean} true si código y nombre cumplen las regex
 */
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyUppercase.test(TextCodigo_exento.value) &&
    expRegulares.TextAndNumber.test(TextNombre_exento.value)
  )
    return true
  else return false
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
  refDialogoEdit.value.hide()
  TextCodigo_exento.value = ''
  TextNombre_exento.value = ''
  TextNomenclador_exento.value = ''
  TextDetalles_exento.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/* Dialog */
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog
const refDialogoEdit = ref(null)

// V-model
const TextCodigo_exento = ref('')
const TextNombre_exento = ref('')
const TextNomenclador_exento = ref(null)
const TextDetalles_exento = ref('')
const Text_Id = ref('') // TODO: Considerar renombrar a IdExento para mayor claridad

// Copias de valores originales para detectar cambios
const TextCodigo_exento_copy = ref('')
const TextNombre_exento_copy = ref('')
const TextNomenclador_exento_copy = ref(null)
const TextDetalles_exento_copy = ref('')

// refs para acceso directo a los inputs
const textNombre_exento = ref(null)
const textCodigo_exento = ref(null)
const textDetalles_exento = ref(null)
const textNomenclador_exento = ref(null)

const options = [1, 2, 3, 4]
const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogEdit,
})
</script>
