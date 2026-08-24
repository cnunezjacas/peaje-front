<template>
  <div class="">
    <q-dialog v-model="dialog" persistent :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="delete" />
          </span>
          <span class="icon-text"
            >{{ STRINGS.delete.toUpperCase() }} - {{ CategoryItemDelete.toUpperCase() }}</span
          >
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-center">
            <div class="col-12 text-center">
              <q-icon name="help" color="green" size="3rem" />
            </div>

            <div class="col-12 text-center q-pt-md">
              <!-- OPTIMIZACIÓN: Como UtilsDelete ya devuelve el texto correcto, 
                   ya no necesitamos el fallback a siglasItemDelete -->
              <p>{{ titleContent }} {{ CategoryItemDelete }}: {{ nameItemDelete }} ?</p>
            </div>

            <div class="col-12 text-center no-margin no-padding" v-if="ShowIfChildNodesToDelete">
              <p class="text-red">
                Elementos de otras tablas pueden quedar afectados a causa de esta eliminación.
              </p>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="flex justify-center">
            <div class="">
              <q-btn
                icon="check"
                @click="DeleteItem"
                :label="STRINGS.access"
                color="green"
                :size="STRINGS.SizeBottom"
              />
            </div>

            <div class="">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.cancel"
                color="dark"
                :size="STRINGS.SizeBottom"
                @click="Reset()"
              />
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
import { UtilsDelete } from 'src/utils/UtilsDelete'

/* =================================================== */
/*  ===== DECLARACIONES Y COMPOSABLES ===== */
/* =================================================== */
const { deleteData } = useApi()
const { notify_success, notify_error } = useNotify()

const emit = defineEmits(['ActualizarTabla'])

/**
 * Mapeo de categorías a URLs de la API
 * Agregar nuevos módulos es tan simple como agregar una línea aquí
 */
const API_URL_MAP = {
  //NOMENCLADORES
  [STRINGS.provinciaLowercase]: STRINGS.urlApiProvincia,
  [STRINGS.municipioLowercase]: STRINGS.urlApiMunicipio,
  [STRINGS.organismoLowercase]: STRINGS.urlApiOrganismo,
  [STRINGS.bancoLowercase]: STRINGS.urlApiBanco,
  [STRINGS.monedasLowercase]: STRINGS.urlApiMoneda,
  [STRINGS.vehiculosLowercase]: STRINGS.urlApiVehiculo,
  [STRINGS.exentoLowercase]: STRINGS.urlApiExento,
  [STRINGS.comprobanteLowercase]: STRINGS.urlApiComprobante,
  [STRINGS.formaDePagoLowercaseURL]: STRINGS.urlApiFormaDePago,
  [STRINGS.tipoCuentaLowercaseURL]: STRINGS.urlApiTipoCuenta,
  //ESTACIONES
  [STRINGS.estacionesLowercase]: STRINGS.urlApiEstacion,
  [STRINGS.cuentaLowercase]: STRINGS.urlApiCuenta,
}

/**
 * Ejecuta la eliminación del elemento en la base de datos según su categoría
 * Emite el evento 'ActualizarTabla' para refrescar la vista tras la operación
 */
const DeleteItem = async () => {
  try {
    const url = API_URL_MAP[AutenticCategoryItemDelete.value]

    if (!url) {
      notify_error('Módulo no soportado para eliminación')
      return Reset()
    }

    const { data, error } = await deleteData(`${url}/${idDelete.value}`)

    if (data && !error) {
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

/**
 * Prepara y muestra el diálogo de confirmación de eliminación
 * @param {Object} row - Objeto completo de la fila seleccionada en la tabla
 * @param {Array|string} path - Ruta actual o array con segmentos de la URL
 */
const getUpDialogDelete = async (row, path) => {
  // Extraer ID y segmentos de ruta
  idDelete.value = row._id
  Ruta.value = path
  CategoryItemDelete.value = Ruta.value[1]
  AutenticCategoryItemDelete.value = Ruta.value[1]

  //Se toma el objeto 'row' para cualquier uso en el resto de funciones
  rows.value = row

  // Usar utilidad para extraer dinámicamente el nombre o siglas a mostrar según la categoría
  nameItemDelete.value = UtilsDelete(CategoryItemDelete.value, row)

  // Formatear el nombre de la categoría para mostrar en el título (ej: 'provincia' -> 'Provincia')
  CategoryItemDelete.value = imports.JoinCamelCase(CategoryItemDelete.value)

  // Determinar artículo femenino o masculino para la pregunta de confirmación
  const gestFemale = imports.getGestFemale()
  titleContent.value = gestFemale.includes(CategoryItemDelete.value.toUpperCase())
    ? STRINGS.PreguntaDeleteFemenino
    : STRINGS.PreguntaDeleteMasculino

  // Buscar elementos hijos relacionados que podrían verse afectados
  ShowIfChildNodesToDelete.value = await SearchChildNodesToDelete()

  // Mostrar el diálogo
  backdropFilter.value = list
  dialog.value = true
}

/**
 * Busca elementos hijos relacionados con el elemento a eliminar
 * Advierte al usuario sobre posibles eliminaciones en cascada
 */
const SearchChildNodesToDelete = async () => {
  /*   console.log('rows.value : SearchChildNodesToDelete')
  console.log(rows.value) */

  switch (AutenticCategoryItemDelete.value) {
    //Caso Provincia
    case STRINGS.provinciaLowercase:
      var provinciaObjet = { label: nameItemDelete.value, value: idDelete.value }

      elementChildrenDelete.value = await getNomenclator.loadMunicipiosByProvincia(
        provinciaObjet,
        false,
      )
      return elementChildrenDelete.value
    // TODO: Agregar casos para otras entidades que tengan relaciones (ej: Banco -> Cuentas)
  }
}

/**
 * Cierra el diálogo y limpia el estado
 */
const Reset = () => {
  dialog.value = false
}

/* =================================================== */
/*  ===== VARIABLES REACTIVAS (REFS) ===== */
/* =================================================== */

/* Referencias del dialogo */
const list = STRINGS.OpacityDialog
const dialog = ref(false)
const backdropFilter = ref(null)

/* v-model */
const nameItemDelete = ref('')
const idDelete = ref('')
const Ruta = ref([])
const titleContent = ref('')
const CategoryItemDelete = ref('')
const AutenticCategoryItemDelete = ref('')
const elementChildrenDelete = ref([])
const rows = ref({})
const ShowIfChildNodesToDelete = ref(false)

/* Método para exponer funciones al componente Padre */
defineExpose({
  getUpDialogDelete,
})
</script>
