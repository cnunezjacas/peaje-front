<template>
  <div class="q-pb-sm">
    <q-toolbar class="bg-green-10 text-white shadow-2">
      <!-- <q-btn flat label="Homepage" /> -->

      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->

      <q-tabs v-model="tab" shrink bordered>
        <q-tab name="tab1" icon="add" class="small-font" @click="onItemClick('Add')"
          >Adicionar</q-tab
        >
        <q-tab name="tab2" icon="edit" :class="disabledEdit" @click="onItemClick('Edit')"
          >Modificar</q-tab
        >
        <q-tab name="tab3" icon="delete" :class="disabledDelete" @click="onItemClick('Delete')"
          >Eliminar</q-tab
        >
        <q-tab name="tab4" icon="save" :class="disabledGuardar" @click="onItemClick('Save')"
          >Guardar</q-tab
        >
        <q-tab name="tab6" icon="picture_as_pdf" class="small-font" @click="onItemClick('Export')"
          >Exportar</q-tab
        >
        <q-tab
          name="tab7"
          icon="receipt_long"
          :class="disabledDetalle"
          @click="onItemClick('Details')"
          >Detalle</q-tab
        >
      </q-tabs>

      <q-space></q-space>

      <!-- Input de busqueda -->
      <div class="q-mx-auto">
        <q-input
          color="white"
          input-class="text-white"
          v-model="TextSearch"
          label-color="white"
          :label="STRINGS.search"
          style="max-width: 200px"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="white" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="TextSearch"
              name="cleaning_services"
              class="cursor-pointer"
              @click="resetSearch"
              color="white"
            />
          </template>
        </q-input>
      </div>
      <!-- Input de busqueda -->
    </q-toolbar>
  </div>

  <!-- Dialogo Add Provincia-->
  <DialogoAddProvincia ref="dialogoAddProvincia" />

  <!-- Dialogo Add Municipio-->
  <DialogoAddMunicipio ref="dialogoAddMunicipio" />

  <!-- Dialogo Add Organismo-->
  <DialogoAddOrganismo ref="dialogoAddOrganismo" />

  <!-- Dialogo Edit Provincia -->
  <DialogEditProvincia ref="dialogoEditProvincia" />

  <!-- Dialogo Edit Municipio -->
  <DialogEditMunicipio ref="dialogoEditMunicipio" />

  <!-- Dialogo Edit Municipio -->
  <DialogEditOrganismo ref="dialogEditOrganismo" />

  <!-- Dialogo Delete Provincia-->
  <DialogDeleteProvincia ref="dialogoDeleteProvincia" />

  <!-- Dialogo Delete Municipio-->
  <DialogDeleteMunicipio ref="dialogoDeleteMunicipio" />

  <!-- Dialogo Delete Municipio-->
  <DialogDeleteOrganismo ref="dialogDeleteOrganismo" />

  <table_Gest_provincia
    ref="tableAddProvincia"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    @onBloquearGuardar="BloquearGuardar"
    @oNnameProvinciaDelete="CapturanameProvinciaDelete"
    @oNcodigoProvinciaDelete="CapturaCodigoProvinciaDelete"
    @oNProvinciaDeleteGestProvincia="ProcesoDeleteProvincia"
    :style="StyleFocusP"
    :TextSearch="TextSearch"
    :rows="rows"
  ></table_Gest_provincia>

  <table_Gest_municipio
    ref="tableAddMunicipio"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    @onBloquearGuardar="BloquearGuardar"
    @oNMunicipioDeleteGestMunicipio="ProcesoDeleteMunicipio"
    :style="StyleFocusM"
    :TextSearch="TextSearch"
  />

  <table_Gest_organismo
    ref="tableAddOrganismo"
    @seleccionado="handleSelection"
    @onBloquearEdit="BloquearEdit"
    @onBloquearDelete="BloquearDelete"
    @onBloquearDetalle="BloquearDetalle"
    @onBloquearGuardar="BloquearGuardar"
    :style="StyleFocusO"
    :TextSearch="TextSearch"
  />
</template>

<script setup>
import { ref } from 'vue'
import { STRINGS } from '../../../../utils/string.js'

//Dialogs Add
import DialogoAddProvincia from '../dialogs_insert/dialogoAddProvincia.vue'
import DialogoAddMunicipio from '../dialogs_insert/dialogoAddMunicipio.vue'
import DialogoAddOrganismo from '../dialogs_insert/dialogoAddOrganismo.vue'

//Dialogs Edit
import DialogEditProvincia from '../dialogs_edit/dialog_edit_provincia.vue'
import DialogEditMunicipio from '../dialogs_edit/dialog_edit_municipio.vue'
import DialogEditOrganismo from '../dialogs_edit/dialog_edit_organismo.vue'

//Dialogs Delete
import DialogDeleteProvincia from '../dialogs_delete/dialog_delete_provincia.vue'
import DialogDeleteMunicipio from '../dialogs_delete/dialog_delete_municipio.vue'
import DialogDeleteOrganismo from '../dialogs_delete/dialog_delete_organismo.vue'

//Tables
import table_Gest_provincia from '../tables/table_Gest_provincia.vue'
import table_Gest_municipio from '../tables/table_Gest_municipio.vue'
import table_Gest_organismo from '../tables/table_Gest_organismo.vue'

import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tab = ref('')
const TextSearch = ref('')

const StyleFocusP = ref('display: none')
const StyleFocusM = ref('display: none')
const StyleFocusO = ref('display: none')

//Constantes referencias de los dialogos Provincia
const dialogoAddProvincia = ref(null)
const dialogoEditProvincia = ref(null)
const dialogoDeleteProvincia = ref(null)

//Constantes referencias de los dialogos Municipio
const dialogoAddMunicipio = ref(null)
const dialogoEditMunicipio = ref(null)
const dialogoDeleteMunicipio = ref(null)

//Constantes referencias de los dialogos Organismo
const dialogoAddOrganismo = ref(null)
const dialogEditOrganismo = ref(null)
const dialogDeleteOrganismo = ref(null)

const nameProvinciaDelete = ref('')
const codigoProvinciaDelete = ref('')

const tableAddProvincia = ref(null)
const tableAddMunicipio = ref(null)
const tableAddOrganismo = ref(null)

var arrayProvinceSelected = ref([])
var arrayMunicipioSelected = ref([])
var arrayOrganismoSelected = ref([])

//Variables a evaluar clases de tabsBotton
const disabledEdit = ref('small-font disabled')
const disabledDelete = ref('small-font disabled')
const disabledDetalle = ref('small-font disabled')
const disabledGuardar = ref('small-font disabled')

const handleSelection = (row) => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  if (nuevaRuta.includes(STRINGS.provinciaLowercase) && row) {
    arrayProvinceSelected.value['name'] = row['name']
    arrayProvinceSelected.value['codigo'] = row['codigo']
  } else if (nuevaRuta.includes(STRINGS.municipioLowercase) && row) {
    arrayMunicipioSelected.value['name'] = row['name']
    arrayMunicipioSelected.value['codigo'] = row['codigo']
    arrayMunicipioSelected.value['provincia'] = row['provincia']
  } else if (nuevaRuta.includes(STRINGS.organismoLowercase) && row) {
    arrayOrganismoSelected.value['name_min'] = row['name_min']
    arrayOrganismoSelected.value['name'] = row['name']
  } else {
    console.log('No hay fila seleccionada')
  }
}

const BloquearEdit = (variable) => {
  if (variable) {
    disabledEdit.value = 'small-font disabled'
  } else {
    disabledEdit.value = 'small-font'
  }
}

const BloquearDelete = (variable) => {
  if (variable) {
    disabledDelete.value = 'small-font disabled'
  } else {
    disabledDelete.value = 'small-font'
  }
}

const BloquearDetalle = (variable) => {
  if (variable) {
    disabledDetalle.value = 'small-font disabled'
  } else {
    disabledDetalle.value = 'small-font'
  }
}

const BloquearGuardar = (variable) => {
  if (variable) {
    disabledGuardar.value = 'small-font disabled'
  } else {
    disabledGuardar.value = 'small-font'
  }
}

const CapturanameProvinciaDelete = (nombre) => {
  if (nombre != '') {
    nameProvinciaDelete.value = nombre
  }
}

const CapturaCodigoProvinciaDelete = (codigo) => {
  if (codigo != '') {
    codigoProvinciaDelete.value = codigo
  }
}

const ProcesoDeleteProvincia = (codigo) => {
  //if (codigo != '')
  console.log('ProcesoDeleteProvincia: ' + codigo)
}

const CambioRuta = () => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
    StyleFocusP.value = ''
    StyleFocusM.value = 'display: none'
    StyleFocusO.value = 'display: none'
  } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
    StyleFocusP.value = 'display: none'
    StyleFocusM.value = ''
    StyleFocusO.value = 'display: none'
  } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
    StyleFocusP.value = 'display: none'
    StyleFocusM.value = 'display: none'
    StyleFocusO.value = ''
  }
}

watchEffect(() => {
  CambioRuta()
})

const onItemClick = (value) => {
  var ruta = route.fullPath
  var nuevaRuta = ruta.split('_')
  switch (value) {
    case 'Add':
      if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
        dialogoAddProvincia.value.LevantarDialogo()
      } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
        dialogoAddMunicipio.value.LevantarDialogoAddMunicipio()
      } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
        dialogoAddOrganismo.value.LevantarDialogoAddOrganismo()
      }
      break
    case 'Edit':
      if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arrayProvinceSelected.value != null)
            //console.log('Antes de enviar arrayProvinceSelected: ' + arrayProvinceSelected.value)
            dialogoEditProvincia.value.LevantarDialogoEditProvincia(
              arrayProvinceSelected.value['name'],
              arrayProvinceSelected.value['codigo'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arrayMunicipioSelected.value != null)
            dialogoEditMunicipio.value.LevantarDialogoEditMunicipio(
              arrayMunicipioSelected.value['name'],
              arrayMunicipioSelected.value['codigo'],
              arrayMunicipioSelected.value['provincia'],
            )
        }
      } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
        if (!disabledEdit.value.includes(STRINGS.desabilitar)) {
          if (arrayOrganismoSelected.value != null)
            dialogEditOrganismo.value.LevantarDialogoEditOrganismo(
              arrayOrganismoSelected.value['name_min'],
              arrayOrganismoSelected.value['name'],
            )
        }
      }

      break
    case 'Delete':
      if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogoDeleteProvincia.value.LevantarDialogoDeleteProvincia(
            nameProvinciaDelete.value,
            codigoProvinciaDelete.value,
          )
        }
      } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogoDeleteMunicipio.value.LevantarDialogoDeleteMunicipio(
            arrayMunicipioSelected.value['name'],
            arrayMunicipioSelected.value['codigo'],
            arrayMunicipioSelected.value['provincia'],
          )
        }
      } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
        if (!disabledDelete.value.includes(STRINGS.desabilitar)) {
          dialogDeleteOrganismo.value.LevantarDialogoDeleteOrganismo(
            arrayOrganismoSelected.value['name_min'],
            null,
          )
        }
      }

      break
    case 'Save':
      if (!disabledGuardar.value.includes(STRINGS.desabilitar)) {
        alert('TODO: Guardar')
      }
      break
    case 'Export':
      break
    case 'Details':
      if (!disabledDetalle.value.includes(STRINGS.desabilitar)) {
        alert('TODO: Detalles')
      }
      break

    default:
      break
  }
}

const resetSearch = () => {
  TextSearch.value = ''
}

// const UpdateSearch = () => {
//   var ruta = route.fullPath
//   var nuevaRuta = ruta.split('_')
//   if (nuevaRuta.includes(STRINGS.provinciaLowercase)) {
//     //tableAddProvincia.value.SearchRow(TextSearch.value)
//   } else if (nuevaRuta.includes(STRINGS.municipioLowercase)) {
//     alert('Buscando Municipios.. : ' + TextSearch.value)
//   } else if (nuevaRuta.includes(STRINGS.organismoLowercase)) {
//     alert('Buscando Organismos.. : ' + TextSearch.value)
//   }
// }
</script>
