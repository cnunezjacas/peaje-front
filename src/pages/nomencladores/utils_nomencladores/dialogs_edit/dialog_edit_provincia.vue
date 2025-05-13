<template>
  <div class="">
    <q-dialog
      v-model="dialogEditProvincia"
      persistent
      ref="refDialogoEditProvincia"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ STRINGS.editProvincia }}
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
                @keyup="ComprobarEstadoInputsEdit"
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
                @click="Procesar_EditProvincia()"
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
import verificarCodigoExistente from '../../../../utils/utils_axios/verificarCodigoExistenteProvincia.js'
/*import { useQuasar } from 'quasar'
var $q = useQuasar()*/

/**
 * Values for backdrop-filter are the same as in the CSS specs.
 * The following list is not an exhaustive one.
 */
const list = 'blur(4px) saturate(150%)'

const refDialogoEditProvincia = ref(null)

/*Validaciones*/
const rulesAddNombreProvincia = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[a-zA-ZáééíóúñÁÉÍÓÚÑÜ\s]+$/.test(val) || 'El campo solo puede contener letras',
]

const rulesAddCodigoProvincia = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[0-9\s]+$/.test(val) || 'El campo solo puede contener números',
]

const regexCodigoProvincia = /^[0-9\s]+$/
const regexNombreProvincia = /^[a-zA-ZáééíóúñÁÉÍÓÚÑÜ\s]+$/
/*Validaciones*/

const emit = defineEmits(['ActualizarTablaProvincia'])

/*Funcion de procesado de Datos*/
const Procesar_EditProvincia = async () => {
  if (ComprobarEstadoInputsEdit() != STRINGS.desabilitar) {
    //TODO: Ajax Request EDIT_PROVINCIA
    // Datos enviar, típicamente en formato JSON

    // Verificar si el código ya existe
    const existeCodigo = await verificarCodigoExistente(TextCodigo_prov.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario
      alert('El código de provincia ya existe en la base de datos. Por favor, usa otro código.')
      return
    } else {
      const newItem = { nombre: TextNombre_prov.value, codigo: Number(TextCodigo_prov.value) }
      console.log(_id.value)
      console.log(newItem['codigo'])
      try {
        const response = await api.patch(STRINGS.urlApiProvincia + '/' + _id.value, newItem) // POST /items
        console.log('Petición UPDATE PROVINCIA:', response)
        emit('ActualizarTablaProvincia', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        emit('ActualizarTablaProvincia', false)
      }
      refDialogoEditProvincia.value.hide()
      Reset()
    }
  } else {
    refDialogoEditProvincia.value.show()
  }
}

/*Función que levanta el dialogo*/
const LevantarDialogoEditProvincia = (name, codigo, id) => {
  backdropFilter.value = list
  dialogEditProvincia.value = true
  TextCodigo_prov.value = String(codigo)
  TextNombre_prov.value = name
  _id.value = id
  console.log(_id.value)

  //Copias de Seguridad
  TextCodigo_prov_copy.value = String(codigo)
  TextNombre_prov__copy.value = name
}

const ComprobarEstadoInputsEdit = () => {
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
    !regexNombreProvincia.test(TextNombre_prov.value) ||
    !regexCodigoProvincia.test(TextCodigo_prov.value)
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

// const LevantarDialogoAddModelo = () => {
//   backdropFilter.value = list
//   dialogModel.value = true
// }

defineExpose({
  LevantarDialogoEditProvincia,
  // LevantarDialogoAddModelo,
})

const dialogEditProvincia = ref(false)

//const dialogModel = ref(false)

const TextCodigo_prov = ref('')
const TextNombre_prov = ref('')

const TextCodigo_prov_copy = ref('')
const TextNombre_prov__copy = ref('')

const _id = ref('')

const backdropFilter = ref(null)
const Ref_table_Gest_provincia = ref(null)

const textNombre_prov = ref(null)
const textCodigo_prov = ref(null)

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)
</script>
