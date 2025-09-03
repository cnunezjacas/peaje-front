<template>
  <div class="">
    <q-dialog
      v-model="dialog"
      persistent
      :backdrop-filter="backdropFilter"
      content-class="dialog-xl"
      :style="{ '--q-dialog-max-width': '800px' }"
    >
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.addVehiculo.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_vehiculo"
                ref="textNombre_vehiculo"
                color="green"
                :rules="validaciones_generales.rulesFullTextAndNumber"
                type="text"
                :label="STRINGS.nombre_vehiculo"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_vehiculo"
                v-model="TextCodigo_vehiculo"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyUppercase"
                :label="STRINGS.codigo_vehiculo"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <div class="row flex justify-between q-mt-lg">
            <div class="col-7">
              <q-select
                v-model="TextNomenclador_vehiculo"
                ref="textnomenclador_vehiculo"
                :options="options"
                :rules="validaciones_generales.rulesNoEmpty"
                color="green"
                :label="STRINGS.nomenclador_vehiculo"
                @onchange="checkStatusInputs"
              >
                <!-- Slot para agregar un botón al final del select -->
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>

            <div class="col-4">
              <q-input
                v-model="TextTasaDePeaje_vehiculo"
                ref="textTasaDePeaje_vehiculo"
                color="green"
                :rules="validaciones_generales.rulesOnlyNumbers"
                type="number"
                :label="STRINGS.tasa_de_peajes_vehiculo"
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
                :class="disabledBtnSave"
                @click="SendData()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                v-on:click="Reset()"
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
import { ref, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import validaciones_generales from 'src/utils/validaciones_generales'

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiMoneda
  const existeCodigo = await verificarExistente(
    url,
    STRINGS.codigoBD,
    String(TextCodigo_vehiculo.value),
  )
  return existeCodigo
}

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    if (await CheckCode()) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      return textCodigo_vehiculo.value.focus()
    } else {
      const newItem = {
        nombre: TextNombre_vehiculo.value,
        codigo: TextCodigo_vehiculo.value.toUpperCase(),
        tasa: Number(TextTasaDePeaje_vehiculo.value),
        nomenclador: Number(TextNomenclador_vehiculo.value),
      }

      try {
        await api.post(STRINGS.urlApiVehiculo, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.vehiculoAddSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.vehiculoAddError)

        emit('ActualizarTabla', false)
      }
      Reset()
    }
  }
}

/*Función que levanta el dialogo*/
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (
    TextCodigo_vehiculo.value.trim() !== '' &&
    TextNombre_vehiculo.value.trim() !== '' &&
    TextTasaDePeaje_vehiculo.value.trim() !== '' &&
    TextNomenclador_vehiculo.value !== null
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

//Función para comprobar los campos y habilitar botón GUARDAR
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
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
  disabledBtnSave.value = STRINGS.desabilitar
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

/* Referencia del campo key */
const textCodigo_vehiculo = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(TextNomenclador_vehiculo, () => {
  checkStatusInputs()
})
/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogAdd,
})
</script>
