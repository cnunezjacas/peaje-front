<template>
  <div class="">
    <q-dialog v-model="dialogEdit" persistent ref="refDialogoEdit" :backdrop-filter="backdropFilter"
      content-class="dialog-xl" :style="{ '--q-dialog-max-width': '800px' }">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.edit.toUpperCase() }} - {{ STRINGS.type_of_account.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input v-model="TextNombre_tipoCuenta" ref="textNombre_tipoCuenta" color="green"
                :rules="rulesAddNombre_tipoCuenta" type="text" :label="STRINGS.nombre_tipoCuenta"
                @keyup="checkStatusInputs" />
            </div>
            <div class="col-5">
              <q-input v-model="TextCodigo_tipoCuenta" ref="textCodigo_tipoCuenta" color="green" type="text"
                :rules="rulesAddCodigo_tipoCuenta" :label="STRINGS.codigo_tipoCuenta" @keyup="checkStatusInputs" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn icon="check" :class="disabledBtnSaveEdit" @click="Procesar_Edit()" :label="STRINGS.save"
                color="green" />
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
import { ref, onBeforeMount } from 'vue'
import { STRINGS } from 'utils/string.js'

import api from 'src/axios.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()

const list = STRINGS.OpacityDialog
const refDialogoEdit = ref(null)
const optionsMoneda = ref([])

const loadCoins = async () => {
  const response = await api.get(STRINGS.urlApiMoneda)
  optionsMoneda.value = response.data.map((element) => element['siglas'])

  if (optionsMoneda.value === null) {
    notify_error('Problemas de carga de datos..')
  }
  return optionsMoneda.value !== null ? optionsMoneda : (optionsMoneda.value = ['Empty'])
}

onBeforeMount(() => {
  loadCoins()
})

/*Validaciones*/
const rulesAddNombre_tipoCuenta = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyText.test(val) || STRINGS.onlyText,
]

const rulesAddCodigo_tipoCuenta = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]
/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const Procesar_Edit = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    const newItem = {
      nombre: TextNombre_tipoCuenta.value,
      codigo: TextCodigo_tipoCuenta.value,
    }

    try {
      await api.patch(STRINGS.urlApiTipoCuenta + '/' + _id.value, newItem) // POST /items
      // Mostrar alerta positiva de éxito
      notify_success(STRINGS.tipoCuenta_EditSuccess)

      emit('ActualizarTabla', true)
    } catch (error) {
      console.error('Error al crear item:', error)
      notify_error(STRINGS.tipoCuenta_EditError)

      emit('ActualizarTabla', false)
    }
    Reset()
  } else {
    refDialogoEdit.value.show()
  }
}

/*Función que levanta el dialogo*/
const getUpDialogEdit = (nombre, codigo, id) => {
  backdropFilter.value = list
  dialogEdit.value = true

  TextNombre_tipoCuenta.value = nombre
  TextCodigo_tipoCuenta.value = codigo

  _id.value = id

  //Copias de Seguridad
  TextNombre_tipoCuenta_copy.value = nombre
  TextCodigo_tipoCuenta_copy.value = codigo
}

const InputEmpty = () => {
  if (TextNombre_tipoCuenta.value.trim() === '' || TextCodigo_tipoCuenta.value === '') return true
  else return false
}

const InputDifferent = () => {
  const HaCambiado =
    TextNombre_tipoCuenta.value !== TextNombre_tipoCuenta_copy.value ||
    TextCodigo_tipoCuenta.value !== TextCodigo_tipoCuenta_copy.value
  return HaCambiado
}

const InputRegularExpressions = () => {
  if (
    expRegulares.onlyUppercase.test(TextCodigo_tipoCuenta.value) &&
    expRegulares.onlyText.test(TextNombre_tipoCuenta.value)
  )
    return true
  else return false
}

const checkStatusInputs = () => {
  // Verifica si algún campo está vacío
  const isEmpty = InputEmpty()
  // Verifica si hay cambios respecto a las copias
  const hasChanged = InputDifferent()

  const isValid = InputRegularExpressions()

  if (isEmpty || !hasChanged || !isValid) {
    // Si algún campo está vacío o no hay cambios, deshabilitar
    disabledBtnSaveEdit.value = STRINGS.desabilitar
  } else {
    // Si hay cambios y todos los campos llenos, habilitar
    disabledBtnSaveEdit.value = ''
  }
  return disabledBtnSaveEdit.value
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialogEdit.value = false
  TextNombre_tipoCuenta.value = ''
  TextCodigo_tipoCuenta.value = ''
  disabledBtnSaveEdit.value = STRINGS.desabilitar
}

const dialogEdit = ref(false)
const backdropFilter = ref(null)
const _id = ref('')

//V-model
const TextNombre_tipoCuenta = ref('')
const TextCodigo_tipoCuenta = ref('')

//Ref
const textNombre_tipoCuenta = ref(null)
const textCodigo_tipoCuenta = ref(null)

//V-model Copy
const TextNombre_tipoCuenta_copy = ref('')
const TextCodigo_tipoCuenta_copy = ref('')

const disabledBtnSaveEdit = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogEdit,
})
</script>
