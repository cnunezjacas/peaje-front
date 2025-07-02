<template>
  <div class="">
    <q-dialog
      v-model="dialogEdit"
      persistent
      ref="refDialogoEdit"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.editMunicipio.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_mun"
                ref="textNombre_Mun"
                color="green"
                :rules="rulesAddNombreMunicipio"
                type="text"
                :label="STRINGS.nombre_mun"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_Mun"
                v-model="TextCodigo_mun"
                color="green"
                type="text"
                :rules="rulesAddCodigoMunicipio"
                :label="STRINGS.codigo_mun"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="SelectNombre_prov"
                ref="SelectNombre_prov_ref"
                @update:model-value="SelectNombre_prov = $event"
                :options="options"
                :label="STRINGS.nombre_prov"
                :rules="rulesAddNombreProvincia"
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
                @click="Procesar_EditMunicipio()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                @click="Reset"
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
import { ref, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteMunicipio.js'
import notify_success from 'src/utils/notify/notify_success.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = STRINGS.OpacityDialog
const options = ref([])

const refDialogoEdit = ref(null)

/*Validaciones*/
const rulesAddNombreMunicipio = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCodigoMunicipio = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]
const rulesAddNombreProvincia = [(val) => val != '' || STRINGS.inputEmpty]
/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const Procesar_EditMunicipio = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    var aux = ''
    var existeCodigo = false

    // Verificar si el código ya existe
    if (TextCodigo_mun.value !== TextCodigo_mun_copy.value)
      existeCodigo = await verificarCodigoExistente(TextCodigo_mun.value)

    if (existeCodigo ? true : false) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      textCodigo_Mun.value.focus()
      return
    } else {
      const response = await api.get(STRINGS.urlApiProvincia)
      response.data.forEach((element) => {
        if (element['nombre'] === SelectNombre_prov.value) {
          aux = element['_id']
        }
      })

      const newItem = {
        codigo: Number(TextCodigo_mun.value),
        nombre: TextNombre_mun.value,
        provincia: String(aux),
      }

      try {
        await api.patch(STRINGS.urlApiMunicipio + '/' + IdMunicipio.value, newItem) // POST /items
        notify_success(STRINGS.municipioEditSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.municipioEditError)
        emit('ActualizarTabla', false)
      }
      Reset()
    }
  }
}

const CargarProvincias = async () => {
  const response = await api.get(STRINGS.urlApiProvincia)
  options.value = response.data.map((element) => element['nombre'])
  return options
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (name, codigo, provincia, id) => {
  backdropFilter.value = list
  dialogEdit.value = true

  CargarProvincias()

  TextCodigo_mun.value = String(codigo)
  TextNombre_mun.value = name
  SelectNombre_prov.value = provincia

  TextCodigo_mun_copy.value = String(codigo)
  TextNombre_mun_copy.value = name
  SelectNombre_prov_copy.value = provincia

  IdMunicipio.value = id
}

const InputEmpty = () => {
  if (
    TextNombre_mun.value.trim() == '' ||
    TextCodigo_mun.value.trim() == '' ||
    SelectNombre_prov.value == null
  )
    return true
  else return false
}

const InputDifferent = () => {
  let HaCambiado =
    TextNombre_mun.value !== TextNombre_mun_copy.value ||
    TextCodigo_mun.value !== TextCodigo_mun_copy.value ||
    SelectNombre_prov.value !== SelectNombre_prov_copy.value

  return HaCambiado
}

const InputRegularExpressions = () => {
  let InputValidated =
    expRegulares.onlyNumber.test(TextCodigo_mun.value) &&
    expRegulares.onlyText.test(TextNombre_mun.value)

  return InputValidated
}

const checkStatusInputs = () => {
  var isEmpty = InputEmpty()
  var noChange = InputDifferent()
  var InputValidated = InputRegularExpressions()

  if (isEmpty) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (!noChange) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (!InputValidated) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else {
    disabledBtnSaveEdit.value = ''
  }
  return disabledBtnSaveEdit.value
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialogEdit.value = false
  TextCodigo_mun.value = ''
  TextNombre_mun.value = ''
  SelectNombre_prov.value = ''

  TextCodigo_mun_copy.value = ''
  TextNombre_mun_copy.value = ''
  SelectNombre_prov_copy.value = ''
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

const dialogEdit = ref(false)

//Campos Originales
const TextCodigo_mun = ref('')
const TextNombre_mun = ref('')
const SelectNombre_prov = ref('')

//Campos Copias
const TextCodigo_mun_copy = ref('')
const TextNombre_mun_copy = ref('')
const SelectNombre_prov_copy = ref('')

const SelectNombre_prov_ref = ref(null)
const IdMunicipio = ref('')
const backdropFilter = ref(null)

const textNombre_Mun = ref(null)
const textCodigo_Mun = ref(null)

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

watch(SelectNombre_prov, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogEdit,
})
</script>
