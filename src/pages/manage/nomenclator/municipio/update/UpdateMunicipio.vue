<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.edit.toUpperCase() }} - {{ STRINGS.municipality.toUpperCase() }}</span
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

            <div class="col-12">
              <q-select
                v-model="SelectNombre_prov"
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
                :class="disabledBtnSave"
                @click="CheckData()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                @click="Reset()"
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
/* Importaciones */
import { ref, watch, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/boot/api.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
const options = ref([])

/* Función que realiza la carga de todas las provincias del sistema */
const loadProvincias = async () => {
  options.value = await getNomenclator.loadProvincias()
}

/* Funcion encargada de asignar label y value de la provincia traida de BD al Select de Provincias */
const loadProvinciaSelected = async (provincia) => {
  options.value.forEach((element) => {
    if (element.label == provincia)
      SelectNombre_prov.value = { label: element.label, value: element.value }
  })
}

/*
  Método del ciclo de VUE
  Cuándo se ejecuta: Justo antes de que el componente se monte en el DOM
 */

onBeforeMount(() => {
  loadProvincias()
})

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiMunicipio
  const existeCodigo = await verificarExistente(url, 'codigo', Number(TextCodigo_mun.value))
  return existeCodigo
}

/* Comprueba que existan cambios y que el código key no sea repetido */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (InputDifferent() && TextCodigo_mun.value !== TextCodigo_mun_copy.value) {
      if (await CheckCode()) {
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.codigoRepetido)
        return textCodigo_Mun.value.focus()
      } else {
        SendData()
      }
    } else {
      SendData()
    }
  }
}

/*Funcion que envia los Datos al API*/
const SendData = async () => {
  const newItem = {
    codigo: Number(TextCodigo_mun.value),
    nombre: TextNombre_mun.value,
    provincia: SelectNombre_prov.value['value'],
  }

  try {
    await api.patch(STRINGS.urlApiMunicipio + '/' + _id.value, newItem) // POST /items
    notify_success(STRINGS.municipioEditSuccess)

    emit('ActualizarTabla', true)
  } catch (error) {
    console.error('Error al crear item:', error)
    notify_error(STRINGS.municipioEditError)
    emit('ActualizarTabla', false)
  }
  Reset()
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = async (row) => {
  /* Se levanta el dialogo */
  backdropFilter.value = list
  dialog.value = true

  //Contenido de modelos de los capos en pantalla
  TextCodigo_mun.value = String(row.codigo)
  TextNombre_mun.value = row.nombre
  _id.value = row._id

  //Copias de Seguridad
  //TextCodigo_mun_copy.value = String(codigo)
  // TextNombre_mun_copy.value = name
  // SelectNombre_prov_copy.value = provincia

  await loadProvinciaSelected(row.provincia.nombre)
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

/* Función para evaluar que los campos hallan sido modificados */
const InputDifferent = () => {
  return !(
    TextNombre_mun.value === TextNombre_mun_copy.value &&
    TextCodigo_mun.value === TextCodigo_mun_copy.value &&
    SelectNombre_prov.value['label'] === SelectNombre_prov_copy.value
  )
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
  const isValid = InputEmpty() && InputRegularExpressions() && InputDifferent()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextCodigo_mun.value = ''
  TextNombre_mun.value = ''
  SelectNombre_prov.value = ''

  TextCodigo_mun_copy.value = ''
  TextNombre_mun_copy.value = ''
  SelectNombre_prov_copy.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/* Variables del dialogo */
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog

//Campos Originales
const TextCodigo_mun = ref('')
const TextNombre_mun = ref('')
const SelectNombre_prov = ref('')
const _id = ref('')

//Campos Copias
const TextCodigo_mun_copy = ref('')
const TextNombre_mun_copy = ref('')
const SelectNombre_prov_copy = ref('')

/* Referencia del campo key */
const textCodigo_Mun = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(SelectNombre_prov, () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
