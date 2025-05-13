<template>
  <div class="">
    <q-toolbar :class="IsDisabledTabs" ref="TabsAddModelo">
      <!-- <q-btn flat label="Homepage" /> -->

      <!--
        notice shrink property since we are placing it
        as child of QToolbar
      -->

      <q-tabs v-model="tab" shrink bordered rounded-2>
        <q-tab name="tab1" icon="add" class="small-font" @click="AdicionarCamposModelo()"
          >Adicionar</q-tab
        >
        <q-tab name="tab3" icon="delete" class="small-font" @click="EliminarCamposModelo()"
          >Eliminar</q-tab
        >
      </q-tabs>
    </q-toolbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('')
const IsDisabledTabs = ref('bg-green-10 text-white shadow-2 disabled')

const SetIsTabsDisabled = (value) => {
  IsDisabledTabs.value = value
    ? 'bg-green-10 text-white shadow-2 disabled'
    : 'bg-green-10 text-white shadow-2'
}

const AdicionarCamposModelo = () => {
  alert('Adicionar Modelo')
}

const EliminarCamposModelo = () => {
  alert('Eliminar Modelo')
}

defineExpose({
  SetIsTabsDisabled,
})
</script>
