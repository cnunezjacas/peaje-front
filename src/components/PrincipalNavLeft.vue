<template>
  <gestGlobal ref="gestGlobalRef" style="display: none" />
  <div class="text-uppercase small-font">
    <q-list padding class="rounded-borders text-white">
      <MenuItems
        v-for="(item, index) in menuItems"
        :key="index"
        :item="item"
        @item-clicked="handleItemClick"
      />
    </q-list>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import gestGlobal from 'viewsManage/gest_global.vue'
import MenuItems from 'layouts/MenuItems.vue' // componente recursivo

// Props
defineProps({
  menuItems: {
    type: Array,
    required: true,
  },
})

// Refs y hooks
const router = useRouter()
//const route = useRoute()

const gestGlobalRef = ref(null)
const ItemTab = ref({})

// Estado de items expandidos (si quieres mantenerlo en la raíz)

// Función para manejar clic en item
const handleItemClick = async (item) => {
  if (item.children && item.children.length) {
    /*console.log('Soy Padre')
    gestGlobalRef.value.CheckItemFather(item)
    //toggleExpand(item)*/
  } else {
    //ItemTab.value = item
    ItemTab.value = item
    await gestGlobalRef.value.CheckItemChildren(item)
    router.push('/' + item.id)
  }
}
</script>
