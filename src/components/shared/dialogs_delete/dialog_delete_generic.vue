<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="delete" />
          </span>
          <span class="icon-text">{{ STRINGS.delete.toUpperCase() }} - {{ CategoryItemDelete.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-center">

            <div class="col-12 text-center">
              <q-icon name="help" color="green" size="3rem" />
            </div>

            <div class="col-12 text-center q-pt-md">
              <p>{{ titleContent }} {{ CategoryItemDelete }}: {{ nameItemDelete != '' ? nameItemDelete :
                siglasItemDelete }} ?</p>
            </div>

            <div class="col-12 text-center no-margin no-padding" v-if="ShowChildNodesToDelete()">
              <p class="text-red small-font-bold">
                Puede perder elementos de otras tablas vinculados con este elemento.
              </p>
            </div>

          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-center">
            <div class="">
              <q-btn icon="check" @click="DeleteItem" :label="STRINGS.access" color="green"
                :size="STRINGS.SizeBottom" />
            </div>

            <div class="">
              <q-btn flat icon="close" :label="STRINGS.cancel" color="dark" :size="STRINGS.SizeBottom"
                @click="Reset()" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
//importaciones
import { ref } from 'vue'
import { STRINGS } from 'utils/string.js'
import imports from 'src/utils/imports.js'
import getNomenclator from 'src/utils/utils_axios/nomencladores/getNomenclator'
import { useApi } from 'composables/useApi.js'
import { useNotify } from 'src/utils/notify/notify.js'

/* =================================================== */
/*  ===== DECLARACIONES ===== */
/* =================================================== */
//  Inicializar el composable
const { deleteData } = useApi()
const { notify_success, /*notify_warning,*/ notify_error } = useNotify()

const emit = defineEmits(['ActualizarTabla'])

/*Funcion de procesado de Datos para ejecutar el eliminar elemento*/
const DeleteItem = async () => {
  var result;
  try {
    switch (AutenticCategoryItemDelete.value) {
      //Caso Provincia
      case STRINGS.provinciaLowercase:
        result = await deleteData(STRINGS.urlApiProvincia + '/' + idDelete.value) ? true : false
        break

      //Caso Municipio
      case STRINGS.municipioLowercase:
        result = await deleteData(STRINGS.urlApiMunicipio + '/' + idDelete.value) ? true : false
        break

      //Caso Organismo
      case STRINGS.organismoLowercase:
        result = await deleteData(STRINGS.urlApiOrganismo + '/' + idDelete.value) ? true : false
        break

      //Caso Banco
      case STRINGS.bancoLowercase:
        result = await deleteData(STRINGS.urlApiBanco + '/' + idDelete.value) ? true : false
        break

      //Caso Moneda
      case STRINGS.monedasLowercase:
        result = await deleteData(STRINGS.urlApiMoneda + '/' + idDelete.value) ? true : false
        break

      //Caso Vehiculo
      case STRINGS.vehiculosLowercase:
        result = await deleteData(STRINGS.urlApiVehiculo + '/' + idDelete.value) ? true : false
        break

      //Caso Exento
      case STRINGS.exentoLowercase:
        result = await deleteData(STRINGS.urlApiExento + '/' + idDelete.value) ? true : false
        break

      //Caso Comprobante
      case STRINGS.comprobanteLowercase:
        result = await deleteData(STRINGS.urlApiComprobante + '/' + idDelete.value) ? true : false
        break

      //Caso Forma de Pago
      case STRINGS.formaDePagoLowercaseURL:
        result = await deleteData(STRINGS.urlApiFormaDePago + '/' + idDelete.value) ? true : false
        break

      //Caso Tipo de Cuenta
      case STRINGS.tipoCuentaLowercaseURL:
        result = await deleteData(STRINGS.urlApiTipoCuenta + '/' + idDelete.value) ? true : false
        break

      /* $$ ENTIDADES $$ */
      case STRINGS.estacionesLowercase:
        result = await deleteData(STRINGS.urlApiEstacion + '/' + idDelete.value) ? true : false
        break
      /* $$ ENTIDADES $$ */
    }

    if (result) {
      notify_success(STRINGS.successDelete)
      emit('ActualizarTabla', true)
    } else {
      notify_error(STRINGS.errorDelete)
    }

  } catch (error) {
    console.error('Error al eliminar item:', error)
    notify_error(STRINGS.errorDelete)
  }
  Reset()
}

/*Función que levanta el dialogo*/
const getUpDialogDelete = async (nombre, id, siglas, path) => {

  if (!siglas) {
    siglasItemDelete.value = ''
    nameItemDelete.value = nombre
  } else {
    nameItemDelete.value = ''
    siglasItemDelete.value = siglas
  }

  idDelete.value = id
  Ruta.value = path
  CategoryItemDelete.value = Ruta.value[1]
  AutenticCategoryItemDelete.value = Ruta.value[1]

  CategoryItemDelete.value = imports.JoinCamelCase(CategoryItemDelete.value)

  //identificar si la ruta es una cadena femenina o masculina
  var gestFemale = imports.getGestFemale()
  if (gestFemale.includes(CategoryItemDelete.value.toUpperCase())) {
    titleContent.value = STRINGS.PreguntaDeleteFemenino
  } else {
    titleContent.value = STRINGS.PreguntaDeleteMasculino
  }

  await SearchChildNodesToDelete()
  ShowChildNodesToDelete()
  //Se levanta el dialogo
  backdropFilter.value = list
  dialog.value = true
}

/* Busca si el elemnto a borrar presenta relación de datos con otras tablas */
const SearchChildNodesToDelete = async () => {
  switch (AutenticCategoryItemDelete.value) {
    //Caso Provincia
    case STRINGS.provinciaLowercase:
      var provinciaObjet = { label: nameItemDelete.value, value: idDelete.value }
      elementChildrenDelete.value = await getNomenclator.loadMunicipiosByProvincia(
        provinciaObjet,
        false,
      )
      break
  }
}

/* Muestra si el elemnto a borrar presenta relación de datos con otras tablas  */
const ShowChildNodesToDelete = () => {
  return elementChildrenDelete.value.length > 0 ? true : false
}

/* Función encargada de cerrar el dialogo */
const Reset = () => {
  dialog.value = false
}

/* Referencias del dialogo */
const list = STRINGS.OpacityDialog
const dialog = ref(false)
const backdropFilter = ref(null)

/* v-model */
const nameItemDelete = ref('')
const idDelete = ref('')
const siglasItemDelete = ref('')
const Ruta = ref([])
const titleContent = ref('')
const CategoryItemDelete = ref('')
const AutenticCategoryItemDelete = ref('')
const elementChildrenDelete = ref([])

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogDelete,
})
</script>
