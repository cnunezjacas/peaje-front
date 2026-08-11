<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.province.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input v-model="Text_Nombre" color="green" :rules="validaciones_generales.rulesOnlyText" type="text"
                :label="STRINGS.name" @keyup="checkStatusInputs" />
            </div>
            <div class="col-5">
              <q-input ref="textCodigo_prov" v-model="Text_codigo" color="green" type="text"
                :rules="validaciones_generales.rulesOnlyNumbers" :label="STRINGS.code" @keyup="checkStatusInputs" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn icon="check" :class="disabledBtnSave" @click="SendData()" :label="STRINGS.save" color="green" />
            </div>

            <div class="">
              <q-btn flat icon="close" :label="STRINGS.close" v-on:click="Reset" color="dark" v-close-popup />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import { useNotify } from 'src/utils/notify/notify.js'
import { useApi } from 'src/composables/useApi'


/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()
const { postData } = useApi()


const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiProvincia
  const result = await verificarExistente(url, STRINGS.codigoBD, Number(Text_codigo.value))
  return result
}

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    if (await CheckCode()) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      textCodigo_prov.value.focus()
      return
    } else {
      const newItem = { nombre: Text_Nombre.value, codigo: Number(Text_codigo.value) }

      try {
        const { /*data,*/ error } = await postData(STRINGS.urlApiProvincia, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        if (error)
          return notify_error(STRINGS.errorAdd)

        emit('ActualizarTabla', true)
        notify_success(STRINGS.successAdd)
        dialog.value = false
        Reset()

      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.errorAdd)
      }

    }
  }
}

/*Función que levanta el dialogo*/
const getUpDialogAdd = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  Text_codigo.value = ''
  Text_Nombre.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (Text_codigo.value.trim() !== '' && Text_Nombre.value.trim() !== '') return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyNumber.test(Text_codigo.value) &&
    expRegulares.onlyText.test(Text_Nombre.value)
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

//Ref dialogo
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const refDialogoAdd = ref(null)
const backdropFilter = ref(null)

//Ref Variables
const Text_codigo = ref('')
const Text_Nombre = ref('')

//Ref key
const textCodigo_prov = ref(null)

//Ref BtnSave
const disabledBtnSave = ref(STRINGS.desabilitar)

defineExpose({
  getUpDialogAdd,
})
</script>
