<template>
  <div class="">
    <q-dialog
      v-model="dialogEditMunicipio"
      persistent
      ref="refDialogoEditOrganismo"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.editOrganismo.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-4">
              <q-input
                v-model="TextNombreAbrOrg"
                ref="textNombre_AbrOrg"
                color="green"
                :rules="rulesAddNombreAbrOrganismo"
                type="text"
                :label="STRINGS.nombre_abreviado"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-7">
              <q-input
                ref="textNombreOrg"
                v-model="TextNombreOrg"
                color="green"
                type="text"
                :rules="rulesAddNombreOrganismo"
                :label="STRINGS.nombre_org"
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
                @click="Procesar_EditOrganismo()"
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
import verificarSiglaExistente from 'src/utils/utils_axios/nomencladores/verificarSiglaExistenteOrganismo.js'
import notify_success from 'src/utils/notify/notify_success.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_error from 'src/utils/notify/notify_error.js'
/**
 * Values for backdrop-filter are the same as in the CSS specs.
 * The following list is not an exhaustive one.
 */
const list = 'blur(4px) saturate(150%)'

const refDialogoEditOrganismo = ref(null)

/*Validaciones*/
const rulesAddNombreOrganismo = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyLetters,
]

const rulesAddNombreAbrOrganismo = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]

/*Validaciones*/

//Función para realizar el Capitalize del nombre del organismo
function capitalizeWords(str) {
  return str
    .split(' ')
    .map((word) => {
      if (word.length === 0) return word // Por si hay cadenas vacías
      return word[0].toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const Procesar_EditOrganismo = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    var existeSigla = false

    // Verificar si el código ya existe
    existeSigla = await verificarSiglaExistente(TextNombreAbrOrg.value)
    if (existeSigla ? true : false) {
      // Mostrar mensaje de error o alertar al usuario

      notify_error(STRINGS.siglasRepetidas)

      textNombre_AbrOrg.value.focus()
      return
    } else {
      const newItem = {
        nombre: capitalizeWords(TextNombreOrg.value),
        siglas: TextNombreAbrOrg.value,
      }

      try {
        await api.patch(STRINGS.urlApiOrganismo + '/' + IdMunicipioEdit.value, newItem) // POST /items
        notify_success(STRINGS.organismoEditSuccess)
        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al editar el item:', error)
        notify_error(STRINGS.organismoEditError)
        emit('ActualizarTabla', false)
      }
      refDialogoEditOrganismo.value.hide()
      Reset()
    }
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (nameAbrOrg, nombreOrg, id) => {
  backdropFilter.value = list
  dialogEditMunicipio.value = true
  TextNombreAbrOrg.value = nameAbrOrg
  TextNombreOrg.value = nombreOrg
  IdMunicipioEdit.value = id

  TextNombreOrg_copy.value = nombreOrg
  TextNombreAbrOrg_copy.value = nameAbrOrg
}

const checkStatusInputs = () => {
  const noHaCambiado =
    TextNombreAbrOrg.value === TextNombreAbrOrg_copy.value &&
    TextNombreOrg.value === TextNombreOrg_copy.value

  if (TextNombreAbrOrg.value.trim() == '' || TextNombreOrg.value.trim() == '') {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (noHaCambiado) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (
    !expRegulares.onlyUppercase.test(TextNombreAbrOrg.value) ||
    !expRegulares.onlyText.test(TextNombreOrg.value)
  ) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else {
    disabledBtnSaveEdit.value = ''
  }
  return disabledBtnSaveEdit.value
}

const DevolverEstadoInputsEdit = () => {
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  TextNombreOrg.value = ''
  TextNombreAbrOrg.value = ''
}

const dialogEditMunicipio = ref(false)

//Campos Originales
const TextNombreOrg = ref('')
const TextNombreAbrOrg = ref('')
const IdMunicipioEdit = ref('')

//Campos Copias
const TextNombreOrg_copy = ref('')
const TextNombreAbrOrg_copy = ref('')

const backdropFilter = ref(null)

const textNombre_AbrOrg = ref(null)
const textNombreOrg = ref(null)

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogEdit,
})
</script>
