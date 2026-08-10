<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter"
      content-class="dialog-xl" :style="{ '--q-dialog-max-width': '800px' }">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.update.toUpperCase() }} {{ STRINGS.cuentaLowercase.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <!-- codigo y nombre -->
          <div class="row flex justify-between">
            <!-- Banco CUC -->
            <div class="col-6">
              <q-input v-model="TextTitularCuenta" ref="textTitularCuenta" color="green" type="text"
                :rules="validaciones_generales.rulesOnlyText" :label="STRINGS.titular_de_la_cuenta"
                @keyup="checkStatusInputs" />
            </div>

            <div class="col-5">
              <q-select v-model="TextTipoCuenta" ref="textTipoCuenta" color="green" :options="optionsCuenta" type="text"
                :rules="rulesAddNombreProvinciaAndMunicipio" :label="STRINGS.tipoCuenta" @keyup="checkStatusInputs" />
            </div>

            <div class="col-5">
              <q-select v-model="TextBanco" ref="textBanco" color="green" :options="optionsBanco" type="text"
                :rules="rulesAddNombreProvinciaAndMunicipio" :label="STRINGS.banco_cuenta" @keyup="checkStatusInputs" />
            </div>

            <div class="col-5">
              <q-input v-model="TextCuenta" ref="textCuenta" color="green" maxlength="19" type="text"
                :rules="rulesAddCuenta" :label="STRINGS.cuenta" @keyup="checkStatusInputs" />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn icon="check" :class="disabledBtnSave" @click="CheckData()" :label="STRINGS.save" color="green" />
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
import { ref, onBeforeMount, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
import verificarCuentaDeBanco from 'utils/utils_axios/entity/verificarCuentaDeBanco.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import { useNotify } from 'src/utils/notify/notify.js'
import imports from 'src/utils/imports'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import validaciones_generales from 'src/utils/validaciones_generales'
import { useApi } from 'src/composables/useApi'

const { fetchData, patchData } = useApi()
const { notify_success, /*notify_warning,*/ notify_error } = useNotify()
const optionsBanco = ref([])
const optionsCuenta = ref([])

const loadBank = async () => {
  optionsBanco.value = await getNomenclator.loadBank()
}

const CargarCuentas = async () => {
  const response = await fetchData(STRINGS.urlApiTipoCuenta)
  // Suponiendo que response.data es un array de objetos como:
  // { nombre: 'Ciudad1', ... }
  optionsCuenta.value = response.data.map((element) => ({
    label: element['nombre'],
    value: element['_id'],
  }))
  return optionsCuenta
}

onBeforeMount(() => {
  loadBank()
  CargarCuentas()
})

/*Validaciones*/
const rulesAddCuenta = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.cardOfBank.test(val) || STRINGS.cardOfBank,
]

const rulesAddNombreProvinciaAndMunicipio = [(val) => val != '' || STRINGS.inputEmpty]

/*Validaciones*/

const emit = defineEmits(['ActualizarTabla'])


/* Comprueba que existan cambios y que el código key no sea repetido */
const CheckData = async () => {
  if (checkStatusInputs() != STRINGS.desabilitar) {
    // Verificar si el código ya existe
    let check = TextCuenta.value !== TextCuenta_copy.value;
    if (InputDifferent() && check) {
      if (await CheckCardBank()) {
        // Mostrar mensaje de error o alertar al usuario
        notify_error(STRINGS.cardBankrepeat)
        return textCuenta.value.focus()
      } else {
        SendData()
      }
    } else
      SendData()
  }
}

/* función para verificar si un valor existe en la API */
const CheckCardBank = async () => {
  const result = await verificarCuentaDeBanco(imports.cardOfBankToNumber(TextCuenta.value.trim()))
  return result
}

/*Funcion de procesado de Datos*/
const SendData = async () => {

  const Item = {
    titular: TextTitularCuenta.value,
    numero: String(TextCuenta.value),
    banco: TextBanco.value['value'] !== undefined ? String(TextBanco.value['value']) : TextIdBanco.value,
    tipo: TextTipoCuenta.value['value'] !== undefined ? String(TextTipoCuenta.value['value']) : TextIdTipoCuenta.value,
  }

  try {
    let result = await patchData(STRINGS.urlApiCuenta + '/' + Textid.value, Item) // POST /items

    // Mostrar alerta positiva de éxito
    if (result)
      notify_success(STRINGS.cuenta_AddSuccess)
    else
      notify_error(result.error.message)

    emit('ActualizarTabla', true)
  } catch (error) {
    console.error('Error al crear item:', error)
    notify_error(STRINGS.cuenta_AddError)

    emit('ActualizarTabla', false)
  }
  dialog.value = false;
  Reset()
}


/*Función que levanta el dialogo*/
const getUpDialogEdit = async (titular, numero_tarjeta, idtipo_cuenta, tipocuenta, idBanco, banco, _id) => {
  /* Se levanta el dialogo */
  backdropFilter.value = list
  dialog.value = true

  TextTitularCuenta.value = titular;
  TextCuenta.value = numero_tarjeta;
  TextTipoCuenta.value = tipocuenta;
  TextBanco.value = banco;
  TextIdBanco.value = idBanco;
  TextIdTipoCuenta.value = idtipo_cuenta;
  Textid.value = _id;


  TextTitularCuenta_copy.value = titular;
  TextCuenta_copy.value = numero_tarjeta;
  TextTipoCuenta_copy.value = tipocuenta;
  TextBanco_copy.value = banco;

}

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  dialog.value = false
  TextTitularCuenta.value = ''
  TextBanco.value = ''
  TextCuenta.value = ''
  TextTipoCuenta.value = ''
  Textid.value = ''

  TextTitularCuenta_copy.value = ''
  TextBanco_copy.value = ''
  TextCuenta_copy.value = ''
  TextTipoCuenta_copy.value = ''
}

const InputEmpty = () => {
  if (
    TextTitularCuenta.value.trim() !== '' &&
    TextCuenta.value.trim() !== '' &&
    TextBanco.value !== '' &&
    TextTipoCuenta.value !== ''
  )
    return true
  else return false
}


/* Función para evaluar que los campos hallan sido modificados */
const InputDifferent = () => {

  const auxOne = TextTitularCuenta.value === TextTitularCuenta_copy.value && TextCuenta.value === TextCuenta_copy.value

  var auxTwo = false, auxThree = false;

  if (TextBanco.value['label'] !== undefined)
    auxTwo = TextBanco.value['label'] === TextBanco_copy.value
  else
    auxTwo = TextBanco.value === TextBanco_copy.value

  if (TextTipoCuenta.value['label'] !== undefined)
    auxThree = TextTipoCuenta.value['label'] === TextTipoCuenta_copy.value
  else
    auxThree = TextTipoCuenta.value === TextTipoCuenta_copy.value

  return !(auxOne && auxTwo && auxThree)
}

const InputRegularExpressions = () => {
  const result = expRegulares.onlyText.test(TextTitularCuenta.value) &&
    expRegulares.cardOfBank.test(TextCuenta.value)

  return result ? true : false
}

const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions() && InputDifferent()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

/* Variables del dialogo */
const dialog = ref(false)
const backdropFilter = ref(null)
const list = STRINGS.OpacityDialog

//Campos Originales
const TextBanco = ref('')
const TextIdBanco = ref('')
const TextTitularCuenta = ref('')
const TextCuenta = ref('')
const TextIdTipoCuenta = ref('')
const TextTipoCuenta = ref('')
const Textid = ref('')

//Campos Copias
const TextBanco_copy = ref('')
const TextTitularCuenta_copy = ref('')
const TextCuenta_copy = ref('')
const TextTipoCuenta_copy = ref('')

/* Referencia del campo key */
const textCuenta = ref(null)
const textTipoCuenta = ref(null)


/* Referencia del botón de enviar datos */
const disabledBtnSave = ref(STRINGS.desabilitar)


/* ("observador") que permite reaccionar a cambios en datos específicos del/los componente/s */
watch(TextBanco, () => {
  checkStatusInputs()
})

watch(TextTipoCuenta, () => {
  checkStatusInputs()
})


/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogEdit,
})
</script>
