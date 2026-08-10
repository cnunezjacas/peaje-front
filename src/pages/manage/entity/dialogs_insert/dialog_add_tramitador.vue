<template>
  <div class="">
    <q-dialog v-model="dialog" persistent ref="refDialogoAdd" :backdrop-filter="backdropFilter"
      content-class="dialog-xl" :style="{ '--q-dialog-max-width': '800px' }">
      <q-card class="my-dialog-card">
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="note_add" />
          </span>
          <span class="icon-text">{{ STRINGS.add.toUpperCase() }} {{ STRINGS.tramitadorLowercase.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <!-- codigo,categoria y nombre -->
          <div class="row flex justify-between q-mb-md">
            <div class="col-8">
              <q-input v-model="TextNombre_tramitador" color="green" type="text"
                :rules="validacionesGenerales.rulesOnlyText" lazy-rules :label="STRINGS.nombre_tramitador"
                @keyup="checkStatusInputs" />
            </div>

            <div class="col-3">
              <q-input v-model="TextID_tramitador" color="green" type="text" maxlength="11"
                :rules="validacionesGenerales.rulesOnlyNumbers" :label="STRINGS.id_tramitador" lazy-rules
                @keyup="checkStatusInputs" />
            </div>
          </div>

          <!-- siglas,estación y Organismo -->

          <div class="text-start q-mt-md">
            <p>{{ STRINGS.estado_operador.toUpperCase() }}:</p>
          </div>

          <div class="row flex justify-between q-mb-xl">
            <div class="col-3 row border-box-radio">
              <div class="col-12 text-start">
                <q-radio v-model="TextEstado_tramitador" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                  :val="STRINGS.active" :label="STRINGS.active" @change="checkStatusInputs" />
              </div>
              <div class="col-12 text-start">
                <q-radio v-model="TextEstado_tramitador" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                  :val="STRINGS.noActive" :label="STRINGS.noActive" @change="checkStatusInputs" />
              </div>
            </div>

            <div class="col-5">
              <q-input v-model="TextCorreo_tramitador" color="green" type="email"
                :rules="validacionesGenerales.rulesEmail" :label="STRINGS.correo_tramitador"
                @keyup="checkStatusInputs" />
            </div>

            <div class="col-3">
              <q-select v-model="TextCliente_tramitador" color="green" :options="options" disable
                :rules="validacionesGenerales.rulesNoEmpty" lazy-rules :label="STRINGS.cliente_tramitador"
                @keyup="checkStatusInputs" />
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
import { ref, onBeforeMount, watch } from 'vue'
import { STRINGS } from 'utils/string.js'
//import api from 'src/axios.js'
//import verificarCuentaDeBanco from 'utils/utils_axios/entity/verificarCuentaDeBanco.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import validacionesGenerales from 'utils/validaciones_generales.js'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator.js'
import { useNotify } from 'src/utils/notify/notify.js'


/* =================================================== */
/*  ===== DECLARACIONES REF ===== */
/* =================================================== */
const { notify_success/*, notify_warning, notify_error*/ } = useNotify()



const options = ref([])
const optionsOrganismo = ref([])
const optionsProvincia = ref([])

const loadOrganismo = async () => {
  optionsOrganismo.value = await getNomenclator.loadOrganismo()
}

const loadProvincias = async () => {
  optionsProvincia.value = await getNomenclator.loadProvincias()
}

onBeforeMount(() => {
  loadOrganismo()
  loadProvincias()
})

options.value = ['Empresa', 'Persona']

//const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos*/
const SendData = async () => {
  //TODO: Send Add
  if (disabledBtnSave.value !== STRINGS.desabilitar) {
    notify_success('Correcto!')
    Reset()
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
  TextNombre_tramitador.value = ''
  TextID_tramitador.value = ''
  TextCorreo_tramitador.value = ''
  TextEstado_tramitador.value = ''
  TextCliente_tramitador.value = ''
}

/* Función que comprueba que no existan campos requeridos vacios */
const InputEmpty = () => {
  if (
    TextID_tramitador.value.trim() !== '' &&
    TextNombre_tramitador.value.trim() !== '' &&
    TextCorreo_tramitador.value !== '' &&
    TextEstado_tramitador.value !== ''
    /*  TextCliente_tramitador.value !== '' && */
  )
    return true
  else return false
}

/* Función que comprueba que no existan campos con datos no válidos ni erroneos */
const InputRegularExpressions = () => {
  if (
    expRegulares.onlyText.test(TextNombre_tramitador.value) &&
    expRegulares.onlyNumber.test(TextID_tramitador.value) &&
    expRegulares.email.test(TextCorreo_tramitador.value)
  )
    return true
  else return false
}

/* Función para realizar las validaciones pertinentes para desbloquear el btn GUARDAR */
const checkStatusInputs = () => {
  const isValid = InputEmpty() && InputRegularExpressions()
  disabledBtnSave.value = isValid ? '' : STRINGS.desabilitar
  return disabledBtnSave.value
}

//Variables Cliente
const TextID_tramitador = ref('')
const TextNombre_tramitador = ref('')
const TextCorreo_tramitador = ref('')
const TextEstado_tramitador = ref('')
const TextCliente_tramitador = ref('')

//REF Btn Send
const disabledBtnSave = ref(STRINGS.desabilitar)

//Ref Dialog
const dialog = ref(false)
const refDialogoAdd = ref(null)
const list = STRINGS.OpacityDialog
const backdropFilter = ref(null)

//Casos Especiales
watch(TextEstado_tramitador, () => {
  checkStatusInputs()
})

defineExpose({
  getUpDialogAdd,
})
</script>
