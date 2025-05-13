<template>
  <div class="">
    <q-dialog
      v-model="dialogEditMunicipio"
      persistent
      ref="refDialogoEditMunicipio"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ STRINGS.editMunicipio }}
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_mun"
                ref="textNombre_prov"
                color="green"
                :rules="rulesAddNombreMunicipio"
                type="text"
                :label="STRINGS.nombre_mun"
                @keyup="ComprobarEstadoInputsEdit"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_prov"
                v-model="TextCodigo_mun"
                color="green"
                type="text"
                :rules="rulesAddCodigoMunicipio"
                :label="STRINGS.codigo_mun"
                @keyup="ComprobarEstadoInputsEdit"
              />
            </div>

            <div class="col-12">
              <q-select
                v-model="SelectNombre_prov"
                ref="selectProv"
                @update:model-value="SelectNombre_prov = $event"
                :options="options"
                :label="STRINGS.nombre_prov"
                :rules="rulesAddNombreProvincia"
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
                @click="Procesar_EditMunicipio()"
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
import verificarCodigoExistente from '../../../../utils/utils_axios/verificarCodigoExistenteMunicipio.js'

/*import { useQuasar } from 'quasar'
var $q = useQuasar()*/

/**
 * Values for backdrop-filter are the same as in the CSS specs.
 * The following list is not an exhaustive one.
 */
const list = 'blur(4px) saturate(150%)'
const options = ref([])

const refDialogoEditMunicipio = ref(null)

/*Validaciones*/
const rulesAddNombreMunicipio = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[a-zA-ZáéíóúöñÁÉÍÓÖÚÑÜ\s]+$/.test(val) || 'El campo solo puede contener letras',
]

const rulesAddCodigoMunicipio = [
  (val) => val != '' || 'El campo no puede estar vacío',
  (val) => /^[0-9\s]+$/.test(val) || 'El campo solo puede contener números',
]

const regexCodigoMunicipio = /^[0-9\s]+$/
const regexNombreMunicipio = /^[a-zA-ZáéíóúöñÁÉÍÓÖÚÑÜ\s]+$/

const rulesAddNombreProvincia = [(val) => val != '' || 'El campo no puede estar vacío']
/*Validaciones*/

const emit = defineEmits(['ActualizarTablaMunicipio'])

/*Funcion de procesado de Datos*/
const Procesar_EditMunicipio = async () => {
  if (ComprobarEstadoInputsEdit() != STRINGS.desabilitar) {
    //TODO: Ajax Request EDIT_MUNICIPIO

    var aux = ''
    var existeCodigo = false

    // Verificar si el código ya existe
    if (TextCodigo_mun.value !== TextCodigo_mun_copy.value) {
      existeCodigo = await verificarCodigoExistente(TextCodigo_mun.value)
    }

    if (existeCodigo ? true : false) {
      // Mostrar mensaje de error o alertar al usuario
      alert('El código de provincia ya existe en la base de datos. Por favor, usa otro código.')
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

      console.log(newItem)

      try {
        const response = await api.patch(STRINGS.urlApiMunicipio + '/' + IdMunicipio.value, newItem) // POST /items
        console.log('Petición UPDATE Municipio:', response.data)
        emit('ActualizarTablaMunicipio', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        emit('ActualizarTablaMunicipio', false)
      }
      refDialogoEditMunicipio.value.hide()
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
const LevantarDialogoEditMunicipio = (name, codigo, provincia, id) => {
  backdropFilter.value = list
  dialogEditMunicipio.value = true

  CargarProvincias()

  TextCodigo_mun.value = String(codigo)
  TextNombre_mun.value = name
  SelectNombre_prov.value = provincia

  TextCodigo_mun_copy.value = String(codigo)
  TextNombre_mun_copy.value = name
  SelectNombre_prov_copy.value = provincia

  IdMunicipio.value = id
}

const ComprobarEstadoInputsEdit = () => {
  // Si ambos campos son iguales a sus valores originales, deshabilitar
  const noHaCambiado =
    TextNombre_mun.value === TextNombre_mun_copy.value &&
    TextCodigo_mun.value === TextCodigo_mun_copy.value &&
    SelectNombre_prov.value === SelectNombre_prov_copy.value

  if (TextNombre_mun.value.trim() == '' || TextCodigo_mun.value.trim() == '') {
    // Si algún campo está vacío, deshabilitar
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (noHaCambiado) {
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else if (
    !regexCodigoMunicipio.test(TextCodigo_mun.value) ||
    !regexNombreMunicipio.test(TextNombre_mun.value)
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
  TextCodigo_mun.value = ''
  TextNombre_mun.value = ''
}

const dialogEditMunicipio = ref(false)

//Campos Originales
const TextCodigo_mun = ref('')
const TextNombre_mun = ref('')
const SelectNombre_prov = ref('')

//Campos Copias
const TextCodigo_mun_copy = ref('')
const TextNombre_mun_copy = ref('')
const SelectNombre_prov_copy = ref('')

const selectProv = ref(null)
const IdMunicipio = ref('')
const backdropFilter = ref(null)
const Ref_table_Gest_provincia = ref(null)

const textNombre_prov = ref(null)
const textCodigo_prov = ref(null)

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  LevantarDialogoEditMunicipio,
})
</script>
