<template>
  <div class="text-uppercase small-font">
    <q-list padding class="rounded-borders text-white">
      <MenuItems
        v-for="(item, index) in menuItems"
        :key="index"
        :item="item"
        @item-clicked="handleItemClick"
      />
    </q-list>
    <gestGlobal ref="gestGlobalRef" style="display: none" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import gestGlobal from 'viewsManage/gest_global.vue'
import MenuItems from '../layouts/MenuItems.vue' // componente recursivo

// Props
defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
})

// Refs y hooks
const router = useRouter()
const route = useRoute()

const gestGlobalRef = ref(null)

// Estado de items expandidos (si quieres mantenerlo en la raíz)

// Función para manejar clic en item
const handleItemClick = (item) => {
  if (item.children && item.children.length) {
    gestGlobalRef.value.CheckItemFather(item)
    //toggleExpand(item)
  } else {
    gestGlobalRef.value.CheckItemChildren(route.path.split('/'))
    router.push('/' + item.id)
  }
}
</script>
