<template>
  <q-page>
    <div>
      <div id="boxNom" ref="RefBoxNom" class="col-12 d-none">
        <tabs_nomencladores ref="RefNom" />
      </div>
    </div>

    <div>
      <div id="boxEnt" ref="RefBoxEnt" class="col-12 d-none">
        <tabs_entity />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeUpdate, ref, nextTick } from 'vue'

import tabs_nomencladores from 'viewsManage/tabs_generic/tabs_nomencladores.vue'
import tabs_entity from 'viewsManage/tabs_generic/tabs_entity.vue'
import { STRINGS } from 'src/utils/string'

//Const REF
const RefNom = ref(null)
const RefBoxNom = ref(null)
const RefBoxEnt = ref(null)

// Cuando quieras llamar a la función:
const callEmptySelectedTwo = () => {
  // Espera a que Vue actualice el DOM y las referencias
  if (RefNom.value) {
    RefNom.value.EmptySelectedTwo()
  } else {
    console.warn('La referencia RefNom aún no está disponible')
  }
}

const isActiveTabsNomenclator = ref(null)
const isActiveTabsEntity = ref(null)

onBeforeUpdate(() => {
  callEmptySelectedTwo()
})

const objeto = ref({})

const CheckItemChildren = async (item) => {
  await nextTick()
  objeto.value = item

  if (item.length !== 0) {
    // const aux = tieneHijoConId(objeto.value, idBuscado.value)
    isActiveTabsNomenclator.value = document.getElementById('boxNom')
    isActiveTabsEntity.value = document.getElementById('boxEnt')

    // Verificar que existan
    if (isActiveTabsNomenclator.value === null || isActiveTabsEntity.value === null) {
      console.warn('Elementos DOM no disponibles en este momento')
    }

    switch (item.idPadre) {
      case STRINGS.gestionNomencladoresLowercase:
        if (isActiveTabsNomenclator.value) {
          isActiveTabsNomenclator.value.classList.remove('d-none')
        }
        if (isActiveTabsEntity.value) {
          isActiveTabsEntity.value.classList.add('d-none')
        }
        break
      case STRINGS.gestionEntidadLowercase:
        if (isActiveTabsNomenclator.value) {
          isActiveTabsNomenclator.value.classList.add('d-none')
        }
        if (isActiveTabsEntity.value) {
          isActiveTabsEntity.value.classList.remove('d-none')
        }
        break
    }
  }
}

defineExpose({
  CheckItemChildren,
})
</script>
