<template>
  <div class="">
    <q-dialog
      v-model="dialogDeleteOrganismo"
      persistent
      ref="refDialogoDeleteOrganismo"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
        <q-card-section class="row items-center text-white q-pb-none text-h6 bg-green-5 q-pa-md">
          <span class="icon-text q-mx-sm">
            <q-icon name="delete" />
          </span>
          <span class="icon-text">{{ STRINGS.deleteOrganismo.toUpperCase() }}</span>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-center">
            <div class="col-12 text-center">
              <q-icon name="help" color="green" size="3rem" />
            </div>
            <div class="col-12 text-center q-pt-md">
              <p>{{ STRINGS.PreguntaDeleteOrganismo }} {{ nombreAbrOrganismoDelete }} ?</p>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row flex justify-center">
            <div class="col-5">
              <q-btn
                icon="check"
                @click="Procesar_DeleteOrganismo"
                :label="STRINGS.access"
                color="green"
                size="18px"
              />
            </div>

            <div class="col-5">
              <q-btn
                flat
                icon="close"
                :label="STRINGS.cancel"
                color="dark"
                size="18px"
                v-close-popup
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>

  <table_Gest_provincia ref="Ref_table_Gest_provincia" style="display: none" />
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'
import table_Gest_provincia from '../tables/table_Gest_provincia.vue'
import api from 'src/axios.js'
import notify_success from 'src/utils/notify/notify_success.js'
import notify_error from 'src/utils/notify/notify_error.js'

/*import { useQuasar } from 'quasar'
var $q = useQuasar()*/

/**
 * Values for backdrop-filter are the same as in the CSS specs.
 * The following list is not an exhaustive one.
 */
const list = 'blur(4px) saturate(150%)'

const refDialogoDeleteOrganismo = ref(null)

const nombreAbrOrganismoDelete = ref('')
const idOrganismoDelete = ref('')

const emit = defineEmits(['ActualizarTablaOrganismo'])

/*Funcion de procesado de Datos*/
const Procesar_DeleteOrganismo = async () => {
  //TODO: Ajax Request DELETE ORGANISMO
  try {
    await api.delete(STRINGS.urlApiOrganismo + '/' + idOrganismoDelete.value) // DELETE /items/:id

    notify_success(STRINGS.organismoDeleteSuccess)

    emit('ActualizarTablaOrganismo', true)
  } catch (error) {
    console.error('Error al eliminar item:', error)
    notify_error(STRINGS.OrganismoDeleteError)
    emit('ActualizarTablaOrganismo', false)
  }
  refDialogoDeleteOrganismo.value.hide()
}

/*Función que levanta el dialogo*/
const LevantarDialogoDeleteOrganismo = (nombreAbr, id) => {
  backdropFilter.value = list
  dialogDeleteOrganismo.value = true
  nombreAbrOrganismoDelete.value = nombreAbr
  idOrganismoDelete.value = id
}

defineExpose({
  LevantarDialogoDeleteOrganismo,
})

const dialogDeleteOrganismo = ref(false)

const backdropFilter = ref(null)
const Ref_table_Gest_provincia = ref(null)
</script>
