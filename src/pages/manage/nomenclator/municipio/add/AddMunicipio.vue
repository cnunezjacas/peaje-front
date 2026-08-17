<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.municipality.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_mun"
                color="green"
                :rules="validaciones_generales.rulesOnlyText"
                type="text"
                :label="STRINGS.name"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_Mun"
                v-model="TextCodigo_mun"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyNumbers"
                :label="STRINGS.code"
                @keyup="checkStatusInputs"
              />
            </div>

            <div class="col-12 q-mt-md">
              <q-select
                v-model="SelectNombre_prov"
                ref="selectProv"
                @update:model-value="SelectNombre_prov = $event"
                :options="options"
                :label="STRINGS.province"
                :rules="validaciones_generales.rulesNoEmpty"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn
                icon="check"
                @click="SendData()"
                :label="STRINGS.save"
                :class="disabledBtnSave"
                color="green"
              />
            </div>

            <div class="">
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
</template>

<script setup>
/* Importaciones */
import { ref, watch, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import getNomenclator from 'utils/utils_axios/nomencladores/getNomenclator.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import { useNotify } from 'src/utils/notify/notify.js'
import { useApi } from 'src/composables/useApi'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
const { postData } = useApi()

/* Función encargada de realizar la petición y retornar el listado de provincias */
const loadProvincias = async () => {
  options.value = await getNomenclator.loadProvincias()
}

/* onBeforeMount: se ejecuta justo antes de que el componente se monte en el DOM. */
onBeforeMount(async () => {
  await loadProvincias()
})

/* Inicialización del Emit */
const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiMunicipio
  const existeCodigo = await verificarExistente(url, 'codigo', Number(TextCodigo_mun.value))
  return existeCodigo
}

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (await CheckCode()) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      //Focus del campo Código
      return textCodigo_Mun.value.focus()
    } else {
      const newItem = {
        codigo: Number(TextCodigo_mun.value),
        nombre: TextNombre_mun.value,
        provincia: SelectNombre_prov.value['value'],
      }

      try {
        await postData(STRINGS.urlApiMunicipio, newItem) // POST /items
        notify_success(title.value + ' ' + STRINGS.successAdd)
        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.errorAdd + ' ' + title.value)
        emit('ActualizarTabla', false)
      }
      Reset()
    }
  }
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    TextNombre_mun.value.trim() !== '' &&
    TextCodigo_mun.value.trim() !== '' &&
    SelectNombre_prov.value !== ''
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyNumber.test(TextCodigo_mun.value) &&
    expRegulares.onlyText.test(TextNombre_mun.value)
  )
    return true
  else return false
}

//Función para comprobar los campos y habilitar botón GUARDAR
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/*Función que levanta el dialogo*/
const getUpDialogAdd = async () => {
  backdropFilter.value = list
  dialog.value = true
  await loadProvincias()
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextCodigo_mun.value = ''
  TextNombre_mun.value = ''
  SelectNombre_prov.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Ref dialogo
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)
const refDialogoAdd = ref(null)

//Ref Variables
const TextCodigo_mun = ref('')
const TextNombre_mun = ref('')
const SelectNombre_prov = ref('')
const selectProv = ref(null)
const options = ref([])
const title = ref('Municipio')

//Ref key
const textCodigo_Mun = ref(null)

//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

//Casos Especiales
watch(SelectNombre_prov, () => {
  checkStatusInputs()
})

/* Exponer variables o funciones al fichero padre */
defineExpose({
  getUpDialogAdd,
})
</script>
