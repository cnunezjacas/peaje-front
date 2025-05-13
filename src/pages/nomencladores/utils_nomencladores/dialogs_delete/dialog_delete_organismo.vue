<template>
  <div class="">
    <q-dialog
      v-model="dialogDeleteOrganismo"
      persistent
      ref="refDialogoDeleteOrganismo"
      :backdrop-filter="backdropFilter"
    >
      <q-card>
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

<!-- <q-alert color="positive" ref="Myalert" icon="check_circle" dense rounded class="q-mb-md">
¡Operación exitosa!
</q-alert> -->

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'
import table_Gest_provincia from '../tables/table_Gest_provincia.vue'
import api from 'src/axios.js'
import { Notify } from 'quasar'

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

    Notify.create({
      color: 'positive', // color verde para éxito
      icon: 'check_circle',
      message: STRINGS.organismoDeleteSuccess,
      position: 'top',
      timeout: 3000,
    })

    emit('ActualizarTablaOrganismo', true)
  } catch (error) {
    console.error('Error al eliminar item:', error)
    Notify.create({
      color: 'negative',
      icon: 'error',
      message: STRINGS.OrganismoDeleteError,
      position: 'bottom',
      timeout: 3000,
    })
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
