<template>
  <div class="">
    <q-dialog
      v-model="dialogEditMunicipio"
      persistent
      ref="refDialogoEditOrganismo"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ STRINGS.editMunicipio }}
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
                @keyup="ComprobarEstadoInputsEdit"
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
                @keyup="ComprobarEstadoInputsEdit"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-start">
            <div class="col-5">
              <q-btn
                icon="check"
                :class="disabledBtnSaveEdit"
                @click="Procesar_EditOrganismo()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="col-5">
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

  <table_Gest_provincia ref="Ref_table_Gest_provincia" style="display: none" />
</template>

<!-- <q-alert color="positive" ref="Myalert" icon="check_circle" dense rounded class="q-mb-md">
¡Operación exitosa!
</q-alert> -->

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'
import table_Gest_provincia from '../tables/table_Gest_provincia.vue'
import api from 'src/axios.js'
import verificarSiglaExistente from 'src/utils/utils_axios/verificarSiglaExistenteOrganismo.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { Notify } from 'quasar'
/**
 * Values for backdrop-filter are the same as in the CSS specs.
 * The following list is not an exhaustive one.
 */
const list = 'blur(4px) saturate(150%)'

const refDialogoEditOrganismo = ref(null)

/*Validaciones*/
const rulesAddNombreOrganismo = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.FullText.test(val) || STRINGS.onlyLetters,
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

const emit = defineEmits(['ActualizarTablaOrganismo'])

/*Funcion de procesado de Datos*/
const Procesar_EditOrganismo = async () => {
  if (ComprobarEstadoInputsEdit() != STRINGS.desabilitar) {
    //TODO: Ajax Request EDIT_ORGANISMO

    var existeSigla = false

    // Verificar si el código ya existe
    existeSigla = await verificarSiglaExistente(TextNombreAbrOrg.value)
    if (existeSigla ? true : false) {
      // Mostrar mensaje de error o alertar al usuario
      Notify.create({
        color: 'negative', // color rojo para error
        icon: 'error',
        message: STRINGS.siglasRepetidas,
        position: 'bottom',
        timeout: 3000, // en milisegundos
      })

      textNombre_AbrOrg.value.focus()
      return
    } else {
      const newItem = {
        nombre: capitalizeWords(TextNombreOrg.value),
        siglas: TextNombreAbrOrg.value,
      }

      try {
        await api.patch(STRINGS.urlApiOrganismo + '/' + IdMunicipioEdit.value, newItem) // POST /items

        Notify.create({
          color: 'positive', // color verde para éxito
          icon: 'check_circle',
          message: STRINGS.organismoEditSuccess,
          position: 'top',
          timeout: 3000,
        })

        emit('ActualizarTablaOrganismo', true)
      } catch (error) {
        console.error('Error al editar el item:', error)
        Notify.create({
          color: 'negative',
          icon: 'error',
          message: STRINGS.OrganismoEditError,
          position: 'bottom',
          timeout: 3000,
        })
        emit('ActualizarTablaOrganismo', false)
      }
      refDialogoEditOrganismo.value.hide()
      Reset()
    }
  }
}

/*Función que levanta el dialogo*/
const LevantarDialogoEditOrganismo = (nameAbrOrg, nombreOrg, id) => {
  backdropFilter.value = list
  dialogEditMunicipio.value = true
  TextNombreAbrOrg.value = nameAbrOrg
  TextNombreOrg.value = nombreOrg
  IdMunicipioEdit.value = id

  TextNombreOrg_copy.value = nombreOrg
  TextNombreAbrOrg_copy.value = nameAbrOrg
}

const ComprobarEstadoInputsEdit = () => {
  const noHaCambiado =
    TextNombreAbrOrg.value === TextNombreAbrOrg_copy.value &&
    TextNombreOrg.value === TextNombreOrg_copy.value

  if (TextNombreAbrOrg.value.trim() == '' || TextNombreOrg.value.trim() == '') {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (noHaCambiado) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (
    !expRegulares.onlyUppercase.test(TextNombreAbrOrg.value) ||
    !expRegulares.FullText.test(TextNombreOrg.value)
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
const Ref_table_Gest_provincia = ref(null)

const textNombre_AbrOrg = ref(null)
const textNombreOrg = ref(null)

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  LevantarDialogoEditOrganismo,
})
</script>
