<template>
  <q-page>
    <!-- TODO: Poder realizar el v-show con ambos tabs -->
    <div>
      <div id="boxNom" class="col-12 d-none">
        <tabs_nomencladores />
      </div>
    </div>

    <!-- Table -->

    <div>
      <div id="boxEnt" class="col-12 d-none">
        <tabs_entity />
      </div>
    </div>

    <!-- Table -->
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

import tabs_nomencladores from 'viewsManage/tabs_generic/tabs_nomencladores.vue'
import tabs_entity from 'viewsManage/tabs_generic/tabs_entity.vue'
import { STRINGS } from 'src/utils/string'

//import { STRINGS } from 'src/utils/string'

//const showNomencladores = ref(true)
//const showNomAux = ref(false)
//const showEntAux = ref(false)

// Ejemplo de uso:
const idBuscado = ref('')
const objeto = ref({})

const CheckItemFather = async (item) => {
  //console.log('CheckItemFather:' + JSON.stringify(item))
  if (item && item.children) {
    objeto.value = item
  }
}

const CheckItemChildren = async (item) => {
  idBuscado.value = item[1]
  if (objeto.value && objeto.value.children) {
    // const aux = tieneHijoConId(objeto.value, idBuscado.value)
    var elementoOne, elementTwo
    switch (objeto.value.id) {
      case STRINGS.gestionNomencladoresLowercase:
        elementoOne = document.getElementById('boxNom')
        elementTwo = document.getElementById('boxEnt')

        elementTwo.classList.add('d-none')
        elementoOne.classList.remove('d-none')
        break

      case STRINGS.gestionEntidadLowercase:
        elementoOne = document.getElementById('boxNom')
        elementTwo = document.getElementById('boxEnt')

        elementoOne.classList.add('d-none')
        elementTwo.classList.remove('d-none')
        break
    }
  }
}

// Función para verificar si algún hijo tiene un id específico
/*const tieneHijoConId = (objeto, idBuscado) => {
  let aux = false
  if (!objeto.children || !Array.isArray(objeto.children)) {
    return false // No tiene hijos
  }

  //console.log(idBuscado)
  objeto.children.forEach((element) => {
    if (element.id === idBuscado) {
      aux = true
    }
  })

  return aux ? aux : false
}*/

defineExpose({
  CheckItemFather,
  CheckItemChildren,
})
</script>
