<template>
  <div class="">
    <q-dialog
      v-model="dialogEditProvincia"
      persistent
      ref="refDialogoEditProvincia"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.editProvincia.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_prov"
                ref="textNombre_prov"
                color="green"
                :rules="rulesAddNombreProvincia"
                type="text"
                :label="STRINGS.nombre_prov"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_prov"
                v-model="TextCodigo_prov"
                color="green"
                type="text"
                :rules="rulesAddCodigoProvincia"
                :label="STRINGS.codigo_prov"
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
                :class="disabledBtnSaveEdit"
                @click="Procesar_EditProvincia()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                @click="DevolverEstadoInputsEdit"
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
import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteProvincia.js'
import notify_success from '../../../../utils/notify/notify_success.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = 'blur(4px) saturate(150%)'

const refDialogoEditProvincia = ref(null)

/*Validaciones*/
const rulesAddNombreProvincia = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCodigoProvincia = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]
/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const Procesar_EditProvincia = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    var existeCodigo = false

    // Verificar si el código ya existe
    if (TextCodigo_prov.value !== TextCodigo_prov_copy.value)
      existeCodigo = await verificarCodigoExistente(TextCodigo_prov.value)
    if (existeCodigo ? true : false) {
      // Mostrar mensaje de error o alertar al usuario

      notify_error(STRINGS.codigoRepetido)

      textCodigo_prov.value.focus()

      return
    } else {
      const newItem = { nombre: TextNombre_prov.value, codigo: Number(TextCodigo_prov.value) }

      try {
        await api.patch(STRINGS.urlApiProvincia + '/' + _id.value, newItem) // POST /items
        notify_success(STRINGS.provinciaEditSuccess)
        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.provinciaAddError)
        emit('ActualizarTabla', false)
      }
      refDialogoEditProvincia.value.hide()
      Reset()
    }
  } else {
    refDialogoEditProvincia.value.show()
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (name, codigo, id) => {
  backdropFilter.value = list
  dialogEditProvincia.value = true
  TextCodigo_prov.value = String(codigo)
  TextNombre_prov.value = name
  _id.value = id

  //Copias de Seguridad
  TextCodigo_prov_copy.value = String(codigo)
  TextNombre_prov__copy.value = name
}

const checkStatusInputs = () => {
  // Si ambos campos son iguales a sus valores originales, deshabilitar
  const noHaCambiado =
    TextCodigo_prov.value === TextCodigo_prov_copy.value &&
    TextNombre_prov.value === TextNombre_prov__copy.value

  if (TextCodigo_prov.value.trim() === '' || TextNombre_prov.value.trim() === '') {
    // Si algún campo está vacío, deshabilitar
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (noHaCambiado) {
    // Si no ha cambiado nada, deshabilitar
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (
    !expRegulares.onlyText.test(TextNombre_prov.value) ||
    !expRegulares.onlyNumber.test(TextCodigo_prov.value)
  ) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else {
    // Si hay cambios, habilitar
    disabledBtnSaveEdit.value = ''
  }

  return disabledBtnSaveEdit.value
}

const DevolverEstadoInputsEdit = () => {
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  TextCodigo_prov.value = ''
  TextNombre_prov.value = ''
}

const dialogEditProvincia = ref(false)

const TextCodigo_prov = ref('')
const TextNombre_prov = ref('')

const TextCodigo_prov_copy = ref('')
const TextNombre_prov__copy = ref('')

const _id = ref('')

const backdropFilter = ref(null)

const textNombre_prov = ref(null)
const textCodigo_prov = ref(null)

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogEdit,
})
</script>
