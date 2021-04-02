<template>
  <div class="home">
    <ShoppingList />
  </div>
</template>

<script>
import ShoppingList from '@/components/ShoppingList.vue'

export default {
  name: 'Home',
  components: {
    ShoppingList
  }
}
</script>
