<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.method_of_payment.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input v-model="TextDescripcion_fdp" ref="textDescripcion_fdp" color="green"
                :rules="validaciones_generales.rulesNoEmpty" type="text" :label="STRINGS.descripcion"
                @keyup="checkStatusInputs" />
            </div>
            <div class="col-5">
              <q-select v-model="TextNomenclador_fdp" ref="textNomenclador_fdp" :options="options"
                :rules="validaciones_generales.rulesNoEmpty" color="green" :label="STRINGS.nomenclador_formas_pago"
                @onchange="checkStatusInputs">
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="row flex justify-between q-mt-md">
            <div class="col-12">
              <p>{{ STRINGS.detalles_formas_pago }}:</p>
              <div class="bg-grey-4">
                <q-input ref="textDetalles_fdp" v-model="TextDetalles_fdp" class="q-pa-md q-pb-lg" color="green"
                  autogrow @keyup="checkStatusInputs" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn icon="check" :class="disabledBtnSave" @click="SendData()" :label="STRINGS.save" color="green" />
            </div>

            <div class="">
              <q-btn flat icon="close" :label="STRINGS.close" v-on:click="Reset()" color="dark" v-close-popup />
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
import validaciones_generales from 'src/utils/validaciones_generales'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()

const openModal = () => {
  console.log('Hi')
}

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON
    const newItem = {
      descripcion: TextDescripcion_fdp.value,
      nomenclador: Number(TextNomenclador_fdp.value),
      detalles: TextDetalles_fdp.value,
    }

    try {
      await api.post(STRINGS.urlApiFormaDePago, newItem)

      // Mostrar alerta positiva de éxito
      notify_success(STRINGS.fdp_AddSuccess)

      emit('ActualizarTabla', true)
    } catch (error) {
      console.error('Error al crear item:', error)
      notify_error(STRINGS.fdp_AddError)

      emit('ActualizarTabla', false)
    }
    Reset()
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
    TextDescripcion_fdp.value.trim() !== '' &&
    TextNomenclador_fdp.value !== '' /* &&
    TextDetalles_fdp.value.trim() !== '' */
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
/* const InputRegularExpressions = () => {
  if (expRegulares.onlyText.test(TextDescripcion_fdp.value)) return true
  else return false
} */

//Función para comprobar los campos y habilitar botón GUARDAR
const checkStatusInputs = () => {
  const isValid = InputEmpty() /* && InputRegularExpressions() */
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextDescripcion_fdp.value = ''
  TextNomenclador_fdp.value = ''
  TextDetalles_fdp.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Ref dialogo
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog

//V-model
const TextDescripcion_fdp = ref('')
const TextNomenclador_fdp = ref('')
const TextDetalles_fdp = ref('')
const options = [1, 2, 3, 4]

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */

watch(TextNomenclador_fdp, () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogAdd,
})
</script>
