<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter">
      <q-card style="width: 600px; max-width: 80vw">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.addComprobante.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-between q-mb-lg">
            <div class="col-5">
              <q-input
                v-model="TextNombre_Comprobante"
                ref="textNombre_Comprobante"
                color="green"
                :rules="validaciones_generales.rulesFullTextAndNumber"
                type="text"
                :label="STRINGS.nombre_comprobante"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_comprobante"
                v-model="TextCodigo_comprobante"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesUppercaseAndNumber"
                :label="STRINGS.codigo_comprobante"
                @keyup="checkStatusInputs"
              />
            </div>
          </div>

          <div class="row flex justify-between q-mb-lg">
            <div class="col-12">
              <q-select
                v-model="TextNomenclador_comprobante"
                ref="textNomenclador_exento"
                :options="options"
                :rules="rulesNomenclador_comprobante"
                disable
                color="green"
                :label="STRINGS.nomenclador_comprobante"
                @onchange="checkStatusInputs"
              >
                <!-- Slot para agregar un botón al final del select -->
                <template v-slot:append>
                  <q-btn flat dense icon="add" aria-label="Agregar ítem" @click="openModal" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="row flex justify-between q-mb-lg">
            <div class="col-5">
              <q-input
                ref="textValor_comprobante"
                v-model="TextValor_comprobante"
                color="green"
                type="text"
                :rules="validaciones_generales.rulesExchangeRate"
                :label="STRINGS.valor_comprobante"
                @keyup="checkStatusInputs"
              />
            </div>
            <div class="col-5">
              <q-select
                v-model="TextMoneda_comprobante"
                ref="textMoneda_comprobante"
                :options="optionsMoneda"
                :rules="validaciones_generales.rulesNoEmpty"
                color="green"
                :label="STRINGS.moneda_comprobante"
                @onchange="checkStatusInputs"
              >
              </q-select>
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
/* Importaciones */
import { ref, onBeforeMount, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import api from 'src/axios.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'
import verificarExistente from 'src/utils/utils_axios/nomencladores/checkCode.js'
import validaciones_generales from 'src/utils/validaciones_generales'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'

const loadCoins = async () => {
  optionsMoneda.value = await getNomenclator.loadCoins()
}

onBeforeMount(() => {
  loadCoins()
})

const emit = defineEmits(['ActualizarTabla'])

/* función para verificar si un valor existe en la API */
const CheckCode = async () => {
  const url = STRINGS.urlApiComprobante
  const existeCodigo = await verificarExistente(
    url,
    STRINGS.codigoBD,
    String(TextCodigo_comprobante.value),
  )
  return existeCodigo
}

/*Funcion de procesado de Datos*/
const SendData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    if (await CheckCode()) {
      // Mostrar mensaje de error o alertar al usuario
      notify_error(STRINGS.codigoRepetido)
      textCodigo_comprobante.value.focus()
      return
    } else {
      console.log('TexMoneda:', TextMoneda_comprobante.value['value'])
      const newItem = {
        nombre: TextNombre_Comprobante.value,
        codigo: TextCodigo_comprobante.value,
        valor: Number(TextValor_comprobante.value),
        //TODO: nomenclador: Number(TextNomenclador_comprobante.value),
        moneda: TextMoneda_comprobante.value['value'],
        /*TODO: detalles: TextDetalles_exento.value,*/
      }

      try {
        await api.post(STRINGS.urlApiComprobante, newItem) // POST /items

        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.comprobanteAddSuccess)

        emit('ActualizarTabla', true)
      } catch (error) {
        console.error('Error al crear item:', error)
        notify_error(STRINGS.comprobanteAddError)

        emit('ActualizarTabla', false)
      }
      refDialogoAdd.value.hide()
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
    TextNombre_Comprobante.value.trim() !== '' &&
    TextCodigo_comprobante.value.trim() !== '' &&
    TextValor_comprobante.value.trim() !== '' &&
    TextValueMoneda_comprobante.value !== '' /* &&
    TextValueNomenclador_comprobante.value !== '' */
  )
    return true
  else return false
}

//Función para comprobar que los campos sean válidos
const InputRegularExpressions = () => {
  if (
    expRegulares.uppercaseAndNumber.test(TextCodigo_comprobante.value.trim()) &&
    expRegulares.TextAndNumber.test(TextNombre_Comprobante.value.trim())
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
  TextNombre_Comprobante.value = ''
  TextCodigo_comprobante.value = ''
  TextMoneda_comprobante.value = ''
  TextValor_comprobante.value = ''
  TextNomenclador_comprobante.value = ''
  disabledBtnSave.value = STRINGS.desabilitar
}

/* Variables del dialogo */
const dialog = ref(false)
const backdropFilter = ref(null)
const refDialogoAdd = ref(null)
const list = STRINGS.OpacityDialog

//V-model
const TextCodigo_comprobante = ref('')
const TextNombre_Comprobante = ref('')
const TextNomenclador_comprobante = ref('')
const optionsMoneda = ref([])
const TextValueNomenclador_comprobante = ref('')
const TextValor_comprobante = ref('')
const TextMoneda_comprobante = ref('')
const TextValueMoneda_comprobante = ref('')
const options = [1, 2, 3, 4]
//const TextDetalles_exento = ref('')

/* Referencia del campo key */
const textCodigo_comprobante = ref(null)

/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)

watch(TextNomenclador_comprobante, (newVal) => {
  TextValueNomenclador_comprobante.value = newVal
  checkStatusInputs()
})

/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(TextMoneda_comprobante, (newVal) => {
  TextValueMoneda_comprobante.value = newVal
  checkStatusInputs()
})

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogAdd,
})
</script>
