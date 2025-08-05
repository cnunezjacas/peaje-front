<template>
  <q-page>
    <div>
      <tabs_generic ref="RefGen" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onBeforeUpdate, onMounted } from 'vue'

import tabs_generic from 'src/pages/manage/tabs_generic/tabs_generic.vue'
///import { notify_error } from 'src/utils/import_files_nomenclador'
//import { notify_error } from 'src/utils/import_files_nomenclador'
/* import tabs_entity from 'viewsManage/tabs_generic/tabs_entity.vue' */

//Const REF
const RefGen = ref(null)
const domLoad = ref(false)

// Cuando quieras llamar a la función:
const callEmptySelected = () => {
  if (RefGen.value) {
    RefGen.value.EmptySelected()
  } else {
    // Opcional: reintenta después de un pequeño retraso
    setTimeout(() => {
      if (RefGen.value) {
        RefGen.value.EmptySelected()
      } else {
        console.warn('La referencia RefGen aún no está disponible')
      }
    }, 3000)
  }
}

onBeforeUpdate(() => {
  callEmptySelected()
  //SendItemChildren(objetLoad.value)
})

onMounted(() => {
  LoadDOM()
})

const LoadDOM = () => {
  domLoad.value = true
}

const objetLoad = ref({})

// Función que deseas llamar desde fuera
const CheckItemChildren = async (item = null) => {
  if (item.idPadre !== '') {
    objetLoad.value = item
  }
}

/* const SendItemChildren = async (item) => {
  console.log('RefGen.value')
  console.log(RefGen.value)
  if (RefGen.value && typeof RefGen.value.BoxSelected === 'function') {
    // Llamar a la función del componente hijo
    RefGen.value.BoxSelected(item)
  } else {
    // Opcional: manejar el caso en que aún no está listo
    console.warn('El método BoxSelected no está disponible en el componente hijo.')
  }
} */

defineExpose({
  CheckItemChildren,
})
</script>
