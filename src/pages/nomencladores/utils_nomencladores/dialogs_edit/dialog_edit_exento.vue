<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoEdit" :backdrop-filter="backdropFilter">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.editExento.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_exento"
                ref="textNombre_exento"
                color="green"
                :rules="rulesNombre_exento"
                type="text"
                :label="STRINGS.nombre_exento"
                @keyup="ComprobarEstadoInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_exento"
                v-model="TextCodigo_exento"
                color="green"
                type="text"
                :rules="rulesCodigo_exento"
                :label="STRINGS.codigo_exento"
                @keyup="ComprobarEstadoInputs"
              />
            </div>
          </div>

          <div class="row flex justify-between q-mt-lg">
            <div class="col-12">
              <q-select
                v-model="TextNomenclador_exento"
                ref="textNomenclador_exento"
                :options="options"
                :rules="rulesNomenclador_exento"
                color="green"
                :label="STRINGS.nomenclador_exento"
                @onchange="ComprobarEstadoInputs"
                outlined
              >
                <!-- Slot para agregar un botón al final del select -->
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>

            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.detalles_exento }}:</p>
              <div class="bg-grey-4 q-pb-lg">
                <q-input
                  ref="textDetalles_exento"
                  v-model="TextDetalles_exento"
                  :rules="rulesDetalles_exento"
                  class="q-pa-md"
                  color="green"
                  autogrow
                  @keyup="ComprobarEstadoInputs"
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
                :class="disabledBtnSaveEdit"
                @click="Procesar_Edit()"
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
import { STRINGS } from '../../../../utils/string.js'
import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteExento.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = 'blur(4px) saturate(150%)'

const refDialogoEdit = ref(null)

/*Validaciones*/
const rulesNombre_exento = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.FullTextAndNumber.test(val) || STRINGS.FullTextAndNumber,
]

const rulesCodigo_exento = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]

const rulesNomenclador_exento = [(val) => val != '' || STRINGS.inputEmpty]

const rulesDetalles_exento = [(val) => val != '' || STRINGS.inputEmpty]
/*Validaciones*/

const emit = defineEmits(['ActualizarTablaExento'])

/*Funcion de procesado de Datos*/
const Procesar_Edit = async () => {
  if (ComprobarEstadoInputs() != STRINGS.desabilitar) {
    //TODO: Ajax Request EDIT_MUNICIPIO

    var existeCodigo = false

    // Verificar si el código ya existe
    if (TextCodigo_exento.value !== TextCodigo_exento_copy.value)
      existeCodigo = await verificarCodigoExistente(TextCodigo_exento.value)

    if (existeCodigo ? true : false) {
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

      console.log(newItem.val)

      try {
        await api.patch(STRINGS.urlApiExento + '/' + IdExento.value, newItem) // POST /items
        notify_success(STRINGS.exentoEditSuccess)

        emit('ActualizarTablaExento', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.exentoEditError)
        emit('ActualizarTablaExento', false)
      }
      refDialogoEdit.value.hide()
      Reset()
    }
  }
}

/*Función que levanta el dialogo*/
const LevantarDialogoEdit = (nombre, codigo, nomenclador, detalles, id) => {
  backdropFilter.value = list
  dialog.value = true

  TextCodigo_exento.value = codigo
  TextNombre_exento.value = nombre
  TextNomenclador_exento.value = nomenclador
  TextDetalles_exento.value = detalles
  IdExento.value = id

  TextCodigo_exento_copy.value = codigo
  TextNombre_exento_copy.value = nombre
  TextNomenclador_exento_copy.value = nomenclador
  TextDetalles_exento_copy.value = detalles
}

const equalFields = () => {
  let camposIguales =
    TextCodigo_exento.value.trim() === TextCodigo_exento_copy.value.trim() &&
    TextNombre_exento.value.trim() === TextNombre_exento_copy.value.trim() &&
    String(TextNomenclador_exento.value).trim() ===
      String(TextNomenclador_exento_copy.value).trim() &&
    TextDetalles_exento.value.trim() === TextDetalles_exento_copy.value.trim()

  return camposIguales
}

const isFormValidInput = () => {
  return (
    // Verifica si al menos un campo ha cambiado
    (TextCodigo_exento.value.trim() !== '' ||
      TextNombre_exento.value.trim() !== '' ||
      String(TextNomenclador_exento.value).trim() !== '' ||
      TextDetalles_exento.value.trim() !== '' ||
      // O si hay cambios en los campos respecto a las copias
      TextCodigo_exento.value !== TextCodigo_exento_copy.value ||
      TextNombre_exento.value !== TextNombre_exento_copy.value ||
      String(TextNomenclador_exento.value) !== String(TextNomenclador_exento_copy.value) ||
      TextDetalles_exento.value !== TextDetalles_exento_copy.value) &&
    // Y además, que los campos no sean iguales a sus copias (para deshabilitar si no hay cambios)
    !equalFields() &&
    // Además, verifica las reglas de validación
    (expRegulares.FullTextAndNumber.test(TextNombre_exento.value) || false) &&
    (expRegulares.onlyUppercase.test(TextCodigo_exento.value) || false)
  )
}

const ComprobarEstadoInputs = () => {
  disabledBtnSaveEdit.value = isFormValidInput() ? '' : STRINGS.desabilitar
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  refDialogoEdit.value.hide()
  TextCodigo_exento.value = ''
  TextNombre_exento.value = ''
  TextNomenclador_exento.value = ''
  TextDetalles_exento.value = ''
  disabledBtnSaveEdit.value = ref(STRINGS.desabilitar)
}

const dialog = ref(false)
const backdropFilter = ref(null)

//V-model
const TextCodigo_exento = ref('')
const TextNombre_exento = ref('')
const TextNomenclador_exento = ref(null)
const TextDetalles_exento = ref('')

//V-copias
const TextCodigo_exento_copy = ref('')
const TextNombre_exento_copy = ref('')
const TextNomenclador_exento_copy = ref(null)
const TextDetalles_exento_copy = ref('')

//ref
const textNombre_exento = ref(null)
const textCodigo_exento = ref(null)
const textDetalles_exento = ref(null)

const textNomenclador_exento = ref(null)
const options = [1, 2, 3, 4]

const IdExento = ref('')

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  LevantarDialogoEdit,
})
</script>
