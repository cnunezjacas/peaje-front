<template>
  <q-page>
    <div>
      <div id="boxNom" class="col-12 d-none">
        <tabs_nomencladores ref="RefNom" />
      </div>
    </div>

    <div>
      <div id="boxEnt" class="col-12 d-none">
        <tabs_entity />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeUpdate, ref } from 'vue'

import tabs_nomencladores from 'viewsManage/tabs_generic/tabs_nomencladores.vue'
import tabs_entity from 'viewsManage/tabs_generic/tabs_entity.vue'
import { STRINGS } from 'src/utils/string'

//Const REF
const RefNom = ref(null)

// Ejemplo de uso:
const idBuscado = ref('')
const objeto = ref({})

const CheckItemFather = async (item) => {
  //console.log('CheckItemFather:' + JSON.stringify(item))
  if (item && item.children) {
    objeto.value = item
  }
}

// Cuando quieras llamar a la función:
const callEmptySelectedTwo = () => {
  // Espera a que Vue actualice el DOM y las referencias
  if (RefNom.value) {
    RefNom.value.EmptySelectedTwo()
  } else {
    console.warn('La referencia RefNom aún no está disponible')
  }
}

/*onMounted(() => {
  alert('onMounted')
})*/

onBeforeUpdate(() => {
  callEmptySelectedTwo()
})

const CheckItemChildren = async (item) => {
  console.log('RefNom')
  console.log(RefNom)
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
