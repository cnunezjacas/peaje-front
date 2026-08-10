<template>
  <div class="text-uppercase text-xs text-bold" :class="textColorClass">
    <q-list class='rounded-borders' :class="textColorClass">
      <template v-for="(item, index) in menuItems" :key="item.id || index">

        <!-- 🔥 Renderizar separador -->
        <q-separator v-if="item.type === 'separator'" class="q-my-md bg-green-2" :class="separatorColorClass" />

        <!-- Renderizar item normal -->
        <MenuItems :nav-link-on="navLinkOn" :colorClass="textColorClass" v-else :item="item"
          @item-clicked="handleItemClick" />
      </template>
    </q-list>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MenuItems from 'layouts/MenuItems.vue' // componente recursivo

// Props
const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
  classColorText: {  // 👈 camelCase en JS (se usa kebab-case en template: class-color-text)
    type: String,
    default: 'text-dark'  // 👈 Valor por defecto
  },
  navLinkOn: {
    type: Boolean,
    default: false
  }
})

// Refs y hooks
const router = useRouter()
//const route = useRoute()

const ItemTab = ref({})


// 🔥 Computed para mapear el prop a clase de Quasar
const textColorClass = computed(() => {
  const map = {
    'dark': 'text-dark',
    'white': 'text-white',
    'red': 'text-red',      // 👈 Clases nativas de Quasar
    'blue': 'text-primary',
    'green': 'text-green',
    'grey': 'text-grey',
  }
  return map[props.classColorText] || props.classColorText || 'text-dark'
})

// 🔥 Color del separador (más sutil)
const separatorColorClass = computed(() => {
  const map = {
    'text-white': 'bg-white',
    'text-dark': 'bg-grey-3',
    'text-primary': 'bg-primary',
    'text-green': 'bg-green',
    'text-red': 'bg-red',
  }
  return map[textColorClass.value] || 'bg-grey-3'
})

// Estado de items expandidos (si quieres mantenerlo en la raíz)

// Función para manejar clic en item
const handleItemClick = async (item) => {
  if (item.children && item.children.length) {
    /*console.log('Soy Padre')
    gestGlobalRef.value.CheckItemFather(item)
    //toggleExpand(item)*/
  } else {
    ItemTab.value = item
    router.push('/' + item.id)
  }
}
</script>
