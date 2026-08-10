<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.edit.toUpperCase() }} - {{ STRINGS.vehicle.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input v-model="TextNombre_vehiculo" ref="textNombre_vehiculo" color="green"
                :rules="validaciones_generales.rulesFullTextAndNumber" type="text" :label="STRINGS.name"
                @keyup="checkStatusInputs" />
            </div>
            <div class="col-5">
              <q-input ref="textCodigo_vehiculo" v-model="TextCodigo_vehiculo" color="green" type="text"
                :rules="validaciones_generales.rulesOnlyUppercase" :label="STRINGS.code" @keyup="checkStatusInputs" />
            </div>
          </div>

          <div class="row flex justify-between q-mt-lg">
            <div class="col-7">
              <q-select v-model="TextNomenclador_vehiculo" ref="textnomenclador_vehiculo" :options="options"
                :rules="validaciones_generales.rulesNoEmpty" color="green" :label="STRINGS.nomenclator"
                @onchange="checkStatusInputs">
                <!-- Slot para agregar un botón al final del select -->
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>

            <div class="col-4">
              <q-input v-model="TextTasaDePeaje_vehiculo" ref="textTasaDePeaje_vehiculo" color="green"
                :rules="validaciones_generales.rulesOnlyNumbers" type="number" :label="STRINGS.tasa_de_peajes"
                @keyup="checkStatusInputs" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn icon="check" @click="CheckData()" :label="STRINGS.save" :class="disabledBtnSave" color="green" />
            </div>

            <div class="">
              <q-btn flat icon="close" :label="STRINGS.close" @click="Reset()" color="dark" v-close-popup />
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
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiVehiculo
  const existeCodigo = await verificarExistente(
    url,
    STRINGS.codigoBD,
    String(TextCodigo_vehiculo.value),
  )
  return existeCodigo
}

/* Comprueba que existan cambios y que el código key no sea repetido */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (InputDifferent() && TextCodigo_vehiculo.value !== TextCodigo_vehiculo_copy.value) {
      if (await CheckCode()) {
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.codigoRepetido)
        return textCodigo_vehiculo.value.focus()
      } else {
        SendData()
      }
    } else {
      SendData()
    }
  }
}

/*Funcion de procesado de Datos*/
const SendData = async () => {
  const newItem = {
    nombre: TextNombre_vehiculo.value,
    codigo: TextCodigo_vehiculo.value.toUpperCase(),
    tasa: Number(TextTasaDePeaje_vehiculo.value),
    nomenclador: Number(TextNomenclador_vehiculo.value),
  }

  try {
    await api.patch(STRINGS.urlApiVehiculo + '/' + _id.value, newItem) // POST /items
    // Mostrar alerta positiva de éxito
    notify_success(STRINGS.vehiculoEditSuccess)

    emit('ActualizarTabla', true)
  } catch (error) {
    console.error('Error al editar item:', error)
    notify_error(STRINGS.vehiculoEditError)

    emit('ActualizarTabla', false)
  }
  Reset()
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (nombre, codigo, tasa, nomenclador, id) => {
  backdropFilter.value = list
  dialog.value = true

  TextNombre_vehiculo.value = nombre
  TextCodigo_vehiculo.value = codigo
  TextTasaDePeaje_vehiculo.value = String(tasa)
  TextNomenclador_vehiculo.value = nomenclador
  _id.value = id

  //Copias de Seguridad
  TextNombre_vehiculo_copy.value = nombre
  TextCodigo_vehiculo_copy.value = codigo
  TextTasaDePeaje_vehiculo_copy.value = String(tasa)
  TextNomenclador_vehiculo_copy.value = nomenclador
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    TextCodigo_vehiculo.value.trim() !== '' &&
    TextNombre_vehiculo.value.trim() !== '' &&
    TextTasaDePeaje_vehiculo.value.trim() !== '' &&
    TextNomenclador_vehiculo.value !== ''
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyUppercase.test(TextCodigo_vehiculo.value) &&
    expRegulares.TextAndNumber.test(TextNombre_vehiculo.value) &&
    expRegulares.onlyNumber.test(TextTasaDePeaje_vehiculo.value)
  )
    return true
  else return false
}

/* Función para evaluar que los campos hallan sido modificados */
const InputDifferent = () => {
  return !(
    TextCodigo_vehiculo.value === TextCodigo_vehiculo_copy.value &&
    TextNombre_vehiculo.value === TextNombre_vehiculo_copy.value &&
    TextTasaDePeaje_vehiculo.value === TextTasaDePeaje_vehiculo_copy.value &&
    TextNomenclador_vehiculo.value === TextNomenclador_vehiculo_copy.value
  )
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
  TextNombre_vehiculo.value = ''
  TextCodigo_vehiculo.value = ''
  TextTasaDePeaje_vehiculo.value = ''
  TextNomenclador_vehiculo.value = ''

  // Resetea las copias también
  TextNombre_vehiculo_copy.value = ''
  TextCodigo_vehiculo_copy.value = ''
  TextTasaDePeaje_vehiculo_copy.value = ''
  TextNomenclador_vehiculo_copy.value = ''
}

/* Variables del dialogo */
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog

//V-model
const TextCodigo_vehiculo = ref('')
const TextNombre_vehiculo = ref('')
const TextTasaDePeaje_vehiculo = ref('')
const TextNomenclador_vehiculo = ref(null)
const options = [1, 2, 3, 4]
const _id = ref('')

//V-model Copy
const TextCodigo_vehiculo_copy = ref('')
const TextNombre_vehiculo_copy = ref('')
const TextTasaDePeaje_vehiculo_copy = ref('')
const TextNomenclador_vehiculo_copy = ref(null)

//ref
const textCodigo_vehiculo = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(TextNomenclador_vehiculo, () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
