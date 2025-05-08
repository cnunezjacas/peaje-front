<template>
  <q-item clickable tag="a" target="_blank" :href="props.link">
    <q-item-section v-if="props.icon" avatar>
      <q-icon :name="props.icon" class="text-white" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-white text-bold">{{ props.title }}</q-item-label>
      <q-item-label class="text-green-4" caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },

  caption: {
    type: String,
    default: '',
  },

  link: {
    type: String,
    default: '#',
  },

  icon: {
    type: String,
    default: '',
  },
})
</script>

<script>
export default {
  data() {
    return {
      activador: false, // Valor inicial
    }
  },
  methods: {
    activarTab() {
      this.activador = true // Cambia a true cuando se hace clic en el primer tab
    },
    desactivarTab() {
      this.activador = false // Cambia a false cuando se hace clic en el segundo tab
    },
  },
}
</script>

<style>
.resaltado {
  background-color: yellow; /* Color resaltado para el tab activo */
}
</style>
