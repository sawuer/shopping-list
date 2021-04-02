<template>
  <v-container pt-5>
    <v-row>
      <v-col cols="3">
        <Lists/>
      </v-col>
      <v-col cols="9">
        <Goods/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Lists from './Lists';
import Goods from './Goods';

export default {
  name: 'ShoppingList',
  components: {
    Lists,
    Goods,
  }
}
</script>
