<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.body.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-4">
              <q-input v-model="TextNombreAbrOrg" ref="textNombre_AbrOrg" color="green"
                :rules="validaciones_generales.rulesOnlyUppercase" type="text" :label="STRINGS.nombre_abreviado"
                @keyup="checkStatusInputs" />
            </div>
            <div class="col-7">
              <q-input v-model="TextNombreOrg" color="green" type="text" :rules="validaciones_generales.rulesOnlyText"
                :label="STRINGS.name" @keyup="checkStatusInputs" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn icon="check" @click="SendData" :label="STRINGS.save" color="green" :class="disabledBtnSave" />
            </div>

            <div class="">
              <q-btn icon="close" flat :label="STRINGS.close" @click="Reset" class="btn btn-white" v-close-popup />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
/* Importaciones */
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
import verificarSiglaExistente from 'src/utils/utils_axios/nomencladores/verificarSiglaExistenteOrganismo.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useApi } from 'composables/useApi.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
// 🔥 Inicializar el composable
const { postData/*, postData, putData, deleteData */ } = useApi()

/* Inicialización del Emit */
const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    const existeSigla = await verificarSiglaExistente(TextNombreAbrOrg.value)
    if (existeSigla) {
      // Key  repetida Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.siglasRepetidas)
      return textNombre_AbrOrg.value.focus()
    } else {
      const newItem = {
        nombre: TextNombreOrg.value.toUpperCase(),
        siglas: TextNombreAbrOrg.value,
      }
      try {
        await postData(STRINGS.urlApiOrganismo, newItem)
        notify_success(STRINGS.organismoAddSuccess)
        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.organismoAddError)
        emit('ActualizarTabla', false)
      }
      Reset()
    }
  }
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (TextNombreAbrOrg.value.trim() !== '' && TextNombreOrg.value.trim() !== '') return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyUppercase.test(TextNombreAbrOrg.value) &&
    expRegulares.onlyText.test(TextNombreOrg.value)
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
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextNombreOrg.value = ''
  TextNombreAbrOrg.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Ref dialogo
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)

//Ref Variables
const TextNombreOrg = ref('')
const TextNombreAbrOrg = ref('')

//Ref key
const textNombre_AbrOrg = ref(null)

//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

/* Exponer variables o funciones al fichero padre */
defineExpose({
  getUpDialogAdd,
})
</script>
