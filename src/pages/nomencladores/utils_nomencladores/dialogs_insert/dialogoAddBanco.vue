<template>
  <div class="">
    <q-dialog
      v-model="dialog"
      persistent
      ref="refDialogoAddBanco"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.addBanco.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_banco"
                ref="textNombre_banco"
                color="green"
                :rules="rulesAddNombreBanco"
                type="text"
                :label="STRINGS.nombre_banco"
                @keyup="ComprobarEstadoInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_banco"
                v-model="TextCodigo_banco"
                color="green"
                type="text"
                :rules="rulesAddCodigoBanco"
                :label="STRINGS.codigo_banco"
                @keyup="ComprobarEstadoInputs"
              />
            </div>

            <div class="col-12 q-mt-md">
              <p>{{ STRINGS.detalles_banco }}:</p>
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
                :class="disabledBtnSaveEdit"
                @click="Procesar_Add()"
                :label="STRINGS.save"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                v-on:click="Reset"
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
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { Notify } from 'quasar'
import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/verificarCodigoExistenteBanco.js'
import imports from 'src/utils/imports.js'

const list = 'blur(4px) saturate(150%)'

const refDialogoAddBanco = ref(null)

/*Validaciones*/
const rulesAddNombreBanco = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.FullText.test(val) || STRINGS.onlyLetters,
]

const rulesAddCodigoBanco = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]
/*Validaciones*/

const emit = defineEmits(['ActualizarTablaBanco'])

/*Funcion de procesado de Datos*/
const Procesar_Add = async () => {
  if (ComprobarEstadoInputs() != STRINGS.desabilitar) {
    // Datos enviar, típicamente en formato JSON

    // Verificar si el código ya existe
    const existeCodigo = await verificarCodigoExistente(TextCodigo_banco.value)
    if (existeCodigo) {
      // Mostrar mensaje de error o alertar al usuario
      Notify.create({
        color: 'negative', // color rojo para error
        icon: 'error',
        message: STRINGS.codigoRepetido,
        position: 'bottom',
        timeout: 3000, // en milisegundos
      })

      textCodigo_banco.value.focus()
      return
    } else {
      const newItem = {
        nombre: imports.capitalizeWords(TextNombre_banco.value),
        codigo: TextCodigo_banco.value,
        detalles: TextDetalles_banco.value,
      }

      try {
        await api.post(STRINGS.urlApiBanco, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        Notify.create({
          color: 'positive', // color verde para éxito
          icon: 'check_circle',
          message: STRINGS.BancoAddSuccess,
          position: 'top',
          timeout: 3000,
        })

        emit('ActualizarTablaBanco', true)
      } catch (error) {
        console.error('Error al crear item:', error)

        Notify.create({
          color: 'negative',
          icon: 'error',
          message: STRINGS.BancoAddError,
          position: 'bottom',
          timeout: 3000,
        })

        emit('ActualizarTablaBanco', false)
      }
      refDialogoAddBanco.value.hide()
      Reset()
    }
  }
}

/*Función que levanta el dialogo*/
const LevantarDialogo = () => {
  backdropFilter.value = list
  dialog.value = true
}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  TextCodigo_banco.value = ''
  TextNombre_banco.value = ''
  TextDetalles_banco.value = ''
}

const ComprobarEstadoInputs = () => {
  if (TextCodigo_banco.value != '' && expRegulares.onlyUppercase.test(TextCodigo_banco.value))
    if (TextNombre_banco.value != '' && expRegulares.FullText.test(TextNombre_banco.value))
      disabledBtnSaveEdit.value = ''
    else disabledBtnSaveEdit.value = STRINGS.desabilitar
  else disabledBtnSaveEdit.value = STRINGS.desabilitar

  return disabledBtnSaveEdit.value
}

const dialog = ref(false)
const backdropFilter = ref(null)

const TextNombre_banco = ref('')
const TextCodigo_banco = ref('')
const TextDetalles_banco = ref('')
const textCodigo_banco = ref(null)

const disabledBtnSaveEdit = ref('disabled')

defineExpose({ LevantarDialogo })
</script>
