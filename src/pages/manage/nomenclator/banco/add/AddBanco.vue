<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.add.toUpperCase() }} - {{ STRINGS.bank.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_banco"
                ref="textNombre_banco"
                color="green"
                :rules="validaciones_generales.rulesOnlyText"
                type="text"
                :label="STRINGS.name"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_banco"
                v-model="TextCodigo_banco"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesOnlyUppercase"
                :label="STRINGS.code"
              />
            </div>

            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.details }}:</p>
              <div class="bg-grey-4">
                <q-input
                  ref="textDetalles_banco"
                  v-model="TextDetalles_banco"
                  class="q-pa-md"
                  color="green"
                  autogrow
                />
              </div>
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
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useApi } from 'composables/useApi.js'
import validaciones_generales from 'src/utils/validaciones_generales.js'
import CheckField from 'src/utils/utils_axios/nomencladores/CheckField.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
const { notify_success, notify_error } = useNotify()

// Inicializar el composable
const { postData, fetchData } = useApi()

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiBanco
  const result = await CheckField(url, STRINGS.codigoBD, String(TextCodigo_banco.value), fetchData)
  return result
}

/* Emisor */
const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    if (await CheckCode()) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      return textCodigo_banco.value.focus()
    } else {
      const newItem = {
        nombre: TextNombre_banco.value.toUpperCase(),
        codigo: TextCodigo_banco.value,
        detalles: TextDetalles_banco.value,
      }

      try {
        const { data, error } = await postData(STRINGS.urlApiBanco, newItem) // POST /items

        if (!data && error) return notify_error(`${STRINGS.errorAdd} ${STRINGS.bank}`)

        // Mostrar alerta positiva de éxito
        notify_success(`${STRINGS.bank} ${STRINGS.successAdd}`)
        emit('ActualizarTabla', true)
        Reset()
      } catch (error) {
        console.error(`Error al crear item ${STRINGS.bank}:`, error)
        notify_error(` ${STRINGS.errorAdd} ${STRINGS.bank}`)
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
  TextCodigo_banco.value = ''
  TextNombre_banco.value = ''
  TextDetalles_banco.value = ''
}

//Función para comprobar que los campos no estén vacíos
const InputEmpty = () => {
  if (TextCodigo_banco.value.trim() !== '' && TextNombre_banco.value.trim() !== '') return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyUppercase.test(TextCodigo_banco.value) &&
    expRegulares.onlyText.test(TextNombre_banco.value)
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

/* Referencias del dialogo */
const dialog = ref(false)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)

/* Referencias de los modelos de los campos */
const TextNombre_banco = ref('')
const TextCodigo_banco = ref('')
const TextDetalles_banco = ref('')

/* Referencia del campo key */
const textCodigo_banco = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch([TextCodigo_banco, TextNombre_banco, TextDetalles_banco], () => {
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({ getUpDialogAdd })
</script>
