<template>
  <div class="">
    <q-dialog
      v-model="dialogEdit"
      persistent
      ref="refDialogoEdit"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="edit" />
          </span>
          <span class="icon-text">{{ STRINGS.editVehiculo.toUpperCase() }}</span>
        </q-card-section>
        <q-card-section>
          <div class="row flex justify-between">
            <div class="col-5">
              <q-input
                v-model="TextNombre_vehiculo"
                ref="textNombre_vehiculo"
                color="green"
                :rules="rulesNombre_vehiculo"
                type="text"
                :label="STRINGS.nombre_vehiculo"
              />
            </div>
            <div class="col-5">
              <q-input
                ref="textCodigo_vehiculo"
                v-model="TextCodigo_vehiculo"
                color="green"
                type="text"
                :rules="rulesCodigo_vehiculo"
                :label="STRINGS.codigo_vehiculo"
              />
            </div>
          </div>

          <div class="row flex justify-between q-mt-lg">
            <div class="col-7">
              <q-select
                v-model="TextNomenclador_vehiculo"
                ref="textnomenclador_vehiculo"
                :options="options"
                :rules="rulesNomenclador_vehiculo"
                color="green"
                :label="STRINGS.nomenclador_vehiculo"
                outlined
              >
                <!-- Slot para agregar un botón al final del select -->
                <template v-slot:append>
                  <q-btn
                    flat
                    dense
                    icon="add"
                    aria-label="Agregar ítem"
                    @click="VentanaNomenclador()"
                  />
                </template>
              </q-select>
            </div>

            <div class="col-4">
              <q-input
                v-model="TextTasaDePeaje_vehiculo"
                ref="textTasaDePeaje_vehiculo"
                color="green"
                :rules="rulesTasaDePeaje_vehiculo"
                type="number"
                :label="STRINGS.tasa_de_peajes_vehiculo"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-start">
            <div class="">
              <q-btn
                icon="check"
                @click="Procesar_Edit()"
                :label="STRINGS.save"
                :disable="!isSaveEnabled"
                color="green"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.close"
                @click="Reset()"
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

import api from 'src/axios.js'
import verificarCodigoExistente from '../../../../utils/utils_axios/nomencladores/verificarCodigoExistenteVehiculo.js'
import { expRegulares } from 'src/utils/expresiones_regulares.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'

const list = 'blur(4px) saturate(150%)'

const refDialogoEdit = ref(null)

/*Validaciones*/
const rulesNombre_vehiculo = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.FullTextAndNumber.test(val) || STRINGS.onlyLetters,
]

const rulesCodigo_vehiculo = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyUppercase.test(val) || STRINGS.onlyUppercase,
]

const rulesTasaDePeaje_vehiculo = [
  (val) => val != '' || STRINGS.inputEmpty,
  (val) => expRegulares.onlyNumber.test(val) || STRINGS.onlyNumbers,
]

const rulesNomenclador_vehiculo = [(val) => val != '' || STRINGS.inputEmpty]
/*Validaciones*/

const emit = defineEmits(['ActualizarTablaVehiculo'])

/*Funcion de procesado de Datos*/
const Procesar_Edit = async () => {
  let aux = true
  if (aux === true) {
    // Verificar si el código ya existe
    var existeCodigo = false

    if (TextCodigo_vehiculo.value !== TextCodigo_vehiculo_copy.value)
      existeCodigo = await verificarCodigoExistente(TextCodigo_vehiculo.value)

    if (existeCodigo ? true : false) {
      // Mostrar mensaje de error o alertar al usuario

      notify_error(STRINGS.codigoRepetido)

      textCodigo_vehiculo.value.focus()

      return
    } else {
      const newItem = {
        nombre: TextNombre_vehiculo.value,
        codigo: TextCodigo_vehiculo.value.toUpperCase(),
        tasa: Number(TextTasaDePeaje_vehiculo.value),
        nomenclador: Number(TextNomenclador_vehiculo.value),
      }

      try {
        await api.patch(STRINGS.urlApiVehiculo + '/' + _id.value, newItem) // POST /items
        // Mostrar alerta positiva de éxito
        notify_success(STRINGS.vehiculoEditSuccess)

        emit('ActualizarTablaVehiculo', true)
      } catch (error) {
        console.error('Error al editar item:', error)
        notify_error(STRINGS.vehiculoEditError)

        emit('ActualizarTablaVehiculo', false)
      }
      refDialogoEdit.value.hide()
      Reset()
    }
  } else {
    refDialogoEdit.value.show()
  }
}

/*Función que levanta el dialogo*/
const LevantarDialogoEdit = (nombre, codigo, tasa, nomenclador, id) => {
  backdropFilter.value = list
  dialogEdit.value = true

  TextNombre_vehiculo.value = nombre
  TextCodigo_vehiculo.value = codigo
  TextTasaDePeaje_vehiculo.value = String(tasa)
  TextNomenclador_vehiculo.value = nomenclador
  _id.value = id

  //Copias de Seguridad
  TextNombre_vehiculo_copy.value = nombre
  TextCodigo_vehiculo_copy.value = codigo
  TextTasaDePeaje_vehiculo_copy.value = String(tasa)
  TextNomenclador_vehiculo_copy.value = nomenclador
}

import { computed } from 'vue'

// Función que evalúa si los datos son válidos y diferentes
// La condición para habilitar el botón
const isFormModifiedAndValid = computed(() => {
  if (!dialogEdit.value) return false // o true? Mejor que false para que no habiliten fuera del diálogo

  // Validaciones
  const camposNoVacios =
    TextCodigo_vehiculo.value.trim() !== '' &&
    TextNombre_vehiculo.value.trim() !== '' &&
    TextTasaDePeaje_vehiculo.value.trim() !== '' &&
    TextNomenclador_vehiculo.value !== ''

  const expresionesValidas =
    expRegulares.onlyUppercase.test(TextCodigo_vehiculo.value) &&
    expRegulares.FullTextAndNumber.test(TextNombre_vehiculo.value) &&
    expRegulares.onlyNumber.test(TextTasaDePeaje_vehiculo.value)

  // Cambio respecto a original
  const haCambiado =
    TextNombre_vehiculo.value.trim() !== TextNombre_vehiculo_copy.value.trim() ||
    TextCodigo_vehiculo.value.trim() !== TextCodigo_vehiculo_copy.value ||
    TextTasaDePeaje_vehiculo.value.trim() !== TextTasaDePeaje_vehiculo_copy.value ||
    TextNomenclador_vehiculo.value !== TextNomenclador_vehiculo_copy.value

  console.log('haCambiado:' + haCambiado)
  console.log('camposNoVacios:' + camposNoVacios)
  console.log('expresionesValidas:' + expresionesValidas)

  return haCambiado && camposNoVacios && expresionesValidas
})

const isSaveEnabled = computed(() => isFormModifiedAndValid.value)

/*Función para limpiar los campos del dialogo luego del submit*/
const Reset = () => {
  refDialogoEdit.value.hide()
  TextNombre_vehiculo.value = ''
  TextCodigo_vehiculo.value = ''
  TextTasaDePeaje_vehiculo.value = ''
  TextNomenclador_vehiculo.value = ''

  // Resetea las copias también
  TextNombre_vehiculo_copy.value = ''
  TextCodigo_vehiculo_copy.value = ''
  TextTasaDePeaje_vehiculo_copy.value = ''
  TextNomenclador_vehiculo_copy.value = ''
}

const VentanaNomenclador = () => {
  alert('hi')
}

const dialogEdit = ref(false)
const backdropFilter = ref(null)

//V-model
const TextCodigo_vehiculo = ref('')
const TextNombre_vehiculo = ref('')
const TextTasaDePeaje_vehiculo = ref('')
const TextNomenclador_vehiculo = ref(null)

//V-model Copy
const TextCodigo_vehiculo_copy = ref('')
const TextNombre_vehiculo_copy = ref('')
const TextTasaDePeaje_vehiculo_copy = ref('')
const TextNomenclador_vehiculo_copy = ref(null)

//ref
const textNombre_vehiculo = ref(null)
const textCodigo_vehiculo = ref(null)
const textTasaDePeaje_vehiculo = ref(null)
const textnomenclador_vehiculo = ref(null)
const options = [1, 2, 3, 4]

const _id = ref('')

defineExpose({
  LevantarDialogoEdit,
})
</script>
