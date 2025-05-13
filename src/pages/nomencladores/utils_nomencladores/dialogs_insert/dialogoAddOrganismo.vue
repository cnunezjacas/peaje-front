<template>
  <div class="">
    <q-dialog
      v-model="dialogOrganismo"
      persistent
      ref="refDialogoAddOrganismo"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ STRINGS.addOrganismo }}
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-4">
              <q-input
                v-model="TextNombreAbrOrg"
                ref="textNombre_prov"
                color="green"
                :rules="rulesAddNombreAbrOrganismo"
                type="text"
                :label="STRINGS.nombre_abreviado"
                @keyup="ComprobarEstadoInputsEdit"
              />
            </div>
            <div class="col-7">
              <q-input
                ref="textCodigo_prov"
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
                @click="Procesar_AddOrganismo"
                :label="STRINGS.save"
                color="green"
                :class="disabledBtnSave"
              />
            </div>

            <div class="col-5">
              <q-btn
                icon="close"
                flat
                :label="STRINGS.close"
                @click="Reset"
                class="btn btn-white"
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
/*import { useQuasar } from 'quasar'
var $q = useQuasar()*/

/**
 * Values for backdrop-filter are the same as in the CSS specs.
 * The following list is not an exhaustive one.
 */
const list = 'blur(4px) saturate(150%)'

const refDialogoAddOrganismo = ref(null)

/*Validaciones*/
const rulesAddNombreOrganismo = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[a-zA-ZÁÉÍÓÚÑÜáéíóúñü\s]+$/.test(val) || 'El campo solo puede contener letras',
]

const rulesAddNombreAbrOrganismo = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[A-ZÁÉÍÓÚÜÑ\s]+$/.test(val) || 'El campo solo puede contener letras Mayúsculas',
]

const regexNombreOrganismo = /^[a-zA-ZÁÉÍÓÚÑÜáéíóúñü\s]+$/
const regexNombreAbrOrganismo = /^[A-ZÁÉÍÓÚÑÜ\s]+$/

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
const Procesar_AddOrganismo = async () => {
  if (ComprobarEstadoInputsEdit() != STRINGS.desabilitar) {
    //TODO: Ajax Request ADD_ORGANISMO
    // Verificar si el código ya existe
    const existeCodigo = await verificarSiglaExistente(TextNombreAbrOrg.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario
      alert('Existe un organismo con esas siglas en la base de datos. Por favor, usa otro código.')
      return
    } else {
      const newItem = {
        nombre: capitalizeWords(TextNombreOrg.value),
        siglas: TextNombreAbrOrg.value,
      }

      try {
        const response = await api.post(STRINGS.urlApiOrganismo, newItem) // POST /items
        console.log('Petición ADD ORGANISMO:', response.data)
        emit('ActualizarTablaOrganismo', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        emit('ActualizarTablaOrganismo', false)
      }
      refDialogoAddOrganismo.value.hide()
      Reset()
    }
  }
}

const ComprobarEstadoInputsEdit = () => {
  if (TextNombreOrg.value != '' && regexNombreOrganismo.test(TextNombreOrg.value))
    if (TextNombreAbrOrg.value != '' && regexNombreAbrOrganismo.test(TextNombreAbrOrg.value))
      disabledBtnSave.value = ''
    else disabledBtnSave.value = STRINGS.desabilitar
  else disabledBtnSave.value = STRINGS.desabilitar

  return disabledBtnSave.value
}

/*Función que levanta el dialogo*/
const LevantarDialogoAddOrganismo = () => {
  backdropFilter.value = list
  dialogOrganismo.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  TextNombreOrg.value = ''
  TextNombreAbrOrg.value = ''
}

const dialogOrganismo = ref(false)

const TextNombreOrg = ref('')
const TextNombreAbrOrg = ref('')

const backdropFilter = ref(null)
const Ref_table_Gest_provincia = ref(null)
const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  LevantarDialogoAddOrganismo,
})
</script>
