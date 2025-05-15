<template>
  <div class="">
    <q-dialog
      v-model="dialogMunicipio"
      persistent
      ref="refDialogoAddMunicipio"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          {{ STRINGS.addMunicipio }}
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
                @keyup="ComprobarEstadoInputs"
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
                @keyup="ComprobarEstadoInputs"
              />
            </div>

            <div class="col-12 q-mt-md">
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
                @click="Procesar_AddMunicipio()"
                :label="STRINGS.save"
                :class="disabledBtnSave"
                color="green"
              />
            </div>

            <div class="col-5">
              <q-btn
                icon="close"
                @click="Reset"
                flat
                :label="STRINGS.close"
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
import verificarCodigoExistente from '../../../../utils/utils_axios/verificarCodigoExistenteMunicipio.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { Notify } from 'quasar'

import { onBeforeMount } from 'vue'
const list = 'blur(4px) saturate(150%)'

const options = ref([])

const CargarProvincias = async () => {
  const response = await api.get(STRINGS.urlApiProvincia)
  options.value = response.data.map((element) => element['nombre'])
  return options
}

onBeforeMount(() => {
  CargarProvincias()
})

const refDialogoAddMunicipio = ref(null)

/*Validaciones*/
const rulesAddNombreMunicipio = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.FullText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCodigoMunicipio = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]

const rulesAddNombreProvincia = [(val) => val != '' || STRINGS.inputEmpty]
/*Validaciones*/

const emit = defineEmits(['ActualizarTablaMunicipio'])

/*Funcion de procesado de Datos*/
const Procesar_AddMunicipio = async () => {
  if (ComprobarEstadoInputs() != STRINGS.desabilitar) {
    //TODO: Ajax Request ADD_MUNICIPIO
    var aux = ''

    // Verificar si el código ya existe
    const existeCodigo = await verificarCodigoExistente(TextCodigo_mun.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario
      Notify.create({
        color: 'negative', // color rojo para error
        icon: 'error',
        message: STRINGS.codigoRepetido,
        position: 'bottom',
        timeout: 3000, // en milisegundos
      })

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
        await api.post(STRINGS.urlApiMunicipio, newItem) // POST /items

        Notify.create({
          color: 'positive', // color verde para éxito
          icon: 'check_circle',
          message: STRINGS.municipioAddSuccess,
          position: 'top',
          timeout: 3000,
        })

        emit('ActualizarTablaMunicipio', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        Notify.create({
          color: 'negative',
          icon: 'error',
          message: STRINGS.MunicipioAddError,
          position: 'bottom',
          timeout: 3000,
        })
        emit('ActualizarTablaMunicipio', false)
      }
      refDialogoAddMunicipio.value.hide()
      Reset()
    }
  }
}

const ComprobarEstadoInputs = () => {
  if (TextCodigo_mun.value != '' && expRegulares.onlyNumber.test(TextCodigo_mun.value))
    if (TextNombre_mun.value != '' && expRegulares.FullText.test(TextNombre_mun.value))
      disabledBtnSave.value = ''
    else disabledBtnSave.value = STRINGS.desabilitar
  else disabledBtnSave.value = STRINGS.desabilitar

  return disabledBtnSave.value
}

/*Función que levanta el dialogo*/
const LevantarDialogoAddMunicipio = () => {
  backdropFilter.value = list
  dialogMunicipio.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  TextCodigo_mun.value = ''
  TextNombre_mun.value = ''
  SelectNombre_prov.value = ''
}

const dialogMunicipio = ref(false)

const TextCodigo_mun = ref('')
const TextNombre_mun = ref('')
const SelectNombre_prov = ref('')
const selectProv = ref(null)

const backdropFilter = ref(null)
const Ref_table_Gest_provincia = ref(null)

const textNombre_Mun = ref(null)
const textCodigo_Mun = ref(null)

const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  LevantarDialogoAddMunicipio,
  CargarProvincias,
})
</script>
